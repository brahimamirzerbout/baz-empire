# Plan: Full Marketing Coverage in the Hub + Net/GitHub Ingest Engine

## Goal
Close every missing marketing surface in the Marketing Hub (`/home/uzer/marketing-hub`) and add a reusable ingest engine that scrapes the web (marketing publications + competitive intel) and GitHub (marketing tooling/repos) to feed those surfaces. All 18 missing surfaces ship; those without a scrape source ship as seed/manual-entry apps with adapter hooks for future ingest.

## Context (verified during planning)
- Hub already has ~90 marketing routes + ~95 API routes + 116 SQLite tables. Heavy uncommitted WIP tree (`AGENTS.md`: ~119 uncommitted changes, `ignoreBuildErrors:true`).
- Existing reusable ingest pattern to mirror: `src/lib/loot/` — per-source adapters (`gutenberg.ts`, `ia.ts`, `wiki.ts`, `openlib.ts`) + `indexer.ts` (parallel fetch, **politeness: max 4 concurrent, 200ms between calls**, per-fetch caching) + `migrations-loot.ts` (`migrateLootTables(db)` creates dedicated tables + shared `loot_index(id,kind,ref_id,title,haystack,year,category)` for cross-source search).
- Existing scraper to mirror: `src/lib/marketingDive.ts` (live `fetch()` → cache in `dive_articles`/`dive_library` → feed `wire_articles`). `src/lib/wire.ts` = curated daily feed.
- DB is SQLite/libsql via `src/lib/db/index.ts`; self-healing migrations are the established pattern (defensive `ALTER TABLE ... ADD COLUMN` in try/catch, added recently for `events`/`users`).
- GitHub auth available: `gh auth status` shows a token with `repo` scope; adapter will use `GITHUB_TOKEN`/`gh` token via GitHub REST search API. No octokit dep — use raw `fetch`.
- Network egress works (marketingDive + loot already do live fetches).
- Surfaces convention: each gets `src/app/<surface>/page.tsx` (client, `useFetch`→`/api/<surface>`), `src/lib/<surface>.ts`, dedicated table(s), API route `src/app/api/<surface>/route.ts`, and a Sidebar nav item in `src/components/Sidebar.tsx`.

## Precondition (must fix first — currently broken)
The Smarketing/Suby edit in `src/lib/smarketing.ts` introduced a **duplicate `const avgDealSize`** (declared at the original ~line 212 and again in the new Suby block ~line 286). Duplicate `const` in one scope is a **runtime SyntaxError** that crashes the module → `/api/smarketing` returns 500. Also remaining TS issues from that edit:
- Remove the duplicate `const avgDealSize` (reuse the one already computed).
- `funnel[i-1].value` / `funnel[i].value` are `T | undefined` under `noUncheckedIndexedAccess` → guard with non-null (`funnel[i-1]!`) or capture+assert.
- `STATUS_RUNG[rung]` is `string | undefined` → use `?? rung`.
Finish the Suby feature (The Leak / The Gap / The Bridge + value ladder + headline KPI) and verify `/api/smarketing` → 200 before starting the new work.

