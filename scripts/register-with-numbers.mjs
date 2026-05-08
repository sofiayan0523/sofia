#!/usr/bin/env node
// Register an image with Numbers Protocol Mainnet via the Capture asset API.
// Reads CAPTURE_TOKEN from .env (or process.env). Prints the resulting NID
// (asset id) on success. Designed to be called once per image during a
// blog-import workflow.
//
// Usage:
//   node scripts/register-with-numbers.mjs <local-file-path>
//   node scripts/register-with-numbers.mjs path/to/img.jpg
//
// Output (JSON to stdout, logs to stderr):
//   { "nid": "bafkrei...", "url": "https://...", "fileName": "img.jpg" }
//
// Env vars:
//   CAPTURE_TOKEN  required — Numbers Protocol API key
//                  https://nit.numbersprotocol.io/ → developer settings
//
// Optional flags:
//   --caption "<text>"   Caption stored in the asset profile
//   --headline "<text>"  Headline stored in the asset profile
//   --quiet              Print only the JSON result, no logs

import { readFile, stat } from "node:fs/promises";
import { resolve, basename, extname } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ENV_PATH = resolve(ROOT, ".env");
const NUMBERS_API = "https://api.numbersprotocol.io/api/v3/assets/";

// ---------- env loader (no extra dep) ----------
async function loadEnvFile(path) {
  try {
    const raw = await readFile(path, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  } catch {
    // .env missing is fine if env was set via shell
  }
}

// ---------- mime type guess ----------
const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".heic": "image/heic",
  ".heif": "image/heif",
  ".avif": "image/avif",
};
function guessMime(filePath) {
  const ext = extname(filePath).toLowerCase();
  return MIME_BY_EXT[ext] ?? "application/octet-stream";
}

// ---------- argv parser ----------
function parseArgs(argv) {
  const args = { positional: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (key === "quiet") {
        args.flags[key] = true;
      } else if (next && !next.startsWith("--")) {
        args.flags[key] = next;
        i++;
      } else {
        args.flags[key] = true;
      }
    } else {
      args.positional.push(a);
    }
  }
  return args;
}

async function main() {
  await loadEnvFile(ENV_PATH);

  const args = parseArgs(process.argv.slice(2));
  const filePath = args.positional[0];
  const quiet = !!args.flags.quiet;
  const log = (...m) => quiet || console.error(...m);

  if (!filePath) {
    console.error("Usage: register-with-numbers.mjs <file> [--caption ...] [--headline ...] [--quiet]");
    process.exit(2);
  }

  const TOKEN = process.env.CAPTURE_TOKEN;
  if (!TOKEN) {
    console.error(
      "ERROR: CAPTURE_TOKEN missing. Add it to .env:\n  CAPTURE_TOKEN=your_numbers_api_key",
    );
    process.exit(1);
  }

  const abs = resolve(filePath);
  const info = await stat(abs);
  if (!info.isFile()) {
    console.error(`ERROR: not a file: ${abs}`);
    process.exit(1);
  }

  const mime = guessMime(abs);
  const fileName = basename(abs);
  log(`→ Registering ${fileName} (${(info.size / 1024).toFixed(1)} KB, ${mime})`);

  const buffer = await readFile(abs);
  const proofHash = createHash("sha256").update(buffer).digest("hex");
  log(`→ SHA-256: ${proofHash.slice(0, 16)}…`);

  const integrityProof = {
    proof_hash: proofHash,
    asset_mime_type: mime,
    created_at: Date.now(),
  };

  const form = new FormData();
  form.append("asset_file", new Blob([buffer], { type: mime }), fileName);
  form.append("signed_metadata", JSON.stringify(integrityProof));
  if (args.flags.caption) form.append("caption", args.flags.caption);
  if (args.flags.headline) form.append("headline", args.flags.headline);

  log(`→ POST ${NUMBERS_API}`);
  let res;
  try {
    res = await fetch(NUMBERS_API, {
      method: "POST",
      headers: { Authorization: `token ${TOKEN}` },
      body: form,
    });
  } catch (err) {
    console.error(`ERROR: network failure: ${err.message}`);
    process.exit(1);
  }

  if (!res.ok) {
    const text = await res.text();
    console.error(`ERROR: Numbers API responded ${res.status}\n${text.slice(0, 500)}`);
    process.exit(1);
  }

  const data = await res.json();
  const nid = data.id ?? data.cid ?? data.nid;
  if (!nid) {
    console.error("ERROR: response missing NID. Full response:", JSON.stringify(data));
    process.exit(1);
  }

  log(`✓ NID: ${nid}`);

  // Output machine-readable JSON to stdout (always)
  process.stdout.write(
    JSON.stringify(
      {
        nid,
        url: data.asset_file ?? data.cidv1 ? `https://ipfs-pin.numbersprotocol.io/ipfs/${nid}` : null,
        fileName,
        proofHash,
        mimeType: mime,
      },
      null,
      2,
    ) + "\n",
  );
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
