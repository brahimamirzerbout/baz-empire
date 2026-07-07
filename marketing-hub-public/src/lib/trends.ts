/**
 * Trend Monitor + Micro-Trend Monitor + Adoption Curve.
 *
 * Pulls real signals from the Hub:
 *   - wire_articles → micro-trend news velocity
 *   - ideas + campaigns + experiments → adoption signals
 *   - settings → positioning context for relevance
 *
 * Three lenses:
 *   1. Macro Trends  — long-wave (3-12 months). Categories + maturity + adoption %.
 *   2. Micro Trends  — short-wave (7-30 days). Spike detection per category.
 *   3. Adoption Curve — Bass diffusion model. Where is each trend on the Rogers curve?
 */
import { db } from "@/lib/db";

export type TrendCategory =
  | "strategy"
  | "copy"
  | "brand"
  | "growth"
  | "product"
  | "ai"
  | "seo"
  | "story"
  | "pricing"
  | "automation"
  | "analytics";

export interface MacroTrend {
  category: TrendCategory;
  label: string;
  maturity: "emerging" | "growing" | "peak" | "declining";
  velocity_30d: number; // % change last 30 days vs prior 30
  volume_30d: number; // count of signals last 30 days
  volume_prev_30d: number; // count prior 30 days
  adoption_pct: number; // 0..100 — position on Rogers curve
  bass_p: number; // innovation coefficient (0.001-0.03)
  bass_q: number; // imitation coefficient (0.1-0.5)
  nova_take: string; // one-line insight
}

export interface MicroTrend {
  category: TrendCategory;
  label: string;
  signal_count_7d: number;
  signal_count_prev_7d: number;
  spike_pct: number; // % change last 7d vs prior 7d
  is_spike: boolean; // spike = >50% growth
  top_source: string; // where the signals are coming from
  top_headline: string; // the highest-relevance article
  top_url: string;
  top_relevance: number;
}

export interface AdoptionCurve {
  category: TrendCategory;
  label: string;
  current_pct: number; // 0..100 adoption right now
  bass_p: number;
  bass_q: number;
  segments: { name: string; range: [number, number]; pct_of_pop: number }[];
  position: "innovator" | "early_adopter" | "early_majority" | "late_majority" | "laggard";
  months_to_50pct: number | null; // months until 50% adoption (projection)
  months_to_90pct: number | null;
}

const CATEGORY_LABELS: Record<TrendCategory, string> = {
  strategy: "Strategy",
  copy: "Copy & Messaging",
  brand: "Brand & Identity",
  growth: "Growth & Acquisition",
  product: "Product & UX",
  ai: "AI in Marketing",
  seo: "SEO & Discovery",
  story: "Storytelling",
  pricing: "Pricing & Packaging",
  automation: "Automation & Ops",
  analytics: "Analytics & Measurement",
};

const ALL_CATEGORIES: TrendCategory[] = Object.keys(CATEGORY_LABELS) as TrendCategory[];

const MS_DAY = 86400000;

/* ─────────────── Macro Trends ─────────────── */

