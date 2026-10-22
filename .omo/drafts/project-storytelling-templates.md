---
slug: project-storytelling-templates
status: approved
intent: clear
pending-action: write .omo/plans/project-storytelling-templates.md
approach: "Create two Jekyll blog-post template files in _post_dummies/ using STAR+R storytelling framework for GSTAR scholarship application"
---

# Draft: project-storytelling-templates

## Components (topology ledger)
| id | outcome | status | evidence path |
|----|---------|--------|---------------|
| toolformer-template | STAR+R template for ToolFormer telecom RL project | active | GitHub repo: dzungphieuluuky/ToolFormer — 216 commits, 6 RL algorithms, detailed results |
| ourotrace-template | STAR+R template for OuroTrace looped transformer evaluation project | active | GitHub repo: dzungphieuluuky/OuroTrace — 508 commits, 1 star, reasoning tasks evaluation |
| fontdiffusion-template | Overwrite temp.md with STAR+R template for FontDiffusion Sino-Nom font generation project | active | `_post_dummies/temp.md` — existing 210-line report, needs rewrite to STAR+R format |

## Open assumptions (announced defaults)
| assumption | adopted default | rationale | reversible? |
|------------|----------------|-----------|-------------|
| Template format = Jekyll blog post with YAML front matter | Follow `_post_dummies/sample.md` and `temp.md` conventions | Existing posts use layout:post + tags + author format | Yes — can restructure |
| Storytelling framework = STAR+R | Situation → Task → Action → Result → Reflection per project | Established best practice for scholarship applications; already presented to user and approved | Yes — can edit content |
| Content = detailed template with placeholder brackets | `[bracketed]` sections user fills in, with filled examples as guidance | User said "kick start" — needs structure + examples to follow | Yes — can add/remove examples |
| Author = dzungphieuluuky | Consistent with existing posts | All existing posts use this | No |

## Findings (cited - path:lines)

### ToolFormer repo (GitHub dzungphieuluuky/ToolFormer)
- 216 commits, fine-tuning Qwen3-4B for Vietnamese telecom function calling
- 6 RL algorithms: RC-GRPO, DAPO, CISPO, GRPO, GTPO (code only), MMR-GRPO (code only), AVSPO (code only)
- Key results: Func Selection 0.275→0.615 (+123.6%), Task Success 0.242→0.489 (+102.1%), Schema Validity 0.244→0.749 (+206.6%)
- Ablation findings: KL=0 is sole driver, loss type irrelevant at KL=0, num_generations=16 sufficient
- Dual-retrieval: BM25 for inference (0.22ms), Hybrid+F2LLM for offline gen (Hit@5=88.6%)
- Constraint: T4 16GB GPU, 4-bit quantized
- Docs: REPORT.md, KL-DIVERGENCE-EVAL.md, LOSS-TYPE-EVAL.md, RETRIEVAL-EVAL.md, ablation-studies-02072026.md

### OuroTrace repo (GitHub dzungphieuluuky/OuroTrace)
- 508 commits, 1 star
- Framework for evaluating Chain-of-Thought reasoning in Ouroboros (UT) models
- Tasks: N-ary Addition, P-hop Induction, Symbolic i-GSM
- Modules: config_loader, data_generator, model, evaluation_analysis, runner
- Notebooks available on Kaggle and Google Colab
- License: Apache-2.0

### FontDiffusion repo
- Repo name is FontDiffusion (not "fontdifussion")
- Existing `_post_dummies/temp.md` already has a detailed 210-line draft covering: data pipeline, multi-GPU inference, HF Hub integration, quality evaluation, training phases
- No new template needed — user can refine and use the existing draft

### Existing post format (`_post_dummies/`)
- YAML front matter: layout:post, title, subtitle, cover-img, thumbnail-img, share-img, tags, author
- Tags used: [learning-journey, diffusion, sino-nom, deep-learning] etc.
- Author consistent: dzungphieuluuky
- Content style: technical deep-dive with tables, code blocks, section headers

## Decisions (with rationale)

1. **Two templates, not three** — FontDiffusion already has `temp.md` with 210 lines of content. Skip it. Create only ToolFormer and OuroTrace templates.
2. **STAR+R framework** — Chosen because it's the #1 recommended framework by scholarship committees. Already explained to user in previous turn.
3. **Bracketed placeholders + filled examples** — User needs both a structure to follow AND concrete examples they can adapt. Each template will have guidance text in `[brackets]` with a filled example paragraph right below.
4. **Include technical metrics prominently** — Scholarship committee wants numbers. Each template has a dedicated metrics table.
5. **GSTAR connection section** — Critical: every project template ends with a "Connection to GSTAR" reflection linking the project to what GSTAR teaches (LLM, RL, leadership).

## Scope IN

- Create `_post_dummies/2026-06-16-toolformer.md` — STAR+R template for ToolFormer project
- Create `_post_dummies/2026-07-16-ourotrace.md` — STAR+R template for OuroTrace project
- Overwrite `_post_dummies/temp.md` — STAR+R rewrite of existing FontDiffusion report
- All three templates follow existing Jekyll blog post conventions (YAML front matter, tags, etc.)
- All three templates include: Situation, Task, Action, Result, Reflection sections with bracketed placeholders + filled examples
- All three templates include a metrics/results table with actual numbers from the repos
- All three templates include a "Connection to GSTAR" section

## Scope OUT (Must NOT have)

- Do NOT edit any files outside `_post_dummies/`
- Do NOT fill in the user's personal details beyond what's in the repos (no invented biography)
- Do NOT publish these posts — they are dummies/templates to be filled
- Do NOT modify `_config.yml`, `assets/`, `_layouts/`, or any other file
- Do NOT run Jekyll build or serve

## Open questions

None — all decisions are grounded in the codebase research and user's stated needs.

## Approval gate
status: approved
<!-- User approved plan on Jul 17, 2026. Ready for /start-work. -->
