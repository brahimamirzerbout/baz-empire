/**
 * Ad-creative engine — generates platform-spec variants from a brief + brand kit,
 * scores each, and gates shipping behind the predictive score.
 *
 * The generator is deterministic: it produces copy *scaffolds* (headline, subhead,
 * body, CTA, visual direction) per platform, truncated to the platform's character
 * limits. It does not render images — the surgical value is the brief-to-spec
 * pipeline + the transparent score, not the pixel push.
 *
 * Lens sequence: Ogilvy (big idea + headline) → Schwartz (awareness → entry) →
 * Kennedy (the offer) → Hopkins (the reason-why / proof) → Wiebe (CTA-matches-intent).
 */

import type { AdCreativeInput, AdCreativeOutput, AdVariant, Platform } from "./types.js";
import { PLATFORM_SPECS, fitToLimit } from "./platform-specs.js";
import { scoreVariant, bandFor, statusFor } from "./predictive-score.js";

/** Entry headline strategy by awareness (Schwartz). */
function headlineStrategy(brief: string, awareness: string, offer: string): string {
  switch (awareness) {
    case "unaware":
      return `What ${brief} costs you (and why nobody's named it yet)`;
    case "problem-aware":
      return `The ${brief} leak you can't see — and what it's costing`;
    case "solution-aware":
      return `The one ${brief} fix that outperforms the rest`;
    case "product-aware":
      return `Why ${brief} teams switch to us (and stay)`;
    case "most-aware":
      return `${offer} — claim it before it's gone`;
    default:
      return brief;
  }
}

function ctaStrategy(awareness: string): string {
  switch (awareness) {
    case "unaware": return "See the number";
    case "problem-aware": return "Get the teardown";
    case "solution-aware": return "See how it works";
    case "product-aware": return "Book a demo";
    case "most-aware": return "Start now";
    default: return "Learn more";
  }
}

function visualDirection(platform: Platform, awareness: string): string {
  const ratio = PLATFORM_SPECS[platform].ratio;
  if (ratio === "9:16") return `Vertical 9:16 — UGC-style or screen-recording. Hook in the first 2 seconds. Brand color ${awareness === "most-aware" ? "as the CTA button" : "as the accent on the lower-third"}.`;
  if (ratio === "1:1") return `Square 1:1 — product-in-context or split-screen before/after. Headline top, CTA bottom. Brand color as the CTA background.`;
  return `Wide ${ratio} — hero image with headline overlay. Brand color as the accent border or the CTA. Keep the visual under 40% text (platform compliance).`;
}

/** Generate one variant per platform. */
export function buildAdCreative(input: AdCreativeInput): AdCreativeOutput {
  const variants: AdVariant[] = input.platforms.map((platform) => {
    const spec = PLATFORM_SPECS[platform];
    const bigIdea = input.brief;
    const headline = fitToLimit(headlineStrategy(input.brief, input.awareness, input.offer), spec.headlineMax);
    const subhead = fitToLimit(input.offer, spec.bodyMax > 80 ? 80 : spec.bodyMax);
    const body = fitToLimit(
      `${input.offer}. ${input.proof ?? "Results-backed."} ${input.brand.voice}.`,
      spec.bodyMax,
    );
    const cta = fitToLimit(ctaStrategy(input.awareness), spec.ctaMax);
    const visual = visualDirection(platform, input.awareness);

    const partial = { headline, cta, appliedColors: input.brand.colors };
    const { score, breakdown } = scoreVariant(partial, input);

    return {
      platform,
      bigIdea,
      headline,
      subhead,
      body,
      cta,
      visualDirection: visual,
      appliedColors: input.brand.colors,
      predictiveScore: score,
      band: bandFor(score),
      status: statusFor(score),
      scoreBreakdown: breakdown,
    };
  });

  const avgScore = variants.length > 0 ? Math.round(variants.reduce((s, v) => s + v.predictiveScore, 0) / variants.length) : 0;
  const shipCount = variants.filter((v) => v.status === "ship").length;
  const holdCount = variants.filter((v) => v.status === "hold").length;
  const killCount = variants.filter((v) => v.status === "kill").length;

  const markdown = render(input, variants, avgScore, shipCount, holdCount, killCount);

  return {
    brief: input.brief,
    offer: input.offer,
    awareness: input.awareness,
    brandName: input.brand.name,
    variants,
    avgScore,
    shipCount,
    holdCount,
    killCount,
    markdown,
  };
}

function render(input: AdCreativeInput, variants: AdVariant[], avg: number, ship: number, hold: number, kill: number): string {
  const blocks = variants.map((v) => {
    const spec = PLATFORM_SPECS[v.platform];
    const factors = v.scoreBreakdown.map((f) => `  - ${f.factor}: ${f.points}/${f.max} — ${f.note}`).join("\n");
    const glyph = v.status === "ship" ? "✅" : v.status === "hold" ? "🟡" : "❌";
    return `### ${glyph} ${spec.label} — ${v.predictiveScore}/100 (${v.status.toUpperCase()})

**Spec:** ${spec.width}×${spec.height} (${spec.ratio}) | headline ≤${spec.headlineMax} | body ≤${spec.bodyMax}

**Big idea:** ${v.bigIdea}

**Headline:** ${v.headline}
**Subhead:** ${v.subhead}
**Body:** ${v.body}
**CTA:** ${v.cta}
**Visual:** ${v.visualDirection}
**Brand colors:** primary ${v.appliedColors.primary} · accent ${v.appliedColors.accent}

**Score breakdown:**
${factors}
`;
  }).join("\n");

  return `# Ad Creative — ${input.brand.name}

**Brief:** ${input.brief}
**Offer:** ${input.offer}
**Awareness:** ${input.awareness}
**Proof:** ${input.proof ?? "(none supplied)"}
**Platforms:** ${input.platforms.length}

## Summary

| Metric | Value |
|---|---|
| Average predictive score | **${avg}/100** |
| ✅ Ship | ${ship} |
| 🟡 Hold (refine) | ${hold} |
| ❌ Kill | ${kill} |

## Variants

${blocks}

## Doctrine held
- Ogilvy: the headline does 80% of the work. If it doesn't stop the scroll, the rest doesn't matter.
- Hopkins: every claim needs a reason-why. No proof = no credibility = no click.
- Wiebe: the CTA must match the awareness stage. A problem-aware buyer gets "get the teardown," not "buy now."
- Persado ceiling (96% correlation): this score is a transparent heuristic, not a trained model. It tells you *why* — refine the weakest factor, re-score.

> This engine generates the *brief-to-spec pipeline*. The image still needs a human or a
> dedicated image model — but the copy, the spec, and the score are the moat.
`;
}