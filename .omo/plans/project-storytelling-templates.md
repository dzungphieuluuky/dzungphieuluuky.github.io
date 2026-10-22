# project-storytelling-templates - Work Plan

## TL;DR (For humans)

**What you'll get:** Three ready-to-fill blog post templates (`_post_dummies/`) that tell the story of your ToolFormer, OuroTrace, and FontDiffusion projects using the STAR+R framework — Situation, Task, Action, Result, Reflection format optimized for scholarship applications.

**Why this approach:** Your three projects are strong technical work. The STAR+R framework gives committee readers a consistent, metrics-heavy narrative they can evaluate quickly. One template per project, with bracketed sections you fill in + filled examples from the repo data. FontDiffusion's existing `temp.md` gets rewritten from report format to STAR+R storytelling.

**What it will NOT do:** Not fill in your personal story details. Not touch anything outside `_post_dummies/`. Not publish or build.

**Effort:** Quick (3 files, ~150 lines each)
**Risk:** Low - templates only, no product code
**Decisions to sanity-check:** Which RL results to highlight, which OuroTrace tasks to feature, how deep the technical detail should go

Your next move: **Approve this plan**, then run `/start-work` to execute.

---

> TL;DR (machine): Quick, Low — 3 Jekyll post templates in _post_dummies/ using STAR+R (ToolFormer, OuroTrace, FontDiffusion)

## Scope
### Must have
- `_post_dummies/2026-06-16-toolformer.md` — STAR+R template for ToolFormer telecom RL project
- `_post_dummies/2026-07-16-ourotrace.md` — STAR+R template for OuroTrace looped transformer evaluation project
- `_post_dummies/2026-01-24-fontdiffusion.md` — STAR+R rewrite of FontDiffusion Sino-Nom font generation project (overwrite `temp.md`)
- All three: YAML front matter (layout, title, tags, author matching existing conventions)
- All three: Situation → Task → Action → Result → Reflection sections
- All three: Bracketed `[fill in]` placeholders where user adds personal details
- All three: Filled example content under each placeholder (from repo data: metrics, decisions, architecture)
- All three: "Connection to GSTAR" section linking project to scholarship criteria
- All three: Resources/Links section to the actual GitHub repos

### Must NOT have (guardrails, anti-slop, scope boundaries)
- No deleting `temp.md` without replacing it (overwrite only)
- No edits outside `_post_dummies/`
- No invented biography or achievements
- No AI-generated sounding filler
- No Jekyll build or serve
- No configuration changes

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: none (templates are markdown files, no code to test)
- Evidence: Read each created file and verify all sections present, all `[brackets]` are unfilled where expected, front matter is valid YAML, file naming matches `YYYY-MM-DD-slug.md` convention

## Execution strategy
### Parallel execution waves
> Wave 1: all three files can be created in parallel (no dependencies)

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1. ToolFormer template | None | None | Todos 2, 3 |
| 2. OuroTrace template | None | None | Todos 1, 3 |
| 3. FontDiffusion template | None | None | Todos 1, 2 |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->

### Wave 1: Create templates (parallel)

- [x] 1. Create ToolFormer STAR+R template in `_post_dummies/`
  What to do / Must NOT do: Write `_post_dummies/2026-06-16-toolformer.md` using the STAR+R framework. Include YAML front matter (layout:post, tags:[project-story,rl,llm,tool-calling,telecom,grpo], author:dzungphieuluuky). Sections: Overview table (repo, goal, techniques, stack, status) → Situation (bối cảnh — problem space) → Task (nhiệm vụ — specific goals) → Action (hành động — technical deep-dive with code blocks, architecture decisions, ablation findings) → Result (kết quả — metrics table with Func Selection +123.6%, Task Success +102.1%, Schema Validity +206.6%) → Reflection (bài học — KL=0 insight, noise floor, dual-retrieval strategy) → Connection to GSTAR → Resources. Use `[bracketed]` placeholders for user-fillable sections with filled examples below each. Must NOT invent any biographical facts beyond what the repo README shows.
  Parallelization: Wave 1 | Blocked by: None | Blocks: None
  References: 
    - ToolFormer GitHub README (full repo info above in draft Findings)
    - Existing `_post_dummies/temp.md` for format reference (210 lines, FontDiffuser template)
    - Existing `_post_dummies/sample.md` for Jekyll front matter conventions
    - STAR+R framework (described in previous conversation turn)
  Acceptance criteria: File exists at `_post_dummies/2026-06-16-toolformer.md`. Can parse as valid YAML front matter. Contains all 6 STAR+R sections (S, T, A, R, +R, Connection). Contains at least one `[bracket]` placeholder. Contains the metrics table with actual numbers from the repo (0.275→0.615, +123.6% etc.)
  QA scenarios: Read file → verify front matter starts with `---layout: post` → verify has `## S — Situation`, `## T — Task`, `## A — Action`, `## R — Result`, `## +R — Reflection`, `## Connection to GSTAR` headers → verify metrics table includes "+123.6%" → verify Resources section links to github.com/dzungphieuluuky/ToolFormer
  Commit: N (templates only, not for publication)

