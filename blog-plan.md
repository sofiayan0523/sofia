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

## Phase 1：基礎建設（預估 0.5 天）

- [ ] 1.1 備份現有 React 版：建立 `legacy-react` 分支或 git tag `v1-react`
- [ ] 1.2 在新分支清空舊 React 程式碼，保留 `.git`、`.gitignore`、`README.md`、要重用的 `public/` 圖片
- [ ] 1.3 執行 `npm create astro@latest .` 選 Empty 或 Blog 模板
- [ ] 1.4 安裝必要 integrations：
  - `@astrojs/mdx`
  - `@astrojs/tailwind`
  - `@astrojs/sitemap`
  - `@astrojs/rss`
  - `@astrojs/react`（讓 React Island 能跑）
- [ ] 1.5 設定 `astro.config.mjs`：
  - `site: "https://sofiayan0523.github.io"`
  - `base: "/sofia"`（project page，repo 名稱必須為 `sofia`）
  - `output: "static"`
  - 啟用 mdx、tailwind、sitemap、react integrations
- [ ] 1.6 設定 `tsconfig.json` 為 strict 模式
- [ ] 1.7 確認 `npm run dev` 與 `npm run build` 都能跑通
- [ ] 1.8 commit: `feat: scaffold Astro project`

---

## Phase 2：內容遷移（預估 1 天）

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
- [ ] 2.2 寫 `scripts/migrate-fallback-posts.ts`：
  - 讀取舊 `src/data/fallbackBlogPosts.ts` 所有文章
  - 產生 `.md` 或 `.mdx` 檔，檔名規則 `{yyyy-MM-dd}-{slug}.md`
  - 將 `!capture[alt](url)(nid)` 轉為 MDX 元件 `<CaptureEye nid="..." src="..." alt="..." />`（含 capture-eye 的檔案需用 `.mdx`）
  - 將 `![alt](url)` 保留 markdown 寫法
- [ ] 2.3 撰寫 / 執行 image download script：
  - 列出所有 .md 中引用的 `https://hbzabvlkkksdzofjpnnq.supabase.co/...` URL
  - 下載到 `public/images/posts/{slug}/{filename}`
  - 改寫 .md / .mdx 中圖片路徑為 `/images/posts/{slug}/{filename}`
- [ ] 2.4 建立 `src/components/CaptureEye.astro` 封裝 capture-eye web component
- [ ] 2.5 在 `BaseLayout.astro` 加入 capture-eye script（鎖定版本，不用 `@latest`）
- [ ] 2.6 `npm run build` 通過、隨機抽查 5 篇文章渲染正常
- [ ] 2.7 commit: `feat: migrate posts to content collections`

---

## Phase 3：頁面與設計重建（預估 1.5–2 天）

### 3.1 設計系統移植
- [ ] 將原 `tailwind.config.ts` 的 color tokens、font-display、animations 複製到新 `tailwind.config.mjs`
- [ ] 將 `src/index.css` 的 CSS variables、prose 樣式移到 `src/styles/global.css`
- [ ] 在 `BaseLayout.astro` import global.css

### 3.2 共用元件
- [ ] `Header.astro`（純靜態 `<a>` 連結，不用 react-router）
- [ ] `Footer.astro`（移除 `/playground` 連結；年份改用 build-time 動態 `new Date().getFullYear()`）
- [ ] `BlogCard.astro`
- [ ] `SEO.astro`（meta tags 直接寫在 head，無需 react-helmet）
- [ ] `ThemeToggle.tsx`（React Island，`client:load`，沿用 localStorage 邏輯）
- [ ] `LanguageSwitcher.tsx`（React Island，`client:load`）

### 3.3 i18n
- [ ] 將舊 `LanguageContext` 翻譯表拆成 `src/i18n/zh.ts` 與 `src/i18n/en.ts`
- [ ] 寫 helper `getTranslations(lang)` 讓 .astro 與 React Island 都能取用
- [ ] 補齊原本硬編碼的字串（Index stats、Blog 標題、404 頁、Footer 描述等）
- [ ] 第一版策略：URL 不分語言，僅切翻譯 + localStorage（之後可升級為 `/en/` 子路徑）

