# baz-moat

> BAZ Revenue Attribution Diagnostic + tracking-default moat stack.
>
> **Isolated build.** This package does not import from or write to any existing repo.
> It is the first shippable artifact of the BAZ moat build: a reusable, tested system
> that converts founder technical depth into a non-founder-dependent moat.
>
> Lineage: Hopkins (keyed returns) · Ogilvy (research discipline) · Schwartz (mechanism
> in saturated markets) · Kennedy (irresistible offer) · Hormozi (grand-slam offer +
> self-liquidating funnel) · L.E.K. moat #1 (proprietary tech). Full research at
> `~/BAZ-research/`.

## What it does

Audits a client's tracking setup against the **BAZ Tracking Default** (the canonical
checklist), estimates the revenue leak from each gap, runs the **10× guarantee test**
("if we don't find a leak worth ≥10× the audit fee, you don't pay"), and emits a
markdown diagnostic report + a 90-day plan sequenced by $ impact.

This is the **entry offer** that liquidates the outbound effort and pre-sells the
Core/Growth retainer — and it's **reusable across clients**, which is what makes it a
moat rather than a service.

## Install

```bash
cd ~/baz-moat
npm install
npm test        # vitest
npm run typecheck
```

## Run the diagnostic

```bash
npm run diagnostic -- diagnostic --client "Acme SaaS" \
  --revenue 250000 --channel meta --markets EU,US \
  --finding ssgtm=partial --finding ga4=present --finding capi-meta=missing \
  > acme-diagnostic.md
```

## Run the Operator Agent

```bash
npm run diagnostic -- ask \
  --question "Our paid CAC is rising and ROAS is slipping — what do we do?" \
  --awareness solution-aware --market-stage 4 \
  --channel meta --markets EU,US --metric CAC \
  > acme-operator-response.md
```

Components not passed via `--finding` are treated as `missing`. Valid statuses:
`present | partial | missing | broken`.

## Project layout

```
baz-moat/
  src/
    types.ts             # DiagnosticReport, AuditInput, LeakResult, …
    tracking-default.ts  # the canonical checklist + leak fractions
    audit.ts             # status → effective fraction → $ leak
    report.ts            # markdown report + 90-day plan generator
    index.ts             # CLI
  test/
    audit.test.ts
    report.test.ts
  templates/
    tracking-default-reference.md   # ssGTM/GA4/CAPI/consent/MMM reference
  docs/
    DELIVERY.md          # 5-day delivery runbook + exit criteria
```

## Roadmap (the rest of the moat)

This package is the **attribution-diagnostic** + **tracking-default** layer. The full
moat stack (per `~/BAZ-research/BAZ-synthesis.md`):

- [x] `attribution-diagnostic` — this repo
- [x] `tracking-default` — this repo
- [x] `operator-agent` — synthesis-sequence engine + knowledge base (Hormozi ACQ pattern)
- [x] `reporting-layer` — Next.js + Supabase white-label dashboard, Midnight Terminal, sub-1.5s LCP (`reporting-layer/`)
- [ ] `client-health` — monthly health score, flags at-risk accounts
- [ ] `revgen-engine` — CRM + outbound sequences + referral prompts

## Guardrails

- Leak fractions are conservative, industry-report-derived and **[composite]**. Replace
  with BAZ empirical data after the first 10 diagnostics (see `docs/DELIVERY.md`).
- EU markets → consent + consent-mode are **non-optional** (GDPR). BAZ never recommends
  deceptive or privacy-violating tactics.
- Urgency/scarcity in the offer must be **real** (3 onboarding slots/quarter), never
  fabricated (Hormozi-launch-ethics guardrail).