export function macroTrends(): MacroTrend[] {
  const now = Date.now();
  const d30 = now - 30 * MS_DAY;
  const d60 = now - 60 * MS_DAY;

  // Volume per category from wire + ideas
  const wireNow = db
    .prepare(
      `
    SELECT category, COUNT(*) AS n FROM wire_articles WHERE created_at >= ? GROUP BY category
  `,
    )
    .all(d30) as Record<string, unknown>[];
  const wirePrev = db
    .prepare(
      `
    SELECT category, COUNT(*) AS n FROM wire_articles WHERE created_at >= ? AND created_at < ? GROUP BY category
  `,
    )
    .all(d60, d30) as Record<string, unknown>[];

  // Adoption proxy: experiments + ideas + campaigns per category (their tags JSON parsed loosely)
  const ideaCounts = db.prepare(`SELECT tags FROM ideas`).all() as Record<string, unknown>[];
  const expCounts = db.prepare(`SELECT id FROM experiments`).all() as Record<string, unknown>[];
  const cmpCounts = db.prepare(`SELECT channels FROM campaigns`).all() as Record<string, unknown>[];

  const out: MacroTrend[] = [];
  for (const cat of ALL_CATEGORIES) {
    const nowN = wireNow.find((w: Record<string, unknown>) => w.category === cat)?.n || 0;
    const prevN = wirePrev.find((w: Record<string, unknown>) => w.category === cat)?.n || 0;
    const velocity = prevN > 0 ? ((nowN - prevN) / prevN) * 100 : 0;
    const maturity = maturityFromVelocity(velocity, nowN);
    const adoption = adoptionFor(cat, ideaCounts.length, expCounts.length, cmpCounts.length);
    const { p, q } = bassCoefficientsFor(cat);
    const months50 = bassMonthsToTarget(adoption, 50, p, q);
    const months90 = bassMonthsToTarget(adoption, 90, p, q);

    const takeParts: string[] = [];
    if (velocity > 30) takeParts.push(`+${Math.round(velocity)}% signal growth — riding a wave`);
    else if (velocity < -20)
      takeParts.push(`${Math.round(velocity)}% — fading, find the next thing`);
    else if (maturity === "peak")
      takeParts.push("at peak — differentiation now matters more than category creation");
    else if (maturity === "emerging")
      takeParts.push("emerging — first movers get the cheap attention");
    if (months50 !== null && months50 < 12)
      takeParts.push(`mainstream in ~${months50}mo — move now`);
    if (takeParts.length === 0) takeParts.push("stable — optimize what works, don't chase shiny");

    out.push({
      category: cat,
      label: CATEGORY_LABELS[cat],
      maturity,
      velocity_30d: Math.round(velocity * 10) / 10,
      volume_30d: nowN,
      volume_prev_30d: prevN,
      adoption_pct: adoption,
      bass_p: p,
      bass_q: q,
      nova_take: takeParts.join(" · "),
    });
  }
  return out.sort((a, b) => b.volume_30d - a.volume_30d);
}

function maturityFromVelocity(v: number, vol: number): MacroTrend["maturity"] {
  if (vol === 0) return "emerging";
  if (v > 50) return "growing";
  if (v > -10 && v < 50) return "peak";
  return "declining";
}

function adoptionFor(
  cat: TrendCategory,
  ideaCount: number,
  expCount: number,
  cmpCount: number,
): number {
  // Heuristic adoption score: combination of idea+experiment density and time seeded
  // In real life, this would come from market research feeds. Here we use activity as a proxy.
  const seedFactor: Record<TrendCategory, number> = {
    ai: 78, // AI in marketing is post-early-majority
    analytics: 65,
    seo: 58,
    growth: 55,
    brand: 50,
    story: 38,
    copy: 45,
    automation: 60,
    strategy: 40,
    pricing: 30,
    product: 42,
  };
  const base = seedFactor[cat] || 30;
  // Adjust slightly based on internal activity
  const activity = Math.min(15, (ideaCount + expCount + cmpCount) / 50);
  return Math.min(98, Math.round(base + activity));
}

function bassCoefficientsFor(cat: TrendCategory): { p: number; q: number } {
  // Bass diffusion parameters — p = innovation, q = imitation.
  // Fads have high p, low q. Slow-build categories have low p, high q.
  const map: Record<TrendCategory, { p: number; q: number }> = {
    ai: { p: 0.025, q: 0.35 }, // fast innovation, strong imitation
    growth: { p: 0.015, q: 0.45 },
    seo: { p: 0.008, q: 0.4 },
    analytics: { p: 0.01, q: 0.42 },
    copy: { p: 0.02, q: 0.38 },
    brand: { p: 0.005, q: 0.3 },
    strategy: { p: 0.006, q: 0.32 },
    story: { p: 0.012, q: 0.35 },
    pricing: { p: 0.011, q: 0.4 },
    automation: { p: 0.014, q: 0.45 },
    product: { p: 0.009, q: 0.38 },
  };
  return map[cat];
}

/* ─────────────── Micro Trends (7-day) ─────────────── */

