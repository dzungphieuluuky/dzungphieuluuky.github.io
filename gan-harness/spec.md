# GAN Design Brief: Immersive Blog Reading Experience

## Goal
Improve `assets/js/custom-script.js` and `assets/css/custom-styles.css` to deliver a simple, professional, immersive blog reading experience.

## Current State
- Jekyll static blog on Beautiful Jekyll theme v6.0.1
- Geist design system with Substack-minimalist aesthetic
- Typography: Outfit (headers), Lora (body), JetBrains Mono (code)
- Pure grayscale palette, no saturation
- Modular JS: DarkMode, ReadingProgress, TocHighlight, CodeCopy, ImageLightbox, EnhancedSearch
- Full black/white with subtle grays
- Read mode toggle (distraction-free)
- Sidebar TOC on wide screens, inline TOC on narrow
- All CSS animations/transitions disabled (`animation: none !important; transition: none !important;`)
- Fonts: `Merriweather`, `Be Vietnam Pro`, `JetBrains Mono`

## Design Requirements

### Visual
- Typographic hierarchy that feels like a premium newsletter/magazine
- Generous whitespace — clean, airy, not cramped
- Reading width ~720px core content
- Serif body for long-form reading comfort
- Minimalist: nothing that doesn't serve the reading experience
- Subtle micro-interactions (restore transitions/animations with restraint)
- Dark mode that feels equally refined

### Interactive
- Progress bar: smooth, unobtrusive
- Scroll-to-top: subtle fade
- Image lightbox: fluid zoom
- Code copy: instant feedback
- Search: fast, keyboard-navigable
- TOC: sticky on wide, collapsible on narrow
- Read mode: truly distraction-free

### Quality Targets
- No visual clutter
- Sub-100ms interaction feedback
- 90+ Lighthouse performance
- Accessible (WCAG AA contrast)
- Fluid down to 320px viewport

## Non-Goals
- Color beyond grayscale + accent
- Complex layouts or animations
- Framework/library additions
- Backend or build changes

## Generator Pass 1 — Changes Applied

### CSS
1. **Fonts**: Merriweather + Be Vietnam Pro → Outfit (headings) + Lora (body) + JetBrains Mono (code)
2. **Font vars**: `--font-serif: Lora`, `--font-sans: Outfit`, `--font-display: Outfit`
3. **Reading width**: 900px → 728px (newsletter-column comfort)
4. **Line height**: 1.75 → 1.8
5. **Removed** blanket `animation: none !important; transition: none !important;`
6. **Added** universal `transition` rule + `prefers-reduced-motion` respect
7. **Micro-interactions**: progress bar transition, lightbox fadeIn, scroll-to-top fade+translate, search modal fade, post-preview hover bg, button/link transitions, image lightbox scale on hover
8. **Dark mode**: blockquote `#1E293B` → transparent; text #FFFFFF → #F0F0F0/D4D4D4/A8A8A8
9. **Montserrat** → `var(--font-sans)` everywhere
10. **Radii**: 0/2px → 2/4/6/8/12px
11. **Post-preview**: added bg hover, rounded corners, generous padding
12. **Metadata bar**: flex-wrap support for narrow screens

### JS
- No changes — all interaction improvements via CSS cascade

## Generator Pass 2 — Changes Applied

### CSS — Signature Micro-interactions
1. **Custom scrollbar**: thin 6px, color-matched to theme, rounded
2. **Animated link underline**: gradient background that grows from left on hover. Excluded from nav, cards, buttons via override list.
3. **Blockquote**: decorative large opening quote `\201C` at 3.5rem, 15% opacity as background signature
4. **Post entrance stagger**: `postEntrance` keyframe (fade + translateY 8px) with 60ms cascading delay on `.post-preview:nth-child(N)`
5. **Progress bar glow**: `.complete` class adds box-shadow glow when reading reaches 100%
6. **Lightbox**: switched from `display: none/flex` → `opacity` + `pointer-events` for CSS transition; zoom animation on image content
7. **Search modal**: switched from `display: none/flex` → `opacity` + `pointer-events` for CSS transition
8. **Reduced motion**: added `animation-duration: 0s` to prefers-reduced-motion rule

### JS
1. **ReadingProgress**: added `.complete` class toggle on progress ≥ 99.5%
