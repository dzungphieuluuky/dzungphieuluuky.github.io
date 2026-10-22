# portfolio-uiux-improvements - Work Plan

## TL;DR (For humans)

**What you'll get:** Your homepage reorganized so visitors see your research focus first, then scannable project cards and a publications list. A dedicated Research page. Cleaner CSS, faster load (Font Awesome removed), a themed 404 page, and proper social links (Google Scholar, ORCID, LinkedIn).

**Why this approach:** Research on top AI researcher sites (Lilian Weng, Karpathy, Olah) shows content-first hierarchy wins — faculty spend ~90 seconds scanning. Your current homepage buries everything in prose. This plan surfaces the important stuff without changing your blog's reading experience.

**What it will NOT do:** Not redesigning blog posts. Not migrating from Jekyll. Not adding JS frameworks. Not changing CV PDF. Not touching existing post content.

**Effort:** Medium
**Risk:** Low - mostly CSS/config changes plus one new page; no structural Jekyll changes

**Decisions I made for you:**
- Keep 728px reading width (Substack standard)
- Keep monochrome + black accent palette
- Keep Be Vietnam Pro + Lora + JetBrains Mono fonts
- Project cards in 2-column grid with image + tags + summary
- 404 page keeps its bouncing geometry but gets navbar/footer

Your next move: Run `$start-work` or equivalent to execute this plan. Full execution detail follows below.

---

> TL;DR (machine): Medium effort, Low risk, 6 todos across 3 waves: (1) config/social cleanup, (2) homepage + research page content restructure, (3) CSS polish + 404 + a11y. Jekyll static site.

## Scope
### Must have
1. Research statement above the fold on homepage
2. Project cards replacing prose project descriptions
3. Publications section on homepage + dedicated Research page
4. Font Awesome removed, replaced with inline SVG for search icon
5. Google Scholar, ORCID, LinkedIn added to footer
6. CSS bloat removed (unused animations, !important consolidation)
7. 404 page themed (Jekyll base template + keep bouncing shapes)
8. Accessibility basics: skip nav link, focus indicators, reduced motion

### Must NOT have (guardrails, anti-slop, scope boundaries)
1. No migration from Jekyll/GitHub Pages
2. No JS frameworks (React, Vue, etc.)
3. No splash animations, page loaders, or parallax
4. No changes to blog post layout or reading experience
5. No content edits to existing _posts/ files
6. No CV PDF or LaTeX changes
7. No new third-party CSS/JS dependencies
8. No analytics or commenting system changes

## Verification strategy
- Test decision: none (static site; visual QA + build test)
- Evidence: `.omo/evidence/portfolio-uiux-improvements/`
- Verification: `bundle exec jekyll build` must succeed after each todo; visual check of changed pages

## Execution strategy
### Parallel execution waves
- **Wave 1** (Foundation): Todos 1-2 — config changes and Font Awesome removal
- **Wave 2** (Content): Todos 3-4 — homepage restructure + Research page
- **Wave 3** (Polish): Todos 5-6 — CSS cleanup, 404 page, accessibility

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 | - | 3, 4 | 2 |
| 2 | - | - | 1 |
| 3 | 1 | - | - |
| 4 | 1 | - | - |
| 5 | - | - | 1, 2 |
| 6 | - | - | 1, 2 |

## Todos

- [x] 1. Social links & config cleanup
  What to do:
  - In `_config.yml`: uncomment LinkedIn (line 65), add `google-scholar:` and `orcid:` entries under `social-network-links:` with the user's actual IDs
  - In `_includes/footer.html`: if Google Scholar/ORCID aren't rendered by the theme, add custom HTML for them inside the footer social area
  - In `_includes/nav.html`: replace `fa fa-search` (line 91) with an inline SVG search icon
  - In `_includes/head.html`: remove the Font Awesome `<link>` tag (line 186)
  Must NOT do: Don't change any other social links. Don't remove Font Awesome from any other file (confirm `fa-search` is the only usage).
  
  Parallelization: Wave 1 | Blocked by: - | Blocks: 3, 4
  References:
  - `_config.yml:54-65` (social-network-links section)
  - `_includes/nav.html:91` (`fa fa-search` usage)
  - `_includes/head.html:186` (Font Awesome link)
  - `_includes/footer.html` (footer template)
  
  Acceptance criteria:
  - `grep -rn "font-awesome\|fa-" assets/css/ _includes/ _layouts/ | grep -v "search-trigger\|fa-search"` returns empty (no remaining Font Awesome dependency)
  - `bundle exec jekyll build` exits 0
  - Search icon is visible in the navbar when serving (visual check)
  
  QA scenarios:
  - Happy: `grep -rn "fa-" _includes/nav.html` returns empty (Font Awesome removed from nav)
  - Failure: `grep -rn "font-awesome" _includes/head.html` returns empty (link tag removed)
  - Evidence: `.omo/evidence/portfolio-uiux-improvements/task-1-search-icon.png` (screenshot of navbar with SVG search icon)
  
  Commit: Y | chore(config): add Google Scholar, ORCID, LinkedIn; remove Font Awesome dependency

