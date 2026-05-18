// Extract Pillar section from the Google Doc text dump.
// Reads the JSON array file produced by docs_get_as_text overflow,
// concatenates `text` fields, then slices between [Pillar / 1 of 3] and the next ═══ separator.

import { readFileSync, writeFileSync } from "node:fs";

const INPUT = "/home/bafu/.claude/projects/-home-workspaces-conversations-dde81e9e-f3b7-488e-9b43-6d1beaef34ef/f5021c6f-f592-41a3-bcca-1b0650d32d5b/tool-results/mcp-gws-docs_get_as_text-1779103751500.txt";

const raw = readFileSync(INPUT, "utf-8");
const arr = JSON.parse(raw);
let combined = arr.map((c) => c.text).join("");

// Find the embedded "text" field in the second chunk's nested JSON wrap (```json\n{...}\n```).
// Pull it out.
const m = combined.match(/```json\s*({[\s\S]*?})\s*```/);
if (!m) {
  console.error("No json block found");
  process.exit(1);
}
const inner = JSON.parse(m[1]);
const docText = inner.text;

// Find Pillar section
const startMarker = "[Pillar / 1 of 3]";
const endMarker = "═══════════════════════════════════════════════════════════════";

const startIdx = docText.indexOf(startMarker);
if (startIdx < 0) { console.error("Pillar start marker not found"); process.exit(1); }
// Find the next ═══ separator AFTER the Pillar start (the one between Pillar and A2)
const endIdx = docText.indexOf(endMarker, startIdx + startMarker.length);
if (endIdx < 0) { console.error("Pillar end marker not found"); process.exit(1); }

const pillarChunk = docText.substring(startIdx + startMarker.length, endIdx).trim();

// Output
const outPath = "/tmp/pillar-extracted.txt";
writeFileSync(outPath, pillarChunk);
console.error(`Extracted ${pillarChunk.length} chars from Pillar. Saved: ${outPath}`);
console.error(`First 200 chars:\n${pillarChunk.substring(0, 200)}`);
console.error(`\nLast 200 chars:\n${pillarChunk.substring(pillarChunk.length - 200)}`);
