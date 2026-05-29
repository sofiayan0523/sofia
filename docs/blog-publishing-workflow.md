# Blog Publishing Workflow — sofia-s-blog

> v0  ·  2026-05-29  ·  Sofia + Omni 共用 SOP
>
> 適用範圍：所有 sofia-s-blog 文章從題目構想到上線後追蹤的全流程。
>
> 對齊基準：
> - `.omni/harness/plans.md` v2 §1.2 Approval Gate / §1.3 Artifacts / §2 Pipeline / §4 Promotion
> - `.omni/harness/goal.md` 5 項 scoring criteria
>
> 維護規則：每 3 篇文章上線後檢視一次，更新「Failure Modes」與「Commands」章節。

---

## 1. Purpose & Audience

這份文件回答一個問題：

> 「對於 sofia-s-blog 上的任何一篇文章，從題目浮現到上線後追蹤，誰負責什麼、什麼時候做、卡住怎麼辦？」

兩個讀者：

- **Sofia（人類）**：需要知道自己什麼時候必須介入、用什麼明確訊號 approve / merge、可以放心交給 AI 哪些事。
- **Omni（AI Executor）**：需要知道每個 step 的 trigger / input / output / owner / fallback，且每次寫稿前先讀 `voice-brief.md`。

兩者都需要：可以指著文件說「依 §X.Y，這步應該由你做」。

---

## 2. Quick Reference（一頁式 cheatsheet）

```
TOPIC INTAKE  ─┐
   D-7 ~ D-5  │ Sofia 給題目方向（1 句話）
              │ Omni 提 3 個切角（GDoc）
              │ Sofia 挑切角（或 ask for re-propose）
              │
DRAFTING ─────┤
   D-5 ~ D-2  │ Omni 寫完整草稿 → GDoc（frontmatter + 內文）
              │ Sofia 在 GDoc comment / 直接改
              │ Omni 迭代直到 voice align
              │
APPROVAL ─────┤
   D-1 ~ D0   │ Sofia 明確說 "approve 上線" / "publish" / "可以發"
              │   或 GDoc 標題 / 首段加 [APPROVED]（必須對話確認）
              │
PUBLISH ──────┤
   D0         │ Omni 跑 publish pipeline：
              │   GDoc → MDX
              │   Drive 圖 → optimize → Numbers NID → CaptureEye
              │   Cover OG image → coverNid
              │   llms.txt / agent.json 更新
              │   npm run build + git diff --check pass
              │   開 PR（含 publish manifest + 5 social drafts）
              │
              │ Sofia 說 "merge it" → 上線
              │
PROMOTION ────┤
   D0 ~ D+7   │ D0 LinkedIn main / D1 X / D3 Threads-FB
              │ D5 LinkedIn follow-up / D7 Z App 成效回顧
              │ 所有連結帶 utm_source=sofia-blog + 對應 medium
              │
REVIEW ───────┘
   D+7        │ Omni 把當週 voice 修改處歸納（≥2 次出現 → 入 voice-brief）
              │ Z App weekly report cite real-or-pending data
```

---

## 3. Phase A — Topic Intake（D-7 ~ D-5）

### 3.1 Trigger

由 Sofia 在對話框給出題目方向。**只要一句話**就夠了。

範例：
- `想寫 AI agent 不是助理而是同事這件事`
- `想寫最近從 Helsinki 回來的觀察`
- `MIT 那個 95% AI pilot 失敗的數字 + 我們企業內訓現場`

### 3.2 Required Input

| 欄位 | 必填 | 範例 |
|---|---|---|
| `topic` | ✓ | 一句話題目 |
| `audience` | 選填 | `ai-workers` / `humanities-readers` / `travel-life` / `mixed` |
| `publish_window` | 選填 | `2026-06-14` 或「W2」 |
| `source_notes` | 選填 | GDoc URL / bullet 筆記 / transcript |
| `drive_folder` | 選填 | Google Drive 圖片資料夾 URL |
| `primary_promotion_angle` | 選填 | 主推渠道與切角 |

### 3.3 Omni Output

