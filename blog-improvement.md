# Blog Improvement Actions

Last verified: 2026-06-04

This action list is based on the current repository state and build output, not only on prior review notes.

## Label Legend

- `[Verified]`: directly observed in repo files, build output, generated HTML, or HTTP checks on 2026-06-04.
- `[Strategy]`: recommendation based on positioning, content strategy, information architecture, or funnel judgment. It should be reviewed by Sofia before implementation.
- `[Verified + Strategy]`: the current state is verified, but the proposed solution involves editorial/product judgment.

## Implementation Progress

- 2026-06-04 loop iteration 1:
  - Completed P0 Action 1 source fixes for broken `/posts/...` article URLs in `public/llms.txt`, `src/pages/ai-coworker-methodology.astro`, `src/content/posts/humanities-ai-expert.mdx`, and the listed docs.
  - Completed P0 Action 2 by passing `faq` from `BaseLayout.astro` to `SEO.astro`; verified `FAQPage` appears in `dist/speaker/index.html` and `dist/ai-coworker-methodology/index.html`.
  - Completed P0 Action 3 by removing the confirmed 404 Spotify playlist card and rendering the confirmed 404 Numbers AMA speaking item as plain text without a link.
  - Partially completed P2 Action 7 by updating active future-output references in `docs/utm-convention.md`, `docs/appworks-keynote-2026-06-03.md`, `docs/zero-to-ai-native-social-posts.md`, `scripts/generate-qrcode.mjs`, `scripts/generate-branding.mjs`, and `src/pages/rss.xml.ts`.
  - Verified `npm run build` succeeds; precise built-link scan found no `href` links pointing to `/posts/`.
  - Note: the original broad `/posts/` acceptance snippet also matches legitimate image paths such as `/images/posts/...`; use an `href`-targeted scan for route-link validation.
- 2026-06-04 loop iteration 2:
  - Completed P1 Action 4 by adding generated static compatibility pages at `/posts/{slug}/`; each page has `noindex, follow`, canonical URL, meta refresh, JS redirect, and fallback link to `/blog/{slug}/`.
  - Completed P1 Action 5 by adding `public/.well-known/mcp/server-card.json`, `public/.well-known/agent-skills/index.json`, and `public/.well-known/api-catalog`; content is intentionally static-discovery only and does not advertise a live MCP tool server.
  - Completed P1 Action 6 by adding `scripts/check-links.mjs` and `npm run check:links`.
  - Extended `scripts/validate-aeo-files.mjs` to validate the new capability discovery files.
  - Verified `npm run check:links` succeeds; build now generates 25 pages, including 9 `/posts/{slug}/` compatibility pages, and the checker found no broken internal links.
  - Verified `node scripts/validate-aeo-files.mjs` succeeds and the three new discovery endpoints are present in `dist`.
- 2026-06-04 loop iteration 3:
  - Completed P2 Action 7 for active stale deployment references by updating `RELEASE-NOTES.md`, `scripts/validate-aeo-files.mjs`, and `scripts/switchover-domain.mjs`; exact scan for `sofiayan0523.github.io/sofia`, `sofiayan.com`, and route-style `/posts/` references in docs/scripts/release notes returns no matches.
  - Completed Actions 8 and 16 by deriving visible blog categories from published posts; `thoughts` is hidden while it has 0 published posts.
  - Partially completed Action 12 by adding an AI adoption series section to `/blog`, adding series previous/next navigation to the four AI insight posts, and adding the `zero-to-ai-native` cluster link to `public/llms.txt`.
  - Verified `npm run check:links` succeeds, `node scripts/validate-aeo-files.mjs` succeeds, `/blog/` includes the AI series section, `/blog/` does not emit `data-cat="thoughts"`, and all four AI series posts include series navigation.
- 2026-06-04 loop iteration 4:
  - Completed Action 9 by tightening homepage first-screen positioning: updated bilingual hero copy, surfaced enterprise AI adoption / content provenance / AI coworker methodology focus tags, and changed first-screen CTAs to Speaker, Blog, and About.
  - Advanced Actions 10 and 17 by adding Speaker to header/footer navigation and adding contextual CTA sections on About and Career.
  - Verified `npm run check:links` succeeds, `node scripts/validate-aeo-files.mjs` succeeds, and built HTML contains the homepage focus tags plus Speaker / Blog / About CTAs and About/Career contextual CTA links.
