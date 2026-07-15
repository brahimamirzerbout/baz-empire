/**
 * Report loader + types. Mirrors the DiagnosticReport shape emitted by baz-moat --json.
 * In production this reads from Supabase; here it loads a local JSON for the static
 * dashboard. The shape is the contract between the moat engine and the dashboard.
 */

export interface LeakResult {
  componentId: string;
  label: string;
  status: "present" | "partial" | "missing" | "broken";
  effectiveFraction: number;
  monthlyLeak: number;
  annualLeak: number;
  gdprRelevant: boolean;
}

export interface DiagnosticReport {
  clientName: string;
  generatedAt: string;
  primaryChannel: string;
  markets: string[];
  monthlyAttributedRevenue: number;
  totalMonthlyLeak: number;
  totalAnnualLeak: number;
  guaranteeMet: boolean;
  auditFee: number;
  leaks: LeakResult[];
  gdprFlags: LeakResult[];
}

import sample from "../data/sample-report.json" with { type: "json" };

export function getReport(): DiagnosticReport {
  return sample as DiagnosticReport;
}

export function usd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}