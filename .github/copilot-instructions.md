# Copilot Instructions for Beautiful Jekyll Customization

This project is a customized fork of the [Beautiful Jekyll](https://beautifuljekyll.com/) theme for Jekyll blogs. It is designed for personal blogging, with advanced features and modern UI/UX enhancements. Use these instructions to help AI coding agents be productive and consistent in this codebase.

## Design Philosophy

The site follows **gwern.net's** design principles:

1. **Aesthetically-pleasing Minimalism** — Grayscale palette, content-focused design, clean typography without distraction.
2. **Accessibility & Progressive Enhancement** — Core reading experience works without JavaScript. Semantic markup. Keyboard navigation.
3. **Speed & Efficiency** — Fast loading, deferred features, minimal animations. Well-deserved features at low cost.
4. **Semantic Zoom** — Readers can engage at different depths: skim titles/headers, read summaries, expand sections for detail, mouse over references for popups.

## Architecture & Key Components
- **Jekyll-based static site**: Content is written in Markdown (`_posts/`, root `.md` files), rendered via Liquid templates (`_layouts/`, `_includes/`).
- **Theme Customization**: Core theme files are in the root and `_layouts/`, `_includes/`, and `assets/` folders. Custom CSS/JS is in `assets/css/custom-styles.css` and `assets/js/custom-script.js`.
- **Data & Search**: Search index is in `assets/data/searchcorpus.json`. Search UI is modal-based, triggered by the navbar icon, and only appears on post pages.
- **Table of Contents (TOC)**: Generated at the start of each post, not as a sidebar. Controlled by JS in `custom-script.js` and styled in `custom-styles.css`.
- **Semantic Zoom (NEW)**: Collapsible sections using native HTML `<details>`/`<summary>`. JavaScript enhances with persistence and keyboard support. Works without JS.

## Developer Workflows
- **Local Development**: Use `bundle exec jekyll serve` to preview changes locally. Ensure Ruby, Bundler, and Jekyll are installed.
- **Content Creation**: Add new posts in `_posts/` using the `YYYY-MM-DD-title.md` format with YAML front matter. Use Markdown for most content.
- **Customization**: Edit `custom-styles.css` and `custom-script.js` for UI/UX changes. Use `_config.yml` for site-wide settings.
- **Search Index**: Update `assets/data/searchcorpus.json` if new posts/pages should be searchable. (Automate if possible.)
- **Progressive Enhancement**: Test that core content is readable without JavaScript (disable JS in DevTools). All interactive features should have graceful fallbacks.

## Project-Specific Conventions
- **No sidebar TOC or search**: TOC and search modal only appear on post pages, not on the blog listing or other pages.
- **Search Modal Trigger**: The search modal is triggered by the existing navbar magnifier icon (`#search-trigger` in `nav.html`).
- **Header Numbering**: Auto-numbered headers (except subtitles) are handled in JS. Subtitles are not numbered.
- **Glassmorphism & Modern UI**: Use static color palettes and glassmorphism for modals and overlays. See `custom-styles.css` for patterns.
- **Keyboard Navigation**: Search modal, collapsible sections, and interactive elements support keyboard navigation (arrow keys, enter, esc).
- **Liquid & Includes**: Use includes (`_includes/`) for reusable HTML (e.g., comments, analytics, nav, footer).
- **Collapsible Sections (NEW)**: Use native HTML `<details>` tags for expandable content. JavaScript handles persistence & enhancement. Works without JS.

## Semantic Zoom & Progressive Disclosure (gwern.net-inspired)

Readers can engage with your post at different depths:

1. **Title & Metadata** — Quick overview, reading time, tags.
2. **Section Headers & TOC** — Navigate to sections of interest.
3. **Summaries & Emphasis** — Read bold/italic text, section summaries.
4. **Full Body Text** — Deep dive into explained concepts.
5. **Collapsible Sections** — Expand `<details>` for elaborations, proofs, tangents.
6. **Footnotes & Sidenotes** — Hover to see references inline.
7. **Full-text Links** — Click to jump to related content or external references.

### Using Collapsible Sections in Posts

```markdown
<details>
<summary>Click to expand: Advanced mathematical proof</summary>

This section contains the full mathematical derivation. It's optional for readers who want to skip to the summary.

```
$ P(x) = \sum_{i=1}^{n} a_i x^i $
```

</details>
```

Collapsible sections:
- **Work without JavaScript** — Display expanded in print, collapsed online (graceful degradation).
- **Persist on-scroll** — JavaScript remembers which sections the reader opened (sessionStorage).
- **Support keyboard navigation** — Tab/Enter/Space to toggle, Escape to close modals.
- **Mobile-friendly** — Touch targets are 44px+, responsive spacing.

### Using Section Summaries

```markdown
<div class="section-summary">
**Summary:** This section explains X in simple terms. For details, expand the section below.
</div>
```

Section summaries help readers skim and decide whether to dive deeper.

## Integration Points & External Dependencies
- **Jekyll Plugins**: None required by default, but check `_config.yml` for any custom plugins.
- **Analytics & Comments**: Integrate via includes (e.g., `google_analytics.html`, `disqus.html`). Enable/disable in `_config.yml`.
- **3rd Party CSS/JS**: External libraries are loaded via includes or in the `ext-css.html`/`ext-js.html` partials.

## Performance & Accessibility

- **Speed**: Critical features load immediately (reading progress, navbar, search, smooth scrolling). Non-critical features defer via `requestIdleCallback`.
- **Accessibility**: ARIA labels, semantic markup, keyboard navigation, high-contrast focus indicators, respects `prefers-reduced-motion`.
- **Print-Friendly**: All `<details>` expand for print. Interactive elements hide. Colors optimize for print.
- **Progressive Enhancement**: Content is readable without JavaScript. Interactive features gracefully degrade.

## Examples & References
- **Custom JS**: See `assets/js/custom-script.js` for reading progress, TOC, search modal, semantic zoom, accessibility, and header numbering logic.
- **Custom CSS**: See `assets/css/custom-styles.css` for modal, TOC, post width, collapsible sections, print styles, and responsive design.
- **Navbar Search**: `nav.html` contains the `#search-trigger` button; `search.html` contains the modal markup.
- **Post Template**: `_layouts/post.html` shows how TOC and search modal are included at the start of each post.

## Tips for AI Agents
- Always scope new features to post pages unless otherwise specified.
- Use existing includes and partials for new UI elements.
- Follow the established CSS/JS modularization: keep custom code in `custom-styles.css` and `custom-script.js`.
- When adding search or TOC features, ensure they do not appear on the blog listing or non-post pages.
- **Progressive Enhancement First**: Test all features without JavaScript enabled. Provide semantic HTML fallbacks.
- **Semantic Zoom**: Encourage collapsible sections for depth without bloat. Users should be able to skim or go deep.
- **Performance**: Use native HTML/CSS features (e.g., `<details>`) before adding JS. Defer non-critical JS.
- **Accessibility**: Ensure keyboard navigation, high-contrast focus indicators, and ARIA labels. Respect `prefers-reduced-motion`.
- Reference the README and `_config.yml` for site-wide settings and supported parameters.

---

For more details, see the [README.md](../README.md) and the Beautiful Jekyll [official docs](https://beautifuljekyll.com/).
