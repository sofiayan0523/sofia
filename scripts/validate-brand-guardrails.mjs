#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const cwd = process.cwd();
const checks = [];

function read(relativePath) {
  return readFileSync(resolve(cwd, relativePath), "utf-8");
}

function check(label, fn) {
  try {
    const detail = fn();
    checks.push({ label, ok: true, detail });
  } catch (error) {
    checks.push({ label, ok: false, detail: error.message });
  }
}

function expectIncludes(raw, values) {
  for (const value of values) {
    if (!raw.includes(value)) throw new Error(`missing ${value}`);
  }
}

check("site guardrails document page roles and CTA map", () => {
  const raw = read("docs/site-guardrails.md");
  expectIncludes(raw, [
    "Page Roles",
    "Blog Post CTA Rules",
    "Authority Signal Rules",
    "Voice Guardrails",
    "`ai-insights` posts should point to `/ai-coworker-methodology` first and `/speaker` second",
    "`travel` posts should point to `/about` first and `/blog` second",
    "Keep quantitative claims in pages that carry proof context",
  ]);
  for (const route of ["/", "/about", "/career", "/speaker", "/ai-coworker-methodology", "/blog"]) {
    if (!raw.includes(`| \`${route}\``)) throw new Error(`missing route in CTA map: ${route}`);
  }
  return "top-level page roles and category-aware CTA rules documented";
});

check("blog post template has category-aware contextual CTAs", () => {
  const raw = read("src/pages/blog/[...slug].astro");
  expectIncludes(raw, [
    'post.data.category === "ai-insights"',
    'post.data.category === "travel"',
    "blog-context-ai",
    "blog-context-travel",
    `${"${baseUrl}"}ai-coworker-methodology`,
    `${"${baseUrl}"}speaker`,
    `${"${baseUrl}"}about`,
    `${"${baseUrl}"}blog`,
    "如果你想把這篇帶回團隊討論",
    "如果你是從旅行文字認識我",
  ]);
  return "AI and travel post paths are separated";
});

check("travel contextual CTA does not promote Speaker by default", () => {
  const raw = read("src/pages/blog/[...slug].astro");
  const travelBlock = raw.match(/post\.data\.category === "travel"[\s\S]*?: null;/);
  if (!travelBlock) throw new Error("travel CTA block not found");
  if (travelBlock[0].includes("speaker")) throw new Error("travel CTA block includes speaker");
  return "travel posts route to About / Blog only";
});

check("high-risk proof metrics stay in proof-context pages", () => {
  const files = [
    "src/pages/index.astro",
    "src/pages/about.astro",
    "src/pages/ai-coworker-methodology.astro",
    "src/i18n/zh.ts",
    "src/i18n/en.ts",
  ];
  const highRiskClaims = ["13萬", "60億", "67M+", "7+"];
  for (const file of files) {
    const raw = read(file);
    for (const claim of highRiskClaims) {
      if (raw.includes(claim)) throw new Error(`${claim} appears outside proof context in ${file}`);
    }
  }
  return "known high-risk quantitative claims are not promoted in hero / narrative pages";
});

check("source copy avoids generic consultant marketing phrases", () => {
  const files = [
    "src/pages/index.astro",
    "src/pages/about.astro",
    "src/pages/speaker.astro",
    "src/pages/ai-coworker-methodology.astro",
    "src/pages/blog/[...slug].astro",
    "src/i18n/zh.ts",
    "src/i18n/en.ts",
  ];
  const banned = [
    "unlock growth",
    "unlock your",
    "AI revolution",
    "transform your business",
    "one-stop solution",
    "一站式",
    "賦能",
    "顛覆",
    "降本增效",
    "完整指南",
    "終極指南",
  ];
  for (const file of files) {
    const raw = read(file);
    const lower = raw.toLowerCase();
    for (const phrase of banned) {
      if (lower.includes(phrase.toLowerCase())) {
        throw new Error(`generic phrase "${phrase}" found in ${file}`);
      }
    }
  }
  return "no banned generic marketing phrases found in source copy";
});

let allOk = true;
console.log("\n=== Brand & CTA Guardrails Validation ===\n");
for (const result of checks) {
  const icon = result.ok ? "✅" : "❌";
  console.log(`${icon}  ${result.label}: ${result.detail}`);
  if (!result.ok) allOk = false;
}
console.log("");
process.exit(allOk ? 0 : 1);
