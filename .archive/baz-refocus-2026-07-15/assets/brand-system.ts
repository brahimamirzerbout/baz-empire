// BAZ — The Ogilvy Layer.
// Godin picks the ONE (see assets/positioning.ts). Ogilvy crafts it to
// world-class and wraps it in a 360° experience — but ONLY for that one tribe.
//
// This file is the brand craft spec. It imports the Godin-scoped decisions and
// adds: the Big Idea, the voice, the message hierarchy, and the 360° touchpoint
// map (scoped, not planetary).

import { positioning } from "./positioning";

// --- The Big Idea (Ogilvy: one thought the whole brand hangs on) ---
export const bigIdea =
  "Intensity beats extensity — your whole marketing system, built and live in 45 days, senior-only, or you don't pay.";

// --- Positioning sentence (Ogilvy: say it in one breath) ---
export const positioningLine =
  "BAZ is the only agency that builds your entire marketing system in 45 days with a senior-only team — or you don't pay.";

// --- Voice & craft rules (Ogilvy: the consumer isn't a moron) ---
export const voice = {
  tone: ["plain", "confident", "specific", "a little contrarian"],
  // Don't sell the steak, sell the sizzle — but never lie.
  rules: [
    "Lead with the outcome, not the feature. ('Live in 45 days' before 'we do CRM').",
    "One idea per asset. If it has two, it has none.",
    "Talk to a founder like a founder — no 'synergy', no 'robust solutions'.",
    "Every number is real and defensible (45 days, $9,500, 10% of lift).",
    "The enemy is vivid: junior-staffed agencies that send decks instead of results.",
  ],
  banned: ["full-service", "results-driven", "passionate about", "world-class (unless earned)", "circle back"],
};

// --- Message hierarchy (Ogilvy: what they hear first → last) ---
export const messageHierarchy = [
  { level: 1, msg: "Your marketing system, live in 45 days — or you don't pay." },
  { level: 2, msg: "One senior team. No juniors, no learning curves." },
  { level: 3, msg: "One channel, mastered — then we expand." },
  { level: 4, msg: "Built on 'Intensity beats extensity.'" },
];

// --- 360° touchpoint map (Ogilvy), SCOPED to Godin's one tribe + one channel ---
// Not planetary. Only the touchpoints technical founders actually hit.
export const touchpoints360 = [
  {
    stage: "Awareness",
    where: "Founder's LinkedIn feed + the weekly email essay",
    ogilvyCraft: "One remarkable essay/week, signed by a real human, no logo spam.",
  },
  {
    stage: "Consideration",
    where: "Landing page (index.html) + manifesto",
    ogilvyCraft: "Story before spec. The offer block is the hero, not a feature grid.",
  },
  {
    stage: "Proof",
    where: "Case line + the 45-day guarantee",
    ogilvyCraft: "One bold promise, stated plainly, that a big agency would never risk.",
  },
  {
    stage: "Conversion",
    where: "The 'Get the 45-day plan' CTA + reply-to-essay",
    ogilvyCraft: "One button. One next step. No menu of 14 services.",
  },
  {
    stage: "Onboarding",
    where: "First 48 hours with the senior team",
    ogilvyCraft: "Founder meets founder. No account-manager handoff to a junior.",
  },
  {
    stage: "Loyalty / tribe",
    where: "The email list + client-success lead (roles/client-success.md)",
    ogilvyCraft: "Renewal owned by a human, not a drip. The tribe stays a tribe.",
  },
];

// --- What we REJECT from Ogilvy (per bazventures-org-chart.md) ---
export const rejectedFromOgilvy = [
  "Regional matrix — irrelevant below global-enterprise scale.",
  "Junior layers / account pyramids — keep it flat and senior-only.",
  "'Be everywhere' 360° — our 360° is one tribe, not the planet.",
];

export const ogilvyLayer = {
  bigIdea,
  positioningLine,
  voice,
  messageHierarchy,
  touchpoints360,
  rejectedFromOgilvy,
  // Anchored to Godin's scope:
  scopedTo: {
    audience: positioning.audience.name,
    offer: positioning.heroOffer.name,
    channel: positioning.channel.primary,
  },
};

export type OgilvyLayer = typeof ogilvyLayer;
