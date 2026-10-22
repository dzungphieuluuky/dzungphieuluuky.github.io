# Intent Diff — ULW UI/UX + Performance Research

Core question: What are the best UI/UX principles and performance optimization strategies applicable to this Jekyll static site blog/portfolio (dzungphieuluuky.github.io), with cited evidence?

## Expected Truths (from user intent + project constraints)

| intent_id | Expected Truth | Observed Reality | Diff | Violated Invariant? | Intent Source | Supporting Observations | Status |
|-----------|---------------|------------------|------|---------------------|---------------|------------------------|--------|
| IT-01 | Site must remain on Jekyll/GitHub Pages (no migration) | Confirmed: _config.yml, Gemfile, .github/workflows all Jekyll | None | No | Scope rules from portfolio-uiux-improvements plan | Project root has Gemfile, _config.yml, .github/workflows/ci.yml | true |
| IT-02 | No JS frameworks allowed (vanilla only) | Confirmed: custom-script.js uses vanilla JS modular pattern | None | No | Scope rules | custom-script.js is vanilla JS with object literals | true |
| IT-03 | Homepage must be research-first hierarchy | Implemented: Research Statement → Project Cards → Publications → Blog → About | None | No | portfolio-uiux-improvements Todo 3 | index.md has new structure | true |
| IT-04 | Reading width 728px (Substack standard) | Confirmed in custom-styles.css | None | No | DESIGN_BRIEF.md / plan decisions | custom-styles.css line ~82 | true |
| IT-05 | Font stack: Be Vietnam Pro + Lora + JetBrains Mono | Confirmed in custom-styles.css + head.html | None | No | DESIGN_BRIEF.md | head.html loads all 3 from Google Fonts | true |
| IT-06 | Monochrome + black accent palette | Confirmed in custom-styles.css :root variables | None | No | DESIGN_BRIEF.md | CSS variables are grayscale | true |
| IT-07 | Font Awesome fully removed | Confirmed: no font-awesome link in head.html, no fa- classes in nav.html | None | No | portfolio-uiux-improvements Todo 1 | verified in previous wave | true |
| IT-08 | PostEntrance animation removed | unknown — needs verification | TBD | unknown | portfolio-uiux-improvements Todo 2 | needs grep check | unknown |
| IT-09 | Current total CSS transferred is ~64KB (custom + beautifuljekyll) | custom-styles.css: 40KB + beautifuljekyll.css: 23KB = 63KB | None | No | Baseline measurement | File sizes: 40579 + 23711 bytes | true |
| IT-10 | Current total JS transferred is ~35KB | custom-script.js: 30KB + beautifuljekyll.js: 4.6KB = 34.6KB | None | No | Baseline measurement | File sizes: 30068 + 4619 bytes | true |
| IT-11 | Images are not optimized for modern formats (no WebP/AVIF) | All images in assets/img/ are .png, .jpg, .ico, .svg — no .webp or .avif | Gap: no modern format usage | No | Baseline observation | 29 image files, all legacy formats | true (gap identified) |
| IT-12 | Site likely has CWV issues from font loading + image sizes | unknown — needs measurement (blocked, no live server) | TBD | unknown | Industry knowledge | Google Fonts loads 3 families, 29 unoptimized images | unknown |
| IT-13 | JS loads on every page regardless of need | custom-script.js has 12 modules, all initialize on DOMContentLoaded | Potential issue: modules like SchemaMarkup, EnhancedSearch init on pages that don't need them | No | Previous analysis from draft | custom-script.js init pattern | true (gap identified) |
| IT-14 | CSS has been cleaned of bloat but may still have optimization opportunities | CSS was cleaned in Todo 2 (removed animations, deduplicated keyframes), but 40KB is still large | TBD — needs audit | unknown | portfolio-uiux-improvements draft | custom-styles.css 40KB | unknown |
