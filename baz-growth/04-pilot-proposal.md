# 04 — 90-day pilot proposal (the close document)

> The document that goes to the prospect after the 20-min audit reveals the
> gap. Operator-grade, board-ready. Every number is real (from the audit) or
> flagged `[replace with real]`. No composites unflagged. No vanity metrics.

## Structure (use exactly this)

1. **Diagnosis** — the gap the audit found (their numbers).
2. **The 90-day plan** — what we do, week by week, with named owner + budget.
3. **The offer** — Core retainer, one channel, price, term.
4. **Exit criterion** — day-90 targets, renew/graduate rule.
5. **Proof plan** — what we instrument day 1.
6. **Next action** — the one signature that starts the clock.

---

## Template (fill from the audit)

### BAZ — 90-day performance pilot
**Prepared for:** {company} · {buyer title}
**Date:** {date} · **BAZ partner:** Brahim ZERBOUT

### 1. Diagnosis
> The audit ran your last 30 days of {channel} spend through our ROAS-weighted
> reallocator. Three findings:
>
> 1. **Tracking gap:** {finding — e.g. "only 62% of conversions reach your
>    server; platform ROAS is overstated by ~38%"}.
> 2. **Budget misallocation:** {finding — e.g. "$3,000/mo on {channel} at
>    ROAS 0.7 should move to {channel} at ROAS 5.6"}.
> 3. **Payback blind spot:** {finding — e.g. "no server-side CAC or payback
>    measurement in place"}.
>
> Net: you are spending ${monthly_spend}/mo against numbers that are lying to
> you. The fix is the offer below.

### 2. The 90-day plan

| Week | Work | Owner | Exit |
|---|---|---|---|
| 1–2 | Server-side tracking live (GTM server + GA4 + CAPI for {channel}) | BAZ partner + client dev | tracking fires, real ROAS visible |
| 3–4 | First reallocation against real ROAS; 2 creative variants launched | BAZ partner | reallocator chart shipped |
| 5–8 | Weekly reallocation + creative iteration; payback measurement live | BAZ partner | CAC + payback in the dashboard |
| 9–12 | Optimize to day-90 targets; expansion proposal (Growth tier) if warranted | BAZ partner | day-90 review |

**Client investment:** Core retainer ${price}/mo × 3 months + existing media
spend (unchanged). No setup fee.

### 3. The offer

| | |
|---|---|
| **Tier** | Core retainer |
| **Scope** | One channel: {channel}. Tracking + weekly reallocation + weekly demo + monthly revenue report. |
| **Price** | ${price}/mo (band by media spend) |
| **Term** | 90-day minimum, then month-to-month |
| **Delivery** | Senior partner (Brahim ZERBOUT). No junior pod. |
| **Start** | {start date} on signature |

### 4. Exit criterion (day 90)

| Target | Day-90 goal | Baseline (from audit) |
|---|---|---|
| Tracked ROAS ({channel}) | +20% | {audit baseline} |
| Payback period | −15% | `[replace with real after week 2]` |
| Blended CAC | −10% | `[replace with real after week 2]` |

> Hit the targets → we renew or propose Growth (add channels + SEO/content).
> Miss because the channel can't carry it → we graduate you with a documented
> handoff. No retention theater.

### 5. Proof plan (what's instrumented day 1)

- Server-side GTM container, GA4, {channel} CAPI.
- `AdMetric` ingestion via the {channel} adapter (Google/Meta/TikTok).
- ROAS, CAC, payback, reallocation chart — live in your client portal.
- CSV export of every metric. You own the data.

### 6. Next action

Sign the SOW (attached) by {date} to start week 1 on {start date}. The clock
starts when tracking goes live — everything before that is on us.

— Brahim ZERBOUT, BAZ

---

## Proposal hygiene rules

| Rule | Why |
|---|---|
| **Every number from the audit is real.** No estimates dressed as data. | proof beats promises |
| **Every number NOT from the audit is `[replace with real]`.** | never fabricate |
| **No vanity metric appears.** No impressions, no reach, no "engagement." | revenue not vanity |
| **The price is in the offer section, once.** No hidden fees, no setup. | offer clarity |
| **The exit criterion is in the SOW, not a footnote.** | retention discipline |
| **One signature starts the clock.** No multi-step procurement theater for a Core retainer. | close rate |

## Risk flags for the partner (internal, not in the doc)

- If the audit revealed spend < $20k/mo → do not send this proposal; the
  channel has no ROAS signal to optimize. Refer to a project or pass.
- If the client wants two channels day 1 → quote Growth, not Core. Don't
  discount Core to fit.
- If the client asks for a case study → share the composite template (`06`)
  with the flag visible, or wait until pilot 1 ships. Never fabricate.