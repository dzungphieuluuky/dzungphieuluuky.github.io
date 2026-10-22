---
slug: portfolio-uiux-improvements
status: drafting
intent: unclear
review_required: true
plan_path: .omo/plans/portfolio-uiux-improvements.md
plan_sha256: null
review_round_id: null
pending-action: write and review .omo/plans/portfolio-uiux-improvements.md
review:
  momus:
    status: pending
    workspace_root: null
    runtime_home: null
    target: .omo/plans/portfolio-uiux-improvements.md
    round_id: null
    plan_sha256: null
    launch_id: null
    session: null
    result: null
  independent:
    status: pending
    workspace_root: null
    runtime_home: null
    target: .omo/plans/portfolio-uiux-improvements.md
    round_id: null
    plan_sha256: null
    launch_id: null
    session: null
    result: null
approach: "Restructure the portfolio around a research-first information hierarchy: reorder the homepage with a research statement above the fold → project cards → publications list → blog feed; add a dedicated Publications/Research page; clean up CSS bloat; remove Font Awesome dependency; improve accessibility; consolidate dark mode; restyle the 404 page into the theme; add Google Scholar/ORCID/LinkedIn to social footer."
---

# Draft: portfolio-uiux-improvements

## Components (topology ledger)
| id | outcome (one line) | status | evidence path |
|----|-------------------|--------|---------------|
| C1 | Homepage restructure — research statement, project cards, publication list, blog feed in priority order | active | `index.md` (wall of text, no visual hierarchy), `DESIGN_BRIEF.md` (academic-elegant philosophy) |
| C2 | New Research/Publications page — dedicated page with PDF/arXiv links, advisor names, venue tags | active | No existing publications page; `cv.md` has no publication list; `index.md` buries projects |
| C3 | Project showcase components — card grid with Problem→Process→Outcome framework | active | `index.md` has 4 projects described in prose; no visual cards or grid layout |
| C4 | CSS cleanup & optimization — remove bloat, !important overrides, consolidate dark mode, fix reading width | active | `custom-styles.css` 1432 lines — unused animations (`postEntrance`, `lightboxZoom`), excessive `!important`, 728px vs 900px discrepancy |
| C5 | JS optimization — remove Font Awesome, lazy-load non-critical modules | active | `head.html:186` loads Font Awesome 6.4.0 (used only for 1 search icon); `custom-script.js` 895 lines — all modules load on every page |
| C6 | 404 page theme integration — rewrite to use Jekyll template, keep visual fun | active | `404.html` is standalone HTML (470 lines) — no navbar, no footer, no theme styling, inconsistent |
| C7 | Social/SEO enrichment — add Google Scholar, ORCID, enable LinkedIn | active | `_config.yml:54-65` — LinkedIn commented out; no Google Scholar or ORCID social link types exist |
| C8 | Accessibility pass — contrast, headings hierarchy, alt text, focus indicators, reduced motion | active | `custom-styles.css` has no skip-nav link; no alt text audit possible; no WCAG contrast verification |
| C9 | Performance optimization — image optimization, font subsetting, Core Web Vitals | deferred | Lower priority than content restructuring; after C4-C5 |

