# Plan: Remove Inline TOC + Readability Pass

**Context:** Remove the sidebar inline TOC (`.toc-wrapper > .inline-toc`) from post pages. Keep only the `.post-toc-box` at the start of `<article>` as the single Table of Contents. Apply readability spacing improvements referenced from the Wowchemy/HugoBlox template — figure margins adjusted from 3rem to 2rem.

**Status:** Ready for execution.

**Design constraints:** Grayscale palette (no accent color). Lora for body text (`--font-serif`), Be Vietnam Pro for UI (`--font-sans`). Text-only minimal design (no SVG icons or emoji).

---

## Research sources

- **Wowchemy typography:** `hugoblox.com/docs/guide/building/typography` — heading line-height 1.2, body line-height 1.6, heading letter-spacing -0.02em, caps letter-spacing 0.05em
- **Wowchemy content spacing:** `github.com/HugoBlox/hugo-blox-builder/blob/main/modules/wowchemy/assets/scss/wowchemy/elements/_content.scss` — figure/video margins 2rem, article container max-width 760px
- **Wowchemy params.yaml:** spacing density "spacious", font pack "academic" (Lora + Source Serif 4)
- **DESIGN.md:** Geist palette (grayscale, high-contrast, restrained color)
- **DESIGN_BRIEF.md:** "serif reads" philosophy, generous leading, academic elegance

---

## Scope IN

1. **Remove sidebar TOC HTML/CSS** — delete `.toc-wrapper` + `.inline-toc` from `_layouts/post.html:42-50`. Delete all CSS for `.toc-wrapper`, `.inline-toc`, `.toc-expand-toggle`, `.inline-toc::before` from `custom-styles.css:748-844`. (`.toc-toggle-btn` exists only as JS-generated HTML — no CSS rules.)
2. **Update PostTableOfContents JS** — remove sidebar generation code: `.toc-wrapper` + `.inline-toc` DOM creation (lines 298-320), `buildTocItemsHtml()` function (325-353), sidebar HTML population (line 366), expand/collapse click handler (389-399). Keep `.post-toc-box` generation (368-387).
3. **Update TocHighlight** — change line 161 from `'.inline-toc a, .toc-container a, .post-toc-box a'` to `'.post-toc-box a'` (`.toc-container a` is orphaned — no CSS or HTML uses it).
4. **Remove blog-post grid layout** — delete the ≥1520px CSS grid at `custom-styles.css:889-914` and the `.blog-post .toc-wrapper { display: none; }` default at line 888. Blog-post returns to single-column centered (max-width 728px).
5. **Polish `.post-toc-box`** — margins/padding adjustments only if needed for visual weight as sole TOC. No structural HTML changes. Must stay within AGENTS.md padding limit (≤1.25rem 1.5rem).
6. **Readability spacing pass** — reduce `img` margin-top from 3rem to 2rem (line 945), `figcaption` margin-bottom from 3rem to 2rem (line 953). Keep line-height 1.8 (deliberate for Lora + Vietnamese diacritics).
7. **Transition cleanup** — remove `.inline-toc a` from underline-exclusion list at `custom-styles.css:404,412`.
8. **Rename `post-with-inline-toc` class** — change to `post-layout` on `_layouts/post.html:8` (zero CSS rules — Bootstrap grid unaffected).
9. **Dark mode cleanup** — remove `.inline-toc` overrides at `custom-styles.css:1384-1392`.
10. **Print style cleanup** — remove `.toc-wrapper` from print `display: none` list at `custom-styles.css:1415`.
11. **Build verification** — `bundle exec jekyll build --future` must exit 0. Manual: post page has one TOC (`.post-toc-box`), no sidebar TOC.

---

## Scope OUT (Must NOT have)

- No `.post-toc-box` structural changes — margins/padding only
- No body font, font-size, line-height, or reading width changes
- No `beautifuljekyll.css` edits
- No page header, navbar, footer, or home page changes
- No JS module re-architecture (only remove sidebar-specific code)
- No accent colors or decorative elements
- No changes to grayscale palette
- No changes to JS init order in DOMContentLoaded

