/**
 * Trend curve + chasm + win-at-stage + trendsetter — the synthesis engine.
 *
 * Consumes the platform-algorithm models + the trend-history registry + the
 * operator's intel (observed adoption %, velocity) and emits:
 *   1. The trend CURVE — Rogers diffusion (innovators → early adopters → early
 *      majority → late majority → laggards) with Moore's chasm, the trend's
 *      position, slope (velocity), time-to-peak, projected end.
 *   2. The CHASM GRAPH — ASCII of the curve + the chasm + where this trend sits
 *      (pre-chasm / in-chasm / post-chasm). Most trends die in the chasm.
 *   3. HOW TO WIN AT EVERY STAGE — per-segment playbook (seed → ride → cross →
 *      scale → harvest → exit).
 *   4. THE TRENDSETTER PLAYBOOK — BAZ doesn't ride trends, it SETS them: name
 *      the category, make the canonical example, seed on the platform whose
 *      algorithm rewards your signal, ride the early adopters, cross the chasm
 *      with a beachhead, let the mainstream copy YOU.
 *
 * Lineage: Rogers (diffusion of innovations) → Moore (crossing the chasm +
 * beachhead/whole-product) → Godin (category design — name it first) → Gary
 * Vaynerchuk (early-mover / invent the format) → Hormozi (scale economics by
 * stage) → Hopkins (measure ROI by stage, not hype).
 *
 * Provenance: adoption/velocity from observed intel = "real"; derived from the
 * registry status = "structural" [composite]. Never fabricate the number.
 */

import type { SocialPlatform, TrendStatus } from "./types.js";
import { TRENDS_BY_PLATFORM, platformLabel, statusGlyph } from "./trends.js";
import type { TrendDomain } from "./trends.js";
import { PLATFORM_BY_ID } from "./platforms.js";

/** Rogers diffusion segments (the chasm is the gap at ~16%, modeled as risk). */
export type CurveSegment =
  | "innovators" // 0–2.5%
  | "early-adopters" // 2.5–16%
  | "early-majority" // 16–50%
  | "late-majority" // 50–84%
  | "laggards"; // 84–100%

/** Where the trend sits relative to Moore's chasm (the 16% death valley). */
export type ChasmRisk = "pre-chasm" | "in-chasm" | "post-chasm";

export interface TrendCurveInput {
  platform: SocialPlatform;
  /** Trend name (free text) — or omit + use fromRegistryId. */
  trend?: string;
  domain?: TrendDomain;
  /** Observed cumulative adoption % (0–100) — the operator's intel. Absent → structural. */
  adoptionPct?: number;
  /** Observed velocity (% adoption gained per week). Absent → structural. */
  velocity?: number;
  /** Pull the trend + structural stage from the registry by id. */
  fromRegistryId?: string;
}

export interface TrendCurveOutput {
  platform: SocialPlatform;
  trend: string;
  domain?: TrendDomain;
  segment: CurveSegment;
  adoptionPct: number;
  velocity: number;
  chasmRisk: ChasmRisk;
  chasmCrossed: boolean;
  /** Weeks to 50% (early/late majority boundary) if rising; else null. */
  timeToPeakWeeks: number | null;
  /** Weeks to 84% (laggards = effectively dead) if rising; else null. */
  projectedEndWeeks: number | null;
  fitBasis: "real" | "structural";
  chasmGraph: string;
  winAtStage: string[];
  trendsetterPlaybook: string[];
  markdown: string;
}

/* ---------------- structural maps (registry status → curve) [composite] ---- */
const ADOPTION_BY_STATUS: Record<TrendStatus, number> = {
  emerging: 3, rising: 10, peak: 35, declining: 65, abandoned: 90, forgotten: 95,
};
const VELOCITY_BY_STATUS: Record<TrendStatus, number> = {
  emerging: 2, rising: 5, peak: 1, declining: -3, abandoned: -1, forgotten: 0,
};

/** Rogers segment from cumulative adoption %. */
export function segmentFromAdoption(pct: number): CurveSegment {
  if (pct < 2.5) return "innovators";
  if (pct < 16) return "early-adopters";
  if (pct < 50) return "early-majority";
  if (pct < 84) return "late-majority";
  return "laggards";
}

