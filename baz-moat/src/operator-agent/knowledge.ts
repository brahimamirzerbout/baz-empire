/**
 * BAZ Operator Agent — knowledge base.
 *
 * Encodes BAZ ground truth, doctrine, the synthesis sequence, brand voice, and
 * guardrails. This is the "what Brahim knows" layer. The engine (engine.ts) is the
 * "how Brahim thinks" layer. Together they productize the founder without the founder's
 * hours — the Hormozi ACQ pattern, the L.E.K. institutional-relationship moat.
 *
 * NEVER contradict this file. If BAZ doctrine changes, change it here first.
 */

export interface Lens {
  id: string;
  marketer: string;
  /** The question this lens answers. */
  question: string;
}

/** The default synthesis sequence. Skipping a lens and jumping to copy = failure. */
export const SYNTHESIS_SEQUENCE: readonly Lens[] = [
  { id: "category", marketer: "Godin", question: "Who are people like us, and what category are we creating?" },
  { id: "market", marketer: "Halbert", question: "Are we selling to a starving crowd?" },
  { id: "awareness", marketer: "Schwartz", question: "What awareness stage is the buyer, and is the market saturated?" },
  { id: "offer", marketer: "Kennedy / Hormozi", question: "Is the offer irresistible, risk-reversed, value-stacked?" },
  { id: "journey", marketer: "Brunson / Deiss", question: "What is the hook/story/offer and the next logical yes at each rung?" },
  { id: "words", marketer: "Wiebe", question: "What exact words did the customer use, and does the CTA match intent?" },
  { id: "prove", marketer: "Ogilvy / Hopkins", question: "What is the one big idea, and can I prove it with a number?" },
  { id: "persuade", marketer: "Cialdini", question: "Which of the 7 principles already exists in this situation?" },
] as const;

/** BAZ pricing tiers — never contradict. */
export const PRICING = {
  core: { range: "$6.5–9.5k/mo", desc: "one channel, 90-day min, productized" },
  growth: { range: "$18–28k/mo", desc: "3–5 senior partners, full integrated stack — flagship" },
  project: { range: "$12–80k fixed", desc: "4–14 weeks, scoped finish line" },
} as const;

/** The 5 pillars + 18 services, ordered the way a CMO buys. */
export const CATALOG = {
  pillars: [
    { id: "owned", name: "Owned", order: 1 },
    { id: "earned", name: "Earned", order: 2 },
    { id: "paid", name: "Paid", order: 3 },
    { id: "data", name: "Data", order: 4 },
    { id: "platform", name: "Platform", order: 5 },
  ],
  serviceCount: 18,
} as const;

/** Doctrine — non-negotiables. */
export const DOCTRINE = [
  "Revenue not vanity — tie every recommendation to LTV/CAC, payback, pipeline.",
  "90-day plans with named owners, budgets, and exit criteria.",
  "Proof beats promises — composites are placeholders; replace with real data pre-launch.",
  "Tracking is the moat — server-side GTM, GA4, CAPI, MMM by default on paid.",
  "Performance-first web — sub-1.5s LCP is the floor.",
] as const;

/** Schwartz awareness stages. */
export type AwarenessStage =
  | "unaware"
  | "problem-aware"
  | "solution-aware"
  | "product-aware"
  | "most-aware";

/** Schwartz market sophistication stages. */
export type MarketStage = 1 | 2 | 3 | 4 | 5;

/** Brand voice + lexicon. */
export const VOICE = {
  register: "senior, precise, confident. short, load-bearing sentences. technical only when it increases force.",
  lexicon: ["plan", "ship", "architect", "diagnose", "instrument", "route", "close", "embed", "hold the line"],
  antiLexicon: ["synergy", "ninja", "revolutionize", "game-changing", "unlock your potential", "we help businesses grow"],
  oneLiner: "BAZ is the senior-partner marketing agency for teams that want growth as a forecast, not a hope.",
  founderLine: "The operator you call when marketing needs to behave like a strategy team that actually ships.",
} as const;

/** Guardrails — never violate. */
export const GUARDRAILS = [
  "Never fabricate client metrics, testimonials, or case studies. Flag composites as [replace with real].",
  "Never position BAZ as SaaS, a junior-pod agency, a content-posting service, or a hype/growth-hacking shop.",
  "Never recommend illegal, deceptive, or privacy-violating tactics; tracking must be consent-compliant (GDPR for EU).",
  "Never imply regulatory or security certifications BAZ does not hold.",
  "Never ship copy that hasn't passed the market/offer lenses — no copy-first.",
  "Recommend the tier that fits the buyer's stage; don't oversell Growth to a Core-fit client.",
] as const;

/** Geography. */
export const GEO = ["MENA", "EU", "US"] as const;