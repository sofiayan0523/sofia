#!/usr/bin/env node
/**
 * utm-builder.mjs — Construct UTM-tagged URLs that comply with
 * `sofia/docs/utm-convention.md` and `.omni/harness/plans.md` §4.3.
 *
 * Hard rules (refuses to build a URL that violates any of these):
 *   - utm_source is ALWAYS `sofia-blog` (cannot be overridden)
 *   - utm_medium MUST be in REGISTERED_MEDIUMS (or match `podcast-*`)
 *     and MUST NOT be in PENDING_MEDIUMS until utm-convention is updated.
 *   - All four UTM values are lowercase, hyphen-separated, no
 *     underscore, no whitespace, no uppercase.
 *
 * Usage:
 *   CLI single URL:
 *     node scripts/utm-builder.mjs \
 *       --url https://sofiayan.cc/blog/{slug}/ \
 *       --medium linkedin-lf \
 *       --campaign pillar-zero-to-ai-native \
 *       --content 2026-06-14-zero-to-ai-native-d0-main
 *
 *   CLI 5-channel social bundle for an article:
 *     node scripts/utm-builder.mjs \
 *       --bundle \
 *       --slug zero-to-ai-native \
 *       --date 2026-06-14 \
 *       --campaign pillar-zero-to-ai-native
 *
 *   Self-test:
 *     node scripts/utm-builder.mjs --self-test
 *
 *   Programmatic:
 *     import { buildUtmUrl, buildArticleSocialUtms } from "./utm-builder.mjs";
 *
 * Exit codes:
 *   0 — success
 *   1 — validation error (invalid medium / campaign / content / source override)
 *   2 — usage error (missing required flag, unknown flag)
 *   3 — self-test failure
 */

// ----- Canonical constants (single source of truth) --------------------

export const FIXED_UTM_SOURCE = "sofia-blog";

export const CANONICAL_HOST = "https://sofiayan.cc";

/**
 * Mediums currently registered in `docs/utm-convention.md`.
 * `podcast-{show}` is a parametrized family — any value matching
 * /^podcast-[a-z0-9-]+$/ is accepted.
 */
export const REGISTERED_MEDIUMS = new Set([
  "blog-internal",
  "linkedin-lf",
  "linkedin-commentary",
  "x",
  "fb-personal",
  "speaker-page",
  "email-sig",
  "yt-keke",
  "cold-email",
  "medium",
]);

/**
 * Mediums that plans.md §4.3 explicitly flags as PENDING — they appear
 * in promotion plans but are not yet registered in utm-convention.md.
 * The builder refuses these until the convention is updated.
 */
export const PENDING_MEDIUMS = new Set([
  "threads",
  "line",
  "z-app",
]);

/**
 * Campaigns currently registered in `docs/utm-convention.md`.
 * `pillar-{slug}` and topic slugs are parametrized — any value matching
 * /^[a-z0-9-]+$/ is accepted, but a warning is emitted for unfamiliar values.
 */
export const REGISTERED_CAMPAIGNS = new Set([
  "phase1",
  "phase2",
  "phase3",
  "speaker-q2-2026",
  "numbers-omni-demo",
  "capture-app",
]);

/**
 * D0-D7 social bundle channel definitions, aligned with
 * `blog-publishing-workflow.md` §6.5 and `plans.md` §4.1.
 * Channels using PENDING_MEDIUMS are emitted with a `pending: true` flag
 * so the caller (gen-social-drafts.mjs) can render them as raw canonical
 * URLs without UTM and surface the unblock requirement to Sofia.
 */
export const SOCIAL_CHANNELS = [
  { key: "d0-main",  day: 0, medium: "linkedin-lf",   description: "LinkedIn main post" },
  { key: "d1-x",     day: 1, medium: "x",             description: "X / Twitter" },
  { key: "d3-story", day: 3, medium: "fb-personal",   description: "Threads / Facebook (cross-posted via Sofia's FB)" },
  { key: "d5-why",   day: 5, medium: "linkedin-lf",   description: "LinkedIn follow-up" },
  // D7 is a Z App internal recap — no public UTM needed per utm-convention.
  { key: "d7-recap", day: 7, medium: null,            description: "Z App internal recap (no public UTM)" },
];

// ----- Validation primitives ------------------------------------------

