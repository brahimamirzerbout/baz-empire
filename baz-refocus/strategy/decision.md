# Part 3 — Agency or Product? The Decision.

You are running two businesses under one roof and calling it one. That is
extensity — the exact disease `docs/INTENSITY_PRINCIPLE.md` warns against.

## The two businesses
1. **BAZ the agency** — founder-led, AI-native, senior-only. Sells outcomes.
2. **Marketing Hub the product** — a 30-section all-in-one command center. Sells software.

Different promises. Different buyers. Different sales motions. Doing both at
once splits the founder's attention and dilutes the story.

## The decision (this quarter)
- **Lead: the agency.** It has a real, payable offer and a real edge.
- **Marketing Hub: internal tool.** It is the weapon BAZ uses to deliver the
  45-day system faster than any competitor. It is NOT marketed this quarter.
- **Trigger to revisit:** only when the agency has a waitlist AND a client-success
  lead (Part 9) running renewals — then spin the Hub into its own company.

## What this means in code
`assets/positioning.ts → decision` encodes it:
```ts
decision: {
  lead: "agency",
  productStatus: "internal tool — used on every client, not marketed",
}
```
The landing page (`index.html`) sells the agency offer. The Hub is never linked
from the front door this quarter.
