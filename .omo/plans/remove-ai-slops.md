# Plan: remove-ai-slops

> A behavior-preserving `/remove-ai-slops` pass over the site's code/config files. Zero new behavior. Regression harness FIRST (non-negotiable). Batched `deep`-agent cleanup. Quality gates + critical review. Verification wave.
>
> **Trigger**: user requested a `/remove-ai-slops` pass via `$start-work` after ULW-PLAN approval.
> **Status**: awaiting-approval → awaiting-execution (on approval).
> **Approved forks**: Q1 Scope=(A) source/config union, Q2 Verification=(A) local jsdom/npx + CI Jekyll, Q3 Oversized=(A) keep single-file + SIZE_OK markers.

---

## 1. Objectives & Non-Goals

**Goal**: Remove AI slop (comments, dead code, duplication, excessive complexity, needless abstraction, boundary violations, performance, over-defensive code) from the site's source/config files — while preserving observable behavior exactly.

**Non-goals (MUST NOT do)**:
- Change any public API signature, selector, `var()`, CONFIG key, HTML element, or Liquid tag behavior.
- Add new abstractions, dependencies, or runtime deps to `package.json` (must stay `{}`).
- Edit `beautifuljekyll.css`, prose `.md` posts, binaries, `gan-harness/*`, `*.tex`, `.gitignore`, `AGENTS.md`, `Gemfile*`, `Appraisals`.
- Fix functional bugs (`.overflow-hidden`) — document as debt marker only.
- Split oversized single-file modules (deliberate project convention).

**When behavior equivalence is not obvious → SKIP.** Volume of removals is a secondary metric; correctness is primary.

---

## 2. Scope

### IN (code/config files from branch+worktree union)
| File | Pure LOC | Category focus |
|------|----------|----------------|
| `assets/css/custom-styles.css` | ~1655 | C3: dead vars, duplicate selectors, noise comments, excessive `!important`, redundant dark re-decls |
| `assets/js/custom-script.js` | ~718 | C4: EnhancedSearch complexity, dup logic, wrappers, magic numbers, section numbering |
| `_config.yml` | 320 | C5: commented defaults, dead keys |
| `_config_ci.yml` | runtime-gen | C5 (only if present in worktree) |
| `404.html` | 480 | C5: dead `handleResize`, dead `.footer-section`, dup canvas sizing |
| `_layouts/*.html` | — | C5: dead FA classes, commented blocks |
| `_includes/*.html` | — | C5: dead classes, config-gated blocks |
| `assets/js/thinking-machine.js` | 1961 | **EXCLUDED this pass** (no inventory, no harness — METIS P0-3) |
| `gan-harness/*`, `*.tex` | — | **EXCLUDED** (not in Jekyll build, no verifier — METIS P0-4) |

### OUT (hard)
- Prose `.md` posts/drafts, binaries/images, CV-PDF, `.gitignore`, `AGENTS.md`, `Gemfile*`, `Appraisals`, `beautifuljekyll.css`.

---

## 3. Execution Gates (ordering is load-bearing)

```
G0  PREREQ  — working tree captured: git rev-parse HEAD; `git stash list` checked (user's worktree changes preserved)
G1  BASELINE(C1) — behavior-lock harness GREEN recorded as golden artifact (commit hash + baseline output stored)
G2  GATES    — run per-phase after each cleanup batch; all must pass before next batch launches
G3  VERIFY   — final verification wave: harness green + scope-fidelity + zero-deps + critical review
G4  REVIEW   — /review-work critical review (Oracle) — must pass before handoff
```

**Hard rule**: No C3/C4/C5 edit agent may launch until G1 (baseline GREEN) receipt exists. The golden baseline is the only correct "before" picture.

---

## 4. Components

### C1 — Behavior-lock characterization harness (FIRST, non-negotiable)
- Location: `_tests/` (new dir, gitignored by Jekyll convention — verify `_tests` not picked up by build).
- Tools via `npm exec --package=` (NO `npm install`, package.json stays `{}`; pin versions):
  - `jsdom` — load `custom-script.js`, assert module init chain (all 14 modules), `CONFIG` keys, DarkMode persistence, EnhancedSearch NFD normalization on Vietnamese golden cases (`"Tiếng Việt"`, `"đồng"`, `"Nguyễn"`).
  - `csstree` — parse `custom-styles.css`, list all `var(--x)` definitions; assert token surface.
  - `parse5` — parse `_layouts/*`, `_includes/*`, `404.html`; record element/class/id set + Liquid/front-matter invariance (`git diff` of `{% %}`/`{{ }}`/`---` schema empty).
- **Output artifact**: `_tests/golden/` — commit hash, harness output snapshot, var/selector inventory, rendered-Liquid-diff baseline. Store this before ANY edit.
- **Gate G1**: harness exits 0 → GREEN receipt recorded. This is the only green light for C3/C4/C5 launch.

