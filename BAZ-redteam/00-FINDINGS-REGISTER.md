# BAZ Red-Team Dossier — Adversarial Audit for Company-Grade Hardening

**Auditor:** BAZ Agent (red-team, hostile-competitor lens)
**Subject:** BAZ / "THE MARKETING AGENCY" / "Marketing Hub" — public face + on-disk posture
**Method:** inspect ground truth (live site + source + on-disk docs + agent system) → findings → per-finding documents (what-it-is / enemy-lens / fix)
**Doctrine anchor:** retainer/project, NEVER SaaS; never fabricate proof; never imply unheld certifications; security-first; GDPR/EU.
**Live site inspected:** https://marketing-hub-roan.vercel.app (+ /case-studies)
**Source inspected:** /home/uzer/marketing-hub (the deployed Next.js app)

## Findings register (all CONFIRMED unless noted)

| ID | Sev | Dimension | Finding | Enemy exploit (one-liner) | Status |
|---|---|---|---|---|---|
| 01 | CRITICAL | Positioning/Doctrine | Public site sells $99/mo SaaS ("cancel anytime," 7-days-free, money-back); doctrine = retainer, NEVER SaaS | "They pitch $18k/mo, site says $99/mo — which is it?" one screenshot kills the deal | CONFIRMED |
| 02 | CRITICAL | IP / Right of publicity | Marketplace: "Hire Seth, Gary, PBD, Kotler, Ogilvy, Schwartz" — living people + 2 deceased estates | One C&D email = takedown; "hire Seth Godin for $99" = false ad | CONFIRMED |
| 03 | CRITICAL | Contracts/Entity | Zero enterprise contracts (MSA/SOW/NDA/DPA), zero entity/insurance docs on disk (maxdepth 6) | "No MSA/DPA/COI → can't onboard; founder = unlimited personal liability" | CONFIRMED |
| 04 | CRITICAL | Marketing claims/Proof | Hardcoded testimonials (@example.com seed personas) + case studies labeled "Real numbers" on invented data | "Testimonials are fake (@example.com), the $1.2M ARR story is invented" → FTC + trust kill | CONFIRMED |
| 05 | CRITICAL | Data protection/GDPR | DPA is an 84-line stub: 3 sub-processors vs site's 140+; no governing law; no signature model; no SCC/TIA | "DPA is a marketing page, not a contract → EU legal review rejects on p.1" | CONFIRMED |
| 06 | HIGH | Data protection | "Sovereign/your machine/SQLite/no lock-in" contradicted by 140+ APIs + Stripe/Revolut + Google Cloud | "False 'sovereign' + undisclosed sub-processors = GDPR Art.28 breach" | CONFIRMED |
| 07 | HIGH | Legal/Guarantees | Homepage "30-day money-back, no questions" vs Terms §5 "refunds at our discretion" + "we've never paid out" | "Advertise money-back, terms deny it = false ad + breach" | CONFIRMED |
| 08 | HIGH | Brand/Identity | 3 names (BAZ / TMA / Marketing Hub) × 3 domains (baz-empire.com / marketinghub.app / vercel.app) | "Three names, three domains, none consistent — fails KYC" | CONFIRMED |
| 09 | HIGH | Governance | Canonical positioning doc (`~/Desktop/BAZventures-Public-Site-Canonical.md`) = ENOENT; only fragments | "No source of truth → brand drifts, site contradicts itself" | CONFIRMED |
| 10 | HIGH | Security | baz-agent-system (AI ops/Nova) has zero security/compliance/policy docs | "AI on client data, no controls doc → security review fails" | CONFIRMED |
| 11 | HIGH | IP/Trademarks | No trademark registration found (BRAND-STANDARD.md exists, no reg) | "Didn't protect the name — I register it first, force a rename" | CONFIRMED |
| 12 | HIGH | Marketing claims | "60+ brands" attributed to BOTH the agency (roi-brand.ts) and the founder personally (about.ts) | "'60+' is the founder's CV, not the agency's clients — inflated" | CONFIRMED |
| 13 | MEDIUM | Legal pages | privacy/dpa/terms are runtime stubs — no jurisdiction, no cookie policy, incomplete rights, wrong domain | "Privacy policy doesn't even name the entity or governing law" | CONFIRMED |
| 14 | MEDIUM | Distribution | Android APK — in-app privacy policy + data disclosure needed if distributed beyond sideload | "Sideloaded app, no privacy link → store/GDPR breach" | NOTED |
| 15 | HIGH | Build integrity | Live deploy ≠ committed source — homepage marketplace block not in checkout; untracked WIP (giants/wisdom) | "Live site can't be audited/reproduced from source — can't attest what's running" | CONFIRMED |

## Documents shipped (this dossier)
`00-FINDINGS-REGISTER.md` · `01`..`15` (one file per finding; 15 added this pass — deploy/source drift)

## Verification results (this pass)
- **04:** testimonials hardcoded in `src/app/(public)/page.tsx:332-346`; personas use `@example.com` (`orchestrator.ts` seed data); case-studies page labels invented data "Real numbers."
- **12:** `roi-brand.ts:65` → agency; `about/page.tsx:33,51` → founder personally; same number, dual use.
- **05/13:** DPA lists 3 sub-processors vs site's 140+; no governing law; no signature model; Terms §5 "at our discretion" contradicts "no questions" money-back (ties 07).
- **11:** maxdepth-6 find still returns only false positives (ErrorBoundary, content-calendar, dependabot).
- **09:** referenced canonical ENOENT; fragments exist (`baz/bazventures.html`, `marketing-docs/bazventures-org-chart.md`) but no single source of truth.

## Priority sequence (fix first → last)
1. **02** marketplace real-names — one-email C&D kill — 48h
2. **04** fabricated proof + **12** 60+ misattribution — strip now
3. **01** SaaS-vs-retainer decision + **08** brand/domain lock + **09** canonical doc — 7 days
4. **03** entity/contracts/insurance + **05/13** legal upgrade + **06** sovereign claim — enterprise-onboarding gate
5. **07** money-back align + **10** agent security + **11** trademarks — 2–4 weeks
6. **14** APK — when distribution broadens

## Closing
Diagnose first, architect the offer, ship the system, hold the line on what moves revenue.