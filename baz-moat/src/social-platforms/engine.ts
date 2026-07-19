/**
 * Social-platforms engine — takes one idea + audience, emits a native brief per
 * platform with an algorithm-fit assessment. Deterministic, no LLM.
 *
 * Lens sequence applied (BAZ synthesis):
 *   Halbert (starving crowd) → the ICP must already be hungry.
 *   Schwartz (awareness)     → the native hook register matches the buyer's stage.
 *   Gary Vaynerchuk          → platform-native: each platform its own dialect.
 *   Hopkins/Bird             → the algorithm IS the measurement system; score the
 *                              signals it rewards, and never fabricate the number.
 *   Hormozi                  → distribution economics + velocity per platform.
 *
 * Algorithm-fit is scored two ways:
 *   - "real"      — from observed signal state (--signal flags): weighted hit-rate.
 *   - "structural"— heuristic from awareness × graph when no signals supplied;
 *                   tagged [composite], nudges the operator to supply real data.
 */

import type {
  SocialInput,
  SocialOutput,
  PlatformOutput,
  PlatformModel,
  SocialPlatform,
  AwarenessStage,
} from "./types.js";
import { PLATFORM_BY_ID, PLATFORMS } from "./platforms.js";
import { latestLiveTrend, lifecycleNote, statusGlyph } from "./trends.js";

/** All 7 platforms, the full set. */
export const ALL_PLATFORMS: SocialPlatform[] = PLATFORMS.map((p) => p.id);

/**
 * Structural fit heuristic — awareness stage × platform graph. [composite]:
 * not real measurement; a defensible default until observed signals arrive.
 * Pattern-interrupt platforms (TikTok, IG Reels) win for unaware; search/depth
 * platforms (YouTube, LinkedIn, Pinterest) win for solution/product-aware.
 */
function structuralFit(platform: SocialPlatform, awareness: AwarenessStage): number {
  // awareness → graph preference (0-100 base per platform)
  const M: Record<AwarenessStage, Partial<Record<SocialPlatform, number>>> = {
    unaware: { tiktok: 80, instagram: 75, x: 60, facebook: 50, youtube: 45, linkedin: 35, pinterest: 40 },
    "problem-aware": { youtube: 75, linkedin: 70, instagram: 65, x: 60, pinterest: 50, tiktok: 50, facebook: 45 },
    "solution-aware": { youtube: 80, linkedin: 75, pinterest: 65, instagram: 60, x: 55, tiktok: 45, facebook: 40 },
    "product-aware": { linkedin: 80, youtube: 70, instagram: 65, x: 60, pinterest: 55, facebook: 45, tiktok: 40 },
    "most-aware": { linkedin: 85, x: 70, instagram: 60, youtube: 55, pinterest: 45, facebook: 40, tiktok: 35 },
  };
  return M[awareness][platform] ?? 50;
}

/** Weighted hit-rate from observed signals. "real" basis. */
function realFit(model: PlatformModel, observed: Record<string, "hit" | "miss" | "unknown">): number {
  let weighted = 0;
  let denom = 0;
  for (const sig of model.algorithm) {
    const s = observed[sig.id];
    if (s === "hit") { weighted += sig.weight; denom += sig.weight; }
    else if (s === "miss") { denom += sig.weight; }
    // unknown → excluded from both (don't penalize unverified)
  }
  if (denom === 0) return 0;
  return Math.round((weighted / denom) * 100);
}

/** Native hook register per platform, gated by awareness (Schwartz). */
function nativeHook(model: PlatformModel, awareness: AwarenessStage, icp: string, topic: string): string {
  const t = topic || "the idea";
  const crowd = icp || "your audience";
  const openers: Record<AwarenessStage, string> = {
    unaware: `Pattern-interrupt: the cost of the status quo ${crowd} hasn't named — about ${t}.`,
    "problem-aware": `Name the problem ${crowd} feels about ${t} so precisely they feel understood.`,
    "solution-aware": `The unique mechanism for ${t} — the how, for ${crowd}.`,
    "product-aware": `Proof + differentiation on ${t} for ${crowd} — why this one.`,
    "most-aware": `The offer on ${t} for ${crowd} — price, bonus, deadline. Remove friction.`,
  };
  // platform register tweak on top of the awareness opener
  switch (model.id) {
    case "tiktok": return `${openers[awareness]} Land it in the first second, sound-on, on-screen text.`;
    case "instagram": return `${openers[awareness]} 1st frame + 1st 2s; caption carries the SEO + CTA.`;
    case "youtube": return `${openers[awareness]} Title+thumbnail sell the click; first 30s earn the watch.`;
    case "linkedin": return `${openers[awareness]} 1st 2 lines = the 'see more' gate; end with a question.`;
    case "x": return `${openers[awareness]} 1st line is the whole pitch; payoff in tweet 1.`;
    case "facebook": return `${openers[awareness]} Native video, community angle, link in the 1st comment.`;
    case "pinterest": return `${openers[awareness]} Vertical pin, text overlay, keyword title — it's search.`;
  }
}

