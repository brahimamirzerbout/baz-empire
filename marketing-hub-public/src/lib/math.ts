/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MATHEMATICAL DESIGN ENGINE — Marketing Hub v3.0
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Uses the golden ratio (φ), Fibonacci sequences, information entropy,
 * z-score normalization, and Bass diffusion models to optimize:
 *   1. Visual hierarchy (what gets the most pixels)
 *   2. Information density (how much data per card)
 *   3. Color intensity (statistical significance of each metric)
 *   4. Module ranking (which apps deserve top placement)
 *   5. Animation timing (natural, phi-based easing)
 *   6. Typography scale (perfect proportions)
 */

// ─── Constants ──────────────────────────────────────────────────────────────
export const PHI = 1.6180339887498949;
export const PHI_SQUARED = PHI * PHI; // 2.618
export const PHI_INVERSE = 1 / PHI; // 0.618
export const E = Math.E; // 2.718

// ─── Fibonacci spacing scale (×2 for px) ────────────────────────────────────
// Fib: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
// Px:  2, 2, 4, 6, 10, 16, 26, 42, 68, 110, 178
export const FIB_SPACING = [2, 2, 4, 6, 10, 16, 26, 42, 68, 110, 178] as const;

// ─── Typography scale (base × φ^n) ──────────────────────────────────────────
// Base 14px → 14, 22.7, 36.7, 59.4, 96.0
export const TYPE_SCALE = {
  xs: 10,
  sm: 12,
  base: 14,
  md: Math.round(14 * PHI), // 23
  lg: Math.round(14 * PHI * PHI), // 37
  xl: Math.round(14 * PHI * PHI * PHI), // 60
  hero: Math.round(14 * PHI * PHI * PHI * PHI), // 97
};

// ─── Animation timing (φ-based) ─────────────────────────────────────────────
export const TIMING = {
  instant: Math.round(150 * PHI_INVERSE), // 93ms
  fast: 150,
  base: 250,
  slow: Math.round(250 * PHI), // 405ms
  crawl: Math.round(250 * PHI_SQUARED), // 649ms
};

// ─── Easing curves (natural motion) ─────────────────────────────────────────
export const EASE = [0.16, 1, 0.3, 1] as const; // expo-out
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

// ─── Golden rectangle dimensions ────────────────────────────────────────────
export function goldenRect(width: number): { w: number; h: number } {
  return { w: width, h: Math.round(width / PHI) };
}

// ─── Z-score normalization ──────────────────────────────────────────────────
// Returns how many standard deviations a value is from the mean.
export function zScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}

// ─── Min-max normalization (0..1) ───────────────────────────────────────────
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
}

// ─── Logarithmic scaling (for wide-range values like revenue) ───────────────
export function logScale(value: number, min: number, max: number): number {
  if (value <= 0) return 0;
  const logMin = Math.log(Math.max(1, min));
  const logMax = Math.log(Math.max(1, max));
  if (logMax === logMin) return 0.5;
  return (Math.log(value) - logMin) / (logMax - logMin);
}

// ─── Shannon entropy (information density) ──────────────────────────────────
// Higher entropy = more information = more visual weight deserved.
export function entropy(probabilities: number[]): number {
  return -probabilities.reduce((sum, p) => {
    if (p <= 0 || p >= 1) return sum;
    return sum + p * Math.log2(p);
  }, 0);
}

// ─── Color intensity from z-score ───────────────────────────────────────────
// Maps a z-score (-3..+3) to an opacity (0..1) with sigmoid curve.
export function intensityFromZ(z: number): number {
  const clamped = Math.max(-3, Math.min(3, z));
  return 1 / (1 + Math.exp(-clamped * 0.8));
}

// ─── Health score (weighted composite) ──────────────────────────────────────
// Each component is weighted by its business impact (φ-weighted).
export function healthScore(components: { value: number; weight: number }[]): number {
  const totalWeight = components.reduce((s, c) => s + c.weight, 0);
  const weighted = components.reduce((s, c) => s + c.value * c.weight, 0);
  return Math.round((weighted / totalWeight) * 100);
}

// ─── Bass diffusion model (trend adoption) ──────────────────────────────────
// Predicts adoption curve: N(t) = m × (1 - e^-(p+q)t) / (1 + (q/p) × e^-(p+q)t)
export function bassAdoption(t: number, p: number, q: number, m: number = 100): number {
  const e = Math.exp(-(p + q) * t);
  return (m * (1 - e)) / (1 + (q / p) * e);
}

