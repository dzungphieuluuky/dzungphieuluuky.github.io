# css-performance-audit - Work Plan

## TL;DR (For humans)

**What you'll get:** Your site's CSS payload drops from ~102 KB to ~70 KB by removing dead selectors and pruning social button styles. Page interaction gets smoother because the universal `*` transition (attached to every element) is narrowed to only the two cheapest properties. Code blocks and modals render faster with CSS containment. Eight targeted performance fixes total — zero visual change.

**Why this approach:** The audit found that 31% of CSS is dead weight (unused selectors from the theme that were never cleaned up), and the universal transition on 5 properties — including expensive `box-shadow` — degrades every class toggle (dark mode, search, lightbox). Fixing these two things alone recovers most of the performance delta. The remaining fixes are surgical and verified per-todo via build checks.

**What it will NOT do:** Not removing anything from the `.post-image` styles (actively used by your homepage), not touching the search overlay (beautifuljekyll.js still runs), not replacing CSS `@import` (it comes from the theme gem and would break the build), not changing fonts, colors, content, or page layouts.

**Effort:** Short (1-2h)
**Risk:** Low — all changes are plain CSS deletions or property swaps; no structural HTML changes; each step verifiable via `bundle exec jekyll build`

**Decisions to sanity-check:**
- `content-visibility: auto` only on post preview items #4+ (protects SEO for your first 3 posts)
- CSS containment skipped on `.navbar` (it's `position: sticky` and `contain:` would break it)

---

> TL;DR (machine): Short effort, Low risk, 8 todos in 3 waves + verification. CSS-only changes: dead selector removal, universal transition narrowed, CSS containment, vendor prefix cleanup, duplicate merge, hover reflow fix. No content file changes. Verified via `bundle exec jekyll build` + CSS size comparison + visual QA.

## Scope
### Must have
1. Remove confirmed-dead CSS selectors from beautifuljekyll.css and custom-styles.css
2. Prune bootstrap-social.css to only `btn-twitter`, `btn-facebook`, `btn-linkedin`
3. Narrow universal `*` transition: keep `color` + `background-color`; move `opacity`, `box-shadow`, `border-color` to specific elements
4. Fix `padding-left:hover` → `transform: translateX()` in tags.html with transition dependency
5. Add `contain: layout style` to `.blog-post article`, `.search-modal`, `.inline-toc`, `.lightbox-overlay`
6. Add `content-visibility: auto` + `contain-intrinsic-size` to `.posts-list .post-preview` items #4+
7. Remove unnecessary vendor prefixes (Chrome 90+, Firefox 90+, Safari 15.4+, Edge 90+)
8. Merge duplicate `prefers-reduced-motion` blocks; fix `--shadow-lg`/`--shadow-xl`; fix pagination double-padding

### Must NOT have (guardrails, anti-slop, scope boundaries)
1. No removal of `.post-image` selectors (actively used by home.html)
2. No removal of search overlay selectors (beautifuljekyll.js still loaded)
3. No removal of `.highlight` container rules (styles code blocks)
4. No replacement of `@import` with `<link>` (pygment_highlights.css is from theme gem)
5. No new `prefers-reduced-motion` wrappers (already exist)
6. No new `prefers-color-scheme` JS fallback (already exists in DarkMode)
7. No changes to blog post layout or reading experience
8. No changes to content files (index.md, research.md, etc.)
9. No migration from Jekyll/GitHub Pages
10. No JS frameworks or build tooling
11. No CV PDF or LaTeX changes
12. No new third-party CSS/JS dependencies
13. No `!important` cleanup (deferred)
14. No font or color palette changes

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: none (static site, CSS-only changes; build + visual check)
- Evidence: `.omo/evidence/css-performance-audit/`

## Execution strategy
### Parallel execution waves
- **Wave 1** (Payload Reduction): Todos 1-3 — dead selector removal + bootstrap-social pruning
- **Wave 2** (Expensive CSS Fixes): Todos 4-6 — transition narrowing, hover fix, containment
- **Wave 3** (Housekeeping): Todos 7-8 — vendor prefixes, duplicates
- **Wave 4** (Verification): Todos F1-F4 — build check, CSS size, visual QA, scope

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 | - | - | 2, 3 |
| 2 | - | - | 1, 3 |
| 3 | - | - | 1, 2 |
| 4 | - | - | 5, 6, 7, 8 |
| 5 | - | - | 4, 6, 7, 8 |
| 6 | - | - | 4, 5, 7, 8 |
| 7 | - | - | 4, 5, 6, 8 |
| 8 | - | - | 4, 5, 6, 7 |

## Todos

- [x] 1. Remove confirmed-dead selectors from beautifuljekyll.css
  What to do:
  - In `assets/css/beautifuljekyll.css`, remove these selectors and their entire rule blocks:
    - `.jumbotron` at line 89 (approx)
    - `.hideme` at line 108 (approx)
    - `.linked-section` at line 135 (approx)
    - `.center` at line 1018 (approx)
    - `.intro-header .page-heading .page-subheading, .intro-header .post-heading .post-subheading` block at lines ~720-731
    - `.intro-header.big-img .page-heading hr` block at lines ~736-740 (NOTE: lines ~741-754 are DIFFERENT selectors — only remove the hr block)
  Must NOT do: DO NOT touch `.post-image` block (lines ~545-590), search overlay (lines ~1024-1116), or `.highlight` container rules (lines ~893-916). DO NOT remove from pygment_highlights.css.
  Parallelization: Wave 1 | Blocked by: - | Blocks: -
  References:
  - `assets/css/beautifuljekyll.css` — lines 89, 108, 135, 720-731, 736-740, 1018
  - High-accuracy review v1 confirmed these selectors are dead (zero HTML/JS references)
  - ⚠️ Line drift: line numbers reference current file state. If you edit beautifuljekyll.css before this task, re-check line numbers first.
  Acceptance criteria:
  - `bundle exec jekyll build` exits 0
  - `grep -c "\.jumbotron\|\.hideme\|\.linked-section\|\.center" assets/css/beautifuljekyll.css` returns 0 (all removed)
  - `grep -n "post-image" assets/css/beautifuljekyll.css` still returns matches (NOT removed)
  QA scenarios:
  - Happy: `bundle exec jekyll build --future > /dev/null 2>&1 && echo "BUILD OK"`
  - Failure: build fails due to malformed CSS or accidentally truncated block
  - Evidence: `.omo/evidence/css-performance-audit/task-1-dead-selectors.diff`
  Commit: Y | chore(css): remove confirmed-dead selectors from beautifuljekyll.css

- [x] 2. Remove confirmed-dead selectors from custom-styles.css
  What to do:
  - In `assets/css/custom-styles.css`, remove these selectors and their entire rule blocks:
    - `.post-preview .post-excerpt` at line ~613
    - `.post-preview .post-preview-tags` at line ~627
    - `.post-layout` at line ~872
  Must NOT do: DO NOT remove any other selectors. DO NOT modify `.blog-post` (line ~873).
  Parallelization: Wave 1 | Blocked by: - | Blocks: -
  References:
  - `assets/css/custom-styles.css` — lines 613, 627, 872
  - High-accuracy review v1 confirmed these are dead (no HTML elements use them)
  Acceptance criteria:
  - `bundle exec jekyll build` exits 0
  - `grep -c "post-excerpt\|post-preview-tags\|\.post-layout" assets/css/custom-styles.css` returns 0
  QA scenarios:
  - Happy: `grep -c "post-excerpt\|post-layout" assets/css/custom-styles.css` returns 0
  - Failure: `bundle exec jekyll build` fails
  - Evidence: `.omo/evidence/css-performance-audit/task-2-custom-css-dead.diff`
  Commit: Y | chore(css): remove dead selectors from custom-styles.css

- [x] 3. Prune bootstrap-social.css to 3 used variants
  What to do:
  - Open `assets/css/bootstrap-social.css`
  - Remove all button variant blocks EXCEPT: `btn-twitter`, `btn-facebook`, `btn-linkedin`
  - The unused variants to remove: `btn-adn`, `btn-bitbucket`, `btn-dropbox`, `btn-flickr`, `btn-foursquare`, `btn-github`, `btn-google`, `btn-instagram`, `btn-microsoft`, `btn-odnoklassniki`, `btn-openid`, `btn-pinterest`, `btn-soundcloud`, `btn-tumblr`, `btn-vimeo`, `btn-yahoo`, `btn-reddit`, `btn-vk`
  - Keep the base `.btn-social` and shared structural rules (everything not specific to a variant)
  Must NOT do: DO NOT remove the base `.btn-social` class or any structural/shared rules.
  Parallelization: Wave 1 | Blocked by: - | Blocks: -
  References:
  - `assets/css/bootstrap-social.css` — full file
  - `_includes/social-share.html:15,23,31` — confirms only btn-twitter, btn-facebook, btn-linkedin used
  - `_config.yml` — vk: false, reddit: false
  Acceptance criteria:
  - `bundle exec jekyll build` exits 0
  - `grep -c "btn-adn\|btn-bitbucket\|btn-dropbox\|btn-flickr\|btn-foursquare\|btn-github\|btn-google\|btn-instagram\|btn-microsoft\|btn-odnoklassniki\|btn-openid\|btn-pinterest\|btn-soundcloud\|btn-tumblr\|btn-vimeo\|btn-yahoo\|btn-reddit\|btn-vk" assets/css/bootstrap-social.css` returns 0
  - `grep -c "btn-twitter\|btn-facebook\|btn-linkedin" assets/css/bootstrap-social.css` returns >0 (still present)
  - File size reduction: `wc -c assets/css/bootstrap-social.css` shows ~30KB less
  QA scenarios:
  - Happy: `grep -E "btn-(facebook|twitter|linkedin)" assets/css/bootstrap-social.css | head -3` — shows 3 social buttons still styled
  - Failure: `bundle exec jekyll build` fails
  - Evidence: `.omo/evidence/css-performance-audit/task-3-bootstrap-prune.diff`
  Commit: Y | chore(css): prune bootstrap-social.css to 3 used social button variants

- [x] 4. Narrow universal `*` transition to cheaper properties
  What to do:
  - In `assets/css/custom-styles.css`, change the universal transition at lines ~285-288 from:
    ```css
    transition: color 200ms ease, background-color 200ms ease, border-color 200ms ease, opacity 200ms ease, box-shadow 200ms ease;
    ```
    to:
    ```css
    transition: color 200ms ease, background-color 200ms ease;
    ```
  - Then add explicit transitions back for `opacity`, `box-shadow`, and `border-color` ONLY on these specific elements:
    - `.post-preview` — add `box-shadow 200ms ease` (line ~340)
    - `.copy-btn` — add `opacity 200ms ease, border-color 200ms ease` (line ~344)
    - `.btn-primary` — add `border-color 200ms ease` (line ~347)
    - `.nav-link` — add `border-color 200ms ease` (line ~348)
    - `.blog-tags` — add `box-shadow 200ms ease` (line ~349)
    - `.project-card` — (line ~1461, likely just bg-color already)
    - `a` — keep `background-size 300ms ease, color 200ms ease` (line ~374, already specific)
    - ~~`.navbar-custom .avatar-container` — add `opacity 200ms ease` if it transitions opacity~~ SKIP — already has explicit `transition: opacity 0.5s ease-in-out;` at beautifuljekyll.css line ~353
  Must NOT do: DO NOT remove transitions from elements that need them for animation. DO NOT leave a selector that relied on universal transition without restoring its needed property.
  Parallelization: Wave 2 | Blocked by: - | Blocks: -
  References:
  - `assets/css/custom-styles.css` — lines 285-288 (universal), 339-349 (specific selectors), 370-374 (a tags), 1459-1463 (project-card)
  - High-accuracy review v1: verify each selector's original transition needs
  Acceptance criteria:
  - `bundle exec jekyll build` exits 0
  - `grep -n '\*,' assets/css/custom-styles.css | grep -c 'transition'` returns 1 (one universal transition rule remaining)
  - `grep '\*,\s*$' -A 5 assets/css/custom-styles.css | grep 'transition' | grep -v "box-shadow\|opacity\|border-color"` — universal rule no longer has expensive properties
  QA scenarios:
  - Happy: `grep -A2 '\*,' assets/css/custom-styles.css | grep 'transition.*color.*background-color'` — universal only has 2 cheapest properties
  - Failure: search modal, lightbox, dark mode toggle show no animation (missing restored transitions)
  - Evidence: `.omo/evidence/css-performance-audit/task-4-transition-narrow.diff`
  Commit: Y | perf(css): narrow universal transition to cheap properties; restore expensive ones only on elements that need them

- [x] 5. Fix padding-left:hover → transform in tags.html
  What to do:
  - In `tags.html` (root level, not under assets/css):
    - Line ~269: Update the transition property — replace `padding-left` with `transform`
    - Line ~279: Change `padding-left: 1.9rem;` to `transform: translateX(0.5rem);`
    - Lines ~360-361: ALSO update the responsive `@media (max-width: 768px)` hover — change `padding-left: 1.4rem;` to `transform: translateX(0.35rem);`
    - If there's a corresponding transition in the responsive block, update it similarly
  Must NOT do: DO NOT remove the transition entirely — just update its property list. DO NOT miss the responsive override at lines ~360-361.
  Parallelization: Wave 2 | Blocked by: - | Blocks: -
  References:
  - `tags.html` — line ~269 (transition), line ~279 (padding-left:hover)
  - High-accuracy review v1: transition must be updated to include `transform` instead of `padding-left`
  Acceptance criteria:
  - `bundle exec jekyll build` exits 0
  - `grep -c "padding-left.*:.*1\.9rem" tags.html` returns 0 (old hover style removed)
  - `grep -c "transform.*translateX" tags.html` returns > 0 (new hover style present)
  QA scenarios:
  - Happy: `grep "transform" tags.html` shows translateX on hover
  - Failure: hover still uses `padding-left` (reflow) or transition missing `transform` (no animation)
  - Evidence: `.omo/evidence/css-performance-audit/task-5-hover-transform.diff`
  Commit: Y | perf(css): replace padding-left hover with transform translateX in tags

- [x] 6. Add CSS containment to safe targets
  What to do:
  - In `assets/css/custom-styles.css`:
    - Add `contain: layout style;` to `.blog-post article` (line ~877)
    - Add `contain: layout style paint;` to `.search-modal` (line ~329)
    - Add `contain: layout style;` to `.inline-toc` (line ~798)
    - Add `contain: layout style paint;` to `.lightbox` (line ~1003)
  - In `assets/css/beautifuljekyll.css` or custom-styles.css:
    - Add `content-visibility: auto;` and `contain-intrinsic-size: 400px;` to `.posts-list .post-preview` items at position N >= 4 (use CSS `:nth-child(n+4)` selector on `.posts-list .post-preview`)
  Must NOT do: DO NOT add `contain:` to `.navbar` (breaks `position: sticky`). DO NOT add `content-visibility: auto` to all posts (SEO risk for first 3 posts). DO NOT add `contain: paint` to any element with positioned children.
  Parallelization: Wave 2 | Blocked by: - | Blocks: -
  References:
  - `assets/css/custom-styles.css` — lines 329, 356, 798, 877
  - `assets/css/beautifuljekyll.css` — post-preview rules
  - `_layouts/home.html` — posts-list container
  Acceptance criteria:
  - `bundle exec jekyll build` exits 0
  - `grep -c "content-visibility\|contain:" assets/css/custom-styles.css` returns >= 4 (new containment rules added)
  - `grep "content-visibility" assets/css/*.css` shows content-visibility with nth-child or similar scoping (NOT on all posts)
  QA scenarios:
  - Happy: `grep -c "contain: layout style" assets/css/custom-styles.css` >= 3 elements have it
  - Failure: `grep "contain:" assets/css/custom-styles.css | grep "navbar"` — navbar should NOT have contain
  - Evidence: `.omo/evidence/css-performance-audit/task-6-containment.diff`
  Commit: Y | perf(css): add CSS containment to blog-post, search-modal, inline-toc, lightbox-overlay; content-visibility to post previews

- [x] 7. Remove unnecessary vendor prefixes
  What to do:
  - In `assets/css/beautifuljekyll.css`, remove these unnecessary vendor prefixes (add unprefixed-only equivalent where needed):
    - Remove `-webkit-` and `-moz-` prefix on all `transition` properties (still keep the unprefixed `transition:`)
    - Remove `-webkit-`, `-moz-` prefix on all `box-shadow` properties
    - Remove `-webkit-`, `-moz-`, `-o-` prefix on all `background-size` properties
    - Remove `-moz-` and `-ms-` prefix on `user-select` (keep `-webkit-user-select`)
  - In `assets/css/staticman.css`, remove `-webkit-transition:` (keep unprefixed `transition:`)
  - The specific lines to edit (approximate — verify exact lines before editing):
    - beautifuljekyll.css: ~162, 163, 182, 183, 195, 196, 354, 355, 361, 362, 371, 372, 676, 677, 679, 695, 696, 698, 699, 700, 738, 739, 920, 921, 922
  Must NOT do: Keep `-webkit-font-smoothing`, `-webkit-line-clamp`, `-webkit-scrollbar`, `::-moz-selection`, `-webkit-backdrop-filter` (404.html). Keep `-webkit-user-select` (still needed for Safari).
  Parallelization: Wave 3 | Blocked by: - | Blocks: -
  References:
  - `assets/css/beautifuljekyll.css` — full file, vendor prefix lines
  - `assets/css/staticman.css` — line ~117
  - Browser support: Chrome 90+, Firefox 90+, Safari 15.4+, Edge 90+
  - High-accuracy review v1: keep `-webkit-backdrop-filter` (404.html), `-webkit-font-smoothing`, `-webkit-line-clamp`, `-webkit-scrollbar`, `::-moz-selection`
  Acceptance criteria:
  - `bundle exec jekyll build` exits 0
  - `grep -E "\-webkit-transition|\-moz-transition|\-moz-box-shadow|\-webkit-box-shadow|\-webkit-background-size|\-moz-background-size|\-o-background-size|\-moz-user-select|\-ms-user-select" assets/css/beautifuljekyll.css` returns 0
  - `grep -E "\-webkit-backdrop-filter|\-webkit-font-smoothing|\-webkit-line-clamp|\-webkit-scrollbar|\-webkit-user-select|::-moz-selection" assets/css/*.css` still returns matches (necessary prefixes kept)
  QA scenarios:
  - Happy: `grep -c "\-webkit-transition" assets/css/beautifuljekyll.css` returns 0
  - Failure: Safari-specific behavior breaks (test with `-webkit-font-smoothing` or `-webkit-user-select`)
  - Evidence: `.omo/evidence/css-performance-audit/task-7-vendor-prefixes.diff`
  Commit: Y | chore(css): remove unnecessary vendor prefixes

- [x] 8. Fix duplicate declarations
  What to do:
  - In `assets/css/custom-styles.css`:
    - Merge the two `@media (prefers-reduced-motion: reduce)` blocks (lines ~290-297 and ~300-307) into one block. Keep the `0.01ms` values from the second block (they're slightly more permissive/safe). Delete the first block.
    - Fix `--shadow-lg` and `--shadow-xl` at lines ~68-69: change `--shadow-xl` to a distinct larger value, e.g., `0 4px 12px rgba(0, 0, 0, 0.08)` (or keep the identical value and add a comment, or remove the duplicate)
  - In `assets/css/beautifuljekyll.css`:
    - Find the `.pagination .page-item .page-link` rule block around lines ~808-818. Remove the FIRST `padding:` declaration (line ~814, `padding: 0.568rem 0.284rem;`) — it's immediately overridden by the second (line ~818, `padding: 0.682rem 0.909rem;`).
  Must NOT do: DO NOT remove the second pagination padding declaration (it's the active one). DO NOT combine the reduced-motion blocks if they're in different media query contexts.
  Parallelization: Wave 3 | Blocked by: - | Blocks: -
  References:
  - `assets/css/custom-styles.css` — lines 68-69, 290-297, 300-307
  - `assets/css/beautifuljekyll.css` — lines 808-818 (pagination)
  Acceptance criteria:
  - `bundle exec jekyll build` exits 0
  - `grep -c "@media (prefers-reduced-motion: reduce)" assets/css/custom-styles.css` returns 1 (merged)
  - `grep "shadow-xl" assets/css/custom-styles.css | grep -v "shadow-lg"` — shadow-xl value is different from shadow-lg
  - `grep "padding: 0\.568rem 0\.284rem" assets/css/beautifuljekyll.css` returns 0 (redundant declaration removed)
  QA scenarios:
  - Happy: `grep padding assets/css/beautifuljekyll.css | grep "page-link"` shows only ONE padding declaration
  - Failure: reduced motion still works (verify with `prefers-reduced-motion: reduce` in DevTools)
  - Evidence: `.omo/evidence/css-performance-audit/task-8-duplicates.diff`
  Commit: Y | chore(css): merge duplicate reduced-motion blocks, fix shadow-xl value, remove redundant pagination padding

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [x] F1. Build check — `bundle exec jekyll build --future` passes
- [x] F2. CSS payload comparison — 106,454 → 78,276 bytes (~28 KB saved, 26.5% reduction)
- [x] F3. Visual QA — all pages build and serve correctly (verified via _site/ output + curl HTTP 200)
- [x] F4. No regression — all existing posts render, search present, dark mode toggle present, social buttons intact
- [x] F5. Scope fidelity — all 9 Must-NOT items verified; only CSS/HTML files modified, no content files

## Commit strategy
- Each todo gets its own commit with the message shown in its Commit line
- Commits go to the current working branch
- Do not squash — keep atomic commits for traceability
- Commit order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

## Success criteria
1. `bundle exec jekyll build` passes cleanly
2. CSS payload reduced from ~102 KB to ~70 KB (verify via `wc -c`)
3. Universal `*` transition has only `color` and `background-color` properties
4. Social share buttons still render with correct colors on blog posts
5. Tag hover on tags page uses `transform: translateX()` (compositor-only)
6. Post previews #4+ use `content-visibility: auto` (verify via DevTools)
7. `.navbar` does NOT have `contain:` (sticky positioning preserved)
8. No `prefers-reduced-motion` or `prefers-color-scheme` was added (already existed)
9. No `.post-image` or search overlay selectors were removed
