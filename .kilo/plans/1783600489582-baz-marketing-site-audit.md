# BAZ Marketing Site — Full Code Review / Audit Plan

## Context
`/home/uzer/baz` is the "BAZ Marketing Agency" production site: **Next.js 14 (App Router) + TypeScript + Tailwind + Supabase + Vercel**, with a local `better-sqlite3` store used alongside Supabase. The user asked for a **full code review/audit** of the site — beyond the two already-known flags in the stale `quality-report.md` (2026-06-29):
- `/api/score` returns **405** (inspector does `GET`; route is `POST`-only)
- `content/testimonials.ts` has **9 `placeholder: true`** flags

This is a **read-only audit**. Deliverable = a findings report (file paths + line numbers, severity, recommended fix). Source changes are **out of scope** here and are a follow-up for an implementation-capable agent.

## Deliverable
Write findings to `AUDIT.md` at the repo root, grouped by severity:
- **Critical** (auth bypass, secret leak, data exposure) — must fix before next deploy
- **High** (broken/abusable behavior, SEO/accessibility regressions)
- **Medium** (maintainability, perf, design-system drift)
- **Low** (nits, dead code, stale flags)

Include a "Must-fix before deploy" summary at the top.

## Methodology (ordered)
1. **Baseline health** (capture before review)
   - Start dev server: `npm run dev` (port 3000) in background.
   - `npm run inspect` → fresh `quality-report.json/.md` (pages, APIs, placeholders, SEO, design).
   - `npm run typecheck`, `npm run lint`, `npm run build` → record pass/fail + first errors.
2. **Security review (highest priority)** — inspect these in particular:
   - `middleware.ts:14-15` — short-circuits `NextResponse.next()` if `baz_session` cookie **exists**, without validating it. Likely **auth bypass** for `/admin`, `/console`, `/hub`, `/portal`, `/dashboard`. Verify whether each protected server component re-validates the token (`readSessionFromCookies()` in `lib/auth.ts`) AND checks `user.role`. Confirm an attacker cannot forge a session cookie to reach protected pages/APIs.
   - `lib/rate-limit.ts` — in-memory `Map` does **not** work across Vercel serverless instances, and trusts spoofable `x-forwarded-for`. Rate limits are effectively unenforced in prod. Recommend external store (Vercel KV/Upstash) and bind limiting to authenticated user where possible.
   - Secrets: confirm `.env.local` is git-ignored (not committed); `.env.example` contains no real values; `SUPABASE_SECRET_KEY` / LLM / Canva keys used only server-side; none leak into client bundles. (`lib/supabase-client.ts` admin client, `lib/llm.ts`, `lib/canva.ts`.)
   - RLS: review `supabase/migrations/00002_rls_policies.sql`, `00003_*`, `00004_*` — ensure the publishable/anon key cannot read/write protected tables; admin paths use `createAdminClient()` only server-side.
   - API route authorization: `/api/leads` (GET/PATCH need `user` but any valid session — check role), `/api/agents`, `/api/feedback`, `/api/search`, `/api/lead-portal`, `/api/auth/me`, `/api/score`, `/api/ai`. Confirm each enforces auth where it should.
   - `/api/ai` — confirm it is **not** an open LLM proxy that leaks keys or enables prompt injection / SSRF.
   - Input handling: confirm all SQL is parameterized (leads route is); check other POST routes validate input; check for `dangerouslySetInnerHTML` / HTML rendering of user content (testimonials, posts, portal) and sanitization.
   - Cookie flags: `secure` only in prod (ok), `httpOnly` session (ok); `baz_user` cookie is client-readable (`lib/auth.ts:96`) — document as acceptable.
3. **Known flags**
   - `/api/score` 405: route is `POST`-only (`app/api/score/route.ts`) while `quality-inspect.mjs` GETs it. Decision: add `GET`/`HEAD` (or document POST-only) **or** treat 405 on POST-only routes as pass in the inspector. Confirm intended contract with `LiveAgentDemo`.
   - `content/testimonials.ts` (9 `placeholder: true`): replace with real copy or explicitly mark intentional; also check `content/_NEW_TESTIMONIALS.ts`.
4. **SEO** — run inspector SEO; verify **all** routes (not just the 6 checked) have title/description/og:title/og:image/canonical/jsonLd; check dynamic `[slug]` pages (`services`, `case-studies`, `insights`, `industries`), `sitemap.ts`, `robots.ts`, `feed.xml`, `manifest.ts`, and OG routes (`/og`, `/stance-og`, `/case-studies-og`, `/methodology-og`).
5. **Accessibility** — interactive components: `Modal`, `Toast`, `Tooltip`, `ContextMenu` (`components/primitives`), `SearchBox`, `CookieBanner`, `Cursor`. Check keyboard nav, focus management/trap, ARIA, alt text, reduced-motion (`prefers-reduced-motion`), and contrast in forced-dark `contrast-layer.css` / `color-layer.css`.
6. **Performance** — duplicate animation libs (`framer-motion` + `motion`); Next `<Image>` usage; server vs client component split; `better-sqlite3` native module behavior on Vercel (serverless build/runtime); caching/headers on API + OG routes.
7. **Design-system compliance** — verify token usage (no hardcoded hex), forced dark mode, square corners (`* { border-radius: 0 }`), 4-layer CSS import order in `app/layout.tsx` (`globals → aether-theme → aether-monochrome → color-layer` last), and `color-layer.css` single-seed recoloring. Flag any component hardcoding color.
8. **Data architecture** — clarify source of truth between Supabase (`lib/db/supabase.ts`, `lib/supabase.ts`) and local sqlite (`lib/db.ts`, `lib/db/pg-worker.js`, `data/baz.db`). Ensure migrations are consistent and `data/archive/*` is intentional.
9. **Tests / CI** — `playwright.config.ts` + `tests/` coverage; `.github/workflows/deploy.yml` runs typecheck+lint+E2E on PR / deploy on main. Note gaps.

## Validation
- After the audit (read-only), re-run `npm run inspect` baseline and `npm run build` to confirm no regressions were introduced during any later fixes.
- For each Critical/High, the follow-up implementation agent should re-audit the specific file:line after applying the recommended fix.

## Risks / caveats
- `npm run inspect` requires a running dev server on `:3000`.
- Audit does not modify source; applying fixes is a separate step (switch to implementation-capable agent).
- Cannot push/commit or run CI from this planning context.

## Open question (recommendation)
Recommend delivering the **findings report only** first; treat applying fixes (especially the Critical auth-bypass if confirmed) as a separate authorized follow-up.
