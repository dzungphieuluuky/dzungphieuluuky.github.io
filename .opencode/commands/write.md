---
description: Draft a blog post for dzungphieuluuky.github.io
---

# Write Blog Post

Draft a blog post for: $ARGUMENTS

## Your Task

1. **Clarify audience & purpose** — who is this for, what should they take away?
2. **Read `.github/copilot-instructions.md`** — apply the voice, structure, and banned-pattern rules
3. **Create post skeleton** — outline with one purpose per section
4. **Draft in `_posts/YYYY-MM-DD-slug.md`** — must include YAML front matter:

```yaml
---
layout: post
title: Your Title
subtitle: Optional subtitle
tags: [tag1, tag2]
author: dzungphieuluuky
---
```

5. **Verify locally** after drafting: `bundle exec jekyll build` must succeed
6. **Wait for approval** before publishing

## Style Rules

- Lead with concrete example, anecdote, or data point
- Short, direct sentences. No filler.
- Never open with "In today's rapidly evolving landscape"
- Never use "game-changer", "cutting-edge", "revolutionary"
- Prefer active voice. Cut adverbs.
- Use specific numbers when available.
- Mark opinion explicitly ("We are firmly in opinion territory here...")

## Post Structure

### Technical Guides
- Open with what the reader gets
- Code/terminal examples in every major section
- End with concrete takeaways

### Essays / Opinion
- Start with tension, contradiction, or sharp observation
- One argument thread per section
- Examples that earn the opinion

## Quality Gate

- [ ] Voice matches `.github/copilot-instructions.md` rules
- [ ] No banned patterns (filler, hype, generic openings)
- [ ] Facts verified against provided sources
- [ ] YAML front matter valid and complete
- [ ] `bundle exec jekyll build` passes
- [ ] Preview both light & dark mode