- 2026-06-04 loop iteration 5:
  - Completed Action 11 by strengthening the Speaker funnel: added a hero email CTA, a "best fit / not best fit" guide before topic details, a fit-section email CTA, and tracking attributes on email / LinkedIn enquiry links.
  - Advanced Action 14 by documenting speaker and product-flow CTA event names in `docs/utm-convention.md`.
  - Fixed Speaker canonical origin from legacy GitHub Pages to `https://sofiayan.cc`.
  - Verified `npm run check:links` succeeds, `node scripts/validate-aeo-files.mjs` succeeds, and built HTML contains the Speaker hero CTA, fit guide, `data-analytics-event` attributes, and `https://sofiayan.cc/speaker` canonical URL.

## Verification Summary

- Stack: Astro 5 static site with MDX content, React islands, Tailwind, RSS, sitemap, and Pagefind post-build search.
- Build command verified: `npm run build` completed successfully and generated 16 pages.
- Published blog routes verified from build output: 9 posts under `/blog/{slug}/`.
- No `/posts/{slug}` route is generated. Any `/posts/...` link is broken unless a redirect is added.
- AEO foundation files exist and validate: `public/llms.txt`, `public/agent.json`, `public/.well-known/agent.json`, `public/robots.txt`, and sitemap output.
- `SEO.astro` supports `FAQPage`, but `BaseLayout.astro` does not pass `faq` through to `SEO.astro`; page-level FAQ data on `speaker` and `ai-coworker-methodology` is therefore not emitted in built HTML.
- Existing agent-readiness capabilities are partial: `/agent.json` and `/.well-known/agent.json` exist, but MCP server card, agent skills index, and API catalog files are missing.
- Current site IA has six main user-facing routes: `/`, `/about`, `/blog`, `/career`, `/speaker`, and `/ai-coworker-methodology`.
- Current homepage first screen introduces Sofia as "共同創辦人 · 策略長 · 寫作者 · 獨旅人", with primary CTAs to About and Blog.
- Current About page contains personal narrative, credentials, speaking history, Numbers Protocol context, and "Playground" outbound links.
- Current Speaker page contains offer formats, topics, proof points, FAQ, and contact CTAs via email and LinkedIn DM.
- UTM convention exists in `docs/utm-convention.md`, but example URLs still use old GitHub Pages `/posts/...` paths.

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
- Source page review
  - `src/pages/index.astro` has two first-screen CTAs: About and Blog.
  - `src/pages/about.astro` includes credentials, speaking history, Numbers Protocol context, and Playground cards.
  - `src/pages/speaker.astro` includes three offer formats, topic blocks, proof points, FAQ, and email / LinkedIn CTAs.
  - `docs/utm-convention.md` defines source/medium/campaign/content rules and funnel categories.

## P0 Actions

### 1. [Verified] Fix broken `/posts/...` URLs to `/blog/...`

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

### 2. [Verified] Pass `faq` from `BaseLayout.astro` to `SEO.astro`

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

### 3. [Verified] Replace or remove confirmed 404 external links

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

### 4. [Verified + Strategy] Add redirects or a static compatibility layer for old `/posts/{slug}` URLs

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

### 5. [Verified + Strategy] Complete agent-readiness capability discovery endpoints

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

### 6. [Strategy] Add a repo-local link validation script

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

### 7. [Verified] Refresh legacy deployment references in docs and scripts

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

### 8. [Verified + Strategy] Decide whether `thoughts` should remain visible as an empty category

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

## Brand / Content / IA / Funnel Actions

### 9. [Verified + Strategy] Tighten the homepage first-screen positioning

Why: The homepage currently says "共同創辦人 · 策略長 · 寫作者 · 獨旅人" and "文組人誤闖科技圈，意外成了新創共同創辦人". This is warm and personal, but it does not immediately surface the strongest public positioning already used elsewhere in the site: humanities-trained AI implementation expert, AI coworker methodology, content provenance, and speaker/training relevance.

Recommended direction:

- Keep the human tone, but make the first screen more specific about the "why Sofia" angle.
- Consider a sharper homepage description such as: "我用文組人的翻譯能力，把企業 AI 導入、內容溯源與 AI 同事方法論講到人真的用得起來。"
- Add a third first-screen CTA or adjust the two existing CTAs by intent:
  - `邀請演講` -> `/speaker`
  - `閱讀文章` -> `/blog`
  - `了解 Sofia` -> `/about`

Evidence:

- Verified in `src/pages/index.astro`: first-screen CTAs currently point to About and Blog.
- Verified in `src/i18n/zh.ts`: homepage copy is broad personal positioning.
- Verified in `src/pages/speaker.astro` and `public/llms.txt`: stronger AI/speaker positioning already exists elsewhere.

Acceptance check:

- First viewport answers these three questions without scrolling:
  - Who is Sofia?
  - What problem does she help with?
  - What should the visitor do next?

### 10. [Verified + Strategy] Clarify the role of each top-level page

