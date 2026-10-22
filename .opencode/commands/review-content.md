---
description: Review blog post content for quality, voice, and style consistency
---

# Review Content

Review the blog post: $ARGUMENTS

## Quality Dimensions

### Voice & Style (from `.github/copilot-instructions.md`)
- [ ] Leads with concrete example, not abstraction
- [ ] No banned patterns: generic openings, "Moreover/Furthermore", hype language
- [ ] Short, direct sentences preferred
- [ ] Active voice, minimal adverbs
- [ ] Matches Substack-minimalist brand tone

### Technical Accuracy
- [ ] Code examples work (syntax, runnable)
- [ ] Jekyll/Liquid syntax correct
- [ ] Links valid
- [ ] Claims supported by provided evidence

### Structure
- [ ] Strong opening hook (example, anecdote, data point)
- [ ] Each section has one clear purpose
- [ ] No fluff paragraphs — every sentence earns its place
- [ ] Closing is concrete, not summary padding

### Front Matter
- [ ] `layout: post`
- [ ] Title captures the post in ≤ 12 words
- [ ] Tags accurate and consistent with existing taxonomy
- [ ] Filename: `YYYY-MM-DD-slug.md`

### Build Check
- [ ] `bundle exec jekyll build` succeeds with no warnings

## Output

For each issue found, return:
- **File**: line number
- **Problem**: what's wrong
- **Fix suggestion**: exact rewrite

Group by severity: BLOCKER / MINOR / STYLE
