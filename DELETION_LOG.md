# Code Deletion Log

## [2026-07-13] Refactor Session — Dead Code Cleanup

### Duplicate Script Loading Fixed
- `_layouts/default.html` — Removed duplicate MathJax + Mermaid script tags (both already loaded via `_layouts/base.html`). Eliminated redundant network requests on every page.

### Duplicate CSS Removed
- `assets/css/custom-styles.css` — Removed duplicate `@import url()` for Google Fonts (appeared twice in the same file).
- `assets/css/custom-styles.css` — Removed duplicate `#reading-progress { transition: ... }` rule and merged into main rule.
- `assets/css/custom-styles.css` — Removed duplicate `.lightbox.active .lightbox-content img` animation (same rule appeared in both animation section and lightbox section).

### Unused CSS Declarations Removed
- **Callout variables**: `--callout-note-bg`, `--callout-note-border`, `--callout-tip-bg`, `--callout-tip-border`, `--callout-warn-bg`, `--callout-warn-border` — CSS variables defined in `:root` and `html.dark-mode` but never referenced by any selector.
- **`.post-thumbnail`** responsive rule — No `.post-thumbnail` exists anywhere in templates or HTML.
- **`.post-share-bar`** in print media query — `.post-share-bar` was already removed previously; leftover reference cleared.

### Unused CSS Selectors (already gone from earlier pass, verified clean)
- `share-btn`, `post-share-bar`, `post-share-label`, `callout`, `footnote-ref`, `footnotes-section`, `footnotes-list`, `series-banner`, `code-meta`, `line-numbers`, `line-numbers-rows`, `toc-collapsed`, `post-month-group` — all confirmed absent from CSS file.

### Unused JS Dead Code Removed
- `assets/js/custom-script.js` — Removed `CONFIG.NAVBAR_HEIGHT: 58` (unused constant).
- `assets/js/custom-script.js` — Removed `PostTableOfContents.allExpanded = false` (unused property, never toggled).

### Impact
- **Files modified**: 3
  - `_layouts/default.html` (10 lines removed)
  - `assets/css/custom-styles.css` (329 lines removed: 1647 → 1318)
  - `assets/js/custom-script.js` (2 lines removed)
- **Lines of code removed**: ~240 (net diff)
- **CSS bundle reduction**: ~20% smaller

### Build Verification
- `bundle exec jekyll build` — PASS (no errors related to changes)

### Safety
- All changes verified via grep for remaining references to removed classes/selectors
- No dynamic imports affected
- No public API surface changed
- Pre-existing `_site/index.html` conflict unrelated to this session

### Notes
- `.search-hint` in `search.md` (404 page) has CSS class in HTML but no corresponding CSS rule — minor, not breaking.
- `--table-radius`, `--table-border-strong`, `--table-cell-bg` CSS variables kept for potential future use in table styling.

## [2026-10-22] Minimalist Redesign — Effects & Controls Removal

### Controls Removed (buttons/widgets)
- `assets/js/custom-script.js` — Removed `ScrollManager`, `ReadingProgress` (reading progress bar), `ScrollToTop` (floating button), and `ReadMode` (read-mode toggle) modules. Removed `SCROLL_TO_TOP_THRESHOLD` from `CONFIG`.
- `_layouts/post.html` — Removed the `.read-mode-toggle` button from the metadata bar.
- `assets/css/custom-styles.css` — Removed all `#reading-progress`, `#scroll-to-top`, `.read-mode-toggle`, and `html.read-mode` rules.

### Effects Removed
- `assets/css/custom-styles.css` — Removed all `transition`/`animation`/`@keyframes` declarations (global `*` transition, lightbox zoom, modal fades); state changes are now instant.
- `assets/css/custom-styles.css` — Removed animated gradient link underline; replaced with `text-decoration: underline` on hover.
- `assets/css/custom-styles.css` — Removed `--shadow-sm`/`--shadow-md`/`--shadow-lg` variables and their uses; kept only `--shadow-xl` for the lightbox overlay. Removed `pre` inset shadow, table row hover, `.lightbox-content img:hover` scale, custom scrollbar styling, `--table-row-hover`.

