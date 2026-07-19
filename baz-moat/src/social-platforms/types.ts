/**
 * Social Platforms — types for the organic platform-algorithm engine.
 *
 * Every platform runs a different ranking function on different signals, fed by
 * different controllable variables. This engine models each platform's algorithm
 * (the reward signals + their weights) and its native variables, then emits a
 * platform-native brief — so one idea ships in 7 native dialects, not one
 * cross-posted blob. "Post the same thing everywhere" is the failure mode this
 * replaces (Gary V: each platform is its own context).
 *
 * Lineage: Gary Vaynerchuk (platform-native — "Jab Jab Jab Right Hook", each
 * platform its own dialect) → Hopkins/Bird (Stage 8 — the algorithm IS the
 * measurement system; optimize the signals it scores) → Hormozi (distribution
 * economics + velocity) → Schwartz (awareness stage sets the native hook).
 *
 * Scope: ORGANIC distribution (free reach). Paid creative per platform =
 * ad-creative engine; creator vetting per platform = creator-ops engine. This
 * is the organic algorithm + native content model. Three engines, complementary,
 * non-overlapping.
 *
 * Provenance discipline: every algorithm signal is tagged [grounded-in: …] or
 * [fact]. Heuristic fit scores (no observed signals) are tagged [composite] —
 * real measurement requires observed signal state (--signal flag).
 */

/** The organic platforms modeled. */
export type SocialPlatform =
  | "tiktok"
  | "instagram"
  | "youtube"
  | "linkedin"
  | "x"
  | "facebook"
  | "pinterest";

/** Buyer awareness stage (Schwartz) — sets the native hook register per platform. */
export type AwarenessStage =
  | "unaware"
  | "problem-aware"
  | "solution-aware"
  | "product-aware"
  | "most-aware";

/**
 * Lifecycle stage of a trend — Schwartz market-sophistication mapped to trend
 * cycles, not markets. A trend at "peak" is already saturating; the lever is to
 * ride "emerging/rising" early (Gary V) and never ship an "abandoned/forgotten" one.
 */
export type TrendStatus =
  | "emerging" // first instances, low competition, high early-mover ROI
  | "rising" // adopters piling in, still profitable
  | "peak" // saturated — high competition, declining ROI
  | "declining" // past peak, audience fatigue
  | "abandoned" // the platform/audience moved on; riding it looks out of touch
  | "forgotten" // dead; only referenced ironically

/** The graph a platform distributes on — decides the discovery mechanic. */
export type PlatformGraph =
  | "interest" // TikTok — For You, interest graph not social
  | "social" // Instagram / X — follower graph + interest hybrid
  | "search" // YouTube / Pinterest — query + browse
  | "professional" // LinkedIn — professional graph
  | "community"; // Facebook — groups + meaningful interaction

/** One reward signal in a platform's ranking function. */
export interface AlgorithmSignal {
  id: string;
  label: string;
  /** Relative weight in the ranking, normalized 0–1 within the platform. */
  weight: number;
  /** Why the platform weights it — the retention/value proxy it optimizes. */
  why: string;
  /** Provenance: [grounded-in: …] / [fact] / [composite]. */
  provenance: string;
}

/** A controllable lever that feeds one or more algorithm signals. */
export interface PlatformVariable {
  id: string;
  label: string;
  /** The signal id(s) this lever feeds. */
  feeds: string[];
  /** Operator guidance — what to do with this lever on this platform. */
  guidance: string;
  /** Hard constraint or sweet-spot, if any. */
  constraint?: string;
}

/** The full per-platform model — algorithm + variables + native spec. */
export interface PlatformModel {
  id: SocialPlatform;
  name: string;
  /** One-line native doctrine (Gary V: platform-native). */
  doctrine: string;
  graph: PlatformGraph;
  /** The algorithm — reward signals + weights (Hopkins/Bird: measurement). */
  algorithm: AlgorithmSignal[];
  /** The controllable variables (levers). */
  variables: PlatformVariable[];
  nativeFormat: { aspect: string; duration: string; format: string };
  cadence: string;
  /** The single biggest reach-killer on this platform. */
  reachKiller: string;
  provenance: string[];
}

/** Engine input. */
export interface SocialInput {
  /** Campaign goal (the "why"). */
  goal: string;
  /** The starving crowd — who + why hungry (Halbert). */
  icp: string;
  /** Buyer awareness stage (Schwartz) — sets the native hook. */
  awareness: AwarenessStage;
  /** The content subject / idea to distribute natively. */
  topic: string;
  /** Platforms to model (default: all 7). */
  platforms?: SocialPlatform[];
  /**
   * Optional observed signal state per platform for algorithm-fit scoring.
   * Keyed by signal id → hit|miss|unknown. Absent → engine returns a structural
   * [composite] fit heuristic and nudges for real signal data.
   */
  signals?: Partial<Record<SocialPlatform, Record<string, "hit" | "miss" | "unknown">>>;
}

/** Trend-lifecycle read for a platform (Schwartz sophistication applied to trends). */
export interface TrendLifecycle {
  /** The platform's latest live trend (best-effort, by domain). */
  currentTrend: string;
  status: TrendStatus;
  /** The trend that replaced / will replace it. */
  nextTrend: string;
  /** Operator note — ride early, or avoid as saturated/abandoned. */
  note: string;
}

/** Per-platform native brief + algorithm-fit assessment. */
export interface PlatformOutput {
  platform: SocialPlatform;
  name: string;
  /** Algorithm-fit 0–100. Real (from observed signals) or [composite] structural. */
  algorithmFit: number;
  /** "real" (scored from signals) or "structural" (heuristic, no signals supplied). */
  fitBasis: "real" | "structural";
  verdict: "native-fit" | "partial-fit" | "off-platform";
  nativeBrief: {
    format: string;
    hook: string;
    cadence: string;
    hashtags: string;
    cta: string;
  };
  /** The specific levers to pull on this platform. */
  levers: { variable: string; action: string }[];
  warnings: string[];
  /** Trend-lifecycle read on this platform (Schwartz sophistication applied to trends). */
  trendLifecycle?: TrendLifecycle;
}

/** Full engine output. */
export interface SocialOutput {
  goal: string;
  icp: string;
  awareness: AwarenessStage;
  topic: string;
  perPlatform: PlatformOutput[];
  crossPlatformDoctrine: string[];
  markdown: string;
}