const HYPHEN_LOWER_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PODCAST_MEDIUM_RE = /^podcast-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * @returns {string|null} error string if invalid, null if ok
 */
function validateFormat(value, fieldName) {
  if (typeof value !== "string" || value.length === 0) {
    return `${fieldName} must be a non-empty string`;
  }
  if (value !== value.toLowerCase()) {
    return `${fieldName} must be lowercase: got "${value}"`;
  }
  if (value.includes("_")) {
    return `${fieldName} must use hyphens not underscores: got "${value}"`;
  }
  if (/\s/.test(value)) {
    return `${fieldName} must not contain whitespace: got "${value}"`;
  }
  if (!HYPHEN_LOWER_RE.test(value)) {
    return `${fieldName} must match [a-z0-9-]+ with no leading/trailing/double hyphens: got "${value}"`;
  }
  return null;
}

export function validateMedium(medium) {
  const fmt = validateFormat(medium, "utm_medium");
  if (fmt) return fmt;
  if (PENDING_MEDIUMS.has(medium)) {
    return (
      `utm_medium "${medium}" is PENDING per plans.md §4.3 — ` +
      `update sofia/docs/utm-convention.md and add it to REGISTERED_MEDIUMS first`
    );
  }
  if (REGISTERED_MEDIUMS.has(medium)) return null;
  if (PODCAST_MEDIUM_RE.test(medium)) return null;
  return (
    `utm_medium "${medium}" is not registered. ` +
    `Allowed: ${Array.from(REGISTERED_MEDIUMS).sort().join(", ")} ` +
    `or podcast-{show}. Register it in sofia/docs/utm-convention.md first.`
  );
}

export function validateCampaign(campaign) {
  const fmt = validateFormat(campaign, "utm_campaign");
  if (fmt) return fmt;
  // Campaign is intentionally permissive — pillar-{slug} and topic-slugs
  // are infinite. We only block format violations.
  return null;
}

export function validateContent(content) {
  return validateFormat(content, "utm_content");
}

// ----- Public API: build one URL --------------------------------------

/**
 * Build a UTM-tagged URL.
 * @param {object} args
 * @param {string} args.url      Base URL (any sofiayan.cc or external)
 * @param {string} args.medium   Must be in REGISTERED_MEDIUMS or podcast-*
 * @param {string} args.campaign Format-validated; permissive
 * @param {string} args.content  Lowercase slug or date-slug-channel
 * @returns {{ok: true, url: string} | {ok: false, error: string}}
 */
export function buildUtmUrl({ url, medium, campaign, content }) {
  if (typeof url !== "string" || url.length === 0) {
    return { ok: false, error: "url must be a non-empty string" };
  }
  let parsed;
  try {
    parsed = new URL(url);
  } catch (e) {
    return { ok: false, error: `url is not a valid URL: ${e.message}` };
  }

  const mErr = validateMedium(medium);
  if (mErr) return { ok: false, error: mErr };
  const cErr = validateCampaign(campaign);
  if (cErr) return { ok: false, error: cErr };
  const tErr = validateContent(content);
  if (tErr) return { ok: false, error: tErr };

  // Hard rule: source ALWAYS sofia-blog, even if caller tries to override.
  parsed.searchParams.set("utm_source", FIXED_UTM_SOURCE);
  parsed.searchParams.set("utm_medium", medium);
  parsed.searchParams.set("utm_campaign", campaign);
  parsed.searchParams.set("utm_content", content);

  return { ok: true, url: parsed.toString() };
}

/**
 * Canonical sofiayan.cc URL for an article slug.
 * @param {string} slug
 * @returns {string}
 */
export function articleCanonicalUrl(slug) {
  const e = validateFormat(slug, "slug");
  if (e) throw new Error(e);
  return `${CANONICAL_HOST}/blog/${slug}/`;
}

/**
 * Build the 5-channel D0-D7 social bundle for a single article.
 * Used by gen-social-drafts.mjs (Phase 2) to attach UTM links to each draft.
 *
 * @param {object} args
 * @param {string} args.slug          article slug
 * @param {string} args.date          publish date YYYY-MM-DD (drives utm_content)
 * @param {string} args.campaign      campaign identifier (e.g. pillar-{slug})
 * @param {string} [args.baseUrl]     override base URL (default: canonical)
 * @returns {Array<{key, day, medium, description, url, utm_content, pending?}>}
 */