### 3.4 頁面
- [ ] `pages/index.astro`（Home）
  - Hero + capture-eye 頭像
  - Stats 區塊
  - 最新 6 篇文章
- [ ] `pages/about.astro`
  - About 內容 + Playground 連結卡片
  - 不再需要 `dangerouslySetInnerHTML`
- [ ] `pages/blog/index.astro`
  - 分類 filter（純前端切換或多頁路由）
  - 文章列表
- [ ] `pages/blog/[...slug].astro`
  - `getStaticPaths` + `getCollection("posts")`
  - 套 `PostLayout.astro`
  - 透過 MDX 直接使用 `<CaptureEye />` 元件
- [ ] `pages/career.astro`（內容陣列從原 React 檔搬過來、純靜態渲染）
- [ ] `pages/404.astro`

### 3.5 搜尋功能
- [ ] 安裝 Pagefind：`npm i -D pagefind`
- [ ] 在 build 後 hook 執行 `pagefind --site dist`
- [ ] 在 `Blog` 頁加入 Pagefind 搜尋 UI（取代原 SearchBar 對 Supabase 即時 query 的做法）

### 3.6 RSS Feed
- [ ] `pages/rss.xml.ts` 用 `@astrojs/rss` 產生
- [ ] 在 `BaseLayout` head 加入 `<link rel="alternate" type="application/rss+xml">`

- [ ] 3.7 commit: `feat: rebuild pages with astro components`

---

## Phase 4：圖片管理（簡化版，全部放 repo）

- [ ] 4.1 整理 `public/images/` 目錄結構：
  - `og-image.jpg`
  - `profile/`（個人照）
  - `logos/`（career 頁 logos）
  - `posts/{slug}/`（每篇文章圖片）
- [ ] 4.2 執行 Phase 2.3 的 download script，把 Supabase 上的圖片全部撈下來
- [ ] 4.3 .md / .mdx 中圖片路徑改為相對 root 的 `/images/...`
- [ ] 4.4 大圖（> 500KB）批次壓縮：
  - 用 `squoosh-cli` 或 `sharp` 壓縮為 WebP / 適當 JPEG 品質
  - 目標：每張 < 300KB
- [ ] 4.5 （選配）評估是否將部分圖片放 `src/assets/` 改用 Astro `<Image>` 元件做自動 srcset/WebP；首版可先省略
- [ ] 4.6 設定 `.gitattributes`：`*.jpg binary`、`*.png binary`、`*.webp binary`

**容量估算**：50 篇文章 × 平均 5 張圖 × 200KB ≈ 50MB，repo 可接受。

---

## Phase 5：部署（預估 1 小時）

- [ ] 5.1 GitHub Repo Settings → Pages → Source 設為 "GitHub Actions"
- [ ] 5.2 建立 `.github/workflows/deploy.yml`：
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
- [ ] 5.3 確認 `astro.config.mjs` 的 `site: "https://sofiayan0523.github.io"` 與 `base: "/sofia"` 與 repo 名稱一致
- [ ] 5.4 First push to main，觀察 Actions 跑完無錯
- [ ] 5.5 驗證：所有頁面、文章、圖片、搜尋都正常
- [ ] 5.6 （選配）Custom domain：
  - 在 `public/CNAME` 寫入域名
  - DNS 設 CNAME 指向 `<user>.github.io`
  - Repo Settings → Pages → Custom domain 填入並啟用 HTTPS
- [ ] 5.7 commit & push: `chore: configure github pages deployment`

---

## Phase 6：加值功能（選配）

- [ ] 6.1 **giscus 留言系統**
  - Repo 開啟 Discussions
  - 至 https://giscus.app/ 取得設定
  - 新增 `Comments.astro`，於 `PostLayout.astro` 末尾載入
- [ ] 6.2 **Plausible 或 Umami 分析**
  - 自架 Umami 或註冊 Plausible
  - 在 `BaseLayout` head 加 script
  - 對 GDPR 友善、無 cookie
- [ ] 6.3 **OG image 自動產生**
  - 用 `@vercel/og` 或 `satori` 在 build 時為每篇文章生成專屬 OG 圖
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
