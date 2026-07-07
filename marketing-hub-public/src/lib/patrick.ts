/**
 * Patrick's Number — the single metric that tells you if the business is
 * winning or losing TODAY. Plus the unit economics PBD would demand.
 *
 * The philosophy: pipeline is hope. Cash is truth. If you can't name the
 * dollars collected this month, you don't have a business — you have a
 * spreadsheet of intentions.
 *
 * What Patrick Bet-David would inspect in 30 seconds:
 *   1. Cash collected this month
 *   2. MRR added / churned
 *   3. CAC, LTV, payback period
 *   4. Sales velocity
 *   5. Top 3 risks
 *   6. Top 3 leverage wins
 */
import { db } from "@/lib/db";

const MS_DAY = 86400000;

export interface PatrickReport {
  generatedAt: string;
  period: { from: number; to: number; label: string };
  cash: {
    collectedThisMonth: number;
    collectedLastMonth: number;
    delta: number;
    deltaPct: number;
    dailyAverage: number;
    daysToTarget: number | null; // if a monthly target is set
  };
  pipeline: {
    activeValue: number;
    weightedValue: number;
    wonThisMonth: number;
    lostThisMonth: number;
    winRate: number; // won / (won + lost)
    avgDealSize: number;
    avgCycleDays: number;
  };
  mrr: {
    addedThisMonth: number;
    churnedThisMonth: number;
    net: number;
    currentMrr: number;
    arr: number;
  };
  unitEconomics: {
    cac: number; // cost to acquire a customer
    ltv: number; // lifetime value
    ltvCacRatio: number;
    paybackMonths: number | null;
    grossMargin: number; // 0..1
  };
  velocity: {
    dealsPerDay: number;
    revenuePerDay: number;
    pipelineCoverage: number; // pipeline / quarterly target
  };
  risks: Array<{ severity: "high" | "med" | "low"; title: string; why: string; action: string }>;
  leverage: Array<{ title: string; metric: string; why: string }>;
  score: {
    overall: number; // 0..100, Patrick's verdict
    cash: number;
    growth: number;
    efficiency: number;
    risk: number;
  };
}

function ymKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
function startOfMonth(ts: number): number {
  const d = new Date(ts);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
}
function startOfPrevMonth(ts: number): number {
  const d = new Date(ts);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1);
}

