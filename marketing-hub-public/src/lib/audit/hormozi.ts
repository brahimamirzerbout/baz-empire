/**
 * Alex Hormozi lens — the god of offers, pricing, and unit economics.
 *
 * His core ideas (from $100M Offers, $100M Leads, Gym Launch Secrets):
 *   - The Grand Slam Offer = dream outcome × perceived likelihood / time × effort × sacrifice.
 *   - Price is a function of value, not cost. Charge 10x what you think.
 *   -The Three Pricing Tiers: the middle one is the one you want them to buy.
 *   - Bonuses stack value. Each bonus solves a separate problem.
 *   - Guarantees remove risk. Unconditional > conditional. The longer, the more you sell.
 *   - Urgency: only if true. Scarcity + bonuses + price increases over time.
 *   - The Core Four: warm audience, hot offer, great copy, tight follow-up. Miss any one, lose.
 *   - Lead magnet > lead gen. Give away a $1000 course for free; sell $10k mastermind on the back.
 *   - Free + shipping + bonuses + guarantee = cash-flow positive lead magnet.
 *   - Volume solves pricing. Lower price × more buyers > higher price × fewer buyers.
 */
import { db, now } from "@/lib/db";

export interface OfferAudit {
  product: string;
  price_visible: boolean;
  has_three_tiers: boolean;
  has_value_stack: boolean;
  has_guarantee: boolean;
  has_bonuses: boolean;
  has_urgency: boolean;
  has_lead_magnet: boolean;
  dream_outcome_clear: boolean;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  hormozi_take: string;
  missing: string[];
  actions: string[]; // what to do this week
}

const TEMPLATE = (product: string): OfferAudit => ({
  product,
  price_visible: false,
  has_three_tiers: false,
  has_value_stack: false,
  has_guarantee: false,
  has_bonuses: false,
  has_urgency: false,
  has_lead_magnet: false,
  dream_outcome_clear: false,
  score: 0,
  grade: "F",
  hormozi_take: "",
  missing: [],
  actions: [],
});

export function hormoziAudit(opts: {
  product: string;
  has_pricing_page?: boolean;
  // Aliases accepted from API callers
  price_visible?: boolean;
  has_tiers?: boolean;
  has_three_tiers?: boolean;
  has_value_stack?: boolean;
  has_guarantee?: boolean;
  has_bonuses?: boolean;
  has_urgency?: boolean;
  has_lead_magnet?: boolean;
}): OfferAudit {
  const a = TEMPLATE(opts.product);
  a.price_visible = !!(opts.has_pricing_page ?? opts.price_visible);
  a.has_three_tiers = !!(opts.has_tiers ?? opts.has_three_tiers);
  a.has_value_stack = !!opts.has_value_stack;
  a.has_guarantee = !!opts.has_guarantee;
  a.has_bonuses = !!opts.has_bonuses;
  a.has_urgency = !!opts.has_urgency;
  a.has_lead_magnet = !!opts.has_lead_magnet;
  a.dream_outcome_clear = true; // assume — checked manually

  let score = 0;
  if (a.price_visible) score += 15;
  if (a.has_three_tiers) score += 20;
  if (a.has_value_stack) score += 10;
  if (a.has_guarantee) score += 20;
  if (a.has_bonuses) score += 10;
  if (a.has_urgency) score += 5;
  if (a.has_lead_magnet) score += 15;
  if (a.dream_outcome_clear) score += 5;
  a.score = score;
  a.grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F";

  if (!a.price_visible) {
    a.missing.push("No visible pricing");
    a.actions.push(
      "Build a /pricing page today. If you're embarrassed to show the price, your offer is wrong.",
    );
  }
  if (!a.has_three_tiers) {
    a.missing.push("No three-tier pricing");
    a.actions.push("Add Starter / Pro / Agency. The middle one is the one you want them to buy.");
  }
  if (!a.has_value_stack) {
    a.missing.push("No value stack");
    a.actions.push(
      "List every bonus with dollar value. $1000 course + $500 templates + $300 audit = $1800 stack.",
    );
  }
  if (!a.has_guarantee) {
    a.missing.push("No risk reversal");
    a.actions.push(
      "Add a 30-day money-back guarantee. Unconditional. The longer, the more you sell.",
    );
  }
  if (!a.has_bonuses) {
    a.missing.push("No bonuses");
    a.actions.push(
      "Stack 2-4 bonuses that each solve a separate problem. Bonuses convert 30-50% better than discounts.",
    );
  }
  if (!a.has_urgency) {
    a.missing.push("No real urgency");
    a.actions.push(
      "Add a real deadline — bonus expires, price goes up, cohort closes. False urgency kills trust.",
    );
  }
  if (!a.has_lead_magnet) {
    a.missing.push("No lead magnet");
    a.actions.push(
      "Build a $1000-value free thing. Sell $10k on the back. Lead magnet > lead gen.",
    );
  }

  a.hormozi_take = hormoziVerdict(a);
  return a;
}

function hormoziVerdict(a: OfferAudit): string {
  if (a.grade === "A")
    return "The offer is the new marketing. You're charging for value, not time. Now pour fuel on it.";
  if (a.grade === "B")
    return "Close. Add a guarantee and a value stack — both are overnight wins. Then raise the price 20%.";
  if (a.grade === "C")
    return "You have a product. You don't have an offer yet. The biggest unlock is the guarantee and the three tiers. Do those this week.";
  if (a.grade === "D")
    return "You are leaving money on the table every single day. The Grand Slam Offer formula is: dream outcome × perceived likelihood / (time × effort × sacrifice). Run the formula. Then add a guarantee.";
  return "I'd fire the offer. Not the people — the offer. Most businesses fail because the offer sucks, not because the marketing is bad. Rewrite the dream outcome. Add a guarantee. Stack bonuses. Charge more.";
}
