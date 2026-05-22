# Design Brief: Academic Elegance & Reading-First Portfolio

## Philosophy
Build a **reading-first, academic-elegant** portfolio that prioritizes **clarity, typography, and intellectual depth** over visual spectacle. The aesthetic is "scholar's study meets minimalist gallery"—rigorous, spacious, and deeply respectful of the reader's attention.

**Visual North Star:** Knuth's *The TeXbook*, Tufte's *Envisioning Information*, and Substack's newsletter minimalism.

---

## Core Design System

### Palette
- **Primary**: Pure black (`#000000`) + pure white (`#FFFFFF`)
- **Neutrals**: Concrete greys (`#F5F5F5`, `#E5E5E5`, `#808080`)
- **Accent**: Gentle dark grey (`#404040`) for secondary emphasis—no loud colors
- **Typography Support**: Subtle borders and shadows in `rgba(0,0,0,0.05)` to `rgba(0,0,0,0.1)`

**Rationale:** Eliminates chromatic noise. Forces hierarchy through *scale, weight, and whitespace* alone.

### Typography
- **Display/Headings** (`Montserrat`): Heavy weights (700–800), tight tracking (−0.01em), precise hierarchy
  - H1: `clamp(1.9rem, 4vw, 2.2rem)` | uppercase letter-spacing optional for section titles
  - H2: `1.7rem` | border-bottom to signal structural shifts
  - H3: `1.4rem` | padding-top for breathing room
- **Body** (`Be Vietnam Pro`): Regular weight (400–500), generous leading (1.75), warm character
  - Reading font size: `1.2rem` | line-height: `1.75`
  - Adjusts to `0.9rem` on small screens while maintaining 1.6+ line-height
- **Meta/Code** (`JetBrains Mono`): `0.9–0.95rem`, exactly monospaced, used for:
  - Post dates, author tags, reading time
  - Inline code and syntax highlighting
  - Footnote references

### Grid & Spacing
- **Reading width:** `900px` (classic essay width for comfortable eye tracking)
- **Vertical rhythm:** All spacing in multiples of `0.25rem` (4px base unit)
  - Section spacing: `2–3rem` between major blocks
  - Paragraph spacing: `1.5rem`
  - Heading margins: top `2.25rem`, bottom `1.25rem`
- **Borders:** Thin, 1px, `#E5E5E5`—visible structure without heaviness
- **Shadows:** Minimal, subtle lift effects only on interactive elements (`inset` shadows for depth)
- **Border Radius:** `0px` exclusively (sharp, architectural edge)

---

## Section Specifications

### Header / Navigation
- **Height:** Fixed `60px`, sticky top with light border-bottom
- **Composition:** Logo left (sans-serif, `1.25rem`, 700 weight), nav links right (small caps effect via font-size `0.85rem`)
- **Links:** No underlines in nav, subtle color shift on hover (`#000000` → `#333333`)
- **CSS Addition:** Ensure navbar doesn't cast shadow; border only.

### Hero / Post Title Section
- **Treatment:** Left-aligned, no centered "splash"
- **Title:** H1 in display font, `clamp(1.9rem, 4vw, 2.2rem)`, centered on page with 2rem top padding
- **Subtitle (if present):** Slightly smaller, 500 weight, `#1A1A1A`, 0.5rem margin below title
- **Byline/Metadata:** Monospaced, 0.8rem, all-caps letter-spacing (0.05em), includes author, date, reading time

### Article / Post Content
- **Layout:** Single-column, `900px` max, centered
- **Paragraph:** Orphans & widows rules (3 minimum); generous paragraph margins (1.5rem bottom)
- **Links:** Underlined (`#000000`), text-decoration-color slightly transparent (0.3 opacity), thicken on hover (1.5px → 2px)
- **Pull Quotes / Blockquotes:**
  - Indent left by `1.5rem`, subtle top/bottom border (`1px #000000`)
  - Slightly larger font (1.15rem), normal weight
  - No quotation marks (rely on typography)
  - Dark mode: subtle dark background (`#1E293B`) for contrast
- **Emphasis (em/i/strong):** Color lift to `#000000` (from body `#1A1A1A`)

