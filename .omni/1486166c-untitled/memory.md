# Workspace Context

<!-- This file is auto-maintained. The Repositories section is refreshed -->
<!-- by the system. The AI should maintain Environment & Key Discoveries. -->

**Workspace root (absolute path):** `/home/workspaces/conversations/1486166c-a963-411e-ab65-2d5b4c6abce8`

## Repositories

- **`personal-auto/`** — Branch: `omni/1486166c/personal-auto`, Remote: `sofiayan0523/personal-auto`

- **`sofia-s-blog/`** — Branch: `omni/1486166c/sofia-s-blog`, Remote: `sofiayan0523/sofia-s-blog`
  - **URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## Environment & Tools

- sofia-s-blog: Astro 5 static site with MDX, React islands, Tailwind CSS, RSS, sitemap, and Pagefind post-build search.
- Build workflow: `npm ci` then `npm run build`; GitHub Pages deploy workflow uses Node 20 and publishes `dist/`.
- Production domain: `https://sofiayan.cc` via `public/CNAME`; Astro `site` is also `https://sofiayan.cc`.

## Key Discoveries

- Routes are `/`, `/about`, `/blog`, `/career`, `/speaker`, `/ai-coworker-methodology`, and `/blog/{slug}`; there is no `/posts/{slug}` route.
- Content source split: homepage/about copy in `src/i18n/*`, career data in `src/data/career.ts`, posts in `src/content/posts/*.mdx`, AEO files in `public/llms.txt` and `public/agent.json`.
- Blog currently has 9 published posts: 5 travel and 4 ai-insights; `thoughts` exists as a category but has no published posts.
- Personal-site audit: `/posts/{slug}` links in `public/llms.txt`, `src/pages/ai-coworker-methodology.astro`, and some posts are broken; actual post route is `/blog/{slug}`.
- Personal-site audit: `speaker.astro` and `ai-coworker-methodology.astro` pass `faq={faqs}`, but `BaseLayout.astro` does not forward `faq` to `SEO.astro`, so FAQPage JSON-LD is not emitted.
- Personal-site audit: generated external-link check found two confirmed 404s: `numbersprotocol.github.io/numbers-ama/webinar/2025-12-06` and the Spotify playlist linked from About.
- `blog-improvement.md` contains the verified 2026-06-04 action list plus brand/content/IA/funnel strategy actions, marked as `[Verified]`, `[Strategy]`, or `[Verified + Strategy]`; current AEO capability discovery has `/agent.json` and `/.well-known/agent.json`, but no MCP server card, agent skills index, or API catalog.

---
_Last system refresh: 2026-06-04 04:20 UTC_