## Open assumptions (announced defaults)
| assumption | adopted default | rationale | reversible? |
|------------|----------------|--------|-------------|
| Reading width | 728px (current) — keep as is, aligns with Substack/newsletter standard | `custom-styles.css:82` — DESIGN_BRIEF says 900px but current implementation is 728px; changing would break layout everywhere | Yes (CSS variable) |
| Color palette | Keep monochrome + black accent (current) — aligns with research portfolio best practices | Research shows monochrome + 1 accent is dominant pattern across top researcher sites (Lilian Weng, Karpathy, Olah) | Yes (CSS variables) |
| Font stack | Keep Be Vietnam Pro + Lora + JetBrains Mono — already optimal | DESIGN_BRIEF.md and research consensus both validate serif body + sans headings + mono code | Yes |
| Dark mode approach | Keep CSS variable override pattern (current) — no JS theme detection | Already implemented; just needs consolidation and gap-filling | Yes |
| 404 page | Rewrite to use Jekyll base layout — consistency over standalone flair | Standalone HTML breaks theme consistency; user will notice missing navbar/footer | Yes |
| Homepage structure | Research statement → Projects → Publications → Blog (descending priority) | Research shows faculty spend ~90 seconds; content-first hierarchy is critical (SitesPlaced 2026, calmops 2026) | Yes |
| Project cards | 2-column grid with image + tags + brief description + links | Research shows "skimmable content" is key; current prose format buries information | Yes |
| Font Awesome | Remove — replace search icon with inline SVG | Used only for 1 icon (`fa-search` in `nav.html:91`); Font Awesome is 30KB+ for one icon | Yes (add back if needed) |
| Google Scholar/ORCID | Add to social footer via _config.yml | Both are trust signals in the researcher portfolio pyramid | Yes |

## Findings (cited - path:lines)

### UI/UX Code Survey

**Current state:**
1. **Homepage** (`index.md`) — 70 lines of pure Markdown prose, no visual hierarchy. Research interests, projects, and fun facts are flat H2 sections. No research statement above the fold. The title "Representation" and subtitle "Everything is a representation of something else" are poetic but not informative for a recruiter scanning for "what does this person work on."
2. **Blog archive** (`blog.html`) — Minimal front matter; relies on Beautiful Jekyll's `home` layout. Post previews work but lack publication-style metadata.
3. **Tags page** (`tags.html`) — 368 lines total (247 lines CSS + HTML). Over-engineered for a tags page — custom gradient backgrounds, animations, SVG icons per tag. The design philosophy mismatch is significant.
4. **CV page** (`cv.md`) — Well-structured with download buttons and PDF viewer. Good UX. Could integrate publication list.
5. **404 page** (`404.html`) — Standalone HTML (470 lines) with bouncing geometry animation. Visually fun but completely outside the Jekyll theme — no navbar, footer, or dark mode support. Inconsistent.
6. **CSS** (`custom-styles.css`) — 1432 lines. Well-organized with sections. Issues:
   - `!important` used 40+ times (table overrides, dark mode overrides)
   - Duplicate animation definitions (`lightboxZoom` defined twice: line 283 and line 998)
   - `postEntrance` animation (line 533-536) adds 400ms+ delay per post — hurts INP Core Web Vital
   - Hardcoded values in places (e.g., `#CCCCCC` at line 404, `#333333` at lines 664, 1191)
   - Font Awesome loaded for one icon (`fa-search`)
   - Reading width is 728px but DESIGN_BRIEF specifies 900px — discrepancy
7. **JS** (`custom-script.js`) — 895 lines. Modular pattern, good. Issues:
   - All 12 modules initialize on every page regardless of need (`DOMContentLoaded` at line 879)
   - `SchemaMarkup` declares BlogPosting type even on non-blog pages
   - `ReadingTime` creates metadata-bar if missing — could cause layout shift
   - `AutoNumbering` runs on every page
8. **Config** (`_config.yml`) — LinkedIn commented out (line 65). No Google Scholar or ORCID fields exist (not supported by Beautiful Jekyll theme natively). Page/navbar colors set to dark navy/blue but custom CSS overrides them to black/white — dead config vars.

### External Research (bg_ba3f466 — librarian report, 14+ sources)
Key findings from the research report (cross-referenced from lilianweng.github.io, colah.github.io, karpathy.ai, sander.ai, SitesPlaced 2026, calmops 2026, own.page 2026, motif.bio 2026, etc.):
- **Content-first hierarchy** is critical — faculty spend ~90 seconds on your site
- **Monochrome + accent** is the dominant color pattern across top researcher sites
- **Custom domain** is the single highest-ROI action ($12/year)
- **Research statement** must be above the fold (1 paragraph: what, why, where next)
- **Publications list** with PDF/arXiv links, advisor names, venue tags is P1 content
- **Project cards** (Problem→Process→Outcome) beat prose descriptions for scannability
- **Dark/light mode** is expected (69% of ML researchers prefer dark mode)
- **No splash animations, page loaders, carousels, or stock photography**
- **Static site generator** (Jekyll/Hugo/11ty) is the standard — already satisfied

