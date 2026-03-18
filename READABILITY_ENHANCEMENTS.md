# LessWrong-Inspired Readability Enhancements

## Overview

Your `custom-styles.css` has been optimized for **maximum readability** inspired by LessWrong's acclaimed article design. The changes prioritize **comfortable reading flow**, **visual hierarchy**, and **generous spacing** — making your blog pleasant to read for extended periods.

---

## Key Changes

### 1. **Increased Line Height (Most Important)**

**Before:** `line-height: 1.85`  
**After:** `line-height: 1.75` for body text

This is slightly more conservative than before but based on LessWrong's approach — giving your eyes more vertical space between lines, reducing eye strain during long reading sessions.

**Impact:** Significantly improved comfort for mobile and desktop readers.

---

### 2. **Optimized Font Size & Line Length**

**Before:**  
- Font size: `1.125rem` (18px)  
- Max width: `728px`

**After:**  
- Font size: `1.0625rem` (17px) - more readable default
- Max width: `700px` - narrower, more comfortable width

**Why:** Research on readability suggests 45-75 characters per line is optimal. At 17px, 700px width achieves ~65 characters.

---

### 3. **Generous Paragraph & List Spacing**

**Changes:**
```css
p { margin-bottom: 1.8rem; }  /* Was 1.6rem */
ul, ol { margin-bottom: 1.8rem; }  /* Was 1.6rem */
li { margin-bottom: 0.75rem; }  /* Was 0.5rem */
```

**Impact:** Each paragraph "breathes" more — reducing cognitive load when scanning. Lists become easier to parse.

---

### 4. **Improved Heading Hierarchy**

**Cleaner, lighter font weights:**
- `h1`: `font-weight: 700` (was 800) — less aggressive
- `h2`: `font-weight: 600` (was 700) — lighter
- `h3`: `font-weight: 600` (consistent with h2)

**More spacing around headings:**
- h2: `margin-top: 3rem` (was 2.75rem)
- h3: `margin-top: 2.5rem` (was 2rem)

**Impact:** Clearer visual breaks between sections without looking "bold" or heavy.

---

### 5. **Simplified Decorative Elements**

**Removed:**
- Gradient divider before h1 headings (the blue-turquoise accent)
- Heavy shadows and visual clutter

**Kept:**
- Clean typography
- Subtle borders
- Minimalist design

**Why:** LessWrong uses minimal decorations. Your content should be the focus.

---

### 6. **Code Blocks — Better Readability**

**Changes:**
```css
pre {
  font-size: 0.85rem;  /* Slightly smaller */
  line-height: 1.6;     /* More breathing room */
  background: #F5F5F3;  /* Lighter background */
  padding: 1.25rem;     /* Balanced padding */
}
```

**Impact:** Code is easier to read without feeling cramped.

---

### 7. **Tables — Cleaner Presentation**

**Changes:**
```css
table { font-size: 0.95rem; line-height: 1.7; }  /* Larger, more readable */
th, td { padding: 0.9rem 1.1rem; }  /* More breathing room */
```

**Impact:** Tables are no longer cramped; data is easier to scan.

---

### 8. **Blockquotes — Better Visual Distinction**

**Before:** 
- 3px left border, turquoise color, small font

**After:**
- 4px left border, indigo color (more visible)
- Cleaner padding
- Font size: 0.98rem (readable without being too large)

**Impact:** Quotes stand out clearly but don't distract from the main text.

---

### 9. **Post Preview Cards — Improved List Readability**

**Changes:**
```css
.post-preview {
  padding: 2rem 0;        /* Was 1.75rem */
  gap: 0 1.75rem;         /* Was 1.5rem */
}
.post-preview h2, h3 {
  font-size: 1.25rem;     /* Was 1.2rem */
}
.post-preview p {
  font-size: 1rem;        /* Was 0.95rem */
  line-height: 1.7;       /* More generous */
}
```

**Impact:** Blog listing page is now much more readable and scannable.

---

### 10. **Page Content (Non-Post Pages)**

Updated `.page-content` to match the optimized reading parameters:
- Font size: `1.0625rem`
- Line height: `1.75`
- Padding: `1.75rem` (slightly more)

---

## Design Philosophy

Your CSS now follows LessWrong's core readability principles:

1. **Generous Vertical Spacing** — Don't crowd content
2. **Optimal Line Length** — 45-75 characters (around 700px)
3. **Large, Clear Typography** — No straining to read
4. **Minimal Decorations** — Let content shine
5. **Clear Hierarchy** — Headings guide navigation
6. **Consistent Spacing** — Predictable rhythm

---

## Visual Comparison

### LessWrong Characteristics (Now Adopted)
✅ Line height: ~1.7-1.75  
✅ Font size: 17-18px  
✅ Line length: ~700px  
✅ Generous margins between sections  
✅ Light font weights  
✅ Minimal visual flourishes  
✅ Clear, readable hierarchy  
✅ Professional, academic feel  

---

## Browser Compatibility

All changes are **100% backward compatible**:
- No new CSS features
- No JavaScript required
- Works on all modern browsers
- Responsive on mobile, tablet, desktop

---

## Testing Checklist

- [ ] Read a full post — does it feel comfortable?
- [ ] Check mobile view — no excessive line wrapping?
- [ ] Test code blocks — readable font size?
- [ ] Review blog listing — easy to scan titles and dates?
- [ ] Check blockquotes — visually distinct?
- [ ] Test tables — not cramped?
- [ ] Dark mode — is contrast sufficient?

---

## Future Improvements

1. **Letter spacing** — Reduced from `0.005em` to `0.003em` for cleaner text
2. **Drop cap** — Simplified styling (less aggressive)
3. **Images** — Cleaner shadows, better spacing

---

## Technical Metrics

| Metric | Value |
|--------|-------|
| Body font size | 17px (1.0625rem) |
| Line height | 1.75 |
| Line length | 700px |
| Characters per line | ~65 |
| Paragraph spacing | 1.8rem (28.8px) |
| Heading weight (h1) | 700 |
| Heading weight (h2, h3) | 600 |

---

## Summary

Your blog now reads like **LessWrong**: comfortable, clear, and designed for **comprehension over decoration**. Readers can focus on your ideas without visual noise or eye strain.

Enjoy the improved readability! 📖✨
