# Blog 重做計畫 (sofia-s-blog v2)

> 將現有 React + Vite + Supabase 的個人網站，重做為以 Astro 為核心的純靜態部落格，部署在 GitHub Pages，內容以 Markdown 形式存於 repo。

---

## 架構決策摘要

| 項目 | 決定 |
|------|------|
| 框架 | Astro 5+ |
| 內容格式 | Markdown + MDX |
| 內容管理 | Astro Content Collections（Zod schema 驗證 frontmatter） |
| 部署平台 | GitHub Pages + GitHub Actions |
| 圖片儲存 | Repo 內 `public/images/`（不使用外部 CDN/儲存） |
| 樣式 | Tailwind CSS（沿用現有設計 token） |
| 互動元件 | Astro Islands（僅必要處保留 React） |
| 搜尋 | Pagefind（客戶端、純靜態） |
| 留言（選配） | giscus（GitHub Discussions 為後端） |
| 分析（選配） | Plausible 或 Umami |
| 移除項目 | Supabase / Auth / Admin / PostEditor / 大部分 shadcn UI |

---

## 目標目錄結構

```
sofia-s-blog/
├── public/
│   ├── images/
│   │   ├── og-image.jpg
│   │   ├── profile/
│   │   │   ├── sofia.png
│   │   │   └── sofia-speak.jpg
│   │   ├── logos/
│   │   │   ├── capture-logo.png
│   │   │   ├── numbers-logo.png
│   │   │   └── ...
│   │   └── posts/
│   │       └── {slug}/
│   │           ├── cover.jpg
│   │           └── 01.jpg ...
│   ├── favicon.svg
│   └── CNAME                 # 若使用 custom domain
├── src/
│   ├── content/
│   │   ├── config.ts         # Content Collection Zod schema
│   │   └── posts/
│   │       ├── 2024-04-06-venice.md
│   │       ├── 2024-04-01-bologna.md
│   │       └── ...
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── BlogCard.astro
│   │   ├── CaptureEye.astro
│   │   ├── SEO.astro
│   │   ├── ThemeToggle.tsx        # React Island
│   │   └── LanguageSwitcher.tsx   # React Island
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── career.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── rss.xml.ts
│   │   └── 404.astro
│   ├── styles/
│   │   └── global.css
│   ├── i18n/
│   │   ├── zh.ts
│   │   └── en.ts
│   └── utils/
│       └── format-date.ts
├── scripts/
│   └── migrate-fallback-posts.ts
├── .github/
│   └── workflows/
│       └── deploy.yml
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## Phase 1：基礎建設 ✅ 已完成（2026-05-07，Astro v5.18.1）

- [x] 1.1 已備份 React 版至 `legacy-react` 分支（remote SHA `1e579c0`）
- [x] 1.2 清空舊 React 程式碼；`src/assets/` 圖片已搬到 `public/images/profile/` 與 `public/images/logos/`
- [x] 1.3 手動建立 Astro 骨架（取代 `npm create astro@latest`，避免互動式 prompt）
- [x] 1.4 已安裝 integrations：
  - `@astrojs/mdx@^4`、`@astrojs/react@^4`、`@astrojs/sitemap@^3`、`@astrojs/tailwind@^5`、`@astrojs/rss@^4`
  - `tailwindcss@^3`、`@tailwindcss/typography@^0.5`
  - `pagefind@^1`（搜尋）
- [x] 1.5 `astro.config.mjs` 已設定：
  - `site: "https://sofiayan0523.github.io"`、`base: "/sofia"`
  - `output: "static"`、`trailingSlash: "ignore"`
  - integrations: mdx, react, sitemap, tailwind
- [x] 1.6 `tsconfig.json` extends `astro/tsconfigs/strict`，含 `@/*` path alias
- [x] 1.7 `npm run build` 已通過，產生 `dist/index.html`、`_assets/*.css`、`sitemap-*.xml`、`pagefind/`
- [x] 1.8 已修復 BASE_URL 結尾斜線 bug（`/sofiafavicon.ico` → `/sofia/favicon.ico`）

### Phase 1 產生的檔案結構

```
sofia-s-blog/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json + package-lock.json
├── .gitignore                # 新增 .env、dist/、.astro/
├── .env                      # 保留供 Phase 2 圖片下載使用，已 gitignored
├── blog-plan.md
├── README.md
├── public/
│   ├── favicon.ico、robots.txt
│   └── images/
│       ├── profile/          # sofia.png、sofia-speak.jpg
│       └── logos/            # 6 個品牌 logo
├── scripts/supabase-images.json
└── src/
    ├── content/config.ts     # Zod schema for posts collection
    ├── layouts/BaseLayout.astro
    ├── pages/index.astro     # 暫時的 scaffold 頁
    ├── styles/global.css     # CSS variables + Tailwind layers
    └── env.d.ts
```

---

## Phase 2：內容遷移 ✅ 已完成（2026-05-07）

- [ ] 2.1 定義 `src/content/config.ts` schema：
  ```ts
  import { defineCollection, z } from "astro:content";

  const posts = defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      excerpt: z.string().optional(),
      category: z.enum(["travel", "ai-tools", "thoughts"]),
      tags: z.array(z.string()).default([]),
      coverImage: z.string().optional(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      readTime: z.string().default("5 min"),
      draft: z.boolean().default(false),
    }),
  });

  export const collections = { posts };
  ```
- [x] 2.2 `scripts/migrate-posts.mjs` 寫好並執行：直接從 Supabase REST 抓 published 文章（取代讀 fallback 檔），產生 `src/content/posts/{slug}.mdx`。已對 MDX-special chars (`<`、`>`、`{`、`}`、`\`) 做 escaping，避免 `<-`/`->` 等被解析為 JSX。
- [x] 2.3 `scripts/download-images.mjs` 寫好並執行：成功下載全部 45 張圖（5.01 MB，19.7s 完成，0 失敗）。所有檔案落在 `public/images/posts/{slug}/{cover|NN}.jpg`。
- [x] 2.4 `src/components/CaptureEye.astro` 已建立：`<div class="capture-eye-wrapper"><capture-eye nid="..."><img src=".." loading="lazy" .. /></capture-eye></div>`
- [x] 2.5 `BaseLayout.astro` 加入 `<script type="module" src=".../@numbersprotocol/capture-eye@1.4.0/dist/capture-eye.bundled.js" is:inline>`（版本鎖定為 1.4.0）
- [x] 2.6 `npm run build` 通過，產生 6 個 HTML（1 home + 5 posts）；Pagefind 索引 5 篇、2385 字、`data-pagefind-body` 標記運作正常
- [ ] 2.7 commit: `feat: migrate posts to content collections`（auto-commit 將觸發）

### Phase 2 驗證證據

```text
$ node scripts/download-images.mjs
OK:     45
Skipped: 0
Failed: 0
Total:  5.01 MB downloaded

$ node scripts/migrate-posts.mjs
Wrote 2022-life-in-oslo.mdx (20 captures, 15.7 KB)
Wrote 2024-rome.mdx (4 captures, 4.0 KB)
Wrote 2024-florence.mdx (6 captures, 2.7 KB)
Wrote 2024-bologna.mdx (2 captures, 1.3 KB)
Wrote 2024-venice.mdx (8 captures, 4.8 KB)

$ npm run build
generating static routes
  └─ /index.html
  ├─ /blog/2022-life-in-oslo/index.html
  ├─ /blog/2024-bologna/index.html
  ├─ /blog/2024-florence/index.html
  ├─ /blog/2024-rome/index.html
  └─ /blog/2024-venice/index.html
[Pagefind] Indexed 5 pages, 2385 words
```

### Phase 2 補充：暫時的 blog post route

為了驗證 MDX 能渲染，已建立 `src/pages/blog/[...slug].astro`：
- `getStaticPaths` 用 `getCollection("posts", filter draft=false)`
- 修正 Astro 5 `post.id` 含 `.mdx` 副檔名問題：`post.id.replace(/\.mdx?$/, "")`
- 套 `BaseLayout`、`prose-neutral` 樣式
- 主文章區包 `<article data-pagefind-body>` 讓 Pagefind 正確索引
- Phase 3.4 會再優化（加 Header/Footer、樣式精修、回上頁按鈕等）

---

## Phase 3：頁面與設計重建 ✅ 已完成（2026-05-07）

### 3.1 設計系統移植 ✅
- [x] Tailwind config 已包含所有需要的 tokens、字體、動畫（Phase 1 完成）
- [x] CSS variables、prose 樣式已在 `src/styles/global.css`
- [x] `BaseLayout.astro` import global.css

### 3.2 共用元件 ✅（部分；toggles 延後）
- [x] `Header.astro`：純靜態，含 active link 高亮；自動處理 `/sofia` base prefix
- [x] `Footer.astro`：年份用 `new Date().getFullYear()`；外部連結 (Twitter/LinkedIn/GitHub/Email)；無 `/playground` 連結
- [x] `BlogCard.astro`：cover image lazy-load、category label 用 i18n、tags、發布日期
- [x] `SEO.astro`：title、description、OG、Twitter Card、article 專屬 meta、RSS alternate link
- [ ] `ThemeToggle.tsx` (React Island) — 延後到 Phase 6
- [ ] `LanguageSwitcher.tsx` (React Island) — 延後到 Phase 6（首版固定 zh-TW）

### 3.3 i18n ✅
- [x] `src/i18n/zh.ts` + `src/i18n/en.ts` 完整翻譯表（含 nav、home、about、blog、category、career、footer、404、common 等）
- [x] `src/i18n/index.ts` 提供 `getTranslations(lang)` helper，含 `{var}` 變數替換
- [x] 所有 .astro 元件統一用 `t("key")` 取字串

### 3.4 頁面 ✅
- [x] `pages/index.astro`：Hero（含 capture-eye 頭像）+ Stats（4 項）+ 最新 6 篇文章
- [x] `pages/about.astro`：About 內容 + Playground 5 張連結卡片（emoji + 中文描述）
- [x] `pages/blog/index.astro`：search box + 4 個分類 filter（純客戶端 JS 切換）+ 文章 grid
- [x] `pages/blog/[...slug].astro`：完整套 Header/Footer/SEO；back button；tags footer；prose 樣式
- [x] `pages/career.astro`：Work（6 項，含 logos）、Speaking（7 項）、Media（4 項）、Podcast（9 項）—— 從 `src/data/career.ts` 讀取
- [x] `pages/404.astro`：含 Header/Footer 與返回首頁按鈕

### 3.5 搜尋功能 ✅
- [x] Pagefind 已安裝且設為 `postbuild` hook
- [x] `data-pagefind-body` 包裹文章主體，索引 5 篇、2387 字
- [x] Blog 頁面載入 `pagefind-ui.css` + `pagefind-ui.js` 並掛載到 `#search`
- [x] 中文 UI 翻譯（搜尋中、找不到、清除…）

### 3.6 RSS Feed ✅
- [x] `pages/rss.xml.ts` 用 `@astrojs/rss` 產生
- [x] 修正 base path bug：URL 從 `https://sofiayan0523.github.io/blog/...` 修正為 `https://sofiayan0523.github.io/sofia/blog/...`
- [x] BaseLayout 經由 SEO 元件加入 `<link rel="alternate" type="application/rss+xml">`

### Phase 3 build 結果

```text
$ npm run build
[build] 10 page(s) built in 6.84s
generating static routes
  └─ /index.html
  ├─ /404.html
  ├─ /about/index.html
  ├─ /blog/index.html
  ├─ /blog/2022-life-in-oslo/index.html
  ├─ /blog/2024-bologna/index.html
  ├─ /blog/2024-florence/index.html
  ├─ /blog/2024-rome/index.html
  ├─ /blog/2024-venice/index.html
  ├─ /career/index.html
  └─ /rss.xml
[Pagefind] Indexed 5 pages, 2387 words
```

### 3.7 commit
- [ ] auto-commit 將觸發提交

---

## Phase 4：圖片管理 ✅ 已完成（2026-05-07）

- [x] 4.1 `public/images/` 目錄結構整理完成：`profile/`、`logos/`、`posts/{slug}/`（Phase 1+2 已建立）
- [x] 4.2 Phase 2 已下載所有 45 張 Supabase 圖片
- [x] 4.3 .mdx 中圖片路徑統一為 `/sofia/images/...`（含 base prefix）
- [x] 4.4 大圖批次壓縮 (`scripts/compress-images.mjs`)：
  - 工具：sharp + mozjpeg quality=78、resize max width 1600
  - 壓縮 4 張 >400KB 的圖片，省下 979 KB
  - `2024-bologna/01.jpg`：551 → 318 KB (-42%)
  - `2024-florence/03.jpg`：720 → 366 KB (-49%)
  - `2024-florence/04.jpg`：809 → 421 KB (-48%)
  - `2022-life-in-oslo/09.jpg`：413 → 408 KB (-1.2%)
  - 最終 `public/images/posts/` 總大小：4.2 MB（從 5.2 MB 降下）
- [x] 4.5 沿用 `public/` + 一般 `<img>`，未啟用 Astro `<Image>`（首版維持簡單）
- [x] 4.6 `.gitattributes` 已建立，標記 `*.jpg`、`*.png`、`*.webp` 等為 binary

**實際容量**：45 張圖共 4.2 MB（壓縮後）；每篇文章資料夾平均 < 1 MB。

---

## Phase 5：部署 ✅ 已完成程式碼面（2026-05-07）

- [ ] 5.1 GitHub Repo Settings → Pages → Source 設為 "GitHub Actions"（**user 需手動操作一次**）
- [x] 5.2 已建立 `.github/workflows/deploy.yml`：
  ```yaml
  name: Deploy to GitHub Pages
  on:
    push:
      branches: [main]
    workflow_dispatch:
  permissions:
    contents: read
    pages: write
    id-token: write
  concurrency:
    group: pages
    cancel-in-progress: false
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: withastro/action@v3
    deploy:
      needs: build
      runs-on: ubuntu-latest
      environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}
      steps:
        - id: deployment
          uses: actions/deploy-pages@v4
  ```
- [x] 5.3 `astro.config.mjs` 的 `site: "https://sofiayan0523.github.io"` 與 `base: "/sofia"` 已驗證對齊
- [ ] 5.4 First push to main，觀察 Actions 跑完無錯（**push 後驗證**）
- [ ] 5.5 驗證：所有頁面、文章、圖片、搜尋都正常（**push 後驗證**）
- [ ] 5.6 （選配）Custom domain — 不適用（已決定不用）
- [ ] 5.7 commit & push: auto-commit 將觸發

### 實際 workflow 內容（採 setup-node + npm ci 取代 withastro/action 以更明確控制版本）

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: false }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm" }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: '${{ steps.deployment.outputs.page_url }}' }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 上線前最後一步（手動）

User 須執行以下一次性設定：
1. GitHub Repo `sofiayan0523/sofia` → Settings → Pages → Source 改為 **GitHub Actions**
2. 推送 main → 觀察 Actions 跑完
3. 訪問 `https://sofiayan0523.github.io/sofia/` 驗證

---

## Phase 6：加值功能（部分完成）

### Theme toggle ✅ 已完成
- [x] `src/components/ThemeToggle.tsx`：React Island，`client:load`，含 sun/moon SVG 圖示
- [x] `BaseLayout.astro` 加入 inline FOUC 防止腳本（在 paint 前套用 theme）
- [x] `Header.astro` 將 ThemeToggle 整合至右上角

### 6.1 giscus 留言系統 ✅ 已 scaffold（disabled by default）
- [x] `src/components/Comments.astro` 已建立，預設 `ENABLED = false`
- [x] 已在 `pages/blog/[...slug].astro` 文章底部掛載 `<Comments />`
- [ ] User 啟用步驟：
  1. Repo Settings → Features → 開啟 Discussions
  2. 至 https://giscus.app/ 產生 `data-repo-id` 和 `data-category-id`
  3. 編輯 `Comments.astro` 中 `GISCUS_CONFIG` 並將 `ENABLED = true`

### 其他選配功能（暫未實作）
- [ ] 6.2 **Plausible 或 Umami 分析**
  - 自架 Umami 或註冊 Plausible
  - 在 `BaseLayout` head 加 script
- [ ] 6.3 **OG image 自動產生**
  - 用 `@vercel/og` 或 `satori` 在 build 時為每篇文章生成專屬 OG 圖
- [ ] 6.4 **LanguageSwitcher React Island**
  - 首版固定 zh-TW，已預留 i18n 基礎設施
  - 啟用後 `import.meta.env.BASE_URL` + localStorage 雙語切換
- [ ] 6.4 **Newsletter / 訂閱**
  - 之後可整合 Buttondown / ConvertKit（純前端 form embed）

---

## 移除清單（明確不再使用）

- Supabase（auth, postgres, storage, edge functions）
- `@supabase/supabase-js`、`@tanstack/react-query`、`react-hook-form`
- `react-router-dom`（Astro 用 file-based routing）
- `react-helmet-async`（Astro 內建 head 處理）
- `next-themes`（自寫 ThemeToggle）
- `recharts`（未使用）
- 大量未使用的 shadcn UI 元件：calendar, carousel, chart, sidebar, resizable, input-otp, menubar 等
- Pages：`Login.tsx`, `Admin.tsx`, `PostEditor.tsx`
- Hooks：`useImageUpload.ts`、`useBlogPosts.ts`（後者改為 `getCollection`）
- `src/integrations/supabase/`、`src/lib/authStorage.ts`、`src/contexts/AuthContext.tsx`、`auth.ts`

---

## 風險與注意事項

1. **Repo 必須改名為 `sofia`**
   已確認用 project page 子路徑 `/sofia`，repo 名稱必須等於子路徑。建議直接 rename 現有 repo（保留歷史與 issues），GitHub 會自動 redirect 舊 URL。改名後要更新本地 git remote。

2. **內部連結與資源路徑必須處理 base prefix**
   `base: "/sofia"` 設定後，所有 `<a href="/blog">` 在 build 時應變成 `/sofia/blog`。Astro 對相對路徑會自動加 prefix，但若有手寫絕對路徑（如 `<img src="/images/...">`）需改用 `import.meta.env.BASE_URL` 或在 `astro:assets` 元件中傳遞。

3. **MDX 中 capture-eye web component**
   需在 BaseLayout 用 `<script src="..." type="module" is:inline>` 載一次。版本鎖定到具體版號，避免 `@latest` 在 prod 出意外。

4. **圖片放 repo 的尺寸**
   若文章量未來成長到 200+ 篇、或開始放高解析度圖，repo 體積可能變大。觀察到 100MB 以上時，再評估遷往 Cloudflare R2 或 GitHub LFS。

5. **i18n 路由策略**
   首版簡化為 localStorage 切翻譯字串，URL 不分語言。優點是工作量小、文章不需雙語版。後續若要做 SEO 友善的雙語站再升級為 `/zh/` 與 `/en/` 子路徑。

6. **Pagefind 索引範圍**
   預設只索引主內容區，要在 `PostLayout.astro` 主要文章區包 `<div data-pagefind-body>...</div>`。

7. **舊網址相容性**
   原本 `/blog/{uuid}` 結構會改成 `/blog/{slug}`。若已對外宣傳過舊連結，需在 `pages/blog/{old-id}.astro` 加 redirect 或在 404 頁提供搜尋。

---

## 里程碑與時間估算

| 里程碑 | 內容 | 累計時間 |
|--------|------|----------|
| **M1** | 骨架完成、能 build（Phase 1） | 0.5 天 |
| **M2** | 所有舊文章可在新站閱讀（Phase 1+2） | 1.5 天 |
| **M3** | 首頁 / About / Career / Blog 完整（+ Phase 3） | 3.5 天 |
| **M4** | 上線到 GitHub Pages（+ Phase 4+5） | 4 天 |
| **M5** | 加值功能完成（+ Phase 6） | 5 天 |

---

## 開工前檢查清單（已確認）

- [x] GitHub Repo Pages 已啟用
- [x] 不使用 custom domain
- [x] 將建立 `legacy-react` 分支備份現版（由 user 處理）
- [x] Supabase 圖片清單已列出（見下方）
- [x] i18n 策略：localStorage 切字串，URL 不分語言
- [x] GitHub Pages 路徑：`<user>.github.io/sofia`（project page，子路徑為 `/sofia`）

---

## 重要架構影響：使用 `<user>.github.io/sofia` 的 repo 命名

GitHub Pages 規則：project page 的 URL 為 `https://<user>.github.io/<repo>/`，子路徑會等於 repo 名稱。要把網址做到 `https://sofiayan0523.github.io/sofia/`，repo 名稱**必須為 `sofia`**：

1. **將現有 repo 改名為 `sofia`** ⭐ 推薦
   - 保留 git 歷史與 issues
   - GitHub 自動為舊 repo URL 建立 redirect（包括 git remote、issue 連結）
   - 操作：Repo Settings → Repository name → 改為 `sofia`
   - 改名後務必同步更新本地 `git remote set-url origin git@github.com:sofiayan0523/sofia.git`
2. **新建 `sofia` repo，搬遷 Astro 程式碼過去**
   - `sofia-s-blog` 保留為 legacy / archive
   - 適合想完全分開新舊的情境

> 若 `sofia` 已被佔用做其他用途，則需考慮其他名稱（例如 `blog`、`site`），網址會跟著變成對應子路徑。

**Astro 設定影響**（project page 路徑下）：
- `site: "https://sofiayan0523.github.io"`
- `base: "/sofia"`
- 所有內部連結用 Astro 的 `<a href={...}>` 或 `import.meta.env.BASE_URL` 處理（Astro 會自動加上 base 前綴給相對連結）
- `public/` 中靜態資源引用需用 `${import.meta.env.BASE_URL}images/...` 或讓 Astro 元件自動處理

---

## Supabase 圖片清單與遷移對應表

### 統計
- 總計 **45 張圖片** 要遷移至 repo
- 已生成完整 manifest：`sofia-s-blog/scripts/supabase-images.json`
- Storage bucket 中還有 2 張未被任何已發布文章引用的孤兒圖（無需遷移）
- 原 `og-image.jpg` 不存在於 Storage（需重新製作或在新版用 build-time 動態 OG）

### 文章與圖片對應

| 文章標題 | Slug（建議） | 發布日期 | 封面 | Capture 圖片 |
|---------|-------------|---------|------|--------------|
| 2022, Life in Oslo. | `2022-life-in-oslo` | 2022-06-01 | 1 | 20 |
| 2024, 羅馬見聞. | `2024-rome` | 2024-03-26 | 1 | 4 |
| 2024, 佛羅倫斯散策. | `2024-florence` | 2024-03-31 | 1 | 6 |
| 2024, 快閃波隆納. | `2024-bologna` | 2024-04-01 | 1 | 2 |
| 2024, 威尼斯印象. | `2024-venice` | 2024-04-06 | 1 | 8 |
| **總計** | | | **5** | **40** |

> 注意：所有 40 張內文圖片都是 `!capture[]()()` 語法（含 NID），不是純 `![]()`。遷移時需保留 NID 資訊以便 MDX 中渲染 `<CaptureEye>` 元件。

### 圖片目標路徑規則

每個 post 的圖片放在 `public/images/posts/{slug}/`：
- 封面 → `cover.jpg`
- 內文圖片依出現順序 → `01.jpg`、`02.jpg` … 補零至兩位

範例（取自 manifest）：
```json
{
  "slug": "2022-life-in-oslo",
  "cover": {
    "sourceUrl": "https://hbzabvlkkksdzofjpnnq.supabase.co/.../1767435420205.jpg",
    "targetPath": "public/images/posts/2022-life-in-oslo/cover.jpg"
  },
  "captures": [
    {
      "sourceUrl": "https://hbzabvlkkksdzofjpnnq.supabase.co/.../1767435524551-...n.jpg",
      "nid": "bafkreicf3wlu7x7whs7o7hxsm4ggtxryquzlttvsi4tv5enyrmsjyj3eda",
      "targetPath": "public/images/posts/2022-life-in-oslo/01.jpg"
    }
  ]
}
```

### Phase 2.3 download script 任務（細化）

腳本需依 manifest 執行：
1. 讀取 `scripts/supabase-images.json`
2. 對每筆 image record 執行 `fetch(sourceUrl)` 並寫入 `targetPath`
3. 並行限制（如 5 個同時）避免被 Supabase 限流
4. 失敗時 retry 3 次
5. 完成後印出統計（成功 / 失敗）

### Phase 2.2 migrate-fallback-posts 任務（細化）

對每篇 post：
1. 取出 frontmatter（title、excerpt、category、tags、publishedAt、coverImage、readTime）
2. content 中：
   - `!capture[alt](url)(nid)` → `<CaptureEye nid="${nid}" src="/images/posts/${slug}/${seq}.jpg" alt="${alt}" />`
   - cover_image URL → frontmatter 中 `coverImage: /images/posts/${slug}/cover.jpg`
3. 由於含 `<CaptureEye>` JSX，所有檔案副檔名為 `.mdx`
4. 輸出至 `src/content/posts/{slug}.mdx`

---

_Last updated: 2026-05-07_
