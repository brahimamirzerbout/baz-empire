# Master Plan — BAZ Marketing Business: Full Session Blueprint

**Scope of this document:** a consolidated, implementation-ready plan that walks the
*entire* session end-to-end — the Godin diagnosis, the refocus prototype, the
Ogilvy × Godin collaboration, the reconciliation of 12 saved planning sessions, and
the reconciled implementation that was applied to the `baz` repo. Use it as the
single source of truth for what exists, what shipped, what is deferred, and what
remains.

**Strategic spine (unchanged all session):** *Intensity beats extensity.*
One audience. One offer. One channel. Kill 80% of the menu. Park the side projects.
The agency leads; the Marketing Hub is an internal tool, not the product sold.

---

## 1. The strategy that drives everything

### 1.1 Godin inspection (session start)
Diagnosis of the marketing business (`baz` agency + `marketing-hub` product + many
side projects). Core findings:
- Tagline "The growth partner for ambitious businesses" is a nobody-sentence (everyone = no one).
- 14 services + 30-module tool = a Swiss Army knife, not a Purple Cow.
- Two businesses run as one (agency + SaaS). Scattered across `empire`, `nova-with-bank`, `FlowDeck`, `brand-aether`, `bazdev`, `baz-agent-system`, `baz-corpus`.
- Assets, not a tribe; no permission asset; best idea ("Intensity beats extensity") buried in a docs folder.
- Org chart has a MISSING client-success seat.

### 1.2 Refocus prototype — `~/baz-refocus` (built, standalone, zero-dep)
The 9 inspection "parts" coded as a runnable site:
- `assets/positioning.ts` — Godin layer: smallest viable audience (technical founders), one hero offer (45-day system, $9,500 + 10% lift), single channel (email+LinkedIn).
- `index.html` — story landing, one offer, no feature grid, permission-asset signup.
- `manifesto.html` — "Intensity beats extensity" made public.
- `parked.html` + `strategy/parked-projects.md` — side projects explicitly parked.
- `playbook.html` + `strategy/one-channel-playbook.md` — one-channel rule of one.
- `roles/client-success.md` — the missing seat.
- `server.js` — permission asset (`POST /api/subscribe`) using Node built-ins only.
- `strategy/positioning.md`, `strategy/decision.md` — agency-vs-product decision (agency leads).

### 1.3 Ogilvy × Godin collaboration — `~/baz-refocus`
- `strategy/ogilvy-godin.md` — the synthesis: Godin *chooses the ONE*; Ogilvy *crafts it to world-class and wraps it in a 360° experience scoped to that one tribe*.
- `assets/brand-system.ts` — Ogilvy layer: Big Idea, positioning sentence, voice rules + banned words, message hierarchy, **scoped** 360° touchpoint map. Imports `positioning.ts` so craft stays anchored to focus.
- `brand.html` — 360° brand experience page. `brief.html` — Ogilvy creative brief for the 45-day offer.

