/**
 * Strategy frameworks — shared between UI and copy generators.
 * Embedded Kotler/Godin knowledge the marketer can apply directly.
 */

export const BRAND_ARCHETYPES = [
  { id: "hero", label: "Hero", desc: "Prove courage through action (Nike, Adidas)" },
  { id: "outlaw", label: "Outlaw", desc: "Disrupt, break the rules (Harley, Virgin)" },
  { id: "sage", label: "Sage", desc: "Truth through wisdom (Google, BBC)" },
  { id: "explorer", label: "Explorer", desc: "Authenticity through discovery (The North Face)" },
  { id: "creator", label: "Creator", desc: "Innovation through craft (Apple, Lego)" },
  { id: "ruler", label: "Ruler", desc: "Control through order (Mercedes, Rolex)" },
  { id: "caregiver", label: "Caregiver", desc: "Service through compassion (Johnson & Johnson)" },
  { id: "magician", label: "Magician", desc: "Transformation through vision (Disney, Dyson)" },
  { id: "lover", label: "Lover", desc: "Beauty through intimacy (Chanel, Häagen-Dazs)" },
  { id: "jester", label: "Jester", desc: "Joy through humor (M&Ms, Old Spice)" },
  { id: "everyman", label: "Everyman", desc: "Belonging through honesty (IKEA, Budweiser)" },
  { id: "innocent", label: "Innocent", desc: "Happiness through virtue (Dove, Coca-Cola)" },
];

export const PRICING_STRATEGIES = [
  {
    id: "penetration",
    label: "Penetration pricing",
    desc: "Start low, raise later. Win share fast.",
    when: "Network effects, scale matters.",
  },
  {
    id: "skimming",
    label: "Price skimming",
    desc: "Start high, lower over time.",
    when: "Innovative product, early adopters pay.",
  },
  {
    id: "freemium",
    label: "Freemium",
    desc: "Free core, paid premium tier.",
    when: "Large market, viral coefficient matters.",
  },
  {
    id: "decoy",
    label: "Decoy (asymmetric dominance)",
    desc: "Add a third option to push the second.",
    when: "Two-product line, decision paralysis.",
  },
  {
    id: "bundle",
    label: "Bundling",
    desc: "Group products for a single price.",
    when: "Cross-sell, perceived value > sum.",
  },
  {
    id: "anchor",
    label: "Anchoring",
    desc: "Show a high reference price first.",
    when: "Justifying a premium.",
  },
  {
    id: "value",
    label: "Value-based",
    desc: "Price as a % of value delivered.",
    when: "Measurable ROI, B2B especially.",
  },
  {
    id: "tiered",
    label: "Tiered / Good–Better–Best",
    desc: "Three options, middle wins.",
    when: "Diverse customer needs.",
  },
  {
    id: "dynamic",
    label: "Dynamic / surge",
    desc: "Price by demand.",
    when: "Travel, hospitality, utilities.",
  },
  {
    id: "loss_leader",
    label: "Loss leader",
    desc: "Lose money on one, profit on the rest.",
    when: "Footfall, attach rate matters.",
  },
];

export const IDEA_CATEGORIES = [
  { id: "remarkable", label: "Remarkable", desc: "Worth making a remark about (Godin)." },
  { id: "minimal", label: "Minimal", desc: "One idea, not ten." },
  { id: "memorable", label: "Memorable", desc: "Fits in a sentence." },
  { id: "endorsed", label: "Endorsed", desc: "A real person would put their name on it." },
  { id: "emotional", label: "Emotional", desc: "Taps a feeling, not a feature." },
  { id: "story", label: "Story", desc: "Has character, conflict, resolution." },
  { id: "contrarian", label: "Contrarian", desc: "Goes against the consensus — and is true." },
];

export const IDEA_STATUSES = [
  { id: "seed", label: "Seed", color: "bg-slate-100 text-slate-700" },
  { id: "sprouting", label: "Sprouting", color: "bg-amber-100 text-amber-700" },
  { id: "shipped", label: "Shipped", color: "bg-emerald-100 text-emerald-700" },
  { id: "learned", label: "Learned", color: "bg-violet-100 text-violet-700" },
];

export const AWARENESS_LEVELS = [
  {
    id: "most_aware",
    label: "Most aware",
    desc: "Already wants what you sell. Give the offer + deadline.",
  },
  {
    id: "product_aware",
    label: "Product aware",
    desc: "Knows you exist. Mechanism, proof, comparison.",
  },
  {
    id: "solution_aware",
    label: "Solution aware",
    desc: "Knows the problem. Identify it, then name the category.",
  },
  {
    id: "problem_aware",
    label: "Problem aware",
    desc: "Feels the pain. Name, agitate, then promise.",
  },
  { id: "unaware", label: "Completely unaware", desc: "Tell a status-quo story first." },
];

export const EFFORT_IMPACT = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
];

// The one-line positioning template (Kotler / Ries "Positioning: The Battle for Your Mind")
export const POSITIONING_TEMPLATE =
  "For [TARGET] who [NEED/OPPORTUNITY], [BRAND] is the [CATEGORY/FR-OF-REFERENCE] that [PROMISE/POINTS-OF-DIFFERENCE] because [REASONS-TO-BELIEVE].";

// A quote block per major thinker — appears at the top of each workbench
export const TEACHER_QUOTES = {
  kotler: {
    who: "Philip Kotler",
    quote:
      "Marketing is the science and art of exploring, creating, and delivering value to satisfy the needs of a target market at a profit.",
  },
  godin: {
    who: "Seth Godin",
    quote:
      "Marketing is the generous act of helping someone solve a problem. Their problem. Not yours.",
  },
  porter: { who: "Michael Porter", quote: "The essence of strategy is choosing what not to do." },
  schwartz: {
    who: "Eugene Schwartz",
    quote:
      "The mass mind is not a single mind. It changes levels of awareness according to the product.",
  },
  christensen: {
    who: "Clayton Christensen",
    quote: "Customers don't buy products; they hire them to do jobs.",
  },
  holiday: {
    who: "Ryan Holiday",
    quote: "If you can't find a way to get attention for your ideas, they don't matter.",
  },
};
