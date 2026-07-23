---
layout: post
title: "OuroTrace: Evaluating Looped Transformer Reasoning with Ouroboros Models"
subtitle: "A STAR+R story about building a benchmarking framework for iterative inference in looped transformers"
tags: [project-story, evaluation, transformers, reasoning, looped-transformers]
author: dzungphieuluuky
mathjax: true
---

## Project Overview

| Attribute | Detail |
|:----------|:-------|
| **Repository** | [OuroTrace](https://github.com/dzungphieuluuky/OuroTrace) |
| **License** | Apache-2.0 |
| **Commits** | 508 |
| **Stars** | 1 |
| **Focus** | Benchmarking Chain-of-Thought reasoning in looped/iterative transformer models |
| **Tasks Evaluated** | N-ary Addition, P-hop Induction, Symbolic i-GSM |
| **Interfaces** | Python API, CLI, Kaggle notebook, Google Colab notebook |

---

## S — Situation

Standard transformer models process input through a fixed number of layers. Looped transformers do something different: they pass activations through the same set of parameters repeatedly, iterating until convergence or a set step count. ByteDance's Ouroboros and the Universal Transformer (UT) follow this pattern. The repeated forward passes effectively give the model a variable computation budget — more iterations for harder problems.

The problem: there was no standardized evaluation framework for measuring how well these looped models actually reason through Chain-of-Thought (CoT) tasks during their iterative inference. Existing benchmarks target standard feed-forward transformers. They don't capture what happens to reasoning quality as iteration count changes, how the model's internal "thinking" evolves step by step, or where iteration gains plateau.

[fill in: Your motivation for working on this problem — what gap in the research landscape drew you to build OuroTrace?]

> **Example:** The gap became clear while reading the Ouroboros paper: the authors showed that looped transformers could match larger models on reasoning tasks, but the evaluation was task-specific and not easily reproducible. There was no off-the-shelf tool to plug in a new reasoning task, sweep iteration counts, and compare accuracy curves. That's the tool OuroTrace provides.

---

## T — Task

Build a modular evaluation framework that lets researchers:

1. **Configure experiments** through JSON configs — model parameters, task definitions, iteration schedules.
2. **Generate test datasets** programmatically for structured reasoning tasks (not just download pre-made benchmarks).
3. **Run batch experiments** across multiple tasks and iteration counts, collecting detailed per-step metrics.
4. **Analyze results** with built-in statistical tools — accuracy vs. iteration curves, convergence analysis, per-task breakdowns.

The framework needed to support the three core reasoning tasks from the looped transformer literature:

| Task | What it tests |
|:-----|:-------------|
| **N-ary Addition** | Multi-operand arithmetic requiring carry propagation |
| **P-hop Induction** | Variable-length logical chains with P steps of inference |
| **Symbolic i-GSM** | Iterative Grade School Math — multi-step symbolic reasoning |

Each task must scale in difficulty, so you can measure how accuracy degrades (or improves) as problem complexity and iteration count interact.

---

## A — Action

The framework is organized into five modules:

| Module | Purpose |
|:-------|:--------|
| `config_loader` | Parse JSON experiment configs, validate parameters, manage defaults |
| `data_generator` | Synthesize reasoning tasks at configurable difficulty levels |
| `model` | Load and run Ouroboros/UT looped transformer models |
| `runner` | Execute batch experiments, manage GPU allocation, log intermediate results |
| `evaluation_analysis` | Compute accuracy metrics, convergence stats, generate comparison plots |

A single import exposes the full pipeline:

```python
from src import (
    load_config_from_json, create_test_datasets,
    OuroThinkingExperiment, OuroBatchExperiment,
    analyze_experiment_results
)
```

Usage pattern: load a config, generate datasets, run the experiment, analyze results. Each step is independently callable — you can use `create_test_datasets` without running the full pipeline, or analyze previously saved results without re-running inference.

The experiment runner supports both single-run mode (`OuroThinkingExperiment` for detailed per-step logging) and batch mode (`OuroBatchExperiment` for sweeping across configurations). Both modes save intermediate results as JSON, so partial experiments can be resumed or analyzed separately.

Reproducibility was a design constraint from the start. All experiment configs are serializable. Random seeds propagate through data generation and model initialization. The Kaggle and Google Colab notebooks provide zero-setup environments where anyone can reproduce the experiments without local GPU access.

---

## R — Result

[fill in: specific benchmark findings about Ouroboros model reasoning capabilities]

> **Example:** Across all three tasks, accuracy improved with iteration count up to a clear saturation point. N-ary Addition showed the steepest gains — the model needed a minimum number of iterations to propagate carries correctly. P-hop Induction accuracy scaled with hop count but required proportionally more iterations. Symbolic i-GSM showed the most interesting behavior: accuracy plateaus were task-dependent, not model-dependent, suggesting the looped architecture allocates computation adaptively per problem rather than applying a uniform reasoning strategy.

The framework itself accumulated 508 commits across its development, reflecting iterative refinement of each module — from initial single-task evaluation to the current multi-task batch system with statistical analysis.

---

## +R — Reflection

Three lessons stand out:

**Evaluation methodology matters as much as model architecture.** The same model can look impressive or mediocre depending on how you measure it. Sweep iteration counts. Vary problem difficulty. Report convergence curves, not just final accuracy. A single number (e.g., "92% accuracy") hides the actual story.

**Reproducibility requires infrastructure investment.** Serializing configs, propagating seeds, providing runnable notebooks — none of this is glamorous, but it's the difference between a paper others can build on and one that sits in a citation black hole. The 508-commit history includes substantial work on making experiments deterministic and portable.

**Modularity enables unexpected uses.** The `data_generator` module, designed for OuroTrace's three core tasks, turned out to be useful for generating custom reasoning benchmarks — researchers could define new task distributions without touching the runner or analysis code. Designing for flexibility at module boundaries pays off.

[fill in: Your personal takeaway — what surprised you most about the process?]

> **Example:** The biggest surprise was how much the data generator mattered. I initially treated it as a utility — plug in a task, get test cases. But the quality of the generated dataset directly affected what the model could reveal about its reasoning patterns. Carefully controlling difficulty scaling turned out to be as important as the evaluation metrics themselves.

---

## Connection to GSTAR

GSTAR (Generalized Schema for Training and Alignment Research) frames LLM development as a multi-stage pipeline: data curation → training → evaluation → alignment. OuroTrace sits in the evaluation stage, but the methodology connects upstream and downstream.

**Upstream — Training:** Understanding *where* a looped model fails (at what iteration count, at what problem complexity) tells you what the training signal should emphasize. If the model plateaus on carry propagation in addition, that's a hint about what the pre-training or fine-tuning data is missing.

**Downstream — Alignment:** Chain-of-Thought reasoning is a transparency mechanism. When you can observe a model's step-by-step iteration, you can evaluate not just whether it got the right answer, but *how* it got there. This is directly relevant to alignment research — interpretable reasoning paths are a prerequisite for reliable oversight.

Building evaluation tools is scholarship work. It doesn't produce the most exciting demo, but it raises the floor for everyone who uses the framework. That's the kind of contribution that compounds.

---

## Resources

- **Source Code:** [github.com/dzungphieuluuky/OuroTrace](https://github.com/dzungphieuluuky/OuroTrace)
- **Kaggle Notebook:** [OuroTrace on Kaggle](https://www.kaggle.com/code/dzung271828/ourotrace) — zero-setup environment with pre-configured model weights
- **Google Colab Notebook:** [OuroTrace on Colab](https://colab.research.google.com/github/dzungphieuluuky/OuroTrace) — run experiments in-browser with free GPU access
