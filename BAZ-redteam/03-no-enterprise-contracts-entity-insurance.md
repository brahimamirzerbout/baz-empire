# 03 — No Enterprise Contracts, No Entity, No Insurance on Disk

**Severity:** CRITICAL
**Dimension:** Contracts / Legal entity / Insurance
**Status:** CONFIRMED (maxdepth-6 find returned only false positives)

## What it is
A filesystem find (maxdepth 6) for enterprise/legal docs returned zero real hits — only false positives (`ErrorBoundary.tsx`, `content-calendar-template.md`, `BRAND-STANDARD.md`, `dependabot.yml`, `calendar.h`). Specifically **absent**:
- Enterprise contracts: MSA, SOW, NDA, engagement letter, order form.
- Entity formation: no SARL/SASU articles, no Morocco RC/Patente, no Kbis-equivalent.
- Insurance: no E&O, no professional indemnity (RCPro), no cyber liability, no COI.
The APK signing cert says `CN=BAZ Ventures, O=BAZ Marketing Ventures, L=Casablanca, C=MA` — a trading name exists, but there is no evidence on disk the entity is registered, the founder is shielded, or insurance is in force.

## How the enemy perceives and exploits it
- **Onboarding block:** enterprise procurement requires a *signed* MSA + DPA + an insurance Certificate of Insurance before a vendor clears legal/security. BAZ cannot produce any of the three. A competitor tells the prospect's procurement: "Ask BAZ for their MSA, DPA, and COI." They can't. Deal dead before it starts.
- **Personal liability:** with no registered entity, the founder has **unlimited personal liability** for every client engagement, every debt, every IP claim (incl. finding 02's right-of-publicity exposure). One lawsuit lands on the founder's personal assets.
- **No insurance:** one claim (data breach, IP infringement, client loss) is uninsured → catastrophic, possibly terminal.

## How we solve it
**Three workstreams, in order:**
1. **Entity** — register the legal entity (Morocco SARL AU / SASU; or stand up an EU/US subsidiary for EU/US clients) to separate founder liability. Owner: Brahim + counsel.
2. **Contracts** — produce the enterprise stack, counsel-vet, jurisdiction-specific: MSA (governing law, liability cap, IP assignment, confidentiality, termination), SOW template (scope, deliverables, fees, milestones, acceptance), mutual NDA, DPA (fix 05), order form. Owner: counsel + operator.
3. **Insurance** — E&O / professional indemnity (RCPro in MA), cyber liability (data breach), general liability. Owner: Brahim + broker.

## Sequence
1. Confirm/stand up the entity (cert of incorporation / RC extract).
2. Draft + counsel-vet MSA/SOW/NDA/DPA templates.
3. Procure insurance; obtain COI.
4. Publish a one-page trust/compliance page linking entity, (redacted) COI, DPA, sub-processor list.

## Exit criterion
Enterprise procurement can request MSA + DPA + COI and receive all three, current and signed, within 48h.

## Ownership / budget / next
- **Owner:** Brahim (entity + insurance) · counsel (contracts) · BAZ Agent (templates + trust page).
- **Budget:** entity + insurance ~$1–3k + counsel ~$2–5k (one-time); insurance ~$1–5k/yr ongoing.
- **Next action (72h):** Brahim confirms entity status (registered or not); if not, file; engage counsel for contract templates.

---
Diagnose first, architect the offer, ship the system, hold the line on what moves revenue.