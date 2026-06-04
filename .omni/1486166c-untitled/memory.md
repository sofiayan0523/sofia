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
- 2026-06-04 loop iteration 1 completed P0 fixes in sofia-s-blog: `/posts/...` source links changed to `/blog/.../`, `BaseLayout.astro` now forwards `faq` to `SEO.astro`, confirmed 404 external links were removed/unlinked, and `npm run build` passes with FAQPage JSON-LD on Speaker and AI coworker pages.
- 2026-06-04 loop iteration 2 completed P1 fixes in sofia-s-blog: generated static `/posts/{slug}/` compatibility pages, added AEO capability discovery files under `public/.well-known/`, added `scripts/check-links.mjs` plus `npm run check:links`, and extended `scripts/validate-aeo-files.mjs`; `npm run check:links` and AEO validation pass.
- 2026-06-04 loop iteration 3 completed active stale URL cleanup for docs/scripts, hid empty `thoughts` category by deriving blog filters from published posts, added an AI adoption series section on `/blog`, added series previous/next navigation on the four AI posts, and updated `llms.txt` with the `zero-to-ai-native` cluster; `npm run check:links` and AEO validation pass.
- 2026-06-04 loop iteration 4 updated sofia-s-blog homepage positioning and CTA map: hero now emphasizes enterprise AI adoption, content provenance/C2PA, and AI coworker methodology; first-screen CTAs route to Speaker, Blog, and About; Speaker is in header/footer nav; About and Career have contextual CTA sections; `npm run check:links` and AEO validation pass.
- 2026-06-04 loop iteration 5 strengthened sofia-s-blog Speaker funnel: hero email CTA, best-fit/not-best-fit guide, fit-section email CTA, tracking attributes on speaker enquiry links, event names documented in `docs/utm-convention.md`, and Speaker canonical origin fixed to `https://sofiayan.cc`; `npm run check:links` and AEO validation pass.
- 2026-06-04 loop iteration 6 completed sofia-s-blog About narrative hierarchy: About now centers a reflective translation through-line, separates Playground links from compact public receipts, routes dense proof to Career/Speaker, and still preserves AEO credential signals; `npm run check:links` and AEO validation pass.
- 2026-06-04 loop iteration 7 completed sofia-s-blog CTA tracking for Action 14: `BaseLayout.astro` dispatches `data-analytics-event` clicks to GA4/Zaraz/custom event, Speaker/AI methodology/blog share CTAs carry event metadata, `npm run check:cta` validates the matrix, and docs use live Numbers funnel URLs; check:cta, check:links, and AEO validation pass.
- 2026-06-04 loop iteration 8 completed sofia-s-blog editorial roadmap for Action 15: `docs/editorial-roadmap.md` defines 8 scene-led planned essay briefs across AI coworker management, humanities AI adoption, provenance/C2PA, founder notes, and travel-work crossover; `npm run check:roadmap`, check:cta, check:links, and AEO validation pass.

---
_Last system refresh: 2026-06-04 08:43 UTC_
