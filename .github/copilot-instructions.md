# Copilot Instructions for Beautiful Jekyll Customization

This project is a customized fork of the [Beautiful Jekyll](https://beautifuljekyll.com/) theme for Jekyll blogs. It is designed for personal blogging, with advanced features and modern UI/UX enhancements. Use these instructions to help AI coding agents be productive and consistent in this codebase.

## Architecture & Key Components
- **Jekyll-based static site**: Content is written in Markdown (`_posts/`, root `.md` files), rendered via Liquid templates (`_layouts/`, `_includes/`).
- **Theme Customization**: Core theme files are in the root and `_layouts/`, `_includes/`, and `assets/` folders. Custom CSS/JS is in `assets/css/custom-styles.css` and `assets/js/custom-script.js`.
- **Data & Search**: Search index is in `assets/data/searchcorpus.json`. Search UI is modal-based, triggered by the navbar icon, and only appears on post pages.
- **Table of Contents (TOC)**: Generated at the start of each post, not as a sidebar. Controlled by JS in `custom-script.js` and styled in `custom-styles.css`.

## Developer Workflows
- **Local Development**: Use `bundle exec jekyll serve` to preview changes locally. Ensure Ruby, Bundler, and Jekyll are installed.
- **Content Creation**: Add new posts in `_posts/` using the `YYYY-MM-DD-title.md` format with YAML front matter. Use Markdown for most content.
- **Customization**: Edit `custom-styles.css` and `custom-script.js` for UI/UX changes. Use `_config.yml` for site-wide settings.
- **Search Index**: Update `assets/data/searchcorpus.json` if new posts/pages should be searchable. (Automate if possible.)

## Project-Specific Conventions
- **No sidebar TOC or search**: TOC and search modal only appear on post pages, not on the blog listing or other pages.
- **Search Modal Trigger**: The search modal is triggered by the existing navbar magnifier icon (`#search-trigger` in `nav.html`).
- **Header Numbering**: Auto-numbered headers (except subtitles) are handled in JS. Subtitles are not numbered.
- **Glassmorphism & Modern UI**: Use static color palettes and glassmorphism for modals and overlays. See `custom-styles.css` for patterns.
- **Keyboard Navigation**: Search modal supports keyboard navigation (arrow keys, enter, esc).
- **Liquid & Includes**: Use includes (`_includes/`) for reusable HTML (e.g., comments, analytics, nav, footer).

## Integration Points & External Dependencies
- **Jekyll Plugins**: None required by default, but check `_config.yml` for any custom plugins.
- **Analytics & Comments**: Integrate via includes (e.g., `google_analytics.html`, `disqus.html`). Enable/disable in `_config.yml`.
- **3rd Party CSS/JS**: External libraries are loaded via includes or in the `ext-css.html`/`ext-js.html` partials.

## Examples & References
- **Custom JS**: See `assets/js/custom-script.js` for reading progress, TOC, search modal, and header numbering logic.
- **Custom CSS**: See `assets/css/custom-styles.css` for modal, TOC, and post width styling.
- **Navbar Search**: `nav.html` contains the `#search-trigger` button; `search.html` contains the modal markup.
- **Post Template**: `_layouts/post.html` shows how TOC and search modal are included at the start of each post.

## Tips for AI Agents
- Always scope new features to post pages unless otherwise specified.
- Use existing includes and partials for new UI elements.
- Follow the established CSS/JS modularization: keep custom code in `custom-styles.css` and `custom-script.js`.
- When adding search or TOC features, ensure they do not appear on the blog listing or non-post pages.
- Reference the README and `_config.yml` for site-wide settings and supported parameters.

---

For more details, see the [README.md](../README.md) and the Beautiful Jekyll [official docs](https://beautifuljekyll.com/).
