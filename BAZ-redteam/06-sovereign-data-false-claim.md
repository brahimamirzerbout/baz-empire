# 06 — "Sovereign / Your Data" False Claim vs 140+ APIs + Stripe/Revolut

**Severity:** HIGH
**Dimension:** Data protection / False advertising
**Status:** CONFIRMED

## What it is
Homepage: "Your marketing, sovereign. The first single-machine marketing hub… Own your data." FAQ: "Where does my data live? Your machine. SQLite. You can back it up, export it, leave with it. **Sovereign**." + "No per-seat. No data lock-in."
Yet: "**140+ APIs & tools** — every workflow covered" + "Stripe or Revolut" + connects Google Ads/Meta/TikTok/LinkedIn (OAuth) + (DPA) Google Cloud hosting.
So client data flows to 140+ third parties + a payment processor + cloud + 4 ad platforms — **not** "sovereign / your machine / SQLite."

## How the enemy perceives and exploits it
- "BAZ says 'sovereign, your machine, no data lock-in' but ships client data to 140+ APIs, Stripe/Revolut, Google Cloud, and 4 ad platforms. False 'sovereign' claim + undisclosed-sub-processor breach (GDPR Art 28/13). A competitor sends the screenshot to the DPO: 'They claim sovereign but your data goes to 140+ vendors — where's the list?' False advertising + GDPR."

## How we solve it
- Stop claiming "sovereign / your machine" if the product integrates 140+ APIs + cloud. Either:
  - **(a)** make it genuinely local-first (data stays on the user's machine; APIs are outbound-only read/act, no client data stored vendor-side) — and **prove** it; or
  - **(b)** drop "sovereign" and accurately disclose: "your data is stored locally + synced to [list] for [purposes]."
- Publish the complete, accurate sub-processor + third-party-API list (ties to 05).
- Be precise: SQLite local store + outbound integrations ≠ "sovereign" if any data lands vendor-side.

## Sequence
1. Map exactly where client data lands (local SQLite vs vendor-side).
2. Correct or remove the "sovereign" claim to match reality.
3. Publish the full third-party list.
4. Align privacy policy + DPA to the real data flow.

## Exit criterion
The public "sovereign" claim is either true (proven, no vendor-side storage) or removed; the full third-party list is published.

## Ownership / budget / next
- **Owner:** Brahim (data-architecture truth) · BAZ Agent (copy + list).
- **Budget:** ~0.5 day operator.
- **Next action (72h):** map the real data flow; correct or remove "sovereign."

---
Diagnose first, architect the offer, ship the system, hold the line on what moves revenue.