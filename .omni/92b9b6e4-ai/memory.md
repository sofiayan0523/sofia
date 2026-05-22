# Workspace Context

<!-- This file is auto-maintained. The Repositories section is refreshed -->
<!-- by the system. The AI should maintain Environment & Key Discoveries. -->

**Workspace root (absolute path):** `/home/workspaces/conversations/92b9b6e4-e2c6-4498-8ef8-f078a201263a`

## Repositories

- **`personal-auto/`** — Branch: `omni/92b9b6e4/personal-auto`, Remote: `sofiayan0523/personal-auto`

- **`sofia-s-blog/`** — Branch: `omni/92b9b6e4/sofia-s-blog`, Remote: `sofiayan0523/sofia-s-blog`
  - **URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## Environment & Tools

_Not yet documented. The AI will populate this as it discovers the environment._

## Installed Skills

- **`aeo-assessment`** (system)
- **`agent-readiness-generator`** (system)
- **`ai-bot-traffic`** (system)
- **`google-ads`** (system)
- **`google-workspace`** (system)
- **`harness-dev`** (system)
- **`harness-execution`** (system)
- **`harness-plan`** (system)
- **`line-messaging`** (system)
- **`meta-ads`** (system)
- **`morning-brief`** (space)
- **`ms-office-suite`** (system)
- **`omni-help`** (system)
- **`skill-creator`** (system)
- **`z-agent-ticket-creation`** (system)
- **`z-check-comment`** (system)
- **`z-report-status`** (system)
- **`z-sync`** (system)
- **`z-ticket-check`** (system)
- **`z-writing-rules`** (system)

## Key Discoveries

- Omni 平台設計與 Greg Isenberg 的 AI-Native 論述高度對齊：TAEA 框架（Transparent / Auditable / Explainable）對應文章的「agent 需要規則、稽核、證據」；Memory（per-conversation `.omni/memory.md` + Shared Memory 五分類）+ Skills + Subagents + Library RAG 構成「對機器可讀」的組織知識層；Heartbeat（Pulse 4h / Rhythm 24h）+ NREM + Monitor + Loop/Schedule 構成「agent 艦隊 + 人類監督」的多模型編排；Z App agent tickets / Plan Mode / confirmation hooks 構成「何時動手、何時問人」的邊界。Omni 定位是「AI-Native 公司的賣鏟人」— 平台層基礎建設，而非單一產業的 AI-Native 服務公司。
- sofia-s-blog 的 AI-Native 文章 `ai-native-1000-club.mdx` 已把 OG cover 與 5 張內文圖註冊 Numbers NID，frontmatter 使用 `coverNid`，內文圖片使用 `<CaptureEye>` 顯示 provenance。
- 已讀取 `.omni/uploads/sofia-writing-style-guide.md` 並將 Sofia Yan 寫作風格摘要寫入 Shared Memory：反思散文、觸發點切入、故事弧線優先、結尾留旅程感，語氣為「溫和的銳利」，避免中國網路用語與 AI/PR 套話。
- 2026-05-22：以新寫作風格重寫三篇 AI 系列 blog（`humanities-ai-expert` / `ai-anxiety-survival-guide` / `why-95-percent-ai-adoption-fails`），MDX 已更新；同系列 Numbers brand OG cover 三張（Cream + Black + Red + Roboto Mono + Noto CJK + Human Truth. Machine Proof. tagline）已生成於 `public/images/posts/<slug>/cover.{png,jpg}`，並透過 `scripts/register-with-numbers.mjs` 註冊 Numbers NID。生成 OG cover 的腳本：`scripts/generate-ai-series-og-covers.py`（需 Pillow，建議用 venv 跑）。
- 2026-05-22：三篇重寫合輯已存成 Google Doc `1cnxBod7udEXs-hl9h5Y0liRLNZis_Hd2anT_IoIYgc8` 給 Sofia review；Z App 已開 agent_ticket `982f459f-4722-4f1f-8ea4-c78ec1ab7a1e`（review_request，assignee = Sofia），等 Sofia 改完後再 sync 回 MDX。

---
_Last system refresh: 2026-05-22 07:08 UTC_
