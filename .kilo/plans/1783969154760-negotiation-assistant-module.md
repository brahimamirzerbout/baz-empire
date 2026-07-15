# Plan: Negotiation Assistant Module

## Goal
Add a `/negotiation/[dealId]` module that activates when a deal enters the
`negotiation` pipeline stage. Generates a pre-negotiation brief (objections,
BATNA, calibrated questions), logs negotiation interactions, and produces a
post-negotiation debrief — all grounded in the hub's deal data + Voss doctrine.

## What exists today
- `deals` table: stage, value, probability, contact_id, company_id, owner,
  close_date, lost_reason, created_at, updated_at
- Pipeline: drag-and-drop stage progression through `negotiation`
- `triangle.ts`: auto-advances `negotiation` → `won` when probability ≥ 80
- `books.ts`: Voss's *Never Split the Difference* in the library
- GLM strategist pattern at `/api/strategist` (`askStrategist`, `buildHubDataContext`, `buildFullContext`)
- `touchpoints` table: channel/asset history for the deal

## What's missing
- No negotiation-specific UI, data model, or AI prompt
- No structured way to capture concession history or objection patterns
- No doctrine-grounded negotiation prep tied to actual deal context

## Deliverables (in order)

### 1. DB: `negotiation_logs` table
```sql
CREATE TABLE IF NOT EXISTS negotiation_logs (
  id TEXT PRIMARY KEY,
  deal_id TEXT NOT NULL,
  contact_id TEXT,
  their_ask TEXT,           -- what the prospect asked for
  our_opening TEXT,         -- our opening position
  their_counter TEXT,       -- their counter
  our_concession TEXT,      -- what we gave
  outcome TEXT,             -- won | lost | continuing
  notes TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_negotiation_logs_deal ON negotiation_logs(deal_id);
```

### 2. API: `POST /api/negotiation/[dealId]`
Three modes, single endpoint with `mode` body field:

**PREP** (default — deal just entered negotiation):
- Pulls: deal (value, stage history, probability, lost_reason), contact
  (industry, title, company), company, touchpoints (channel/asset history),
  past negotiation_logs for this contact, attribution rollup for this deal,
  similar deals' outcomes (same industry/company size).
- Builds a hub-data context block (reuse `buildHubDataContext` shape + deal-specific fields).
- Sends to GLM with a negotiation-specific system prompt drawing on Voss:
  - Tactical empathy summary (label their likely emotions based on stage/probability)
  - 3 calibrated questions (Voss: "What about X makes you say that?")
  - BATNA statement
  - Concession limits (max discount %, max timeline extension, max scope addition — derived from deal value + margin)
  - 2-3 likely objections + recommended responses
  - Ackerman-style bargaining plan (65% → 85% → 95% of target)
- Returns the brief as structured JSON.

**COUNTER** (body includes `their_ask`, `their_counter`, `our_opening`):
- Same context + their latest position
- Generates a calibrated response: mirroring statement, labeled emotion,
  calibrated question, and a counter-anchor.

**DEBRIEF** (body includes `outcome`, `notes`):
- Inserts a row into `negotiation_logs` with outcome
- Updates deal stage to `won`/`lost` if outcome is terminal
- Optionally updates `lost_reason` if lost

**GLM fallback**: when GLM is unavailable, return a template brief from
the legacy doctrinaire playbook (hardcoded Voss tactics, no deal-specific
customization). Label it `"template — no GLM"`.

### 3. Page: `/negotiation/[dealId]`
Three tabs:

**PREP tab** (active when stage = `negotiation`):
- Shows deal context header (value, contact, company, close date, probability)
- Displays the AI-generated brief in sections: Objections, BATNA, Calibrated Questions, Concession Limits, Bargaining Plan
- "Refresh brief" button (re-calls the API)
- CTA: "Log outcome" → opens debrief form

**LOG tab**:
- Chronological list of negotiation_logs for this deal
- "New entry" form: their_ask, our_concession, outcome dropdown, notes
- Each entry shows the concession delta vs previous entry

