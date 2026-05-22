# 6/3 AppWorks Keynote — Speech Outline

> **Topic**: 全球只有 1,000 家真正的 AI-Native 公司 — 你的新創如何擠進這份名單
> **Date**: 2026-06-03
> **Venue**: AppWorks
> **Audience**: 早期新創 founder / 工程 lead / 投資人
> **Duration target**: 40 分鐘 keynote + 20 分鐘 Q&A（依現場調整）
> **Companion blog**: `/posts/ai-native-1000-club/`（QR code 放結尾投影片）

---

## 投影片骨架（建議 ~30 張，每張 1-1.5 分鐘）

### Section 0 — Cold Open（2 張，3 分鐘）

**S1 ｜標題頁**
- 背景全黑、Numbers Blue 文字
- 主標：「全球只有 1,000 家真正的 AI-Native 公司」
- 副標：「你的新創如何擠進這份名單」
- 演講者：Sofia Yan · Numbers Protocol
- 日期：2026.06.03 · AppWorks

**S2 ｜開場 hook**
- 一句話投影：「每家公司都說自己 AI-Native。」
- 講稿：
  > 「過去一年我每週都在企業內訓現場、demo day、創投 office hour 聽到這四個字。但只要深問一句『你們資料怎麼結構化？agent 邊界怎麼定？』 — 多數人會卡住。」
- 互動：請現場舉手 — 「自認 AI-Native」、「在轉型中」、「還沒開始」

---

### Section 1 — The 1,000 Number（4 張，5 分鐘）

**S3 ｜Greg Isenberg 的數字**
- 大字：「~1,000 家」
- 小字：全球年營收 ≥ $5M USD + 真正 AI-Native
- 註：「500、1,000、2,000 都有可能，數字不重要 — 重點是這個領域基本上是空的。」

**S4 ｜這四個字到底是什麼意思**
- 並排兩欄：
  - **AI-Assisted**：在邊緣加 AI（ChatGPT 分頁、品牌語氣助理 GPT）
  - **AI-Native**：重新設計核心（agent 負責前 80%，人類審核模糊地帶）

**S5 ｜一個問題改變一切**
- 螢幕只有一個問題：
  > 「如果 agent 負責前 80% 的工作，這個流程應該長什麼樣子？」
- 講稿：「這個問題是 AI-Assisted 跟 AI-Native 的分水嶺。第一個問題的答案是『加個 ChatGPT 分頁』；第二個問題的答案是『**整個流程要重寫**』。」

**S6 ｜客服案例（before / after）**
- 左欄：傳統客服流程（人讀 → 查帳戶 → 想政策 → 寫回覆 → 標分類）
- 右欄：AI-Native 客服（agent 讀完歷史/政策/工單 → 擬草稿 → 能解決就解決 → 不能就附原因送人類）
- 紅字結論：「人的角色不是搜尋引擎，是審核模糊地帶。」

---

### Section 2 — Why Most Companies Aren't Legible to Machines（3 張，5 分鐘）

**S7 ｜Legibility 這個詞**
- 大字：「Legibility（可讀性）」
- 副標：「公司讓自己對機器變得可讀」
- 講稿：「大多數公司對機器來說根本不可讀。對自己的員工也幾乎不可讀。」

**S8 ｜真相散落在哪裡**（列表型投影片，每行讀出來都會有人笑）
- CRM 說一套
- Slack 討論串說另一套
- 客戶歷史在某個人的信箱裡
- 定價邏輯在 `Final_v7_NEW.xlsx`
- 退費政策在一份沒人信任的 Notion
- 銷售流程 = 「去問 Sarah」
- 上線流程要 5 個工具、3 個人、2 道審核 + 你

**S9 ｜AI 沒辦法靠 vibe 運作**
- 大字：「Agent 需要：上下文、規則、邊界、知道何時動手、知道何時問人。」
- 補充：「大多數公司花了 20 年買軟體，沒花 20 年設計作業系統。**他們有一堆工具，不是一台機器**。」

---

### Section 3 — The Kitchen Metaphor（2 張，3 分鐘）

**S10 ｜廚房就是公司**
- 大字（Greg 原句）：
  > 「Everyone wants the magic. Nobody wants to clean the kitchen.」
- 下方一行：「But the kitchen IS the company.」
- 講稿：「AI-Native 的門檻不在模型，每個人都能買到 Claude / GPT / Gemini API。**門檻在這些無聊事**。」

**S11 ｜那 5 件無聊事**
1. 清資料（30 個系統 → 一份 source of truth）
2. 寫 SOP（隱性知識 → agent 可讀文件）
3. 把決策邏輯從人腦搬出來
4. 建邊界（哪些自動、哪些核准、哪些絕不）
5. 建稽核軌跡
- 結尾標語：「**Not sexy from the outside. Extremely sexy in the bank account.**」