## Architecture decisions
1. **Ingest engine** = new `src/lib/ingest/` mirroring `loot/`:
   - `migrations-ingest.ts` → `migrateIngestTables(db)`: tables `ingest_web` (publications: id,url,source,title,author,summary,published_at,fetched_at,category,raw), `ingest_github` (repos: id,full_name,description,url,stars,license,language,topics,updated_at,fetched_at), `ingest_competitor` (id,competitor,url,kind[landing|ad|pricing|review],captured_at,snapshot_html,extracted_json). All writes also upsert into the **existing shared `loot_index`** (kind = `web`/`github`/`competitor`) so global search works across loot + ingest.
   - Adapters: `rss.ts` (RSS/Atom + HTML for publications — Marketing Dive already done, add HubSpot/Ahrefs/Backlinko/Neil Patel/HBR/AdAge), `web.ts` (competitive: landing pages, Meta Ad Library, Google Transparency, pricing pages, review sites), `github.ts` (GitHub REST search: `https://api.github.com/search/repositories?q=...` with `Authorization: Bearer <token>`, topics like seo/attribution/scrape/marketing, store license + stars).
   - `indexer.ts` orchestrator: parallel-with-politeness (reuse loot's max-4/200ms), per-fetch caching, idempotent upserts, last-run tracking.
   - Routes: `POST /api/ingest/run?source=<web|github|competitor|all>` (triggers a crawl, returns summary), `GET /api/ingest/search?q=` (cross-source via `loot_index`), `GET /api/ingest/status` (per-source counts + last fetched).
   - Legal/compliance: store only metadata + excerpts for web (no full republication), honor `robots.txt` for HTML scrape, respect GitHub rate limits (5000/hr authenticated) with backoff; never commit scraped PII.
2. **18 missing surfaces** — each follows the hub convention (page + lib + table(s) + API + sidebar). Grouped by data source:

   **Ingest-fed (3):**
   - `competitive-intelligence` ← `ingest_competitor` (web adapter).
   - `martech-stack` ← `ingest_github` (catalog of marketing tools/repos, license-aware).
   - `reports` / unified `dashboards` ← aggregate from `ingest_web` (publications) + existing KPIs (reuses smarketing/attribution).

   **Publication-fed (extend `wire_articles`/`ingest_web`):**
   - `social` (social listening + content calendar, fed by publication topics), `content` (content hub/pillar planner), `positioning` (reuse existing `positioning_statements` table + ingest trends).

   **Seed/manual-entry (no scrape source) — ship now, adapter hooks later (12):**
   - `podcast`, `video`, `community`, `advocacy`, `referral`, `affiliate`, `pr`, `outreach`, `webinars`, `events-marketing`, `marketing-ops`, `messaging`.
   - Each: dedicated table (id/name/status/.../created_at/updated_at), CRUD API, seeded with realistic sample rows + manual create/edit UI. Leave a clearly-marked `// TODO: ingest adapter hook` in each lib so a future adapter can populate them.

## Execution order (phased, each phase independently verifiable)

### Phase 0 — Fix Smarketing/Suby (precondition)
- Fix `src/lib/smarketing.ts` duplicate `const avgDealSize` + TS guards; verify `/api/smarketing` → 200 and the Suby block (leak/gap/bridge/value-ladder/headline) renders.

### Phase 1 — Ingest engine foundation
- Add `src/lib/ingest/migrations-ingest.ts` (`migrateIngestTables`); call it from `src/lib/db/index.ts` openDb path (alongside `migrateLootTables`).
- Add `src/lib/ingest/{rss,web,github,indexer}.ts` + `src/lib/ingest/index.ts` public API.
- Add `/api/ingest/run`, `/api/ingest/search`, `/api/ingest/status` routes.
- Verify: POST `/api/ingest/run?source=github` returns a summary; `ingest_github` rows appear; GET `/api/ingest/search?q=seo` returns hits from `loot_index`.

### Phase 2 — Ingest-fed surfaces
- `competitive-intelligence`, `martech-stack`, `reports`/`dashboards` pages + libs + API + sidebar items, each consuming its ingest table.
- Verify: each route returns 200 and shows data from the ingest tables.

### Phase 3 — Publication-fed surfaces
- `social`, `content`, `positioning` pages + libs + API + sidebar items; feed from `wire_articles`/`ingest_web` + existing tables.

### Phase 4 — Seed/manual surfaces (12)
- For each: `migrateXTables` table + lib CRUD + API + page + sidebar item + seed rows.
- Verify: each route 200, CRUD round-trips work.

### Phase 5 — Unify + wire
- Add a "Marketing" sidebar group containing all new surfaces; ensure `/api/search` (global) includes `loot_index` ingest rows.
- Final: `next build` (exit 0), smoke-test all new routes return 200, no new libsql-in-client-bundle regressions (client pages must fetch via API, never import `db`).

## Boundaries / constraints
- Do NOT run dependency upgrades, `git reset`, or branch switching (AGENTS.md). Prefer small targeted edits; the tree is heavily uncommitted.
- Client components (`"use client"`) MUST NOT import `@/lib/db` or anything that pulls `libsql` (causes the webpack README.md parse error seen on `/email`). All client data via `useFetch`→API.
- Keep new tables in dedicated `migrations-*.ts` modules + the main schema `db.exec` block with defensive `ALTER` try/catch (the self-healing pattern), so fresh Vercel `/tmp` DBs and stale local DBs both work.
- Politeness on all scrapers (reuse loot's max-4-concurrent/200ms + caching). Honor robots.txt and GitHub rate limits; store metadata/excerpts only for web.

## Risks
- **Scrape reliability/legal**: sites may block or change HTML. Mitigation: cache aggressively, parse defensively, store only metadata/excerpts, prefer RSS over HTML where available.
- **Vercel serverless scraping**: a full crawl may exceed function `maxDuration` (vercel.json sets 30s). Mitigation: crawl runs in small paged batches via repeated `/api/ingest/run` calls (cursor/offset), or run locally via `pnpm` scripts that call the same lib.
- **Tree debt**: ~5300 pre-existing TS errors (ignored by build). New code must be type-clean in its own files to avoid regressing what we can control.
- **baz-empire push blocked** (1.5 GiB, unrelated to this plan) — not a blocker for hub work.

## Validation plan
- After each phase: `next build` exit 0; curl each new route → 200; curl each new `/api/<surface>` → 200 JSON; `tsc --noEmit` shows zero errors in newly-added files.
- Ingest: run `/api/ingest/run?source=all`, confirm rows in `ingest_web`/`ingest_github`/`ingest_competitor` and that `/api/ingest/search` returns cross-source hits.
- No client bundle pulls `libsql` (grep new client components for `@/lib/db` import — must be empty).

## Open questions (none blocking — resolved during planning)
- All 18 surfaces in scope ✓; no-source surfaces ship seed/manual ✓; 3 ingest adapters ✓; storage mirrors loot ✓.