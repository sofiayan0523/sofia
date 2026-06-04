#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const SITE_ORIGIN = "https://sofiayan.cc";
const allowedSchemes = /^(mailto|tel|javascript|data):/i;

function walk(dir, predicate, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, acc);
    else if (predicate(full)) acc.push(full);
  }
  return acc;
}

function extractLinks(html) {
  const links = [];
  const tagPattern = /<(a|img|script|source|video|audio)\b[^>]*(?:href|src)=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = tagPattern.exec(html))) {
    links.push({ tag: match[1].toLowerCase(), url: match[2] });
  }
  return links;
}

function normalizeInternalUrl(rawUrl) {
  if (!rawUrl || rawUrl.startsWith("#") || allowedSchemes.test(rawUrl)) return null;
  if (/^https?:\/\//i.test(rawUrl)) {
    let parsed;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return null;
    }
    if (parsed.origin !== SITE_ORIGIN) return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  }
  if (rawUrl.startsWith("//")) return null;
  return rawUrl;
}

function candidateFiles(internalUrl) {
  const parsed = new URL(internalUrl, SITE_ORIGIN);
  let pathname = decodeURIComponent(parsed.pathname);
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  const clean = pathname.replace(/^\/+/, "");

  if (pathname === "/") return [path.join(DIST, "index.html")];
  if (path.extname(clean)) return [path.join(DIST, clean)];

  return [
    path.join(DIST, clean),
    path.join(DIST, `${clean}.html`),
    path.join(DIST, clean, "index.html"),
  ];
}

function existsInDist(internalUrl) {
  return candidateFiles(internalUrl).some((candidate) => existsSync(candidate));
}

if (!existsSync(DIST)) {
  console.error("dist/ not found. Run `npm run build` before `node scripts/check-links.mjs`.");
  process.exit(1);
}

const htmlFiles = walk(DIST, (file) => file.endsWith(".html"));
const failures = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const link of extractLinks(html)) {
    const internalUrl = normalizeInternalUrl(link.url);
    if (!internalUrl) continue;
    if (!existsInDist(internalUrl)) {
      failures.push({
        file: path.relative(DIST, file),
        tag: link.tag,
        url: link.url,
      });
    }
  }
}

if (failures.length) {
  console.error(`Found ${failures.length} broken internal link(s):`);
  for (const failure of failures) {
    console.error(`- ${failure.file}: <${failure.tag}> ${failure.url}`);
  }
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML files. No broken internal links found.`);
