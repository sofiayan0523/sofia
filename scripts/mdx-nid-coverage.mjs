#!/usr/bin/env node
/**
 * mdx-nid-coverage.mjs — Scan published MDX posts for Numbers Protocol NID
 * and CaptureEye coverage.
 *
 * Reports per article:
 *   - frontmatter `coverNid` presence + non-empty
 *   - inline `<CaptureEye nid="...">` count, NID present + non-empty
 *   - bare `<img>` or markdown `![alt](src)` usages pointing at /images/posts/
 *     (flagged as migration candidates — published images should always
 *     go through CaptureEye so Numbers provenance is rendered)
 *   - alt-text presence and a heuristic "looks like a filename" check
 *     (Facebook-style `503502822_10161434…_n.jpg` IDs do not help a11y or LLM
 *     ingestion)
 *
 * Output:
 *   - Default: human-readable Markdown summary to stdout.
 *   - `--json`: machine-readable JSON report to stdout.
 *   - `--strict`: exit 1 if any ERROR-severity finding (per
 *     `blog-publishing-workflow.md` §6.2 hard gates). Default exit 0.
 *
 * Usage:
 *   node scripts/mdx-nid-coverage.mjs
 *   node scripts/mdx-nid-coverage.mjs --json > /tmp/coverage.json
 *   node scripts/mdx-nid-coverage.mjs --strict   # use in publish pipeline
 *   node scripts/mdx-nid-coverage.mjs --posts-dir custom/path
 *   node scripts/mdx-nid-coverage.mjs --self-test
 *
 * Programmatic:
 *   import { scanPostsDir, scanMdxText } from "./mdx-nid-coverage.mjs";
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DEFAULT_POSTS_DIR = resolve(__dirname, "..", "src", "content", "posts");

// ----- Frontmatter parsing -------------------------------------------------

/**
 * Parse YAML frontmatter from an MDX file. Returns object map of top-level
 * keys to raw string values (no YAML datatype coercion). Returns null if no
 * frontmatter block is found.
 */
export function parseFrontmatter(text) {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return null;
  const block = match[1];
  const result = {};
  for (const raw of block.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    if (!line || line.startsWith("#")) continue;
    // Only parse simple `key: value` rows; ignore list/object continuation.
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    // Strip surrounding quotes if balanced.
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    result[key] = val;
  }
  return result;
}

// ----- Inline media extraction --------------------------------------------

const CAPTURE_EYE_RE = /<CaptureEye\b([^>]*?)\/?>/g;
const ATTR_RE = /([a-zA-Z_:][-a-zA-Z0-9_.:]*)\s*=\s*"((?:[^"\\]|\\.)*)"/g;
const BARE_IMG_RE = /<img\b([^>]*?)\/?>/g;
const MD_IMG_RE = /!\[([^\]]*?)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

function parseAttrs(raw) {
  const out = {};
  let m;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(raw)) !== null) {
    out[m[1]] = m[2];
  }
  return out;
}

/**
 * Heuristic: does this alt look like an auto-generated filename rather than a
 * descriptive caption? Common signals:
 *   - Pure digits + underscores: Facebook IDs like 503502822_10161434…_n.jpg
 *   - Ends in image extension
 *   - Starts with IMG_/DSC_/PXL_
 */
export function looksLikeFilename(alt) {
  if (!alt) return false;
  const s = alt.trim();
  if (/\.(jpe?g|png|gif|webp|heic)$/i.test(s)) return true;
  if (/^IMG[_-]/i.test(s) || /^DSC[_-]/i.test(s) || /^PXL[_-]/i.test(s)) return true;
  // FB-style: many digits with underscores, often ending in _n.jpg or n
  if (/^\d{6,}[_a-z0-9]*$/i.test(s)) return true;
  // Long underscore-heavy strings with no spaces
  if (s.length >= 20 && !/\s/.test(s) && s.split("_").length >= 3) return true;
  return false;
}

