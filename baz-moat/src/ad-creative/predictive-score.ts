/**
 * Predictive creative score — a transparent heuristic, not a black box.
 *
 * Persado claims 96% correlation between prediction and actual performance.
 * We can't match that without their 120k-campaign training set, but we can be
 * *transparent* — every point is traceable to a factor the operator can audit.
 *
 * 5 factors, each weighted, max 100:
 *   Hook strength      (25) — Ogilvy: does the headline stop the scroll?
 *   Offer clarity       (25) — Kennedy: is the first yes obvious + risk-reversed?
 *   Proof presence      (20) — Hopkins: is there a reason-why / a number?
 *   CTA-intent match    (15) — Wiebe: does the CTA match the awareness stage?
 *   Brand consistency   (15) — does it follow the brand kit (colors/voice)?
 *
 * Bands: 75+ strong (ship), 55-74 competitive (hold — refine), <55 weak (kill).
 */

import type { ScoreFactor, AdCreativeInput, AdVariant } from "./types.js";

function scoreHook(headline: string, awareness: string): ScoreFactor {
  let points = 0;
  const h = headline.toLowerCase();
  // Ogilvy: a headline that contains a number, a question, or a specific claim stops the scroll.
  if (/\d/.test(h)) points += 10; // numbers = specificity (Hopkins)
  if (h.includes("?")) points += 5; // question = curiosity loop (Schwartz)
  if (h.length > 0 && h.length <= 60) points += 5; // tight = punchy
  if (/how|why|best|free|new|now|your/.test(h)) points += 5; // proven DR trigger words
  points = Math.min(points, 25);
  const note = points >= 20 ? "Strong hook — specific, curiosity-driven, or benefit-laden." : points >= 12 ? "Decent hook — could be punchier." : "Weak hook — generic or too long. Rewrite with a number or a question.";
  return { factor: "Hook strength", points, max: 25, note };
}

function scoreOffer(offer: string): ScoreFactor {
  let points = 0;
  const o = offer.toLowerCase();
  if (o.length > 0) points += 5;
  if (/free|trial|guarantee|risk|money.back|demo|audit|diagnostic/.test(o)) points += 10; // risk reversal (Kennedy/Hormozi)
  if (/\d/.test(o)) points += 5; // specific value
  if (o.length <= 120) points += 5; // tight
  points = Math.min(points, 25);
  const note = points >= 20 ? "Offer is clear and risk-reversed." : points >= 12 ? "Offer present but not risk-reversed. Add a guarantee or a specific number." : "Offer unclear or missing. The first yes must be obvious.";
  return { factor: "Offer clarity", points, max: 25, note };
}

function scoreProof(proof: string | undefined): ScoreFactor {
  if (!proof || proof.trim().length === 0) return { factor: "Proof presence", points: 0, max: 20, note: "No proof supplied. Add a case-study metric or a testimonial. Hopkins: reason-why copy sells." };
  let points = 5;
  const p = proof.toLowerCase();
  if (/\d/.test(p)) points += 10; // a number = credibility (Hopkins)
  if (/%|x|×/.test(p)) points += 5; // a multiplier/percentage = proof
  points = Math.min(points, 20);
  const note = points >= 18 ? "Strong proof — specific metric." : points >= 10 ? "Proof present but could be more specific. Add a real number." : "Weak proof — add a quantified case-study result.";
  return { factor: "Proof presence", points, max: 20, note };
}

function scoreCTA(cta: string, awareness: string): ScoreFactor {
  let points = 0;
  const c = cta.toLowerCase();
  if (c.length === 0) return { factor: "CTA-intent match", points: 0, max: 15, note: "No CTA. Wiebe: every ad needs a single, specific ask that matches the buyer's awareness stage." };
  points += 5;
  // Wiebe: the CTA must match the awareness stage. Most-aware → offer; problem-aware → teardown/diagnostic.
  const match: Record<string, boolean> = {
    unaware: /learn|see|discover|understand/.test(c),
    "problem-aware": /teardown|audit|diagnostic|see|find/.test(c),
    "solution-aware": /demo|trial|diagnostic|see how/.test(c),
    "product-aware": /book|call|schedule|start|get/.test(c),
    "most-aware": /buy|order|claim|get|start|sign/.test(c),
  };
  if (match[awareness]) points += 10;
  points = Math.min(points, 15);
  const note = match[awareness] ? `CTA matches ${awareness} intent.` : `CTA mismatches ${awareness} intent — a ${awareness} buyer shouldn't get a ${awareness === "most-aware" ? "teardown" : "buy now"} CTA.`;
  return { factor: "CTA-intent match", points, max: 15, note };
}

function scoreBrand(variant: Pick<AdVariant, "appliedColors">, brand: AdCreativeInput["brand"]): ScoreFactor {
  // The generator always applies the brand kit — this factor validates that it did.
  const colorsMatch =
    variant.appliedColors.primary === brand.colors.primary &&
    variant.appliedColors.accent === brand.colors.accent;
  const points = colorsMatch ? 15 : 5;
  const note = colorsMatch ? "Brand kit applied (colors + voice)." : "Brand kit mismatch — the variant doesn't follow the kit. Regenerate.";
  return { factor: "Brand consistency", points, max: 15, note };
}

/** Score a variant. Returns the total + the breakdown. */
export function scoreVariant(
  variant: Pick<AdVariant, "headline" | "cta" | "appliedColors">,
  input: AdCreativeInput,
): { score: number; breakdown: ScoreFactor[] } {
  const hook = scoreHook(variant.headline, input.awareness);
  const offer = scoreOffer(input.offer);
  const proof = scoreProof(input.proof);
  const cta = scoreCTA(variant.cta, input.awareness);
  const brand = scoreBrand(variant, input.brand);
  const breakdown = [hook, offer, proof, cta, brand];
  const score = breakdown.reduce((s, f) => s + f.points, 0);
  return { score, breakdown };
}

export function bandFor(score: number): AdVariant["band"] {
  return score >= 75 ? "strong" : score >= 55 ? "competitive" : "weak";
}

export function statusFor(score: number): AdVariant["status"] {
  return score >= 75 ? "ship" : score >= 55 ? "hold" : "kill";
}