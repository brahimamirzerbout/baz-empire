# Marketing Hub — Full Expansion & Domination Roadmap

## Context (what already exists)
The Marketing Hub (`~/marketing-hub`, Next.js 14 + SQLite) is an all-in-one marketing
command center with 120+ sections. We have already:
- A taxonomy of **24 agency types** (`src/lib/agencyTypes.ts`) + an **Agency Directory** (`/agency-directory`).
- **24 working agency modules** built on the seed-surface framework: each is its own `seed_<slug>` SQLite table (lazy migration + seed) with full CRUD via `/api/seed/[slug]` and a `SeedSurface` UI, reachable at `/agency/[slug]` and from the new **Agencies** sidebar group.
- Real foundations to build on: **workspaces with an `agency` plan tier** (`src/lib/workspace.ts`), an **AI agent runtime** (`src/lib/agents`: gather/run/quality-gate/index), **Stripe billing** (`src/lib/billing.ts`), and a CRM/Accounts section.

Goal: expand so the Hub *is* a full agency OS that dominates every marketing discipline — depth (rich modules), platform (client portals + white-label + per-client billing), and AI (copilot → autonomous agents) — sequenced.

## Decisions (confirmed)
1. **Axis:** All of the above, sequenced (master roadmap).
2. **Module data model:** One polymorphic `agency_items` table + a `AGENCY_FIELD_SCHEMA` registry defining per-type fields/stages/KPIs. All 24 deepen uniformly via ONE migration (no 24 bespoke tables).
3. **Client model:** `clients` entity under an `agency`-plan workspace; module items link to a client; client portal = scoped, white-labeled view + per-client Stripe billing. Builds on existing workspace tiers + CRM.
4. **AI scope:** Phased — assistive **copilots** inside modules first (generate/summarize/score), promoted later to **autonomous per-agency agents** in the existing agent runtime.

## Target architecture
- **`agency_items`** (unified): `id, workspace_id, agency_type (slug), client_id (nullable FK), status, category, title, body, url, field_values (JSON, keyed by registry field), meta (JSON), created_by, created_at, updated_at`. Indexes on `(workspace_id, agency_type)`, `client_id`.
- **`clients`**: `id, workspace_id, name, slug, status, theme (logo_url, primary_color, font), stripe_customer_id, created_at`.
- **`AGENCY_FIELD_SCHEMA`** (code registry in `src/lib/agencyTypes.ts` / new `agencySchema.ts`): per `agency_type` → `{ fields: [{key,label,type,options?}], stages: string[], kpis: [{key,label,formula}] }`. Replaces the seed-surface `statuses/categories` config and adds typed fields + KPI defs.
- **API:** introduce `/api/agency/[type]` (list/create/update/delete + `?client=`) and `/api/clients` (CRUD + portal token). Keep `/api/seed/[slug]` working via an adapter during migration, then deprecate.
- **Agents:** `src/lib/agents/agency/<type>.ts` definitions; copilot actions call the agent runtime's `run`/`quality-gate`; autonomous mode adds scheduled `gather`+act loops with human-in-the-loop guardrails.

## Phased plan

### Phase 0 — Foundation & migration (prereq)
1. Add `agency_items` + `clients` tables (self-healing migration, same pattern as seed-surface).
2. Build `AGENCY_FIELD_SCHEMA` registry for all 24 types (migrate existing `statuses`/`categories`; add domain fields + KPI defs).
3. Write **migration script** that backfills every `seed_<slug>` row into `agency_items` (`agency_type = slug`, preserving `id`/`created_at`). Snapshot `data/hub.sqlite` first.
4. Add `/api/agency/[type]` + `/api/clients`; ship adapter so `/agency/[slug]` + directory keep working.
5. **Hygiene:** fix the pre-existing broken `/api/realtime/presence` route (`apiRoute` not exported) — it currently floods the dev server with 70–230s 500s and starves all other requests.

