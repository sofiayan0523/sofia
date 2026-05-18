// De-AI-voice content sweep:
// 1. Remove all em-dashes (—— and --)
// 2. Fix AI rollout timing (今年 / Q1 / 這一兩年 → 去年 4 月 / 2025 年 4 月起)
// 3. China-style → Taiwan-style vocabulary
// Usage: node scripts/devoice-ai-content.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const FILES = [
  "src/content/posts/humanities-ai-expert.mdx",
  "src/content/posts/ai-anxiety-survival-guide.mdx",
  "src/content/posts/why-95-percent-ai-adoption-fails.mdx",
  "src/pages/ai-coworker-methodology.astro",
  "src/pages/speaker.astro",
];

// Em-dash replacements — context-sensitive.
// We replace ——X with 。X if X starts a new sentence-like construct,
// otherwise replace with ，X (comma).
function removeDashes(text) {
  let out = text;
  // 1. ——**word** (heavy emphasis intro) → 。**word**
  out = out.replace(/——\*\*/g, "。**");
  // 2. ——XXX (general) → ，XXX. But avoid creating ，。
  out = out.replace(/——/g, "，");
  // Clean double punct
  out = out.replace(/，，+/g, "，");
  out = out.replace(/，。/g, "。");
  out = out.replace(/。，/g, "。");
  out = out.replace(/：，/g, "：");
  out = out.replace(/，：/g, "：");
  return out;
}

// Timing fixes: AI rollout was 2025 April (a year ago from now = 2026 May)
const TIMING_REPLACEMENTS = [
  // "我們今年" (referring to AI rollout) → "我們去年 4 月"
  { from: "我們今年停掉", to: "我們去年 4 月停掉" },
  { from: "我們今年導入", to: "我們去年 4 月開始全面導入" },
  // "今年 Q1 全面 AI 導入" → "去年 4 月全面 AI 導入"
  { from: "我們公司 2025 Q1 全面 AI 導入後", to: "我們公司去年 4 月全面 AI 導入後" },
  { from: "2025 Q1 全面 AI 導入後", to: "2025 年 4 月全面 AI 導入後" },
  { from: "2025 第一季全面導入", to: "2025 年 4 月全面導入" },
  { from: "2025 年 Q1 全面 AI 導入", to: "2025 年 4 月全面 AI 導入" },
  // "今年" 單獨指 AI rollout 的場景（會誤抓但這 5 篇文應該都是這意思）
  // 這個保守處理：不全 replace，留 spot check
];

// Taiwan vocabulary normalization
const TW_VOCAB = [
  { from: "視頻", to: "影片" },
  { from: "博客", to: "部落格" },
  { from: "程序員", to: "工程師" },
  { from: "代碼", to: "程式碼" },
  { from: "軟件", to: "軟體" },
  { from: "網絡", to: "網路" },
  { from: "服務器", to: "伺服器" },
  { from: "界面", to: "介面" },
  { from: "搜索", to: "搜尋" },
  { from: "信息", to: "訊息" },
  { from: "信息流", to: "訊息流" },
  { from: "數字化", to: "數位化" },
  { from: "默認", to: "預設" },
  { from: "登錄", to: "登入" },
];

let totalDashRemoved = 0;
let totalTimingFixed = 0;
let totalVocabFixed = 0;

for (const rel of FILES) {
  const abs = resolve(ROOT, rel);
  const before = readFileSync(abs, "utf8");

  const dashCount = (before.match(/——/g) || []).length;
  let after = removeDashes(before);
  totalDashRemoved += dashCount;

  let timingCount = 0;
  for (const { from, to } of TIMING_REPLACEMENTS) {
    const beforeLen = after.split(from).length - 1;
    after = after.split(from).join(to);
    timingCount += beforeLen;
  }
  totalTimingFixed += timingCount;

  let vocabCount = 0;
  for (const { from, to } of TW_VOCAB) {
    const beforeLen = after.split(from).length - 1;
    after = after.split(from).join(to);
    vocabCount += beforeLen;
  }
  totalVocabFixed += vocabCount;

  if (after !== before) {
    writeFileSync(abs, after);
    console.error(`[devoice] ${rel}: ${dashCount} dashes / ${timingCount} timing / ${vocabCount} vocab`);
  }
}

console.error(`\n[devoice] TOTAL: ${totalDashRemoved} dashes / ${totalTimingFixed} timing / ${totalVocabFixed} vocab`);
process.exit(0);