export function buildArticleSocialUtms({ slug, date, campaign, baseUrl }) {
  const sErr = validateFormat(slug, "slug");
  if (sErr) throw new Error(sErr);
  if (!DATE_RE.test(date)) {
    throw new Error(`date must be YYYY-MM-DD: got "${date}"`);
  }
  const campErr = validateCampaign(campaign);
  if (campErr) throw new Error(campErr);

  const canonical = baseUrl || articleCanonicalUrl(slug);

  return SOCIAL_CHANNELS.map((channel) => {
    const utm_content = `${date}-${slug}-${channel.key}`;

    if (channel.medium == null) {
      // D7 recap: no public UTM, raw canonical.
      return {
        key: channel.key,
        day: channel.day,
        medium: null,
        description: channel.description,
        url: canonical,
        utm_content,
        pending: false,
        note: "no UTM by design (Z App internal)",
      };
    }

    if (PENDING_MEDIUMS.has(channel.medium)) {
      return {
        key: channel.key,
        day: channel.day,
        medium: channel.medium,
        description: channel.description,
        url: canonical,
        utm_content,
        pending: true,
        note: `medium "${channel.medium}" is PENDING — emit raw URL, update utm-convention before going live`,
      };
    }

    const r = buildUtmUrl({
      url: canonical,
      medium: channel.medium,
      campaign,
      content: utm_content,
    });
    if (!r.ok) throw new Error(r.error);
    return {
      key: channel.key,
      day: channel.day,
      medium: channel.medium,
      description: channel.description,
      url: r.url,
      utm_content,
      pending: false,
    };
  });
}

// ----- CLI -------------------------------------------------------------

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--self-test") { args.selfTest = true; continue; }
    if (a === "--bundle")    { args.bundle   = true; continue; }
    if (a === "--help" || a === "-h") { args.help = true; continue; }
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const v = argv[i + 1];
      if (v === undefined || v.startsWith("--")) {
        return { _error: `flag --${key} requires a value` };
      }
      args[key] = v;
      i += 1;
      continue;
    }
    return { _error: `unknown argument "${a}"` };
  }
  return args;
}

const HELP = `\
utm-builder — produce UTM URLs that comply with sofia/docs/utm-convention.md

Single URL mode:
  --url <base-url>          required
  --medium <utm_medium>     required (must be registered)
  --campaign <utm_campaign> required
  --content <utm_content>   required

Bundle mode (5-channel social pack for an article):
  --bundle
  --slug <article-slug>     required
  --date <YYYY-MM-DD>       required
  --campaign <utm_campaign> required
  --base-url <url>          optional (default: canonical sofiayan.cc/blog/{slug}/)

Misc:
  --self-test               run internal unit tests and exit
  --help / -h               this message
`;

async function runCli(argv) {
  const args = parseArgs(argv);
  if (args._error) {
    process.stderr.write(`error: ${args._error}\n${HELP}`);
    process.exit(2);
  }
  if (args.help) {
    process.stdout.write(HELP);
    return 0;
  }
  if (args.selfTest) {
    return runSelfTest() ? 0 : 3;
  }
  if (args.bundle) {
    const required = ["slug", "date", "campaign"];
    for (const k of required) {
      if (!args[k]) {
        process.stderr.write(`error: --${k} is required in --bundle mode\n${HELP}`);
        process.exit(2);
      }
    }
    try {
      const bundle = buildArticleSocialUtms({
        slug: args.slug,
        date: args.date,
        campaign: args.campaign,
        baseUrl: args["base-url"],
      });
      process.stdout.write(JSON.stringify(bundle, null, 2) + "\n");
      return 0;
    } catch (e) {
      process.stderr.write(`error: ${e.message}\n`);
      process.exit(1);
    }
  }

  // Single URL mode
  const required = ["url", "medium", "campaign", "content"];
  for (const k of required) {
    if (!args[k]) {
      process.stderr.write(`error: --${k} is required\n${HELP}`);
      process.exit(2);
    }
  }
  const r = buildUtmUrl({
    url: args.url,
    medium: args.medium,
    campaign: args.campaign,
    content: args.content,
  });
  if (!r.ok) {
    process.stderr.write(`error: ${r.error}\n`);
    process.exit(1);
  }
  process.stdout.write(r.url + "\n");
  return 0;
}

