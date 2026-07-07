/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROI MARKETING — Brand Identity Bible
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Three letters. Three meanings. One promise.
 *
 *   R.O.I. = Return on Investment — the metric that matters
 *   Roi    = King in French — the client is royalty
 *   ROI    = The marketer — you ARE the return
 *
 * "You don't spend on marketing. You invest in ROI."
 *
 * Inspired by Asmodeus — the king of desire, the daemon of passion.
 * Marketing is desire. ROI is the throne. The client is the king.
 */

export interface BrandIdentity {
  name: string;
  tagline: string;
  altTaglines: string[];
  manifesto: string;
  origin: string;
  tripleMeaning: { letter: string; meaning: string; explanation: string }[];
  positioning: string;
  promise: string;
  audience: string;
  voice: string;
  values: { word: string; description: string }[];
  visualIdentity: {
    primary: string;
    secondary: string;
    accent: string;
    royal: string;
    dark: string;
    gold: string;
    typography: { heading: string; body: string; mono: string };
    logo: string;
    symbol: string;
  };
  pricingPhilosophy: string;
  guarantee: string;
  oneLiner: string;
  elevator: string;
  email: string;
  coldOpen: string;
}

export const ROI_BRAND: BrandIdentity = {
  name: "ROI Marketing",
  tagline: "You don't spend on marketing. You invest in ROI.",
  altTaglines: [
    "The marketing agency where the client is Roi — King.",
    "Three letters. Three meanings. One promise: Return.",
    "We don't sell marketing. We deliver ROI — in every sense.",
    "Where every dollar is a subject, and every result is a crown.",
    "The return on investment is the return on you.",
  ],
  manifesto: `Every agency talks about ROI.

We don't talk about it. We are it.

ROI is three things:

It is Return on Investment — the only number that justifies every dollar spent on marketing. Not impressions. Not clicks. Not engagement. Return. The cold, hard, bank-account truth of whether your marketing made you money.

It is Roi — the French word for King. Because that's what you are. You are not a "client" or a "lead" or a "customer." You are the king. And the king does not beg for attention. The king is served. The king is honored. The king receives tribute — in the form of measurable, bankable return.

And ROI is us — the return itself. We are not a cost center. We are not a line item. We are the investment that returns more than it costs. When you hire ROI Marketing, you are not spending money. You are planting seeds that grow into a harvest. We are the harvest.

This is not marketing as usual. This is marketing as fealty.

We serve the king. We deliver the return. We are ROI.

Asmodeus taught us: desire is the engine of all commerce. People don't buy products — they buy the fulfillment of desire. Our job is to channel that desire toward your throne. Every campaign, every word, every pixel serves one purpose: to make your subjects (your customers) bring tribute (their money) to your kingdom (your business).

You are Roi. We are ROI. The return is the crown.

Welcome to the kingdom.`,
  origin: `The name came in a flash — a triple revelation.

ROI. Three letters that every marketer, every founder, every CFO knows. Return on Investment. The metric that separates marketing that works from marketing that wastes money.

But ROI is also Roi — the French word for King. Le Roi. The monarch. The sovereign. The one who is served, not the one who serves.

And then the third layer: ROI is not just a metric we deliver. ROI is us. The marketer IS the return. We are the investment that produces the return. Without us, there is no ROI. We are not a cost — we are the multiplier.

Three letters. Three meanings. One promise.

The inspiration: Asmodeus — the daemon king of desire. In the Ars Goetia, Asmodeus is the entity who understands desire better than any other. He knows that desire is not created — it is channeled. He knows that every transaction is an exchange of desire. And he knows that the one who channels desire holds the real power.

Marketing is desire. ROI is the throne. The client is the king.

We are the ones who channel desire to the throne.

That's ROI Marketing.`,
  tripleMeaning: [
    {
      letter: "R",
      meaning: "Return",
      explanation:
        "Return on Investment. The only metric that matters. Not vanity metrics — real, bankable, cash-in-the-account return. Every dollar you invest in ROI Marketing must return more than it cost. If it doesn't, we haven't done our job.",
    },
    {
      letter: "O",
      meaning: "On",
      explanation:
        "On Investment. Marketing is not an expense — it's an investment. Expenses are consumed. Investments compound. When you hire ROI Marketing, you're not spending money; you're deploying capital that generates return. The investment is the seed. The return is the harvest.",
    },
    {
      letter: "I",
      meaning: "Investment — and the King (Roi)",
      explanation:
        "Two meanings in one letter. I = Investment, the capital you deploy. But I also = Roi, the French word for King. Because you — the client, the founder, the business owner — are the king. And the king is served. Not pitched. Not sold. Served. With measurable, accountable, royal-grade return.",
    },
  ],
  positioning:
    "ROI Marketing is the only agency where the client is literally Roi — King — and the agency is literally ROI — the return on investment. We don't sell marketing services. We sell return. Measurable, bankable, accountable return. If we don't return more than we cost, we haven't earned our name.",
  promise:
    "Every dollar you invest in ROI Marketing will return more than one dollar. If it doesn't, we'll work for free until it does. That's not a guarantee — that's a fealty oath to the king.",
  audience:
    "Founders and business owners who are tired of agencies that talk about impressions and engagement when all they want is return. The king who demands accountability, not activity. The sovereign who wants results, not reports.",
  voice:
    "Royal but direct. Confident but not arrogant. We speak as the king's most trusted advisor — the one who tells the truth, even when it's uncomfortable. We don't use marketing jargon. We use the language of return: dollars, percentages, timelines. The king doesn't want to hear about 'brand lift.' The king wants to hear about cash.",
  values: [
    {
      word: "Return",
      description:
        "Every action must produce measurable return. No activity without ROI. No campaign without accountability.",
    },
    {
      word: "Fealty",
      description:
        "We serve the king. The client's success is our success. Their throne is our purpose. Their return is our reputation.",
    },
    {
      word: "Desire",
      description:
        "Marketing is the channeling of desire. We don't create want — we direct it. Toward the king's throne.",
    },
    {
      word: "Truth",
      description:
        "The Patrick Number doesn't lie. Cash doesn't lie. We speak in numbers, not narratives. The king deserves truth, not flattery.",
    },
    {
      word: "Sovereignty",
      description:
        "The king owns his kingdom. We don't hold data hostage, lock in contracts, or create dependency. The king is always free.",
    },
  ],
  visualIdentity: {
    primary: "var(--accent)", // Royal violet
    secondary: "var(--accent-secondary)", // Deep royal blue
    accent: "var(--accent)", // Desire pink
    royal: "var(--accent)", // Royal gold
    dark: "#0a0a14", // Sovereign black
    gold: "var(--accent)", // Crown gold
    typography: {
      heading: "Inter, Cantarell, sans-serif",
      body: "Inter, Cantarell, sans-serif",
      mono: "Hack, JetBrains Mono, monospace",
    },
    logo: "ROI", // Three letters, crown above
    symbol: "♔", // White chess king symbol
  },
  pricingPhilosophy:
    "We price by return, not by hours. The king doesn't pay for our time — the king pays for results. Options: (1) Performance: we take a percentage of the return we generate. (2) Retainer: fixed monthly fee with a minimum return guarantee. (3) Hybrid: lower retainer + higher performance share. The king chooses. The king always chooses.",
  guarantee:
    "The Fealty Oath: If we don't return more than we cost in the first 90 days, we work for free until we do. No exceptions. No excuses. The king's return is our obligation.",
  oneLiner:
    "ROI Marketing — where the client is Roi (King) and the agency is ROI (the return). You don't spend on marketing. You invest in ROI.",
  elevator:
    "You know how every agency talks about ROI but none of them actually guarantee it? We're ROI Marketing. Three meanings: Return on Investment — the metric. Roi — French for King — that's you, the client. And ROI — that's us, the return itself. We don't sell marketing services. We sell return. Measurable, bankable return. If we don't return more than we cost, we work for free until we do. That's not a guarantee — that's a fealty oath to the king.",
  email: `Subject: You don't spend on marketing. You invest in ROI.

{First Name},

Every agency talks about ROI.

We don't talk about it. We are it.

ROI Marketing. Three letters. Three meanings:

1. Return on Investment — the only number that justifies your marketing spend
2. Roi — French for King — because that's what you are to us
3. ROI — us. We are the return. The investment that produces more than it costs.

We don't sell impressions, clicks, or engagement.
We sell return. Measurable. Bankable. Accountable.

The Fealty Oath: If we don't return more than we cost in 90 days, we work for free until we do.

You are Roi. We are ROI. The return is the crown.

Worth a 15-minute conversation?

— ROI Marketing
Where the client is King and the agency is Return`,
  coldOpen: `You are Roi. The French word for King.

And every king needs a trusted advisor who delivers one thing: return.

Not impressions. Not clicks. Not engagement.

Return. Cold, hard, bankable return on investment.

That's what ROI Marketing delivers. We are the return.

Three letters. Three meanings. One promise.

If we don't return more than we cost in 90 days, we work for free.

That's not a guarantee. That's fealty to the king.`,
};

// ─── Brand assets for the Hub ──────────────────────────────────────────────
export const ROI_LOGO_SVG = `
<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
  <text x="100" y="35" text-anchor="middle" font-family="Inter, sans-serif" font-size="32" font-weight="900" fill="var(--accent)">ROI</text>
  <text x="100" y="52" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="var(--accent)" letter-spacing="3">MARKETING</text>
  <text x="100" y="68" text-anchor="middle" font-family="Inter, sans-serif" font-size="7" fill="#94a3b8" letter-spacing="1">You don't spend. You invest.</text>
</svg>
`;

export const ROI_CROWN_SVG = `
<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 32 L12 18 L18 26 L24 14 L30 26 L36 18 L40 32 Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="1"/>
  <rect x="8" y="32" width="32" height="4" fill="var(--accent)" rx="1"/>
  <circle cx="24" cy="14" r="2" fill="var(--accent)"/>
  <circle cx="12" cy="18" r="1.5" fill="var(--accent)"/>
  <circle cx="36" cy="18" r="1.5" fill="var(--accent)"/>
</svg>
`;
