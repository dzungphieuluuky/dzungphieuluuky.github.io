# dzungphieuluuky.github.io — AGENTS.md

## Stack
- **Ruby/Jekyll** (Beautiful Jekyll theme v6) — static site blog on GitHub Pages
- CI: `.github/workflows/ci.yml` — `ubuntu-latest`, Ruby 3.3, `bundle exec appraisal jekyll build --future --config _config_ci.yml,_config.yml`
- CSS: `assets/css/custom-styles.css` (1,121 lines, never edit `beautifuljekyll.css`)
- JS: `assets/js/custom-script.js` (356 lines, modular pattern)
- CV: `assets/cv/resume.tex` / `new_resume.tex` — build: `pdflatex resume.tex`

## Commands
| What | Command |
|------|---------|
| Dev server | `bundle exec jekyll serve` |
| Build | `bundle exec jekyll build` |
| CI build (appraisal) | `bundle exec appraisal jekyll build --future --config _config_ci.yml,_config.yml` |
| Draft post | `open /write <topic>` (uses `.opencode/commands/write.md`) |
| Review post | `open /review-content <path>` |
| Verify build | `bundle exec jekyll build --future` (catches front-matter errors) |

## Content Rules
- Posts in `_posts/` with **required** YAML front matter: `layout: post`, `title`, `tags`, `author: dzungphieuluuky`
- Filename: `YYYY-MM-DD-slug.md`
- Future-dated posts excluded by default (Jekyll) — use `--future` to preview
- Tags used so far: `personal`, `sino-nom`, `diffusion-models`, `deep-learning`, `reinforcement-learning`, `viettel`, `learning`
- All 6 posts have `cover-img`, `thumbnail-img`, `share-img` YAML placeholders (format: `# TODO: add cover image`)
- Timezone in `_config.yml`: `America/Toronto`
- MathJax enabled (`use-math: true` in `_config.yml`)

## Design & CSS
- **Never edit `beautifuljekyll.css`** — override in `custom-styles.css` or `_config.yml`
- Use CSS variables (`--text-primary`, `--bg-tertiary`, `--border-primary`, etc.) — never hardcode colors
- Light mode: `:root { }` / Dark mode: `html.dark-mode { }` blocks — test **both**
- Dark mode palette inverts from white→black backgrounds, black→white text
- Fonts: Be Vietnam Pro (sans/display), Source Serif 4 (serif/body), JetBrains Mono (code)
- Max reading width: 884px; line-height: 1.7; font-size: 1.06rem (87.5% root rem)
- **Any new font must support Vietnamese diacritics** — check before importing
- Design tokens in `DESIGN.md` (Geist palette), philosophy in `DESIGN_BRIEF.md`
- Search corpus auto-generated at `assets/data/searchcorpus.json`

## JavaScript Conventions (custom-script.js)
All modules follow `const ModuleName = { init() { ... } }` pattern. Init runs in `DOMContentLoaded`:

```
DarkMode → CodeCopy → ImageLightbox → PostTableOfContents →
ExternalLinks → EnhancedSearch → SchemaMarkup
```

- Cache DOM queries, lazy-load search corpus
- No transitions or CSS effects: state changes are instant (minimalist design)
- Theme flash prevention: IIFE before `DOMContentLoaded` checks localStorage

## Writing Voice (for blog posts)
Full rules in `.github/copilot-instructions.md` and `.opencode/commands/write.md`.

**For young researchers writing technical blogs — checklist:**
- [ ] Lead with a concrete example, number, or anecdote — never abstraction
- [ ] Each section: one clear purpose, one argument thread
- [ ] Banned: "In today's rapidly evolving landscape", "game-changer", "cutting-edge", "revolutionary", "Moreover", "Furthermore"
- [ ] Prefer active voice, short sentences, specific numbers
- [ ] For deep-dives: provide a map → historical context → question-driven momentum → opinion where earned → end with concrete takeaways
- [ ] Mark opinions explicitly ("We are firmly in opinion territory here...")
- [ ] YAML front matter valid before calling it done
- [ ] `bundle exec jekyll build` passes
- [ ] Check both light & dark mode rendering
- [ ] Remove filler: every sentence earns its place

## Gotchas
- `_config.yml` sets navy/blue `page-col`/`text-col`/`link-col` — CSS variables in `custom-styles.css` override these for the Substack-minimalist look
- `_post_dummies/` contains ~14 unpublished draft posts — not published to site
- `DELETION_LOG.md` records dead CSS/JS removed — check before searching for deleted selectors
- `.claude/hookify.*.local.md` enforces Vietnamese font support rules
- `Gemfile` has Windows-specific deps (`tzinfo`, `wdm`) — ignored on Linux/CI
- Pre-existing `_site/index.html` vs `index.md` conflict — build warning, harmless
- Em dashes (—) should be replaced with `, `, `; `, or `, i.e., ` depending on context — avoids comma splices

## Build Verification
Before PR/commit:
1. `bundle exec jekyll build --future` — must exit 0
2. Check `lsp_diagnostics` on changed `.md` files (Markdown lint not configured, but build catches template errors)
3. Test dark mode: toggle in browser — CSS variable overrides must cover all new elements