export function patrickReport(): PatrickReport {
  const now = Date.now();
  const monthStart = startOfMonth(now);
  const prevMonthStart = startOfPrevMonth(now);

  /* ───── Cash ───── */
  const cashRows = db
    .prepare(`SELECT amount, occurred_at, kind FROM revenue_events`)
    .all() as Record<string, unknown>[];
  const collectedThisMonth = cashRows
    .filter((r) => r.occurred_at >= monthStart)
    .reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const collectedLastMonth = cashRows
    .filter((r) => r.occurred_at >= prevMonthStart && r.occurred_at < monthStart)
    .reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const dayOfMonth = new Date(now).getUTCDate();
  const dailyAverage = dayOfMonth > 0 ? collectedThisMonth / dayOfMonth : 0;
  const delta = collectedThisMonth - collectedLastMonth;
  const deltaPct = collectedLastMonth > 0 ? (delta / collectedLastMonth) * 100 : 0;

  /* ───── Pipeline ───── */
  const deals = db.prepare(`SELECT * FROM deals`).all() as Record<string, unknown>[];
  const active = deals.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const won = deals.filter((d) => d.stage === "won");
  const lost = deals.filter((d) => d.stage === "lost");
  const wonThisMonth = won.filter((d) => (d.won_at || d.updated_at) >= monthStart);
  const lostThisMonth = lost.filter((d) => (d.lost_at || d.updated_at) >= monthStart);
  const activeValue = active.reduce((s, d) => s + (Number(d.value) || 0), 0);
  const weightedValue = active.reduce(
    (s, d) => s + ((Number(d.value) || 0) * (Number(d.probability) || 0)) / 100,
    0,
  );
  const winRate =
    won.length + lost.length > 0 ? (won.length / (won.length + lost.length)) * 100 : 0;
  const avgDealSize =
    won.length > 0 ? won.reduce((s, d) => s + (Number(d.value) || 0), 0) / won.length : 0;
  const cycleDays =
    won.length > 0
      ? won.reduce((s, d) => s + ((d.won_at || d.updated_at) - d.created_at) / MS_DAY, 0) /
        won.length
      : 0;

  /* ───── MRR ───── */
  const recurring = cashRows.filter(
    (r) => r.kind === "recurring_first" || r.kind === "recurring_renewal",
  );
  const mrrAddedThisMonth = recurring
    .filter((r) => r.occurred_at >= monthStart)
    .reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const mrrChurnedThisMonth = cashRows
    .filter((r) => r.kind === "refund" && r.occurred_at >= monthStart)
    .reduce((s, r) => s + Math.abs(Number(r.amount) || 0), 0);
  const currentMrr = recurring.reduce((s, r) => s + (Number(r.amount) || 0), 0); // simplified: sum of all recurring events
  const mrrNet = mrrAddedThisMonth - mrrChurnedThisMonth;

  /* ───── Unit economics ───── */
  const totalCost = deals.reduce((s, d) => s + (Number(d.cost_to_acquire) || 0), 0);
  const totalCustomers = won.length || 1;
  const cac = totalCost / totalCustomers;
  const ltv =
    avgDealSize *
    (won.length > 0
      ? 1 +
        collectedThisMonth /
          Math.max(
            1,
            wonThisMonth.reduce((s, d) => s + (Number(d.value) || 0), 0),
          )
      : 1);
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  const grossMargin = 0.75; // assumption — make configurable
  const paybackMonths =
    cac / Math.max(1, mrrAddedThisMonth / Math.max(1, wonThisMonth.length)) || 0;

  /* ───── Velocity ───── */
  const daysInMonth = 30;
  const dealsPerDay = wonThisMonth.length / daysInMonth;
  const revenuePerDay = dailyAverage;

  /* ───── Risks & Leverage ───── */
  const risks: PatrickReport["risks"] = [];
  const leverage: PatrickReport["leverage"] = [];

  if (collectedThisMonth < collectedLastMonth && collectedLastMonth > 0) {
    risks.push({
      severity: "high",
      title: "Cash down vs last month",
      why: `$${Math.round(collectedThisMonth).toLocaleString()} vs $${Math.round(collectedLastMonth).toLocaleString()} (${deltaPct.toFixed(1)}%)`,
      action: "Open Re-engagement list in CRM. Call 3 stale deals today.",
    });
  }
  if (lostThisMonth.length > wonThisMonth.length && lostThisMonth.length > 0) {
    risks.push({
      severity: "high",
      title: "Losing more than winning",
      why: `${lostThisMonth.length} lost vs ${wonThisMonth.length} won this month`,
      action: "Audit lost reasons. Find the top objection. Write the kill-it response.",
    });
  }
  if (ltvCacRatio > 0 && ltvCacRatio < 3) {
    risks.push({
      severity: ltvCacRatio < 1.5 ? "high" : "med",
      title: "LTV/CAC under 3",
      why: `Ratio ${ltvCacRatio.toFixed(2)} — business not self-funding`,
      action: "Either raise prices 20% or cut the highest-CAC channel.",
    });
  }
  if (activeValue > 0 && weightedValue / activeValue < 0.25) {
    risks.push({
      severity: "med",
      title: "Pipeline weighted low",
      why: `Weighted $${Math.round(weightedValue).toLocaleString()} of $${Math.round(activeValue).toLocaleString()} active`,
      action: "Force-rank deals. Move 5 to closed-won or closed-lost this week.",
    });
  }
  if (cashRows.length === 0 && won.length > 0) {
    risks.push({
      severity: "high",
      title: "Won deals but no cash logged",
      why: `${won.length} deals marked won but 0 revenue events recorded`,
      action: "Add revenue events for every won deal. Cash is truth, not stage.",
    });
  }

  if (wonThisMonth.length > 0 && avgDealSize > 0) {
    leverage.push({
      title: "Wins this month are real revenue",
      metric: `$${Math.round(wonThisMonth.reduce((s, d) => s + (Number(d.value) || 0), 0)).toLocaleString()}`,
      why: `${wonThisMonth.length} deals closed, avg $${Math.round(avgDealSize).toLocaleString()}`,
    });
  }
  if (mrrNet > 0) {
    leverage.push({
      title: "MRR is growing",
      metric: `+$${Math.round(mrrNet).toLocaleString()}/mo`,
      why: `Recurring revenue beats one-time every time`,
    });
  }
  if (activeValue > 0 && wonThisMonth.length > 0) {
    leverage.push({
      title: "Pipeline is producing",
      metric: `${activeValue > 0 ? Math.round(activeValue / wonThisMonth.reduce((s, d) => s + (Number(d.value) || 0), 0) || 1) : 0}x coverage`,
      why: "Active pipeline covers your wins — momentum is real",
    });
  }
  if (dealsPerDay > 0.3) {
    leverage.push({
      title: "Sales velocity is alive",
      metric: `${dealsPerDay.toFixed(2)} deals/day`,
      why: "Compounding daily wins > occasional big closes",
    });
  }

  /* ───── Score ───── */
  const cashScore = Math.min(100, (collectedThisMonth / Math.max(1, collectedLastMonth || 1)) * 50);
  const growthScore = Math.min(100, mrrNet > 0 ? 70 + mrrNet / 100 : 40);
  const efficiencyScore = Math.min(100, Math.max(0, (ltvCacRatio / 3) * 100));
  const riskScore = Math.max(0, 100 - risks.length * 25);
  const overall = Math.round(
    cashScore * 0.4 + growthScore * 0.25 + efficiencyScore * 0.2 + riskScore * 0.15,
  );

  return {
    generatedAt: new Date(now).toISOString(),
    period: {
      from: monthStart,
      to: now,
      label: new Date(now).toLocaleString("en-US", { month: "long", year: "numeric" }),
    },
    cash: {
      collectedThisMonth: Math.round(collectedThisMonth),
      collectedLastMonth: Math.round(collectedLastMonth),
      delta: Math.round(delta),
      deltaPct: Math.round(deltaPct * 10) / 10,
      dailyAverage: Math.round(dailyAverage),
      daysToTarget: null,
    },
    pipeline: {
      activeValue: Math.round(activeValue),
      weightedValue: Math.round(weightedValue),
      wonThisMonth: wonThisMonth.length,
      lostThisMonth: lostThisMonth.length,
      winRate: Math.round(winRate * 10) / 10,
      avgDealSize: Math.round(avgDealSize),
      avgCycleDays: Math.round(cycleDays),
    },
    mrr: {
      addedThisMonth: Math.round(mrrAddedThisMonth),
      churnedThisMonth: Math.round(mrrChurnedThisMonth),
      net: Math.round(mrrNet),
      currentMrr: Math.round(currentMrr),
      arr: Math.round(currentMrr * 12),
    },
    unitEconomics: {
      cac: Math.round(cac),
      ltv: Math.round(ltv),
      ltvCacRatio: Math.round(ltvCacRatio * 100) / 100,
      paybackMonths: isFinite(paybackMonths) ? Math.round(paybackMonths * 10) / 10 : null,
      grossMargin,
    },
    velocity: {
      dealsPerDay: Math.round(dealsPerDay * 100) / 100,
      revenuePerDay: Math.round(revenuePerDay),
      pipelineCoverage:
        Math.round((activeValue / Math.max(1, avgDealSize * wonThisMonth.length * 3)) * 100) / 100,
    },
    risks,
    leverage,
    score: {
      overall,
      cash: Math.round(cashScore),
      growth: Math.round(growthScore),
      efficiency: Math.round(efficiencyScore),
      risk: Math.round(riskScore),
    },
  };
}

