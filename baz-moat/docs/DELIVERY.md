# BAZ Revenue Attribution Diagnostic — 5-Day Delivery Runbook

> The moat entry offer. Fixed scope, fixed time, risk-reversed.
> Lineage: Hopkins (test campaign) + Kennedy (irresistible offer) + Hormozi (grand-slam
> offer + self-liquidating funnel).

## Offer (client-facing)

> "We instrument your revenue first, then grow it. In 5 days we map your full funnel to
> LTV/CAC/payback, fix the tracking gaps, and hand you a 90-day plan. **If we don't find
> a leak worth at least 10× the audit fee, you don't pay.**"

- **Fee:** $5,000 (default) — creditable toward the Core/Growth retainer on conversion.
- **Scope:** audit + report + 90-day plan + top-2 fixes deployed. Not full retainer delivery.
- **Time:** 5 business days from kickoff.

## Day-by-day

### Day 0 — kickoff (30 min call)
- Confirm baseline: monthly attributed revenue, primary channel, markets, AOV/LTV.
- Grant access: ad accounts, GA4, GTM, store/CRM, hosting.
- Lock the ICP fit check (Schwartz awareness + Halbert starving-crowd).

### Day 1 — instrument & observe
- Deploy the BAZ Tracking Default audit (run `baz-moat diagnostic`).
- Verify each component's real status (present/partial/missing/broken) — **observed, not
  claimed**. Capture evidence (screenshots, event inspector output).
- GDPR check if EU in markets: consent banner + consent-mode signals.

### Day 2 — quantify the leak
- Run the audit → per-component + total $ leak.
- Confirm the 10× guarantee test (met / not met).
- Identify the top 3 holes by $ impact.

### Day 3 — fix the top 2
- Deploy fixes for the top 2 leaks (usually ssGTM + CAPI for paid-heavy clients).
- Verify the fixes fire (status → "present").

### Day 4 — build the 90-day plan
- Generate the plan (the CLI does this), sequenced by $ impact.
- Add client-specific exit criteria.

### Day 5 — delivery call (45 min)
- Walk the report: headline leak, the table, what it means.
- Present the 90-day plan.
- **The next logical yes (Deiss):** convert to Core ($6.5–9.5k) or Growth ($18–28k).
- If guarantee not met: waive the fee per terms (still deliver the plan).

## Exit criteria (BAZ internal)

- [ ] Report + plan delivered as markdown (pipe CLI to file).
- [ ] Top-2 fixes verified firing.
- [ ] ≥40% retainer conversion target across the first 10 diagnostics — if below 25%,
  reprice or rescope the offer.

## Proof plan (replace composites)

After the first 10 diagnostics, replace the conservative leak fractions in
`src/tracking-default.ts` with BAZ's empirical per-component leak rates. This converts
the diagnostic from "industry-report-derived estimate" to "BAZ-proprietary data" — which
is itself a deeper moat (L.E.K. #1).