### C2 — Cross-file reference gates (METIS P1-9, run after every batch)
- `var(--x)` scan across `css + html + _layouts + _includes + js` before deleting any var (catches `setProperty`/`getComputedStyle` dynamic uses).
- Selector scan across `html + js` before deleting any selector (catches `querySelector`/`getElementById`, including `#nav-search-input`).
- YAML-parse gate for `_config.yml` (must remain valid YAML, no key referenced dynamically removed).
- Liquid/front-matter invariance gate: `git diff` of template-tag lines must be empty.
- Scope-fidelity gate (METIS P1-10): `git diff --name-only` MUST NOT contain `*.md` posts, `*.png`, `beautifuljekyll.css`, `Gemfile*`, `Appraisals`, `.gitignore`, `AGENTS.md`.
- Zero-deps gate: `package.json` must remain `{}`; no `npm install`; commands PowerShell-compatible; `bundle exec` FORBIDDEN (no Ruby).

### C3 — CSS cleanup (`custom-styles.css`)
Per-category targeted edits, each gated:
- **Dead vars**: remove 8 `--palette-*` (L38-45), `--accent-light` (L49), `--accent-subtle` (L50), `--table-radius` (L104), `--radius-xl` (L75) — ONLY after C2 var-reference scan shows zero uses.
- **Dead selector**: `#nav-search-input` block (L1665-1675) — confirmed legacy via DELETION_LOG. Remove only after C2 selector-scan + DELETION_LOG cross-check.
- **Duplication**: merge `.blog-tags`/`.blog-tags a` (L1069 vs L1096), `.post-preview` (L376 vs L717), duplicate `max-width` (L302/L1000), duplicate `background` (L784/L880). Merge = combine identical rules, keep the more complete one.
- **Noise comments**: strip only the listed restating-code comments (L188, L329, L335, L344, L351, L358, L403, L422, L499, L822-L907). NEVER strip license/legal/TODO/anti-pattern flag comments.
- **HIGH-RISK (default KEEP — METIS P0-5)**: `!important` on dark-mode vars (L1496-1499, L1524), redundant dark re-decls (L295-297, L1542-1597). Removal FORBIDDEN without a cascade specificity trace + both light/dark theme evidence.
- **KEEP**: `.overflow-hidden` as DOCUMENT-ONLY debt marker (functional bug — separate task, NOT slop; METIS P0-2).

### C4 — JS cleanup (`custom-script.js`)
- **EnhancedSearch (384L, 46% of file)** — METIS P1-11: NO public API change (21 method names/signatures frozen). Preserve `this` binding + listener registration. Before splitting `rankResults`/`normalizeItem`/`renderResults`, add Vietnamese NFD golden cases to harness. Split = extract private helpers with identical logic; no behavior delta.
- **DarkMode.toggle aria dup** (L105-106 vs L119-121): extract `_updateToggleState()` and call in both — behavior-identical.
- **`escapeAttr` wrapper** (L789-791): default KEEP (METIS P0-6). Merge into `escapeHtml` ONLY with quote-injection proof case (`'"onmouseover="`) passing pre-merge.
- **`filterPosts` one-liner** (L687-689): inline at call site L613.
- **Magic `0.6`** (L672): replace with named constant (e.g. `SEARCH_RESULT_PAGE_NUMBER_BUFFER`) — no behavior change.
- **Section-number dup** ("11. SchemaMarkup" L794 + "11. ReadMode" L815): comment-only renumber ReadMode→"12". NO logic touch.
- **`.lightbox.active` cross-module query** (L524): KEEP + `/* boundary debt — see AGENTS.md */` comment. MUST NOT add mediator/event-bus abstraction (METIS P1-12).
- **Performance + over-defensive scan** (METIS P1-14): explicit scan for RAF consolidation, `querySelectorAll` in loops, passive listeners, `try/catch` beyond theme-flash IIFE, null guards. Remove only provably-dead defensive code; keep theme-flash IIFE try/catch.

### C5 — Template/config cleanup
- `_config.yml`: strip ~130 commented-out template defaults (social/analytics/comments blocks that are inert). Remove dead keys `search_placeholder` (L145), `search_results_limit` (L146) — only after proving zero references (grep whole repo). Keep YAML valid.
- `404.html`: remove dead `handleResize()` wrapper (L454), dead `.footer-section` CSS (L133), de-dupe canvas sizing in init(). MUST NOT change canvas/resize listener semantics.
- `_layouts/home.html`: remove commented subtitle block (L17-21), dead Font Awesome classes (L67, L76 — FA not loaded).
- `_includes/search.html`: remove dead `.search-box` (L7). MUST NOT move `<meta baseurl>` (L2 — METIS P0-7).
- `_includes/nav.html`: `navbar-extra` conditional (L95-99) — Liquid behind config key. Default KEEP (METIS P0-8). Remove only if key absent from config AND no docs reference AND rendered-HTML diff empty.
- `_includes/footer.html`: `matomo` (L29-34) + `url-pretty` (L22-27) — same config-gated rule as navbar. Default KEEP.

