#!/usr/bin/env node
// One-shot custom domain switchover. RUN ONLY AFTER DNS IS LIVE.
//
// Preconditions:
//   1. DNS records for sofiayan.cc point to GitHub Pages IPs (see docs/dns-setup-sofiayan-cc.md)
//   2. dig +short sofiayan.cc returns 185.199.108.153 (and 3 other GitHub Pages IPs)
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
const NEW_BASE = "https://sofiayan.cc/";
const NEW_HOST = "sofiayan.cc";

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
  { from: 'site: "https://sofiayan0523.github.io"', to: 'site: "https://sofiayan.cc"' },
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
  { from: "sofiayan0523.github.io/sofia/sitemap-index.xml", to: `${NEW_HOST}/sitemap-index.xml` },
  { from: "sofia.numbersprotocol.io/sitemap-index.xml", to: `${NEW_HOST}/sitemap-index.xml` }, // recover from earlier staging if any
  { from: OLD_HOST, to: NEW_HOST },
]);

// ---- 6. Marker file ----
const marker = `# Custom Domain Switchover — completed

- Date: ${new Date().toISOString()}
- New site: https://sofiayan.cc/
- Old: https://sofiayan0523.github.io/sofia/  (GH Pages will redirect to new)

## Post-switchover checklist
- [ ] Confirm https://sofiayan.cc/llms.txt resolves
- [ ] Confirm https://sofiayan.cc/agent.json resolves
- [ ] Confirm https://sofiayan.cc/.well-known/agent.json resolves
- [ ] Re-submit sitemap to Google Search Console at new domain
- [ ] Re-run AEO baseline 28-cell to compare hit rate
- [ ] Update LinkedIn / X / Numbers Protocol page bio links to sofiayan.cc
- [ ] Update Gmail signature
- [ ] In Cloudflare: optionally enable Proxy (orange cloud) ONLY after HTTPS works on direct DNS
`;
const markerPath = resolve(ROOT, "../docs/switchover-completed.md");
if (!dryRun) {
  // ensure docs dir exists at workspace root
  try { writeFileSync(markerPath, marker); } catch (e) { log(`marker write failed: ${e.message}`); }
}

log(`DONE${dryRun ? " (dry-run, no files changed)" : ""}`);
process.exit(0);
