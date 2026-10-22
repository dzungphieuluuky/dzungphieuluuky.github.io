# Plan: Post Page Redesign — Substack-Inspired Reading UI

**Context:** Give each blog post page a cleaner, more editorial reading surface inspired by Substack's design philosophy ("the writing is the product"). Based on ulw-research findings in `.omo/ulw-research/20260727-substack-post-redesign/findings.md`.

**Status:** Draft Plan (awaiting approval). Text-only minimal design per Substack — no SVG icons, no emoji-like glyphs, only plain text labels for interactive elements. **Be Vietnam Pro for UI/headings, Lora for body text** — Lora confirmed to fully support Vietnamese (includes `vietnamese` subset on Google Fonts, glyphs by Nhung Nguyen). Grayscale-only palette (no accent color).

---

## Scope

Only the **single post page** (`_layouts/post.html`) and its CSS/JS — not home, about, navbar, or footer.

### Files to modify
| File | What changes |
|------|-------------|
| `assets/css/custom-styles.css` | New styles + refinements (see tasks) |
| `_layouts/post.html` | Title alignment, sticky byline, bottom bar |
| `_includes/header.html` | Subtitle treatment for posts |
| `assets/js/custom-script.js` | New module: `BottomActionBar` (copy link only) + fix `ReadingTime` conflict |

### Files to create
| File | Purpose |
|------|---------|
| (none) | All changes are in-place edits or JS additions |

---

## ~✅~ Task 1 — CSS variables: keep Lora for body, no accent color (ALREADY SATISFIED)

**File:** `assets/css/custom-styles.css` (line ~105, before `}` closing `:root`)

**What:**
1. **No new accent color.** Keep the existing grayscale palette (`--accent-primary: #000000`, `--accent-light: #404040`) as-is. No orange.
2. **Font variables stay differentiated:** `--font-serif` keeps Lora for body reading. `--font-sans` and `--font-display` use Be Vietnam Pro for UI.

```css
/* No accent variable added — keep existing grayscale palette */

/* Font variables — Lora for body, Be Vietnam Pro for UI/display */
--font-serif: 'Lora', 'Georgia', 'Times New Roman', serif;
--font-sans: 'Be Vietnam Pro', 'Inter', 'Arial', sans-serif;
--font-display: 'Be Vietnam Pro', 'Georgia', 'Times New Roman', serif;
```

**Why:** Lora fully supports Vietnamese (confirmed via Google Fonts `vietnamese` subset, character map includes all Vietnamese diacritic combinations). Keeping Lora for body preserves the "serif reads" principle from DESIGN_BRIEF. Be Vietnam Pro handles UI (byline, action bar, blockquote title).

**Check:**
- Body text (`var(--font-serif)`) unchanged — still Lora.
- Post title, byline, blockquote, action bar use `var(--font-sans)` (Be Vietnam Pro).
- No `--accent` / `--accent-hover` variables introduced anywhere.

---

## ~✅~ Task 2 — Post title: left-aligned, Be Vietnam Pro (COMPLETED)

**File:** `assets/css/custom-styles.css` (lines 234–242)

**What:** Change `.intro-header .page-heading h1` from centered sans-serif to **left-aligned** on post pages. Use `--font-sans` (Be Vietnam Pro).

**Difficulty:** `h1` is shared by all pages (post, page, home). Need a **post-specific** override.

**Approach:**
- Keep existing `.intro-header .page-heading h1` as-is for non-post pages
- Add a `.post-heading h1` override:

```css
.intro-header .post-heading h1 {
  text-align: left;
  font-family: var(--font-sans);   /* Be Vietnam Pro */
  font-weight: 600;                /* semibold, not heavy 700 */
  font-size: clamp(1.8rem, 3.5vw, 2.4rem);
  letter-spacing: -0.02em;
  line-height: 1.2;
}
```

**Removed** `max-width: 90%` per reviewer feedback (creates asymmetric margins).

**Check:** Only `.post-heading` (which is set when `include.type == "post"` in `header.html`).

---

## ~✅~ Task 3 — Subtitle: restore italic Be Vietnam Pro dek (COMPLETED)

**File:** `assets/css/custom-styles.css` (lines 253–254)

**Current:** `.intro-header .page-heading .post-subheading` is `display: none`.

