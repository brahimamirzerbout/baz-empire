# Marketing Hub — Agency Completeness Plan

**Goal:** Ship every feature a professional marketing agency needs to run client work, bill accurately, and deliver a premium client experience — all inside this Next.js + SQLite hub.

**Architecture decision:** Client-facing portal and public intake pages stay in `marketing-hub` as public token-scoped routes. No cross-app dependency. Private workspace and public client surface share one repo, one database, one deploy. This keeps rollout atomic and avoids sync/queue complexity between `marketing-hub` and `marketing-hub-public`.

**Current state:**
- Core marketing execution is solid: SEO, ads, CRM, campaigns, email, landing pages, funnels, analytics, automations, A/B tests, inbox, surveys, reports, copy generator.
- Agency/finance layer is partially built: **timesheets**, **client invoices**, **project PnL**, **contractors**, **payouts**, **billing**, **portal links**, **agency client accounts**, **approvals**.
- Existing `clients` table (id, workspace, name, industry, website, contact_email, notes) is the canonical agency client directory. `timesheets`, `client_invoices`, and `project_pnl` already reference `client_id`.
- `tasks` exists but `project` is currently a TEXT string, not a FK. Add `project_id TEXT` to `tasks` so tasks can link to the new `projects` table.
- `/c/[token]` route and public booking pages do not exist yet; only `portal_links` token-generation API exists.
- What’s missing is the **client-facing experience layer** and **agency operations depth** that top platforms ship.

**Reuse rule:** Do not create a second client directory. All new agency tables (`proposals`, `contracts`, `projects`, `retainer_usage`, `deliverable_approvals`, `client_messages`, `client_reports`) must link to the existing `clients.id`. `agency_client_accounts` is separate and stays separate; it is for platform/sub-account billing, not agency client records.

**Workspace scoping:** Existing tables mix `workspace TEXT` and `workspace_id TEXT`. New tables must use `workspace_id TEXT` with FK to `workspaces.id`.

**Pattern to reuse everywhere:**
- Data: `lib/db/index.ts` auto-migration `CREATE TABLE IF NOT EXISTS` inside `init()`.
- API: `app/api/<module>/route.ts` with GET (list), GET `[id]`, POST (create), PATCH `[id]`, DELETE `[id]`. Use existing `json/err` helpers.
- Pages: `app/<module>/page.tsx` and `app/<module>/[id]/page.tsx` with `"use client"`, `useFetch`, `Modal`, `apiFetch`, `lucide-react` icons, card/section layout.
- Nav: `components/Sidebar.tsx` group entries by department.

---

## Phase 1: Client Experience Layer

### 1.1 White-Label Client Portal
**Files to create/modify:**
- `app/c/[token]/page.tsx` — token-scoped dashboard: project status, invoices, files, messages.
- `app/api/portal/[token]/route.ts` — validate token, resolve client from `portal_links.client_name` or explicit link-to-client mapping, return scoped data.
- `app/api/portal/[token]/messages/route.ts` — list + create messages for that client.
- `app/settings/page.tsx` — add white-label section (logo upload, primary color, sender name).
- `lib/db/index.ts` — ensure `portal_links.scope` enforcement logic exists in API routes.

**Data flow:** Token → `portal_links` → resolve to agency contact/client → filter all queries by `clients.id`. The `portal_links` table already has `client_name` but not `client_id`; add `client_id TEXT` to `portal_links` so the API can do strict FK-scoped queries instead of name-matching.

**Acceptance:** A client with a valid portal link sees only their own projects/invoices/messages. Branding reads from workspace settings.

### 1.2 Proposals + E-Signature
**Files to create:**
- `lib/db/index.ts` — add `proposals` and `proposal_signatures` tables.
- `app/api/finance/proposals/route.ts` — list + create.
- `app/api/finance/proposals/[id]/route.ts` — read + update + delete.
- `app/api/finance/proposals/[id]/send/route.ts` — generate shareable token, mark sent.
- `app/api/finance/proposals/[id]/sign/route.ts` — accept signature payload, mark accepted.
- `app/finance/proposals/page.tsx` — list view with status badges, new button.
- `app/finance/proposals/[id]/page.tsx` — preview, edit, send, sign flow.

