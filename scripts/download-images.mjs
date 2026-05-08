#!/usr/bin/env node
// Download all referenced Supabase Storage images into public/images/posts/{slug}/
// Reads scripts/supabase-images.json (manifest produced from live blog_posts).
// Usage: node scripts/download-images.mjs

import { readFile, mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MANIFEST_PATH = resolve(__dirname, "supabase-images.json");
const CONCURRENCY = 5;
const MAX_RETRY = 3;

/** @typedef {{ sourceUrl: string, targetPath: string, kind: "cover"|"capture", postSlug: string, nid?: string }} ImageJob */

async function loadJobs() {
  /** @type {Array<{slug:string, cover:{sourceUrl:string,targetPath:string}, captures:Array<{sourceUrl:string,targetPath:string,nid:string}>}>} */
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  /** @type {ImageJob[]} */
  const jobs = [];
  for (const post of manifest) {
    if (post.cover?.sourceUrl) {
      jobs.push({
        sourceUrl: post.cover.sourceUrl,
        targetPath: resolve(ROOT, post.cover.targetPath),
        kind: "cover",
        postSlug: post.slug,
      });
    }
    for (const cap of post.captures ?? []) {
      jobs.push({
        sourceUrl: cap.sourceUrl,
        targetPath: resolve(ROOT, cap.targetPath),
        kind: "capture",
        postSlug: post.slug,
        nid: cap.nid,
      });
    }
  }
  return jobs;
}

async function fileExistsNonEmpty(path) {
  try {
    const s = await stat(path);
    return s.isFile() && s.size > 0;
  } catch {
    return false;
  }
}

async function downloadOne(job, index, total) {
  const label = `[${String(index + 1).padStart(2, "0")}/${total}] ${job.postSlug}/${job.kind}`;
  if (await fileExistsNonEmpty(job.targetPath)) {
    console.log(`${label} → SKIP (already exists)`);
    return { ok: true, skipped: true };
  }
  await mkdir(dirname(job.targetPath), { recursive: true });

  let lastErr = null;
  for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
    try {
      const res = await fetch(job.sourceUrl, {
        headers: { "User-Agent": "sofia-blog-migration/1.0" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length === 0) throw new Error("Empty response");
      await writeFile(job.targetPath, buf);
      console.log(`${label} → OK (${(buf.length / 1024).toFixed(1)} KB)`);
      return { ok: true, bytes: buf.length };
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_RETRY) {
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }
  }
  console.error(`${label} → FAIL (${lastErr?.message ?? "unknown"})`);
  return { ok: false, error: lastErr?.message ?? "unknown" };
}

async function runWithConcurrency(jobs, limit) {
  const results = new Array(jobs.length);
  let cursor = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= jobs.length) break;
      results[i] = await downloadOne(jobs[i], i, jobs.length);
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  const jobs = await loadJobs();
  console.log(`Total: ${jobs.length} images to download.`);
  const start = Date.now();
  const results = await runWithConcurrency(jobs, CONCURRENCY);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  const ok = results.filter((r) => r?.ok).length;
  const skipped = results.filter((r) => r?.skipped).length;
  const failed = results.filter((r) => !r?.ok).length;
  const totalBytes = results.reduce((sum, r) => sum + (r?.bytes ?? 0), 0);

  console.log("\n=== Summary ===");
  console.log(`OK:     ${ok}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${(totalBytes / 1024 / 1024).toFixed(2)} MB downloaded`);
  console.log(`Time:   ${elapsed}s`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
