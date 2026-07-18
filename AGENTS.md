# dzungphieuluuky.github.io — AGENTS.md

## Stack
- Ruby/Jekyll (Beautiful Jekyll theme v6.0.1) — static site blog
- Hosted on GitHub Pages, built via GitHub Actions (Ruby 3.3)
- Custom CSS: Geist design system (`DESIGN.md`, `DESIGN_BRIEF.md`), Substack-minimalist (Be Vietnam Pro/Lora/JetBrains Mono)
- Custom JS: modular init pattern (`assets/js/custom-script.js`) — DarkMode, ReadingProgress, TocHighlight, CodeCopy, ImageLightbox, EnhancedSearch, ReadMode, SchemaMarkup
- LaTeX CV in `assets/cv/` (build: `pdflatex resume.tex`)

## Platform: Windows
**All bash/terminal commands use PowerShell 7 syntax.** No Linux/Mac assumptions.
- Build: `bundle exec jekyll build`
- Dev: `bundle exec jekyll serve`
- CI: `.github/workflows/ci.yml` (ubuntu-latest, Ruby 3.3)
- `tail`, `grep` aliases don't exist — use `Select-Object -Last N`, `Select-String` instead

## Skill Loading
Before executing any task, load the relevant skill(s):
- **tdd-workflow** — before writing features, fixing bugs, or refactoring code
- **e2e-testing** — before writing Playwright/browser tests
- **verification-loop** — after completing features or before PR
- **strategic-compact** — during long sessions approaching context limits
- **eval-harness** — when defining evaluation criteria for AI-assisted work

## Commands
- `open /write <topic>` — Draft blog post in `_posts/` using `.opencode/commands/write.md` template
- `open /review-content <path>` — Review blog post content for voice/style

## Content Rules
- Blog posts in `_posts/` with YAML front matter (`layout: post`, `title`, `tags`)
- Filename format: `YYYY-MM-DD-slug.md`
- Front matter is REQUIRED — missing = post won't render
- Future-dated posts excluded by default (Jekyll quirk)
- Never edit `beautifuljekyll.css` directly — use `custom-styles.css` or `_config.yml`
- Use CSS variables (`--text-primary`, `--bg-tertiary`) — never hardcode colors
- Test **both light and dark mode** — dark mode in `html.dark-mode { }` blocks
- Search corpus generated at `assets/data/searchcorpus.json`
- Timezone: `America/Toronto`

## Design System
- `DESIGN.md` — Geist design tokens (grayscale palette 100–1000, spacing 4px base)
- `DESIGN_BRIEF.md` — reading-first, academic-elegant philosophy
- Blue = links/focus, Red = error, Amber = warning
- Breakpoints: sm 401px, md 601px, lg 961px, xl 1200px, 2xl 1400px
- Headers: Be Vietnam Pro | Body: Lora | Code: JetBrains Mono
- **Vietnamese font check** — any new font must support Vietnamese diacritics
- Max reading width: 728px, line-height: 1.6, font-size root: 87.5%

## JavaScript Conventions
- Modules follow `const ModuleName = { init() { ... } }` pattern
- Init in 3 `DOMContentLoaded` batches: 1) Critical, 2) DOM-mutating (RAF), 3) Idle
- `ScrollManager` consolidates all scroll handlers in one RAF loop
- Passive listeners for scroll/touch (`{ passive: true }`)
- Cache DOM queries, lazy-load search corpus, CSS transitions over classList toggles

## Important Gotchas
- `_config.yml` page-col/text-col/link-col vars set to **dark navy/blue** colors — override via custom-styles.css `:root` variables
- Pre-existing `_site/index.html` conflict (both `index.html` and `index.md`) — warning only
- `_post_dummies/` contains sample/test posts not published
- `DELETION_LOG.md` records all past CSS/JS dead code removal — check before searching for removed selectors
- `.claude/hookify.*.local.md` files enforce Vietnamese font support rules
- Gemfile has Windows-specific deps (tzinfo, wdm)
- Build command with Appraisal: `bundle exec appraisal jekyll build --future --config _config_ci.yml,_config.yml`

## Workflow Rules

Enforced by orchestrator on every task. Delegate to appropriate subagent when scope matches.

### 1. Token Optimizer for File Operations
Use `smart_read`, `smart_grep`, `smart_edit`, `smart_write` from Token Optimizer MCP over native `read`/`grep`/`edit`/`write`. Returns cached diffs on re-read instead of full content. Saves tokens proportional to file size and access frequency. Delegate file-intensive tasks to `token-optimizer` agent.

### 2. Parallel Search MCP for Web Research
Use `parallel-search_web_search` / `parallel-search_web_fetch` for internet lookups. Supports multiple search queries in one call — faster and cheaper than chaining single-threaded websearches. Delegate research tasks to `researcher` agent.

### 3. Sequential Thinking for Plans & Analysis
Use `sequential-thinking_sequentialthinking` BEFORE planning architecture, debugging complex bugs, or making significant design decisions. Breaks reasoning into verifiable steps with revision support. Delegate planning tasks to `planner` agent.

## Custom Subagents

Three project-local agents available via `task(..., subagent_type="...")`:
- `token-optimizer` — file reads/searches/edits using smart_* tools
- `researcher` — web research via parallel-search MCP
- `planner` — structured planning via sequential-thinking

## AI Writing Guidance
Full article writing, voice, and banned-pattern rules in `.github/copilot-instructions.md`.
- Lead with concrete example, not filler
- Never: "In today's rapidly evolving landscape", "game-changer", "cutting-edge"
- Prefer active voice, short sentences, specific numbers
- Apply "Sander approach" for deep-dive technical posts: map, history, question-driven momentum
