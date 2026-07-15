# BAZ Tracking Default — reference templates

These are reference scaffolds, not copy-paste production configs. Each client deployment
adapts them to the client's stack. The point: the *shape* is reusable (moat), the *values*
are bespoke (service).

## ssGTM (server-side Google Tag Manager)

Deploy a GCP/AWS-hosted ssGTM container. Client loads a first-party endpoint
(`https://metrics.<client-domain>/g/...`) instead of `googletagmanager.com`. This
survives ad-blockers + browser ITP and gives BAZ a data layer it owns.

Key events to route server-side:
- `page_view`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase`
- `lead`, `signup`, `subscribe`
- Custom: `demo_booked`, `trial_started`, `trial_converted`

## GA4

- Define **key events** (conversions) scoped to revenue, not just `purchase`.
- Disable automatic GA4 advertising features if EU/CA consent not given (consent-mode).
- Link to Google Ads + BigQuery export for the MMM-lite model.

## Meta CAPI

- Server-side `Purchase` / `Lead` / `Subscribe` events with `event_id` deduplication vs
  the pixel.
- Include `value`, `currency`, `content_type`, `contents`.
- Pass `event_source_url` for attribution integrity.

## Google Enhanced Conversions

- Hash (SHA-256) first-party PII (email, phone) server-side before sending.
- Deduplicate with gtag via `transaction_id`.

## Consent (GDPR — non-optional for EU markets)

- CMP that integrates with Google consent-mode v2 + Meta's data processing options.
- Default-deny; modeled conversions for consent-denied users.
- Document the lawful basis (legitimate interest for B2B where applicable) — BAZ never
  recommends deceptive or privacy-violating tactics.

## Attribution model + MMM-lite

- Switch GA4/Google Ads from last-click to **data-driven** attribution.
- MMM-lite: a simple regression of revenue on channel spend (weekly), run in BigQuery or
  a notebook, to triangulate platform-reported vs modeled vs incrementality. The moat
  against platform attribution inflation.

## Lifecycle events

- Feed post-purchase events (`ltv_30d`, `refund`, `churn`) back to ad platforms so
  optimization targets true value, not first purchase.