建立一份 Google Doc，標題 `[Draft] {臨時 slug} — 切角提案`，內含 **3 個切角**，每個包含：

- 一句話觀點
- 故事切口
- 主要讀者
- 建議主推渠道
- 可能標題

並把 GDoc URL 貼回對話。

### 3.4 Sofia Response

| Sofia 回應 | Omni 下一步 |
|---|---|
| 「用第 2 個」/ 「第 1 個 + 改成 X」 | 進入 Phase B Drafting |
| 「重提」/ 「再給我 3 個從 Y 切」 | 重新生成 3 個切角 |
| 不回 | Omni 等，不主動跳到 drafting |

### 3.5 Anti-pattern

- ✗ Omni 自己決定切角直接開寫
- ✗ 提案內容是教學文 / step-by-step（違反 `voice-brief.md` §4.4）
- ✗ 引用任何 §4 banned phrases

---

## 4. Phase B — Drafting（D-5 ~ D-2）

### 4.1 Prerequisite

**寫第一個字前**，Omni 的 system prompt 必須包含：

- `sofia/docs/voice-brief.md`（至少 §2 + §4 + §7）
- `.omni/memory.md` 的 Sofia 寫作風格 convention

依 `voice-brief.md` §9 Hand-off — 沒有這兩份就不可生成草稿。

### 4.2 GDoc Template

在同一份 Phase A 的 GDoc 內，把切角展開成完整文章。Frontmatter 區塊用 `--- yaml ---` 包起來方便 publish pipeline parse：

```yaml
---
title:        "{標題}"
slug:         "{kebab-case-slug}"
publishedAt:  "{YYYY-MM-DDTHH:MM:SS+08:00}"
category:     "{ai-insights | travel | …}"
excerpt:      "{1-2 句摘要}"
coverImage:   "/images/posts/{slug}/cover.jpg"
coverAlt:     "{封面 alt}"
coverNid:     ""  # publish pipeline 自動填
draft:        true
---
```

### 4.3 Draft Constraints

依 plans.md §2.2：

- 從事件、對話、旅程、工作現場或某個細節切入（voice-brief §2.1）
- 不用數字標題模板、不寫教學文 step-by-step、不用 PR/AI 套話（voice-brief §4）
- 中段有反轉式 pivot（voice-brief §2.3）
- 結尾留問題或下一段旅程（voice-brief §2.6）

### 4.4 Review Loop

Sofia 在 GDoc 留 comment 或直接 inline edit → **視為 review 中**，Omni：

1. 讀回 GDoc（`mcp__gws__docs_get_as_text`）
2. 把修改 diff 出來
3. 每處改寫嘗試歸納 `voice delta`：
   - `changed_text_pattern`
   - `inferred_preference`
   - `rule_candidate`
   - `confidence`（high / medium / low）
   - `example_before_after`
4. 重生草稿（保留 Sofia 接受的句子，調整未通過的）

### 4.5 Anti-pattern

- ✗ Sofia 只丟了一個 comment，Omni 就把整篇推倒重寫
- ✗ Omni 自行決定「Sofia 應該會喜歡這個版本」直接 publish
- ✗ 用 voice delta 立刻汙染 `voice-brief.md`（≥ 2 次或 Sofia 明說才入檔，見 §6.4）

---

## 5. Phase C — Approval Gate（D-1 ~ D0）

### 5.1 Approval Signal（plans.md §1.2，逐字採用）

**只有任一條件成立才可 publish：**

- Sofia 在對話明確說：`approve 上線`、`publish`、`可以發`
- Sofia 在 GDoc 標題或首段加 `[APPROVED]`，**且對話確認使用該版本**

### 5.2 NOT Approval

下列行為**都視為 review 中**，**不得**進入 publish pipeline：

- GDoc comment（即使內容是「很棒」「我喜歡」）
- 段落修改（即使全部修完）
- 口頭討論、Slack / Z App 隨口提到
- Sofia 說「應該可以了」「差不多」「我看起來 ok」（語意過於模糊）

### 5.3 Omni Confirmation

收到疑似 approval 訊號時，Omni 在進入 publish pipeline 前**先回覆**：

