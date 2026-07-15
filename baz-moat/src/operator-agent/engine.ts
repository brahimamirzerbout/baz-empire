/**
 * BAZ Operator Agent — synthesis engine.
 *
 * The "how Brahim thinks" layer. Takes a client question + context and runs it through
 * the synthesis sequence, producing a structured operator response:
 *   Diagnosis → The Move → Offer & Messaging → Architecture → Next Action.
 *
 * Deterministic and always-works (no LLM dependency). An optional LLM backend can wrap
 * this for prose generation; the engine itself is the codified decision logic, which is
 * the real moat — the thinking process, not just the answers.
 */

import {
  SYNTHESIS_SEQUENCE,
  VOICE,
  PRICING,
  DOCTRINE,
  GUARDRAILS,
  type AwarenessStage,
  type MarketStage,
} from "./knowledge.js";

export interface ClientQuestion {
  /** The raw question, e.g. "our paid CAC is rising — what do we do?" */
  question: string;
  /** Buyer's Schwartz awareness stage. */
  awareness: AwarenessStage;
  /** Market sophistication stage (1-5). */
  marketStage: MarketStage;
  /** Primary channel. */
  channel: string;
  /** Markets served. */
  markets: string[];
  /** Optional: the metric in play, e.g. "CAC", "LTV", "ROAS", "pipeline". */
  metric?: string;
}

export interface LensFinding {
  lensId: string;
  marketer: string;
  question: string;
  /** The engine's answer for this lens, given the context. */
  finding: string;
}

export interface OperatorResponse {
  question: string;
  context: ClientQuestion;
  diagnosis: string;
  theMove: string;
  offerAndMessaging: string;
  architecture: string;
  nextAction: string;
  lensFindings: LensFinding[];
  guardrails: string[];
}

/**
 * Map an awareness stage to the message entry strategy (Schwartz).
 * Wrong awareness = wrong message = dead campaign.
 */
export function awarenessEntry(stage: AwarenessStage): string {
  switch (stage) {
    case "unaware":
      return "Open with a story or pattern-interrupt that pulls them into a new way of seeing the problem. No product, no solution yet.";
    case "problem-aware":
      return "Lead with the problem, articulated so precisely the reader feels understood. Only then introduce that a solution exists.";
    case "solution-aware":
      return "Lead with the unique mechanism — the how. They know solutions exist; show why yours is different.";
    case "product-aware":
      return "Lead with proof + differentiation. They know you; answer 'why this one, not the alternative.'";
    case "most-aware":
      return "Lead with the offer — price, bonus, deadline. No education needed; remove friction to action.";
  }
}

/**
 * Map market sophistication to claim strategy (Schwartz).
 */
export function sophisticationStrategy(stage: MarketStage): string {
  switch (stage) {
    case 1:
      return "State the benefit directly — no one has claimed it before. The headline can be the claim.";
    case 2:
      return "Enlarge the claim — bigger, faster, more specific than the competitors now piling in.";
    case 3:
      return "Introduce the mechanism — the market is saturated with claims; sell the how, not the what.";
    case 4:
      return "Enlarge and name the mechanism — competitors copied mechanisms; make yours proprietary, branded, specific.";
    case 5:
      return "Connect with identity — claims and mechanisms are dead. Speak to who the reader is and what tribe they belong to.";
  }
}

/** Recommend the BAZ tier that fits the buyer's stage (don't oversell). */
export function recommendTier(context: ClientQuestion): string {
  // Heuristic: most-aware + mature market (stage 4-5) + multi-channel need => Growth.
  // Single-channel, earlier => Core. Defined finish-line work => Project.
  const mature = context.marketStage >= 4;
  if (context.awareness === "most-aware" && mature) {
    return `Growth (${PRICING.growth.range}) — full integrated stack, flagship engagement.`;
  }
  if (mature) {
    return `Core (${PRICING.core.range}) — one channel + tracking baseline, then ascend to Growth.`;
  }
  return `Project (${PRICING.project.range}) — scoped finish line, then convert to Core.`;
}