### Phase 1 — Deepen the 24 agency modules (depth)
6. Render each module from `AGENCY_FIELD_SCHEMA`: typed field forms, stage/kanban pipeline view, category filters.
7. **KPI/metrics layer:** compute each module's KPIs live from `field_values` + linked hub sections (e.g. SEO/SEA → rankings/ROAS; App → builds/shipped). Show on module header.
8. **Reporting:** per-module summary + CSV/PDF export.
9. **Copilots (1b):** in-module AI generate/summarize/score via agent runtime `run`/`quality-gate`.

### Phase 2 — Platform / market play (breadth→platform)
10. `clients` CRUD under `agency`-plan workspaces; link module items to clients.
11. **Client portal:** scoped, white-labeled view (theme from `clients.theme`), role-based access (agency staff vs client viewer), portal token auth.
12. **Per-client billing:** Stripe subscriptions/invoices per client reusing `billing.ts`; usage from module activity.
13. Permission/role model (agency admin, member, client viewer).

### Phase 3 — AI / breadth domination
14. Promote copilots → **autonomous per-agency agents** (`src/lib/agents/agency/<type>.ts`) reading module + client data, drafting deliverables, acting within guardrails (human approval for client-facing sends).
15. **Integrations expansion:** wire the real connectors the README advertises (Meta/Google/TikTok/LinkedIn/etc.) + add more; surface as ingest adapters into modules.
16. Cross-module agent orchestration (e.g. Strategy agent feeds Branding/Content agents).

### Phase 4 — Cohesion ("every aspect")
17. **Agency OS dashboard:** aggregates all 24 modules + clients + KPIs + agent activity + billing into one exec view.
18. Per-type **templates/playbooks** + an internal **marketplace** of agency offerings.
19. Global white-label theming + multi-locale; one-click client report.

## Data flow
`UI (module/portal) → /api/agency/[type] or /api/clients → SQLite (agency_items/clients) → KPI engine + agent runtime → UI`. Clients scoped by `workspace_id` + portal token. Agents read `agency_items` for their `agency_type` (+ `client_id`) and write back via the same API under guardrails.

## Failure modes / risks
- **Migration corrupts live data** → snapshot first; backfill is idempotent (preserve IDs); verify row-count parity per type before/after.
- **Registry drift** → `AGENCY_FIELD_SCHEMA` is the single source of truth; validate fields on write; versioned.
- **Agent autonomy safety** → never auto-send to clients without approval; rate-limit + quality-gate every agent output; full audit log.
- **Dev-server starvation** → Phase 0 step 5 (presence fix) is mandatory before scale work; `next.config.js` sets `ignoreBuildErrors`/`ignoreDuringBuilds` so TS/lint won't block builds but must still be clean.
- **Stripe** → test mode + webhooks; never store keys in repo; use existing vault pattern.
- **Performance** → single `agency_items` table needs the two indexes above; paginate module lists.

## Validation
- **Per phase acceptance:** typecheck (`npm run typecheck`) + lint + build (`npm run build`, `ignoreBuildErrors` on) green.
- **Phase 0:** row-count parity `Σ seed_<slug>` == `agency_items` per type; old + new endpoints return identical data; presence route returns 200 (no 500s).
- **Phase 1:** every module shows ≥3 live KPIs + pipeline view + a copilot action producing output through `quality-gate`.
- **Phase 2:** create client → assign items → open portal (white-labeled, scoped) → generate Stripe invoice in test mode.
- **Phase 3:** a sample agency agent runs end-to-end (draft deliverable → quality-gate → approved → written to module).
- **Phase 4:** exec dashboard renders all modules/clients/KPIs; one-click client report exports.
- Smoke test with `DEV_AUTO_AUTH=true npm run dev` (auth is required by middleware; never enable in prod).

## Open questions (for implementation agent)
- Keep `seed_<slug>` tables or drop post-migration? (Recommend: drop after parity check, keep adapter 1 release.)
- Portal auth: reuse workspace session + short-lived client token, or fully separate auth? 
- Which 3–5 integrations to wire first in Phase 3?
- Are KPI formulas computed in SQL or in a TS metrics layer? (Recommend: TS `agencyMetrics.ts` for flexibility.)
