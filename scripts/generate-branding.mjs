#!/usr/bin/env node
// Generate brand assets:
//   - favicon.svg                    : Vector "S" mark, dark rounded square
//   - favicon-32.png / 192.png       : Raster fallbacks
//   - apple-touch-icon.png (180×180) : iOS home screen
//   - og-image.png (1200×630)        : Open Graph / Twitter card preview
//
// Usage: node scripts/generate-branding.mjs

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PROFILE = resolve(ROOT, "public/images/profile/sofia.png");
const PUBLIC = resolve(ROOT, "public");

// ---- Favicon SVG (pure vector, no font dependency) ----
const FAVICON_SVG = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="14" fill="#0a0a0a"/>
  <path d="M44 20 C44 14, 39 12, 32 12 C25 12, 20 16, 20 22 C20 28, 25 30, 32 32 C39 34, 44 36, 44 42 C44 48, 39 52, 32 52 C25 52, 20 50, 20 46"
    stroke="#ffffff" stroke-width="6" fill="none" stroke-linecap="round"/>
</svg>`;

// ---- Helper: profile photo cropped to circle ----
async function makeCircularProfile(size) {
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
    </svg>`,
  );
  return sharp(PROFILE)
    .resize(size, size, { fit: "cover", position: "top" })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function main() {
  await mkdir(PUBLIC, { recursive: true });

  // 1. favicon.svg
  await writeFile(resolve(PUBLIC, "favicon.svg"), FAVICON_SVG, "utf8");
  console.log("✓ favicon.svg");

  // 2. favicon-32.png + favicon-192.png from SVG
  for (const size of [32, 192]) {
    const buf = await sharp(Buffer.from(FAVICON_SVG))
      .resize(size, size)
      .png()
      .toBuffer();
    await writeFile(resolve(PUBLIC, `favicon-${size}.png`), buf);
    console.log(`✓ favicon-${size}.png (${(buf.length / 1024).toFixed(1)} KB)`);
  }

  // 3. apple-touch-icon.png (180×180) — iOS strips alpha so use solid bg
  const apple = await sharp(Buffer.from(FAVICON_SVG)).resize(180, 180).png().toBuffer();
  await writeFile(resolve(PUBLIC, "apple-touch-icon.png"), apple);
  console.log(`✓ apple-touch-icon.png (${(apple.length / 1024).toFixed(1)} KB)`);

  // 4. og-image.png (1200×630)
  // Layout: white bg, circular profile photo on left, name + tagline on right
  const W = 1200;
  const H = 630;
  const PHOTO = 380;
  const PHOTO_X = 90;
  const PHOTO_Y = (H - PHOTO) / 2;

  const photoBuf = await makeCircularProfile(PHOTO);

  // Use SVG to compose right-side text. Use generic system font stacks.
  // librsvg may fall back to whatever font is available, but the visual
  // outcome remains a readable, professional layout.
  const overlay = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fafafa"/>
          <stop offset="100%" stop-color="#f0f0f0"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <!-- subtle accent bar -->
      <rect x="0" y="${H - 6}" width="${W}" height="6" fill="#0a0a0a"/>
      <!-- Right side text -->
      <g font-family="Helvetica, Arial, system-ui, sans-serif" fill="#0a0a0a">
        <text x="540" y="240" font-size="84" font-weight="700">Sofia Yan</text>
        <text x="540" y="305" font-size="32" font-weight="400" fill="#525252">
          Co-founder · Strategist · Writer
        </text>
        <text x="540" y="350" font-size="32" font-weight="400" fill="#525252">
          Solo Traveler
        </text>
        <text x="540" y="450" font-size="22" font-weight="400" fill="#737373">
          Tech &amp; Travel · 50+ cities · Bouldering · AI tools
        </text>
        <text x="540" y="540" font-size="22" font-weight="500" fill="#0a0a0a">
          sofiayan.cc
        </text>
      </g>
    </svg>`,
  );

  const og = await sharp(overlay)
    .composite([{ input: photoBuf, top: Math.round(PHOTO_Y), left: PHOTO_X }])
    .png()
    .toBuffer();
  await writeFile(resolve(PUBLIC, "og-image.png"), og);
  console.log(`✓ og-image.png (${(og.length / 1024).toFixed(1)} KB, ${W}×${H})`);

  // Also export JPG for smaller size — many social platforms prefer it.
  const ogJpg = await sharp(og).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  await writeFile(resolve(PUBLIC, "og-image.jpg"), ogJpg);
  console.log(`✓ og-image.jpg (${(ogJpg.length / 1024).toFixed(1)} KB)`);

  console.log("\n=== Done ===");
  console.log("Updated brand assets in public/");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
