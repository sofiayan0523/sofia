#!/usr/bin/env node
// Generate a personalised QR code for the blog with the profile photo
// embedded in the centre. Outputs both SVG (vector) and PNG (raster).
//
// Usage: node scripts/generate-qrcode.mjs

import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const URL = "https://sofiayan.cc/";
const OUT_DIR = resolve(ROOT, "public/images/qrcode");
const PROFILE_PATH = resolve(ROOT, "public/images/profile/sofia.png");

// Visual config
const SIZE = 1024; // PNG output px
const MARGIN = 2; // QR quiet zone in modules
const FG = "#0a0a0a"; // near-black, matches dark foreground
const BG = "#ffffff"; // white background
const LOGO_RATIO = 0.22; // logo fills 22% of QR width (safe under 25% threshold)
const LOGO_PADDING = 12; // px of white padding around the circular logo

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  // ----- 1. Generate base SVG -----
  const svg = await QRCode.toString(URL, {
    errorCorrectionLevel: "H", // 30% — needed for logo overlay
    type: "svg",
    margin: MARGIN,
    color: { dark: FG, light: BG },
    width: SIZE,
  });
  await writeFile(resolve(OUT_DIR, "qrcode.svg"), svg, "utf8");
  console.log(`✓ wrote qrcode.svg (${svg.length} bytes, plain)`);

  // ----- 2. Generate base PNG -----
  const pngBufferPlain = await QRCode.toBuffer(URL, {
    errorCorrectionLevel: "H",
    margin: MARGIN,
    color: { dark: FG, light: BG },
    width: SIZE,
    type: "png",
  });
  await writeFile(resolve(OUT_DIR, "qrcode-plain.png"), pngBufferPlain);
  console.log(`✓ wrote qrcode-plain.png (${(pngBufferPlain.length / 1024).toFixed(1)} KB)`);

  // ----- 3. Generate branded PNG with profile photo in centre -----
  const logoSize = Math.round(SIZE * LOGO_RATIO);

  // Build a circular logo buffer
  const circleMask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${logoSize}" height="${logoSize}"><circle cx="${logoSize / 2}" cy="${logoSize / 2}" r="${logoSize / 2}" fill="white"/></svg>`,
  );
  const logoBuffer = await sharp(PROFILE_PATH)
    .resize(logoSize, logoSize, { fit: "cover", position: "top" })
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  // White padded background behind the logo (square with rounded corners)
  const padSize = logoSize + LOGO_PADDING * 2;
  const padRadius = padSize / 2;
  const pad = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${padSize}" height="${padSize}"><circle cx="${padSize / 2}" cy="${padSize / 2}" r="${padRadius}" fill="${BG}"/></svg>`,
  );
  const padBuffer = await sharp(pad).png().toBuffer();

  const center = Math.round((SIZE - logoSize) / 2);
  const padCenter = Math.round((SIZE - padSize) / 2);

  const branded = await sharp(pngBufferPlain)
    .composite([
      { input: padBuffer, top: padCenter, left: padCenter },
      { input: logoBuffer, top: center, left: center },
    ])
    .png()
    .toBuffer();

  await writeFile(resolve(OUT_DIR, "qrcode-branded.png"), branded);
  console.log(`✓ wrote qrcode-branded.png (${(branded.length / 1024).toFixed(1)} KB)`);

  // ----- 4. Print summary -----
  console.log("\n=== Done ===");
  console.log(`URL encoded: ${URL}`);
  console.log(`Output directory: ${OUT_DIR.replace(ROOT + "/", "")}`);
  console.log("Files:");
  console.log("  - qrcode.svg              (vector, plain)");
  console.log("  - qrcode-plain.png        (raster, plain)");
  console.log("  - qrcode-branded.png      (raster, with circular profile photo logo)");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
