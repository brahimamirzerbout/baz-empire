# 12 — "60+ Brands" Misattribution: Agency Roster vs Founder's Personal Résumé

**Severity:** HIGH
**Dimension:** Marketing claims / Misrepresentation
**Status:** CONFIRMED

## What it is
The same "60+ / sixty-plus brands" number is used two ways:
- `roi-brand.ts:65` (agency voice): "You only get to call yourself THE MARKETING AGENCY if you can back it… **sixty-plus brands** across MENA, EU, and US, every one tied to pipeline." → attributes 60+ to the *agency*.
- `about/page.tsx:33`: "founder-engineer across AI, CRM, Linux/security, and Next.js + Supabase. **60+ brands**" → attributes 60+ to the *founder personally* (his career).
- `about/page.tsx:51`: `<Stat n="60+" label="brands shipped" />` → displayed as an agency stat.
So the founder's personal career history (across prior employers/companies) is presented as the agency's client track record. Same number, dual use.

## How the enemy perceives and exploits it
- "BAZ claims '60+ brands' as agency work, but their own about page says those are the founder's personal projects across prior employers. That's the founder's CV dressed up as agency credentials — inflated. A competitor asks for the agency's actual client list + dated case studies; it's a fraction of 60. Misrepresentation."

## How we solve it
- Separate the two claims: founder's career history (personal, across employers) vs the agency's actual client roster (post-founding). Different numbers.
- The agency stat = the agency's real client count + real case studies (ties to 04).
- The founder's 60+ = a personal-credibility line, clearly attributed ("the founder has shipped 60+ across his career"), not the agency's roster.
- Substantiate: tie each "brand" to a real, dated engagement (or mark `[composite]`/`[replace with real]`).

## Sequence
1. Brahim splits founder-history vs agency-roster.
2. Agency stat = real client count (from the 04 audit).
3. Founder line clearly personal + attributable.
4. Canonical doc records the distinction (09).

## Exit criterion
The agency "60+ brands" stat is either real-agency-clients (substantiated) or replaced with the real agency number; the founder history is clearly personal.

## Ownership / budget / next
- **Owner:** Brahim (which are agency vs personal) · BAZ Agent (rewrite).
- **Budget:** ~0.5 day.
- **Next action (72h):** Brahim splits the list; operator corrects `roi-brand.ts` + the about page.

---
Diagnose first, architect the offer, ship the system, hold the line on what moves revenue.