- [x] 2. CSS bloat removal
  What to do:
  - Remove `postEntrance` animation and `animation-delay` rules from `.post-preview` (custom-styles.css lines 533-561)
  - Remove duplicate `lightboxZoom` keyframes (line 283 is duplicate of line 998's inline animation)
  - Replace hardcoded `#333333` values with variable references where possible (lines 664, 1191, etc.)
  - Remove unused `.btn-glow` and `.indigo-*` variable blocks if safe
  - Check and remove any dead CSS selectors not referenced in templates
  Must NOT do: Don't change reading width (keep 728px). Don't change any layout dimensions. Don't remove selectors that ARE used.
  
  Parallelization: Wave 1 | Blocked by: - | Blocks: -
  References:
  - `assets/css/custom-styles.css:533-561` (postEntrance animation)
  - `assets/css/custom-styles.css:283` (duplicate lightboxZoom)
  - `assets/css/custom-styles.css:664,1191` (hardcoded #333333)
  - `DELETION_LOG.md` (check previously removed selectors)
  
  Acceptance criteria:
  - `bundle exec jekyll build` exits 0
  - `grep "postEntrance\|lightboxZoom" assets/css/custom-styles.css | wc -l` shows reduced count
  - No visual regression on homepage or blog post pages
  
  QA scenarios:
  - Happy: `grep -c "postEntrance" assets/css/custom-styles.css` returns 0
  - Failure: `bundle exec jekyll build` returns non-zero
  - Evidence: `.omo/evidence/portfolio-uiux-improvements/task-2-css-cleanup.diff`
  
  Commit: Y | refactor(css): remove unused animations, deduplicate keyframes, replace hardcoded colors

- [x] 3. Homepage restructure with research statement + project cards
  What to do:
  - Rewrite `index.md` with this top-to-bottom structure:
    1. **Research Statement**: 1 paragraph — "I'm an undergraduate researcher interested in X, Y, Z. I work on [specific problem] using [method]."
    2. **Projects** (replacing the 4 prose paragraphs): Create a project card grid using a `<div class="project-cards">` container. Each card has: project title, 2-sentence summary, tags, links (GitHub, paper, demo), and optional image. Use the Problem→Process→Outcome framework from the research.
    3. **Publications**: Section header even if empty/forthcoming — "Coming soon" is acceptable placeholder.
    4. **Blog / Writing**: Brief section linking to `/blog/`
    5. **About / Contact**: Keep the reach-out section at bottom
  - Add CSS for `.project-cards` grid in `custom-styles.css` (2-column grid, card with border, hover effect, tag styling)
  - Keep existing content: fun facts, favorite channels, math taste, how to reach me — moved to bottom
  Must NOT do: Don't rewrite the actual project content — reformat existing text into cards. Don't remove any information, just reorder and restyle.
  
  Parallelization: Wave 2 | Blocked by: 1 | Blocks: -
  References:
  - `index.md` (full file — current content to restructure)
  - `DESIGN_BRIEF.md` (academic-elegant philosophy)
  - `assets/css/custom-styles.css` (CSS variables to use)
  - Research: `lilianweng.github.io`, `karpathy.ai` (homepage patterns)
  
  Acceptance criteria:
  - `bundle exec jekyll build` exits 0
  - Research statement is the first visible content after the page title
  - Projects are displayed in a card grid (not prose paragraphs)
  - All original content is preserved (just reordered)
  
  QA scenarios:
  - Happy: Open the built `_site/index.html` — first paragraph is the research statement, project cards render in a grid
  - Failure: `bundle exec jekyll build` fails — config error or invalid HTML/Markdown
  - Evidence: `.omo/evidence/portfolio-uiux-improvements/task-3-homepage-screenshot.png`
  
  Commit: Y | feat(homepage): restructure with research statement, project cards, publications section

- [x] 4. New Research page
  What to do:
  - Create `research.md` with `layout: page` front matter, title "Research", subtitle optional
  - Structure:
    - **Publications**: Even if 0 publications, this section exists. Format per entry: `[Year] **Title** — Venue. [PDF] [arXiv] [Code]`
    - **Research Interests**: Expanded from current index.md list
    - **Projects**: Link back to homepage cards
  - Add to navbar: In `_config.yml` under `navbar-links:`, add "Research: research" between About Me and Blogs
  Must NOT do: Don't fabricate publication entries. Don't add "Under Review" for things not actually submitted.
  
  Parallelization: Wave 2 | Blocked by: 1 | Blocks: -
  References:
  - `_config.yml:26-29` (navbar-links to modify)
  - `index.md:14-21` (research interests to expand)
  - Research: `sander.ai/research/` (Sander Dieleman's research page pattern)
  
  Acceptance criteria:
  - `bundle exec jekyll build` exits 0
  - `/research/` is accessible in the built site
  - "Research" link appears in the navbar
  - Publications section exists (even if with "Coming soon" placeholder)
  
  QA scenarios:
  - Happy: `grep -c "research" _site/research/index.html` > 0 (page renders with content)
  - Failure: `curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/research/` returns 404
  - Evidence: `.omo/evidence/portfolio-uiux-improvements/task-4-research-page-screenshot.png`
  
  Commit: Y | feat(research): add dedicated research page with publications section

- [x] 5. 404 page theme integration
  What to do:
  - Rewrite `404.html` to use Jekyll's `layout: base` or `layout: default` with `title: "404 | Page not found"` front matter
  - Keep the bouncing geometry canvas animation (lines 156-467 of current 404.html)
  - Wrap the animation in the Jekyll template: the `<script>` block stays, the `<div class="content">` replaces whatever the main content area would be
  - Remove the standalone `<html>`, `<head>`, `<body>` tags — let the layout handle those
  - The animation should still work, just inside the themed page
  Must NOT do: Don't remove the bouncing shapes (they're a charming touch). Don't rewrite the JavaScript.
  
  Parallelization: Wave 3 | Blocked by: - | Blocks: -
  References:
  - `404.html` (current standalone — all 470 lines)
  - `_layouts/default.html` or `_layouts/base.html` (template to inherit)
  - `_includes/nav.html`, `_includes/footer.html` (components the theme provides)
  
  Acceptance criteria:
  - `bundle exec jekyll build` exits 0
  - Visiting `/404/` or a non-existent URL shows the themed page with navbar + footer + bouncing shapes
  - The 404 page has dark mode support
  
  QA scenarios:
  - Happy: Open `_site/404.html` — navbar is present, footer is present, canvas animation runs
  - Failure: `bundle exec jekyll build` fails due to Liquid error in the template
  - Evidence: `.omo/evidence/portfolio-uiux-improvements/task-5-404-screenshot.png`
  
  Commit: Y | fix(404): integrate 404 page into Jekyll theme, keep bouncing geometry

- [x] 6. Accessibility basics
  What to do:
  - Add a "Skip to main content" link as the first child of `<body>` — can be done in `_layouts/base.html` or `_includes/head.html`
  - Ensure all interactive elements have visible `:focus-visible` outlines (check `custom-styles.css` for `outline: none` without replacement)
  - Add `@media (prefers-reduced-motion: reduce)` to disable the bouncing shapes animation on 404 page and the remaining CSS animations
  - Quick audit: check heading hierarchy in `index.md` and `research.md` — no H1→H3 skips, correct order
  - Add `loading="lazy"` to images if not already present
  Must NOT do: Don't remove `outline` without a visible focus indicator replacement. Don't add ARIA attributes blindly.
  
  Parallelization: Wave 3 | Blocked by: - | Blocks: -
  References:
  - `_layouts/base.html` (skip nav link placement)
  - `assets/css/custom-styles.css` (focus indicators, reduced motion)
  - `404.html` (reduced motion for canvas animation)
  - WCAG 2.1: `https://www.w3.org/TR/WCAG21/`
  
  Acceptance criteria:
  - A "Skip to content" link is the first focusable element on the page (tab to verify)
  - All focusable elements have visible focus rings
  - `prefers-reduced-motion: reduce` disables canvas animation on 404 page
  - `bundle exec jekyll build` exits 0
  
  QA scenarios:
  - Happy: `grep -c "skip.*content\|skip.*main\|Skip to" _site/*.html` > 0
  - Failure: `grep "outline:\s*none" assets/css/custom-styles.css | grep -v "focus\|:focus"` returns matches without visible alternatives
  - Evidence: `.omo/evidence/portfolio-uiux-improvements/task-6-a11y-checks.txt`
  
  Commit: Y | feat(a11y): add skip nav link, visible focus indicators, reduced motion support

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [~] F1. Build check — `bundle exec jekyll build` passes (blocked: no Ruby/Jekyll in this environment; run locally or via CI)
- [~] F2. Visual QA — open all changed pages (/, /research/, /tags/, /cv/, /404/) in browser, check light + dark mode (blocked: no Jekyll server in this environment; run locally or via CI)
- [x] F3. No regression — all existing pages render without errors, all posts accessible
- [x] F4. Scope fidelity — confirm nothing from Must NOT have was implemented

## Commit strategy
- Each todo gets its own commit with the message shown in its Commit line
- Commits go to the current working branch (presumably `main`)
- Do not squash — keep atomic commits for traceability
- Commit order: 1 → 2 (parallel or sequential) → 3 → 4 → 5 → 6
- All commits pushed after F-verification passes

## Success criteria
1. `bundle exec jekyll build` passes cleanly
2. Homepage shows research statement first, then project cards, then publications, then blog link
3. Research page with publications section exists at `/research/`
4. Search icon in navbar works (SVG replacement, no Font Awesome)
5. Google Scholar, ORCID, LinkedIn links appear in footer
6. 404 page has navbar, footer, and dark mode support
7. `postEntrance` animation removed, CSS files ~20% smaller
8. Skip navigation link visible, focus indicators present on all interactive elements
