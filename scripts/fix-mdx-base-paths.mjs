// Rewrite all "/sofia/..." hardcoded paths in MDX content to "/..."
// (after base switch from /sofia to /)
// Usage: node scripts/fix-mdx-base-paths.mjs

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = resolve(__dirname, "../src/content/posts");

const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
let totalReplacements = 0;
let filesChanged = 0;

for (const f of files) {
  const path = join(POSTS_DIR, f);
  const before = readFileSync(path, "utf8");
  // Replace "/sofia/..." with "/..." in any quoted attribute, plus coverImage frontmatter
  let after = before
    .replace(/"\/sofia\//g, '"/')      // attribute strings: src="/sofia/..."
    .replace(/=`\/sofia\//g, "=`/")    // template literals
    .replace(/\]\(\/sofia\//g, "](/"); // markdown links: [text](/sofia/...)
  const count =
    (before.match(/"\/sofia\//g) || []).length +
    (before.match(/=`\/sofia\//g) || []).length +
    (before.match(/\]\(\/sofia\//g) || []).length;
  if (count > 0) {
    writeFileSync(path, after);
    totalReplacements += count;
    filesChanged++;
    console.error(`[fix-mdx] ${f}: ${count} replacements`);
  }
}

console.error(`\n[fix-mdx] DONE. ${filesChanged} files changed, ${totalReplacements} total replacements.`);
process.exit(0);
