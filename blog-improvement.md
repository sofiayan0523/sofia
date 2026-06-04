# Blog Improvement Actions

Last verified: 2026-06-04

This action list is based on the current repository state and build output, not only on prior review notes.

## Verification Summary

- Stack: Astro 5 static site with MDX content, React islands, Tailwind, RSS, sitemap, and Pagefind post-build search.
- Build command verified: `npm run build` completed successfully and generated 16 pages.
- Published blog routes verified from build output: 9 posts under `/blog/{slug}/`.
- No `/posts/{slug}` route is generated. Any `/posts/...` link is broken unless a redirect is added.
- AEO foundation files exist and validate: `public/llms.txt`, `public/agent.json`, `public/.well-known/agent.json`, `public/robots.txt`, and sitemap output.
- `SEO.astro` supports `FAQPage`, but `BaseLayout.astro` does not pass `faq` through to `SEO.astro`; page-level FAQ data on `speaker` and `ai-coworker-methodology` is therefore not emitted in built HTML.
- Existing agent-readiness capabilities are partial: `/agent.json` and `/.well-known/agent.json` exist, but MCP server card, agent skills index, and API catalog files are missing.

## Evidence Checked

- `npm run build`
  - Generated routes include `/blog/2022-life-in-oslo/`, `/blog/2024-bologna/`, `/blog/2024-florence/`, `/blog/2024-rome/`, `/blog/2024-venice/`, `/blog/ai-anxiety-survival-guide/`, `/blog/humanities-ai-expert/`, `/blog/why-95-percent-ai-adoption-fails/`, and `/blog/zero-to-ai-native/`.
  - Pagefind indexed 9 pages.
- Internal link scan on `dist/**/*.html`
  - Found 6 broken internal references.
  - 5 are real `/posts/...` route bugs.
  - 1 is `404.html` canonicalizing to `/404/`, which is lower priority because it is the 404 page itself.
- JSON-LD scan on built pages
  - `dist/speaker/index.html`: `Person`, `Organization`, `WebSite`; no `FAQPage`.
  - `dist/ai-coworker-methodology/index.html`: `Person`, `Organization`, `WebSite`; no `FAQPage`.
  - `dist/blog/humanities-ai-expert/index.html`: includes `Article` and inline MDX `FAQPage`.
- External link spot check with `curl -L`
  - `https://numbersprotocol.github.io/numbers-ama/webinar/2025-12-06` returns 404.
  - `https://open.spotify.com/playlist/37i9dQZF1DWVidGk00tysG?si=b6b00b9e03b24a59` returns 404.
  - `https://open.spotify.com/episode/6hqxuFpmGLKAecJUuzfeqW` returns 200.
  - `https://open.spotify.com/episode/1RJPvMew8eqiwjKBurVnQW` returns 200.
  - `https://sofiayan.cc/posts/humanities-ai-expert` returns 404.
  - `https://sofiayan.cc/blog/humanities-ai-expert/` returns 200.

## P0 Actions

### 1. Fix broken `/posts/...` URLs to `/blog/...`

Why: Current build only generates `/blog/{slug}/`. `/posts/{slug}` URLs return 404 and appear in agent-facing files plus built HTML.

Files to update:

- `public/llms.txt`
  - Change:
    - `https://sofiayan.cc/posts/humanities-ai-expert`
    - `https://sofiayan.cc/posts/ai-anxiety-survival-guide`
    - `https://sofiayan.cc/posts/why-95-percent-ai-adoption-fails`
  - To:
    - `https://sofiayan.cc/blog/humanities-ai-expert/`
    - `https://sofiayan.cc/blog/ai-anxiety-survival-guide/`
    - `https://sofiayan.cc/blog/why-95-percent-ai-adoption-fails/`
- `src/pages/ai-coworker-methodology.astro`
  - Change CTA links built from `${baseUrl}posts/humanities-ai-expert` and `${baseUrl}posts/ai-anxiety-survival-guide`.
- `src/content/posts/humanities-ai-expert.mdx`
  - Change `/posts/ai-anxiety-survival-guide` to `/blog/ai-anxiety-survival-guide/`.
- Docs are not deployed pages, but should be cleaned for future sharing:
  - `docs/utm-convention.md`
  - `docs/appworks-keynote-2026-06-03.md`
  - `docs/zero-to-ai-native-social-posts.md`

Acceptance check:

```bash
npm run build
node - <<'NODE'
const fs = require('fs');
const path = require('path');
const files = [];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
}
walk('dist');
let count = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  if (html.includes('/posts/')) {
    console.log(path.relative('dist', file));
    count++;
  }
}
process.exit(count ? 1 : 0);
NODE
```

### 2. Pass `faq` from `BaseLayout.astro` to `SEO.astro`

