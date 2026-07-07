# Deploying Marketing Hub — Supabase + Vercel (proper setup)

Marketing Hub runs on **Next.js**, deployed to **Vercel**, with **Supabase** (Postgres)
as the production database. Locally it falls back to `better-sqlite3`; in production
(serverless) it **must** use Supabase — `better-sqlite3` cannot persist on Vercel.

A production guard in `src/lib/db-adapter.ts` throws at runtime if Vercel is detected
but Supabase env vars are missing, so a misconfigured deploy fails loud instead of
silently using a broken SQLite path.

## Project facts (already set up)
- **Supabase project ref:** `fgjxkexgopllieggucws` → project URL `https://fgjxkexgopllieggucws.supabase.co` (already `supabase link`ed; see `supabase/.temp/project-ref`).
- **Vercel:** framework `nextjs`, build `next build`, install `pnpm install --frozen-lockfile` (uses **pnpm**, lockfile `pnpm-lock.yaml`).
- **Migrations:** `supabase/migrations/0000{1..4}_*.sql` (initial schema → department upgrade → agency ops → RLS + seed).
- **Env files** (`.env.local`/`.env.production`/`.env.vercel`) are gitignored — safe.

## 1. Get Supabase keys
In the Supabase dashboard → **Settings → API** for project `fgjxkexgopllieggucws`, copy:
- **Project URL** → `https://fgjxkexgopllieggucws.supabase.co`
- **anon public** key
- **service_role** key (secret — used by `src/lib/finance/supabase-finance.ts`)

## 2. Apply migrations to Supabase (review first)
```bash
supabase link --project-ref fgjxkexgopllieggucws   # already linked; re-run if needed
supabase db push                                  # applies supabase/migrations/*.sql
```
Review the 4 migrations before pushing to a project that already has data.

## 3. Set production env vars in Vercel
Via Vercel dashboard (Project → Settings → Environment Variables → Production) **or** CLI:
```bash
vercel env add SUPABASE_URL production            # https://fgjxkexgopllieggucws.supabase.co
vercel env add SUPABASE_ANON_KEY production       # anon public key
vercel env add SUPABASE_SERVICE_ROLE_KEY production  # service_role key (SECRET)
vercel env add MARKETING_HUB_PUBLIC_URL production   # https://roi-marketing.vercel.app (or your domain)
vercel env add MARKETING_HUB_PUBLIC_HOST production  # roi.marketing (or your host)
# Optional: ADMIN_EMAIL / ADMIN_NAME / ADMIN_PASSWORD (admin bootstrap) — or leave blank to use /setup
# Optional: Stripe keys (STRIPE_SECRET_KEY, etc.) if billing is enabled — see .env.example
```

## 4. Deploy
```bash
vercel deploy --prod        # or push to the linked git branch → Vercel auto-deploys
```

## 5. Verify
- Visit the production URL.
- Vercel logs should **not** contain the `[db-adapter] Production (Vercel) requires…` error
  (that error fires only if SUPABASE_URL/SUPABASE_ANON_KEY are unset → means env vars aren't set).
- API routes under `/api/finance/*` should read/write Supabase (not the local SQLite fallback).

## Notes
- **pnpm** is the package manager (don't use npm/yarn — `vercel.json` installCommand is pnpm).
- **`next.config.js`** sets `typescript.ignoreBuildErrors` + `eslint.ignoreDuringBuilds: true` (deploy-friendly) and externalizes `better-sqlite3` (used only in local dev).
- The Supabase client is **server-side only** (API routes), so `SUPABASE_URL`/`SUPABASE_ANON_KEY` (not `NEXT_PUBLIC_*`) are correct. `SUPABASE_SERVICE_ROLE_KEY` is privileged — never expose it client-side.
- Build is heavy; run `pnpm build` locally to confirm deploy-readiness (can take a few minutes; needs ample RAM).