**Data model:**
- `proposals`: id, workspace, client_id (FK to clients.id), title, line_items JSON, total, currency, status, due_date, terms, cover_letter, token, viewed_at, accepted_at, created_at.
- `proposal_signatures`: id, proposal_id, signer_name, signer_email, signed_at, ip, method.

**Status flow:** draft → sent → viewed → accepted → expired. Default templates: SEO retainer, full-service monthly, one-time project, social media management, PPC management.

### 1.3 Contracts
**Files to create:**
- `lib/db/index.ts` — add `contracts` table.
- `app/api/finance/contracts/route.ts` — list + create.
- `app/api/finance/contracts/[id]/route.ts` — read + update.
- `app/api/finance/contracts/[id]/sign/route.ts` — e-signature capture.
- `app/finance/contracts/page.tsx` — list with link to proposal.
- `app/finance/contracts/[id]/page.tsx` — preview + sign.

**E-signature model:** Support both fast acceptance and formal signing.
- `proposal_signatures`: id, proposal_id, signer_name, signer_email, signed_at, ip, method, signature_data JSON (optional).
- `contracts`: id, workspace_id, proposal_id, client_id, title, body, status, start_date, end_date, auto_renew, signed_at, signature_data JSON, fee, currency, created_at.
- Method enum: `click_accept` vs `canvas_signature`.
- `signature_data` stores: for click_accept → `{ "method": "click_accept", "name": "...", "email": "...", "ip": "...", "timestamp": "..." }`; for canvas_signature → `{ "method": "canvas_signature", "image": "data:image/svg+xml;base64,...", "name": "...", "email": "...", "ip": "...", "timestamp": "..." }`.
- Proposals default to click_accept. Contracts default to canvas_signature but allow both. This gives a clear UX threshold: proposal = fast, contract = formal.

**UI:**
- Proposal sign page: checkbox “I agree to these terms” + typed name + email + submit. No drawing.
- Contract sign page: name + email + canvas draw pad + submit. Also allow click_accept fallback if client prefers.
- Store acceptance data in `signature_data` JSON on both `proposal_signatures` and `contracts`.

### 1.4 Client Onboarding
**Files to create:**
- `lib/db/index.ts` — add `onboarding_workflows`, `onboarding_runs`.
- `app/api/onboarding/route.ts` — list + create workflow.
- `app/api/onboarding/[id]/route.ts` — read + update step.
- `app/api/onboarding/runs/route.ts` — list + create run.
- `app/api/onboarding/runs/[id]/route.ts` — advance/complete.
- `app/clients/onboarding/page.tsx` — workflow templates.
- `app/clients/onboarding/[id]/page.tsx` — run progress.

**Trigger:** contract signed OR manual client add. Step types: email, questionnaire, file_upload, calendar, deliverable.

### 1.5 Client Messaging
**Files to create:**
- `lib/db/index.ts` — add `client_messages`.
- `app/api/messages/route.ts` — list + create.
- `app/clients/messages/page.tsx` — threaded inbox.
- `app/c/[token]/messages/page.tsx` — client-side thread.

### 1.6 Automated Client Reporting
**Files to create:**
- `lib/db/index.ts` — add `client_reports`.
- `app/api/reports/clients/route.ts` — list + create schedule.
- `app/api/reports/clients/[id]/route.ts` — read + update + trigger send.
- `app/api/reports/clients/[id]/pdf/route.ts` — generate branded PDF via jspdf.
- `app/reports/clients/page.tsx` — scheduled reports list.
- `app/reports/clients/[id]/page.tsx` — preview + schedule settings.

---

