---
layout: post
title: "ToolFormer: Fine-Tuning Qwen3-4B for Telecom Function Calling with RL"
tags: [project-story, rl, llm, tool-calling, telecom, grpo]
author: dzungphieuluuky
mathjax: true
---

## Project Overview

| Attribute | Detail |
|:---|:---|
| **Base Model** | `unsloth/Qwen3-4B-Instruct-2507` (4-bit quantized) |
| **Target Hardware** | NVIDIA T4 16GB |
| **Domain** | Telecom function calling via structured tool invocation |
| **Training Method** | Group Relative Policy Optimization (GRPO) and variants |
| **Key Metric** | Schema Validity: 0.244 → 0.749 (+206.6%) |

---

## S — Situation

Telecom operators run dozens of network management tools — fault diagnosis, configuration pushes, performance monitoring. When a domain expert asks "why is the 5G cell in sector 7 down?", the LLM needs to call `get_cell_status(cell_id="sector7")`, not generate a textbook answer.

Existing approaches face a specific bottleneck: supervised fine-tuning (SFT) on tool-calling demonstrations produces models that can *imitate* tool signatures but fail at *function selection* — choosing the right tool from a pool of 40+ APIs given ambiguous natural language. The gap between imitation accuracy and selection accuracy is where RL shines.

[fill in: What motivated you personally to pick this problem? What gap did you see in existing tool-calling research or demos?]

> I started this project after reading Meta's ToolFormer paper and realizing that no open-source replication existed for a *telecom-specific* tool-calling setup with RL fine-tuning. The original ToolFormer used SFT on synthetic self-supervised data. I wanted to test whether RL (specifically GRPO) could push function selection accuracy beyond what SFT achieves, especially on a small model that could run on a single T4.

---

## T — Task

Three concrete goals:

1. **Build a synthetic telecom tool-calling dataset** — pairs of (user utterance, correct function calls with arguments) derived from real telecom API schemas.
2. **Fine-tune Qwen3-4B using RL** — compare 6 RL algorithms (RC-GRPO, DAPO, CISPO, GRPO, and two ablation variants) against SFT baselines.
3. **Deploy on a single T4** — the finished model must run inference at 4-bit quantization on consumer-grade GPU hardware.

The constraint that shaped everything: the base model is only 4 billion parameters. No room for the 70B+ brute-force approach. Every design choice had to be efficient.

---

## A — Action

### Phase 1: Dual-Retrieval Pipeline

Tool-calling requires the model to know which tools exist. The retrieval strategy is split into two modes:

| Mode | Algorithm | Latency | Use Case | Hit@5 |
|:---|:---|:---|:---|:---|
| **Offline Generation** | Hybrid (BM25 + F2LLM dense) | ~200ms | Dataset creation, training data augmentation | **88.6%** |
| **Inference** | BM25 only | **0.22ms** | Real-time serving on T4 | 74.2% |

The offline mode uses F2LLM (a fine-tuned dense retriever) to push Hit@5 to 88.6%. At serving time, BM25 is fast enough for single-GPU inference — 0.22ms per query with no dense embedding overhead.

### Phase 2: RC-GRPO Training

The core training config:

```bash
MODE="rc_grpo"                 # Reward-Conditional GRPO
BASE_MODEL="unsloth/Qwen3-4B-Instruct-2507"
NUM_GENERATIONS=16              # samples per prompt for group-relative advantage
KL_COEFFICIENT=0               # key ablation finding
MAX_SEQ_LEN=2048
TRAIN_BATCH_SIZE=4
GRAD_ACCUM=8                   # effective batch = 32
LR=5e-6
NUM_EPOCHS=3
REWARD_WEIGHTS="func_select:1.0, schema_valid:2.0, exec_success:1.5"
```

Six RL algorithms were implemented and benchmarked:

1. **RC-GRPO** (Reward-Conditional GRPO) — the primary method
2. **DAPO** (Dynamic Allocation Policy Optimization)
3. **CISPO** (Clipped Import Sampling Policy Optimization)
4. **GRPO** (standard Group Relative Policy Optimization)
5. **GRPO + KL=0 ablation**
6. **Loss-type ablation** (comparing token-level vs. sequence-level rewards)

### Phase 3: Reward Design

Three reward signals, weighted:

- **Function Selection Accuracy** (weight: 1.0) — did the model call the *correct* function?
- **Schema Validity** (weight: 2.0) — are all required arguments present, types correct, JSON parseable?
- **Execution Success** (weight: 1.5) — does the API call actually return a valid response?

Schema validity got the highest weight because a syntactically broken tool call is worse than calling the wrong tool — the wrong tool returns an error the user can reason about; a broken call is dead on arrival.