// ─── Module priority score (information-theoretic) ──────────────────────────
// Scores each app module by: data freshness × actionability × business impact.
// Uses φ-weighting so the most impactful dimension dominates.
export function modulePriority(params: {
  dataFreshness: number; // 0..1 — how recent/active is the data
  actionability: number; // 0..1 — can the user act on this immediately?
  businessImpact: number; // 0..1 — how much does this move revenue?
  userFrequency: number; // 0..1 — how often does the user visit this?
}): number {
  const { dataFreshness, actionability, businessImpact, userFrequency } = params;
  // φ-weighted: business impact dominates, then actionability, then freshness, then frequency
  const weights = {
    businessImpact: PHI_SQUARED,
    actionability: PHI,
    dataFreshness: 1,
    userFrequency: PHI_INVERSE,
  };
  const total = Object.values(weights).reduce((s, w) => s + w, 0);
  return (
    (businessImpact * weights.businessImpact +
      actionability * weights.actionability +
      dataFreshness * weights.dataFreshness +
      userFrequency * weights.userFrequency) /
    total
  );
}

// ─── Statistical threshold coloring ─────────────────────────────────────────
// Returns a color code based on where a value falls relative to thresholds.
export function thresholdColor(
  value: number,
  thresholds: { good: number; warn: number; crit: number; higherIsBetter: boolean },
): {
  color: string;
  label: string;
  bg: string;
  border: string;
} {
  const { good, warn, crit, higherIsBetter } = thresholds;
  const isGood = higherIsBetter ? value >= good : value <= good;
  const isWarn = higherIsBetter ? value >= warn : value <= warn;
  const isCrit = higherIsBetter ? value <= crit : value >= crit;

  if (isGood)
    return {
      color: "text-emerald-600",
      label: "healthy",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    };
  if (isWarn)
    return {
      color: "text-amber-600",
      label: "watch",
      bg: "bg-amber-50",
      border: "border-amber-200",
    };
  if (isCrit)
    return {
      color: "text-rose-600",
      label: "critical",
      bg: "bg-rose-50",
      border: "border-rose-200",
    };
  return {
    color: "text-slate-600",
    label: "neutral",
    bg: "bg-slate-50",
    border: "border-slate-200",
  };
}

// ─── Sparkline path generator (SVG) ─────────────────────────────────────────
export function sparklinePath(
  data: number[],
  width: number = 100,
  height: number = 32,
  smooth: boolean = true,
): { line: string; area: string; lastPoint: { x: number; y: number } } {
  if (data.length < 2) return { line: "", area: "", lastPoint: { x: 0, y: 0 } };
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * height,
  }));

  if (!smooth) {
    const line = points
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(" ");
    const area = `${line} L${width},${height} L0,${height} Z`;
    return { line, area, lastPoint: points[points.length - 1] };
  }

  // Catmull-Rom spline for smooth curves
  const line = points
    .map((p, i) => {
      if (i === 0) return `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      const prev = points[i - 1];
      const next = points[i + 1] || p;
      const cp1x = prev.x + (p.x - prev.x) * 0.5;
      const cp1y = prev.y + (p.y - prev.y) * 0.5;
      const cp2x = p.x - (next.x - p.x) * 0.5;
      const cp2y = p.y - (next.y - p.y) * 0.5;
      return `C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  return { line, area, lastPoint: points[points.length - 1] };
}

// ─── Format helpers ─────────────────────────────────────────────────────────
export function formatCompact(n: number): string {
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

export function formatPct(n: number, decimals = 1): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(decimals)}%`;
}

// ─── Grid column optimizer ──────────────────────────────────────────────────
// Uses φ to determine optimal column count for a given container width.
export function optimalColumns(containerWidth: number, minItemWidth: number = 180): number {
  const ideal = containerWidth / minItemWidth;
  // Round to nearest Fibonacci-friendly number
  const fibs = [1, 2, 3, 5, 8, 13];
  return fibs.reduce((best, f) => (Math.abs(f - ideal) < Math.abs(best - ideal) ? f : best), 1);
}

// ─── Decision density (insights per pixel) ──────────────────────────────────
// Higher = more valuable per unit of screen space.
export function decisionDensity(insights: number, pixelArea: number): number {
  return insights / (pixelArea / 10000); // insights per 10K px²
}
