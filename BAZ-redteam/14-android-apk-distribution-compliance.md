# 14 — Android APK Distribution Compliance (Noted, Lower Priority)

**Severity:** MEDIUM (rises if distribution broadens)
**Dimension:** Distribution / App compliance
**Status:** NOTED

## What it is
`baz-empire-hub` APK (signed `CN=BAZ Ventures`) wraps the hub webview. Currently sideloaded (not on Play Store). If distributed broadly it needs: in-app privacy-policy link + store-listing data-safety disclosure, data-collection consent (esp. EU/CA), age/content rating, export-compliance. Sideloaded also means no auto-update security path.

## How the enemy perceives and exploits it
- "Distribute the APK without in-app privacy policy + data-safety disclosure → Play Store rejection (if listed) or GDPR/CCPA breach if it collects data. Sideloaded = users on stale, vulnerable builds."

## How we solve it
- Add an in-app privacy-policy link + data-safety disclosure.
- Add a consent banner for EU/CA users if any data is collected.
- Decide the distribution channel (sideload vs Play Store) and its compliance stack.
- Provide an update path (OTA or store) so sideloaded users aren't stranded.

## Sequence
1. Decide distribution channel.
2. Add in-app privacy link + data-safety section.
3. Consent + rating + export compliance per channel.
4. Update mechanism.

## Exit criterion
The APK ships an in-app privacy link + accurate data-safety disclosure + (if EU) consent; a defined distribution channel with its compliance met.

## Ownership / budget / next
- **Owner:** BAZ Agent.
- **Budget:** ~0.5 day, once distribution is decided.
- **Next action:** when the distribution decision is made, execute the compliance additions.

---
Diagnose first, architect the offer, ship the system, hold the line on what moves revenue.