/** Platform-native CTA — matches the platform's rewarded action. */
function nativeCta(model: PlatformModel): string {
  switch (model.id) {
    case "tiktok": return "Comment a keyword for the template (comment-bait lifts the For You test).";
    case "instagram": return "Save this + DM me the keyword (saves + DM-shares are the reach signal).";
    case "youtube": return "Click the next video on the end screen (session time > subscribe).";
    case "linkedin": return "What's your take? (comment — comments drive 2nd/3rd-degree reach).";
    case "x": return "Reply with your number (replies are the distribution engine on X).";
    case "facebook": return "Comment your city / your take (meaningful interaction wins).";
    case "pinterest": return "Save to your board (saves = future intent + re-distribution).";
  }
}

/** Platform-native hashtag guidance. */
function nativeHashtags(model: PlatformModel): string {
  switch (model.id) {
    case "tiktok": return "3–5: one broad + the rest niche (categorizes the For You test).";
    case "instagram": return "5–10, niche-first (explore + Reels categorization).";
    case "youtube": return "3–5 SEO tags in the tag field (search indexing).";
    case "linkedin": return "3–5 professional; over-tagging looks desperate.";
    case "x": return "1–2 max; the thread is the structure, not the tags.";
    case "facebook": return "0–2; hashtags barely move on Facebook.";
    case "pinterest": return "Keyword-rich in title + description (it's search, not tags).";
  }
}

/** The top levers to pull on this platform (highest-signal variables). */
function topLevers(model: PlatformModel): { variable: string; action: string }[] {
  // Rank variables by the max weight of the signals they feed, take top 4.
  const ranked = [...model.variables]
    .map((v) => {
      const maxW = Math.max(...v.feeds.map((fid) => model.algorithm.find((s) => s.id === fid)?.weight ?? 0));
      return { v, maxW };
    })
    .sort((a, b) => b.maxW - a.maxW)
    .slice(0, 4);
  return ranked.map(({ v }) => ({ variable: v.label, action: v.guidance }));
}

/** Build one platform's output. */
function buildPlatformOutput(model: PlatformModel, input: SocialInput): PlatformOutput {
  const observed = input.signals?.[model.id];
  let algorithmFit: number;
  let fitBasis: "real" | "structural";
  if (observed && Object.keys(observed).length > 0) {
    algorithmFit = realFit(model, observed);
    fitBasis = "real";
  } else {
    algorithmFit = structuralFit(model.id, input.awareness);
    fitBasis = "structural";
  }
  const verdict: PlatformOutput["verdict"] =
    algorithmFit >= 70 ? "native-fit" : algorithmFit >= 40 ? "partial-fit" : "off-platform";

  const warnings: string[] = [model.reachKiller];
  if (fitBasis === "structural") {
    warnings.push("[composite] fit — no observed signals supplied. Pass --signal <platform>:<id>=hit|miss for real scoring.");
  }

  const live = latestLiveTrend(model.id);
  const trendLifecycle = live
    ? {
        currentTrend: live.name,
        status: live.status,
        nextTrend: live.successor,
        note: lifecycleNote(live.status),
      }
    : undefined;

  return {
    platform: model.id,
    name: model.name,
    algorithmFit,
    fitBasis,
    verdict,
    nativeBrief: {
      format: `${model.nativeFormat.format} — ${model.nativeFormat.aspect}, ${model.nativeFormat.duration}`,
      hook: nativeHook(model, input.awareness, input.icp, input.topic),
      cadence: model.cadence,
      hashtags: nativeHashtags(model),
      cta: nativeCta(model),
    },
    levers: topLevers(model),
    warnings,
    trendLifecycle,
  };
}