/** Run a single lens against the context. */
function runLens(lensId: string, context: ClientQuestion): string {
  switch (lensId) {
    case "category":
      return `Category-of-one: "the operator who ships systems other agencies only storyboard." Filter the ICP by buying posture (wants the operator, not the agency), not by industry. Serve the smallest viable market so well they refer the next.`;
    case "market":
      return `Starving crowd = founders/CMOs already burned by a junior-pod agency. Don't sell to the unburned. The hunger is the market.`;
    case "awareness":
      return `Buyer is ${context.awareness}. Entry strategy: ${awarenessEntry(context.awareness)} Market is stage ${context.marketStage}, so: ${sophisticationStrategy(context.marketStage)}`;
    case "offer":
      return `Irresistible offer: start with the paid Revenue Attribution Diagnostic ($5k, 5 days, risk-reversed — "if we don't find a leak worth ≥10× the fee, you don't pay"). Value-stack the retainer; never discount, scope down instead.`;
    case "journey":
      return `Next logical yes: diagnostic → ${recommendTier(context)}. Each rung is a small, obvious yes. Don't ask for the retainer on the first call.`;
    case "words":
      return `Use the prospect's exact words (VoC from calls/reviews), not the agency's. CTA must match the awareness stage — a problem-aware buyer gets "request a teardown," not "book a strategy call." Use the BAZ lexicon (plan, ship, architect, diagnose, instrument); cut every banned buzzword from the anti-lexicon — never let them appear in client-facing copy.`;
    case "prove":
      return `One big idea + one number. The big idea: instrumented, forecast-able growth. The number: the leak in $/month from the diagnostic (replace composites with real data after 10 diagnostics). No number, no claim.`;
    case "persuade":
      return `Use the principle that already exists naturally: reciprocity (the diagnostic), authority via specificity (named leak in $), unity (the operator tribe). Never manufacture false scarcity or fake social proof.`;
    default:
      return `Lens ${lensId} not implemented.`;
  }
}

/** Run the full synthesis sequence against a client question. */
export function answer(client: ClientQuestion): OperatorResponse {
  const lensFindings: LensFinding[] = SYNTHESIS_SEQUENCE.map((lens) => ({
    lensId: lens.id,
    marketer: lens.marketer,
    question: lens.question,
    finding: runLens(lens.id, client),
  }));

  const metric = client.metric ?? "revenue";

  const diagnosis = `The real problem in ≤3 sentences: ${client.question} The symptom is ${client.metric ?? "a metric drift"}; the cause is almost always uninstrumented attribution in a stage-${client.marketStage} market — you're optimizing against platform-reported numbers, not true incrementality. Until the tracking is fixed, every channel decision is a guess.`;

  const theMove = `Highest-leverage play: instrument first, then grow. Run the Revenue Attribution Diagnostic to find the ${metric} leak, fix the top 2 gaps (usually ssGTM + CAPI for paid-heavy), then re-baseline. Ranked vs the obvious alternative (tweaking ad creative): the obvious move shifts spend around the leak; the leverage move closes the leak permanently.`;

  const offerAndMessaging = `${awarenessEntry(client.awareness)} Offer: the diagnostic, risk-reversed. Messaging anchor: "${VOICE.founderLine}" — category-of-one, not a feature list. Proof-before-promise (show the framework, then the offer).`;

  const architecture = `Channels: ${client.channel} (primary) + the BAZ Tracking Default deployed by default. Funnel: outbound → diagnostic → ${recommendTier(client)}. KPIs with thresholds: diagnostic→retainer conversion ≥40%; client retention ≥90% (8-figure benchmark); margin ≥50% on Core.`;

  const nextAction = `The one thing to ship in the next 72 hours: book the diagnostic kickoff. Lock the baseline (${metric}, monthly attributed revenue, markets ${client.markets.join("/")}), grant ad-account + GA4 + GTM access, run the audit. Everything else follows the leak number.`;

  return {
    question: client.question,
    context: client,
    diagnosis,
    theMove,
    offerAndMessaging,
    architecture,
    nextAction,
    lensFindings,
    guardrails: [...GUARDRAILS],
  };
}

/** Render an OperatorResponse as operator-grade markdown. */
export function render(res: OperatorResponse): string {
  const lensRows = res.lensFindings
    .map((l) => `| ${l.marketer} | ${l.question} | ${l.finding} |`)
    .join("\n");
  return `# Operator Agent — response

**Question:** ${res.question}
**Context:** awareness=${res.context.awareness} · market stage=${res.context.marketStage} · channel=${res.context.channel} · markets=${res.context.markets.join(", ")}

## 1. Diagnosis
${res.diagnosis}

## 2. The move
${res.theMove}

## 3. Offer & messaging
${res.offerAndMessaging}

## 4. Architecture
${res.architecture}

## 5. Next action (72h)
${res.nextAction}

## Lens-by-lens (synthesis sequence)
| Marketer | The question | Finding |
|---|---|---|
${lensRows}

## Doctrine held
${DOCTRINE.map((d) => `- ${d}`).join("\n")}

## Guardrails
${res.guardrails.map((g) => `- ${g}`).join("\n")}

> ${VOICE.oneLiner}
`;
}