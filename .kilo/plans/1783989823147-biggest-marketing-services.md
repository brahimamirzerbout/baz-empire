# Plan: Biggest Marketing Services Integration

## Goal
Turn Marketing-for-Engineers (373 entries) + marketingskills (47 skills) into the largest actionable marketing services layer in the hub. Target: +1 unified services catalog + ~30 new operational surfaces.

## Context (verified)
- `marketing-hub` already has 80+ routes, seed-surface pattern (`lib/seed-surface.ts`), batch scaffolder (`scripts/add-feature.ts`), unified AI provider (`lib/ai-provider.ts`), and global search via `loot_index`.
- Parsed MFE data lives at `/tmp/kilo/mfe-parsed.json`: 281 articles, 70 tools, 22 checklists across 15 categories.
- 39 of 47 marketingskills are missing from the hub; 8 overlap with existing surfaces (ads, analytics, emails, offers, competitors, onboarding, pricing, referrals, sms, social, video — exact overlap count is 11, not 8; see below).
- Latest commit (`60dda9c`) added heuristics audit + batch scripts. No MFE integration yet.

## Decisions

### 1. MFE 373 entries → unified catalog, not 373 pages
**Rationale:** 373 individual routes would bloat the sidebar and duplicate existing surfaces. Instead, create `/services` as a searchable catalog backed by a single `marketing_services` table. Each entry gets an actionable "Launch" button:
- **Tools** (70) → open in a modal or dedicated executor page (`/services/tool/[id]`).
- **Checklists** (22) → guided workflow (`/services/checklist/[id]`).
- **Articles** (281) → knowledge card with AI-generated summary + 3 action items.

### 2. Data model
New table `marketing_services`:
```sql
CREATE TABLE IF NOT EXISTS marketing_services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  subcategory TEXT,
  type TEXT NOT NULL DEFAULT 'article', -- article|tool|checklist
  description TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'mfe',
  meta TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX idx_marketing_services_category ON marketing_services(category);
CREATE INDEX idx_marketing_services_type ON marketing_services(type);
```

### 3. Batch-add missing marketingskills as individual surfaces
Use `scripts/add-feature.ts --batch` to scaffold the ~30 truly new skills as seed surfaces. Each gets the standard pattern: `src/app/<slug>/page.tsx`, `src/lib/seed-surfaces.ts` entry, Sidebar nav item, and generic CRUD API via `/api/seed/<slug>`.

**Exact missing list (30 new surfaces):**
`ad-creative`, `ai-seo`, `aso`, `churn-prevention`, `cold-email`, `co-marketing`, `community-marketing`, `content-strategy`, `copy-editing`, `copywriting`, `cro`, `customer-research`, `directory-submissions`, `free-tools`, `image`, `launch`, `marketing-council`, `marketing-ideas`, `marketing-loops`, `marketing-plan`, `marketing-psychology`, `paywalls`, `popups`, `product-marketing`, `programmatic-seo`, `prospecting`, `public-relations`, `revops`, `sales-enablement`, `schema`, `seo-audit`, `signup`, `site-architecture`

**Overlap (skip — already have surfaces):**
`ab-testing` (→ experiments), `competitor-profiling` (→ competitors), `competitors` (→ competitors), `emails` (→ emails/emails), `lead-magnets` (→ lead-magnets), `onboarding` (→ onboarding), `pricing` (→ pricing), `referrals` (→ referral), `sms` (→ sms), `social` (→ social), `video` (→ video)

### 4. Tool and checklist executability
- Create `src/lib/services/tools.ts` — wrappers that map MFE tool titles to existing calculators or simple interactive forms.
- Create `src/lib/services/checklists.ts` — state-machine for checklist progress (steps, completion, save to `marketing_service_runs` table).
- `/services/tool/[id]` and `/services/checklist/[id]` pages use the unified AI provider for any LLM-dependent steps.

### 5. AI action layer
Every article card in `/services` gets an "AI Action Plan" button that calls `/api/ai/status`-gated provider to generate 3 executable steps. Tool/checklist pages also get inline AI coaching.

## Execution order

### Phase 1 — MFE catalog (biggest impact, fastest)
1. Add `marketing_services` table migration in `src/lib/db/index.ts`.
2. Write `/tmp/kilo/import-mfe.py` to ingest `/tmp/kilo/mfe-parsed.json` into `marketing_services`.
3. Create `/api/services` route (GET with `?category=&type=&q=` filters, facet counts).
4. Create `/services` page with category pills, type tabs, search, and card grid.
5. Create `/services/tool/[id]` and `/services/checklist/[id]` executor pages.
6. Add Sidebar entry: `{ href: "/services", label: "Services", icon: Wrench }`.
7. Run import script; verify `SELECT COUNT(*) FROM marketing_services` = 373.

### Phase 2 — Batch skill surfaces
1. Run `tsx scripts/add-feature.ts --batch` with a JSON containing the 30 missing skills.
2. For each new surface, verify `/api/seed/<slug>` returns 200 and page renders.
3. Re-run Sidebar generation/verification.

### Phase 3 — Deep tool wrappers
1. Map the 70 MFE tools to existing calculators or build 20–30 lightweight interactive wrappers (e.g., persona generator, headline evaluator, budget allocator).
2. Wire wrappers into `/services/tool/[id]`.

### Phase 4 — Checklist workflows
1. Convert 22 checklists into step-by-step workflows with progress persistence in `marketing_service_runs` (id, service_id, workspace_id, steps JSON, completed_at).
2. Wire into `/services/checklist/[id]`.

## Validation
- `pnpm typecheck` passes.
- `/services` loads, filters, and shows 373 entries.
- Every new seed surface returns 200.
- AI action plan button returns a non-empty plan for any article.
- No duplicate sidebar entries.

## Risks
- **Sidebar bloat**: adding 30 surfaces makes the nav very long. Mitigation: group them under "Services" collapsible section, or use a nested submenu pattern.
- **Tool coverage gap**: 70 tools can't all become full interactive apps. Mitigation: tier them — Tier 1 (top 20) get custom wrappers, Tier 2 (next 30) get template forms, Tier 3 (rest) link out to original URL with hub tracking.
- **Duplicate seed-surface names**: some skill slugs may collide with existing ones. Mitigation: the batch script checks `BY_SLUG` before writing; log and skip collisions.

## Open question
Should the 30 new skill surfaces be grouped under a new "Services" sidebar collapsible, or stay flat in their logical groups (e.g., `cro` under Revenue, `copywriting` under Creative)?

**Recommended answer:** Flat placement in their existing logical groups keeps the sidebar familiar and avoids a mega-group. Use the batch script's `--group` flag to assign each skill to the correct department group.