// ----- Per-file scan -------------------------------------------------------

/**
 * Scan a single MDX file body and return findings.
 * @param {string} text  raw file content
 * @param {string} slug  derived slug (filename without extension)
 */
export function scanMdxText(text, slug = "(unknown)") {
  const frontmatter = parseFrontmatter(text) || {};
  const body = text.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "");

  const findings = [];
  const captureEyes = [];
  let capWithoutNid = 0;
  let capWithoutAlt = 0;
  let capFilenameAlt = 0;

  let m;
  CAPTURE_EYE_RE.lastIndex = 0;
  while ((m = CAPTURE_EYE_RE.exec(body)) !== null) {
    const attrs = parseAttrs(m[1]);
    const nid = (attrs.nid || "").trim();
    const alt = (attrs.alt || "").trim();
    const src = (attrs.src || "").trim();
    captureEyes.push({ nid, alt, src });
    if (!nid) capWithoutNid++;
    if (!alt) capWithoutAlt++;
    if (alt && looksLikeFilename(alt)) capFilenameAlt++;
  }

  const bareImgs = [];
  BARE_IMG_RE.lastIndex = 0;
  while ((m = BARE_IMG_RE.exec(body)) !== null) {
    const attrs = parseAttrs(m[1]);
    if ((attrs.src || "").includes("/images/posts/")) {
      bareImgs.push(attrs);
    }
  }

  const mdImgs = [];
  MD_IMG_RE.lastIndex = 0;
  while ((m = MD_IMG_RE.exec(body)) !== null) {
    if (m[2].includes("/images/posts/")) {
      mdImgs.push({ alt: m[1], src: m[2] });
    }
  }

  const coverNidPresent = !!(frontmatter.coverNid && frontmatter.coverNid.length > 0);
  const coverImagePresent = !!(frontmatter.coverImage && frontmatter.coverImage.length > 0);

  // ERROR-severity findings (publish blockers per workflow §6.2)
  if (coverImagePresent && !coverNidPresent) {
    findings.push({
      severity: "error",
      rule: "missing-coverNid",
      message: `frontmatter has coverImage="${frontmatter.coverImage}" but no coverNid`,
    });
  }
  if (capWithoutNid > 0) {
    findings.push({
      severity: "error",
      rule: "captureEye-missing-nid",
      message: `${capWithoutNid} of ${captureEyes.length} <CaptureEye> elements have no nid`,
    });
  }
  if (bareImgs.length > 0) {
    findings.push({
      severity: "error",
      rule: "bare-img-in-post",
      message: `${bareImgs.length} bare <img> tag(s) pointing at /images/posts/ — should use <CaptureEye>`,
      details: bareImgs.map((a) => a.src).slice(0, 10),
    });
  }
  if (mdImgs.length > 0) {
    findings.push({
      severity: "error",
      rule: "markdown-img-in-post",
      message: `${mdImgs.length} markdown ![](…) image(s) pointing at /images/posts/ — should use <CaptureEye>`,
      details: mdImgs.map((a) => a.src).slice(0, 10),
    });
  }

  // WARNING-severity findings (a11y / quality)
  if (capWithoutAlt > 0) {
    findings.push({
      severity: "warning",
      rule: "captureEye-missing-alt",
      message: `${capWithoutAlt} of ${captureEyes.length} <CaptureEye> elements have empty alt`,
    });
  }

  // INFO-severity findings (low confidence, suggestions)
  if (capFilenameAlt > 0) {
    findings.push({
      severity: "info",
      rule: "captureEye-filename-alt",
      message: `${capFilenameAlt} of ${captureEyes.length} <CaptureEye> alt values look like raw filenames (e.g. FB image IDs) — consider rewriting for a11y & LLM ingestion`,
    });
  }

  const isDraft = frontmatter.draft === "true";

  return {
    slug,
    title: frontmatter.title || "",
    publishedAt: frontmatter.publishedAt || frontmatter.date || "",
    draft: isDraft,
    coverImage: frontmatter.coverImage || null,
    coverNidPresent,
    coverNid: frontmatter.coverNid || null,
    captureEye: {
      total: captureEyes.length,
      withNid: captureEyes.length - capWithoutNid,
      withoutNid: capWithoutNid,
      withoutAlt: capWithoutAlt,
      filenameAlt: capFilenameAlt,
    },
    bareImg: bareImgs.length,
    mdImg: mdImgs.length,
    findings,
    nidCoveragePct: computeNidCoveragePct(captureEyes.length, capWithoutNid),
    hardGatePass: !findings.some((f) => f.severity === "error"),
  };
}