### 1.4 Reconciliation of the 12 saved sessions
The 12 plans in `/home/uzer/.kilo/plans` were reviewed. Most are **extensity**
(HubSpot-replacement upgrade, 24-module expansion, 18 surfaces, 373-entry catalog,
~1,400-page SEO matrix). Decision (user-approved): **reconcile with refocus** —
implement only what survives the focus; defer the rest (park, don't delete).
See `1784114622138-reconcile-other-sessions-plan.md` for the full reconciliation.

---

## 2. Current implementation status (verified against code)

### Shipped to `baz` working tree (uncommitted — see §4)
| Item | File(s) | Status |
|---|---|---|
| Tagline → refocus line | `lib/site.ts` | ✅ done |
| Home: single 45-day offer + manifesto + signup | `app/page.tsx`, `components/sections/RefocusManifesto.tsx` (new), `components/sections/index.ts` | ✅ done |
| Services catalog collapsed to one CTA | `app/page.tsx` (replaced `<ServicesOverview/>`) | ✅ done |
| Permission-asset signup → canonical `/api/leads` (`source:"refocus_signup"`) | `RefocusManifesto.tsx` | ✅ done |
| Leads single-source: removed orphaned JSONL store | deleted `lib/leads-store.ts` + `data/leads.jsonl`; `StatusButtons.tsx` uses local `LeadStatus` | ✅ done |
| Security/quality hardening | middleware format-gate (by-design safe), all `/admin/*`+`/dashboard` call `requireAdmin`, `/api/auth/me` returns real role, RLS restrictive in `00005_rls_policies_restrict.sql` | ✅ already done in code; no change needed |
| SEO Phase 3 validation | sitemap includes matrix routes, `og:image:alt`+`og:locale` present, B&W design uses no `<img>` | ✅ already done; no change needed |
| Build | `npm run typecheck` + `lint` clean; `next build` → 1531/1531 pages, 0 errors | ✅ verified |

### `marketing-hub` — deferred; no changes made
- D (`/api/smarketing` 500): already fixed (single `avgDealSize` at line 212). ✅
- E (`/api/realtime/presence`): already fixed (POST/GET exported). ✅
- All expansion plans parked (per §3).

### Prototype artifacts (still on disk)
- `~/baz-refocus` — full prototype + strategy docs (Godin + Ogilvy). NOT deleted.
- `~/baz-refocus` is NOT a git repo of its own; lives inside the home dir.

---

## 3. DEFERRED — parked, re-evaluate only after agency waitlist + client-success lead
Recorded in `baz-refocus/strategy/parked-projects.md`. Promotion gate (all three):
(1) agency has a waitlist, (2) a client-success lead owns renewals, (3) the item has
a named paying customer.
- `world-class-marketing-upgrade.md` — HubSpot-replacement platform upgrade.
- `agency-hub-expansion-plan.md` — 24-module agency OS, portals, white-label, agents.
- `marketing-coverage-ingest-engine.md` — 18 surfaces + ingest engine.
- `biggest-marketing-services.md` — 373-entry catalog.
- `strategy-frameworks-execution-tools.md`, `negotiation-assistant-module.md`, `marketing-tests-round3-enterprise.md`, `marketing-hub-agency-plan.md`.
- BAZ SEO matrix *expansion* beyond the current curated subset (freeze per refocus).

---

## 4. REMAINING WORK (implementation-ready)

These are the only open implementation tasks. Everything else in the session is done.

1. **Review & commit the `baz` refocus changes.** The shipped edits are uncommitted
   working-tree changes. Run `git status` in `baz`; stage only the refocus files
   (`app/page.tsx`, `lib/site.ts`, `components/dashboard/StatusButtons.tsx`,
   `components/sections/index.ts`, `?? components/sections/RefocusManifesto.tsx`,
   `D lib/leads-store.ts`). Do **not** commit the 3 unrelated pre-existing WIP files
   (`app/industries/[slug]/page.tsx`, `content/industries.ts`, `types/index.ts`) —
   those are earlier SEO-session changes, out of scope for this plan.
2. **Resolve open question A — archive `baz-refocus`.** Recommended: the positioning
   is now ported into `baz`, so archive `~/baz-refocus` (zip/move out of the active
   path) to avoid drift. Keep `ogilvy-godin.md` + `brand-system.ts` thinking if useful.
3. **Resolve open question B — SEO primary channel.** Confirm leadership accepts
   freezing BAZ SEO-matrix expansion (email+LinkedIn is the refocus primary channel).
   If SEO is to be primary, that is a separate refocus revision, not this plan.
4. **Stand up the permission asset properly.** `RefocusManifesto` posts to `/api/leads`
   (SQLite). Add a lightweight "subscriber" flag/view or a `subscribers` table so the
   permission list is queryable for the weekly essay (currently every signup is just a
   lead with `source:"refocus_signup"`). Optional but needed before sending emails.
5. **Hire/assign the client-success lead** (per `roles/client-success.md`) — the gate
   that unlocks promoting any deferred plan.

---

## 5. Risks
- **Uncommitted changes:** the `baz` refocus edits are live in the working tree but
  not committed; a stray `git reset` or deploy could lose them. Commit (item 4.1) soon.
- **Strategy drift:** teams may "finish" a parked extensity plan because it's started.
  Guardrail: any new surface/route/city beyond this plan is out of scope, re-approve first.
- **Permission asset is a lead, not a list:** until item 4.4, the signup feeds `/api/leads`
  with no separate subscriber segment — sending the weekly essay requires segmentation.

## 6. Validation (re-run after any change)
- `baz`: `npm run typecheck && npm run lint && npm run build` clean; homepage shows one
  45-day offer; signup writes a lead with `source:"refocus_signup"`; `/api/leads` is the
  only lead writer; no new routes/surfaces/cities added.
- Reconciliation: `git status` in `baz` shows ONLY refocus + leads-consolidation files
  (plus the pre-existing SEO WIP, left untouched). `marketing-hub` untouched.

## 7. Open questions (need user decision)
- A. Archive `~/baz-refocus` now that positioning is in `baz`? (Recommended: yes.)
- B. Freeze BAZ SEO-matrix expansion, or make SEO the primary channel? (Refocus says freeze.)
- C. Stand up a real `subscribers` segment for the weekly essay, or keep signups as leads?