- [x] 2. Create OuroTrace STAR+R template in `_post_dummies/`
  What to do / Must NOT do: Write `_post_dummies/2026-07-16-ourotrace.md` using the STAR+R framework. Include YAML front matter (layout:post, tags:[project-story,evaluation,transformers,reasoning,looped-transformers], author:dzungphieuluuky). Sections: Overview table → Situation (problem: evaluating reasoning in looped transformers is hard — no standard benchmark) → Task (build framework for CoT evaluation of Ouroboros/UT models) → Action (modules: config_loader, data_generator, model, evaluation_analysis, runner; tasks: N-ary Addition, P-hop Induction, Symbolic i-GSM; Kaggle + Colab notebooks) → Result (findings about Ouroboros model reasoning capabilities, benchmark results, reproducibility framework) → Reflection (lessons about evaluation methodology, what worked/didn't) → Connection to GSTAR → Resources. Use `[bracketed]` placeholders for user-fillable sections with filled examples. Must NOT invent results — use "508 commits, framework evaluation" not exaggerated claims.
  Parallelization: Wave 1 | Blocked by: None | Blocks: None
  References: 
    - OuroTrace GitHub README (repo info above in draft Findings)
    - Existing `_post_dummies/temp.md` for format reference
    - `_post_dummies/sample.md` for YAML conventions
    - STAR+R framework
  Acceptance criteria: File exists at `_post_dummies/2026-07-16-ourotrace.md`. Valid YAML front matter. Contains all 6 STAR+R sections. Contains `[bracket]` placeholders. Links to github.com/dzungphieuluuky/OuroTrace. Mentions N-ary Addition, P-hop Induction, Symbolic i-GSM tasks.
  QA scenarios: Read file → verify front matter → verify all section headers present → verify "508 commits" or "Ouroboros" appears → verify Resources has GitHub link → verify at least 3 `[...]` placeholders exist
  Commit: N (templates only, not for publication)

- [x] 3. Create FontDiffusion STAR+R template in `_post_dummies/` (overwrite `temp.md`)
  What to do / Must NOT do: Overwrite `_post_dummies/temp.md` with `_post_dummies/2026-01-24-fontdiffusion.md` using the STAR+R framework. Include YAML front matter (layout:post, tags:[project-story,diffusion,sino-nom,deep-learning,font-generation], author:dzungphieuluuky, mathjax:true). Sections: Overview table (repo, goal: generate Sino-Nom fonts via diffusion, stack: PyTorch/HF Diffusers/Accelerate, status: Phase 1 complete) → Situation (problem: digitizing Hán Nôm characters is manual and slow — thousands of rare glyphs need font generation) → Task (build FontDiffusion module: data pipeline, multi-GPU inference, HF Hub integration, quality evaluation) → Action (deep-dive: batch generation pipeline, multi-GPU with Accelerate, parquet dataset format for speed, FID/LPIPS/SSIM evaluation, contrastive learning setup with 16 negative style images, FSTDiff module integration) → Result (metrics: ~1.7s/sample on 2x GPU, generated dataset on HF Hub, Phase 1 losses logged on WandB → train/perceptual/offset/diffusion loss charts) → Reflection (model saturation identified, next: FSTDiff style module, multi-scale extraction) → Connection to GSTAR → Resources (GitHub, Kaggle notebook, HF datasets, weights). Use `[bracketed]` placeholders for user-fillable sections with filled examples from the existing temp.md content. Must NOT delete the original content without writing the replacement — overwrite in one edit.
  Parallelization: Wave 1 | Blocked by: None | Blocks: None
  References:
    - FontDiffusion GitHub (tagged topics: huggingface-diffusers, font-generation, sino-nom)
    - Existing `_post_dummies/temp.md` for the factual content to adapt
    - Kaggle notebook: dzung271828/font-diffusion
    - HF datasets: dzungpham/font-diffusion-generated-data, dzungpham/font-diffusion-weights
    - STAR+R framework
  Acceptance criteria: File exists at `_post_dummies/2026-01-24-fontdiffusion.md`. Old `temp.md` is gone (replaced by the new filename). Valid YAML front matter. Contains all 6 STAR+R sections. Contains `[bracket]` placeholders. Mentions: PyTorch, HF Diffusers, Accelerate, WandB, parquet, LPIPS/SSIM/FID. Links to GitHub repo and Kaggle notebook.
  QA scenarios: Read file → verify front matter → verify all section headers present → verify "~1.7s/sample" or "LPIPS" or "parquet" appears → verify Resources has GitHub link and Kaggle link → verify at least 3 `[...]` placeholders exist → verify old `temp.md` no longer exists (file at `2026-01-24-fontdiffusion.md` instead)
  Commit: N (templates only, not for publication)

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [x] F1. Plan compliance audit — all 3 files exist at correct paths with correct naming
- [x] F2. Format review — all 3 files have valid YAML front matter, proper section headers
- [x] F3. Content completeness — all required STAR+R sections present in all 3 files
- [x] F4. Scope fidelity — no files created outside _post_dummies/, old `temp.md` replaced by `2026-01-24-fontdiffusion.md`

## Commit strategy
No commits. These are template drafts in `_post_dummies/` (not published posts). User will fill and commit later.

## Success criteria
- Three `.md` files under `_post_dummies/` named by YYYY-MM-DD-slug convention: `2026-06-16-toolformer.md`, `2026-07-16-ourotrace.md`, `2026-01-24-fontdiffusion.md`
- Old `temp.md` replaced by `2026-01-24-fontdiffusion.md` (no orphan `temp.md`)
- Each file parses as valid Jekyll post (YAML front matter + markdown body)
- Each file has all 6 STAR+R sections with bracketed placeholders + filled examples
- Each file links to the correct GitHub repo
- No files modified outside `_post_dummies/`