function computeNidCoveragePct(total, withoutNid) {
  if (total === 0) return null; // n/a for posts with no inline images
  return Math.round(((total - withoutNid) / total) * 1000) / 10;
}

// ----- Directory scan ------------------------------------------------------

/**
 * Scan all .md/.mdx files in a directory (non-recursive).
 */
export function scanPostsDir(postsDir) {
  const dir = postsDir || DEFAULT_POSTS_DIR;
  let stat;
  try {
    stat = statSync(dir);
  } catch (e) {
    throw new Error(`posts dir not found: ${dir}`);
  }
  if (!stat.isDirectory()) {
    throw new Error(`not a directory: ${dir}`);
  }

  const files = readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const reports = [];
  for (const f of files.sort()) {
    const slug = f.replace(/\.(mdx|md)$/, "");
    const text = readFileSync(join(dir, f), "utf-8");
    reports.push(scanMdxText(text, slug));
  }

  return {
    postsDir: dir,
    totalFiles: reports.length,
    publishedFiles: reports.filter((r) => !r.draft).length,
    draftFiles: reports.filter((r) => r.draft).length,
    reports,
    summary: aggregateSummary(reports),
  };
}

function aggregateSummary(reports) {
  const published = reports.filter((r) => !r.draft);
  const coverNidOk = published.filter((r) => r.coverNidPresent).length;
  const capTotal = published.reduce((a, r) => a + r.captureEye.total, 0);
  const capWithNid = published.reduce((a, r) => a + r.captureEye.withNid, 0);
  const capWithoutAlt = published.reduce((a, r) => a + r.captureEye.withoutAlt, 0);
  const capFilenameAlt = published.reduce((a, r) => a + r.captureEye.filenameAlt, 0);
  const bareImgTotal = published.reduce((a, r) => a + r.bareImg, 0);
  const mdImgTotal = published.reduce((a, r) => a + r.mdImg, 0);
  const hardGatePass = published.filter((r) => r.hardGatePass).length;

  return {
    publishedArticles: published.length,
    coverNidPresent: coverNidOk,
    coverNidPct: published.length === 0 ? null : Math.round((coverNidOk / published.length) * 1000) / 10,
    inlineImagesTotal: capTotal,
    inlineImagesWithNid: capWithNid,
    inlineImagesNidPct: capTotal === 0 ? null : Math.round((capWithNid / capTotal) * 1000) / 10,
    inlineImagesMissingAlt: capWithoutAlt,
    inlineImagesFilenameAlt: capFilenameAlt,
    bareImgInstances: bareImgTotal,
    markdownImgInstances: mdImgTotal,
    hardGatePassArticles: hardGatePass,
    hardGatePassPct: published.length === 0 ? null : Math.round((hardGatePass / published.length) * 1000) / 10,
  };
}

// ----- Renderers -----------------------------------------------------------

function fmtPct(v) {
  return v === null ? "n/a" : `${v}%`;
}

