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
- 2026-06-05 typography system (sofia-s-blog): 先前全站無載入任何 web font（標題 fallback、中文交給 OS）。改為混血方案——`tailwind.config.mjs` 設 `display`=Newsreader+Noto Serif TC（思源宋體，標題）、`sans`=Inter+Noto Sans TC（思源黑體，內文）、`mono`=IBM Plex Mono（小標）。`BaseLayout.astro` head 用 Google Fonts 載入這 5 個家族（preconnect + display=swap）。`global.css` 加：body line-height 1.7、h1-3 letter-spacing -0.012em、`.uppercase.tracking-widest` 小標改 mono+0.14em、prose 標題用 serif、prose 內文 line-height 1.85。`npm run check:all` 通過。
- 2026-06-05 type scale 收斂（sofia-s-blog，承上字體系統）：原標題偏大（首頁 hero text-7xl=72px、內頁主標 4xl/5xl）換襯線後顯笨重，整體下調一階——首頁 hero `text-4xl md:text-5xl lg:text-6xl`、各內頁 h1（about/blog/speaker/methodology/career/blog post）`text-3xl md:text-4xl`、首頁 section h2 `text-2xl md:text-3xl`、404 `text-5xl md:text-6xl`。section h2（2xl/3xl）維持不變。`npm run check:all` 30 項通過。
- 2026-06-05 type scale 第二次收斂 + 孤字修正（sofia-s-blog）：再收一階——hero `text-3xl md:text-4xl lg:text-5xl`、內頁 h1 `text-2xl md:text-3xl`、section h2 `text-xl md:text-2xl`、flat 子標 `text-xl`、hero/lead 描述 `text-base md:text-lg`、404 數字 `text-4xl md:text-5xl`。`global.css` 加 `text-wrap: balance`（h1-h4，解 CJK 標題孤字「第二行剩一兩字」）與 `text-wrap: pretty`（p）。`npm run check:all` 30 項通過。
- 2026-06-05 授權政策改為禁止 AI 訓練（sofia-s-blog）：`ai-train=no`（搜尋與引用仍允許、引用需署名）。一致更新 7 處：`public/robots.txt`(Content-Signal+註解)、`public/llms.txt`、`public/agent.json` 與 `public/.well-known/agent.json`(`ai_train: "disallow"`，兩份須位元組相同)、`public/.well-known/agent-skills/index.json`(license_signal)、`src/pages/blog/[...slug].md.ts`(.md License 行)、`src/components/SEO.astro`(每頁注入的 `ai-content-signal` meta，原本漏網)、`scripts/validate-aeo-files.mjs`(檢查字串改 `ai-train=no`)。dist 已無 `yes-with-attribution`/`allow_with_attribution` 殘留。`npm run check:all` 30 項通過。
- 2026-06-05 i18n 英文補齊（sofia-s-blog）：i18n 機制是「同頁 render zh/en 用 CSS data-l 切換」，`<T>` 走 zh.ts/en.ts（73 鍵對齊）。本輪補三頁硬寫內容的英文：(1) `speaker.astro` 原本 100% 中文 → 全頁改 data-l 雙語、FAQ 加 question_en/answer_en（FAQPage schema 仍用 zh question/answer）；(2) `career.ts` 加 description_en/title_en，`career.astro` 的 work 描述、speaking/media/podcast 標題改 data-l 雙語（公司名與 source 維持原樣）；(3) `ai-coworker-methodology.astro` 內文「本來就已雙語」（先前 audit 誤判，中文在多行 data-l=zh 區塊內），只缺 FAQ → faqs 加 question_zh/answer_zh 並改雙語渲染。部落格文章（MDX 散文）依使用者決定單獨處理、暫維持中文。`npm run check:all` 30 項通過。
- 2026-06-05 Speaker 精簡（sofia-s-blog）：移除「三種演講規格 / Three formats」整個 section（Format A/B/C 卡片），並從 faqs 移除「費用怎麼算 / How is the fee」一題（FAQ 6→5），保留洽談彈性。同步把 `public/llms.txt` 的 speaker 描述從「three formats (90-min/half-day/full-day)」改成彈性措辭「keynotes, workshops, and in-depth adoption sessions scoped to your context」。`npm run check:all` 30 項通過。注意：本 workspace auto-commit 到分支並開 PR，須 merge 進 main 後 GitHub Pages 才會重新部署（有時差），線上看不到新版多半是還沒部署或瀏覽器快取。
- 2026-06-05 editorial-minimal 改版 v1（sofia-s-blog）：注入單一重點色赭紅（深一階確保 AA）——`global.css` 把 `--primary` light 設 `14 78% 42%`、dark `16 82% 64%`，`--ring` 同步；因 `text-primary`/`bg-primary` 僅用於連結/hover/CTA 按鈕，故一次套用到整個互動層。新增 `.prose a` 用重點色、`a` underline-offset 0.2em。移除「AI 範本」破綻：以 `de-template.sh`（已刪）sed 掉全站 `hover:-translate-y-*` 與 `hover:shadow-lg/md/xl`（4 檔）。`npm run check:all` 30 項通過。
- 2026-06-05 editorial-minimal v2（sofia-s-blog）：重點色改為淡雅橄欖綠（`--primary` light `112 20% 40%`、dark `110 26% 66%`，`--ring` 同步；偏深一階確保 AA）。結構改造：Career 四區塊移除 emoji 色塊圖示，改為「mono 編號 01-04 + 頂部 hairline + 襯線標題」；Speaking/Media/Podcast 從 `rounded-xl bg-card border` 盒子改成 `divide-y divide-border/60` 細線清單，來源標籤改 mono；Work logo 卡片改輕量 hairline、移除 hover ↗。首頁 stats 改 mono label + `md:divide-x` 細線分隔、數字 serif text-2xl。About「延伸了解」proof 從 bg-secondary 盒子改 `border-t` hairline 行。`npm run check:all` 30 項通過。
- 2026-06-05 全站去 emoji（sofia-s-blog，editorial v3）：用 perl 腳本（已刪 strip-emoji.sh）移除 speaker/about/ai-coworker-methodology 的裝飾 emoji，範圍 `[\x{1F000}-\x{1FAFF}\x{2300}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE0F}\x{200D}\x{2640}\x{2642}]`，刻意保留方向箭頭（→ ← ↔，U+2190-21FF）。speaker 的 micro-receipts strip、過往演講/receipts 清單、聯絡方式前綴 emoji 全清；about「目前」清單與 playground emoji 清除，playground 卡片移除 emoji/↗ 列改成標題內小 ↗、輕量 hairline 邊框；methodology 的 stat strip emoji 清。注意：career.ts 媒體標題的 `│`(U+2502 box-drawing) 與 methodology 的 ↔ 是正常內容非 emoji。Reactions.tsx/Comments.astro 反應 emoji 屬功能性保留。`npm run check:all` 30 項通過。
- 2026-06-05 Career 內容補件（sofia-s-blog）：核對後 5 個連結原本都不存在，已加入 `src/data/career.ts`（標題均以 curl 抓 og:title/title 驗證）。speakingItems 新增：經理人 Vibe Coding 實作課（portaly）、DIGITIMES D Forum 2020（DT42 時期）、ACCUPASS「誰說 AI 與你無關」2020（DT42 時期）。mediaItems 新增：Meet 創業小聚「嚴世紀觀點：當海水退潮後，NFT 是泡沫還是創新？」、MakerPRO OpenVINO Edge AI 論壇報導 2019（DT42 時期）。DT42 公司本身已在 workItems。
- 2026-06-05 手機版導覽改漢堡選單（sofia-s-blog，`Header.astro`）：原本 5 個 nav 連結 + 品牌 + 語言/主題鈕全擠在 64px 列裡，窄螢幕擁擠。改為桌機 `hidden md:flex` 維持橫排；手機只留品牌 + LanguageSwitcher + ThemeToggle + 漢堡鈕（`#mobile-menu-btn`），點開下拉 `#mobile-menu`（`md:hidden`）堆疊式選單（divide-y 細線、active 用 primary 圓點 + aria-current）。is:inline script 控制 toggle、切換 open/close icon、Escape 關閉、設 aria-expanded。`npm run check:all` 30 項通過。
- 2026-06-05 AEO/SEO/分析盤點與強化（sofia-s-blog）：線上驗證四大維度大致到位（robots 全 AI bot 允許、sitemap、llms.txt 合規、agent.json + .well-known 全 200、JSON-LD 含 speaker/methodology FAQPage、OG/Twitter 完整、GA4 + Cloudflare Web Analytics 實測啟用）。本輪補兩項：(1) robots.txt 把 Content-Signal 從註解改為作用中指令；(2) 新增 `src/pages/blog/[...slug].md.ts` 產生每篇文章 `.md` 純文字鏡像（剝除 MDX import/export、附 metadata+授權），llms.txt 加「Plain-text (Markdown) versions」段連結。剩餘選配（Web Bot Auth http-message-signatures 404、api-catalog content-type=octet-stream 受 GitHub Pages 限制）開成 GitHub issue #36（label: aeo）追蹤。`npm run check:all` 30 項通過。
- 2026-06-05 reader-facing UX pass (sofia-s-blog): About "Public receipts" 區塊改為讀者語言（標題「想更了解我，或想找我合作？」+ 卡片「完整經歷與公開紀錄」「邀我演講或工作坊」），移除解釋網站 IA 的 meta 文案。AI 導入導讀系列從 `/blog` 移到首頁（stats 與最新文章之間，標題「第一次來？從這裡開始」，卡片改用 1-4 編號取代 Pillar/Cluster 術語）。Blog 重排為「標題→分類篩選→文章網格→搜尋（次要、置底）」，`blog.headline` zh 改為「故事與觀察」。`npm run check:all` 通過。

---
_Last system refresh: 2026-06-06 03:49 UTC_