/** Chasm risk from adoption % — the 16% death valley (Moore). */
export function chasmRiskFromAdoption(pct: number): ChasmRisk {
  if (pct < 13) return "pre-chasm";
  if (pct <= 18) return "in-chasm";
  return "post-chasm";
}

/** Resolve structural adoption/velocity from a registry trend's status. */
function fromRegistry(id: string): { trend: string; adoption: number; velocity: number; domain?: TrendDomain; status: TrendStatus } | null {
  for (const list of Object.values(TRENDS_BY_PLATFORM)) {
    const t = list.find((x) => x.id === id);
    if (t) {
      return {
        trend: t.name,
        adoption: ADOPTION_BY_STATUS[t.status],
        velocity: VELOCITY_BY_STATUS[t.status],
        domain: t.domain,
        status: t.status,
      };
    }
  }
  return null;
}

/** The platform's top-weighted algorithm signal (for the trendsetter seeding step). */
function topSignal(platform: SocialPlatform): { label: string; weight: number } {
  const m = PLATFORM_BY_ID[platform];
  const top = [...m.algorithm].sort((a, b) => b.weight - a.weight)[0]!;
  return { label: top.label, weight: top.weight };
}

/* ----------------- HOW TO WIN AT EVERY STAGE (per-segment playbook) -------- */
export function winAtStage(segment: CurveSegment, risk: ChasmRisk, platform: SocialPlatform): string[] {
  const sig = topSignal(platform);
  switch (segment) {
    case "innovators":
      return [
        "SEED the trend — you are the originator. Reach is near-zero; equity is maximal. This is where you stop following and start SETTING.",
        "NAME it before anyone else (Godin: category design — the namer owns the category). Make the CANONICAL example every copy references.",
        `Optimize the seed for ${platformLabel(platform)}'s top signal: ${sig.label} (weight ${sig.weight.toFixed(2)}). The algorithm is the test — feed it the signal it scores.`,
        "Don't chase reach yet. You're building the reference; the early adopters amplify it next.",
      ];
    case "early-adopters":
      if (risk === "in-chasm") return winChasm(platform);
      return [
        "RIDE HARD — first wave after the originator. High ROI, low competition. Bank the cheap reach before the chasm (Hormozi: velocity now, the window closes).",
        "Native > produced. Replicate the format at velocity; lower the barrier for others to copy (every copy points back to you).",
        "Don't over-polish — the early-adopter graph rewards authenticity + speed, not production.",
        "Watch the 16% line. The chasm is next; have your beachhead ready (see trendsetter playbook).",
      ];
    case "early-majority":
      return [
        "SCALE + DEFEND — the mainstream is piling in. High volume, rising competition, declining per-unit ROI.",
        "Win on execution against the algorithm. Hopkins: measure YOUR ROI by stage, not the hype — if your per-unit economics turned negative, you're late.",
        "This is where brands flood in and dilute. Out-execute on the top signal or you're noise.",
        "You should already be seeding the NEXT trend (trendsetter playbook) — by the time the majority copies this one, you're one trend ahead.",
      ];
    case "late-majority":
      return [
        "HARVEST the tail or EXIT. The me-too wave — low novelty, low ROI.",
        "Only stay if you can squeeze the tail at near-zero marginal cost (repurpose, automate). Otherwise exit NOW and seed the next.",
        "Do not invest fresh creative here — the curve is bending to laggards.",
      ];
    case "laggards":
      return [
        "EXIT. Do not enter. The trend is dead; the audience has moved on.",
        "Reference it only to NAME the successor — the trendsetter uses the dead trend as a contrast to launch the next.",
        "Entering here = out-of-touch. The only winning move is to already be on the next curve.",
      ];
  }
}