/** Cross-platform doctrine — the Gary V native rule + Hormozi velocity. */
function crossPlatformDoctrine(): string[] {
  return [
    "Native dialect, not cross-post. The same idea ships in 7 dialects — re-cut per platform, never auto-repost the same asset. (Gary Vaynerchuk)",
    "Velocity compounds on interest graphs (TikTok, IG Reels, X); depth compounds on search graphs (YouTube, Pinterest). Match cadence to the graph. (Hormozi)",
    "Score the signals the algorithm rewards, not the ones that feel good. Likes are weak everywhere; saves/comments/watch-time/retention are the levers. (Hopkins/Bird)",
    "One idea, one hook per platform. The awareness stage sets the register; the platform sets the format. (Schwartz + Gary V)",
    "Never ship an outbound link in the body on Instagram/LinkedIn/Facebook — it kills reach. Link in the first comment. (reach-killer guard)",
  ];
}

/** Render the full deliverable as markdown. */
function render(input: SocialInput, perPlatform: PlatformOutput[], doctrine: string[]): string {
  const sections = perPlatform
    .map((o) => {
      const m = PLATFORM_BY_ID[o.platform];
      const sigRows = m.algorithm
        .map((s) => `| ${s.label} | ${s.weight.toFixed(2)} | ${s.why} | ${s.provenance} |`)
        .join("\n");
      const leverRows = o.levers.map((l) => `| ${l.variable} | ${l.action} |`).join("\n");
      const fitTag = o.fitBasis === "real" ? "real" : "[composite] structural";
      const verdictGlyph = o.verdict === "native-fit" ? "✅" : o.verdict === "partial-fit" ? "⚠️" : "❌";
      return `### ${verdictGlyph} ${o.name} — algorithm-fit ${o.algorithmFit}/100 (${fitTag})

**Doctrine:** ${m.doctrine}
**Graph:** ${m.graph} · **Cadence:** ${m.cadence}

**Algorithm (reward signals + weights):**

| Signal | Weight | Why | Provenance |
|---|---|---|---|
${sigRows}

**Native brief:**
- **Format:** ${o.nativeBrief.format}
- **Hook:** ${o.nativeBrief.hook}
- **Cadence:** ${o.nativeBrief.cadence}
- **Hashtags:** ${o.nativeBrief.hashtags}
- **CTA:** ${o.nativeBrief.cta}

**Top levers to pull:**

| Lever | Action |
|---|---|
${leverRows}

**Trend lifecycle:** ${o.trendLifecycle ? `${statusGlyph(o.trendLifecycle.status)} ${o.trendLifecycle.currentTrend} (${o.trendLifecycle.status}) → next: ${o.trendLifecycle.nextTrend}. ${o.trendLifecycle.note}` : "no trend data"}

**Warnings:**
${o.warnings.map((w) => `- ${w}`).join("\n")}
`;
    })
    .join("\n");

  return `# Social Platform-Algorithm Plan — ${input.goal}

**ICP (starving crowd):** ${input.icp}
**Awareness stage:** ${input.awareness}
**Topic / idea:** ${input.topic}
**Platforms:** ${perPlatform.map((p) => p.name).join(", ")}

> Same idea, native dialect per platform. Each platform runs a different algorithm
> on different signals — this plan models each so you ship 7 native cuts, not one
> cross-posted blob.

${sections}

## Cross-platform doctrine

${doctrine.map((d) => `- ${d}`).join("\n")}

## Lineage held
- **Gary Vaynerchuk** — platform-native: each platform is its own context. Cross-posting is the failure mode.
- **Hopkins / Bird** — the algorithm IS the measurement system. Score the rewarded signals; never fabricate the number.
- **Hormozi** — distribution economics + velocity per graph (interest vs search).
- **Schwartz** — awareness stage sets the native hook register on every platform.
- **Halbert** — the crowd must already be starving; the ICP precedes the platform.

> This plan is a *scaffold*. The algorithm-fit is structural until you feed observed
> signal state (--signal). The native briefs are the architecture; refine the words
> with real VoC from each platform's audience before shipping.
`;
}

/** Build the full social-platform output from an input. */
export function buildSocial(input: SocialInput): SocialOutput {
  const platforms = input.platforms && input.platforms.length > 0 ? input.platforms : ALL_PLATFORMS;
  const perPlatform = platforms
    .map((id) => PLATFORM_BY_ID[id])
    .filter(Boolean)
    .map((m) => buildPlatformOutput(m, input));
  const doctrine = crossPlatformDoctrine();
  const markdown = render(input, perPlatform, doctrine);
  return {
    goal: input.goal,
    icp: input.icp,
    awareness: input.awareness,
    topic: input.topic,
    perPlatform,
    crossPlatformDoctrine: doctrine,
    markdown,
  };
}

export { PLATFORMS, PLATFORM_BY_ID, structuralFit, realFit };