## Phase 2: Agency Operations Layer

### 2.1 Project Management
**Files to create:**
- `lib/db/index.ts` — add `projects`, `milestones`, `project_files`. Extend `tasks` with `project_id TEXT` and `client_id TEXT`. Add `project_id` to `timesheets` if not already present.
- `app/api/projects/route.ts` — list + create.
- `app/api/projects/[id]/route.ts` — read + update + delete.
- `app/api/projects/[id]/files/route.ts` — upload/list/delete.
- `app/projects/page.tsx` — kanban/list toggle.
- `app/projects/[id]/page.tsx` — detail: overview, files, milestones, linked timesheets/invoices/tasks.

**Fields:**
- projects: id, workspace_id, client_id (FK to clients.id), client_name, name, description, status, start_date, end_date, budget, budget_currency, manager_id, created_at.
- milestones: id, project_id, name, due_date, status, created_at.
- project_files: id, project_id, name, url, size, uploaded_by, created_at.
- tasks: add `project_id TEXT`, `client_id TEXT`. Existing `project TEXT` remains for backward compatibility but `project_id` is the canonical link.

**Migration notes:** Auto-migration in `init()` adds the new columns to `tasks` with `ALTER TABLE ADD COLUMN IF NOT EXISTS`. Backfill `client_id` on tasks from existing `client_invoices`/`timesheets` data where possible. `timesheets` already has `project_id` and `client_id` — no migration needed there.

**Integration:** Link tasks, timesheets, invoices, expenses, and campaigns to projects via `project_id` FK.

### 2.2 Retainer Management
**Files to create:**
- `lib/db/index.ts` — add `retainer_usage`.
- `app/api/finance/retainers/route.ts` — list + create.
- `app/api/finance/retainers/[id]/route.ts` — read + update + log usage.
- `app/api/finance/retainers/[id]/usage/route.ts` — log hours.
- `app/finance/retainers/page.tsx` — per-client retainer cards with progress bars and alerts.

**Fields:**
- retainer_usage: id, workspace, client_id, client_name, project_id, period_start, period_end, hours_purchased, hours_used, hours_carryover, amount_billed, amount_paid, currency, created_at.

### 2.3 Rate Cards
**Files to create:**
- `lib/db/index.ts` — add `rate_cards`.
- `app/api/finance/rate-cards/route.ts` — list + create.
- `app/finance/rate-cards/page.tsx` — table with effective dates.
- `app/finance/timesheets/page.tsx` — add rate dropdown in new entry modal, auto-fill from rate card.

**Fields:**
- rate_cards: id, workspace, role_name, hourly_rate, currency, effective_date, created_at.

### 2.4 Capacity Planning
**Files to create:**
- `lib/db/index.ts` — add `capacity_allocations`.
- `app/api/finance/capacity/route.ts` — list + set allocation.
- `app/finance/capacity/page.tsx` — weekly grid with utilization % per person.

**Fields:**
- capacity_allocations: id, workspace, person_id, person_name, week_start, hours_allocated, project_id, project_name, created_at.

### 2.5 Client Approvals (Deliverables)
**Files to create:**
- `lib/db/index.ts` — add `deliverable_approvals`.
- `app/api/approvals/deliverables/route.ts` — list + create.
- `app/api/approvals/deliverables/[id]/route.ts` — read + update status.
- `app/projects/approvals/page.tsx` — pending/completed approvals queue.
- `app/c/[token]/approvals/page.tsx` — client-side approval/feedback.

**Fields:**
- deliverable_approvals: id, workspace, project_id, client_id, title, description, file_url, feedback, revision_count, status, created_at.

---

## Phase 3: Marketing-First Enhancements

### 3.1 AI Proposal Generator
- Add a "Generate with AI" button in `app/finance/proposals/[id]/page.tsx`.
- Call existing `/api/copy` or new `/api/finance/proposals/[id]/generate` that drafts `cover_letter` + `line_items` from `campaign_briefs` + `pricing_strategies`.

