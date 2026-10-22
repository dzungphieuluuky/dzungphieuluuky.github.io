# Substack Design Philosophy — Research Synthesis

## Core Principle
**"The writing is the product."** The reading surface is deliberately austere — no chrome, no cards, no elevation around the prose column. The page exists to frame the text, nothing more.

## Typography (what I should buy to match: Cahuenga / Spectral / Inter)

| What | Substack | dzungphieuluuky (current) | Gap |
|------|----------|---------------------------|-----|
| Title | Cahuenga (serif) | Be Vietnam Pro (sans) | **Title should be serif** (or Lora set in bold-book weight) |
| Body | Spectral or Source Serif 4 (serif) | Lora (serif) ✓ | Good — Lora is a quality serif |
| UI/Actions | Inter (sans) | Be Vietnam Pro (sans) | Close enough |
| Body size | 18pt / 1.65 line-height | 1.175rem (~17.6px) / 1.8 line-h | Close, slightly bigger line-h |
| Reading width | ~680-700px | 728px | Still within editorial range |
| Subtitle/dek | *Italic serif* | none | **Missing** — large gap |
| H1 weight | Book (not Bold) | Bold | Subtle editorial signal missing |

## Layout Elements

| Element | Substack | Current | Action |
|---------|----------|---------|--------|
| Title alignment | Left-aligned serif | Centered, sans-serif | **Change to left-aligned serif** |
| Subtitle (dek) | Italic serif, muted | None | **Add italic serif subtitle support** |
| Sticky byline | Avatar + name + "X min read" sticky on desktop scroll | Metadata bar (not sticky) | **Add sticky byline module** |
| Bottom action bar | Like/Comment/Restock/Share with counts, hairline top | None | **Add bottom engagement bar** |
| Blockquotes | 3pt orange left border (#FF6719), italic serif | 4px black border + open-quote ::before | **Mirror Substack style** |
| Pull quotes | 3pt orange left border, centered italic serif on wider measure | (same as blockquote) | Differentiate pull-quotes from blockquotes |
| Reading progress | None (web) | Has top progress bar (own invention) | Keep — useful UX, not anti-Substack |
| Sidebar TOC | Inline TOC in right rail (on desktop) | Sidebar TOC `.post-toc-box` | Keep sidebar but make it more minimal |
| Read mode toggle | None | Has toggle | Keep — own invention |
| Metadata (date/tags) | Small, sans-serif, grey, hairline separator | Currently border-top/border-bottom bar | Simplify metadata bar |
| Subscribe CTA | Sticky paywall / subscribe card with orange CTA | None | Not applicable (personal blog) |
| Author bio | Compact card at bottom with avatar + subscribe button | Depends on theme | Evaluate |
| Drop caps | Supported (editor can toggle) | None | **Nice-to-have**: add CSS for drop caps |
| Link style | Blue underlined | Custom animated underline gradient | Keep — unique, beautiful |
| Search | Right-rail search on desktop | Modal search via `EnhancedSearch` | Keep modal (own invention) |
| Dark mode | Yes (reader-selectable) | Yes (CSS variables + `html.dark-mode`) | Already good |

## Color Palette (Geist → Substack alignment)

| Role | Substack | dzungphieuluuky (Geist) | Gap |
|------|----------|-------------------------|-----|
| Prose background | White (#FFF) | `--bg-primary: #FAFAFA` | Minimal gap |
| Prose text | Near-black | `--text-primary: #111` | Close |
| Meta text | Grey (#666) | `--text-secondary: #666` | **Match** |
| Accent | Orange (#FF6719) | `--accent: none` | **No accent color defined** |
| Links | Blue (#3366CC) | `--link: #0066CC` | Close |
| Borders | Hairline (1px, `#E5E5E5`) | `--border-primary` in use | Good |
| Code background | `#F5F5F5` | `--bg-tertiary` | Good |

**Action**: Add `--accent` orange variable to CSS for the one consistent accent (if used, e.g. Subscribe).

## The "One Accent Color" Principle
Substack uses exactly **one accent color**: orange (#FF6719), and only on the Subscribe CTA button / paywall elements. Nothing else is orange — no links, no headings, no borders, no UI decorations. This restraint makes the CTA unmistakable.

For this personal blog (no paywall), the principle suggests: if an accent is used, use it in **exactly one place** — perhaps a subtle link highlight or the blockquote border.

## Key Design Tensions (Current vs Substack)

1. **Title treatment**: Centered sans-serif is more "personal blog / style magazine"; left-aligned serif is more "editorial / Substack". No wrong answer, but a decision.
2. **TOC sidebar**: Useful for long technical posts (which this blog has) but adds chrome. Substack's right-rail TOC is inline and minimal.
3. **Reading progress bar**: Not Substack, but popular in modern reading UIs. Valid own invention.
4. **Read mode toggle**: Not Substack. Novelty — but reader might appreciate consistent typography without JS toggles.

## Recommendations for the Plan
1. **Title**: Change from centered sans-serif → left-aligned serif (Lora in bold-book weight)
2. **Subtitle**: Support italic serif dek in YAML front-matter → CSS
3. **Sticky byline**: New module — avatar + name + reading time, sticky at top on scroll
4. **Bottom action bar**: Like/Share/Copy-link with hairline separator
5. **Blockquote**: Transition from 4px black + open-quote → 3pt orange left border, italic serif
6. **Metadata**: Simplify — remove heavy border, use small sans-serif muted text
7. **Accent color**: Add `--accent: #FF6719` to CSS variables (use sparingly)
8. **Title font decision**: Either keep Be Vietnam Pro (brand consistency) or switch to Lora (Substack alignment) — this is the biggest fork
