# GA4 Share & Reaction Event Plan

> v0  ·  2026-05-30  ·  Phase 2 design doc
>
> Owners: Omni (drafting) · Sofia (final approval before implementation PR)
>
> Alignment:
> - `.omni/harness/goal.md` KPI #2 (MAU) and KPI #3 (LinkedIn reactions per post)
> - `.omni/harness/plans.md` §5.1 KPI targets, §5.2 metrics data contract
> - `sofia/docs/blog-publishing-workflow.md` §6.5 promotion rhythm
> - `sofia/docs/utm-convention.md` §4 (utm_source=sofia-blog, medium matrix)
>
> Status: **Design only — no code changes in this iteration.** Implementation
> tasks are itemized in §5 and will be picked up as separate todo entries.

---

## 1. Purpose & Scope

Define a minimal, honest GA4 instrumentation layer for the on-page social and
reaction widgets, so that:

- Sofia can see which channels her articles actually get shared to, and from
  which articles (not just aggregate page views).
- KPI #3 (LinkedIn reactions per post) has an **interim proxy** in the
  weekly report (share-click count to LinkedIn) until full LinkedIn API
  access is wired in Phase 3+.
- KPI #2 (MAU) reuses default GA4 pageview tracking; this plan does **not**
  duplicate or modify pageview behaviour.
- Existing components (`ShareButtons.astro`, `Reactions.tsx`) gain event
  emission without behavioural side effects — clicks still navigate and
  reactions still persist exactly as today.

Out of scope (separate Phase 3 work):
- LinkedIn Marketing API direct reaction pull
- X / Twitter API impressions
- Cloudflare Worker server-side bot counter

---

## 2. Current State (verified 2026-05-30)

### 2.1 GA4 wiring

`sofia/src/layouts/BaseLayout.astro` lines 67-79 conditionally load gtag when
`PUBLIC_GA_TRACKING_ID` env var is set, and configures the default property:

```js
gtag('js', new Date());
gtag('config', PUBLIC_GA_TRACKING_ID);
```

After load, the global `window.gtag` is available everywhere. Default GA4
enhanced measurement provides:
- `page_view`
- `scroll`
- `outbound_click` (auto-tracked for external links — note this overlaps
  partly with our share clicks; see §3.1 for de-duplication)
