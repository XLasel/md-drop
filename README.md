# MD-Drop

[![CI](https://github.com/XLasel/md-drop/actions/workflows/ci.yml/badge.svg)](https://github.com/XLasel/md-drop/actions/workflows/ci.yml)

Write Markdown, share a link — no account required. Sign in to keep notes in your dashboard, edit with a token, and polish drafts with AI.

**Live demo:** _add your Vercel URL after the first deploy_

## Features

- Markdown editor with live preview (Shiki syntax highlighting)
- Instant share via short link (`/v/:slug`)
- Anonymous notes with optional expiry; signed-in users get a personal dashboard
- OAuth sign-in (GitHub / Google via Supabase)
- Light / dark theme and EN / RU locale
- Optional AI formatting through a Vercel Edge Function (OpenRouter)

## Stack

| Layer      | Tech                                       |
| ---------- | ------------------------------------------ |
| Frontend   | Vue 3, TypeScript, Vite, Pinia, Vue Router |
| Styling    | SCSS CSS Modules                           |
| Backend    | Supabase (Auth, Postgres, RLS)             |
| Serverless | Vercel Edge Function (`api/format.ts`)     |
| Deploy     | Vercel (static SPA + CDN)                  |
| CI         | GitHub Actions                             |

## Getting started

**Requirements:** Node.js 22+, npm

```bash
git clone https://github.com/XLasel/md-drop.git
cd md-drop
npm ci
cp .env.example .env
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Dev server                       |
| `npm run build`        | Type-check + production build    |
| `npm run preview`      | Preview production build locally |
| `npm run format`       | Format with Prettier             |
| `npm run format:check` | Check formatting (used in CI)    |

### Environment variables

| Variable                 | Where                        | Required                      |
| ------------------------ | ---------------------------- | ----------------------------- |
| `VITE_SUPABASE_URL`      | Local `.env`, Vercel (build) | Yes                           |
| `VITE_SUPABASE_ANON_KEY` | Local `.env`, Vercel (build) | Yes                           |
| `OPENROUTER_API_KEY`     | Vercel (runtime only)        | No — AI formatting            |
| `OPENROUTER_MODEL`       | Vercel (runtime only)        | No — defaults to Gemini Flash |

See [`.env.example`](.env.example) and [Supabase setup](docs/operations/supabase-setup.md).

## Deployment

**Hosting:** [Vercel](https://vercel.com) — connect the GitHub repo, framework preset **Vite**.

| Setting           | Value           |
| ----------------- | --------------- |
| Build Command     | `npm run build` |
| Output Directory  | `dist`          |
| Install Command   | `npm ci`        |
| Production Branch | `main`          |

`vercel.json` already configures SPA rewrites and picks up `api/format.ts` as an Edge Function.

### Checklist

1. Create a **production** Supabase project
2. Apply migrations: `npm run db:link` → `npm run db:push` (see [Supabase setup](docs/operations/supabase-setup.md))
3. Add GitHub secrets for auto-migrations: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_ID`, `SUPABASE_DB_PASSWORD`
4. In Supabase → **Authentication → URL Configuration**, set Site URL and redirect URLs to your Vercel domain (`/dashboard`)
5. Add env vars in Vercel (Production + Preview if you use PR previews)
6. Push to `main` — Vercel deploys the app; GitHub Actions runs CI and applies DB migrations

### CI / CD flow

```
feature branch → PR → GitHub Actions (format + build) + Vercel Preview
                → merge to main → Production deploy
```

No Docker or separate CD pipeline needed — Vercel handles deploys from Git.

## Project structure

```
src/
  app/          # shell, router, global styles
  pages/        # route-level views
  widgets/      # composite UI blocks
  features/     # user actions (share, format, auth, …)
  entities/     # domain models and Supabase API
  shared/       # UI kit, i18n, utilities
api/            # Vercel Edge Functions
supabase/       # SQL migrations
```

## License

MIT — see [LICENSE](LICENSE).
