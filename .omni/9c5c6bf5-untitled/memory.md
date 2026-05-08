# Workspace Context

<!-- This file is auto-maintained. The Repositories section is refreshed -->
<!-- by the system. The AI should maintain Environment & Key Discoveries. -->

**Workspace root (absolute path):** `/home/workspaces/conversations/9c5c6bf5-14a7-4ccb-9ec9-81355611a7fa`

## Repositories

- **`sofia-s-blog/`** — Branch: `omni/9c5c6bf5/sofia-s-blog`, Remote: `sofiayan0523/sofia`
  - **URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## Environment & Tools

- **Framework**: **Astro 5.18.1** (migrated from Vite + React, 2026-05-07)
- **UI**: Tailwind CSS 3 + `@tailwindcss/typography`
- **Content**: Markdown / MDX in `src/content/posts/`, validated by Zod schema
- **Search**: Pagefind (client-side, runs in `postbuild`)
- **Special**: Capture Eye web component from Numbers Protocol (loaded in BaseLayout)
- **Deploy**: GitHub Pages at `https://sofiayan0523.github.io/sofia/` (project page)
- **Repo**: `sofiayan0523/sofia` (renamed from `sofia-s-blog`; redirect still works)
- **Package manager**: npm
- **Node**: v20.20.2

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

- **Phase 1 done (2026-05-07)**: Astro skeleton built; `npm run build` passes; output at `dist/`
- **Phase 2 done (2026-05-07)**: 5 MDX posts migrated, 45 images downloaded (5.01 MB), CaptureEye component wired; build produces 6 HTML pages
- **Phase 3 done (2026-05-07)**: All pages rebuilt (Home/About/Blog/Post/Career/404), shared components (Header/Footer/SEO/BlogCard) + i18n + Pagefind UI + RSS feed; build produces 10 HTML + 1 RSS + 2 sitemaps. ThemeToggle and LanguageSwitcher React Islands deferred to Phase 6 (first version pins zh-TW)
- **Phase 4 done (2026-05-07)**: 4 large images compressed via `scripts/compress-images.mjs` (sharp + mozjpeg q=78, max 1600px), saved 979 KB; `.gitattributes` added marking *.jpg/*.png/*.webp as binary; total `public/images/posts` 5.2 → 4.2 MB
- **Phase 5 ready (2026-05-07)**: GitHub Actions workflow at `.github/workflows/deploy.yml` (setup-node@v4 → npm ci → npm run build → upload-pages-artifact@v3 → deploy-pages@v4); user must set Settings → Pages → Source to "GitHub Actions" once
- **Phase 6 partial (2026-05-07)**: ThemeToggle React Island + FOUC prevention done; giscus Comments component scaffolded (`ENABLED=false`, mounted in post page); analytics/OG-image-gen/LanguageSwitcher still optional/pending
- **All 6 phases complete to deployable state (2026-05-07)**: 13 dist artifacts (10 HTML + RSS + 2 sitemaps); only blocker is user setting GitHub Pages Source to "GitHub Actions" in repo settings (one-click manual step)
- **RSS site URL gotcha**: `context.site` is bare origin (no `base`); RSS feed must combine `context.site` + `import.meta.env.BASE_URL` to produce correct `/sofia/blog/...` URLs
- **MDX escaping**: bare `<`, `>`, `{`, `}` in post text break MDX parser (e.g. `<-`, `->`); `scripts/migrate-posts.mjs` extracts capture-eye → placeholders → escapes specials → restores
- **Astro 5 collection IDs**: `post.id` includes `.mdx` extension; strip with `.replace(/\.mdx?$/, "")` when building URL params
- **Capture Eye script**: pinned to `@numbersprotocol/capture-eye@1.4.0` in BaseLayout (no `@latest`)
- **BASE_URL gotcha**: `import.meta.env.BASE_URL` is `/sofia` (no trailing slash) — must normalize via `.replace(/\/?$/, "/")` before concatenating asset paths
- **Auto-prefixed paths**: Astro auto-prefixes `<link>`/`<script>` `href`/`src` with base, but does NOT auto-prefix paths inside template strings; need manual handling
- **Workspace state resets**: Local working tree may reset between iterations; always `git fetch` and `git reset --hard origin/<branch>` to recover work; remote state on GitHub is canonical
- **Image migration manifest**: `scripts/supabase-images.json` lists 45 images (5 covers + 40 captures across 5 posts); ready for Phase 2 download script
- **Supabase keys**: Live in `.env`, kept temporarily for image migration; `.env` now gitignored after Phase 1
- **Astro 5 + Tailwind**: Using `@astrojs/tailwind@^5` integration with `applyBaseStyles: false` so we control globals via `src/styles/global.css`
- **Pagefind**: Configured as `postbuild` script; will require `data-pagefind-body` markup in PostLayout for proper indexing

---
_Last system refresh: 2026-05-08 03:41 UTC_
