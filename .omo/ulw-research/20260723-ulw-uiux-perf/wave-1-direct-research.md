# Wave 1 — Direct Research (Orchestrator)

## 1. Jekyll CWV Optimization Case Study (mathewsachin.github.io)
Source: https://mathewsachin.github.io/blog/2026/04/03/core-web-vitals-jekyll.html
Key findings:
- jekyll-picture-tag gem: responsive images at build time, WebP generation, width/height attributes for CLS
- Build-time minification (HTML/CSS/JS): custom Jekyll plugin, shaves KB off every page
- Rouge (build-time) over highlight.js (runtime): removes 30-60KB JS, improves INP
- Build-time TOC plugin: static HTML TOC, no DOM traversal JS, improves CLS + INP
- Pintora diagrams at build time: SVG embedded in HTML, no runtime JS
- Results: LCP 2.8s → 1.4s, FID 120ms → 45ms, CLS 0.15 → 0.05
- Note: GitHub Pages cache TTL is 10 minutes (hardcoded), can't override without CDN

## 2. Jekyll SEO Framework 2026 (thatdevpro.com)
Source: https://www.thatdevpro.com/insights/framework-jekyll/
Key findings:
- Jekyll 4.3.x in active maintenance, Ruby 3.2 baseline
- Core trio: jekyll-seo-tag, jekyll-sitemap, jekyll-feed
- GitHub Pages pins Jekyll to 3.10.0 via github-pages gem (v232 as of March 2026)
- Plugin whitelist: no jekyll-picture-tag, custom Liquid filters don't execute on stock Pages
- Solution: external build (GitHub Actions) → push _site to gh-pages branch
- Jekyll powers ~0.6% of all websites (W3Techs Mar 2026); ~71% of GitHub Pages dev blogs (GitHub Universe 2025)
- jekyll-seo-tag emits JSON-LD WebSite/WebPage/BlogPosting automatically

## 3. CSS content-visibility Research
Sources:
- https://web.dev/articles/content-visibility (7x rendering boost demo)
- https://csswizardry.com/2026/04/what-is-css-containment-and-how-can-i-use-it/ (Harry Roberts, 2026)
- https://machtml.com/en/blog/articles/css-content-visibility-contain-intrinsic-long-pages-safari-20260420-2026.html
- https://webperfclinic.com/article/css-content-visibility-rendering-performance-guide
- https://nolanlawson.com/2024/09/18/improving-rendering-performance-with-css-content-visibility/

Key findings:
- Baseline Newly Available September 2025 (all major browsers including Safari 18)
- content-visibility: auto + contain-intrinsic-size: auto 1000px on off-screen sections
- 7x rendering speed documented on travel blog (232ms → 30ms)
- 80% render time reduction real-world test (340ms → 60ms)
- INP improvement: 272ms → green zone (NitroPack/Google webinar)
- Never apply to above-fold content (hurts LCP)
- Pair with contain-intrinsic-size to prevent CLS
- CSS containment (contain: content/strict): Harry Roberts' OpenTable case study

## 4. Researcher Portfolio UX Analysis
Sources (direct visits + analyses):
- lilianweng.github.io: Hugo + PaperMod, minimal content-first, blog as primary
- arkashj.com: Next.js 15, data-dense, O-1 visa optimization mindset
- dylantao.github.io: research-first redesign, "Make the thesis easier to find than the decoration"
- gregshevchenko.com: "Personal website as AI source page" - source graph concept
- cameronrye.dev: agent-readable portfolio (llms.txt, A2A AgentCard, MCP skills)
- alexandrekhoury.com: built entirely with AI, GEO optimization from 0→36 score

Common patterns:
- Research statement above fold
- Monochrome + accent color
- Content before decoration
- Publications with PDF/arXiv links
- Project cards with tags
- Custom domain (highest ROI)
- Dark/light mode expected

## 5. AI/Agent Optimization (GEO/AEO)
Sources:
- agnelnieves.com: "Optimizing your site for AI search 2026"
- cameronrye.dev: "Making my portfolio agent-readable"
- gregshevchenko.com: "Personal website as AI source page"
- alexandrekhoury.com: GEO audit

Key findings:
- Google's official guide: no special markup for AI Overviews, same index as classic search
- llms.txt / llms-full.txt emerging standard for AI agent consumption
- JSON-LD structured data critical for AI entity understanding
- A2A AgentCard protocol for agent-to-agent communication
- robots.txt should explicitly allow AI crawlers (GPTBot, ClaudeBot, Google-Extended, etc.)

## 6. CSS Performance Optimization (MDN + DebugBear)
Sources:
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/CSS
- https://www.debugbear.com/blog/content-visibility-api
- https://modern-css.com/lazy-rendering-without-intersection-observer/

Key findings:
- CSS containment module: contain and content-visibility
- contain: size | layout | style | paint | content | strict
- content-visibility: auto for off-screen content, hidden for tab panels/SPA views
- contain-intrinsic-size: auto keyword remembers real size after first render
- Apply via :nth-child(n+N) to skip above-fold items
- Avoid on: hero/LCP elements, sticky nav, elements with overflow
- CSS is render-blocking: critical CSS inlining recommended

## EXPAND
- LEAD: Font self-hosting vs Google Fonts CDN — real LCP impact for static sites — ANGLE: search for benchmarks
- LEAD: Jekyll build optimization — incremental regeneration, caching, liquid performance — ANGLE: Jekyll docs + community
- LEAD: llms.txt and A2A AgentCard for researcher portfolio — how relevant for non-agent audience? — ANGLE: search for academic site adoption
- LEAD: CSS cascade layers (@layer) performance impact — ANGLE: search for benchmarks
- LEAD: PurgeCSS / UnCSS for Jekyll to reduce CSS bundle — ANGLE: search for Jekyll integration
- LEAD: Safari-specific rendering quirks for content-visibility — ANGLE: Nolan Lawson blog + webkit.org