Why: `SEO.astro` already defines and emits `FAQPage` when `faq` is present, but `BaseLayout.astro` drops the prop before rendering `SEO`. The source pages pass `faq={faqs}`, yet the built `speaker` and `ai-coworker-methodology` pages do not contain `FAQPage`.

Files to update:

- `src/layouts/BaseLayout.astro`
  - Add `faq?: Array<{ question: string; answer: string }>;` to `Props`.
  - Destructure `faq` from `Astro.props`.
  - Pass `faq={faq}` into `<SEO />`.

Acceptance check:

```bash
npm run build
node - <<'NODE'
const fs = require('fs');
for (const file of ['dist/speaker/index.html', 'dist/ai-coworker-methodology/index.html']) {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('"@type":"FAQPage"')) {
    console.error(`${file} missing FAQPage`);
    process.exit(1);
  }
}
NODE
```

### 3. Replace or remove confirmed 404 external links

Why: Broken external links reduce user trust and can weaken agent/browser citation paths.

Files to update:

- `src/data/career.ts`
  - `https://numbersprotocol.github.io/numbers-ama/webinar/2025-12-06` currently returns 404.
  - Replace with a working event archive, video, article, or remove the link while keeping the title.
- `src/pages/about.astro`
  - `https://open.spotify.com/playlist/37i9dQZF1DWVidGk00tysG?si=b6b00b9e03b24a59` currently returns 404.
  - Replace with a live playlist/profile URL or remove the card.

Acceptance check:

```bash
curl -L -s -o /dev/null -w '%{http_code}\n' '<replacement-url>'
```

## P1 Actions

### 4. Add redirects or a static compatibility layer for old `/posts/{slug}` URLs

Why: Existing docs and previously shared URLs use `/posts/...`. Fixing source links prevents new broken links, but it does not recover already shared URLs.

Options:

- Add a static redirect mechanism supported by the deploy target.
- Add generated Astro pages under `src/pages/posts/[...slug].astro` that redirect to `/blog/{slug}/`.
- Keep `llms.txt` and canonical URLs on `/blog/.../` after redirect support is in place.

Acceptance check:

```bash
curl -L -s -o /dev/null -w '%{http_code} %{url_effective}\n' https://sofiayan.cc/posts/humanities-ai-expert
```

Expected: non-404 final URL under `/blog/humanities-ai-expert/`.

### 5. Complete agent-readiness capability discovery endpoints

Why: Current AEO foundation validates, but capability discovery is incomplete beyond `agent.json`.

Files to add if intentionally supported:

- `public/.well-known/mcp/server-card.json`
- `public/.well-known/agent-skills/index.json`
- `public/.well-known/api-catalog`

Keep the content honest: this personal site mostly supports content browsing, RSS, speaker booking, and citation/licensing metadata. Do not advertise tools that do not exist.

Acceptance check:

```bash
npm run build
test -f dist/.well-known/mcp/server-card.json
test -f dist/.well-known/agent-skills/index.json
test -f dist/.well-known/api-catalog
```

### 6. Add a repo-local link validation script

Why: The current broken links were found by ad hoc scans. A repeatable script makes future content migrations safer.

Suggested implementation:

- Add `scripts/check-links.mjs`.
- Check internal built links in `dist/**/*.html`.
- Optionally check external links with a timeout and allowlist for sites that block bots.
- Add an npm script such as `"check:links": "npm run build && node scripts/check-links.mjs"`.

Acceptance check:

```bash
npm run check:links
```

## P2 Actions

### 7. Refresh legacy deployment references in docs and scripts

Why: The production domain is `https://sofiayan.cc`, but several docs/scripts still reference `sofiayan0523.github.io/sofia` or `sofiayan.com`. Some are historical notes, but future social/QR workflows may copy stale URLs.

Observed examples:

- `docs/utm-convention.md`
- `docs/appworks-keynote-2026-06-03.md`
- `docs/zero-to-ai-native-social-posts.md`
- `scripts/generate-qrcode.mjs`
- `scripts/generate-branding.mjs`
- `RELEASE-NOTES.md`

Acceptance check:

```bash
rg 'sofiayan0523\.github\.io/sofia|sofiayan\.com|/posts/' docs scripts RELEASE-NOTES.md
```

### 8. Decide whether `thoughts` should remain visible as an empty category

Why: `src/pages/blog/index.astro` exposes `thoughts`, but current content has 0 published `thoughts` posts. This is not a bug, but it creates an empty filter state.

Options:

- Keep it if `thoughts` posts are planned soon.
- Hide categories with no published posts.
- Add a planned `thoughts` post.

Acceptance check:

```bash
npm run build
```

Then manually verify the blog filter behavior on `/blog/`.

