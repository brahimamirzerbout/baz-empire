/**
 * Report + 90-day plan generator. Emits operator-grade markdown.
 *
 * Voice: senior, precise, numbers-first. Hopkins/Ogilvy test-and-prove lineage.
 * Wiebe microcopy discipline: every line answers "so what?"
 */

import type { AuditInput, DiagnosticReport, LeakResult } from "./types.js";
import { runAudit, DEFAULT_AUDIT_FEE } from "./audit.js";

function usd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function statusGlyph(status: LeakResult["status"]): string {
  switch (status) {
    case "present":
      return "✅";
    case "partial":
      return "🟡";
    case "missing":
      return "❌";
    case "broken":
      return "⚠️";
  }
}

/** Generate the leak table + headline numbers in markdown. */
function renderMarkdown(
  input: AuditInput,
  auditFee: number,
  result: ReturnType<typeof runAudit>,
): string {
  const { client } = input;
  const rows = result.leaks
    .map((l) => {
      const leak = l.effectiveFraction > 0 ? usd(l.annualLeak) : "—";
      return `| ${statusGlyph(l.status)} | ${l.label} | ${l.status} | ${pct(l.effectiveFraction)} | ${leak} |`;
    })
    .join("\n");

  const gdpr = client.markets.includes("EU");
  const gdprLine = gdpr
    ? `> 🇪🇺 EU market detected — consent + consent-mode are **non-optional** (GDPR).`
    : `> No EU market in scope — consent still recommended for TCPA/CA compliance.`;

  const guaranteeLine = result.guaranteeMet
    ? `> ✅ **Guarantee met:** estimated annual leak (${usd(result.totalAnnual)}) ≥ 10× audit fee (${usd(auditFee)}). You pay.`
    : `> ⚠️ **Guarantee not met by estimate** (${usd(result.totalAnnual)} < 10× fee). Per BAZ terms: you don't pay the audit fee. BAZ still delivers the 90-day plan.`;

  return `# Revenue Attribution Diagnostic — ${client.clientName}

**Generated:** ${new Date().toISOString()}
**Primary paid channel:** ${client.primaryChannel}
**Markets:** ${client.markets.join(", ")}
**Monthly attributed revenue (baseline):** ${usd(client.monthlyAttributedRevenue)}

${gdprLine}

## Headline

| Metric | Value |
|---|---|
| Estimated monthly revenue leak | **${usd(result.totalMonthly)}** |
| Estimated annual revenue leak | **${usd(result.totalAnnual)}** |
| Audit fee | ${usd(auditFee)} |
| 10× guarantee | ${result.guaranteeMet ? "MET" : "NOT MET — fee waived"} |

${guaranteeLine}

## Tracking Default audit

| | Component | Status | Effective leak | Annual $ |
|---|---|---|---|---|
${rows}

**Reading the table:** "present" = verified firing, 0 leak. "partial" = present but
incomplete, half the risk remains. "missing"/"broken" = full estimated leak applied.
Leak fractions are conservative, industry-report-derived and **[composite — to be
replaced with BAZ empirical data after the first 10 diagnostics]**.

## What this means

The single biggest hole is **${result.leaks[0]?.label ?? "n/a"}**
(${usd(result.leaks[0]?.annualLeak ?? 0)}/yr). Closing the top 3 typically recovers
**${pct(recoveryShare(result, 3))}** of the estimated annual leak — without changing
ad spend, creative, or offer.

> BAZ doctrine: revenue not vanity. We instrument first, then grow. The 90-day plan
> below sequences the fixes by $ impact.
`;
}

function recoveryShare(result: ReturnType<typeof runAudit>, topN: number): number {
  if (result.totalAnnual === 0) return 0;
  const top = result.leaks.slice(0, topN).reduce((s, l) => s + l.annualLeak, 0);
  return top / result.totalAnnual;
}

/** Generate the 90-day plan, sequenced by $ impact (biggest leak first). */
function renderPlan(
  input: AuditInput,
  result: ReturnType<typeof runAudit>,
): string {
  const actionable = result.leaks.filter((l) => l.effectiveFraction > 0);
  if (actionable.length === 0) {
    return `# 90-Day Plan — ${input.client.clientName}

No actionable leaks detected — the tracking default is fully implemented and verified.
Recommended next step: shift budget from audit to growth (paid scaling or CRO).
`;
  }

  const phases = partition(actionable, [0, 2]); // days 0-30, 31-60, 61-90
  const phaseRows = (items: LeakResult[], days: string) =>
    items
      .map(
        (l) =>
          `  - [ ] Fix **${l.label}** — recovers ~${usd(l.annualLeak)}/yr (${pct(l.effectiveFraction)} effective leak)`,
      )
      .join("\n");

  return `# 90-Day Plan — ${input.client.clientName}

Sequenced by $ impact. Each fix has a named owner (BAZ) + an exit criterion
(measurable: the component status moves to "present" and the leak drops to 0).

## Days 0–30 — instrument the biggest holes
${phaseRows(phases[0], "0-30")}

**Exit criterion:** top-2 leaks closed; estimated monthly leak reduced by ≥50%.

## Days 31–60 — close the mid-tier gaps
${phaseRows(phases[1], "31-60")}

**Exit criterion:** estimated annual leak ≤ ${usd(Math.round(result.totalAnnual * 0.2))} (80% reduction).

## Days 61–90 — institutionalize + hand off
${phaseRows(phases[2], "61-90")}

**Exit criterion:**
  - [ ] BAZ Tracking Default fully "present" on the live dashboard
  - [ ] Client team trained on reading the revenue-not-vanity report
  - [ ] Decision: convert to Core/Growth retainer or hand off

> Next logical yes (Deiss lifecycle): the diagnostic → retainer. BAZ's offer:
> Core ($6.5–9.5k/mo, one channel) or Growth ($18–28k/mo, full integrated stack).
`;
}

/** Partition an array into groups by index thresholds [end0, end1, ...]. */
function partition<T>(items: readonly T[], thresholds: readonly [number, number]): [T[], T[], T[]] {
  const groups: [T[], T[], T[]] = [[], [], []];
  const [end0, end1] = thresholds;
  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    if (i <= end0) groups[0].push(item);
    else if (i <= end1) groups[1].push(item);
    else groups[2].push(item);
  }
  return groups;
}

/** Build the full DiagnosticReport from an audit input. */
export function buildReport(
  input: AuditInput,
  auditFee: number = DEFAULT_AUDIT_FEE,
): DiagnosticReport {
  const result = runAudit(input, auditFee);
  const markdown = renderMarkdown(input, auditFee, result);
  const plan = renderPlan(input, result);
  return {
    clientName: input.client.clientName,
    generatedAt: new Date().toISOString(),
    primaryChannel: input.client.primaryChannel,
    markets: input.client.markets,
    monthlyAttributedRevenue: input.client.monthlyAttributedRevenue,
    totalMonthlyLeak: result.totalMonthly,
    totalAnnualLeak: result.totalAnnual,
    guaranteeMet: result.guaranteeMet,
    auditFee,
    leaks: result.leaks,
    gdprFlags: result.leaks.filter((l) => l.gdprRelevant && l.effectiveFraction > 0),
    markdown,
    plan,
  };
}