### Code Blocks
- **Background:** Light concrete grey (`#F5F5F5`)
- **Border:** 1px `#E5E5E5`, sharp corners (radius 0)
- **Copy Button:** Positioned absolute top-right, minimal (0.4rem padding, small text), dark grey border until hover
- **Padding:** `1.25rem` + `3rem` top (space for meta label if present)
- **Font Size:** `0.95rem`, monospace, line-height `1.6`
- **Meta Label (language):** Positioned absolute top-left, 0.75rem, all-caps, `#808080`, 600 weight
- **Line Numbers (optional):** Monospace, `#808080`, right border (1px)
- **Token Colors:** All in grayscale—no syntax highlighting colors (comments: italic #808080, keywords/strings: #1A1A1A)

### Tables
- **Structure:** Full-width, 1px borders all around
- **Header Row:** Background `#F5F5F5`, bold header text (`#000000`), all-caps small label in monospace
- **Body Rows:** Alternating backgrounds removed; instead, subtle hover highlight (`#FAFAFA`)
- **Padding:** Cells `0.9rem 1.1rem`, left-aligned text
- **Border Collapse:** Collapse, no spacing

### Callout Boxes (Note/Tip/Warning)
- **Style:** Transparent background, left 4px border (primary color), top/bottom 1px border
- **Title:** Monospaced, 0.8rem, all-caps, `#000000`
- **Body:** Slightly smaller (0.9rem), `#404040`, no nested paragraphs
- **Icon (optional):** 24px, left-aligned, low opacity (0.7)

### Footnotes
- **Ref Link:** Small superscript (0.75em), no box, linked
- **Section Divider:** Top border (1px `#E5E5E5`), 2rem margin top
- **List:** Flex layout, gap 1rem between number and text; monospace numbers (0.85rem, 600 weight)
- **Text:** 0.9rem, `#404040`, line-height 1.5

### Reading Progress Bar
- **Position:** Fixed top (above navbar in z-order)
- **Style:** Solid black (`#000000`), 3px height, scaleX(0→1) on scroll
- **Transform Origin:** Left
- **Performance:** Use CSS `transform` (GPU-accelerated), RAF batching in JS

### Table of Contents (Sidebar)
- **Position:** Sticky, right of article on wide screens (>1520px), hidden on mobile
- **Width:** 220px, flex-shrink 0
- **Border:** Thin left border (`1px #D4D4D4`)
- **Title:** 0.7rem monospace, all-caps, `#808080`, 0.75rem margin-bottom
- **Links:** 0.9rem, `#808080` default, `#000000` on hover, **bold on active**
- **Hierarchy:** H1 (600 weight), H2 (padding-left 16px), H3 (padding-left 28px)
- **Scrolling:** Scrollbar styling (thin, subtle color), max-height calc(100vh - navbar - 60px)
- **Active State:** Left border highlight (2px) + bold weight + color lift to primary

### Blog Archive / Post List
- **Grid:** Two-column flex: `[title/excerpt] | [thumbnail]` with gap 0.75rem
- **Post Preview:** `grid-template-columns 1fr 100px`; date + tags in monospace (0.8rem), title in body serif (1.1rem, 700 weight)
- **Thumbnail:** 80px × 80px, border `1px #E5E5E5`, object-fit cover, subtle rounded corner (2px only)
- **Hover State:** Title underlines (text-decoration-color → opacity 1)
- **Month Groups:** Large, bold title with 2px bottom border (primary color), margin-top 1.5rem

### Footer
- **Style:** Minimal border-top, centered text, monospaced meta (0.8rem, all-caps)
- **Content:** Author, year, simple social links (no icons or logos, text only)
- **Spacing:** Generous vertical padding (2rem)

### Modals (Search, Lightbox)
- **Search Modal:**
  - Full-screen overlay, semi-transparent dark background (0.5 opacity)
  - Content box: white background, shadow (`0 2px 4px rgba(0,0,0,0.05)`), centered
  - Input field: full-width within modal, border-bottom on focus only (no box border)
  - Results: max-height 400px, scrollable, each result bordered-bottom (1px `#E5E5E5`)
  - Result item hover: subtle bg lift (`#FAFAFA`), left border highlight (2px `#000000`)
- **Lightbox (Image Zoom):**
  - Centered image with subtle shadow (`0 2px 4px rgba(0,0,0,0.05)`)
  - Close button: simple × symbol, positioned top-right, large hit target (48px)

### Dark Mode
- **Toggle:** Simple icon in navbar (sun/moon), persists to localStorage
- **Strategy:** Invert palette via CSS custom properties in `html.dark-mode { }` block
  - Background: near-black (`#0A0A0A`)
  - Text: off-white (`#F5F5F5`)
  - Borders: light grey (`#2A2A2A`)
  - Code background: darker grey (`#1A1A1A`)
- **No color-inversion filters**—explicit light/dark mode CSS rules only
- **Readability:** Ensure contrast ratios remain ≥ 7:1 (WCAG AAA)

---

## CSS Customization Checklist

### Variables to Adjust
- `--reading-width`: Keep at `900px` (or adjust per viewport)
- `--reading-font-size`: Currently `1.2rem`—confirm for comfort
- `--reading-line-height`: Currently `1.75`—ensure ≥1.75 for academic content
- `--heading-margin-top / --heading-margin-bottom`: Tune vertical rhythm
- All color variables (`--text-*`, `--bg-*`, `--border-*`): Use greys only (no saturation)

### CSS Additions / Changes
1. **H2 Border:** Ensure `border-bottom: 1px solid var(--border-primary)` is present
2. **Blockquote Styling:** Add left border (`4px #000000`), padding-left `1.5rem`
3. **Callout Boxes:** Implement with left border + flex layout (icon + text)
4. **Figure Captions:** Add margin-top (0.75rem), smaller font (0.9rem), italic, `#808080` color
5. **Link Styling:** Maintain underline with transparent color, thicken on hover
6. **Code Token Colors:** Ensure grayscale—no bright syntax colors
7. **Table Styling:** Override alternating backgrounds; add hover state (`#FAFAFA`)
8. **Responsive Design:**
   - At `<1520px`: Hide right TOC sidebar
   - At `<768px`: Adjust font sizes (body 1rem, headings clamp to smaller), double padding on mobile

---

## JavaScript (custom-script.js) Enhancements

### Priority Features
1. **Reading Progress Bar** (Existing):
   - RAF-batched scroll listener
   - Smooth transform on scroll (not jumpy)
   - Z-index above navbar

2. **Table of Contents Highlighting** (Existing):
   - IntersectionObserver to track active heading
   - Update active link styling in real-time
   - Ensure H1, H2, H3 all get IDs for anchoring

3. **Dark Mode Toggle** (Existing):
   - Persist choice to localStorage
   - Detect system preference on first load
   - Smooth transition (avoid jarring flash)

4. **Code Copy Button** (Existing):
   - Fade in on hover
   - "Copied!" state feedback (1s)
   - Use Clipboard API (fallback for older browsers)

5. **Image Lightbox** (Existing):
   - Click image to zoom (modal overlay)
   - Keyboard nav: Esc to close, Arrow keys to navigate
   - Subtle zoom animation (scale + opacity)

6. **Smooth Scroll & Anchor Behavior:**
   - `scroll-behavior: smooth` in CSS
   - Scroll-margin-top to prevent navbar overlap
   - Highlight anchor targets briefly on load (0.5s fade animation)

7. **Auto-generate Post TOC** (Existing):
   - Parse H1, H2, H3 from post content
   - Inject numbered list with active link tracking
   - Collapse H3s on narrow screens via toggle

### No-Go List
- ❌ Bounce animations
- ❌ Parallax effects
- ❌ Auto-playing videos or carousels
- ❌ Hover-triggered modals or popovers
- ❌ Excessive transitions (keep < 0.3s)

---

## Performance Notes
- **RAF Batching:** Group all scroll-triggered updates (progress bar, TOC highlight) into single RAF loop
- **CSS Variables:** Use `inherit` where possible; avoid recalculating in JS
- **Dark Mode:** Prefers-color-scheme media query + localStorage (no theme-detection JS polling)
- **Lighthouse:** Target 90+ Performance, 100 Accessibility, 100 Best Practices

---

## Implementation Order
1. Validate CSS variables in `:root` (colors, spacing, typography)
2. Ensure all heading levels (H1–H6) have proper margins and styling
3. Refine blockquotes, callouts, tables
4. Test dark mode across all sections
5. Validate interactive elements (links, buttons, forms)
6. Check TOC sidebar on large screens; hide on mobile
7. Verify code blocks have proper spacing and copy button
8. Test reading progress bar performance
9. Responsive breakpoint testing (768px, 1024px, 1520px)
10. Accessibility audit (contrast, focus states, keyboard nav)

---

## Design Tokens Summary

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| H1 | `clamp(1.9rem, 4vw, 2.2rem)` | 800 | `#000000` | Display font, centered |
| H2 | `1.7rem` | 700 | `#000000` | Serif, border-bottom |
| H3 | `1.4rem` | 700 | `#000000` | Serif, padding-top |
| Body | `1.2rem` | 400 | `#1A1A1A` | Be Vietnam Pro, 1.75 line-height |
| Meta | `0.8rem` | 600 | `#808080` | Monospace, all-caps |
| Link | Inherit | 500 | `#000000` | Underlined, transparency on color |
| Code | `0.95rem` | 400 | `#1A1A1A` | Monospace, on `#F5F5F5` bg |
| Caption | `0.9rem` | 400 | `#808080` | Italic, body font |

---

## References for Inspiration
- Tufte's CSS (minimal, readable)
- Substack newsletter design (whitespace, typography)
- Bartosz Ciechanowski's blog (interactive, clear)
- GitHub's documentation (clean tables, code blocks)