> 「收到。將以 GDoc 最新版（last modified {timestamp}）跑 publish pipeline，預計建立 PR `omni/9c5c6bf5/{slug}`。如需先停一下請打斷我。」

Sofia 不打斷 → 進入 Phase D。
Sofia 說「等」「先別」「我再改一下」→ 回 Phase B。

### 5.4 Anti-pattern

- ✗ Omni 推測 approval（「她應該是同意了」）
- ✗ 看 GDoc 沒有新編輯就視為 approve
- ✗ 沒有 confirmation 直接開 PR

---

## 6. Phase D — Publish + Promotion（D0 ~ D+7）

### 6.1 Publish Pipeline（plans.md §2.4 — Hard Gates 必過）

| Step | Trigger | Tool / File | Output | Fallback |
|---|---|---|---|---|
| Read final GDoc | approval | `mcp__gws__docs_get_as_text` | structured text | parse fail → 給 Sofia 看 section map |
| Parse frontmatter | doc loaded | YAML parser | normalized metadata | missing required field → stop, ticket |
| Download images | drive URL present | `mcp__gws__drive_download_to_workspace` → `sofia/public/images/posts/{slug}/` | local files | filename conflict → slug + index |
| Optimize images | files downloaded | `scripts/compress-images.mjs` | optimized assets | keep original + 標記 |
| Register images | optimized files | `scripts/register-with-numbers.mjs --quiet` | NID / proofHash / mime | backoff + resume manifest；fail blocks publish |
| Generate cover OG | title / slug 已知 | `scripts/generate-og-image.py` | `public/images/posts/{slug}/cover.{png,jpg}` | screenshot / 手動 |
| Register cover | cover exists | Numbers script | `coverNid` | fail blocks publish |
| Write MDX | all assets ready | `src/content/posts/{slug}.mdx` | final article | build before PR |
| Update AEO | MDX ready | `public/llms.txt`、`public/agent.json` | article entry | `scripts/validate-aeo-files.mjs` after build |
| Verify | changes ready | `npm run build`、`git diff --check` | pass/fail | fail → 修，不開 PR |
| PR | verify pass | `gh pr create` | PR with manifest + 5 social drafts | merge 等 Sofia |

### 6.2 Hard Gates（任一不過則不開 PR）

- 封面有 `coverNid`
- 每張內文圖都用 `<CaptureEye nid="..." src="..." alt="..." />`
- `npm run build` 成功
- `git diff --check` 沒有 whitespace 錯誤
- PR body 含 publish manifest + 5 個社群草稿 + canonical URL

### 6.3 PR Body 範本

```markdown
## Article: {title}

- canonical: https://sofiayan.cc/blog/{slug}/
- voice-brief version cited: v0
- approval signal: "{verbatim Sofia approval}" at {timestamp}

### Publish manifest

| Asset | Path | NID |
|---|---|---|
| cover | public/images/posts/{slug}/cover.jpg | bafkrei... |
| body-01 | public/images/posts/{slug}/01.jpg | bafkrei... |
| … | | |

### Social drafts（plans.md §4.2，5 個渠道）

#### LinkedIn long（600-1200 字，反思型）
{draft}
canonical: https://sofiayan.cc/blog/{slug}/?utm_source=sofia-blog&utm_medium=linkedin-lf&utm_campaign={campaign}&utm_content={yyyy-mm-dd}-{slug}-d0-main

#### X（≤280 chars，可選 3-post thread）
{draft}
canonical: …&utm_medium=x&...&utm_content=…-d1-x

#### Threads / Facebook（故事型）
{draft}
…&utm_medium=fb-personal&...&utm_content=…-d3-story

#### LINE private share（≤100 zh-TW chars）
{draft}
（utm_medium=line 待 utm-convention 更新後使用；目前留純連結）

#### English summary（重寫，不直譯）
{draft}
…&utm_medium=linkedin-lf&...&utm_content=…-d0-en
```

### 6.4 Merge Signal

Sofia 說 `merge it` / `合併` / `上線吧` → Omni 跑 `gh pr merge {n} --merge --repo sofiayan0523/sofia`。