/** The chasm crossing playbook (Moore) — the death-valley move. */
function winChasm(platform: SocialPlatform): string[] {
  return [
    "CROSS THE CHASM or die here. Most trends die in the chasm — the early-adopter wave doesn't automatically become mainstream.",
    "Moore: build a BEACHHEAD — ONE niche segment + a whole-product (complete solution) that forces the mainstream to follow. Name the segment; name the whole-product. If you can't, harvest and exit.",
    "Focus all distribution on the beachhead. Don't spread across segments — the chasm kills generalists.",
    `On ${platformLabel(platform)}, win the beachhead by dominating the top signal (${topSignal(platform).label}) for that one segment until they can't ignore you.`,
  ];
}

/* ----------------- THE TRENDSETTER PLAYBOOK (the closer) ------------------- */
export function trendsetterPlaybook(platform: SocialPlatform, domain?: TrendDomain): string[] {
  const sig = topSignal(platform);
  return [
    `1. NAME the trend before others do (Godin category design). The namer owns the category — "very demure," "build in public," "the document post." Coin the term.`,
    `2. Make the CANONICAL example — the definitive first instance every copy references. It must feed ${platformLabel(platform)}'s top algorithm signal: ${sig.label} (weight ${sig.weight.toFixed(2)}). The algorithm is the test; feed it the signal it scores.`,
    `3. SEED it on the platform whose algorithm rewards your trend's signal. You're on ${platformLabel(platform)} — that's the right soil if your trend feeds ${sig.label}. (Use the platform model to pick the soil before you plant.)`,
    "4. RIDE the early adopters (2.5–16%) — they amplify. Give them the format to copy; lower the replication barrier so every copy points back to you.",
    "5. CROSS THE CHASM with a beachhead niche — one segment + a whole-product that forces the mainstream to follow (Moore). Don't generalize; win one segment first.",
    "6. LET THE MAINSTREAM COPY YOU. By peak you're the reference, not a participant — and you've already seeded the successor. The trendsetter is always one trend ahead of the curve they created.",
    domain ? `Domain (${domain}): own the format/hook in this lane so completely that the platform's algorithm associates the signal with you.` : "Own one domain so completely the platform's algorithm associates the signal with you.",
  ];
}

/* ----------------- THE CHASM GRAPH (ASCII generator) ---------------------- */
export function chasmGraph(pct: number, segment: CurveSegment, risk: ChasmRisk): string {
  const W = 60;
  // Segment cumulative ranges; render proportional widths.
  const segs: { label: string; lo: number; hi: number; fill: string }[] = [
    { label: "INNOV", lo: 0, hi: 2.5, fill: "▏" },
    { label: "EARLY-ADOPT", lo: 2.5, hi: 16, fill: "░" },
    { label: "EARLY-MAJ", lo: 16, hi: 50, fill: "▒" },
    { label: "LATE-MAJ", lo: 50, hi: 84, fill: "▓" },
    { label: "LAGGARDS", lo: 84, hi: 100, fill: "█" },
  ];
  // Build the filled bar.
  let bar = "";
  for (const s of segs) {
    const w = Math.max(1, Math.round(((s.hi - s.lo) / 100) * W));
    bar += s.fill.repeat(w);
  }
  bar = bar.slice(0, W);
  // Chasm marker sits at the 16% boundary.
  const chasmPos = Math.round((16 / 100) * W);
  // Position marker.
  const pos = Math.min(W - 1, Math.max(0, Math.round((pct / 100) * W)));
  const markerLine = " ".repeat(pos) + "▲";
  const chasmLine = " ".repeat(Math.max(0, chasmPos - 3)) + "░CHASM░";
  const legend = segs.map((s) => `${s.label} ${s.lo}-${s.hi}%`).join("  ·  ");
  return [
    "Adoption curve — Rogers diffusion + Moore chasm (0% ──────▶ 100%)",
    "",
    `0% ${bar} 100%`,
    chasmLine,
    markerLine,
    `  YOU: ${pct}% — ${segment} · ${risk}`,
    "",
    `Segments: ${legend}`,
    "  The chasm is the ~16% death valley between early adopters and the early majority. Most trends die here.",
  ].join("\n");
}