### 3.2 Public Booking / Intake
**Files to create:**
- `lib/db/index.ts` — add `booking_pages`.
- `app/api/booking/route.ts` — list + create.
- `app/api/booking/[slug]/route.ts` — public read.
- `app/api/booking/[slug]/submit/route.ts` — create lead + optional calendar event.
- `app/booking/[slug]/page.tsx` — slot picker + form.

**Fields:**
- booking_pages: id, workspace, slug, title, services JSON, duration_minutes, buffer_minutes, availability_rules, created_at.

### 3.3 Reputation Management
**Files to create:**
- `app/reviews/page.tsx` — pull from `testimonials`, show external review links.
- `app/api/reviews/request/route.ts` — send review request email after project completion.

---

## Navigation / Sidebar Changes
In `components/Sidebar.tsx`, add entries under existing groups:

**Revenue group:**
- `/finance/proposals` — Proposals
- `/finance/contracts` — Contracts
- `/finance/retainers` — Retainers
- `/finance/rate-cards` — Rate Cards
- `/finance/capacity` — Capacity

**Operations group:**
- `/projects` — Projects

**Client Success group:**
- `/clients/onboarding` — Onboarding
- `/clients/messages` — Messages
- `/reviews` — Reputation

Keep `/billing` as platform subscription routes; never mix with client invoices.

---

## Data Model Summary (Tables to Add)
| Table | Purpose |
|---|---|
| `proposals` | Quote-to-cash proposals with line items |
| `proposal_signatures` | E-signatures on proposals |
| `contracts` | Contracts linked to proposals/clients |
| `onboarding_workflows` | Reusable onboarding step templates |
| `onboarding_runs` | Per-client onboarding execution |
| `client_messages` | Threaded client ↔ agency messaging |
| `client_reports` | Scheduled per-client branded report configs |
| `projects` | Projects linked to clients, tasks, invoices |
| `milestones` | Project milestones |
| `project_files` | Per-project shared documents |
| `retainer_usage` | Retainer hour tracking per period |
| `rate_cards` | Billable rates per role |
| `capacity_allocations` | Team capacity / utilization planning |
| `booking_pages` | Public intake/booking pages |
| `deliverable_approvals` | Client proofing & approval workflow |

---

## Implementation Sequence
1. **Sprint 1:** Proposals + E-signature + Contracts. Unlock quote-to-cash.
2. **Sprint 2:** Client Portal upgrade + Client Messaging. Premium experience.
3. **Sprint 3:** Projects + Milestones + Files + Retainer + Rate Cards. Operations backbone.
4. **Sprint 4:** Client Onboarding + Automated Client Reporting + Capacity Planning. Automation layer.
5. **Sprint 5:** Booking/Intake + Reputation + AI Proposal Generator + polish.

Every sprint must end with all new API routes returning 200 and new sidebar links resolving to 200.

---

## Validation
- `npm run dev` starts without error.
- Every new page returns 200.
- Every new module has full CRUD API contract: GET list, GET [id], POST create, PATCH [id], DELETE [id].
- Portal token is non-guessable, scoped to one client, and expires.
- Proposal click_accept flow: submit → status becomes accepted → draft contract auto-created.
- Contract canvas_signature flow: draw + submit → signature_data contains SVG/base64 image, status becomes signed.
- Contract click_accept fallback: submit without drawing → signature_data contains click_accept payload, status becomes signed.
- Proposal → accepted → contract draft → signed → onboarding triggered (if configured).
- Timesheet auto-fills rate from rate card when role selected.
- Retainer shows usage alert at 80% and 100%.
- Client report PDF renders and downloads.

---

## Out of Scope
- Switching to separate public app or shared monorepo deploy.
- External payment processor integration beyond existing Stripe billing routes.
- Real-time sockets; use polling where needed.
- SSO / SAML; keep local auth.