---

### Section 4 — The 5-Step Playbook（10 張，15 分鐘）

> **節奏建議**：每一步一張概念投影片 + 一張具體案例投影片。前 4 步用 Numbers Protocol 自己的案例，第 5 步用對比公司類比。

**S12 ｜Step 1 — 挑窄範圍流程**
- 「不要從『讓公司變 AI-Native』開始 — 太抽象」
- 選量大、有規則、人花太多時間協調的流程
- 我們的第一個切入：客戶問題分類 + 標準回覆草稿

**S13 ｜Step 1 案例：我們踩的雷**（誠實揭露）
- 我們一開始的錯誤：想做「萬能客服 AI」 → 三週後脫線
- 修正後：拆成「分類 agent」「草稿 agent」「升級 agent」
- 結果：客服回應時間從 8h → 25min

**S14 ｜Step 2 — 把流程當機器拆**
- 列六個診斷問題（觸發 / 資料 / 決策 / 成功 / 錯誤 / 隱性知識）
- 強調最後一個：「人知道什麼是系統不知道的？」

**S15 ｜Step 2 案例：六題填答示範**
- 拿一個現場觀眾可能有的 case（例：onboarding）即興填答 — 觀眾互動

**S16 ｜Step 3 — 結構化知識**
- Agent 需要 X → 把 X 明確化
- 大字：「**這不是文件。這是基礎建設**。」
- 引用我自己的 [TAEA framework](https://sofiayan.com/ai-coworker-methodology) 的 A

**S17 ｜Step 3 案例：我們的 SOP 結構**
- 截圖（脫敏）：我們的「客戶分類 SOP」長什麼樣
- 一個 agent skill 的標準 YAML / Markdown 樣板

**S18 ｜Step 4 — agent 進流程，設邊界**
- 列我們的邊界規則：起草、分類、推薦 → 直接做；升級、退費、定價 → 要核准
- 大字：「**只在風險可控的地方給行動權。需要判斷的地方要求核准。記錄一切**。」

**S19 ｜Step 4 案例：Omni 平台架構**（如果時間夠）
- 一張架構圖（脫敏）：Memory / Skills / Subagents / Heartbeat / Plan Mode / Audit log
- 標語：「這不是賣 Omni，這是賣**架構**。任何工具實作這些功能都可以。」

**S20 ｜Step 5 — 衡量業務影響**
- 列指標：解決時間、轉換率、毛利率、**Revenue per Employee**、錯誤率、CSAT、銷售速度
- 紅字標 RPE：「這條最關鍵。AI-Native 公司會在這個數字上看得出來。」

**S21 ｜Step 5 案例：我們的數字**
- 4 人 + 15 AI + 8 實習
- 內部 MVP ≤ 24h
- SaaS / Infra 支出 -60%
- 對比表：Greg 的判準 vs 我們的狀態

---

### Section 5 — 3 Things You Can Do This Week（3 張，5 分鐘）

**S22 ｜給 founder 的 3 個立刻可做**
- 標題：「不需要等下週，你今晚就可以開始」

**S23 ｜Action 1 — 列「真相在誰腦袋裡」清單**
- 5 個診斷問題（定價 / 退費 / 合格 lead / 客戶歷史 / 邊緣情況）
- 「這份清單就是你 AI-Native 的 backlog」

**S24 ｜Action 2 — 選一個 agent，給真職責**
- 拆掉「萬能助理 GPT」
- 一個 agent / 一個 scope / 三週測試期
- 三個範例：onboarding email / sales pipeline 摘要 / 週末 PR 巡邏

**S25 ｜Action 3 — Revenue per Employee 變北極星**
- 螢幕只有一個問題：
  > 「這個工作能不能先用 agent 跑前 80%？我只招那 20% 真的需要人類的部分？」
- 講稿：「你接下來每招一個人都用這個問題篩過。你的 burn rate 會砍一半，公司會更強。」

---

### Section 6 — Why Incumbents Can't Catch You（2 張，3 分鐘）

**S26 ｜你的不公平優勢**
- 大字：「老公司不能靠宣布一個 AI 計畫就變 AI-Native。」
- 副標：「那就像想靠換方向盤把郵輪變快艇。」
- 紅字結論：「你的新創沒有家具要搬。**從乾淨狀態開始是你最大的 unfair advantage**。」

**S27 ｜窗口期**
- 大字：「**幾乎沒有人在做這件事**。」
- 「現在每個人都在大聲講 AI。結構上準備好的公司極少。**這就是落差。這就是機會**。」

---

### Section 7 — Close（2 張，2 分鐘）

**S28 ｜換問題**
- 螢幕只有兩個問題對比：
  - ❌ 「我們怎麼在工作中用 AI？」
  - ✅ 「我們怎麼建一間 AI 能在裡面運作的公司？」
- 一行字：「**這個問題就是那扇門。現在幾乎沒有人走過去**。」

**S29 ｜致謝 + CTA**
- 「謝謝 AppWorks。謝謝今天願意花時間的你們。」
- QR Code → 這篇 blog（含完整 Playbook、FAQ、Greg 原文連結）
- 三個延伸連結：
  - sofiayan.com（演講邀約 / workshop）
  - numbersprotocol.io（Omni 平台）
  - LinkedIn: @sofiayan

**S30 ｜Q&A 投影片**
- 大字：「Questions?」
- 角落：聯絡方式 + LinkedIn

---

## 演講開場 / 結尾的「金句口袋」

把這些當備用 ammunition，看現場氛圍丟：

1. 「ChatGPT 分頁不是 AI-Native，是 AI-Assisted。」
2. 「**人的角色不是搜尋引擎，是審核模糊地帶**。」
3. 「他們有一堆工具，不是一台機器。」
4. 「Not sexy from the outside. Extremely sexy in the bank account.」
5. 「**AI-First 是宣言。AI-Native 是事實**。」
6. 「你接下來每招一個人，先問：『這個工作能不能用 agent 跑前 80%？』」
7. 「老公司不能靠宣布一個 AI 計畫就變 AI-Native — 那就像想靠換方向盤把郵輪變快艇。」
8. 「他們會讓既有企業看起來像在跑一個有比較好看登入畫面的 Windows 95。」
9. 「廚房就是公司。」

---

## Q&A 預演（可能會被問的問題）

**Q1：你說 Omni 有 audit log，但 EU AI Act / GDPR 怎麼處理？**
- 重點答：TAEA 就是為這個設計的。每個 AI 操作都有 conversation/user/timestamp 三元組綁定，符合 EU AI Act Article 50 高風險 AI 的可追溯要求。

**Q2：我們公司有舊資料庫怎麼辦？要全部重做嗎？**
- 重點答：不用全部重做。重做「決策邏輯」+「客戶歷史 single source of truth」這兩條就夠。其他保留，但用 read-only adapter 餵給 agent。

**Q3：4 個人怎麼可能做完 30 個人的事？是不是過勞？**
- 重點答：恰恰相反。我們 4 個人花在「協調」「找資料」「重複決策」的時間從 60% 降到 10%。**省下來的時間做更值錢的事**。這就是 Greg 文章說的「人的角色被放大」。

**Q4：那 1,000 家有公開 list 嗎？台灣有哪幾家？**
- 重點答：沒有公開 list（Greg 也沒給）。台灣自認 AI-Native 的我認識的有 X、Y、Z，但「真正符合判準」的我自己只敢列 3-5 家。Numbers Protocol 算其中一家是我自己的判斷，不是同儕背書。

**Q5：我們是工具型 SaaS 不是服務業，AI-Native 怎麼套用？**
- 重點答：套用在你「內部營運」 — 客服、銷售、onboarding、產品決策迴圈。產品本身就算 AI-First 也可以，但公司運作要 AI-Native 才不會被新公司彎道超車。

**Q6：投資人會 buy 你「人少很好」這個故事嗎？**
- 重點答：早期會猶豫，後期極愛。VC 看到 Revenue per Employee 異常高的新創會搶。看 Cursor、Anthropic、Midjourney 早期都是極小團隊撐住大量營收。

---

## 場控建議

- **互動點**：S2（舉手）、S15（即興填答示範）、S29（QR code 掃完留時間反應）
- **能省的內容**：如果時間緊張，S13（踩雷案例）和 S19（架構圖）可以略過
- **絕不能省**：S5（一個問題）、S11（5 件無聊事）、S22-25（3 個立刻可做）、S28（換問題）

---

## 物料 checklist

- [ ] 投影片（建議 Keynote 或 Google Slides — 用 Omni Google Workspace 整合可協助）
- [ ] OG image：`public/images/posts/ai-native-1000-club/cover.jpg`（也可以放投影片 cover）
- [ ] QR code 指向：`https://sofiayan.com/posts/ai-native-1000-club/`（含 UTM：`utm_source=appworks-keynote&utm_medium=qr&utm_campaign=ai-native-1000-club`）
- [ ] 備用：印一份 blog 全文 PDF，給想深聊的人會場拿
- [ ] 演講後 24 小時內：把投影片 PDF 放 sofiayan.com 同篇下載區（社群推文觸發二次流量）