export function renderMarkdown(scan) {
  const { summary, reports, postsDir } = scan;
  const lines = [];
  lines.push(`# MDX / Numbers NID Coverage Report`);
  lines.push("");
  lines.push(`Scanned: \`${postsDir}\``);
  lines.push(`Date: ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`## Aggregate Summary（published only）`);
  lines.push("");
  lines.push(`| Metric | Value |`);
  lines.push(`|---|---|`);
  lines.push(`| Published articles | ${summary.publishedArticles} |`);
  lines.push(`| Articles with cover NID | ${summary.coverNidPresent} / ${summary.publishedArticles} (${fmtPct(summary.coverNidPct)}) |`);
  lines.push(`| Inline images total | ${summary.inlineImagesTotal} |`);
  lines.push(`| Inline images with NID | ${summary.inlineImagesWithNid} / ${summary.inlineImagesTotal} (${fmtPct(summary.inlineImagesNidPct)}) |`);
  lines.push(`| Inline images missing alt | ${summary.inlineImagesMissingAlt} |`);
  lines.push(`| Inline images with filename-style alt | ${summary.inlineImagesFilenameAlt} |`);
  lines.push(`| Bare <img> instances in posts | ${summary.bareImgInstances} |`);
  lines.push(`| Markdown ![]() image instances in posts | ${summary.markdownImgInstances} |`);
  lines.push(`| Articles passing publish hard gates | ${summary.hardGatePassArticles} / ${summary.publishedArticles} (${fmtPct(summary.hardGatePassPct)}) |`);
  lines.push("");

  lines.push(`## Per-Article Detail`);
  lines.push("");
  lines.push(`| Slug | cover NID | Inline NID coverage | Missing alt | Filename alt | Hard gate |`);
  lines.push(`|---|---|---|---|---|---|`);
  for (const r of reports) {
    if (r.draft) continue;
    const cover = r.coverNidPresent ? "✅" : (r.coverImage ? "❌" : "—");
    const inline = r.captureEye.total === 0 ? "—" :
      `${r.captureEye.withNid}/${r.captureEye.total} (${fmtPct(r.nidCoveragePct)})`;
    const alt = r.captureEye.withoutAlt === 0 ? "0" : `${r.captureEye.withoutAlt}`;
    const filename = r.captureEye.filenameAlt === 0 ? "0" : `${r.captureEye.filenameAlt}`;
    const gate = r.hardGatePass ? "✅" : "❌";
    lines.push(`| \`${r.slug}\` | ${cover} | ${inline} | ${alt} | ${filename} | ${gate} |`);
  }
  lines.push("");

  const allFindings = [];
  for (const r of reports) {
    if (r.draft) continue;
    for (const f of r.findings) {
      allFindings.push({ slug: r.slug, ...f });
    }
  }
  if (allFindings.length === 0) {
    lines.push(`## Findings`);
    lines.push("");
    lines.push(`_No findings — all hard gates pass; no a11y warnings._`);
    lines.push("");
    return lines.join("\n");
  }

  lines.push(`## Findings`);
  lines.push("");
  const bySeverity = { error: [], warning: [], info: [] };
  for (const f of allFindings) bySeverity[f.severity].push(f);
  for (const sev of ["error", "warning", "info"]) {
    const items = bySeverity[sev];
    if (items.length === 0) continue;
    const label = { error: "❌ Errors (publish blockers)", warning: "⚠️  Warnings", info: "ℹ️  Info" }[sev];
    lines.push(`### ${label}`);
    lines.push("");
    for (const f of items) {
      lines.push(`- \`${f.slug}\` — **${f.rule}**: ${f.message}`);
      if (f.details && f.details.length) {
        for (const d of f.details) lines.push(`    - ${d}`);
      }
    }
    lines.push("");
  }
  return lines.join("\n");
}

// ----- CLI -----------------------------------------------------------------

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json")      { args.json = true; continue; }
    if (a === "--strict")    { args.strict = true; continue; }
    if (a === "--self-test") { args.selfTest = true; continue; }
    if (a === "--help" || a === "-h") { args.help = true; continue; }
    if (a === "--posts-dir") { args.postsDir = argv[++i]; continue; }
    return { _error: `unknown argument "${a}"` };
  }
  return args;
}

