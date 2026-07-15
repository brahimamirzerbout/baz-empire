// BAZ Refocus — single source of truth for the relaunch.
// One audience. One offer. One channel. (See docs/INTENSITY_PRINCIPLE.md)
//
// This file IS the strategy. Every page below imports it. Change the business
// here, not in the markup.

export const positioning = {
  // PART 1 — The smallest viable audience.
  // Not "ambitious businesses". A census is not a customer.
  audience: {
    name: "Technical founders & solo operators",
    who: "AI-native / software founders doing $20k–$250k/mo who build the product themselves",
    pains: [
      "Hate slow, junior-staffed agencies that send decks instead of results",
      "Don't have time to become a marketer and don't trust generalists",
      "Tried 5 channels at once, got noise, not signal",
    ],
    want: "One senior team that ships their entire marketing system and gets out of the way",
    antiAudience: "Enterprise procurement, brand-only plays, anyone who needs 3 quotes and a committee",
  },

  // PART 2 — Kill 80% of the menu. One hero offer.
  // The other 13 services still exist; they are NOT on the homepage.
  heroOffer: {
    id: "system-in-45",
    name: "Your marketing system, built and running in 45 days",
    promise: "One senior team. One channel. One funnel. Live in 45 days — or you don't pay.",
    price: "Flat $9,500 + 10% of attributed lift, first 90 days",
    outcome: "A compounding owned channel (email/SEO) + one paid channel at statistical significance",
    // The 13 services we deliberately HIDE from the front door:
    hiddenServices: [
      "Brand architecture & identity system",
      "UI/UX & front-end development",
      "Market intelligence report",
      "Competitor vulnerability audit",
      "Behavioral / persona modeling",
      "Predictive analytics engines",
      "CRM integration & migration",
      "Marketing automation & triggers",
      "Conversion funnel architecture",
      "Multi-channel campaign deployment",
      "Paid media & ad operations",
      "Content & creative production",
      "A/B testing & optimization",
      "Strategic positioning & roadmap",
    ],
  },

  // PART 3 — Agency or product? This quarter, the agency leads; the Hub is the tool.
  decision: {
    lead: "agency",
    note: "Marketing Hub is the weapon BAZ uses to deliver. It is NOT the product we sell this quarter. Selling both at once is extensity.",
    productStatus: "internal tool — used on every client, not marketed",
  },

  // PART 5 — The brand, rebuilt around our one remarkable idea.
  brand: {
    name: "BAZ",
    oldTagline: "The growth partner for ambitious businesses.",
    tagline: "Intensity beats extensity. We market like it.",
    manifesto: "One audience. One channel. One offer. Go deep, not wide.",
    principle: "Intensity beats extensity — every time.",
  },

  // PART 8 — Prove it on ONE channel first.
  channel: {
    primary: "Founder-led email + LinkedIn (owned + earned)",
    kpi: "Replies & calls booked from the list — not impressions",
    expandOnlyAfter: "Primary channel compounds for 90 days",
  },
};

export type Positioning = typeof positioning;
