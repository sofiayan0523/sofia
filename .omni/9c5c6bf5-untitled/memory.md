# Workspace Context

<!-- This file is auto-maintained. The Repositories section is refreshed -->
<!-- by the system. The AI should maintain Environment & Key Discoveries. -->

**Workspace root (absolute path):** `/home/workspaces/conversations/9c5c6bf5-14a7-4ccb-9ec9-81355611a7fa`

## Repositories

- **`sofia-s-blog/`** — Branch: `omni/9c5c6bf5/sofia-s-blog`, Remote: `sofiayan0523/sofia-s-blog`
  - **URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## Environment & Tools

- **Framework**: Vite 5 + React 18 + TypeScript + SWC
- **UI**: Tailwind CSS 3 + shadcn/ui (Radix primitives) + lucide-react icons
- **Backend**: Supabase (auth, PostgreSQL, storage, edge functions)
- **State**: TanStack Query (react-query) for server state, React Context for auth/theme/language
- **SEO**: react-helmet-async (SPA-only, no SSR)
- **Special**: Capture Eye web component from Numbers Protocol for image provenance
- **Deploy**: Lovable.dev hosted SPA at sofiaspace.lovable.app
- **Package manager**: npm (package-lock.json) + bun (bun.lockb) both present

## Installed Skills

- **`aeo-assessment`** (system)
- **`agent-readiness-generator`** (system)
- **`ai-bot-traffic`** (system)
- **`google-ads`** (system)
- **`google-workspace`** (system)
- **`morning-brief`** (space)
- **`ms-office-suite`** (system)
- **`omni-help`** (system)
- **`skill-creator`** (system)
- **`z-sync`** (system)

## Key Discoveries

- **i18n partially implemented**: `LanguageContext` with `t()` exists but many UI strings are hardcoded (Index stats, Blog headers, Admin pages, NotFound)
- **Fallback blog posts**: `data/fallbackBlogPosts.ts` is 31k+ tokens; bundles full article content as offline fallback
- **Capture Eye script**: loaded via CDN `@latest` tag in 3 separate files (CaptureEye.tsx, About.tsx, Career.tsx) - duplicated logic
- **Route guards**: Admin/Login/PostEditor use `navigate()` during render instead of `<Navigate />` component
- **Dead deps**: `next-themes`, `recharts`, many unused shadcn/ui components
- **`.env` not in `.gitignore`**: Supabase anon key committed to repo history

---
_Last system refresh: 2026-05-07 07:26 UTC_
