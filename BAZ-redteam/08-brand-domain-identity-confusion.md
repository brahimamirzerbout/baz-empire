# 08 — Brand / Domain Identity Confusion (3 Names × 3 Domains)

**Severity:** HIGH
**Dimension:** Brand / Identity / KYC
**Status:** CONFIRMED

## What it is
At least three brand names + three domains coexist with no clear hierarchy:
- **Names:** "BAZ" / "BAZ Ventures" / "BAZ Marketing Ventures" (APK cert, doctrine, `baz-empire.com`); "THE MARKETING AGENCY" (site title, `roi-brand.ts`); "Marketing Hub" (all legal pages, `privacy@marketinghub.app`).
- **Domains:** `baz-empire.com` (site footer "Cockpit"); `marketinghub.app` (legal contact emails — may not be owned); `marketing-hub-roan.vercel.app` (current public deploy — a disposable Vercel URL).

## How the enemy perceives and exploits it
- "What's the company called — BAZ, THE MARKETING AGENCY, or Marketing Hub? Which domain is real — baz-empire.com, marketinghub.app, or a disposable vercel.app URL? If they can't settle their own name + domain, you can't verify them, can't contract them, can't trust them. A competitor sends procurement 'three names, three domains, none consistent' — fails basic KYC."

## How we solve it
- **Lock ONE legal name, ONE trading brand, ONE primary domain.** Everything else redirects or retires.
- Buy + verify the primary domain; stop relying on a disposable `vercel.app` deploy URL for the public face (stable prod URL needed — ties to the URL-mess from the prior turn).
- Unify legal-page contact emails to the owned domain.
- Document the brand hierarchy in the canonical positioning doc (fixes 09).

## Sequence
1. Brahim locks name + domain.
2. Operator rewrites all surfaces (footer, legal emails, cert, APK) to one identity.
3. Set up the stable prod domain (DNS, not vercel.app alias as the public face).
4. Canonical doc records it (09).

## Exit criterion
One legal name, one brand, one domain across site + legal + APK + docs; `vercel.app` is a deploy alias, not the public face.

## Ownership / budget / next
- **Owner:** Brahim (decision) · BAZ Agent (rewrite) · Brahim (domain/DNS).
- **Budget:** ~0.5 day operator + domain cost.
- **Next action (72h):** Brahim locks brand + domain; operator unifies surfaces.

---
Diagnose first, architect the offer, ship the system, hold the line on what moves revenue.