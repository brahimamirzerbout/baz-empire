# 04 — Fabricated Testimonials + Case Studies Presented as Real

**Severity:** CRITICAL
**Dimension:** Marketing claims / Proof (doctrine: never fabricate)
**Status:** CONFIRMED

## What it is
- Homepage "Trusted by operators who ship" shows 3 testimonials **hardcoded** in `src/app/(public)/page.tsx:332-346`: "Aïcha M." (Marketing Lead, fintech), "Diego S." (Founder, B2B SaaS), "Eugenia A." (Agency Owner).
- `src/lib/orchestrator.ts` defines these as **seed personas**: `slug:"eugenia-anami"`, `contact_email:"eugenia@example.com"`; `slug:"diego-santos"`, `contact_email:"diego@example.com"`. `@example.com` = not a real client — fabricated seed data.
- Onboarding copy (`page.tsx:302`): "Pick your industry. We seed 12 campaigns, 50 contacts, 14 articles, 3 case studies. **Real data**." — admits the data is seeded, yet the homepage shows seed personas as "Trusted by."
- Case-studies page: "Customer stories · **Real numbers**" with "Doubled client capacity… $1.2M ARR · Agency · France" and "Pipeline 3x'd… B2B SaaS · Germany · $178K→$540K, CAC $14K→$5.6K, LTV/CAC 1.4x→6.2x." Labeled "Real numbers" on what matches the seed pattern.
- Cockpit stat bar: "$72K MRR · LTV/CAC 9.15x · Retention 94% · Pipeline $178K · 23 deals" — same provenance risk.

## How the enemy perceives and exploits it
- "BAZ's testimonials are fake — the 'clients' use `@example.com` emails (Diego Santos = `diego@example.com`). The $1.2M ARR case study is invented, labeled 'Real numbers.' FTC §5 (deceptive endorsements, no substantiation) + UK ASA / EU equivalents. One screenshot to the regulator or a prospect = trust kill + fine."
- It violates BAZ's **own written doctrine**: "Never fabricate client metrics, testimonials, or case studies." The agency is breaking the standard it sells on.

## How we solve it
**Verify, then replace or remove:**
- Audit every public social-proof surface (testimonials, case studies, stat bars, cockpit metrics): real or seed?
- If Aïcha/Diego/Eugenia are real clients → replace pseudonyms with real, consented, attributed names + audited metrics + consent on file.
- If they are seed/demo (the `@example.com` evidence says yes) → **remove from public conversion surfaces immediately.** Demo data belongs on a `/demo` route labeled "illustrative," not on "Trusted by" / "Real numbers."
- Substantiate every public metric (MRR, LTV/CAC, retention, ARR, pipeline): real + audited, or stripped.

## Sequence
1. Brahim flags each testimonial/case study/metric: real or fake.
2. Operator strips confirmed-fake from the live homepage + case-studies page.
3. Replace with real, consented, attributed proof — or nothing until real exists.
4. Label any remaining demo content "illustrative."

## Exit criterion
Zero `@example.com` personas on public pages; every public testimonial/case study/metric is either a real, consented, attributable client or clearly labeled illustrative. Verify: re-fetch + grep source confirms.

## Ownership / budget / next
- **Owner:** Brahim (verify real vs fake) · BAZ Agent (strip + replace) · counsel (consent language if real-client attribution added).
- **Budget:** ~1 day operator + counsel review.
- **Next action (72h):** Brahim flags each item real-or-fake; operator strips confirmed-fake from the live site.

---
Diagnose first, architect the offer, ship the system, hold the line on what moves revenue.