/* ----------------- RENDER ------------------------------------------------- */
function render(out: Omit<TrendCurveOutput, "markdown">): string {
  const peak = out.timeToPeakWeeks === null ? "at/past peak" : `${out.timeToPeakWeeks} weeks`;
  const end = out.projectedEndWeeks === null ? "past peak / declining — end is near or past" : `${out.projectedEndWeeks} weeks`;
  const winRows = out.winAtStage.map((w) => `- ${w}`).join("\n");
  const setterRows = out.trendsetterPlaybook.map((s) => `- ${s}`).join("\n");
  return `# Trend Curve — ${out.trend} on ${platformLabel(out.platform)}

**Domain:** ${out.domain ?? "—"}
**Adoption:** ${out.adoptionPct}% (${out.fitBasis}${out.fitBasis === "structural" ? " — [composite], supply --adoption for real" : ""})
**Velocity:** ${out.velocity >= 0 ? "+" : ""}${out.velocity}%/week
**Segment:** ${out.segment}
**Chasm:** ${out.chasmRisk}${out.chasmCrossed ? " (crossed)" : " (not crossed)"}
**Time to peak (50%):** ${peak}
**Projected end (84%):** ${end}

\`\`\`
${out.chasmGraph}
\`\`\`

## How to win at this stage

${winRows}

## Trendsetter playbook — set the trend, don't ride it

${setterRows}

## Lineage held
- **Rogers** — diffusion of innovations: the curve is the population, segment by segment.
- **Moore** — the chasm at ~16%; most trends die crossing it. The beachhead + whole-product is the only reliable crossing move.
- **Godin** — category design: name the trend first; the namer owns the category.
- **Gary Vaynerchuk** — early-mover: ride emerging/rising, bank the cheap reach before the chasm.
- **Hormozi** — scale economics by stage; velocity compounds pre-chasm, ROI decays post-peak.
- **Hopkins** — measure ROI by stage, not the hype. A peak-stage trend with negative per-unit economics is a loss dressed as reach.

> ${out.fitBasis === "structural" ? "[composite] fit — adoption/velocity derived from the registry trend status. Feed --adoption / --velocity (your intel) for a real curve." : "Real fit — scored from observed intel."} The curve is the architecture; the numbers must be yours.
`;
}

/** Build the trend curve + chasm + win-at-stage + trendsetter output. */
export function buildTrendCurve(input: TrendCurveInput): TrendCurveOutput {
  let trend = input.trend ?? "Untitled trend";
  let domain = input.domain;
  let adoption = input.adoptionPct;
  let velocity = input.velocity;
  let fitBasis: "real" | "structural";

  // Resolve from registry if requested (structural baseline).
  if (input.fromRegistryId) {
    const r = fromRegistry(input.fromRegistryId);
    if (r) {
      trend = r.trend;
      if (!domain) domain = r.domain;
      if (adoption === undefined) adoption = r.adoption;
      if (velocity === undefined) velocity = r.velocity;
    }
  }

  // Determine basis: real only if the operator supplied observed intel.
  const hasIntel = input.adoptionPct !== undefined || input.velocity !== undefined;
  fitBasis = hasIntel ? "real" : "structural";

  if (adoption === undefined) adoption = 8; // [composite] default — treat as early-adopter/pre-chasm
  if (velocity === undefined) velocity = 3; // [composite] default — gently rising
  adoption = Math.max(0, Math.min(100, adoption));

  const segment = segmentFromAdoption(adoption);
  const risk = chasmRiskFromAdoption(adoption);
  const chasmCrossed = adoption >= 16;

  const timeToPeakWeeks = velocity > 0 && adoption < 50 ? Math.round((50 - adoption) / velocity) : null;
  const projectedEndWeeks = velocity > 0 && adoption < 84 ? Math.round((84 - adoption) / velocity) : null;

  const win = winAtStage(segment, risk, input.platform);
  const setter = trendsetterPlaybook(input.platform, domain);
  const graph = chasmGraph(adoption, segment, risk);

  const partial = {
    platform: input.platform,
    trend,
    domain,
    segment,
    adoptionPct: adoption,
    velocity,
    chasmRisk: risk,
    chasmCrossed,
    timeToPeakWeeks,
    projectedEndWeeks,
    fitBasis,
    chasmGraph: graph,
    winAtStage: win,
    trendsetterPlaybook: setter,
  };
  const markdown = render(partial);
  return { ...partial, markdown };
}