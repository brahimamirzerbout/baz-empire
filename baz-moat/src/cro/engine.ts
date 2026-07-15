/**
 * CRO engine — prioritized fix list from observed friction signals.
 *
 * The surgical move: don't hand a client a heatmap and say "here's where people
 * rage-click." Hand them a ranked list of fixes with expected lift, effort, and
 * a test/no-test decision. The ranking is by expected-lift-per-effort-hour, not
 * by what's easy to ship.
 *
 * Two rules enforced (the vibecoded-vs-surgical line):
 * 1. Hopkins: "the best ads ask no one to buy" → the fix must reduce friction,
 *    not add persuasion. Fix the funnel, don't shout louder.
 * 2. Statistical power gate: below ~1k conversions/mo at a step, flag "test
 *    required = false, ship direct" — an underpowered A/B test is confident
 *    nonsense. Don't buy a testing tool you can't fill.
 */

import type { CROFix, CROInput, CROOutput, FrictionSignal } from "./types.js";

/** Conservative expected-lift bands by signal type (industry-benchmark-derived). */
const LIFT_BY_TYPE: Record<FrictionSignal["type"], number> = {
  "rage-click": 8, // users clicking something non-interactive → fixing it recovers intent
  "dead-click": 5,
  "drop-off": 12, // the biggest lever — funnel step drop-off
  "form-abandonment": 15, // forms are the most expensive object per pixel
  "slow-lcp": 7, // sub-1.5s LCP is the BAZ floor; each second above costs ~7%
  "unclear-cta": 10, // Wiebe: CTA-matches-intent
  "no-proof": 6, // Ogilvy: proof amplifies desire
  "friction-copy": 4, // Wiebe: the "so what?" test
};

/** Effort estimates (hours) by location. */
const EFFORT_BY_LOCATION: Record<FrictionSignal["location"], number> = {
  "above-fold": 3,
  "cta": 2,
  "form": 6,
  "checkout": 8,
  "pricing": 4,
  "nav": 3,
  "landing": 5,
  "mobile": 6,
};

/** Stat-power threshold: below this monthly conversions at a step, don't A/B test. */
const STAT_POWER_THRESHOLD = 1000;

function expectedConversions(
  signal: FrictionSignal,
  monthlySessions: number,
  baselineRate: number,
): number | undefined {
  const sessions = signal.monthlySessions ?? monthlySessions;
  const rate = signal.currentRate ?? baselineRate;
  if (sessions <= 0 || rate <= 0) return undefined;
  return Math.round(sessions * rate);
}

function buildFix(
  signal: FrictionSignal,
  input: CROInput,
  rank: number,
): CROFix {
  const lift = LIFT_BY_TYPE[signal.type] ?? 4;
  const effort = EFFORT_BY_LOCATION[signal.location] ?? 4;
  const conversions = expectedConversions(signal, input.monthlySessions, input.baselineRate);
  const expectedMonthlyConversions = conversions
    ? Math.round((conversions * lift) / 100)
    : undefined;

  // Stat-power gate: below the threshold, ship direct (don't run an underpowered test).
  const stepConversions = conversions ?? 0;
  const testRequired = stepConversions >= STAT_POWER_THRESHOLD;

  const fix = prescribeFix(signal);
  const rationale = prescribeRationale(signal, testRequired);

  return {
    rank,
    signalId: signal.id,
    location: signal.location,
    fix,
    expectedLiftPct: lift,
    expectedMonthlyConversions,
    effortHours: effort,
    testRequired,
    rationale,
  };
}

/** Prescribe the fix — operator-grade, one sentence. Hopkins: reduce friction, don't add persuasion. */
function prescribeFix(signal: FrictionSignal): string {
  switch (signal.type) {
    case "rage-click":
      return `Make "${signal.observation}" interactive or remove it — users are clicking it expecting a result.`;
    case "dead-click":
      return `Remove or wire up the dead element (${signal.observation}) — every dead click is a micro-trust loss.`;
    case "drop-off":
      return `Cut the step causing drop-off at ${signal.location} (${signal.observation}) — the funnel is too long here.`;
    case "form-abandonment":
      return `Reduce form fields at ${signal.location} (${signal.observation}) — remove every field that isn't needed to take the next action. Progressive-profile the rest.`;
    case "slow-lcp":
      return `Fix LCP at ${signal.location} (${signal.observation}) — the BAZ floor is sub-1.5s. Inline critical CSS, self-host fonts, cut the render-blocking JS.`;
    case "unclear-cta":
      return `Rewrite the CTA at ${signal.location} to match intent (${signal.observation}) — "Start your free trial" beats "Submit" beats "Click here."`;
    case "no-proof":
      return `Add segment-matched proof at ${signal.location} (${signal.observation}) — a real case-study metric, not a logo wall.`;
    case "friction-copy":
      return `Run the "so what?" test on the copy at ${signal.location} (${signal.observation}) — every line must answer what the prospect gets, or get cut.`;
  }
}

