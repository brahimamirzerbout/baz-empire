/**
 * Intent marketing engine — deterministic intent scoring + capture routing.
 *
 * Surgical, not vibecoded. Deterministic + always-works (no LLM dependency).
 * Lineage: Halbert (starving crowd) + Schwartz (awareness → intent stage) +
 * Kennedy (offer + response device) + Hopkins (intent is measurable) + Hormozi
 * (intent economics) + Deiss (Convert acceleration).
 */

import type {
  IntentInput, IntentOutput, IntentStage, IntentChannel, CaptureMove, IntentSignal,
} from "./types.js";

/* ----------------- canonical intent-signal set (weights sum 1.0) ---------- */
export const INTENT_SIGNALS: IntentSignal[] = [
  { id: "demo-request", group: "funnel", label: "Demo / sales request", weight: 0.20, why: "An explicit ask to talk — the strongest single in-market signal.", provenance: "[grounded-in: B2B funnel stage definitions]" },
  { id: "pricing-page", group: "site", label: "Pricing-page visit", weight: 0.18, why: "Reading price = comparing / ready; a bottom-funnel site behavior.", provenance: "[grounded-in: bottom-funnel web behavior]" },
  { id: "brand-search", group: "search", label: "Brand-name search", weight: 0.15, why: "Searching YOUR brand = they've decided you're a candidate; very high intent.", provenance: "[grounded-in: branded search intent]" },
  { id: "pql", group: "funnel", label: "Product-qualified lead (PQL)", weight: 0.13, why: "Used the product / hit an activation signal — behavior, not a form fill.", provenance: "[grounded-in: PQL definitions]" },
  { id: "search-commercial", group: "search", label: "Commercial/transactional keyword", weight: 0.12, why: "Query with buy/intent modifiers ('best', 'pricing', 'vs', 'alternative').", provenance: "[grounded-in: search intent classification]" },
  { id: "third-party-intent", group: "third-party", label: "Third-party intent surge (G2/Bombora)", weight: 0.10, why: "Account-level research surge across the web — B2B in-market signal.", provenance: "[grounded-in: G2/Bombora intent data models]" },
  { id: "comparison-page", group: "site", label: "Comparison / 'best X' page visit", weight: 0.07, why: "Comparing options = product-aware, mid-to-bottom funnel.", provenance: "[grounded-in: comparison content intent]" },
  { id: "repeat-visit", group: "site", label: "Repeat site visit (≥3)", weight: 0.03, why: "Returning = sustained interest; weak alone, supportive in a mix.", provenance: "[grounded-in: site recency/frequency]" },
  { id: "bottom-funnel-email", group: "email", label: "Bottom-funnel email engagement", weight: 0.02, why: "Opened/clicked a pricing/demo/case-study send — opted-in in-market.", provenance: "[grounded-in: email engagement scoring]" },
];
const SIGNAL_BY_ID: Record<string, IntentSignal> = Object.fromEntries(INTENT_SIGNALS.map((s) => [s.id, s]));

/* ----------------------------- scoring ----------------------------------- */
/**
 * In-market evidence score = sum of HIT-signal weights × 100 (absolute, 0–100).
 * Reflects how much in-market proof we've observed, NOT a normalized hit-rate —
 * a single weak signal must not read as 80%. Unknowns are ignored. [composite]
 * if no signals supplied.
 */
function realScore(signals: Record<string, "hit" | "miss" | "unknown">): number {
  let weighted = 0;
  for (const [id, state] of Object.entries(signals)) {
    const sig = SIGNAL_BY_ID[id];
    if (!sig) continue;
    if (state === "hit") weighted += sig.weight;
  }
  return Math.round(weighted * 100);
}

/** Stage from score + signal mix (Schwartz: product-aware → most-aware). */
function stageFromScore(score: number, signals?: Record<string, "hit" | "miss" | "unknown">): IntentStage {
  const has = (id: string) => signals?.[id] === "hit";
  if (has("demo-request") || (has("pricing-page") && has("brand-search")) || score >= 70) return "ready-to-buy";
  if (has("pricing-page") || has("comparison-page") || has("repeat-visit") || (score >= 40 && score < 70)) return "comparing";
  return "researching";
}

