/**
 * BAZ Revenue Attribution Diagnostic — core types.
 *
 * The diagnostic audits a client's tracking setup against the BAZ Tracking Default
 * (the canonical checklist), computes the estimated revenue leak from each gap,
 * and emits a markdown report + 90-day plan.
 *
 * Lineage: Hopkins (keyed returns / test campaign) + Ogilvy (research discipline)
 * + Schwartz (mechanism in saturated markets) + L.E.K. moat #1 (proprietary tech).
 */

/** A single component of the BAZ Tracking Default. */
export interface TrackingComponent {
  /** Stable id, e.g. "ssgtm", "ga4", "capi-meta". */
  id: string;
  /** Human label. */
  label: string;
  /** What this component does, in operator language. */
  purpose: string;
  /**
   * Estimated fraction of attributed revenue typically lost when this component is
   * MISSING or broken. Conservative, industry-report-derived (Promethean/Starr/Foxwell).
   * 0.0–1.0. The diagnostic multiplies this by the client's monthly attributed
   * revenue to estimate the monthly leak.
   */
  leakFraction: number;
  /** GDPR-relevant: true if missing this raises a compliance risk in EU markets. */
  gdprRelevant?: boolean;
}

/** A client's current state on a given component, as observed during the audit. */
export type ComponentStatus =
  | "present" // implemented and verified firing
  | "partial" // present but incomplete / unverified
  | "missing" // not implemented
  | "broken"; // implemented but confirmed not firing / misconfigured

/** One row of the audit: the component + the client's observed status + notes. */
export interface AuditFinding {
  componentId: string;
  status: ComponentStatus;
  evidence?: string;
}

/** The client context needed to estimate $ leak. */
export interface ClientContext {
  clientName: string;
  /** Average monthly revenue attributed to paid/marketing (USD). */
  monthlyAttributedRevenue: number;
  /** Primary paid channel, e.g. "meta", "google", "tiktok", "linkedin". */
  primaryChannel: string;
  /** Markets served — used to flag GDPR relevance. */
  markets: ("MENA" | "EU" | "US")[];
  /** Optional: average order value / customer LTV, for payback framing. */
  avgOrderValue?: number;
}

/** The full audit input: client context + findings per component. */
export interface AuditInput {
  client: ClientContext;
  findings: AuditFinding[];
}

/** A computed leak for one component. */
export interface LeakResult {
  componentId: string;
  label: string;
  status: ComponentStatus;
  /** Effective leak fraction applied (0 if present, reduced if partial). */
  effectiveFraction: number;
  /** Estimated monthly $ leak. */
  monthlyLeak: number;
  /** Annualized. */
  annualLeak: number;
  gdprRelevant: boolean;
}

/** The diagnostic output. */
export interface DiagnosticReport {
  clientName: string;
  generatedAt: string;
  primaryChannel: string;
  markets: string[];
  monthlyAttributedRevenue: number;
  totalMonthlyLeak: number;
  totalAnnualLeak: number;
  /** True if total annual leak >= 10x the audit fee → guarantee met. */
  guaranteeMet: boolean;
  /** The audit fee used for the guarantee test. */
  auditFee: number;
  leaks: LeakResult[];
  gdprFlags: LeakResult[];
  /** Markdown report body. */
  markdown: string;
  /** 90-day plan markdown. */
  plan: string;
}