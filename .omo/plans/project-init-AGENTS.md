# Plan: Init AGENTS.md for dzungphieuluuky.github.io

## Status
Approved by user (message m0005). **COMPLETED**.

## Action
**CREATE** `AGENTS.md` at project root with content below.

## Context
- Project: Jekyll static blog (Beautiful Jekyll theme v6.0.1)
- Target harness: OpenCode
- No existing AGENTS.md, CLAUDE.md, .opencode/, or ecc-install.json
- Existing `.github/copilot-instructions.md` preserved and referenced

## File to Create

Path: `D:\Personal\dzungphieuluuky.github.io\AGENTS.md`

Content:
```
# dzungphieuluuky.github.io — AGENTS.md

## Stack
- Ruby/Jekyll (Beautiful Jekyll theme v6.0.1) — static site blog
- Hosted on GitHub Pages, built via GitHub Actions (Ruby 3.3)
- Custom CSS: Geist design system (DESIGN.md), Substack-minimalist fonts (Outfit/Lora/JetBrains Mono)
- Custom JS: modular init pattern (DarkMode, ReadingProgress, TocHighlight, CodeCopy, ImageLightbox, EnhancedSearch)
- LaTeX CV in assets/cv/

## Build Commands
- Dev: `bundle exec jekyll serve`
- Prod: `bundle exec jekyll build`
- CI: `.github/workflows/ci.yml`

## Content Rules
- Blog posts in `_posts/` with YAML front matter (layout: post, title, tags)
- Front matter is REQUIRED for Jekyll rendering
- Post filename format: YYYY-MM-DD-slug.md
- Never edit `beautifuljekyll.css` directly — use `custom-styles.css` or `_config.yml`
- Use CSS variables (`--text-primary`, `--bg-tertiary`, etc.) — never hardcode colors
- Test both light and dark mode

## Design Tokens
See `DESIGN.md` for the Geist design system (colors, typography, spacing, components)
- Grayscale palette, 10-step scales (100–1000)
- Blue = links/focus, Red = error, Amber = warning
- Spacing: 4px base scale
- Breakpoints: sm 401px, md 601px, lg 961px, xl 1200px, 2xl 1400px

## Copilot Instructions
AI writing guidance lives in `.github/copilot-instructions.md` (article writing, voice, banned patterns). Preserve those rules for any content drafting.
```

## TODOs
1. [x] Create `AGENTS.md` at project root with approved content

## Verification
- [x] AGENTS.md exists with correct 31-line content
- [x] DESIGN_BRIEF.md restored (was erroneously deleted by subagent)
- [x] No other files modified outside scope
