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

## Installed Skills

- **`aeo-assessment`** (system)
- **`agent-readiness-generator`** (system)
- **`ai-bot-traffic`** (system)
- **`doc-coauthoring`** (system)
- **`frontend-design`** (system)
- **`google-ads`** (system)
- **`google-workspace`** (system)
- **`gov-projects-search`** (space)
- **`harness-dev`** (system)
- **`harness-execution`** (system)
- **`harness-plan`** (system)
- **`image-generation`** (system)
- **`internal-comms`** (system)
- **`line-messaging`** (system)
- **`meta-ads`** (system)
- **`morning-brief`** (space)
- **`ms-office-suite`** (system)
- **`omni-help`** (system)
- **`pdf`** (system)
- **`short-video`** (system)
- **`skill-creator`** (system)
- **`theme-factory`** (system)
- **`webapp-testing`** (system)
- **`z-agent-ticket-creation`** (system)
- **`z-check-comment`** (system)
- **`z-report-status`** (system)
- **`z-sync`** (system)
- **`z-ticket-check`** (system)
- **`z-writing-rules`** (system)

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
- 2026-06-05 reader-facing UX pass (sofia-s-blog): About "Public receipts" 區塊改為讀者語言（標題「想更了解我，或想找我合作？」+ 卡片「完整經歷與公開紀錄」「邀我演講或工作坊」），移除解釋網站 IA 的 meta 文案。AI 導入導讀系列從 `/blog` 移到首頁（stats 與最新文章之間，標題「第一次來？從這裡開始」，卡片改用 1-4 編號取代 Pillar/Cluster 術語）。Blog 重排為「標題→分類篩選→文章網格→搜尋（次要、置底）」，`blog.headline` zh 改為「故事與觀察」。`npm run check:all` 通過。

---
_Last system refresh: 2026-06-05 06:37 UTC_
