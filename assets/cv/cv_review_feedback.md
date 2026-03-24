# CV Review (Strict HR/Recruitment Screening)

## Verdict
Current draft shows strong technical depth but reads as research notes instead of hiring-ready achievement evidence. Most bullets describe activity, not business or model impact. Immediate upgrade needed: stronger ownership verbs, hard metrics, and tighter Harvard-style scan structure.

## 1) Weak/Passive Verbs Replaced

- Present technical research progress -> **Drove** weekly research updates that influenced architecture decisions
- Collaborate with faculty -> **Co-designed** experiment plans with faculty and graduate researchers
- Maintain a dedicated research commitment -> **Sustained** 20+ weekly research hours while preserving top academic performance
- Engineered an end-to-end pipeline (good start) -> **Architected** a reproducible experimentation pipeline with tracked outcomes
- Integrated innovations and developed custom modules -> **Implemented** feature-decoupling modules that improved measurable generation quality
- Designed and implemented a novel loss function -> **Introduced** an identity-mapping loss to improve content consistency
- Streamlined collaboration -> **Standardized** dataset/checkpoint publishing to accelerate cross-team reuse
- Benchmarked performance -> **Executed** benchmark suites with controlled protocols and tracked variance
- Conducted comparative analysis -> **Quantified** looped-vs-standard LM trade-offs with perplexity and reasoning metrics
- Developed an RL agent -> **Built and optimized** an RL policy system under non-stationary demand
- Evaluated efficacy -> **Validated** SAC/PPO performance against baseline with callback-driven evaluation

## 2) Missing Metrics (What to Estimate or Retrieve)

For each project, fill at least 2-3 measurable outcomes:

- Model Quality:
  - FID / LPIPS / SSIM deltas for generation tasks
  - Top-1 accuracy / exact match / pass@k for reasoning tasks
  - Reward delta vs random baseline for RL
- Efficiency:
  - Training time reduction (hours or %)
  - Throughput increase (steps/sec, samples/sec)
  - GPU memory reduction (GB or %)
- Reliability/Reproducibility:
  - Successful rerun rate (%)
  - Failed run reduction (%)
  - Checkpoint recovery success rate (%)
- Delivery Velocity:
  - Experiment cycles per week
  - Debugging time saved (hours/week)
  - Time-to-result reduction (%)
- Reach/Adoption (Portfolio):
  - Monthly visitors
  - Search-to-click conversion
  - Number of technical posts and average read time

## 3) Harvard CV Compliance Check

Status: **Partially compliant before rewrite; compliant after rewrite in new file**

What was fixed:

- Removed weak activity-heavy phrasing and switched to outcome-first bullets
- Enforced concise, high-signal sections and cleaner hierarchy
- Kept pronouns out (no I / me / my)
- Standardized role entries with institution, location, and dates
- Increased ATS scannability with explicit technical stacks and measurable placeholders
- Corrected contact line to show real email label instead of ambiguous wording

Remaining requirement for full excellence:

- Replace all [X] placeholders with verified numbers before external submission

## 4) Top 3 Bullets Rewritten with Golden Formula

1. Achieved [X%] improvement in style-transfer fidelity as measured by [FID/LPIPS or human preference] by integrating Skeleton Distance Transform and DFT-based content-style decoupling modules.
2. Achieved [X] benchmark runs/week as measured by automated evaluation throughput by building a reproducible lm-evaluation-harness pipeline with strict extraction controls.
3. Achieved [X%] training speedup as measured by environment steps/second by engineering a custom Gymnasium simulator and accelerating bottlenecks with Numba.

## Final Summary (Hiring Readiness)

- Strengths: clear AI/ML project depth, credible research experience, strong academic profile.
- Risks: insufficient quantified outcomes and occasional wording that signals participation rather than ownership.
- Result after rewrite: CV now reads as impact-oriented, ATS-friendly, and recruiter-scannable for AI/ML internship or entry-level research engineering roles.
- Final action before sending: replace all metric placeholders with real values from logs, leaderboards, or experiment trackers.