/** The "so what?" — why this fix, not another. Includes the stat-power verdict. */
function prescribeRationale(signal: FrictionSignal, testRequired: boolean): string {
  const lift = LIFT_BY_TYPE[signal.type] ?? 4;
  const powerLine = testRequired
    ? `Sufficient conversions for an A/B test — validate before scaling.`
    : `Below stat-power threshold — ship direct. An underpowered test is confident nonsense; don't buy a testing tool you can't fill.`;
  return `${signal.type} at ${signal.location} carries a ~${lift}% conservative lift band. ${powerLine}`;
}

/** Render the full deliverable as markdown. */
function render(input: CROInput, fixes: CROFix[], biggestHole: string, totalLift: number): string {
  const replayLine = input.hasReplay
    ? `> ✅ Replay instrumented (Clarity/equivalent) — friction signals are observed, not guessed.`
    : `> ⚠️ No replay instrumented — install Microsoft Clarity (free, unlimited) before trusting these signals. Diagnostics without replays are guesses.`;

  const rows = fixes
    .map(
      (f) =>
        `| ${f.rank} | ${f.location} | ${f.fix} | +${f.expectedLiftPct}% | ${f.expectedMonthlyConversions ?? "—"} | ${f.effortHours}h | ${f.testRequired ? "A/B" : "ship"} | ${f.rationale} |`,
    )
    .join("\n");

  const valueLine = input.avgValue
    ? `**Average conversion value:** $${input.avgValue}`
    : ``;

  return `# CRO Prioritized Fix List — ${input.clientName}

**Monthly sessions:** ${input.monthlySessions.toLocaleString()}
**Baseline conversion rate:** ${(input.baselineRate * 100).toFixed(2)}%
${valueLine}
**Replay instrumented:** ${input.hasReplay ? "yes" : "no"}

${replayLine}

## Headline

The single biggest hole is **${biggestHole}**. Closing the top 3 fixes recovers the
majority of the conservative lift below — without changing ad spend, creative, or offer.

| Metric | Value |
|---|---|
| Total expected lift (conservative, non-additive) | **+${totalLift}%** |
| Fixes prioritized | ${fixes.length} |
| Fixes requiring A/B test | ${fixes.filter((f) => f.testRequired).length} |
| Fixes ship-direct (below stat power) | ${fixes.filter((f) => !f.testRequired).length} |

## Prioritized fixes (ranked by lift-per-effort-hour)

| # | Location | Fix | Expected lift | Est. conv/mo | Effort | Validate | Rationale |
|---|---|---|---|---|---|---|---|
${rows}

## Doctrine held
- Hopkins: the fix reduces friction — it doesn't add persuasion. Fix the funnel, don't shout louder.
- Wiebe: every fix passes the "so what?" test — if it doesn't answer what the prospect gets, cut it.
- Statistical power gate: below ~1k conversions/mo at a step, ship direct. An underpowered A/B test is worse than no test.
- The BAZ attribution diagnostic points you here — fix the tracking first, then the CRO fixes mean something.

> This is a *prioritized fix list*, not a heatmap. Hand this to the person who ships the fix,
> not the person who reads the dashboard.
`;
}

/** Build the full CRO output. */
export function buildCRO(input: CROInput): CROOutput {
  // Score each signal: lift / effort = lift-per-effort-hour. Rank desc.
  const scored = input.signals.map((s) => {
    const lift = LIFT_BY_TYPE[s.type] ?? 4;
    const effort = EFFORT_BY_LOCATION[s.location] ?? 4;
    return { signal: s, score: lift / effort };
  });
  scored.sort((a, b) => b.score - a.score);

  const fixes = scored.map((sc, i) => buildFix(sc.signal, input, i + 1));

  // Total lift: conservative non-additive sum (top 3 counted fully, rest at 50%).
  const totalLift = fixes.reduce((sum, f, i) => {
    const weight = i < 3 ? 1 : 0.5;
    return sum + f.expectedLiftPct * weight;
  }, 0);
  const totalLiftRounded = Math.round(totalLift * 10) / 10;

  const biggestHole = fixes[0]?.fix ?? "no signals — instrument Clarity first";

  const markdown = render(input, fixes, biggestHole, totalLiftRounded);

  return {
    clientName: input.clientName,
    monthlySessions: input.monthlySessions,
    baselineRate: input.baselineRate,
    hasReplay: input.hasReplay,
    biggestHole,
    fixes,
    totalExpectedLiftPct: totalLiftRounded,
    markdown,
  };
}

export { STAT_POWER_THRESHOLD };