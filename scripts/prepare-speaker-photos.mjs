#!/usr/bin/env node
// One-off: resize/compress uploaded speaking photos into public/images/speaker/.
// Max width 1600, JPEG quality 80, strip metadata (EXIF contains camera info).
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const UPLOADS = resolve(ROOT, "../.omni/uploads");
const OUT = resolve(ROOT, "public/images/speaker");

const JOBS = [
  ["2.jpg", "startup-taipei-panel.jpg"],
  ["5.jpg", "code-with-vibe-talk.jpg"],
  ["0730190758.jpg", "community-night-talk.jpg"],
  ["119449269_10157667554286009_8156342798344774867_n.jpg", "digitimes-stage.jpg"],
];

await mkdir(OUT, { recursive: true });
for (const [src, dst] of JOBS) {
  const input = resolve(UPLOADS, src);
  const output = resolve(OUT, dst);
  const info = await sharp(input)
    .rotate() // apply EXIF orientation before stripping metadata
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(output);
  console.log(`${src} -> images/speaker/${dst} (${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB)`);
}
