# 01 — Doctrine Contradiction: Public Site Sells $99/mo SaaS; BAZ Doctrine = NEVER SaaS

**Severity:** CRITICAL
**Dimension:** Positioning / Doctrine
**Status:** CONFIRMED (live-site fetch + operator ground truth)

## What it is
The live public site (https://marketing-hub-roan.vercel.app, branded "THE MARKETING AGENCY") sells a self-serve SaaS subscription:
- "$99/mo. Or your money back."
- "Start free for 7 days" / "Free for 7 days. Then $99/mo."
- "Cancel anytime."
- "30-day money-back guarantee. No questions asked."
- "One workspace. Unlimited campaigns. All 11 Nova agents… Stripe or Revolut."

BAZ's defining doctrine (ground truth) is the opposite:
- "Pricing: project + retainer, NEVER SaaS subscriptions. Core $6.5–9.5k/mo (90-day min, one channel); Growth $18–28k/mo quarterly; Project $12–80k fixed."
- "Never position BAZ as SaaS… or a hype/growth-hacking shop."

So the company's public face directly contradicts its foundational positioning. Two identities coexist under baz-empire.com — a $99/mo self-serve SaaS "marketing hub" tool, and a senior-partner retainer agency — with no clear separation.

## How the enemy perceives and exploits it
- **The one-screenshot kill:** "BAZ pitches you an $18k/mo senior retainer, but their website sells a $99/mo SaaS you can cancel anytime. Which is it? Go look." A competitor sends that screenshot to any prospect BAZ is closing. The contradiction collapses the premium positioning in seconds — no rebuttal survives the screenshot.
- **Procurement downgrade:** enterprise buyers see "$99/mo, cancel anytime, self-serve" and classify BAZ as a vendor tool, not a strategic partner. The retainer pricing power is destroyed before the first call.
- **False-advertising angle:** if the SaaS and the agency are the same entity making contradictory pricing promises, it's misleading-pricing exposure (FTC §5; EU/UK consumer-protection equivalents).
- **The doctrine line itself:** BAZ forbids being seen as a "hype/growth-hacking shop." A "$99/mo, 11 Nova agents, ship daily, money-back, 7 days free" self-serve pitch is the textbook hype-shop posture — the site makes BAZ look like exactly what it says it isn't.

## How we solve it
**Decision required (owner: Brahim, founder):** is the marketing-hub a separate product/brand from the BAZ agency, or the same?
- **Option A (recommended):** Separate them. The hub SaaS gets its own brand + legal entity + its own terms/pricing/DPA. The BAZ agency site is retainer-only, senior-partner, no SaaS pitch. The agency can refer clients to the hub as a tool, but the agency face never says "$99/mo, cancel anytime." Two clear identities, zero contradiction. (This makes the hub its own company-grade product — most of the rest of this dossier then applies to the hub entity.)
- **Option B:** Kill the standalone SaaS. Reposition the hub as a value-add / internal orchestration tool included in retainers — not a $99/mo subscription. The public site drops all self-serve subscription language.

## Sequence
1. Founder decides A or B — 7 days.
2. Operator restores the canonical positioning doc (fixes finding 09) recording the decision as the single source of truth.
3. Operator rewrites the public site + `src/lib/roi-brand.ts` + all sales collateral to match.
4. If Option A: stand up the hub as a separate entity with its own legal/compliance stack (DPA, sub-processors, refund honoring, support SLA). If Option B: strip subscription billing surfaces.

## Exit criterion
A first-time visitor cannot tell from the site whether BAZ is a $99/mo SaaS or a senior retainer agency — the contradiction is eliminated. Verify: re-fetch the live site; no self-serve "$99/mo… cancel anytime… 7 days free" SaaS pitch coexists with senior-partner retainer claims on the same brand surface.

## Risk if unfixed
Every enterprise pitch is one screenshot away from collapse; pricing power erodes; legal exposure on contradictory pricing.

## Ownership / budget / next
- **Owner:** Brahim (decision) · BAZ Agent (rewrite + canonical doc).
- **Budget:** ~1–2 days operator time for the rewrite; Option A adds entity-formation + legal stack (separate scope).
- **Next action (72h):** founder picks A or B; operator re-fetches the site, drafts the canonical positioning doc, scopes the rewrite.

---
Diagnose first, architect the offer, ship the system, hold the line on what moves revenue.