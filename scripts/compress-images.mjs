#!/usr/bin/env node
// Compress JPEG images in public/images/posts/ that exceed a size threshold.
// Uses sharp (already pulled in transitively by Astro for asset processing).
// Idempotent: skips files already under threshold.
//
// Usage: node scripts/compress-images.mjs [--dry-run]

import { readdir, stat, rename, unlink } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch (err) {
  console.error("Failed to import sharp:", err.message);
  console.error("Install with: npm install --save-dev sharp");
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const POSTS_DIR = resolve(ROOT, "public/images/posts");
const THRESHOLD_BYTES = 400 * 1024; // 400 KB
const TARGET_QUALITY = 78;
const MAX_WIDTH = 1600;
const DRY_RUN = process.argv.includes("--dry-run");

async function* walkJpegs(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkJpegs(full);
    } else if (entry.isFile() && /\.jpe?g$/i.test(entry.name)) {
      yield full;
    }
  }
}

async function compressOne(file) {
  const before = (await stat(file)).size;
  if (before < THRESHOLD_BYTES) {
    return { file, skipped: true, before };
  }

  const tmp = `${file}.compressing`;
  // Resize down to MAX_WIDTH if larger; re-encode JPEG with mozjpeg-ish quality.
  await sharp(file)
    .rotate() // honour EXIF orientation
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: TARGET_QUALITY, mozjpeg: true })
    .toFile(tmp);

  const after = (await stat(tmp)).size;
  if (after >= before) {
    // Compression didn't help; keep original.
    await unlink(tmp);
    return { file, skipped: true, before, reason: "compressed >= original" };
  }
  if (DRY_RUN) {
    await unlink(tmp);
    return { file, dryRun: true, before, after };
  }
  await rename(tmp, file);
  return { file, before, after };
}

async function main() {
  const targets = [];
  for await (const f of walkJpegs(POSTS_DIR)) {
    targets.push(f);
  }
  console.log(`Scanning ${targets.length} JPEGs in ${POSTS_DIR}`);
  console.log(`Threshold: ${(THRESHOLD_BYTES / 1024).toFixed(0)} KB`);
  console.log(`${DRY_RUN ? "(DRY RUN — no files will be modified)" : ""}\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  let touched = 0;
  for (const f of targets) {
    try {
      const r = await compressOne(f);
      const rel = f.replace(`${ROOT}/`, "");
      if (r.skipped) {
        // quiet for skips
      } else {
        const ratio = ((1 - r.after / r.before) * 100).toFixed(1);
        console.log(
          `  ${rel}  ${(r.before / 1024).toFixed(1)} KB → ${(r.after / 1024).toFixed(1)} KB (-${ratio}%)`,
        );
        totalBefore += r.before;
        totalAfter += r.after;
        touched++;
      }
    } catch (err) {
      console.error(`  FAIL ${f}: ${err.message}`);
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Compressed: ${touched} files`);
  if (touched > 0) {
    console.log(`Saved:      ${((totalBefore - totalAfter) / 1024).toFixed(1)} KB`);
    console.log(
      `Reduction:  ${((1 - totalAfter / totalBefore) * 100).toFixed(1)}% (${(totalBefore / 1024).toFixed(0)} → ${(totalAfter / 1024).toFixed(0)} KB)`,
    );
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
