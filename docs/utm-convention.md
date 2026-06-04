# UTM Convention — Sofia AI Blog

> **目的**：所有從 Sofia 個人品牌觸點 → Numbers / Omni / Speaker 的流量都用一致的 UTM，KPI dashboard 才能正確分流。
>
> **owner**: Omni (Executor agent)
> **last updated**: 2026-05-12 / Iteration 2

## 三個強制必帶參數

```
utm_source   = sofia-blog        // 永遠是這個值（識別個人品牌觸點）
utm_medium   = {channel}         // 看下方 channel matrix
utm_campaign = {phase|topic}     // phase1 / phase2 / phase3 / 或 topic slug
utm_content  = {post-slug}       // 個別文章/貼文 slug
```

## Channel matrix（utm_medium 對照）

| Sofia 個人品牌渠道 | `utm_medium` | 用在 |
|---|---|---|
| Blog 內部連結 | `blog-internal` | Pillar → cluster 互連、from Sofia blog 到 Numbers/Omni |
| LinkedIn long-form post | `linkedin-lf` | 旗艦文衍生 |
| LinkedIn 時事評論 | `linkedin-commentary` | trend-driven short post |
| X / Twitter | `x` | 5-7 篇/週 |
| Facebook 個人頁 | `fb-personal` | Sofia 自寫雜記 |
| Speaker page | `speaker-page` | inbound CTA 連到 Calendly / form |
| Email signature | `email-sig` | Sofia 寄信時帶 |
| YouTube 科科 AI Shorts | `yt-keke` | 影片 description 內連結 |
| Cold email outbound | `cold-email` | 主動 outreach |
| Podcast 嘉賓 episode | `podcast-{show}` | 上節目時 show notes |
| Medium 文章 | `medium` | crosspost |

## Campaign 對照

| `utm_campaign` 值 | 用在 | 期間 |
|---|---|---|
| `phase1` | P1 Foundation (W1-W2) | 2026-05-12 ~ 2026-05-25 |
| `phase2` | P2 Semi-Auto (W3-W4) | 2026-05-26 ~ 2026-06-08 |
| `phase3` | P3 Full Auto (W5-W6) | 2026-06-09 ~ 2026-06-22 |
| `pillar-humanities-ai-expert` | Pillar 旗艦文宣傳 | 跨 phase |
| `speaker-q2-2026` | 演講邀約推廣 | Q2 2026 |
| `numbers-omni-demo` | 引導 Numbers/Omni demo | 跨 phase |
| `capture-app` | 引導 Capture App 下載 | 跨 phase |

## 範例 URL

### 1. LinkedIn 旗艦文連到 Pillar blog
```
https://sofiayan.cc/blog/humanities-ai-expert/?utm_source=sofia-blog&utm_medium=linkedin-lf&utm_campaign=pillar-humanities-ai-expert&utm_content=2026-05-12-pillar
```

### 2. X tweet 連到 Speaker page
```
https://sofiayan.cc/speaker?utm_source=sofia-blog&utm_medium=x&utm_campaign=speaker-q2-2026&utm_content=2026-05-13-tweet-001
```

### 3. Speaker page 引導到 Numbers / Omni demo
```
https://www.numbersprotocol.io/products/omni?utm_source=sofia-blog&utm_medium=speaker-page&utm_campaign=numbers-omni-demo&utm_content=speaker-cta-bottom
```

### 4. Blog Cluster B1 連到 Omni waitlist
```
https://www.numbersprotocol.io/omni-waitlist?utm_source=sofia-blog&utm_medium=blog-internal&utm_campaign=numbers-omni-demo&utm_content=cluster-b1-ai-coworkers
```

## 規則（不可違反）

1. **大小寫**：全部小寫，hyphen 分隔，不用 underscore。
2. **utm_source 永遠是 `sofia-blog`**，方便 GA4 segment「來自 Sofia 個人品牌」的所有流量
3. **utm_content 永遠是文章/貼文 slug 或日期-序號**，方便分辨同一 medium 的不同貼文
4. **每篇 long-form blog 推出時**，我必須產生對應的 social tracking URL，存進 Content Queue Sheet 的 `posted_url` 欄位旁的 `tracking_url` 欄
5. **Numbers / Omni 站外連結**永遠帶 UTM；站內連結也帶 UTM（用 `blog-internal`）方便看 funnel

## Phase 1 必須建好的 GA4 / Sheet 對照

| 來源組合 | 統計欄位 | 自動化動作 |
|---|---|---|
| `source=sofia-blog × medium=linkedin-*` | LinkedIn driven traffic | P2 LinkedIn API impressions 對齊 |
| `source=sofia-blog × medium=x` | X driven traffic | P2 X API impressions 對齊 |
| `source=sofia-blog × medium=speaker-page` | Speaker page → 後續行為 | Speaker funnel |
| `source=sofia-blog × destination=numbers/omni` | Sofia → product flow | **北極星 demo lead 指標** |

## 站內 CTA event names

| Event name | 觸發位置 | 用途 |
|---|---|---|
| `speaker_enquiry_email_click` | `/speaker` hero、fit guide、contact section 的 email CTA | 區分演講邀約意圖，不與一般 email link 混在一起 |
| `speaker_enquiry_linkedin_click` | `/speaker` contact section 的 LinkedIn DM CTA | 區分 warm intro / LinkedIn 私訊邀約 |
| `numbers_omni_outbound_click` | Speaker / AI methodology / Blog 連到 Numbers 或 Omni 的 CTA | 衡量 Sofia 個人品牌導向 Numbers / Omni 的 product flow |
| `article_share_click` | Blog post share buttons | 衡量文章擴散，不作為 speaker conversion |

站內 CTA 應在連結上加 `data-analytics-event` 與 `data-cta-location`，讓 GA4 / Cloudflare Zaraz / 之後的輕量 tracking script 可以接同一套命名。

## 程式化生成（Iteration 3+ 加入）

Helper script `scripts/utm-builder.mjs`（待建）將自動：
- 從 Content Queue Sheet 讀 platform + scheduled_date
- 產出對應 utm_medium 與 utm_content
- 寫回 Sheet `tracking_url` 欄
- 確保每個 outbound link 都帶 UTM

---

*此規範隨計畫進展更新；任何 UTM 都必須先在這份文件登記後才能用。*