Why: The site has strong material, but `/about`, `/career`, `/speaker`, and `/ai-coworker-methodology` currently overlap in credentials, proof, and AI positioning. Clear page roles will reduce repeated copy and make navigation more intentional.

Recommended IA roles:

- `/`: positioning and routing hub.
- `/about`: personal origin story and credibility; keep it reflective and human.
- `/career`: chronological proof archive; work, speaking, media, podcast.
- `/speaker`: conversion page for booking and training.
- `/ai-coworker-methodology`: owned framework / canonical reference page.
- `/blog`: essays and search/discovery.

Evidence:

- Verified routes from build output.
- Verified About contains credentials and Numbers Protocol context.
- Verified Speaker also contains credentials, proof points, offer formats, and contact flow.
- Verified Career contains structured work/speaking/media/podcast data via `src/data/career.ts`.

Acceptance check:

- Each top-level page has one primary job and one primary CTA.
- Repeated proof points are either centralized or intentionally repeated with page-specific purpose.

### 11. [Verified + Strategy] Strengthen the speaker conversion funnel

Why: Speaker page has strong proof and clear topics, but the conversion path is still manually email/LinkedIn based. That may be correct for high-touch booking, but the page should make enquiry intent easier to act on and easier to measure.

Recommended direction:

- Keep email and LinkedIn DM, but add a structured enquiry CTA above the fold or after offer formats.
- If a form is not desired, use a `mailto:` CTA with a cleaner subject/body template and track clicks.
- Add one "best fit" section before contact:
  - Best for: leadership offsite, AI adoption workshop, media/provenance keynote.
  - Not best for: generic AI tool tutorial, one-off KOL endorsement.
- Add UTM/event tracking for speaker CTAs.

Evidence:

- Verified in `src/pages/speaker.astro`: current CTAs are email and LinkedIn DM near the bottom.
- Verified in `docs/utm-convention.md`: `speaker-page` medium already exists for funnel tracking.
- Verified current build does not emit FAQPage until Action 2 is fixed.

Acceptance check:

- Visitor can identify a suitable format and contact Sofia within one scroll on mobile.
- GA4/Cloudflare event or UTM plan can distinguish speaker intent from general site browsing.

### 12. [Verified + Strategy] Turn the current AI posts into an explicit pillar / cluster journey

Why: The repo has four AI insight posts that already form a natural cluster: humanities-led AI adoption, AI anxiety, enterprise AI adoption failure, and AI-native operations. The current blog index lists them chronologically, but does not make the reader journey explicit.

Recommended direction:

- Add a "Start here" or "AI adoption series" section on `/blog`.
- Define one pillar and three clusters:
  - Pillar: `humanities-ai-expert`
  - Cluster: `ai-anxiety-survival-guide`
  - Cluster: `why-95-percent-ai-adoption-fails`
  - Cluster: `zero-to-ai-native`
- Add previous/next or related-post links inside those four posts.
- Update `llms.txt` after `/posts` links are corrected so agents see the same journey.

Evidence:

- Verified current published posts: 4 `ai-insights`, 5 `travel`.
- Verified `public/llms.txt` already describes pillar/cluster semantics but uses broken `/posts/...` links.
- Verified `src/pages/blog/index.astro` currently shows a chronological grid plus category filter.

Acceptance check:

- A reader landing on any AI article can move to the next related article without returning to the blog index.
- `/blog` makes the AI adoption series visible without hiding travel essays.

### 13. [Verified + Strategy] Separate "Sofia the person" from "Sofia the offer" without flattening the voice

Why: The site's strongest asset is not just credentials; it is the contrast between warm personal voice and sharp enterprise AI field experience. About currently mixes personal story, credentials, Numbers context, and playground links. That can work, but the hierarchy should make the reader feel both trust and texture.

Recommended direction:

- Keep About as a story-led page, not a resume page.
- Move dense proof lists toward Career or Speaker, and use About to explain the through-line:
  - language/teaching background -> translation role
  - startup growth -> field evidence
  - AI coworker methodology -> current thesis
  - travel/playground -> personality and voice
- Keep playful links, but separate them visually from professional proof so they do not compete for trust.

Evidence:

- Verified in `src/pages/about.astro`: About includes personal intro, credentials, speaking history, Numbers Protocol context, and Playground cards.
- Verified Space writing convention: Sofia's style should be reflective, story-led, and avoid generic AI/PR phrasing.

Acceptance check:

- About page can be summarized in one sentence: why Sofia sees AI differently.
- Career page carries archive density; About carries narrative clarity.

### 14. [Verified + Strategy] Build a measurable Sofia -> Numbers / Omni funnel

Why: `docs/utm-convention.md` already defines UTM rules and funnel categories, but current examples use stale URLs and the implementation is not enforced. This is a missed measurement layer for speaker, product, and content flows.