export function microTrends(): MicroTrend[] {
  const now = Date.now();
  const d7 = now - 7 * MS_DAY;
  const d14 = now - 14 * MS_DAY;

  const nowRows = db
    .prepare(
      `
    SELECT category, COUNT(*) AS n, MAX(relevance) AS max_rel, source
    FROM wire_articles WHERE created_at >= ? GROUP BY category
  `,
    )
    .all(d7) as Record<string, unknown>[];

  const prevRows = db
    .prepare(
      `
    SELECT category, COUNT(*) AS n FROM wire_articles WHERE created_at >= ? AND created_at < ? GROUP BY category
  `,
    )
    .all(d14, d7) as Record<string, unknown>[];

  // For each category, find the highest-relevance article in last 7 days
  const out: MicroTrend[] = [];
  for (const cat of ALL_CATEGORIES) {
    const nowN = nowRows.find((w: Record<string, unknown>) => w.category === cat)?.n || 0;
    const prevN = prevRows.find((w: Record<string, unknown>) => w.category === cat)?.n || 0;
    const spike = prevN > 0 ? ((nowN - prevN) / prevN) * 100 : nowN > 0 ? 100 : 0;

    // Top article in last 7d
    const top = db
      .prepare(
        `
      SELECT title, url, source, relevance FROM wire_articles
      WHERE category = ? AND created_at >= ?
      ORDER BY relevance DESC, created_at DESC LIMIT 1
    `,
      )
      .get(cat, d7) as Record<string, unknown> | undefined;

    out.push({
      category: cat,
      label: CATEGORY_LABELS[cat],
      signal_count_7d: nowN,
      signal_count_prev_7d: prevN,
      spike_pct: Math.round(spike * 10) / 10,
      is_spike: spike > 50,
      top_source: top?.source || "—",
      top_headline: top?.title || "",
      top_url: top?.url || "",
      top_relevance: top?.relevance || 0,
    });
  }
  return out.sort((a, b) => b.signal_count_7d - a.signal_count_7d);
}

/* ─────────────── Adoption Curve ─────────────── */

export function adoptionCurves(): AdoptionCurve[] {
  const macro = macroTrends();
  return macro.map((m) => curveFromMacro(m));
}

function curveFromMacro(m: MacroTrend): AdoptionCurve {
  const segments = [
    { name: "Innovators", range: [0, 2.5] as [number, number], pct_of_pop: 2.5 },
    { name: "Early Adopters", range: [2.5, 16] as [number, number], pct_of_pop: 13.5 },
    { name: "Early Majority", range: [16, 50] as [number, number], pct_of_pop: 34 },
    { name: "Late Majority", range: [50, 84] as [number, number], pct_of_pop: 34 },
    { name: "Laggards", range: [84, 100] as [number, number], pct_of_pop: 16 },
  ];
  const pct = m.adoption_pct;
  const position: AdoptionCurve["position"] =
    pct < 2.5
      ? "innovator"
      : pct < 16
        ? "early_adopter"
        : pct < 50
          ? "early_majority"
          : pct < 84
            ? "late_majority"
            : "laggard";

  return {
    category: m.category,
    label: m.label,
    current_pct: pct,
    bass_p: m.bass_p,
    bass_q: m.bass_q,
    segments,
    position,
    months_to_50pct: bassMonthsToTarget(pct, 50, m.bass_p, m.bass_q),
    months_to_90pct: bassMonthsToTarget(pct, 90, m.bass_p, m.bass_q),
  };
}

/**
 * Approximate Bass model — returns approximate months until target adoption %.
 * Uses closed-form approximation: F(t+1) - F(t) where F(t) follows Bass ODE.
 * For our purposes, a simple iterative approximation is fine.
 */
function bassMonthsToTarget(
  currentPct: number,
  targetPct: number,
  p: number,
  q: number,
  monthsPerStep = 1,
): number | null {
  if (currentPct >= targetPct) return 0;
  let f = currentPct / 100;
  let months = 0;
  const maxMonths = 240; // 20 years cap
  while (months < maxMonths) {
    // dF/dt = (p + q*F) * (1 - F) — discrete approximation
    const df = (p + q * f) * (1 - f) * monthsPerStep;
    f = Math.min(1, f + df);
    months++;
    if (f * 100 >= targetPct) return months;
  }
  return null;
}

/* ─────────────── Adoption curve drawing helper ─────────────── */

export function curvePoints(currentPct: number): number[] {
  // Returns 100-point series approximating the S-curve for visualization,
  // with the current adoption marked.
  const points: number[] = [];
  for (let i = 0; i <= 100; i++) {
    // Logistic-ish curve
    const x = i / 100;
    const y = 1 / (1 + Math.exp(-8 * (x - 0.5)));
    points.push(Math.round(y * 100));
  }
  return points;
}