### Visual Restyle (typography per reference blogs)
- `--reading-font-size` 15px root × 1.175rem → 16px root × 1.06rem; `--reading-line-height` 1.8 → 1.7; mobile 1.125rem → 1rem.
- Removed `letter-spacing`/`word-spacing` on `body`; metadata bar no longer uppercase.
- `.post-toc-box` flattened: no background/border card, hairline top border only.
- `.blog-tags` links: plain gray text, no chip border/background.
- Code `copy-btn` now invisible until `pre:hover` or focus.

### Build Verification
- `bundle exec jekyll build --future` — PASS (baseline and post-change).

### Notes
- `fresh-badge` text in metadata keeps inline text style (no dedicated CSS existed).
- `.copy-btn .copied` no longer inverts to black background; single-weight feedback kept in both themes.

## [2026-10-22] Simplification Pass — JS and CSS

### JS: 713 → 356 lines
- `TocHighlight` deleted — it toggled `.active` on TOC links but no CSS rule existed for it.
- `AutoNumbering` deleted — kramdown already emits heading ids (verified in built HTML).
- `ReadingTime` deleted — reading time and word count are now computed by Liquid in `_layouts/post.html`.
- `EnhancedSearch` rewritten from 388 lines to ~110: simple substring filter with diacritic folding, same modal, same keyboard controls.
- `DarkMode` collapsed to one `preferred()` / `apply()` pair; duplicate aria-label logic removed.
- `escapeHtml` and `normalize` helpers are now shared by search and the `/search/` page.

### /search/ page: 247 → 57 lines
- Inline 100-line JS replaced with a 40-line consumer of the shared `window.SiteSearch` API.
- 150-line inline `<style>` block deleted; page styles moved to `custom-styles.css` (14 lines).
- Removed stale blue accent `rgba(63, 81, 181, …)`, hover transforms, and card borders from the page.

### CSS: 1,164 → 1,123 lines
- Deleted 12 unused variables (`--palette-*`, `--accent-hover/light/subtle`, `--bg-secondary`, `--bg-elevated`, `--border-secondary`, `--border-focus`, `--radius-xl`, `--reading-font-size-sm`, `--table-radius`, `--table-cell-bg`).
- Removed duplicate declarations: `--table-border-strong`, `--table-header-bg`, `contain` in `.lightbox`, two `.blog-post` blocks.
- Defined `--table-header-bg` in `:root` (it was referenced but undefined, so the header band only appeared in dark mode).
- Removed redundant dark-mode table, post-preview, copy-button, and blockquote rules; variables now carry those values.
- `.copy-btn` background uses `--code-bg`, so it needs no dark override.
- Stale section list in the header comment replaced with the actual structure.

### Verification
- `bundle exec jekyll build --future` — PASS.
- Rendered post shows `9 min read`, `2,112 words`, TOC markup, and search modal.
- `node --check assets/js/custom-script.js` — PASS.

## [2026-10-22] Body Font — Lora → Source Serif 4

- `_includes/head.html` — Single Google Fonts request now loads Be Vietnam Pro, Source Serif 4 (italic + optical size), and JetBrains Mono.
- Removed the invalid `&subset=vietnamese` parameter. The css2 API ignores it and already returns the Vietnamese unicode-range block.
- `_layouts/base.html` — Removed the theme's separate Lora request (one render-blocking font request less).
- `assets/css/custom-styles.css` — `--font-serif` and the theme's `--body-font` both point to Source Serif 4, with Lora as fallback.
- Removed duplicate `--radius-lg` and `--navbar-height` declarations left over from the simplification pass.

### Verification
- `bundle exec jekyll build --future` — PASS.
- Fonts URL returns HTTP 200 with all 3 families and 9 `/* vietnamese */` blocks.
- Built CSS: `body` uses `var(--font-serif)`; `custom-styles.css` loads after `beautifuljekyll.css`.
- Browser check in both themes still pending.

- 2026-10-22 Layout/size/width matched to alexwang.ai /posts/associative-memory/: page frame 964/900, article 884px, body 16px base / article 20px 1.65, headings 30/23.4px, hairline tables/callouts, TOC details + fixed rail >=1360px.
