#!/usr/bin/env node
// One-shot custom domain switchover. RUN ONLY AFTER DNS IS LIVE.
//
// Preconditions:
//   1. DNS record CNAME sofia.numbersprotocol.io -> sofiayan0523.github.io is propagating
//   2. dig +short sofia.numbersprotocol.io returns sofiayan0523.github.io
//
// What this does:
//   1. Renames public/CNAME.pending -> public/CNAME (activates GH Pages custom domain)
//   2. Patches astro.config.mjs: site -> https://sofia.numbersprotocol.io, base -> /
//   3. Replaces all hard-coded sofiayan0523.github.io/sofia/ references in:
//      - public/llms.txt
//      - public/agent.json
//      - public/.well-known/agent.json
//      - public/robots.txt
//      - src/components/SEO.astro DEFAULT_TITLE/DESCRIPTION (canonical URLs use Astro.site so no need)
//   4. Writes a marker file docs/switchover-completed.md
//
// Usage:
//   node scripts/switchover-domain.mjs
//   node scripts/switchover-domain.mjs --dry-run

import { readFileSync, writeFileSync, renameSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const dryRun = process.argv.includes("--dry-run");

const OLD_BASE = "https://sofiayan0523.github.io/sofia/";
const OLD_HOST = "sofiayan0523.github.io/sofia";  // without protocol, used in some places
const NEW_BASE = "https://sofia.numbersprotocol.io/";
const NEW_HOST = "sofia.numbersprotocol.io";

const log = (m) => console.error(`[switchover${dryRun ? " DRY-RUN" : ""}] ${m}`);

function patchFile(relPath, transforms) {
  const abs = resolve(ROOT, relPath);
  if (!existsSync(abs)) {
    log(`SKIP (missing): ${relPath}`);
    return;
  }
  let raw = readFileSync(abs, "utf8");
  let count = 0;
  for (const { from, to } of transforms) {
    const before = raw;
    raw = raw.split(from).join(to);
    if (raw !== before) count++;
  }
  if (count > 0) {
    log(`PATCH (${count} transforms applied): ${relPath}`);
    if (!dryRun) writeFileSync(abs, raw);
  } else {
    log(`NO-OP: ${relPath}`);
  }
}

// ---- 1. Activate CNAME ----
const pendingCname = resolve(ROOT, "public/CNAME.pending");
const liveCname = resolve(ROOT, "public/CNAME");
if (existsSync(pendingCname)) {
  log("ACTIVATING CNAME (renaming CNAME.pending -> CNAME)");
  if (!dryRun) renameSync(pendingCname, liveCname);
} else if (existsSync(liveCname)) {
  log("CNAME already active");
} else {
  log("WARN: neither CNAME.pending nor CNAME exists");
}

// ---- 2. Patch astro.config.mjs ----
patchFile("astro.config.mjs", [
  { from: 'site: "https://sofiayan0523.github.io"', to: 'site: "https://sofia.numbersprotocol.io"' },
  { from: 'base: "/sofia"', to: 'base: "/"' },
]);

// ---- 3. Patch public/llms.txt ----
patchFile("public/llms.txt", [
  { from: OLD_BASE, to: NEW_BASE },
]);

// ---- 4. Patch agent.json + .well-known ----
const agentTransforms = [
  { from: OLD_BASE, to: NEW_BASE },
  { from: `"site": "${OLD_BASE}"`, to: `"site": "${NEW_BASE}"` },
];
patchFile("public/agent.json", agentTransforms);
patchFile("public/.well-known/agent.json", agentTransforms);

// ---- 5. Patch robots.txt ----
patchFile("public/robots.txt", [
  { from: "sofiayan0523.github.io/sofia/sitemap-index.xml", to: "sofia.numbersprotocol.io/sitemap-index.xml" },
  { from: OLD_HOST, to: NEW_HOST },
]);

// ---- 6. Marker file ----
const marker = `# Custom Domain Switchover — completed

- Date: ${new Date().toISOString()}
- New site: https://sofia.numbersprotocol.io/
- Old: https://sofiayan0523.github.io/sofia/  (GH Pages will redirect to new)

## Post-switchover checklist
- [ ] Confirm https://sofia.numbersprotocol.io/llms.txt resolves
- [ ] Confirm https://sofia.numbersprotocol.io/agent.json resolves
- [ ] Re-submit sitemap to Google Search Console at new domain
- [ ] Re-run AEO baseline 28-cell to compare hit rate
- [ ] Update LinkedIn / X / FB / email-sig bio links to new URL
`;
const markerPath = resolve(ROOT, "../docs/switchover-completed.md");
if (!dryRun) {
  // ensure docs dir exists at workspace root
  try { writeFileSync(markerPath, marker); } catch (e) { log(`marker write failed: ${e.message}`); }
}

log(`DONE${dryRun ? " (dry-run, no files changed)" : ""}`);
process.exit(0);