## Decisions (with rationale)

### D1: Keep current stack (Jekyll + Beautiful Jekyll)
*Rationale: Already using the recommended static site generator. Research confirms Jekyll + GitHub Pages is the gold standard for researcher portfolios. Migration to Hugo/11ty would be 10x effort for marginal gain.*

### D2: Restructure homepage around research-first priority
*Rationale: Current `index.md` is a flat wall of text. Research says "faculty spend ~90 seconds." The above-fold area must communicate research focus immediately. New order: Research Statement → Projects (cards) → Publications → Blog → About/Contact.*

### D3: Create a dedicated Research page for publications
*Rationale: Even with limited publications, a dedicated page signals professionalism. Lilian Weng, Sander Dieleman, and Karpathy all have separate publication/research pages. Include: paper title, venue, year, PDF link, arXiv link, code link, advisor names.*

### D4: Replace prose projects with card grid layout
*Rationale: Current 4 projects are described in long paragraphs. Research shows "skimmable content" is critical. Cards with image, tags, 2-sentence summary, and links let readers scan and dive deeper.*

### D5: Remove Font Awesome, use inline SVG for search icon
*Rationale: Font Awesome 6.4.0 (~30KB+ CSS) is loaded for exactly 1 icon (`fa-search`). Replace with inline SVG. This improves LCP and reduces external dependency. Reversible by adding back the link.*

### D6: Remove unused CSS animations and consolidate !important overrides
*Rationale: `postEntrance` animation adds 60-420ms delay per post preview, hurting INP. `!important` overrides make maintenance harder. Consolidating dark mode styles reduces duplication.*

### D7: Integrate 404 page into Jekyll theme
*Rationale: Current standalone HTML is visually inconsistent — no navbar, no footer, no dark mode. Keep the bouncing geometry concept but wrap it in the base template.*

### D8: Add Google Scholar and ORCID to social links
*Rationale: Both are top trust signals for researchers. Beautiful Jekyll doesn't support them natively, so we need custom footer entries. LinkedIn should also be enabled.*

### D9: Add accessibility basics — skip nav link, focus indicators, alt text
*Rationale: WCAG 2.1 AA compliance is increasingly expected. A skip navigation link and visible focus indicators are quick wins with high impact.*

## Scope IN

1. Homepage restructure (index.md → structured layout with sections)
2. New Research page (research.md — publications list)
3. Project showcase card components (CSS grid + HTML template)
4. CSS cleanup & optimization (remove bloat, consolidate, fix reading width consistency)
5. Font Awesome removal (replace search icon with SVG)
6. 404 page theme integration
7. Social/SEO enrichment (Google Scholar, ORCID, LinkedIn)
8. Accessibility pass (skip nav, focus indicators, reduced motion)
9. Dark mode gap-filling

## Scope OUT (Must NOT have)

1. ❌ No migration away from Jekyll/GitHub Pages
2. ❌ No JavaScript frameworks (React, Vue, etc.)
3. ❌ No splash animations, page loaders, or parallax effects
4. ❌ No redesign of the blog post reading experience (already good)
5. ❌ No new social features (comments, sharing widgets)
6. ❌ No analytics integration changes
7. ❌ No content changes to existing blog posts (structure only)
8. ❌ No CV PDF redesign (LaTeX content is separate)
9. ❌ No new third-party dependencies

## Open questions

None — all forks have been resolved through research and evidence. UNCLEAR path with announced defaults; any veto at approval gate.

## Approval gate
status: awaiting-approval