Recommended direction:

- Fix stale UTM examples to `https://sofiayan.cc/blog/...`.
- Add a small UTM builder script only after URL cleanup.
- Decide the primary conversion events:
  - speaker enquiry click
  - Numbers / Omni outbound click
  - newsletter or RSS subscription if added later
  - article share click
- Add event names to docs before wiring code.

Evidence:

- Verified `docs/utm-convention.md` exists and defines `speaker-page`, `blog-internal`, `numbers-omni-demo`, and related campaign conventions.
- Verified stale GitHub Pages and `/posts/...` examples remain in the document.
- Verified site has GA4 and Cloudflare analytics hooks in `BaseLayout.astro`, gated by public env vars.

Acceptance check:

- Every outbound CTA from Speaker and AI methodology pages has a documented measurement purpose.
- UTM examples in docs use the current production domain and real route structure.

### 15. [Strategy] Create an editorial roadmap that matches Sofia's voice instead of generic SEO templates

Why: The AI content has a distinctive reflective voice. Future SEO/AEO gains should not come from generic "ultimate guide" content, because that would weaken Sofia's positioning.

Recommended direction:

- Create 6-8 planned essay briefs using the existing voice pattern:
  - start from a meeting, conversation, field moment, or uncomfortable observation
  - move into a concept only after the scene creates need
  - end with an open question or journey sense
- Suggested clusters:
  - AI coworker management
  - humanities-trained operators in AI adoption
  - provenance / trust / C2PA explained through real media scenarios
  - founder operating notes from Numbers Protocol
  - travel essays that reveal observational style, not just itinerary
- For each planned essay, define:
  - target reader
  - internal link target
  - one source/proof requirement
  - one conversion or relationship goal

Evidence:

- Strategy recommendation based on current 9-post inventory and shared Sofia writing convention.
- Verified post categories exist: `travel`, `ai-insights`, and `thoughts`.

Acceptance check:

- Roadmap contains no generic listicle titles unless Sofia explicitly wants that format.
- Each planned post has a role in the reader journey.

### 16. [Verified + Strategy] Make "thoughts" either intentional or invisible

Why: This overlaps with Action 8 but should be treated as a content strategy decision, not only a UI issue. An empty category can imply missing content; a deliberate "thoughts" category can become Sofia's reflective essay lane.

Recommended direction:

- If `thoughts` stays, define what belongs there:
  - founder reflections
  - AI field notes that are not tactical enough for `ai-insights`
  - travel/life observations with a work-adjacent insight
- If not, hide the category until the first published post exists.

Evidence:

- Verified in content schema and blog category UI: `thoughts` exists.
- Verified current published inventory has no `thoughts` posts.

Acceptance check:

- Category taxonomy reflects current content, not future intention hidden from readers.

### 17. [Verified + Strategy] Add cross-page CTAs that match reader intent

Why: The current site has multiple strong pages, but some reader paths rely on header navigation rather than contextual CTAs.

Recommended CTA map:

- Homepage -> Speaker for business visitors; Blog for readers; About for credibility.
- About -> Speaker after credibility; Blog after personal story.
- Career -> Speaker after speaking/media proof.
- AI Coworker Methodology -> Speaker and relevant pillar post.
- Blog AI posts -> AI methodology and Speaker, only where editorially natural.
- Travel posts -> About or Blog index, not Speaker by default.

Evidence:

- Verified homepage currently routes to About and Blog.
- Verified About has a Speaker link in credentials section.
- Verified AI Coworker Methodology has Speaker and related-post CTAs, but some links are broken due `/posts`.

Acceptance check:

- Every top-level page has one primary and one secondary CTA.
- CTA labels describe the visitor's intent, not just the destination page name.

### 18. [Strategy] Preserve personal texture while improving authority signals

Why: The site should not become a generic consultant landing page. The strongest brand position is "溫和的銳利": human, reflective, but grounded in real operating evidence.

Recommended guardrails:

- Avoid turning every section into proof metrics.
- Keep travel and playful personal links, but do not let them compete with primary conversion paths.
- Where using claims like "7+ years", "67M+ registrations", "60億 monthly traffic", or "AI coworkers", attach source notes or keep them in pages where proof context exists.
- Prefer "I noticed / I kept thinking / I learned this the hard way" framing over slogan-first copy.

Evidence:

- Strategy recommendation based on current page copy plus shared Sofia writing convention.
- Verified current Speaker page uses several quantitative proof points that should remain evidence-backed.

Acceptance check:

- New copy still sounds like Sofia, not a SaaS landing page.
- Quantitative claims have clear source/proof ownership before being promoted in hero or CTA areas.