- `file_download`
- `video_*` (we don't use)

Cloudflare Web Analytics beacon also loads independently (lines 80-86) — it
operates client-side and cannot see backend bot traffic. The two trackers
do not interfere with each other.

### 2.2 `ShareButtons.astro` (lines 1-153)

Renders 5 share targets (X / Facebook / LinkedIn / LINE / Copy Link). The
script block (lines 93-152) sets `href` dynamically from `window.location.href`
on `astro:page-load`, and handles the clipboard copy. **No event tracking
present today.**

### 2.3 `Reactions.tsx` (lines 1-193)

4 reaction kinds: `claps` (max 10/reader), `loves` / `insights` / `amazes`
(max 1/reader each). Optimistically updates UI, writes to Supabase
`post_reactions` via REST API when configured, falls back to localStorage.
**No GA4 emission today.**

---

## 3. Event Taxonomy

Four custom events (snake_case per GA4 naming convention; under the 40-char
event-name limit and avoiding reserved names like `share` and `select_item`).

### 3.1 `sofia_share_click`

Fired when the user clicks one of the 5 share buttons.

| Parameter | Type | Required | Example | Notes |
|---|---|---|---|---|
| `share_target` | string | yes | `x` / `facebook` / `linkedin` / `line` / `copy-link` | Lowercase, matches the data-attr below |
| `post_slug` | string | yes | `zero-to-ai-native` | Article slug or `home` / `about` etc. |
| `post_lang` | string | yes | `zh-TW` / `en` | From `<html lang>` |
| `share_url` | string | yes | full canonical URL with UTM if any | Truncated to 100 chars per GA4 rules |
| `referrer_path` | string | optional | `/blog/zero-to-ai-native/` | location.pathname |

De-duplication vs default `outbound_click`:
- GA4 enhanced measurement already tracks outbound clicks. Our event is
  more specific (knows which share platform). When Sofia analyses, she
  should filter `sofia_share_click` and ignore the equivalent
  `outbound_click` for that same target, OR disable the auto outbound
  measurement for `twitter.com|facebook.com|linkedin.com|line.me` domains
  in GA4 settings. Recommended: keep both, document the overlap in the
  weekly report glossary.

### 3.2 `sofia_post_reaction`

Fired when a reader successfully reacts (after cap check).

| Parameter | Type | Required | Example | Notes |
|---|---|---|---|---|
| `reaction_type` | string | yes | `claps` / `loves` / `insights` / `amazes` | |
| `post_slug` | string | yes | `zero-to-ai-native` | |
| `post_lang` | string | yes | `zh-TW` / `en` | |
| `clap_count` | int | optional | 1..10 | Only present when `reaction_type=claps`; reflects this reader's cumulative count for this post |
| `storage_path` | string | yes | `supabase` / `localStorage` | Reflects whether persistence reached DB or only localStorage fallback |

Fires **once per click**, not per increment for claps — i.e. 10 claps = 10
events. This lets Sofia see clap-per-session distribution.

### 3.3 `sofia_link_copied`

Fired specifically when the Copy Link button succeeds. Subset of
`sofia_share_click` (target=copy-link) plus the success signal so we can
distinguish click-but-clipboard-failed cases.

| Parameter | Type | Required | Example |
|---|---|---|---|
| `post_slug` | string | yes | `zero-to-ai-native` |
| `post_lang` | string | yes | `zh-TW` |
| `copy_outcome` | string | yes | `success` / `clipboard-error` |

### 3.4 `sofia_post_view_complete` (optional, Phase 3 candidate)

Fired when a reader scrolls past 80% of the article. Useful for KPI #1
quality signal (long-form essay completion rate). **Not implemented in this
plan's scope** — listed here for explicit deferral.

---

## 4. DOM CustomEvent Mirror (optional, very small extra cost)

To allow other JS (heatmap, future Cloudflare Worker, A/B testing) to
listen without touching gtag directly, each GA4 emission also dispatches
a `CustomEvent` on `document`:

```js
document.dispatchEvent(new CustomEvent("sofia:share-click", { detail: { share_target, post_slug, ... } }));
document.dispatchEvent(new CustomEvent("sofia:post-reaction", { detail: { reaction_type, post_slug, ... } }));
document.dispatchEvent(new CustomEvent("sofia:link-copied", { detail: { post_slug, copy_outcome, ... } }));
```

These are no-ops if nothing listens. Naming convention: `sofia:` prefix
to avoid collision with library events.

---

## 5. Implementation Plan

### 5.1 New shared module: `sofia/src/lib/analytics.ts`

A tiny typed helper that guards against missing gtag and centralises the
schema. Approximate signature:

```ts
type Params = Record<string, string | number | boolean | undefined>;

function trackGa4(eventName: string, params: Params): void {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.gtag !== "function") return;       // GA not loaded → no-op
  // Strip undefined values (gtag will store the string "undefined" otherwise).
  const cleaned: Params = {};
  for (const k in params) if (params[k] !== undefined) cleaned[k] = params[k]!;
  try { w.gtag("event", eventName, cleaned); } catch (_) { /* never throw */ }
}

export function trackShareClick(p: ShareClickParams): void { ... }
export function trackPostReaction(p: PostReactionParams): void { ... }
export function trackLinkCopied(p: LinkCopiedParams): void { ... }

// Also dispatch DOM CustomEvent for non-GA listeners.
```

Constraints:
- No external dependency.
- Pure side-effect-free in SSR (`typeof window === "undefined"` short-circuit).
- Never throws — analytics failure must not break navigation or reaction logic.
- TypeScript strict mode compliant.

### 5.2 `ShareButtons.astro` edits

In the existing inline `<script is:inline>` block:

- After deriving `currentUrl`, read `post-slug` and `post-lang` from a new
  pair of `data-*` attributes on `#share-buttons-container`.
- Add `click` listeners on `#share-x` / `#share-fb` / `#share-linkedin` /
  `#share-line` that emit `sofia_share_click` BEFORE the default
  navigation (use `pointerdown` if click-then-navigate timing is tight;
  navigation does not block prior `gtag` calls because gtag uses sendBeacon
  internally for unloads).
- In the existing copy-link `click` handler, on `navigator.clipboard.writeText`
  success emit `sofia_link_copied` with `copy_outcome=success`; in the
  catch branch emit with `copy_outcome=clipboard-error`.
- The inline script can call helpers either by inlining the same guard or
  by importing the new module via `<script type="module">` — pick whichever
  Astro plays nicer with for inline-rendered components.

Astro Props change:
- Add `slug: string` and `lang: "zh" | "en"` to `Props` interface so the
  parent page passes article context (currently only `title` is passed).
  All call sites must be updated.

### 5.3 `Reactions.tsx` edits

In `handleReact()`:

- After the optimistic state update and after Supabase write completes
  (or fails), call `trackPostReaction({ reaction_type: key, post_slug:
  slug, post_lang: lang === "zh" ? "zh-TW" : "en", clap_count: ... ,
  storage_path: hasSupabase && supabaseOk ? "supabase" : "localStorage" })`.
- Track only on successful state mutation (i.e. NOT on the early-return
  branches that bail because the cap was already reached).
- For claps, pass the post-increment count so distribution analysis can
  see how many readers clap once vs many times.

### 5.4 Call-site updates

`sofia/src/pages/blog/[...slug].astro` must pass `slug` and `lang` props
through to both `ShareButtons` and `Reactions`. Verify there are no other
pages using `ShareButtons` (likely just blog posts).

### 5.5 Verification before implementation PR is opened

- `mdx-nid-coverage.mjs` unchanged behaviour (no MDX touched).
- `npm run build` passes.
- Manual smoke test: in browser console with `window.dataLayer = []`,
  click each share button and verify a `sofia_share_click` event landed
  in `dataLayer`.
- GA4 DebugView (set `?_dbg=1` URL or enable in GA4 settings) shows the
  custom events arriving with correct params within 60s.

---

## 6. Privacy, A11y, and Browser Compatibility

- **No PII**: post slug, language, target name, share URL only. We do not
  emit reader IDs, IPs, or referring search terms beyond what GA4 default
  measurement already captures.
- **Do Not Track**: respect by skipping GA emission when
  `navigator.doNotTrack === "1"` or `globalPrivacyControl === true`.
  Cloudflare Web Analytics also respects this. The DOM CustomEvent still
  fires either way (it never leaves the browser).
- **A11y**: instrumentation is invisible to assistive tech; no aria role
  or focus order changes.
- **Browser compat**: `gtag` already requires modern browsers; the helper
  uses only `typeof`, `try/catch`, and `CustomEvent`, all baseline.
- **No layout shift**: events are JS-side, no DOM injection.

---

## 7. GA4 Data API Integration (weekly_traffic_report future hook)

When `GA4_PROPERTY_ID` and `GA4_SERVICE_ACCOUNT_JSON` env vars are set,
`sofia/scripts/weekly_traffic_report.py` will call the GA4 Data API
`runReport` endpoint to populate the currently `_pending_` cells.

Planned `runReport` body:

```json
{
  "dateRanges": [{ "startDate": "7daysAgo", "endDate": "yesterday" }],
  "dimensions": [
    { "name": "customEvent:share_target" },
    { "name": "customEvent:post_slug" }
  ],
  "metrics": [
    { "name": "eventCount" }
  ],
  "dimensionFilter": {
    "filter": {
      "fieldName": "eventName",
      "stringFilter": { "value": "sofia_share_click" }
    }
  }
}
```

The result feeds a new "Share clicks per channel per post (last 7 days)"
table in the weekly report. Same pattern reused for `sofia_post_reaction`.

Honesty rule (per plans.md §1.1 Analyst boundary): if GA4 env not set OR
no rows returned, report cells say `_pending_` or `no data`, NEVER
fabricated numbers (this is exactly how `weekly_traffic_report.py` was
already patched in iteration 1).

---

## 8. KPI Mapping

| KPI | Direct measure | Proxy measure (via this plan) |
|---|---|---|
| #1 published long-form count | repo scan (already 100% accurate) | — |
| #2 MAU | GA4 `totalUsers` (already auto-tracked) | — (no change) |
| #3 LinkedIn reactions/篇 | LinkedIn API (Phase 3) | **`sofia_share_click` count where `share_target=linkedin`, grouped by `post_slug`** — interim proxy, weekly report must label it as "interim share-click proxy, not LinkedIn reactions" |
| #4 圖片 Numbers 註冊率 | `mdx-nid-coverage.mjs --strict` | — |
| #5 AEO 可索引性 | Cloudflare Worker bot counter (Phase 3) | — |

The KPI #3 interim proxy is the most important contribution of this plan:
it lets Sofia start seeing per-post share velocity within a week of
implementation, rather than waiting for LinkedIn API access.

---

## 9. Acceptance Criteria (for the future implementation PR)

- [ ] `sofia/src/lib/analytics.ts` exists, TypeScript strict, no external deps
- [ ] `trackGa4()` no-ops when `window.gtag` undefined
- [ ] `trackGa4()` no-ops when `navigator.doNotTrack === "1"`
- [ ] All 3 helper functions strip undefined params before forwarding
- [ ] `ShareButtons.astro` Props gains `slug: string` and `lang: "zh"|"en"`
- [ ] All 5 share targets emit `sofia_share_click` on click
- [ ] Copy Link emits `sofia_link_copied` with success/error outcome
- [ ] `Reactions.tsx` emits `sofia_post_reaction` after every successful click
      (not on cap-reached early returns)
- [ ] DOM `CustomEvent("sofia:*")` mirrors all GA4 emissions
- [ ] `npm run build` passes
- [ ] Manual browser test: 5 share clicks + 4 reactions all visible in
      GA4 DebugView within 60s
- [ ] Weekly report dry-run with mock GA4 data renders the new
      share-click table correctly OR shows `_pending_` if env not set
- [ ] No PII leaves the browser; verify by inspecting Network → /collect requests

---

## 10. Phase Mapping & Sequencing

| Phase | Deliverable | Owner |
|---|---|---|
| Phase 2 (now) | This design doc; agreed event taxonomy | Omni → Sofia review |
| Phase 2 implementation | `analytics.ts` + ShareButtons / Reactions edits + acceptance tests | Omni, 1 PR |
| Phase 2 verification | Manual browser smoke test on staging build | Sofia |
| Phase 3 | GA4 Data API integration in `weekly_traffic_report.py`; LinkedIn API direct pull (separate task) | Omni |
| Phase 3 | Optional `sofia_post_view_complete` scroll event | Omni |

Implementation PR should land **before article #2** (W4-W6) so the new
article benefits from instrumentation from day 0 of its D0-D7 promotion.

---

## 11. Open Questions for Sofia

1. **GA4 outbound_click overlap**: keep both (filter in queries) or disable
   auto outbound measurement for share-target domains?
2. **Reaction privacy**: emit `clap_count` per click, or just total? Default
   plan emits per click; if Sofia wants only one event per session, easy
   change.
3. **Do Not Track respect**: enforce strictly (skip GA emission entirely) or
   honour-with-debug-logging? Default plan strictly skips.
4. **Implementation timing**: drop into existing `omni/9c5c6bf5/social-sharing`
   branch (already open at PR #21 / #22), or open a fresh branch
   `omni/9c5c6bf5/ga4-instrumentation`? Branch hygiene preference.

---

## 12. Version History

| Version | Date | Author | Change |
|---|---|---|---|
| v0 | 2026-05-30 | Omni (loop iteration 7) | Initial design doc — no code changes yet |