### C6 — Oversized-module policy
- `custom-styles.css` (~1655 POC) and `custom-script.js` (~718 POC) both exceed 250 POC. **Decision: KEEP single-file** (documented project convention per AGENTS.md Design & CSS). Add debt marker:
  - CSS: `/* noqa: SIZE_OK — single-file deliberate (AGENTS.md Design & CSS); modular split tracked as debt */`
  - JS: `// noqa: SIZE_OK — single-file deliberate (AGENTS.md JavaScript Conventions); modular split tracked as debt`
- No structural file split this pass.

---

## 5. Per-file "NEVER" block (boilerplate for EVERY edit agent prompt — METIS P1-13)
1. NEVER edit `beautifuljekyll.css`.
2. NEVER hardcode colors — use CSS variables only.
3. NEVER resurrect anything listed in `DELETION_LOG.md`.
4. NEVER increase `.post-toc-box` padding beyond `1.25rem 1.5rem`.
5. NEVER touch Liquid tags/front matter (their shell must be byte-identical).
6. NEVER strip license/legal/TODO comments (only listed restating-code noise).
7. NEVER change `404.html` canvas/resize listener semantics.
8. NEVER add new abstraction layers/dependencies.
9. NEVER change a public method name/signature, selector, or `var()` name.

---

## 6. Delegation Strategy (parallel `deep` agents)
- **Phase 0**: C1 harness + golden baseline (1 agent, `deep`, synchronous — gate-blocking).
- **Phase 1**: After G1 GREEN, launch in parallel (batches of ≤5, `run_in_background=true`):
  - C3-CSS agent(s): split by category (dead vars+selectors / duplication / comments / high-risk-dark-mode-KEEP) — each with the C2 gate + NEVER block.
  - C4-JS agent(s): EnhancedSearch (with NFD cases) / DarkMode+small-wrappers / performance-over-defensive scan.
  - C5-template agents: `_config.yml` / `404.html`+layouts / `_includes`.
- Each agent prompt MUST include: 6-section delegation structure (TASK, EXPECTED OUTCOME, REQUIRED TOOLS, MUST DO, MUST NOT DO, CONTEXT with exact file+lines from inventory).

---

## 7. Verification Wave (G3)
1. `_tests/` harness re-run → GREEN (behavior preserved post-cleanup).
2. C2 gates re-run → all pass.
3. Scope-fidelity + zero-deps gates → pass (no out-of-scope files, package.json `{}`).
4. `lsp_diagnostics` on changed files → clean.
5. `bundle exec jekyll build --future` — **cannot run locally** (no Ruby). Deferred to CI. Residual risk documented: jsdom gates cover DOM/JS behavior; Liquid/front-matter invariance + CI Jekyll build cover the rest. Visual QA via Playwright against `_site` or GitHub Pages preview (post-build).
6. Document residual jekyll-build-CI risk explicitly in the plan receipt.

---

## 8. Critical Review (G4)
- Run `/review-work` before PR handoff: goal/constraint verification, code quality, security (XSS on `escapeAttr` decision), hands-on QA.
- Oracle consulted if verification fails.

---

## 9. Deliverables
- Cleaned source/config files (behavior-equivalent).
- `_tests/` harness + golden baseline (permanent regression artifact).
- `DELETION_LOG.md` updated with newly-removed dead selectors/vars (append, never resurrect).
- SIZE_OK debt markers on oversized single-file modules.
- Plan receipt documenting CI-deferred build risk + any KEEP decisions.
- PR (only on explicit user request to create one).

---

## 10. Risks & Mitigations
| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| jsdom misses cascade → dark-mode breakage | Med | Default-KEEP on `!important`/dark re-decls (P0-5); dual-theme evidence required |
| Liquid deletion breaks config-gating | Med | P0-8 config-absent + empty-render-diff proof; default KEEP |
| `escapeAttr` merge introduces XSS | Low-Med | P0-6 quote-injection proof pre-merge; default KEEP |
| EnhancedSearch diacritic regression | Med | P1-11 NFD golden cases in harness pre-split |
| Agent touches out-of-scope file | Low | P1-10 scope-fidelity gate + per-file NEVER block |
| No local Jekyll build → integration risk | High | CI Jekyll build + jsdom DOM gates + front-matter invariance + Playwright QA; documented residual |

---

**Approval gate**: awaiting user approval. On approval → `$start-work` executes C1 harness first (baseline GREEN), then batched deep-agent cleanup, then G3 verification wave, then G4 critical review.
