# Workspace Context

<!-- This file is auto-maintained. The Repositories section is refreshed -->
<!-- by the system. The AI should maintain Environment & Key Discoveries. -->

**Workspace root (absolute path):** `/home/workspaces/conversations/9c5c6bf5-14a7-4ccb-9ec9-81355611a7fa`

## Repositories

- **`personal-auto/`** — Branch: `omni/9c5c6bf5/personal-auto`, Remote: `sofiayan0523/personal-auto`

- **`sofia/`** — Branch: `omni/9c5c6bf5/social-sharing`, Remote: `sofiayan0523/sofia`
  - **URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

- **`sofia-s-blog/`** — Branch: `omni/9c5c6bf5/sofia-s-blog`, Remote: `sofiayan0523/sofia-s-blog`
  - **URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## Environment & Tools

- **Framework**: Astro v5.0.0
- **View Library**: React v18.3.0 (configured as Astro integration)
- **CSS**: TailwindCSS v3.4.0 with `@tailwindcss/typography`
- **Database**: Supabase
  - Local Dev/Workspace Database: `kdmmqimuvvcunmwyafeu.supabase.co`
  - Production Database: `hbzabvlkkksdzofjpnnq.supabase.co` (referenced in storage assets)
- **Asset Registration**: Numbers Protocol Mainnet (handled via `scripts/register-with-numbers.mjs`)
- **Search Engine**: Pagefind v1.5.2

## Key Discoveries

- **Hosting & Analytics**: The site is hosted on GitHub Pages (`sofiayan.cc`) using client-side JavaScript tracking (Google Analytics 4 & Cloudflare Web Analytics beacon). These client-side tools cannot log backend AI agents or crawler bots (like GPTBot, ClaudeBot, etc.) because these bots fetch raw HTML and do not execute JavaScript tracking code.
- **Agent Readiness & AEO**: The site features a world-class, 100% compliant AI-discoverable structure, including `/robots.txt` explicitly allowing 15+ major AI crawlers, a human-readable `/llms.txt` documentation index, and a machine-readable `/agent.json` (Agent Web Protocol v1.0) defining content licensing and AI capabilities.
- **Translations**: Localized dictionaries are defined in `src/i18n/zh.ts` and `src/i18n/en.ts`. Added translation keys for blog sharing (`share.*`) and post reactions (`react.*`).
- **Social Sharing**: Implemented `src/components/ShareButtons.astro` supporting one-click sharing for X (Twitter), Facebook, LinkedIn, LINE, and a "Copy Link" clipboard utility with visual animation feedback.
- **Interactive Reactions**: Implemented `src/components/Reactions.tsx` as an interactive, beautifully animated React component supporting Claps (up to 10), Loves, Insights, and Amazes.
- **Database Persistence**: Implemented an atomic SQL migration `supabase/migrations/create_post_reactions.sql` creating a `post_reactions` table and a `public.increment_post_reaction` stored procedure (RPC) for atomic counter increments. Designed a robust local client fallback using `localStorage` if the table is not yet created.
- **Harness Plan**: `.omni/harness/plans.md` v1 defines the 12-week blog content production, operations, promotion, KPI monitoring, approval gate, and AI bot observability plan; `.omni/harness/goal.md` holds the scoring criteria.
- **Harness Review**: Loop 1 reviewer scored `.omni/harness/plans.md` v1 at 3/5 and wrote required fixes to `.omni/harness/plan-suggestions.md` (KPI data contracts, AI bot decision tree, UTM conflict, posting-time recommendations, Phase 1 scope).
- **Harness Plan v2**: Loop 2 updated `.omni/harness/plans.md` with metrics data contracts, AI bot observability decision tree, UTM alignment with `docs/utm-convention.md`, Asia/Taipei posting-time windows, and Phase 1 W1/W2/W3 mini-milestones; `.omni/harness/goal.md` baseline is now 9 posts with target ≥15.
- **Harness Approval**: Loop 3 Plan Reviewer scored `.omni/harness/plans.md` v2 at 5/5 on 2026-05-28 and prepended `# APPROVED`; loop should stop pending independent verification.
- **Harness Verification**: Iteration 5 independent verification confirmed `.omni/harness/plans.md` has a single `# APPROVED`, final score 5/5, and `.omni/harness/plan-suggestions.md` contains the loop 3 scorecard and web evidence.
- **Harness Execution Setup (2026-05-29)**: Phase 0 complete. Z minutes record `11deafa9-f5fc-4035-ab63-57c37f822a33` created as daily report destination (title `[Harness] sofia-s-blog 12-week content production, operations and promotion`); config saved to `.omni/harness/config.md`; primary assignee + mention = Sofia (`54d58944-1c93-4711-9a90-0753b42e2b17`); operating timezone Asia/Taipei.

---
_Last system refresh: 2026-05-30 06:50 UTC_