**What:** Remove the `display: none` for post pages and style the subtitle as an italic Be Vietnam Pro dek. Use `color: var(--text-muted)` (#808080, lighter gray) for the dek, not `--text-tertiary` (#404040).

```css
/* Show subtitle on posts */
.intro-header .post-heading .post-subheading {
  display: block;
  font-family: var(--font-sans);   /* Be Vietnam Pro */
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-style: italic;
  font-weight: 400;
  color: var(--text-muted);        /* Lighter gray for dek — not --text-tertiary */
  text-align: left;
  line-height: 1.5;
  margin-top: 0.25rem;
}
```

**Check:** Verify with a post that has `subtitle:` in front matter (e.g. one of the drafts).

---

## ~✅~ Task 4 — Metadata bar: simplify and make sticky byline (COMPLETED)

**File:** `_layouts/post.html` (lines 52–71) + `assets/css/custom-styles.css` (lines 660–711)

**Current:** Metadata bar inside `<article>` with "Last Updated" date + "FRESH" badge + read mode toggle. Border-top and border-bottom on the bar.

**Design rule:** Text-only minimal design. No SVG icons, no emoji-like glyphs.

**Approach:**
1. **Replace** the metadata bar with a **sticky byline** element before `<article>`. Text-only: author name, date, reading time, read-mode toggle as text label.
2. Keep **read mode toggle** as a **text button** "Read mode" (no SVG eye icon).
3. Add **reading time** from `_includes/readtime.html` into the byline as "X min read".
4. Drop the SVG download icon — use just "Updated Mar 22, 2026" plain text.

New HTML structure in `_layouts/post.html` (place inside `blog-post` div, before `article`):

```html
<div class="post-sticky-byline">
  <div class="byline-avatar">
    <img src="{{ site.avatar | relative_url }}" alt="{{ site.author }}">
  </div>
  <div class="byline-text">
    <span class="byline-author">{{ site.author }}</span>
    <span class="byline-meta">
      {% include readtime.html %}
      <span class="middot">&middot;</span>
      {{ page.date | date: "%b %d, %Y" }}
    </span>
  </div>
  <button class="read-mode-toggle" aria-label="Toggle read mode">Read mode</button>
</div>
```

New CSS:

```css
.post-sticky-byline {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  margin-bottom: 1.5rem;
}
```

**Sticky behavior** — desktop only:

```css
@media (min-width: 768px) {
  .post-sticky-byline {
    position: sticky;
    top: calc(var(--navbar-height) + 8px);
    z-index: 10;
  }
}
```

```css
.byline-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.byline-text {
  display: flex;
  flex-direction: column;
  line-height: 1.4;
}
.byline-author {
  font-weight: 600;
  color: var(--text-primary);
}
.byline-meta {
  color: var(--text-muted);
  font-size: 0.8rem;
}
.byline-meta .middot {
  margin: 0 0.3rem;
}
```

**Also:** Remove the `metadata-bar` div from `post.html` and its associated CSS rules entirely.

**Check:** Test sticky behavior during scroll on desktop — byline must not overlap navbar or content. On mobile (<768px), byline is inline (not sticky).

---

## ~✅~ Task 5 — Blockquote: grayscale left border, Be Vietnam Pro italic (COMPLETED)

**File:** `assets/css/custom-styles.css` (lines 886–919)

**What:** Change blockquote from 4px black border + decorative open-quote `::before` to 3px grayscale left border, italic Be Vietnam Pro, no open-quote pseudo. Font size matches body (`inherit` not `1rem`).

```css
.blog-post blockquote {
  position: relative;
  padding: 1rem 0 1rem 1.5rem;
  margin: 2rem 0;
  border-left: 3px solid var(--text-secondary);
  background: transparent;
  color: var(--text-secondary);
  font-style: italic;
  font-family: var(--font-sans);   /* Be Vietnam Pro */
  font-size: inherit;              /* Match body size, don't downscale */
  line-height: 1.7;
}
/* Remove the open-quote pseudo-element */
.blog-post blockquote::before { content: none; }
.blog-post blockquote p {
  margin: 0.5rem 0;
  color: inherit;
}
.blog-post blockquote em,
.blog-post blockquote i {
  color: var(--text-primary);
  font-style: normal;
  font-weight: 500;
}
```

**Dark mode:**

```css
html.dark-mode .blog-post blockquote {
  background: transparent;
  color: var(--text-secondary);
  border-left-color: var(--text-secondary);
}
```

**Check:** Both light and dark mode. Multiple paragraphs inside blockquotes.

---

## ~✅~ Task 6 — Bottom action bar: "Copy link" only (no "Like") (COMPLETED)

**Files:** `assets/js/custom-script.js` (new module) + `assets/css/custom-styles.css`

**What:** Add a minimal bottom engagement bar after the article content. **Only "Copy link"** — the "Like" button was removed per reviewer feedback (no persistence on a static site). Text-only with a hairline separator above and below.

**JS module** — add before `ImageLightbox`:

```javascript
// ====================================
// X. Bottom Action Bar (text-only)
// ====================================
const BottomActionBar = {
  init() {
    const article = document.querySelector('article');
    if (!article) return;

    const bar = document.createElement('div');
    bar.className = 'post-action-bar';

    const shareBtn = document.createElement('button');
    shareBtn.className = 'action-btn';
    shareBtn.type = 'button';
    shareBtn.textContent = 'Copy link';
    shareBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      shareBtn.classList.add('copied');
      shareBtn.textContent = 'Copied';
      setTimeout(() => {
        shareBtn.classList.remove('copied');
        shareBtn.textContent = 'Copy link';
      }, 2000);
    });

    bar.appendChild(shareBtn);
    article.appendChild(bar);
  }
};
```

**Register** the init call in `DOMContentLoaded` (find the existing batch init at the end of `custom-script.js`).

**CSS:**

```css
.post-action-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 0;
  margin: 2rem 0;
  border-top: 1px solid var(--border-primary);
  border-bottom: 1px solid var(--border-primary);
}
.action-btn {
  background: transparent;
  border: none;
  padding: 0;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-tertiary);
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: color 0.2s;
}
.action-btn:hover { color: var(--text-primary); }
.action-btn.copied { color: var(--text-primary); }
```

**Note:** No "Like" button — only "Copy link". Removes fake interaction concern.

---

## ~✅~ Task 7 — Blog tags: refine styling (COMPLETED)

**File:** `assets/css/custom-styles.css` (lines 951–971)

**Current:** Tags rendered as pill-shaped bordered links.

**What:** Make tags more minimal — smaller, no border, just muted text links:

```css
.blog-tags { gap: 0.25rem; margin: 1.5rem 0; }
.blog-tags a {
  display: inline;
  padding: 0;
  background: transparent;
  color: var(--text-muted);
  border: none;
  font-size: 0.8rem;
  font-weight: 400;
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: transparent;
  transition: text-decoration-color 0.2s;
}
.blog-tags a::before { content: '#'; opacity: 0.5; }
.blog-tags a:hover {
  color: var(--text-primary);
  text-decoration-color: var(--text-primary);
  border: none;
}
```

---

## ~✅~ Task 8 — Fix ReadingTime.js conflict with metadata-bar removal (COMPLETED)

**File:** `assets/js/custom-script.js` (lines 376–403)

**Critical issue:** When Task 4 removes `.metadata-bar` from `post.html`, `ReadingTime.init()` runs `document.querySelector('.metadata-bar')` → gets `null` → creates a **new** `.metadata-bar` dynamically and inserts it after the `<h1>`. This injects a redundant "X min read / X words" display into the page, visually clashing with the sticky byline.

**Fix:** Update `ReadingTime.init()` to check for `.post-sticky-byline` and skip if present:

```javascript
// In ReadingTime.init(), before the metadata-bar logic:
if (document.querySelector('.post-sticky-byline')) {
  return; // Sticky byline handles reading time instead
}
```

**Alternative:** Remove `ReadingTime.init()` entirely from the `DOMContentLoaded` init order, since the sticky byline handles reading time server-side via `{% include readtime.html %}`.

**This task runs before or concurrent with Task 4** to prevent the bug from manifesting.

---

## ~✅~ Task 9 — TOC sidebar: keep current style (no accent color) (COMPLETED)

**File:** `assets/css/custom-styles.css` (lines 815–841)

**Current:** The `.post-toc-box` inside the article already exists and is functional. Active item highlighting uses `border-left-color: var(--text-primary)` (black) and bold weight.

**Decision:** Keep current TOC highlighting style. No accent color introduced. Verify after Tasks 1–8 that TOC still works correctly.

---

## ~✅~ Task 10 — Dark mode consistency pass (COMPLETED)

**File:** `assets/css/custom-styles.css` (the entire `html.dark-mode { }` section)

**What:** After all above changes, verify every new/modified selector has a dark-mode counterpart:
- `html.dark-mode .post-sticky-byline { background: var(--bg-primary); }`
- `html.dark-mode .post-action-bar { border-color: var(--border-primary); }`
- `html.dark-mode .action-btn:hover { color: var(--text-primary); }`
- `html.dark-mode .blog-post blockquote { border-left-color: var(--text-secondary); }`

No `--accent` color to worry about — everything uses existing grayscale palette.

---

## ~✅~ Task 11 — Build verification (COMPLETED)

```bash
bundle exec jekyll build --future
```

Must exit 0. Then manual test:
- [ ] Load a post page in browser
- [ ] Title is left-aligned Be Vietnam Pro semibold
- [ ] Subtitle (if present) shows as italic Be Vietnam Pro dek (lighter gray)
- [ ] Sticky byline appears and sticks on scroll (desktop only ≥768px)
- [ ] On mobile (<768px), byline is inline, not sticky
- [ ] Blockquotes show 3pt `--text-secondary` left border, italic Be Vietnam Pro, no open-quote
- [ ] Blockquote font size matches body text
- [ ] Bottom action bar shows only "Copy link" (no "Like" button)
- [ ] Tags show as inline `#tag` links
- [ ] Dark mode looks correct for all new elements (no orange anywhere)
- [ ] Read mode toggle still works (text label)
- [ ] No duplicate reading-time/word-count elements (ReadingTime fix verified)
- [ ] TOC highlighting works

---

## Dependency order

```
Task 1 (font vars + no accent) ─┬─ Task 5 (blockquotes)
                                 ├─ Task 6 (action bar)
                                 ├─ Task 10 (dark mode)
                                 │
Task 2 (title) ─────────────────── independent
Task 3 (subtitle) ──────────────── independent
Task 4 (sticky byline) ────────── needs Task 8 first (or concurrent)
Task 7 (tags) ─────────────────── independent
Task 8 (ReadingTime fix) ──────── must precede or pair with Task 4
Task 9 (TOC verify) ───────────── after all CSS changes
Task 11 (build) ───────────────── final
```

Tasks 2, 3, 5, 7 can be done in parallel. Tasks 4 + 8 are coupled (must be done together). Task 6 after Task 1. Task 10 after all CSS changes. Task 11 last.

---

## Summary of changes from earlier draft (post-review)

| Change | Before | After |
|--------|--------|-------|
| Accent color | Orange `#FF6719` | None (keep grayscale) |
| Body font | Be Vietnam Pro | **Lora** (confirmed Vietnamese support) |
| Blockquote border | `var(--accent)` orange | `var(--text-secondary)` grayscale |
| Blockquote font size | `1rem` | `inherit` (match body) |
| Bottom action bar | Like + Copy link | **Copy link only** |
| Sticky byline mobile | Sticky everywhere | Sticky only ≥768px (`@media` wrapper) |
| Subtitle color | `--text-tertiary` (#404040) | `--text-muted` (#808080) |
| `max-width: 90%/85%` on title/subtitle | Present | Removed |
| ReadingTime.js conflict | Not addressed | Fixed (detects `.post-sticky-byline`) |
| TOC accent | Mentioned | Removed (keep current style) |

---

## Evidence ledger

Each task is complete when:
1. The intended CSS rule exists in `custom-styles.css`
2. The intended HTML/JS change exists in the respective file
3. `bundle exec jekyll build --future` passes
4. Visual inspection confirms the change in browser (developer can verify)

---

## Risk notes

- **Title change** may feel jarring after centering. The plan uses Be Vietnam Pro semibold (sans-serif, not Lora serif) — this is deliberate for editorial hierarchy. If the author prefers a centered title, Task 2 can be dropped.
- **Lora kept for body text** — confirmed to fully support Vietnamese (Google Fonts `vietnamese` subset, glyphs by Nhung Nguyen). Body text remains serif per DESIGN_BRIEF's "serif reads" philosophy.
- **Sticky byline** duplicates author/date from `header.html`. This plan keeps both — the header for first-impression, the byline for during-reading context. If redundancy is undesired, hide header's metadata on `.post-heading`.
- **Bottom action bar** copy-link uses `navigator.clipboard.writeText` — works on HTTPS/localhost; fails gracefully on insecure origins (no error thrown).
- **Blockquote border color** uses `var(--text-secondary)` — a dark gray that fits the grayscale palette. No accent color introduced anywhere.
- **ReadingTime.js fix** is critical — must be done before or with Task 4 to prevent a guaranteed duplicate element bug.