/* --------------------------- capture routing ----------------------------- */
const CAPTURE_MOVES: CaptureMove[] = [
  { channel: "search-sem", appliesToStage: "researching", move: "Capture the commercial/branded query with a landing page matched to the EXACT query intent. Halbert: sell them what they're asking for — the page headline = their query, the offer = their next yes." },
  { channel: "seo", appliesToStage: "researching", move: "Own the 'best X' / 'X vs Y' / 'X alternative' queries with bottom-funnel comparison content. Intent buyers research before they buy — be the comparison they read." },
  { channel: "retargeting", appliesToStage: "comparing", move: "Retarget pricing/comparison-page visitors with the offer + proof (case study + price). They showed intent; close the gap with the irresistible offer (Kennedy)." },
  { channel: "email", appliesToStage: "comparing", move: "Bottom-funnel sequence to engagers: case study → pricing → demo (3 touches, each one next yes). Schwartz: they're product-aware — give mechanism + proof + offer, not education." },
  { channel: "sales", appliesToStage: "ready-to-buy", move: "SQL handoff at the threshold (demo-request OR pricing-repeat + PQL). Pass the intent context so the rep opens with the buyer's exact signal, not a discovery pitch." },
  { channel: "third-party-intent", appliesToStage: "comparing", move: "Outbound to in-market accounts (G2/Bombora surge) with the offer matched to what they're researching. B2B: the account is already buying category — be first in." },
];

function capturePlan(stage: IntentStage, channels?: IntentChannel[]): CaptureMove[] {
  const wanted = channels && channels.length > 0 ? channels : (CAPTURE_MOVES.map((m) => m.channel));
  // Always include the stage-matching move first, then the adjacent-stage moves.
  const order: IntentStage[] = [stage, stage === "researching" ? "comparing" : stage === "ready-to-buy" ? "comparing" : "researching", stage === "comparing" ? "ready-to-buy" : "comparing"];
  const seen = new Set<string>();
  const out: CaptureMove[] = [];
  for (const st of order) {
    for (const m of CAPTURE_MOVES) {
      if (m.appliesToStage !== st) continue;
      if (!wanted.includes(m.channel)) continue;
      const key = m.channel;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ ...m, appliesToStage: st });
    }
  }
  return out;
}

/** Kennedy response device — the lowest-friction next yes for the stage. */
function nextYes(stage: IntentStage): string {
  if (stage === "ready-to-buy") return "Book a 15-min demo / start a free trial — one click, calendar in hand. (Remove every step between them and the close.)";
  if (stage === "comparing") return "See the pricing page / download the side-by-side comparison. (Give them the deciding artifact, not a form wall.)";
  return "Get the [lead magnet] — the exact checklist/comparison they're researching. (Trade value for the opt-in; education is the jab, the demo is the right hook.)";
}

/* ------------------------------- render ---------------------------------- */
function render(out: Omit<IntentOutput, "markdown">, input: IntentInput, hitSignals: string[]): string {
  const signalRows = INTENT_SIGNALS
    .map((s) => {
      const st = input.signals?.[s.id];
      const mark = st === "hit" ? "✅ hit" : st === "miss" ? "❌ miss" : st === "unknown" ? "❓ unknown" : "— not supplied";
      const row = hitSignals.includes(s.id) ? "◀" : " ";
      return `| ${row} | ${s.label} | ${s.weight.toFixed(2)} | ${mark} | ${s.why} |`;
    })
    .join("\n");
  const planRows = out.capturePlan
    .map((m) => `| ${m.channel} | ${m.appliesToStage} | ${m.move} |`)
    .join("\n");
  return `# Intent Marketing — Capture the Already-Hungry

**ICP (starving crowd):** ${input.icp ?? "—"}
**Awareness:** ${input.awareness ?? "—"}
**Offer:** ${input.offer ?? "—"}
**Intent score:** ${out.intentScore}/100 (in-market evidence) · **stage: ${out.intentStage}** · (${out.fitBasis})

## In-market signal scoring (weights sum to 1.0)

| ◀hit | Signal | Weight | State | Why |
|---|---|---|---|---|
${signalRows}

> Halbert: sell to the starving crowd. Intent buyers are already hungry — the job
> is to be there with the matched offer the moment they signal, not to educate them.

## Capture plan (routed to ${out.intentStage})

| Channel | Stage | Move |
|---|---|---|
${planRows}

## The next yes (Kennedy response device)
${out.nextYes}

## Economics — intent vs cold (Hormozi: the CAC math must hold)

| Check | Read |
|---|---|
| Intent lift | ${out.economics.intentLift} |
| CAC math | ${out.economics.cacMath} |
| Value equation | ${out.economics.valueEquationCheck} |

> Intent traffic is expensive and high-converting. The math holds only if
> intent_conversion × LTV ≥ intent_CAC. Pay intent prices for intent conversion —
> never for cold.

## Warnings
${out.warnings.map((w) => `- ${w}`).join("\n")}

## Lineage held
- **Halbert** — the starving crowd; intent buyers are the already-hungry.
- **Schwartz** — product/most-aware → mechanism + proof + offer copy, not education.
- **Kennedy** — the irresistible offer + a low-friction response device (the next yes).
- **Hopkins** — intent is the most measurable demand; test at the keyword/signal level.
- **Hormozi** — intent economics: Nx conversion must justify the higher CAC.
- **Deiss** — bottom of the customer value journey: the Convert acceleration.

> ${out.fitBasis === "structural" ? "[composite] structural score — supply observed --signal id=hit|miss|unknown for a real score." : "Real score — from observed in-market signals."} The signal set is the architecture; your conversion data is the proof.
`;
}

