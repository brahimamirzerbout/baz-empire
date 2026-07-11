# Email Marketing

Focus: deliverability and compliance (getting to the inbox), list health, and
best practices. Email remains one of the highest-ROI channels (~$36–42 per $1
spent).

## Why deliverability matters

Great content is worthless if it lands in spam. Inbox placement depends on
**sender reputation**, authentication, list quality, sending behavior, and
engagement signals.

## Authentication (mandatory)

Set up all three DNS-based standards:

- **SPF (Sender Policy Framework)** — authorizes which servers may send for your
  domain. Keep the record updated; don't exceed **10 DNS lookups** (SPF auto-fails).
- **DKIM (DomainKeys Identified Mail)** — cryptographic signature proving the
  domain owner sent the message. Use 1024- or 2048-bit keys.
- **DMARC (Domain-Based Message Authentication, Reporting & Conformance)** —
  tells receivers what to do on auth failure. Start at `p=none` (monitor), then
  move to `p=quarantine` or `p=reject`. Requires **domain alignment**: the `From`
  domain must match the one passing SPF or DKIM.
- **BIMI (Brand Indicators for Message Identification)** — shows your logo in
  inbox; requires DMARC `p=quarantine`/`reject` + a VMC (Verified Mark Certificate).

Gmail requirement (Feb 1, 2024): senders of **>5,000 messages/day** to Gmail must
have SPF + DKIM + DMARC, valid forward/reverse DNS (PTR), TLS, and **one-click
unsubscribe**.

## Sender reputation & monitoring

- Use **dedicated vs shared IP** intentionally; shared IPs tie your fate to others.
- Monitor with Google Postmaster Tools, Sender Score, and your ESP dashboards.
- Keep **spam rate below 0.10%**, never reaching 0.30% (Gmail/Yahoo guidance).
- A single spam-trap hit can take 6–12 months to recover from.

## List health (permission-first)

- Use **opt-in**; double opt-in is best practice to block invalid signups.
- **Never buy lists** — they're full of unengaged contacts and tank deliverability.
- Prune invalid/bounced/unsubscribed addresses; verify emails.
- Segment by interest/behavior for relevance.
- Honor unsubscribes within **48 hours**; one-click unsubscribe is required for
  bulk senders.
- Suppress spam complainers automatically.

## Engagement benchmarks (Klaviyo reference)

- Open rate ≥ 33% (note: opens are less reliable post Apple MPP).
- Click rate ≥ 1%.
- Bounce rate < 1.0%.
- Unsubscribe rate < 0.3%.

Engagement (opens, replies, clicks) directly influences inbox placement.

## Content & formatting

- **Subject lines**: honest, no ALL CAPS, no spammy words/excessive punctuation,
  avoid clickbait. Use 3–5 words + strong preview text.
- **HTML**: clean, well-formed; include a **plain-text version**; balance
  text-to-image ratio (don't send one giant image). Keep email < ~100KB.
- **Images**: add alt text; host on trusted domains/CDNs.
- **Links**: use your own domain or ESP-tracked HTTPS links; avoid URL
  shorteners (flagged by spam filters); check links for blacklisting/malware.
- Include physical mailing address in footer + visible unsubscribe (CAN-SPAM,
  GDPR, etc.).

## Sending practices

- **Warm up** new/cold IPs and new domains (esp. <30 days old) gradually.
- Start low (e.g., 1–2K/day per provider), ramp slowly as engagement stays solid.
- Send at a **consistent cadence**; avoid big bursts after silence.
- Monitor SMTP responses (e.g., `4.7.28` / `421` = slow down).
- Target engaged users first to build reputation.

## Compliance

- **CAN-SPAM (US)**: no deceptive headers/subjects, opt-out honored, physical
  address, no pre-checked boxes.
- **GDPR (EU)**: lawful basis + easy withdrawal; honor regional rules.
- **Gmail/Yahoo bulk sender rules** (2024): apply to any sender >5k/day.

## Sources

- Gmail Email sender guidelines: https://support.google.com/mail/answer/81126
- Email Deliverability Checklist (2026) — WordStream: https://www.wordstream.com/blog/email-deliverability-checklist
- Email deliverability best practices — Klaviyo: https://help.klaviyo.com/hc/en-us/articles/25620771311643
- Email deliverability best practice guide — Adobe: https://business.adobe.com/resources/sdk/adobe-experience-platform-email-deliverability-best-practice-guide.html
- 2025 Marketer's Guide to Email Deliverability — Litmus: https://www.litmus.com/blog/why-email-deliverability-matters
- What is Email Deliverability? — Salesforce: https://www.salesforce.com/marketing/email/deliverability/