// ----- Self-test -------------------------------------------------------

function runSelfTest() {
  const cases = [];
  let pass = 0;
  let fail = 0;

  function expect(name, fn) {
    cases.push(name);
    try {
      fn();
      pass++;
      process.stdout.write(`  ✓ ${name}\n`);
    } catch (e) {
      fail++;
      process.stdout.write(`  ✗ ${name}\n    ${e.message}\n`);
    }
  }

  function assertEq(a, b, msg) {
    if (a !== b) throw new Error(`${msg || ""} expected "${b}" got "${a}"`);
  }
  function assertTrue(v, msg) {
    if (!v) throw new Error(msg || "assertion failed");
  }
  function assertFalse(v, msg) {
    if (v) throw new Error(msg || "expected falsy");
  }

  process.stdout.write("utm-builder self-test\n");

  expect("source is forced to sofia-blog even if caller tries to override", () => {
    const r = buildUtmUrl({
      url: "https://sofiayan.cc/blog/foo/?utm_source=evil",
      medium: "linkedin-lf",
      campaign: "phase1",
      content: "2026-06-14-foo-d0-main",
    });
    assertTrue(r.ok, "should succeed");
    const u = new URL(r.url);
    assertEq(u.searchParams.get("utm_source"), "sofia-blog", "source must be sofia-blog");
  });

  expect("rejects underscore in medium", () => {
    const r = buildUtmUrl({
      url: "https://sofiayan.cc/blog/foo/",
      medium: "linkedin_lf",
      campaign: "phase1",
      content: "2026-06-14-foo-d0-main",
    });
    assertFalse(r.ok, "should fail");
    assertTrue(/underscore/.test(r.error), `error mentions underscore: ${r.error}`);
  });

  expect("rejects uppercase in medium", () => {
    const r = buildUtmUrl({
      url: "https://sofiayan.cc/blog/foo/",
      medium: "LinkedIn-lf",
      campaign: "phase1",
      content: "2026-06-14-foo-d0-main",
    });
    assertFalse(r.ok, "should fail");
    assertTrue(/lowercase/i.test(r.error), `error mentions lowercase: ${r.error}`);
  });

  expect("rejects whitespace in content", () => {
    const r = buildUtmUrl({
      url: "https://sofiayan.cc/blog/foo/",
      medium: "x",
      campaign: "phase1",
      content: "2026-06-14 foo d0",
    });
    assertFalse(r.ok, "should fail");
    assertTrue(/whitespace/.test(r.error), `error mentions whitespace: ${r.error}`);
  });

  expect("accepts registered podcast-{show} medium", () => {
    const r = buildUtmUrl({
      url: "https://sofiayan.cc/blog/foo/",
      medium: "podcast-recoded",
      campaign: "phase1",
      content: "2026-06-14-foo-podcast",
    });
    assertTrue(r.ok, `should accept podcast medium; got error: ${r.error}`);
  });

  expect("rejects unregistered medium", () => {
    const r = buildUtmUrl({
      url: "https://sofiayan.cc/blog/foo/",
      medium: "tiktok",
      campaign: "phase1",
      content: "2026-06-14-foo-d0-main",
    });
    assertFalse(r.ok, "should fail");
    assertTrue(/not registered/.test(r.error), `error mentions not registered: ${r.error}`);
  });

  expect("rejects pending medium (threads)", () => {
    const r = buildUtmUrl({
      url: "https://sofiayan.cc/blog/foo/",
      medium: "threads",
      campaign: "phase1",
      content: "2026-06-14-foo-d3-story",
    });
    assertFalse(r.ok, "should fail");
    assertTrue(/PENDING/.test(r.error), `error mentions pending: ${r.error}`);
  });

  expect("rejects pending medium (line)", () => {
    const r = buildUtmUrl({
      url: "https://sofiayan.cc/blog/foo/",
      medium: "line",
      campaign: "phase1",
      content: "2026-06-14-foo-line",
    });
    assertFalse(r.ok, "should fail");
    assertTrue(/PENDING/.test(r.error), `error mentions pending: ${r.error}`);
  });

  expect("rejects pending medium (z-app)", () => {
    const r = buildUtmUrl({
      url: "https://sofiayan.cc/blog/foo/",
      medium: "z-app",
      campaign: "phase1",
      content: "2026-06-14-foo-z",
    });
    assertFalse(r.ok, "should fail");
    assertTrue(/PENDING/.test(r.error), `error mentions pending: ${r.error}`);
  });

  expect("articleCanonicalUrl produces sofiayan.cc canonical", () => {
    const u = articleCanonicalUrl("zero-to-ai-native");
    assertEq(u, "https://sofiayan.cc/blog/zero-to-ai-native/");
  });

  expect("bundle returns 5 channels", () => {
    const b = buildArticleSocialUtms({
      slug: "zero-to-ai-native",
      date: "2026-06-14",
      campaign: "pillar-zero-to-ai-native",
    });
    assertEq(b.length, 5, "bundle has 5 channels");
    const keys = b.map((c) => c.key).join(",");
    assertEq(keys, "d0-main,d1-x,d3-story,d5-why,d7-recap");
  });

  expect("bundle d0-main has valid linkedin-lf utm", () => {
    const b = buildArticleSocialUtms({
      slug: "zero-to-ai-native",
      date: "2026-06-14",
      campaign: "pillar-zero-to-ai-native",
    });
    const d0 = b.find((c) => c.key === "d0-main");
    const u = new URL(d0.url);
    assertEq(u.searchParams.get("utm_source"), "sofia-blog");
    assertEq(u.searchParams.get("utm_medium"), "linkedin-lf");
    assertEq(u.searchParams.get("utm_campaign"), "pillar-zero-to-ai-native");
    assertEq(u.searchParams.get("utm_content"), "2026-06-14-zero-to-ai-native-d0-main");
    assertFalse(d0.pending, "should not be pending");
  });

  expect("bundle d7-recap emits canonical without UTM (Z App internal)", () => {
    const b = buildArticleSocialUtms({
      slug: "zero-to-ai-native",
      date: "2026-06-14",
      campaign: "pillar-zero-to-ai-native",
    });
    const d7 = b.find((c) => c.key === "d7-recap");
    assertEq(d7.medium, null);
    assertEq(d7.url, "https://sofiayan.cc/blog/zero-to-ai-native/");
    assertFalse(d7.pending);
  });

  expect("bundle rejects bad date format", () => {
    let threw = false;
    try {
      buildArticleSocialUtms({
        slug: "zero-to-ai-native",
        date: "2026/06/14",
        campaign: "phase1",
      });
    } catch (e) {
      threw = /YYYY-MM-DD/.test(e.message);
    }
    assertTrue(threw, "should throw with YYYY-MM-DD hint");
  });

  expect("bundle rejects uppercase slug", () => {
    let threw = false;
    try {
      buildArticleSocialUtms({
        slug: "Zero-To-AI-Native",
        date: "2026-06-14",
        campaign: "phase1",
      });
    } catch (e) {
      threw = /lowercase/.test(e.message);
    }
    assertTrue(threw, "should throw on uppercase slug");
  });

  expect("baseUrl override is respected", () => {
    const b = buildArticleSocialUtms({
      slug: "zero-to-ai-native",
      date: "2026-06-14",
      campaign: "phase1",
      baseUrl: "https://staging.sofiayan.cc/blog/zero-to-ai-native/",
    });
    const d0 = b.find((c) => c.key === "d0-main");
    const u = new URL(d0.url);
    assertEq(u.hostname, "staging.sofiayan.cc");
  });

  expect("real example from utm-convention §範例-1 still validates", () => {
    // The example in utm-convention.md uses the github.io host, which is
    // fine — the builder is host-agnostic.
    const r = buildUtmUrl({
      url: "https://sofiayan0523.github.io/sofia/posts/humanities-ai-expert/",
      medium: "linkedin-lf",
      campaign: "pillar-humanities-ai-expert",
      content: "2026-05-12-pillar",
    });
    assertTrue(r.ok, r.error);
  });

  process.stdout.write(`\n${pass} passed, ${fail} failed (${cases.length} total)\n`);
  return fail === 0;
}

// ----- Entrypoint ------------------------------------------------------

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  runCli(process.argv.slice(2)).then((code) => process.exit(code ?? 0));
}
