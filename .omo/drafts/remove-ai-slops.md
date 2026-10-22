---
slug: remove-ai-slops
status: awaiting-approval
intent: clear
review_required: false
pending-action: write .omo/plans/remove-ai-slops.md
approach: Slop-removal pass (/remove-ai-slops skill) over the site code files, with a local characterization behavior-lock harness first, batched deep-agent cleanup, quality gates, critical review.
---

# Draft: remove-ai-slops

## Components (topology ledger)
- C1 behavior-lock | characterization harness in `_tests/` (jsdom + npx CSS/HTML parsers) pins CURRENT behavior of custom-script.js + CSS token surface + template structure; golden baseline green BEFORE any edit | active | `_tests/` artifacts + gate output
- C2 CSS cleanup | custom-styles.css per-category slop pass (comments/dead/duplication/complexity/perf) behavior-preserving | active | gate: harness + parser green after pass
- C3 JS cleanup | custom-script.js (+ thinking-machine.js if in scope) per-category pass | active | gate: harness green (module behaviors pinned)
- C4 Template/config cleanup | _includes/*, _layouts/*, 404.html, blog.html, index.md, _config.yml per-category pass (no Liquid/behavior change) | active | gate: HTML parse + jekyll-build deferred CI note
- C5 oversized-module policy | decision KEEP-vs-SPLIT for 3 files >250 pure LOC, applied consistently with debt markers | active | draft Decisions ledger
- C6 verification wave | all gates green (harness, parsers, quality gates, critical review, scope fidelity) + residual jekyll-build-CI risk documented | active | final verification wave receipts

## Open assumptions (announced defaults, veto-able at gate)
- Prose .md posts/drafts are OUT of slop scope (remove-ai-slops prose exemption; text quality = separate /review-content concern) | skill rule | reversible
- Binaries/images/CV-PDF/Gemfile/Appraisals out | not code slop candidates | reversible
- `.gitignore` + `AGENTS.md` (my prior init-deep session) OUT of scope; dirty_worktree risk; verifiers must not overwrite user/agent changes | full-workflow dirty_worktree rule | reversible
- Slop pass NEVER alters Liquid tags, front matter, build config semantics, public API/selectors JS depends on; only the 10 slop categories | skill hard constraint | reversible
- Behavior lock = CHARACTERIZATION tests pinning current observable behavior (GOLDEN baseline), not TDD-RED (no new behavior is added) | skill Phase 2 semantics | reversible

## Findings (cited - path:lines)
**Infrastructure:**
- git: branch vs main = 101 files +11139/-793 (whole site rebuild); worktree = 13 files +794/-299 (active design); staged = AGENTS.md deletion
- NO Ruby/bundle/jekyll → canonical `jekyll build` gate NOT locally executable
- Node v24 + npx → jsdom/csstree via `npm exec --package=` feasible (zero repo deps)
- No test infra; package.json = `{}`; _site exists but STALE
- custom-styles.css = 1849L / ~1655 POC; custom-script.js = 859L / ~718 POC; thinking-machine.js = 1961L (branch-only)

**CSS slop inventory (bg_35b16be3):**
- 8 dead `--palette-*` vars (L38-45): never referenced via `var()`
- Dead vars: `--accent-light` (L49), `--accent-subtle` (L50), `--table-radius` (L104), `--radius-xl` (L75)
- Self-admitted dead selector: `#nav-search-input` block (L1665-1675) — DELETION_LOG confirms legacy
- `.blog-tags`/`.blog-tags a` defined TWICE (L1069 vs L1096) — merge
- `.post-preview` defined TWICE (L376 vs L717) — merge
- Duplicate `max-width` declarations (L302 vs L1000), duplicate `background` (L784, L880)
- `.overflow-hidden` has NO CSS rule → functional bug (body scroll not locked by JS classList toggle)
- ~20 noise comments (restating-code: L188, L329, L335, L344, L351, L358, L403, L422, L499, L822-L907)
- Excessive `!important` on dark-mode vars (L1496-1499, L1524); dual background-color+background (L1540)
- Redundant dark-mode color re-declarations where vars already flip (L295-297, L1542-1597)

**JS slop inventory (bg_026b1c51):**
- EnhancedSearch = 384 lines (409-792), 21 methods, 46% of file; `rankResults` god function 52L, `normalizeItem` 40L, `renderResults` 46L
- DarkMode.toggle aria-label logic duplicated (L105-106 vs L119-121) — call _updateToggleState()
- `escapeAttr` (L789-791) = pass-through wrapper to escapeHtml, single use
- `filterPosts` (L687-689) = single-use one-liner, inline at L613
- Magic number `0.6` at L672 without named constant
- Section numbering dup: "11. SchemaMarkup" (L794) + "11. ReadMode" (L815) → ReadMode should be "12"
- Cross-module boundary: EnhancedSearch queries `.lightbox.active` (L524)
- No console.log/debug leftovers; all CONFIG keys used; all 14 modules init'd

**Template/config slop inventory (bg_7e3562fa):**
- `_config.yml`: ~130/320 lines = commented-out template defaults (social keys, analytics, comments blocks)
- `_config.yml`: 2 dead keys never referenced: `search_placeholder` (L145), `search_results_limit` (L146)
- `404.html` (480L): dead `handleResize()` wrapper (L454), duplicate canvas sizing in init(), `.footer-section` dead CSS (L133)
- `_layouts/home.html`: commented-out subtitle block (L17-21), dead Font Awesome classes (L67, L76) — FA not loaded
- `_includes/search.html`: dead `.search-box` class (L7), misplaced `<meta baseurl>` (L2)
- `_includes/nav.html`: dead `navbar-extra` conditional (L95-99)
- `_includes/footer.html`: dead `matomo` block (L29-34), dead `url-pretty` block (L22-27)

## Decisions (with rationale)
- **Q1 Scope = (A)** Source/config files in branch+worktree union (~20 files: custom-styles.css, custom-script.js, thinking-machine.js branch-only, _config.yml, _config_ci.yml, 404.html, _layouts/*, _includes/*, gan-harness/*, LaTeX). Prose posts/binaries OUT. User-approved.
- **Q2 Verification = (A)** Local jsdom/npx gates + Jekyll build deferred to CI. Meets skill Phase 2 non-negotiable for code gates; visual QA via Playwright/_site. User-approved.
- **Q3 Oversized = (A)** KEEP single-file + SIZE_OK debt markers (respect AGENTS.md documented single-file convention). No structural split. User-approved.

## Metis amendments (applied, from gap analysis)
- **P0-1**: Hard gate — record harness commit hash + golden baseline artifact; forbid launching C2/C3/C4 agents until `C1 baseline GREEN` receipt exists.
- **P0-2**: `.overflow-hidden` is a FUNCTIONAL BUG not slop — DOCUMENT-ONLY (debt marker, separate bug task), MUST NOT add rule this pass (behavior change vs characterization premise).
- **P0-3**: `thinking-machine.js` (1961L, branch-only) — NO slop inventory exists. Either EXCLUDE from pass, or require dedicated inventory + dedicated harness first. Generic JS cleanup NEVER touches uninventoried 1961L file.
- **P0-4**: `gan-harness/*` + `*.tex` (LaTeX) OUT of pass — not in Jekyll build, no local verifier (pdflatex missing).
- **P0-5**: Dark-mode `!important` (L1496-1499, L1524) + "redundant" dark re-declarations (L295-297, L1542-1597) = HIGH-RISK (jsdom computes no cascade). Default KEEP unless specificity calc + both-theme evidence. Forbidden to remove `!important` without cascade trace.
- **P0-6**: `escapeAttr`→`escapeHtml` merge FORBIDDEN without context-preservation proof (quote-injection test case `'"onmouseover="`). Default KEEP wrapper.
- **P0-7**: `<meta baseurl>` move in search.html is OUT (behavior change jsdom won't catch). Dead `.search-box` removal allowed only.
- **P0-8**: `navbar-extra`, `matomo`, `url-pretty` are Liquid conditionals behind config keys — NOT dead code. Removable ONLY if key absent from config AND no docs reference + rendered-HTML diff empty. Default KEEP configurability.
- **P1-9**: Cross-file reference gates (var/selector/dynamic-use scans across css+html+js+layouts+includes) + YAML-parse gate + Liquid/front-matter invariance gate (`git diff` of `{% %}`/`{{ }}`/`---` empty).
- **P1-10**: Scope-fidelity + zero-deps gates (`git diff --name-only` MUST NOT contain posts/PNG/beautifuljekyll.css/Gemfile*/Appraisals/.gitignore/AGENTS.md; package.json stays `{}`; pin npx tool versions; PowerShell-compatible; forbid `bundle exec`).
- **P1-11**: EnhancedSearch refactor boundaries — NO public API change (21 method names frozen), preserve `this` binding + listeners, add Vietnamese NFD golden cases ("Tiếng Việt", "đồng", "Nguyễn") to harness BEFORE splitting. Section-number fix = comment-only renumber, no logic touch.
- **P1-12**: `.lightbox.active` cross-module query → KEEP + debt comment. Introducing mediator/event-bus = needless abstraction (violates slop skill). MUST NOT add new abstraction layer.
- **P1-13**: Per-file "NEVER" block boilerplate (beautifuljekyll.css, hardcoded colors, DELETION_LOG resurrection, .post-toc-box padding, Liquid/front-matter, license/TODO comments, 404.html canvas semantic).
- **P1-14**: Performance + over-defensive scan on custom-script.js added as explicit scan task OR declared OUT. Default: add explicit scan for these two categories before C3 (avoid agent invention).

