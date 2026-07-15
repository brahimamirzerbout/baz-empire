/**
 * Audit engine: maps observed component statuses to effective leak fractions
 * and computes per-component + total $ leak.
 *
 * Effective fraction by status:
 *   present  -> 0      (verified firing; no leak)
 *   partial  -> leakFraction * 0.5   (present but incomplete; half the leak remains)
 *   missing  -> leakFraction         (full leak)
 *   broken   -> leakFraction         (treated as missing for leak math)
 */

import type {
  AuditFinding,
  AuditInput,
  ComponentStatus,
  LeakResult,
} from "./types.js";
import { TRACKING_DEFAULT, getComponent } from "./tracking-default.js";

const EFFECTIVE_FACTOR: Record<ComponentStatus, number> = {
  present: 0,
  partial: 0.5,
  missing: 1,
  broken: 1,
};

/** The default audit fee used for the 10x guarantee test (USD). */
export const DEFAULT_AUDIT_FEE = 5000;

export function effectiveFraction(
  leakFraction: number,
  status: ComponentStatus,
): number {
  return leakFraction * EFFECTIVE_FACTOR[status];
}

/** Compute a single LeakResult from a finding + the client's attributed revenue. */
export function computeLeak(
  finding: AuditFinding,
  monthlyAttributedRevenue: number,
): LeakResult | undefined {
  const comp = getComponent(finding.componentId);
  if (!comp) return undefined; // unknown component id — skip, don't crash
  const effectiveFractionValue = effectiveFraction(comp.leakFraction, finding.status);
  const monthlyLeak = monthlyAttributedRevenue * effectiveFractionValue;
  return {
    componentId: comp.id,
    label: comp.label,
    status: finding.status,
    effectiveFraction: effectiveFractionValue,
    monthlyLeak,
    annualLeak: monthlyLeak * 12,
    gdprRelevant: comp.gdprRelevant === true,
  };
}

export interface AuditResult {
  leaks: LeakResult[];
  totalMonthly: number;
  totalAnnual: number;
  guaranteeMet: boolean;
}

/**
 * Audit the full input. Every component in the BAZ Tracking Default appears in the
 * output — components not reported in findings are treated as "missing".
 * Leaks are sorted by annual leak descending (biggest hole first).
 */
export function runAudit(
  input: AuditInput,
  auditFee: number = DEFAULT_AUDIT_FEE,
): AuditResult {
  const byId = new Map(input.findings.map((f) => [f.componentId, f]));
  const leaks: LeakResult[] = [];

  for (const comp of TRACKING_DEFAULT) {
    const finding: AuditFinding = byId.get(comp.id) ?? {
      componentId: comp.id,
      status: "missing",
    };
    const r = computeLeak(finding, input.client.monthlyAttributedRevenue);
    if (r) leaks.push(r);
  }

  leaks.sort((a, b) => b.annualLeak - a.annualLeak);

  const totalMonthly = leaks.reduce((s, l) => s + l.monthlyLeak, 0);
  const totalAnnual = totalMonthly * 12;

  return {
    leaks,
    totalMonthly,
    totalAnnual,
    guaranteeMet: totalAnnual >= auditFee * 10,
  };
}