不主動 merge。任何其他訊號（即使是「看起來不錯」）一律視為 review 中。

### 6.5 Promotion Rhythm（plans.md §4.1）

| Day | Channel | Deliverable | Asia/Taipei time | Fallback | Owner |
|---|---|---|---|---|---|
| D0 | Blog + LinkedIn main | 主貼文 + canonical URL + UTM | Tue/Wed/Thu 08:30-10:00 | same day 12:00 | Sofia posts, Omni drafts |
| D1 | X | 核心觀點 / 3-post thread | 12:00-13:30 or 21:00-22:30 | 隔日早 | Sofia posts, Omni drafts |
| D3 | Threads / FB | 故事型摘錄 | 21:00-23:00 | weekend evening | Sofia posts, Omni drafts |
| D5 | LinkedIn follow-up | 「我寫這篇的原因」 | 08:30-10:00 | 17:30-18:30 | Sofia posts, Omni drafts |
| D7 | Z App internal | 成效回顧 + 二次推廣建議 | Monday 09:00 排程 | next loop | Omni |

發布時間目前是 hypothesis，等 GA4 / LinkedIn analytics 上線後驗證調整。

### 6.6 UTM Rule

依 `sofia/docs/utm-convention.md`（authoritative，本檔不重複定義 channel matrix）：

```
utm_source   = sofia-blog            # 永遠固定
utm_medium   = {channel}             # 見 utm-convention.md
utm_campaign = {topic-slug | phase}
utm_content  = {YYYY-MM-DD}-{post-slug}-{d0-main|d1-x|d3-story|d5-why|d7-recap}
```

- 未註冊在 utm-convention 的 medium（如 `threads`、`line`、`z-app`）**不可使用**，要先更新 utm-convention.md。
- 任何 social draft 違反 `utm_source=sofia-blog` 一律退回 review。

### 6.7 Anti-pattern

- ✗ Omni 自行 merge PR
- ✗ Cover 沒 `coverNid` 就硬上 PR
- ✗ Social draft 用 mock metrics / 編造 PV 推薦推廣時段（違反 plans.md §1.1 Analyst boundary）
- ✗ 用沒在 utm-convention.md 註冊的 `utm_medium`

---

## 7. Required Artifacts Checklist（plans.md §1.3）

每篇文章 D0 上線時，下列 artifact 必須齊全：

- [ ] GDoc final（可 `docs_get_as_text` 讀取）
- [ ] `sofia/src/content/posts/{slug}.mdx`（frontmatter schema pass）
- [ ] `sofia/public/images/posts/{slug}/`（optimized, stable filenames）
- [ ] 每張 published 圖片都有 NID
- [ ] Cover `public/images/posts/{slug}/cover.{png,jpg}` + `coverNid`
- [ ] 5 social drafts（PR body 或 `docs/social/{slug}.md`）+ UTM
- [ ] `public/llms.txt` / `public/agent.json` 條目（若文章可被 AI 索引）
- [ ] D+7 weekly report 引用真實或 explicit pending 資料來源
- [ ] 該篇 voice delta 紀錄（high confidence 才入 `voice-brief.md`）

---

## 8. Failure Modes & Fallbacks

| 失敗點 | 偵測方式 | Fallback | 是否要開 ticket |
|---|---|---|---|
| GDoc parse 失敗 | `docs_get_as_text` 回錯 | 給 Sofia section map，請她貼純文字 | Yes — 卡 publish |
| Numbers token rate limit | `register-with-numbers.mjs` 429 | exponential backoff + `register-resume.json` manifest | No 若 backoff 成功；Yes 若 3 次仍失敗 |
| 封面 `coverNid` 寫入失敗 | `coverNid` 為空 | 重新跑封面 + register；3 次仍失敗 → block PR | Yes |
| `npm run build` 失敗 | exit ≠ 0 | 修錯後重 build；不可開 PR | 若是內容問題 → Sofia |
| GitHub Pages 部署失敗 | gh-pages workflow error | 看 actions log；rollback 上一個 PR | Yes |
| Supabase reactions table 不存在 | 前端 fallback 至 localStorage | 不擋 publish；週報註明「reactions 來自 localStorage」 | No |
| GA4 / Cloudflare 未串接 | weekly_traffic_report.py 印 `_pending_` | 報告誠實標 pending，不編造 | No（待 Phase 2/3） |
| Sofia 沒回 approval | 等 | 主動週四 09:00 提醒一次；不臆測 approve | No |
| 切角全部被退 | Sofia 連續說「重提」≥ 3 次 | 暫停寫稿，請 Sofia 給更具體方向或樣本文章 | Yes |