## Scope IN
- CSS/JS/HTML/YAML source files from branch+worktree union diffs (code/config only, ~20 files)
- `_tests/` behavior-lock characterization harness (jsdom/csstree/parse5 via `npm exec --package=`)
- SIZE_OK debt markers for oversized single-file modules (custom-styles.css, custom-script.js)
- Performance + over-defensive scan of custom-script.js (per P1-14)

## Scope OUT (Must NOT have)
- `.md` posts/drafts text edits; binaries/images/CV-PDF; `.gitignore`/`AGENTS.md`; Gemfile/Appraisals semantics; `beautifuljekyll.css`; template/Liquid behavior changes; new runtime deps in package.json (stays `{}`)
- `gan-harness/*`; `*.tex` (LaTeX — no pdflatex verifier)
- `thinking-machine.js` edits UNLESS dedicated inventory + dedicated harness created (default: EXCLUDE this pass)
- `.overflow-hidden` functional fix (DOCUMENT-ONLY debt marker; separate bug task)
- `<meta baseurl>` repositioning; `navbar-extra`/`matomo`/`url-pretty` Liquid deletion without config-absent + empty-render-diff proof
- `escapeAttr` merge without quote-injection proof; removing dark-mode `!important` without cascade trace + both-theme evidence

## Approval gate
status: awaiting-approval
<!-- Locked: Q1=A,Q2=A,Q3=A. Metis amendments P0-1..P1-14 applied. Plan file pending write at .omo/plans/remove-ai-slops.md after user approval. -->
<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->