const HELP = `\
mdx-nid-coverage — scan published MDX posts for Numbers NID / CaptureEye coverage

Flags:
  --json                  emit JSON instead of Markdown
  --strict                exit 1 if any ERROR-severity finding (use in pipeline)
  --posts-dir <path>      override default src/content/posts/
  --self-test             run internal unit tests
  --help / -h             this message

Defaults to scanning sofia/src/content/posts/.
`;

function runSelfTest() {
  let pass = 0;
  let fail = 0;
  function expect(name, fn) {
    try { fn(); pass++; process.stdout.write(`  ✓ ${name}\n`); }
    catch (e) { fail++; process.stdout.write(`  ✗ ${name}\n    ${e.message}\n`); }
  }
  function assertEq(a, b, msg) { if (a !== b) throw new Error(`${msg||""} expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`); }
  function assertTrue(v, m) { if (!v) throw new Error(m || "expected truthy"); }
  function assertFalse(v, m) { if (v) throw new Error(m || "expected falsy"); }

  process.stdout.write("mdx-nid-coverage self-test\n");

  expect("parseFrontmatter reads simple key:value", () => {
    const fm = parseFrontmatter(`---\ntitle: "Hello"\nslug: foo\ncoverNid: bafkrei123\ndraft: false\n---\nbody`);
    assertEq(fm.title, "Hello");
    assertEq(fm.slug, "foo");
    assertEq(fm.coverNid, "bafkrei123");
    assertEq(fm.draft, "false");
  });

  expect("parseFrontmatter returns null when no block", () => {
    assertEq(parseFrontmatter("just text"), null);
  });

  expect("looksLikeFilename catches FB style", () => {
    assertTrue(looksLikeFilename("503502822_10161434132586009_3199532527969402254_n.jpg"));
    assertTrue(looksLikeFilename("IMG_1234.JPG"));
    assertTrue(looksLikeFilename("DSC_0001.jpeg"));
  });

  expect("looksLikeFilename rejects normal alt", () => {
    assertFalse(looksLikeFilename("三個階段：Prompt → Context → Harness Engineering"));
    assertFalse(looksLikeFilename("Sofia 在咖啡店"));
    assertFalse(looksLikeFilename(""));
  });

  expect("scanMdxText: clean post with NID + descriptive alt → hard gate pass", () => {
    const text = `---
title: "Hello"
coverImage: "/images/posts/foo/cover.jpg"
coverNid: "bafkrei123"
draft: false
---
import CaptureEye from "@/components/CaptureEye.astro";

<CaptureEye nid="bafkreiabc" src="/images/posts/foo/01.jpg" alt="三個階段示意圖" />
text body
<CaptureEye nid="bafkreidef" src="/images/posts/foo/02.jpg" alt="Sofia 在咖啡店" />
`;
    const r = scanMdxText(text, "foo");
    assertTrue(r.coverNidPresent, "coverNid present");
    assertEq(r.captureEye.total, 2);
    assertEq(r.captureEye.withNid, 2);
    assertEq(r.captureEye.withoutAlt, 0);
    assertEq(r.captureEye.filenameAlt, 0);
    assertTrue(r.hardGatePass, "hard gate should pass");
    assertEq(r.findings.length, 0);
  });

  expect("scanMdxText: missing nid on CaptureEye → error finding", () => {
    const text = `---
title: "Hello"
coverImage: "/images/posts/foo/cover.jpg"
coverNid: "bafkrei123"
---
<CaptureEye nid="" src="/images/posts/foo/01.jpg" alt="x" />
`;
    const r = scanMdxText(text, "foo");
    assertEq(r.captureEye.withoutNid, 1);
    assertFalse(r.hardGatePass);
    const err = r.findings.find((f) => f.rule === "captureEye-missing-nid");
    assertTrue(err, "should report captureEye-missing-nid");
  });

  expect("scanMdxText: bare img pointing at /images/posts/ → error", () => {
    const text = `---
title: "Hello"
coverImage: "/images/posts/foo/cover.jpg"
coverNid: "bafkrei123"
---
<img src="/images/posts/foo/01.jpg" alt="x" />
`;
    const r = scanMdxText(text, "foo");
    assertEq(r.bareImg, 1);
    assertFalse(r.hardGatePass);
    assertTrue(r.findings.find((f) => f.rule === "bare-img-in-post"));
  });

  expect("scanMdxText: markdown image syntax → error", () => {
    const text = `---
title: "Hello"
coverImage: "/images/posts/foo/cover.jpg"
coverNid: "bafkrei123"
---
some text
![alt text](/images/posts/foo/01.jpg)
more text
`;
    const r = scanMdxText(text, "foo");
    assertEq(r.mdImg, 1);
    assertFalse(r.hardGatePass);
    assertTrue(r.findings.find((f) => f.rule === "markdown-img-in-post"));
  });

  expect("scanMdxText: cover image without coverNid → error", () => {
    const text = `---
title: "Hello"
coverImage: "/images/posts/foo/cover.jpg"
---
ok
`;
    const r = scanMdxText(text, "foo");
    assertFalse(r.coverNidPresent);
    assertFalse(r.hardGatePass);
    assertTrue(r.findings.find((f) => f.rule === "missing-coverNid"));
  });

  expect("scanMdxText: pure-text essay (no inline images, has coverNid) → pass with n/a coverage", () => {
    const text = `---
title: "Hello"
coverImage: "/images/posts/foo/cover.jpg"
coverNid: "bafkrei123"
---
just text, no images
`;
    const r = scanMdxText(text, "foo");
    assertTrue(r.coverNidPresent);
    assertEq(r.captureEye.total, 0);
    assertEq(r.nidCoveragePct, null);
    assertTrue(r.hardGatePass);
  });

  expect("scanMdxText: filename-style alt → info finding only, gate still passes", () => {
    const text = `---
title: "Hello"
coverImage: "/images/posts/foo/cover.jpg"
coverNid: "bafkrei123"
---
<CaptureEye nid="bafkreiabc" src="/images/posts/foo/01.jpg" alt="503502822_10161434132586009_n.jpg" />
`;
    const r = scanMdxText(text, "foo");
    assertEq(r.captureEye.filenameAlt, 1);
    assertTrue(r.hardGatePass);
    const info = r.findings.find((f) => f.rule === "captureEye-filename-alt");
    assertTrue(info);
    assertEq(info.severity, "info");
  });

  expect("scanMdxText: draft posts still scanned but flagged", () => {
    const text = `---
title: "Hello"
draft: true
coverImage: "/images/posts/foo/cover.jpg"
coverNid: "bafkrei123"
---
ok
`;
    const r = scanMdxText(text, "foo");
    assertTrue(r.draft);
  });

  process.stdout.write(`\n${pass} passed, ${fail} failed\n`);
  return fail === 0;
}

async function runCli(argv) {
  const args = parseArgs(argv);
  if (args._error) { process.stderr.write(`error: ${args._error}\n${HELP}`); return 2; }
  if (args.help)   { process.stdout.write(HELP); return 0; }
  if (args.selfTest) return runSelfTest() ? 0 : 3;

  let scan;
  try {
    scan = scanPostsDir(args.postsDir);
  } catch (e) {
    process.stderr.write(`error: ${e.message}\n`);
    return 2;
  }

  if (args.json) {
    process.stdout.write(JSON.stringify(scan, null, 2) + "\n");
  } else {
    process.stdout.write(renderMarkdown(scan) + "\n");
  }

  if (args.strict) {
    const anyError = scan.reports.some((r) => !r.draft && !r.hardGatePass);
    if (anyError) return 1;
  }
  return 0;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  runCli(process.argv.slice(2)).then((c) => process.exit(c ?? 0));
}
