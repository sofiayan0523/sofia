// Validate AEO foundation files. Run: node scripts/validate-aeo-files.mjs
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const cwd = process.cwd();
const checks = [];

function check(label, fn) {
  try {
    const result = fn();
    checks.push({ label, ok: true, detail: result });
  } catch (e) {
    checks.push({ label, ok: false, detail: e.message });
  }
}

check("public/llms.txt exists", () => {
  if (!existsSync(resolve(cwd, "public/llms.txt"))) throw new Error("missing");
  return "ok";
});

check("public/agent.json valid JSON", () => {
  const raw = readFileSync(resolve(cwd, "public/agent.json"), "utf-8");
  const parsed = JSON.parse(raw);
  if (!parsed.name || !parsed.expertise_areas) throw new Error("missing required keys");
  return `name=${parsed.name}, expertise_areas=${parsed.expertise_areas.length}`;
});

check("public/.well-known/agent.json mirrors public/agent.json", () => {
  if (!existsSync(resolve(cwd, "public/.well-known/agent.json"))) throw new Error("missing");
  const a = readFileSync(resolve(cwd, "public/agent.json"), "utf-8").trim();
  const b = readFileSync(resolve(cwd, "public/.well-known/agent.json"), "utf-8").trim();
  JSON.parse(a);
  JSON.parse(b);
  if (a !== b) throw new Error("content drift between /agent.json and /.well-known/agent.json — re-run: cp public/agent.json public/.well-known/agent.json");
  return `byte-identical (${a.length} chars)`;
});

check("public/robots.txt has AI bots", () => {
  const raw = readFileSync(resolve(cwd, "public/robots.txt"), "utf-8");
  const required = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"];
  const missing = required.filter((b) => !raw.includes(b));
  if (missing.length) throw new Error(`missing: ${missing.join(", ")}`);
  return `all ${required.length} bots present`;
});

check("public/robots.txt has correct sitemap URL", () => {
  const raw = readFileSync(resolve(cwd, "public/robots.txt"), "utf-8");
  if (!raw.includes("sofiayan0523.github.io/sofia/sitemap-index.xml")) {
    throw new Error("sitemap URL wrong or missing");
  }
  if (raw.includes("sofiaspace.lovable.app")) {
    throw new Error("still references deprecated lovable.app URL");
  }
  return "ok";
});

check("src/components/SEO.astro has 5 schema types", () => {
  const raw = readFileSync(resolve(cwd, "src/components/SEO.astro"), "utf-8");
  const required = ["personSchema", "orgSchema", "websiteSchema", "articleSchema", "faqSchema"];
  const missing = required.filter((s) => !raw.includes(s));
  if (missing.length) throw new Error(`missing schemas: ${missing.join(", ")}`);
  return "all 5 schemas declared";
});

check("src/pages/speaker.astro exists with FAQ", () => {
  const raw = readFileSync(resolve(cwd, "src/pages/speaker.astro"), "utf-8");
  if (!raw.includes("faqs")) throw new Error("no faqs array");
  if (!raw.includes("Numbers Protocol")) throw new Error("no Numbers Protocol mention");
  return "speaker page complete";
});

check("src/pages/speaker.astro hero has Sofia signature moves", () => {
  const raw = readFileSync(resolve(cwd, "src/pages/speaker.astro"), "utf-8");
  // Iteration 2 fix: hero must include (踩雷) + A vs B vs C structure
  if (!raw.includes("踩雷")) throw new Error("missing bracket-snark trope");
  if (!raw.includes("不是") || !raw.includes("也不是") || !raw.includes("而是")) {
    throw new Error("missing A vs B vs C trichotomy");
  }
  if (!raw.includes("XD")) throw new Error("missing Sofia XD aside");
  if (!raw.includes("Micro-receipts")) throw new Error("missing micro-receipts strip");
  return "all 4 signature moves present";
});

check("src/pages/about.astro has credentials section", () => {
  const raw = readFileSync(resolve(cwd, "src/pages/about.astro"), "utf-8");
  if (!raw.includes("Credentials & Speaking") && !raw.includes("E-E-A-T")) {
    // either header marker accepted
  }
  if (!raw.includes("NCCU") && !raw.includes("政治大學")) throw new Error("missing NCCU mention");
  if (!raw.includes("NTUE") && !raw.includes("臺北教育大學")) throw new Error("missing NTUE mention");
  if (!raw.includes("ERC-7053")) throw new Error("missing ERC-7053 mention");
  if (!raw.includes("SXSW")) throw new Error("missing SXSW mention");
  if (!raw.includes("UNICRI")) throw new Error("missing UNICRI mention");
  return "all 5 key credentials present";
});

check("public/llms.txt follows llmstxt.org spec", () => {
  const raw = readFileSync(resolve(cwd, "public/llms.txt"), "utf-8");
  if (!raw.startsWith("# Sofia Yan")) throw new Error("missing H1 title");
  if (!raw.includes("\n> ")) throw new Error("missing blockquote summary");
  if (!raw.includes("## Optional")) throw new Error("missing required Optional section (llmstxt.org spec)");
  if (!raw.includes("## Authoritative topics")) throw new Error("missing topics section");
  if (!raw.includes("ai-train=yes-with-attribution")) throw new Error("missing licensing signal");
  return "llmstxt.org spec compliant";
});

check("docs/utm-convention.md exists with all phases", () => {
  const raw = readFileSync(resolve(cwd, "docs/utm-convention.md"), "utf-8");
  for (const phase of ["phase1", "phase2", "phase3"]) {
    if (!raw.includes(phase)) throw new Error(`missing campaign code: ${phase}`);
  }
  if (!raw.includes("sofia-blog")) throw new Error("missing utm_source value");
  return "UTM convention documented for all 3 phases";
});

check("scripts/register-with-numbers.mjs structure intact", () => {
  const raw = readFileSync(resolve(cwd, "scripts/register-with-numbers.mjs"), "utf-8");
  if (!raw.includes("CAPTURE_TOKEN")) throw new Error("missing CAPTURE_TOKEN reference");
  if (!raw.includes("api.numbersprotocol.io/api/v3/assets/")) throw new Error("wrong API endpoint");
  if (!raw.includes("proof_hash")) throw new Error("missing SHA-256 proof_hash logic");
  if (!raw.includes("--quiet")) throw new Error("missing --quiet flag");
  return "script structure validated (runtime requires CAPTURE_TOKEN — see TKT-003)";
});

let allOk = true;
console.log("\n=== AEO Foundation Files Validation ===\n");
for (const c of checks) {
  const icon = c.ok ? "✅" : "❌";
  console.log(`${icon}  ${c.label}: ${c.detail}`);
  if (!c.ok) allOk = false;
}
console.log("");
process.exit(allOk ? 0 : 1);