/* ------------------------------- entry ----------------------------------- */
export function buildIntent(input: IntentInput): IntentOutput {
  const hasIntel = !!input.signals && Object.keys(input.signals).length > 0;
  const fitBasis: "real" | "structural" = hasIntel ? "real" : "structural";

  let score: number;
  let stage: IntentStage;
  let hitSignals: string[] = [];
  if (hasIntel) {
    score = realScore(input.signals!);
    stage = stageFromScore(score, input.signals);
    hitSignals = Object.entries(input.signals!).filter(([, v]) => v === "hit").map(([k]) => k);
  } else {
    // [composite] structural default — a comparing-stage B2B buyer with no signal data.
    score = 45;
    stage = "comparing";
  }

  const plan = capturePlan(stage, input.channels);

  const intentConv = input.intentConversionRate;
  const coldConv = input.coldConversionRate;
  const intentLift = intentConv !== undefined && coldConv !== undefined && coldConv > 0
    ? `${(intentConv / coldConv).toFixed(1)}× — intent converts ${(intentConv / coldConv).toFixed(1)}× cold`
    : "[composite] intent typically converts ~3–6× cold (replace with your real conversion rates).";
  const cacMath = input.intentCac !== undefined && input.ltv !== undefined
    ? input.ltv >= input.intentCac ? `LTV ${input.ltv} ≥ intent CAC ${input.intentCac} — the math holds.` : `LTV ${input.ltv} < intent CAC ${input.intentCac} — the math FAILS; raise LTV or lower CAC before scaling intent.`
    : "[composite] supply intent_cac + ltv to check LTV ≥ intent_CAC.";
  const valueEquationCheck = intentConv !== undefined && input.intentCac !== undefined && intentConv > 0
    ? `Expected value per intent visitor = ${intentConv} × LTV. If that < intent_CAC per visitor, the channel is a loss.`
    : "[composite] value equation = (dream_outcome × perceived_likelihood) / (time + effort + money). Intent raises perceived_likelihood — verify it raises the equation.";

  const warnings: string[] = [];
  if (fitBasis === "structural") warnings.push("[composite] no observed signals supplied — score is a structural placeholder. Pass --signal id=hit|miss|unknown for real scoring.");
  if (input.intentCac !== undefined && input.ltv !== undefined && input.ltv < input.intentCac) warnings.push("The intent CAC math FAILS — do not scale paid intent until LTV ≥ CAC.");
  if (stage === "ready-to-buy" && !(input.channels ?? []).includes("sales") && input.channels && input.channels.length > 0) warnings.push("Stage is ready-to-buy but sales channel is not enabled — intent buyers will cool off without a fast handoff.");

  const partial = {
    intentScore: score,
    intentStage: stage,
    fitBasis,
    capturePlan: plan,
    economics: { intentLift, cacMath, valueEquationCheck },
    nextYes: nextYes(stage),
    warnings,
  };
  const markdown = render(partial, input, hitSignals);
  return { ...partial, markdown };
}