/** Render as plain text for the morning ritual. */
export function patrickReportText(r: PatrickReport): string {
  return [
    `THE PATRICK NUMBER — ${r.period.label}`,
    ``,
    `Cash collected:        $${r.cash.collectedThisMonth.toLocaleString()}  (${r.cash.delta >= 0 ? "+" : ""}${r.cash.deltaPct}% vs last month)`,
    `Daily average:         $${r.cash.dailyAverage.toLocaleString()}/day`,
    ``,
    `Active pipeline:       $${r.pipeline.activeValue.toLocaleString()}  (weighted $${r.pipeline.weightedValue.toLocaleString()})`,
    `Won this month:        ${r.pipeline.wonThisMonth}   Lost: ${r.pipeline.lostThisMonth}   Win rate: ${r.pipeline.winRate}%`,
    `Avg deal size:         $${r.pipeline.avgDealSize.toLocaleString()}   Cycle: ${r.pipeline.avgCycleDays}d`,
    ``,
    `MRR added:             $${r.mrr.addedThisMonth.toLocaleString()}`,
    `MRR churned:           $${r.mrr.churnedThisMonth.toLocaleString()}`,
    `Net MRR:               ${r.mrr.net >= 0 ? "+" : ""}$${r.mrr.net.toLocaleString()}/mo`,
    `Current MRR:           $${r.mrr.currentMrr.toLocaleString()}   ARR: $${r.mrr.arr.toLocaleString()}`,
    ``,
    `CAC:                   $${r.unitEconomics.cac.toLocaleString()}`,
    `LTV:                   $${r.unitEconomics.ltv.toLocaleString()}`,
    `LTV/CAC:               ${r.unitEconomics.ltvCacRatio}x   (target: ≥3x)`,
    `Payback:               ${r.unitEconomics.paybackMonths} months`,
    ``,
    `Verdict:               ${r.score.overall}/100  (cash ${r.score.cash} · growth ${r.score.growth} · efficiency ${r.score.efficiency} · risk ${r.score.risk})`,
    ``,
    ...r.risks.map((x) => `RISK [${x.severity.toUpperCase()}] ${x.title} — ${x.action}`),
    ...r.leverage.map((x) => `LEVERAGE ${x.title} — ${x.metric}`),
  ].join("\n");
}