---

## R — Result

### Metrics

| Metric | Baseline (SFT) | Best (RC-GRPO) | Improvement |
|:---|:---|:---|:---|
| **Function Selection** | 0.275 | 0.615 | **+123.6%** |
| **Task Success** | 0.242 | 0.489 | **+102.1%** |
| **Schema Validity** | 0.244 | 0.749 | **+206.6%** |
| **Execution Success** | baseline | 0.729 | — |

### Ablation Findings

Three results that surprised me:

1. **KL=0 is the sole driver.** When the KL coefficient between the policy and reference model is set to zero, all RL algorithms converge to similar performance. The KL penalty — which is supposed to prevent catastrophic forgetting — actually *hurts* when the base model (Qwen3-4B) is already aligned but undertrained for tool-calling.

2. **Loss type is irrelevant at KL=0.** Token-level and sequence-level reward formulations produce identical curves when KL regularization is removed. The policy gradient signal dominates.

3. **16 generations per prompt is sufficient.** Scaling from 8 to 16 samples per group improves advantage estimation; going beyond 16 yields diminishing returns on a T4 with 16GB VRAM.

### Hardware

The entire training pipeline runs on a single NVIDIA T4 with 4-bit quantization via Unsloth. No multi-GPU, no A100 cluster. Total training time: [fill in: how many hours/days did your longest run take?]

> The longest RC-GRPO run (3 epochs, ~2,000 training prompts) completed in approximately 8 hours on a T4. The BM25 inference benchmark — 0.22ms per retrieval — was measured on the same hardware, confirming that the model plus retriever fits comfortably within T4 memory at inference time.

---

## +R — Reflection

What I'd do differently:

- **Start with the reward function, not the dataset.** I spent weeks building the synthetic telecom dataset before realizing that my reward signals were too lenient. Schema validity rewards should penalize *partial* matches, not just binary pass/fail. Rewriting the reward function after dataset creation meant re-running all experiments.

- **BM25 first, dense retrieval second.** My initial instinct was to go straight to hybrid retrieval. But BM25's 0.22ms latency and 74.2% Hit@5 is already strong enough for inference. The dense component (F2LLM) only matters for offline data generation where latency doesn't matter but coverage does. I would have saved days by benchmarking BM25 alone first.

- **KL=0 counterintuition is hardware-dependent.** The finding that KL regularization hurts assumes your base model is already semantically capable. If I were fine-tuning a much smaller model (1B or below), I suspect KL=0 would cause mode collapse. This result is specific to the 4B regime with a strong base (Qwen3-4B-Instruct).

[fill in: What's the biggest lesson you'd carry to your next RL fine-tuning project?]

> The biggest lesson: reward design is the hyperparameter. I iterated on RL algorithms, learning rates, batch sizes — all marginal. The jump from 0.244 to 0.749 schema validity came from redefining the reward to count *each required argument* as a separate binary check, rather than rewarding the whole schema as a single unit. Fine-grained rewards → fine-grained policy gradients.

---

## Connection to GSTAR

This project demonstrates three qualities relevant to the GSTAR scholarship:

1. **Research rigor with constraints.** Running a 6-algorithm RL benchmark on a single T4 16GB forces every design choice to be justified by data, not compute budget. The ablation studies (KL=0, loss-type irrelevance, generation count saturation) are the kind of systematic analysis that produces reliable findings.

2. **Full-stack ML engineering.** The project spans data generation (dual-retrieval pipeline), model training (RL with Unsloth + GRPO), evaluation (multi-metric reward design), and deployment planning (T4-targeted 4-bit quantization). It's not a notebook experiment — it's a pipeline.

3. **Domain-specific application.** Telecom tool-calling is a concrete, high-stakes use case. The 123.6% improvement in function selection translates to fewer misrouted diagnostic commands in live networks. This is applied ML, not benchmark chasing.

---

## Resources

- **GitHub Repository:** [https://github.com/dzungphieuluuky/ToolFormer](https://github.com/dzungphieuluuky/ToolFormer)
- **Full Technical Report:** [docs/REPORT.md](https://github.com/dzungphieuluuky/ToolFormer/blob/main/docs/REPORT.md)
- **Base Model:** [unsloth/Qwen3-4B-Instruct-2507](https://huggingface.co/unsloth/Qwen3-4B-Instruct-2507)
- **Training Framework:** [Unsloth](https://github.com/unslothai/unsloth) — 2x faster fine-tuning with 60% less memory
- **RL Algorithm:** Group Relative Policy Optimization (GRPO) — Shao et al., 2024
