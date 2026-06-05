#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const cwd = process.cwd();
const roadmap = readFileSync(resolve(cwd, "docs/editorial-roadmap.md"), "utf-8");

const checks = [];

function check(label, fn) {
  try {
    const detail = fn();
    checks.push({ label, ok: true, detail });
  } catch (error) {
    checks.push({ label, ok: false, detail: error.message });
  }
}

function count(pattern) {
  return [...roadmap.matchAll(pattern)].length;
}

function requireText(values) {
  for (const value of values) {
    if (!roadmap.includes(value)) throw new Error(`missing ${value}`);
  }
}

check("roadmap has 8 planned briefs", () => {
  const total = count(/^### Brief \d+ - /gm);
  if (total !== 8) throw new Error(`expected 8 briefs, found ${total}`);
  return "8 briefs present";
});

check("each brief has required planning fields", () => {
  const fields = [
    "Category lane:",
    "Cluster:",
    "Scene trigger:",
    "Story arc:",
    "Target reader:",
    "Internal link target:",
    "Source / proof requirement:",
    "Conversion / relationship goal:",
    "Ending question:",
  ];
  for (const field of fields) {
    const total = count(new RegExp(`^- ${field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "gm"));
    if (total !== 8) throw new Error(`${field} appears ${total} times`);
  }
  return "all 9 fields appear in every brief";
});

check("roadmap covers required clusters and current routes", () => {
  requireText([
    "AI coworker management",
    "humanities-trained operators in AI adoption",
    "provenance / trust / C2PA",
    "founder operating notes from Numbers Protocol",
    "travel observations with work-adjacent insight",
    "/blog/humanities-ai-expert/",
    "/blog/ai-anxiety-survival-guide/",
    "/blog/why-95-percent-ai-adoption-fails/",
    "/blog/zero-to-ai-native/",
    "/ai-coworker-methodology",
    "/speaker",
  ]);
  return "clusters and internal links covered";
});

check("roadmap keeps thoughts intentional", () => {
  const thoughts = count(/Category lane: `thoughts`/g);
  if (thoughts < 2) throw new Error(`expected at least 2 thoughts candidates, found ${thoughts}`);
  requireText(["`thoughts` exists in the content schema but has no published posts", "維持前端隱藏"]);
  return `${thoughts} thoughts candidates with publishing guardrail`;
});

check("roadmap avoids generic SEO/listicle title patterns", () => {
  const banned = [
    "ultimate guide",
    "完整指南",
    "終極指南",
    "必看",
    "必學",
    "top ",
    "Top ",
    "10 ",
    "step-by-step",
    "懶人包",
    "攻略",
    "密技",
  ];
  const lower = roadmap.toLowerCase();
  for (const phrase of banned) {
    if (lower.includes(phrase.toLowerCase())) throw new Error(`banned template phrase found: ${phrase}`);
  }
  return "no banned title-template phrases found";
});

let allOk = true;
console.log("\n=== Editorial Roadmap Validation ===\n");
for (const result of checks) {
  const icon = result.ok ? "✅" : "❌";
  console.log(`${icon}  ${result.label}: ${result.detail}`);
  if (!result.ok) allOk = false;
}
console.log("");
process.exit(allOk ? 0 : 1);
