# 13 — Legal Pages Are Non-Enterprise Runtime Stubs

**Severity:** MEDIUM
**Dimension:** Legal pages (umbrella over 05/07/08)
**Status:** CONFIRMED

## What it is
`privacy` / `dpa` / `terms` exist as client-rendered React pages (60–90 lines each) — a reasonable skeleton but not enterprise-grade:
- **No governing law / jurisdiction / named legal entity.**
- **No executed-signature model** (a DPA/Terms are contracts; these are browsable pages).
- **No cookie policy.**
- **Incomplete sub-processor list** (DPA: 3 vs site's 140+ — see 05).
- **Privacy rights not fully enumerated** (GDPR Arts 15–21; page only offers "export or deletion").
- **Brand/domain mismatch:** "Marketing Hub" + `@marketinghub.app` vs site "THE MARKETING AGENCY" at `baz-empire.com` (see 08).
- **No DPA ↔ privacy ↔ terms cross-links; no sub-processor page; no SCC/TIA.**

## How the enemy perceives and exploits it
- "Legal pages are templates rendered at runtime — not executed contracts, no jurisdiction, incomplete sub-processors, wrong domain. Enterprise legal review rejects on first read. A competitor: 'their privacy policy doesn't even name the legal entity or governing law.'"

## How we solve it
Convert to real, entity-headed, jurisdiction-stated, signed documents (ties to 05/07/08):
- Add governing law + named legal entity to all three.
- Add a cookie policy + full GDPR rights enumeration (Arts 15–21).
- Add a maintained `/legal/subprocessors` page.
- Attach SCCs + TIA (05).
- Unify brand + domain (08).
- Cross-link privacy ↔ DPA ↔ terms; add an executed-signature path for the DPA.

## Sequence
1. Counsel upgrades the three pages into documents.
2. Operator unifies brand/domain + adds cross-links + sub-processor page.
3. Publish downloadable PDFs + the live pages in sync.

## Exit criterion
Each legal page names the entity + governing law, lists the full sub-processors, enumerates GDPR rights, and the DPA is executable/signed; brand/domain unified.

## Ownership / budget / next
- **Owner:** counsel (legal content) · BAZ Agent (brand/domain unification + publish).
- **Budget:** folded into 05/07/08 counsel budget.
- **Next action (72h):** counsel engaged; operator unifies brand/domain in the pages.

---
Diagnose first, architect the offer, ship the system, hold the line on what moves revenue.