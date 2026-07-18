# 07 — Money-Back Guarantee Advertised but Terms Say "Discretionary" + "We've Never Paid Out"

**Severity:** HIGH
**Dimension:** Legal / Guarantees / False advertising
**Status:** CONFIRMED

## What it is
- Homepage: "$99/mo. Or your money back." + "30-day money-back guarantee. **No questions asked.** You ship, or you don't pay." FAQ: "What if I hate it? 30-day money-back. No questions. We refund the entire month."
- Terms (`terms/page.tsx §5`): "Refunds are **at our discretion** for partial months." — discretionary, directly contradicting "no questions asked."
- `roi-brand.ts` + `templates.ts` (client-facing proposals): "First measurable artifact in 14 days — or month 1 is free. **We've never paid out.**" — an unverifiable boast baked into client proposals.

## How the enemy perceives and exploits it
- "BAZ advertises '30-day money-back, no questions asked' but their own Terms say 'refunds at our discretion' — bait-and-switch, false advertising (FTC §5). And 'we've never paid out' is an unverifiable boast that becomes a breach the first time a refund is denied. A competitor: 'Read their own terms — the money-back is a lie.'"

## How we solve it
- **Make the terms match the ad.** Either honor an unconditional 30-day money-back (write it into Terms §5: "full refund within 30 days, no questions") OR drop the "no questions asked" guarantee from all marketing. Pick one; cannot advertise unconditional and contract discretionary.
- Remove "we've never paid out" from client-facing templates — unverifiable, no upside, all downside. Replace with the actual policy.
- Track + substantiate any refund-rate claim if made.

## Sequence
1. Brahim decides: honor unconditional 30-day (recommended for a $99/mo SaaS) or reword marketing to match terms.
2. Align Terms §5 + all marketing copy.
3. Strip "never paid out" from `roi-brand.ts` + `templates.ts`.
4. If honoring, build the no-questions refund flow.

## Exit criterion
Marketing guarantee == terms refund policy, verbatim in effect; no "never paid out" claims anywhere.

## Ownership / budget / next
- **Owner:** Brahim (policy decision) · BAZ Agent (terms + copy) · counsel (terms review).
- **Budget:** ~0.5 day + counsel terms review.
- **Next action (72h):** Brahim decides honor-or-reword; operator aligns terms + marketing; strips "never paid out."

---
Diagnose first, architect the offer, ship the system, hold the line on what moves revenue.