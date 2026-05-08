# 寫文章的工作流（GDoc → Numbers → Blog）

> Sofia 寫文章 → 我（Omni）負責剩下所有事

## 你需要做的事

### 1. 在 Google Docs 寫文章

在 GDoc 最上方放一個 frontmatter 區塊，用 `---` 包住：

```
---
title: 2026 京都遊記
excerpt: 春天的京都散策，櫻花與咖啡
category: travel
tags: japan, kyoto, travel
---

正文從這裡開始。

第二段...

[image: cherry-blossom.jpg]   ← 這裡會插入圖片

第三段...

[image: kamogawa-coffee.jpg]
```

**Frontmatter 欄位**：

| 欄位 | 必填 | 說明 |
|------|------|------|
| `title` | ✓ | 文章標題 |
| `excerpt` | 建議 | 摘要（1-2 句） |
| `category` | ✓ | `travel` / `ai-tools` / `thoughts` |
| `tags` | 選填 | 逗號分隔 |
| `slug` | 選填 | URL 路徑，不填我會自動產生 |
| `publishedAt` | 選填 | 發布日期（不填用今天） |

**圖片參考**：用 `[image: filename.jpg]` 標示位置，filename 對應 Drive 上的檔名。

### 2. 把圖片放到 Google Drive 資料夾

建議每篇文章一個資料夾：
```
Drive/
└── blog-posts/
    └── 2026-kyoto/
        ├── cover.jpg            ← 自動視為封面
        ├── cherry-blossom.jpg
        └── kamogawa-coffee.jpg
```

支援的格式：`.jpg`、`.jpeg`、`.png`、`.webp`、`.heic`、`.gif`

### 3. 跟我說一聲

```
"幫我發新文章
GDoc: <Google Docs 連結>
Drive: <Google Drive 資料夾連結>"
```

或更簡單：
```
"發這篇 [貼 GDoc 連結]，圖在 [貼 Drive 連結]"
```

## 我會做的事

1. **讀 GDoc**：用 Google Workspace API 抓內容 + 解析 frontmatter
2. **下載圖片**：用 Drive API 抓所有圖到本機暫存
3. **註冊 Numbers**：每張圖 POST 到 `api.numbersprotocol.io/api/v3/assets/` 拿 NID
4. **存進 repo**：圖放 `public/images/posts/{slug}/`，依出現順序命名 `cover.jpg`、`01.jpg`、`02.jpg`...
5. **生成 MDX**：寫到 `src/content/posts/{slug}.mdx`，每張圖換成 `<CaptureEye nid="..." src="..." />`
6. **commit + push**：自動建 PR
7. **跟你回報**：給你 PR 連結與預覽

## 你只需要在最後做的事

1. 看一下 PR 內容（可選）
2. 回我「merge it」→ 我合併並等 deploy → 1-2 分鐘上線

---

## 一次性設定（給 Sofia）

### 把 Numbers API token 放本機 .env

到 https://nit.numbersprotocol.io/ 取 API key，然後：

```bash
cd sofia-s-blog
echo "CAPTURE_TOKEN=你的_token" >> .env
```

`.env` 已在 `.gitignore`，不會被 commit。

驗證：
```bash
node scripts/register-with-numbers.mjs public/images/profile/sofia.png
```

成功會印出：
```json
{
  "nid": "bafkreig...",
  "fileName": "sofia.png",
  ...
}
```

## 進階用法（若需要）

### 直接指定 slug

GDoc frontmatter 加 `slug: my-custom-url`，網址就會是 `/sofia/blog/my-custom-url/`。

### 重新註冊已有的圖

把圖放到 `public/images/posts/...` 後直接跑：
```bash
node scripts/register-with-numbers.mjs public/images/posts/2026-kyoto/01.jpg
```

複製印出來的 NID 貼回 MDX。

### 草稿模式

在 GDoc frontmatter 加 `draft: true`，build 時會跳過此文章（不會出現在站上）。
