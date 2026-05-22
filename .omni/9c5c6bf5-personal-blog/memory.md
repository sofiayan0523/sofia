# Workspace Context

<!-- This file is auto-maintained. The Repositories section is refreshed -->
<!-- by the system. The AI should maintain Environment & Key Discoveries. -->

**Workspace root (absolute path):** `/home/workspaces/conversations/9c5c6bf5-14a7-4ccb-9ec9-81355611a7fa`

## Repositories

- **sofia** (https://github.com/sofiayan0523/sofia.git): Cloned in the root workspace. Main personal blog powered by Astro 5 and TailwindCSS.

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

- **Translations**: Localized dictionaries are defined in `src/i18n/zh.ts` and `src/i18n/en.ts`. Added translation keys for blog sharing (`share.*`) and post reactions (`react.*`).
- **Social Sharing**: Implemented `src/components/ShareButtons.astro` supporting one-click sharing for X (Twitter), Facebook, LinkedIn, LINE, and a "Copy Link" clipboard utility with visual animation feedback.
- **Interactive Reactions**: Implemented `src/components/Reactions.tsx` as an interactive, beautifully animated React component supporting Claps (up to 10), Loves, Insights, and Amazes.
- **Database Persistence**: Implemented an atomic SQL migration `supabase/migrations/create_post_reactions.sql` creating a `post_reactions` table and a `public.increment_post_reaction` stored procedure (RPC) for atomic counter increments. Designed a robust local client fallback using `localStorage` if the table is not yet created.

---
_Last system refresh: 2026-05-22 11:08 UTC_
