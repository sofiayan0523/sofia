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

- Routes are `/`, `/about`, `/blog`, `/career`, `/speaker`, `/ai-coworker-methodology`, `/blog/{slug}`, and `/posts/{slug}` compatibility redirect pages for all published posts.
- Content source split: homepage/about copy in `src/i18n/*`, career data in `src/data/career.ts`, posts in `src/content/posts/*.mdx`, AEO files in `public/llms.txt` and `public/agent.json`.
- Blog currently has 9 published posts: 5 travel and 4 ai-insights; `thoughts` exists as a category but has no published posts.
- Resolved personal-site audit: stale `/posts/{slug}` source links were fixed to `/blog/{slug}/`, and `/posts/{slug}` compatibility redirect pages now exist for all published posts.
- Resolved personal-site audit: `BaseLayout.astro` forwards FAQ data to `SEO.astro`, so Speaker and AI coworker pages emit FAQPage JSON-LD.
- Resolved personal-site audit: confirmed 404 external links were removed/unlinked (`numbersprotocol.github.io/numbers-ama/webinar/2025-12-06` and the Spotify playlist linked from About).
- `blog-improvement.md` contains the verified 2026-06-04 action list plus implementation progress; all Actions 1-18 are complete locally as of loop iteration 10. AEO capability discovery includes `/agent.json`, `/.well-known/agent.json`, MCP server-card, agent skills index, and API catalog.
- 2026-06-04 loop iteration 1 completed P0 fixes in sofia-s-blog: `/posts/...` source links changed to `/blog/.../`, `BaseLayout.astro` now forwards `faq` to `SEO.astro`, confirmed 404 external links were removed/unlinked, and `npm run build` passes with FAQPage JSON-LD on Speaker and AI coworker pages.
- 2026-06-04 loop iteration 2 completed P1 fixes in sofia-s-blog: generated static `/posts/{slug}/` compatibility pages, added AEO capability discovery files under `public/.well-known/`, added `scripts/check-links.mjs` plus `npm run check:links`, and extended `scripts/validate-aeo-files.mjs`; `npm run check:links` and AEO validation pass.
- 2026-06-04 loop iteration 3 completed active stale URL cleanup for docs/scripts, hid empty `thoughts` category by deriving blog filters from published posts, added an AI adoption series section on `/blog`, added series previous/next navigation on the four AI posts, and updated `llms.txt` with the `zero-to-ai-native` cluster; `npm run check:links` and AEO validation pass.
- 2026-06-04 loop iteration 4 updated sofia-s-blog homepage positioning and CTA map: hero now emphasizes enterprise AI adoption, content provenance/C2PA, and AI coworker methodology; first-screen CTAs route to Speaker, Blog, and About; Speaker is in header/footer nav; About and Career have contextual CTA sections; `npm run check:links` and AEO validation pass.
- 2026-06-04 loop iteration 5 strengthened sofia-s-blog Speaker funnel: hero email CTA, best-fit/not-best-fit guide, fit-section email CTA, tracking attributes on speaker enquiry links, event names documented in `docs/utm-convention.md`, and Speaker canonical origin fixed to `https://sofiayan.cc`; `npm run check:links` and AEO validation pass.
- 2026-06-04 loop iteration 6 completed sofia-s-blog About narrative hierarchy: About now centers a reflective translation through-line, separates Playground links from compact public receipts, routes dense proof to Career/Speaker, and still preserves AEO credential signals; `npm run check:links` and AEO validation pass.
- 2026-06-04 loop iteration 7 completed sofia-s-blog CTA tracking for Action 14: `BaseLayout.astro` dispatches `data-analytics-event` clicks to GA4/Zaraz/custom event, Speaker/AI methodology/blog share CTAs carry event metadata, `npm run check:cta` validates the matrix, and docs use live Numbers funnel URLs; check:cta, check:links, and AEO validation pass.
- 2026-06-04 loop iteration 8 completed sofia-s-blog editorial roadmap for Action 15: `docs/editorial-roadmap.md` defines 8 scene-led planned essay briefs across AI coworker management, humanities AI adoption, provenance/C2PA, founder notes, and travel-work crossover; `npm run check:roadmap`, check:cta, check:links, and AEO validation pass.
- 2026-06-04 loop iteration 9 completed sofia-s-blog Action 17/18 guardrails: blog posts now render category-aware contextual CTAs (AI -> methodology/Speaker, travel -> About/Blog), `docs/site-guardrails.md` documents CTA/authority rules, `npm run check:brand` validates CTA map, metric placement, and generic phrase avoidance; all checks pass.
- 2026-06-04 loop iteration 10 completed final local audit for sofia-s-blog blog improvements: `npm run check:all` now runs brand, roadmap, CTA, AEO, build/Pagefind/link checks; `blog-improvement.md` final audit says Actions 1-18 are complete, and built HTML spot checks pass for FAQPage plus AI/travel contextual CTAs.

---
_Last system refresh: 2026-06-04 09:54 UTC_
