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
