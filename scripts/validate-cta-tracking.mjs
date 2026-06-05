#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const cwd = process.cwd();
const checks = [];

function read(relativePath) {
  return readFileSync(resolve(cwd, relativePath), "utf-8");
}

function check(label, fn) {
  try {
    const detail = fn();
    checks.push({ label, ok: true, detail });
  } catch (error) {
    checks.push({ label, ok: false, detail: error.message });
  }
}

function countMatches(raw, pattern) {
  return [...raw.matchAll(pattern)].length;
}

function expectIncludes(raw, values) {
  for (const value of values) {
    if (!raw.includes(value)) throw new Error(`missing ${value}`);
  }
}

check("BaseLayout dispatches CTA analytics events", () => {
  const raw = read("src/layouts/BaseLayout.astro");
  expectIncludes(raw, [
    "data-analytics-event",
    "window.gtag",
    "window.zaraz.track",
    "sofia:cta-click",
    "data-cta-location",
    "data-cta-destination",
    "data-cta-content",
  ]);
  return "GA4, Zaraz, and custom event dispatcher present";
});

check("Speaker enquiry CTAs carry event metadata", () => {
  const raw = read("src/pages/speaker.astro");
  const emailEvents = countMatches(raw, /data-analytics-event="speaker_enquiry_email_click"/g);
  if (emailEvents < 3) throw new Error(`expected at least 3 email CTAs, found ${emailEvents}`);
  expectIncludes(raw, [
    'data-analytics-event="speaker_enquiry_linkedin_click"',
    'data-cta-location="speaker-hero"',
    'data-cta-location="speaker-fit"',
    'data-cta-location="speaker-contact"',
    'data-cta-destination="email"',
    'data-cta-destination="linkedin"',
  ]);
  return `${emailEvents} email CTAs plus LinkedIn CTA tracked`;
});

check("AI methodology Numbers / Omni CTA has UTM and event metadata", () => {
  const raw = read("src/pages/ai-coworker-methodology.astro");
  expectIncludes(raw, [
    'data-analytics-event="numbers_omni_outbound_click"',
    'data-cta-location="ai-coworker-methodology-next-steps"',
    'data-cta-destination="numbers-protocol"',
    "utm_source=sofia-blog",
    "utm_medium=blog-internal",
    "utm_campaign=numbers-omni-demo",
    "utm_content=ai-coworker-methodology-cta-omni",
  ]);
  return "Numbers / Omni CTA is measurable and uses current UTM convention";
});

check("Share buttons carry article share event metadata", () => {
  const raw = read("src/components/ShareButtons.astro");
  const shareEvents = countMatches(raw, /data-analytics-event="article_share_click"/g);
  if (shareEvents !== 5) throw new Error(`expected 5 share controls, found ${shareEvents}`);
  for (const destination of ["x", "facebook", "linkedin", "line", "clipboard"]) {
    if (!raw.includes(`data-cta-destination="${destination}"`)) {
      throw new Error(`missing share destination: ${destination}`);
    }
  }
  return "5 share controls tracked";
});

check("UTM convention documents implemented events and live examples", () => {
  const raw = read("docs/utm-convention.md");
  expectIncludes(raw, [
    "speaker_enquiry_email_click",
    "speaker_enquiry_linkedin_click",
    "numbers_omni_outbound_click",
    "article_share_click",
    "https://sofiayan.cc/blog/humanities-ai-expert/",
    "https://numbersprotocol.io/?utm_source=sofia-blog",
  ]);
  for (const stale of [
    "sofiayan0523.github.io/sofia",
    "sofiayan.com",
    "numbersprotocol.io/products/omni",
    "numbersprotocol.io/omni-waitlist",
  ]) {
    if (raw.includes(stale)) throw new Error(`stale or broken example remains: ${stale}`);
  }
  return "documented events match implemented CTA tracking";
});

let allOk = true;
console.log("\n=== CTA Tracking Validation ===\n");
for (const result of checks) {
  const icon = result.ok ? "✅" : "❌";
  console.log(`${icon}  ${result.label}: ${result.detail}`);
  if (!result.ok) allOk = false;
}
console.log("");
process.exit(allOk ? 0 : 1);