開 ticket 規格：依 `z-agent-ticket-creation` SOP，assignee 預設 Sofia
（`54d58944-1c93-4711-9a90-0753b42e2b17`，見 `.omni/harness/config.md`）。

---

## 9. Commands & Helpers Cheatsheet

### 9.1 已存在的腳本

| Script | 用途 |
|---|---|
| `scripts/register-with-numbers.mjs` | 圖片註冊 Numbers mainnet 取 NID |
| `scripts/generate-og-image.py` | 產 cover OG image（PIL + Noto Sans CJK） |
| `scripts/compress-images.mjs` | 圖片壓縮優化 |
| `scripts/download-images.mjs` | 批次下載圖片 |
| `scripts/validate-aeo-files.mjs` | 驗證 `robots.txt` / `llms.txt` / `agent.json` 格式 |
| `scripts/weekly_traffic_report.py` | 週流量報告 → Z App（v2 honest-by-default） |
| `scripts/migrate-posts.mjs` | Supabase 內容遷移 |
| `scripts/fix-mdx-base-paths.mjs` | MDX 圖片路徑修正 |

### 9.2 計畫中、尚未建立的腳本（Phase 2 工作）

| Script | 用途 | 預期 Phase |
|---|---|---|
| `scripts/draft-from-topic.mjs` | Topic → 3 切角 → GDoc | Phase 2 |
| `scripts/publish-from-gdoc.mjs` | GDoc → MDX → PR pipeline | Phase 2 |
| `scripts/gen-social-drafts.mjs` | MDX → 5 social drafts + UTM | Phase 2 |
| `scripts/utm-builder.mjs` | 確保 UTM 符合 `utm-convention.md` | Phase 2 |
| `scripts/mdx-nid-coverage.mjs` | 掃描 NID / coverNid / alt 缺漏 | Phase 2 |

### 9.3 常用一次性命令

```bash
# 跑 build
(cd sofia && npm run build)

# 圖片註冊
(cd sofia && node scripts/register-with-numbers.mjs --slug {slug})

# 產 OG cover
(cd sofia && python3 scripts/generate-og-image.py --slug {slug} --title "...")

# AEO 檔案驗證
(cd sofia && node scripts/validate-aeo-files.mjs)

# 開 PR
gh pr create --repo sofiayan0523/sofia --title "..." --body-file /tmp/pr-body.md
```

---

## 10. Cross-References

- `sofia/docs/voice-brief.md` v0 — 寫稿前必讀；定義「溫和的銳利」八條 voice principles、banned phrases、3 ✓ 3 ✗ samples、pre-draft checklist
- `sofia/docs/utm-convention.md` — UTM 標準 authoritative source；本檔 §6.6 只引不抄
- `.omni/harness/plans.md` v2 — 12 週 harness plan（§1.2 approval gate / §2 pipeline / §4 promotion 是本檔的根據）
- `.omni/harness/goal.md` — 5 項 scoring criteria；本檔第 7 章 artifact checklist 對應 criterion #1 Pipeline 端到端可執行
- `.omni/harness/config.md` — Z 紀錄目的地 / assignee / mentions / 時區
- `.omni/harness/todo.md` — 即時任務清單
- `.omni/memory.md` — 工作區持久 context；Space convention 含 Sofia 寫作風格與 Numbers brand guideline

---

## 11. Version History

| Version | Date | Author | Change |
|---|---|---|---|
| v0 | 2026-05-29 | Omni (loop iteration 3) | 初版，從 plans.md v2 §1.2 / §1.3 / §2 / §4 萃取 |