---

## Files to modify

| File | What changes |
|------|-------------|
| `_layouts/post.html` | Remove `.toc-wrapper` + `.inline-toc` block (lines 42-50). Rename `post-with-inline-toc` class to `post-layout` (line 8) |
| `assets/css/custom-styles.css` | Remove ~96 lines of sidebar TOC CSS (748-844), remove grid layout (888-914), remove dark mode TOC overrides (1384-1392), remove from transition list (404,412), remove from print (1415). Adjust figure margins (945,953) |
| `assets/js/custom-script.js` | Remove sidebar generation in `PostTableOfContents` (298-320, 325-353, 366, 389-399). Update `TocHighlight` selector (161) |

---

## Dependency order

```
Tasks 1-5, 7-10 (independent) → can run in parallel
Task 6 (readability) → independent
Task 11 (build) → final, after all others
```

---

## Todos

- [x] 1. Remove sidebar TOC from post.html and custom-styles.css
- [x] 2. Update PostTableOfContents JS — remove sidebar generation, keep post-toc-box
- [x] 3. Update TocHighlight querySelector — only `.post-toc-box a`
- [x] 4. Remove blog-post grid layout at ≥1520px
- [x] 5. Polish `.post-toc-box` margins/padding as sole TOC
- [x] 6. Adjust figure margins (3rem→2rem) referencing Wowchemy
- [x] 7. Remove `.inline-toc a` from transition exclusion list
- [x] 8. Rename `post-with-inline-toc` class to `post-layout`
- [x] 9. Remove dark mode `.inline-toc` CSS overrides
- [x] 10. Remove `.toc-wrapper` from print styles
- [x] 11. Build verification

---

## Final verification wave

- [x] F1. `bundle exec jekyll build --future` exits 0
- [x] F2. Post page DOM: no `.toc-wrapper` or `.inline-toc` elements
- [x] F3. Post page: `.post-toc-box` renders with correct heading links inside `<article>`
- [x] F4. TOC active highlighting follows scroll position (`.post-toc-box a.active`)
- [x] F5. Browser ≥1520px: single centered column (728px), no sidebar gap
- [x] F6. Browser <1520px: no visual regression (sidebar was already hidden)
- [x] F7. Images: `margin-top: 2rem`, figcaption: `margin-bottom: 2rem`
- [x] F8. Dark mode toggle: all TOC elements use CSS variables, no orphaned `.inline-toc` styling
- [x] F9. H1-only post: `.post-toc-box` renders with H1 entries, no console errors
- [x] F10. Mobile (<768px): layout same as before (sidebar was always hidden on mobile)
- [x] F11. TOC padding ≤ 1.25rem 1.5rem (AGENTS.md limit)

---

## Evidence ledger

Each task is complete when:
1. The intended CSS/HTML/JS change exists in the respective file
2. The QA verification for that task passes
3. `bundle exec jekyll build --future` passes
4. Visual inspection confirms the change in browser (developer can verify)

---

## Risk notes

- **JS surgery risk:** Sidebar TOC and post-toc-box generation share the same `PostTableOfContents.init()` function. Removing sidebar code (lines 298-366, 389-399) must NOT accidentally delete or modify post-toc-box code (lines 368-387). `buildTocItemsHtml()` (sidebar) and `buildPostTocHtml()` (post-toc-box) are separate functions — safe to remove one.
- **Grid removal:** Blog-post grid at ≥1520px currently controls both sidebar placement AND content column width. Removing it means blog-post uses default single-column centering — verify no content width regression.
- **Dead CSS:** Removing only the sidebar TOC selectors (`.toc-wrapper`, `.inline-toc`, `.toc-expand-toggle`) from custom-styles.css is safe — these selectors are isolated and don't overlap with other features. Grep-verify before deleting.
- **Edge case — no headings:** `PostTableOfContents.init()` returns early if `headers.length < 1` (JS line 323). `TocHighlight` also returns early (JS line 160). Both handle gracefully.
- **Edge case — H1 only:** Works correctly — both modules handle H1 through H3.