**DEBRIEF tab**:
- Outcome selector (won/lost/continuing)
- Free-text notes
- "Close deal" button → stages the deal, logs the outcome

### 4. Pipeline integration
- When a deal is dragged to `negotiation` stage in Pipeline.tsx, show a
  toast with a link: "Open negotiation assistant → /negotiation/[dealId]"
- The pipeline card for negotiation-stage deals gets a "Negotiation" badge
  (already partially exists in Badge.tsx)

### 5. Doctrine prompt (negotiation system prompt)
```
You are a senior deal strategist trained in Chris Voss's FBI hostage
negotiation principles (Never Split the Difference) applied to B2B deal-making.
Your job: given the deal context below, produce a negotiation brief.

Principles to apply:
- Tactical empathy: label their emotions before addressing demands
- Calibrated questions: "What about X makes you say that?" to make them
  reveal their true constraints
- Mirroring: repeat their last 1-3 words to build rapport
- No splitting the difference: never meet in the middle; always anchor high
  and let them feel like they won
- Ackerman bargain: 65% target → 85% → 95% on successive offers
- BATNA clarity: know your walk-away before you enter

Return ONLY JSON with these fields:
{
  "tactical_empathy": "...",
  "calibrated_questions": ["...", "...", "..."],
  "likely_objections": [{"objection":"...", "response":"..."}],
  "batna": "...",
  "concession_limits": {"max_discount_pct": N, "max_timeline_days": N, "max_scope_additions": N},
  "bargaining_plan": [{"round":1,"anchor":"...","target":"...","floor":"..."}],
  "summary": "one paragraph"
}
```

## Data flow
```
Deal dragged to "negotiation" stage
  → Toast: "Open /negotiation/[dealId]"
    → User opens page
      → PREP tab calls POST /api/negotiation/[dealId] { mode: "prep" }
        → Backend: gather deal + contact + touchpoints + past logs + attribution
          → GLM call with negotiation prompt + context
            → Brief rendered in UI
      → User enters COUNTER mode mid-negotiation
        → POST { mode: "counter", their_ask, their_counter, our_opening }
          → GLM returns calibrated response
      → User closes deal
        → POST { mode: "debrief", outcome, notes }
          → negotiation_logs insert + deal stage update
```

## Edge cases
- **No GLM key**: return a template brief (Voss playbook, no customization).
- **Deal has no contact**: brief uses company-level data only, flags "no contact linked".
- **First negotiation for this contact**: no past logs, brief leans harder on industry/company benchmarks.
- **Probability already ≥ 80** (triangle.ts would auto-close): brief warns "Deal is near auto-close threshold — confirm close or reset probability."
- **Deal value = 0**: brief flags "Deal has no value — negotiate scope/price before tactics."

## Validation
- Typecheck clean (strict + noUncheckedIndexedAccess)
- Manual: drag a deal to negotiation → open /negotiation/[dealId] → verify brief renders
- Manual: log a counter → verify it appears in LOG tab chronologically
- Manual: debrief as won → verify deal stage updates + log persists
- GLM-offline: verify template brief renders with `"template — no GLM"` label

## Files to create / modify
| Action | Path |
|--------|------|
| CREATE | `src/lib/db/index.ts` — add `negotiation_logs` table + seed |
| CREATE | `src/lib/negotiation.ts` — context builder + mode router + template fallback |
| CREATE | `src/app/api/negotiation/[dealId]/route.ts` — POST handler |
| CREATE | `src/app/negotiation/[dealId]/page.tsx` — PREP/LOG/DEBRIEF tabs |
| MODIFY | `src/components/noira-crm/pages/Pipeline.tsx` — negotiation toast CTA |
| MODIFY | `src/components/Badge.tsx` — ensure negotiation badge exists (already there) |
| CREATE | `docs/NEGOTIATION_MODULE.md` — usage + doctrine notes |
