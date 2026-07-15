# Reconciled Implementation Plan — "The Other Sessions"

**Decision:** Implement only the work that survives the Godin refocus
(`~/baz-refocus`: one audience, one offer, one channel, kill 80% of the menu,
park side projects, *agency leads / Hub is an internal tool*). The 12 saved
plans in `/home/uzer/.kilo/plans` are mostly **extensity** (HubSpot-replacement
upgrade, 24-module agency expansion, 18 new surfaces, 373-entry catalog, a
~1,400-page SEO matrix). Those are **deferred**, not deleted — re-evaluated only
after the agency earns a waitlist + a client-success lead (per `strategy/parked-projects.md`).

**Repos involved (both exist on disk):** `baz` (BAZ agency production site,
Next.js + Supabase + Vercel) and `marketing-hub` (+ `marketing-hub-public`).

---

## IN SCOPE

### Repo: `baz` — DO NOW (agency is the front door)

**A. Security & quality hardening** (sources: `1783600489582-baz-marketing-site-audit.md`, `1783730269220-baz-marketing-site-competitive-dominance.md` Phase 1)
Necessary regardless of strategy; a broken/insecure site undermines any brand.
1. `middleware.ts` — stop short-circuiting `NextResponse.next()` on cookie presence (confirmed at lines 33→35). Validate `baz_session` via `readSessionFromCookies()` **and** check `user.role` before passing through.
2. Add server-side auth guards to `/admin/monitors`, `/admin/analytics`, `/admin/integrations`, `/admin/canva`, `/dashboard`, `/console`.
3. Supabase RLS — replace `USING (true)` with role-scoped policies; confirm anon key cannot read/write protected tables.
4. `/api/auth/me` — return real role from local `users` table, not hardcoded `"member"`.
5. Rate limiting — replace in-memory `Map` in `lib/rate-limit.ts` (ineffective on Vercel, trusts spoofable `x-forwarded-for`) with Vercel KV / Upstash; key on `user.id` for authed routes.
6. Data layer — remove `data/leads.jsonl` dependency (confirmed exists → divergence risk); make `/api/leads` the single source of truth via `getDb()`.
7. Dead code — confirm `motion` already removed from `package.json` (verified absent); update `scripts/quality-inspect.mjs` route lists to match the real tree; add `GET` to `/api/score` or document POST-only.

**B. Finish & validate SEO Phase 3 — validation ONLY, NO expansion** (source: `2026-07-11-baz-phase3-finish-and-validate.md`)
Most of Phase 3 is already shipped; close the real remaining gaps:
1. `app/sitemap.ts` — include matrix routes from `buildMatrix()` (publishable only).
2. `lib/seo.ts` `buildMetadata` — add `og:image:alt` + `og:locale: "en_US"`.
3. Alt-text audit on marketing-page `<Image>`s (decorative → `aria-hidden`); track as a checklist.
4. Run validation sequence: `typecheck` → `lint` → `build` (≈108 launch routes + 20 posts) → Rich Results test → RSS validator → Lighthouse no-regression.
5. **Guardrail (binding):** do NOT add new cities/industries/services to the matrix. The curated launch subset stays; expansion contradicts the refocus's single-channel rule.

**C. Apply the refocus to the real site** (source: `~/baz-refocus` — `assets/positioning.ts`, `index.html`, `manifesto.html`)
`baz-refocus` is the approved prototype/spec; port its positioning into `baz`:
1. Rewrite the homepage to **one hero offer** ("Your marketing system, live in 45 days") — hide the 18-service catalog behind a single CTA (the 13 other services stay in code, not on the homepage).
2. Update the tagline from "The growth partner for ambitious businesses." to the refocus line ("Intensity beats extensity — we market like it.").
3. Add an "Intensity beats extensity" manifesto section + a **permission-asset signup**.
4. Wire the signup to the **existing canonical** `/api/leads` (`source: "refocus_signup"`) — do NOT introduce a new store (reuse `baz-refocus/server.js` logic, adapt to Supabase).

### Repo: `marketing-hub` — only breakage hygiene; everything else DEFERRED

**D. Fix `/api/smarketing` 500** (source: `1783901684188-marketing-coverage-ingest-engine.md` precondition)
Plan claims a duplicate `const avgDealSize` in `src/lib/smarketing.ts`. **Verify first** — current tree shows only one at line 212, so it may already be fixed. If a duplicate/related SyntaxError remains, remove it and finish the Suby feature; confirm `/api/smarketing` → 200. Skip if already clean.

**E. Fix broken `/api/realtime/presence` route** (source: `1784052352305-agency-hub-expansion-plan.md` Phase 0)
Plan claims `apiRoute` not exported, flooding dev server with 500s. **Locate** (`src/app/api/realtime/*`) and fix/guard the route so it stops starving other requests. Skip if already fixed.

---

## DEFERRED (parked — re-evaluate only after agency waitlist + client-success lead)

- `1783600549455-world-class-marketing-upgrade.md` — HubSpot-replacement platform upgrade.
- `1784052352305-agency-hub-expansion-plan.md` — 24-module agency OS, client portals, white-label, autonomous agents.
- `1783901684188-marketing-coverage-ingest-engine.md` — 18 new surfaces + web/GitHub ingest engine (keep only fix D).
- `1783989823147-biggest-marketing-services.md` — 373-entry services catalog + ~30 surfaces.
- `1783969122986-strategy-frameworks-execution-tools.md` — framework execution tools.
- `1783969154760-negotiation-assistant-module.md` — negotiation module.
- `1783969279335-marketing-tests-round3-enterprise.md` — enterprise exam expansion.
- `1783597303132-marketing-hub-agency-plan.md` — agency completeness (portals/invoices/proposals) — overlaps deferred expansion.
- BAZ SEO matrix *expansion* beyond the current curated subset (item B.5 guardrail).

These are recorded in `strategy/parked-projects.md`. Promoting one to ACTIVE requires: (1) agency waitlist exists, (2) client-success lead owns renewals, (3) the item has a named paying customer.

---

## Risks
- **Strategy drift:** teams may "just finish" an extensity plan because it's "already started." Guardrail: any new surface/route/city beyond the listed IN-SCOPE items is out of scope and must be re-approved.
- **Broken claims stale:** the plan claims (smarketing dup const, presence route) may already be resolved — each IN-SCOPE hygiene item is verify-first; do not invent work.
- **Refocus vs existing BAZ SEO:** the `baz` site already has a large SEO footprint; the refocus favors email+LinkedIn as the primary channel. We keep existing SEO correct (B) but freeze expansion; if leadership wants SEO as primary, that's a separate refocus revision, not this plan.

## Validation
- `baz`: `npm run typecheck && npm run lint && npm run build` clean; manual auth-bypass attempt on `/admin` with a forged `baz_session` is denied; `/api/leads` is the only lead writer; homepage shows one offer; signup writes to `/api/leads`.
- `marketing-hub`: `npm run dev` shows no 500 flood from realtime/presence; `/api/smarketing` → 200 (or confirmed already clean).
- Reconciliation check: `git status` on both repos shows ONLY IN-SCOPE files touched; no new surfaces/routes/cities added.

## Open questions
- Is `baz-refocus` kept as a live demo/staging site, or deleted after porting its positioning into `baz`? (Recommended: port, then archive `baz-refocus`.)
- Does leadership accept freezing BAZ SEO-matrix expansion, or treat SEO as the primary channel (would require a refocus revision)?
