// Sync Sofia's edited Pillar from Google Doc back to MDX.
// Preserves frontmatter (except title/excerpt which it updates) + FAQPage JSON-LD (regenerated from body FAQ).

import { readFileSync, writeFileSync } from "node:fs";

const DOC_EXTRACTED = "/tmp/pillar-extracted.txt";
const MDX_PATH = "/home/workspaces/conversations/dde81e9e-f3b7-488e-9b43-6d1beaef34ef/sofia-s-blog/src/content/posts/humanities-ai-expert.mdx";

const docText = readFileSync(DOC_EXTRACTED, "utf-8");
const oldMdx = readFileSync(MDX_PATH, "utf-8");

// Parse Doc:
// Line 1: # title
// Line 3: excerpt：...
// Then `---` separator
// Then body until `Hashtags:` line
const docLines = docText.split("\n");
const titleLine = docLines.find((l) => l.startsWith("# "));
if (!titleLine) throw new Error("No title found in doc");
const newTitle = titleLine.slice(2).trim();

const excerptLine = docLines.find((l) => l.startsWith("excerpt："));
if (!excerptLine) throw new Error("No excerpt found in doc");
const newExcerpt = excerptLine.slice("excerpt：".length).trim();

// Find body start — after first `---` separator that follows excerpt
const excerptIdx = docLines.indexOf(excerptLine);
let dashIdx = -1;
for (let i = excerptIdx + 1; i < docLines.length; i++) {
  if (docLines[i].trim() === "---") { dashIdx = i; break; }
}
if (dashIdx < 0) throw new Error("No body separator found");

// Find Hashtags: line — end of body
let hashtagsIdx = docLines.findIndex((l) => l.startsWith("Hashtags:"));
if (hashtagsIdx < 0) hashtagsIdx = docLines.length;

const bodyLines = docLines.slice(dashIdx + 1, hashtagsIdx);
let bodyText = bodyLines.join("\n").trim();

// Fix the one broken markdown link Sofia wrote
bodyText = bodyText.replace(
  "[Numbers Protocol(https://www.numbersprotocol.io) & Omni(https://omniai.one/)]",
  "[Numbers Protocol](https://www.numbersprotocol.io) & [Omni](https://omniai.one/)"
);

// Extract hashtags
const hashtagLine = (docLines[hashtagsIdx] || "").replace(/^Hashtags:\s*/, "").trim();

// Extract original MDX frontmatter + trailing JSON-LD script + closing hashtags fragment
// Frontmatter is between the first two `---` lines
const fmMatch = oldMdx.match(/^---\n([\s\S]*?)\n---\n/);
if (!fmMatch) throw new Error("No frontmatter in old MDX");
const oldFmBody = fmMatch[1];

// Build new frontmatter — replace title and excerpt, keep other fields
const fmLines = oldFmBody.split("\n");
const newFmLines = fmLines.map((line) => {
  if (line.startsWith("title:")) return `title: ${JSON.stringify(newTitle)}`;
  if (line.startsWith("excerpt:")) return `excerpt: ${JSON.stringify(newExcerpt)}`;
  return line;
});
const newFm = `---\n${newFmLines.join("\n")}\n---`;

// Now parse new body FAQ to regenerate JSON-LD FAQ
// FAQ section starts at `## 常見問題` and contains pairs of **Q: ...** / A: ...
const faqStartIdx = bodyText.indexOf("## 常見問題");
let faqEntries = [];
if (faqStartIdx >= 0) {
  const faqSection = bodyText.slice(faqStartIdx);
  // Match **Q: ...** lines
  const qaMatches = [...faqSection.matchAll(/\*\*Q:\s*([^*\n]+?)\*\*\s*\n+A:\s*([\s\S]*?)(?=\n+\*\*Q:|\n+<script|$)/g)];
  faqEntries = qaMatches.map((m) => ({
    name: m[1].trim(),
    text: m[2].trim().replace(/\*\*/g, "").replace(/`/g, ""),
  }));
}

// Build JSON-LD FAQPage
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqEntries.map((e) => ({
    "@type": "Question",
    name: e.name,
    acceptedAnswer: { "@type": "Answer", text: e.text },
  })),
};

const scriptBlock = `<script type="application/ld+json" set:html={JSON.stringify(${JSON.stringify(faqSchema, null, 2)})} />`;

// Final assembly
const finalMdx = `${newFm}

${bodyText}

${scriptBlock}

---

${hashtagLine}
`;

writeFileSync(MDX_PATH, finalMdx);

console.error(`Wrote new MDX: ${MDX_PATH}`);
console.error(`  Title: ${newTitle}`);
console.error(`  Excerpt: ${newExcerpt.slice(0, 60)}...`);
console.error(`  Body length: ${bodyText.length} chars`);
console.error(`  FAQ entries: ${faqEntries.length}`);
console.error(`  Hashtags: ${hashtagLine}`);
