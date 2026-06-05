# Site CTA & Authority Guardrails

Last updated: 2026-06-04 / loop iteration 9

This document turns Actions 17 and 18 into a maintenance checklist. The site should route readers clearly without flattening Sofia's voice into a generic consultant page.

## Page Roles

| Route | Primary job | Primary CTA | Secondary CTA |
|---|---|---|---|
| `/` | Positioning and routing hub | `/speaker` for business visitors | `/blog` and `/about` for readers / credibility |
| `/about` | Personal origin story and credibility | `/blog` after story | `/speaker` after proof |
| `/career` | Chronological proof archive | `/speaker` after speaking / media proof | `/blog` for current thinking |
| `/speaker` | Conversion page for talks and workshops | email enquiry | LinkedIn DM |
| `/ai-coworker-methodology` | Owned framework / canonical reference | `/speaker` | related AI pillar posts and Numbers / Omni infrastructure |
| `/blog` | Essays, search, and discovery | AI series / post grid | category-aware post CTAs |

## Blog Post CTA Rules

- `ai-insights` posts should point to `/ai-coworker-methodology` first and `/speaker` second, only after the essay body and series context.
- `travel` posts should point to `/about` first and `/blog` second. They should not route to `/speaker` by default.
- Future `thoughts` posts should choose based on the essay role:
  - founder / AI field note: `/ai-coworker-methodology` or `/speaker`
  - travel-work crossover: `/about` or `/blog`
  - provenance reflection: `/career` or a relevant Numbers / Capture source

## Authority Signal Rules

- Keep quantitative claims in pages that carry proof context, especially `/speaker`, `/career`, and source-backed posts.
- Do not promote claims like `7+`, `13萬`, `60億`, or `67M+` in hero copy unless the same page also provides source ownership.
- Use public receipts, source links, or context notes instead of stacking proof metrics in every section.
- Keep playful and travel links separated from professional conversion paths.

## Voice Guardrails

- Prefer scene-first language: a meeting, an awkward question, a field failure, a travel detail.
- Avoid generic phrases such as one-stop solution, unlock growth, AI revolution, business transformation, or ranked-list framing.
- CTA labels should describe what the reader is trying to do, not only the page name.
- A good page should still sound like Sofia observing something before selling anything.

## Local Validation

```bash
npm run check:brand
```
