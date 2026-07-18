# 05 — GDPR/DPA Is a Non-Enterprise Skeleton (Incomplete Sub-Processors, No Governing Law, No Signature Model)

**Severity:** CRITICAL
**Dimension:** Data protection / GDPR
**Status:** CONFIRMED (`src/app/legal/dpa/page.tsx`, 84 lines)

## What it is
The DPA is an 84-line runtime web page. It cites GDPR Art 28/33, names roles (Controller/Processor), lists **3** sub-processors (Stripe, Google Cloud, email provider), 72h breach notice, SCCs "on request," DPO `dpo@marketinghub.app`. Gaps:
- **Sub-processor list incomplete:** the site advertises "**140+ APIs & tools**" + Stripe/Revolut; the DPA lists 3. GDPR Art 28(2) requires the full list.
- **No governing law / jurisdiction / courts.**
- **No executed-signature model:** a DPA is a *contract* — must be signed per customer by a named legal entity on each side. A static web page is not an executed DPA.
- **No sub-processor change-notification mechanism** (Art 28(2): prior notice + right to object).
- **No SCCs attached** (just "on request"); EU clients need the 2021/914 SCC modules executed.
- **No Transfer Impact Assessment** for non-adequate transfers (Schrems II).
- **DPO contact on an unconfirmed domain** (`marketinghub.app`).

## How the enemy perceives and exploits it
- "BAZ's DPA is a marketing page, not a contract — no signatures, no governing law, no full sub-processor list, no SCCs, no TIA. EU procurement legal review rejects it on page 1. They can't lawfully process EU personal data. A competitor tips off a client's DPO → the EU deal is blocked pre-signature, and any existing EU client could terminate for DPA breach."

## How we solve it
- Convert the DPA page into a real, **executable DPA document** (PDF, entity-headed, signature blocks) based on the EU Commission 2021/914 SCCs + a service-specific addendum.
- Publish a **maintained, dated, complete** sub-processor list (the real list — not 3 of 140+).
- Add governing law + jurisdiction (entity jurisdiction; or Ireland/UK for EU adequacy).
- Add sub-processor update-notice + objection mechanism.
- Attach SCCs + conduct + publish a TIA for non-adequate transfers.
- Appoint + name a DPO (real contact, owned domain).
- Execute per-customer (counter-signed), not just browsable.

## Sequence
1. Counsel drafts executable DPA + SCCs from the existing skeleton.
2. Operator inventories the real, complete sub-processor list.
3. Publish at `/legal/dpa` (downloadable) + `/legal/subprocessors`.
4. Per-customer execution workflow.

## Exit criterion
An EU client's DPO can download a signed DPA + full sub-processor list + SCCs + TIA and pass legal review.

## Ownership / budget / next
- **Owner:** counsel (DPA/SCC/TIA) · BAZ Agent (sub-processor list + publish) · Brahim (DPO appointment).
- **Budget:** counsel ~$2–5k for the DPA suite; ongoing sub-processor maintenance.
- **Next action (72h):** counsel engaged for DPA+SCC; operator inventories the real sub-processor list.

---
Diagnose first, architect the offer, ship the system, hold the line on what moves revenue.