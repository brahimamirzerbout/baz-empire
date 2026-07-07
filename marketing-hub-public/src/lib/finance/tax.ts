/**
 * Tax engine — pluggable per-jurisdiction tax rules.
 *
 * The engine stores rules in the `tax_codes` table. You add rules per
 * (country, region, kind) and the engine uses them when:
 *   - Calculating tax owed for a period
 *   - Computing payroll deductions
 *   - Notifying about upcoming due dates
 *
 * We ship with starter rules for US Federal, UK, and Switzerland.
 * Add more by inserting rows into tax_codes — the UI at /finance/taxes
 * has a + New rule button.
 *
 * Tax math is intentionally simple flat-rate for v1; progressive
 * brackets live in the `bracket` JSON column and the engine reads them
 * if present.
 */
import { db, uid, now } from "@/lib/db";

export type TaxKind =
  "income" | "payroll" | "sales" | "vat" | "gst" | "capital_gains" | "dividend" | "corporate";

// ────────────────────────────────────────────────────────────────────
// Seed defaults
// ────────────────────────────────────────────────────────────────────

export function seedDefaultTaxCodes(workspace = "default") {
  const t = now();
  const rules: Array<{ bracket: string; rate: number; type: string }> = [
    // United States — Federal
    {
      country: "US",
      region: null,
      kind: "corporate",
      code: "US-FED-CORP",
      label: "US Federal Corporate Income Tax (C-Corp)",
      rate: 0.21,
      applies_to: "net_income",
      due_day: 15,
      due_frequency: "quarterly",
    },
    {
      country: "US",
      region: null,
      kind: "payroll",
      code: "US-FICA",
      label: "US FICA (Social Security 6.2% + Medicare 1.45%)",
      rate: 0.0765,
      applies_to: "gross_wages",
      due_day: 15,
      due_frequency: "monthly",
    },
    {
      country: "US",
      region: null,
      kind: "payroll",
      code: "US-FUTA",
      label: "US FUTA (Federal Unemployment)",
      rate: 0.006,
      applies_to: "gross_wages",
      due_day: 31,
      due_frequency: "quarterly",
    },
    {
      country: "US",
      region: "CA",
      kind: "sales",
      code: "US-CA-SALES",
      label: "California Sales Tax",
      rate: 0.0725,
      applies_to: "tangible_sales",
      due_day: 15,
      due_frequency: "monthly",
    },
    {
      country: "US",
      region: "NY",
      kind: "sales",
      code: "US-NY-SALES",
      label: "New York State Sales Tax",
      rate: 0.04,
      applies_to: "tangible_sales",
      due_day: 20,
      due_frequency: "monthly",
    },
    {
      country: "US",
      region: null,
      kind: "capital_gains",
      code: "US-CG-LT",
      label: "US Long-term Capital Gains",
      rate: 0.2,
      applies_to: "lt_capital_gains",
      due_day: 15,
      due_frequency: "annual",
    },
    {
      country: "US",
      region: null,
      kind: "corporate",
      code: "US-SE-TAX",
      label: "US Self-Employment Tax",
      rate: 0.153,
      applies_to: "net_se_income",
      due_day: 15,
      due_frequency: "quarterly",
    },

    // United Kingdom
    {
      country: "GB",
      region: null,
      kind: "corporate",
      code: "GB-CORP",
      label: "UK Corporation Tax",
      rate: 0.25,
      applies_to: "net_income",
      due_day: 12,
      due_frequency: "quarterly",
    },
    {
      country: "GB",
      region: null,
      kind: "vat",
      code: "GB-VAT-STD",
      label: "UK VAT (Standard 20%)",
      rate: 0.2,
      applies_to: "vat_supplies",
      recoverable: 1,
      due_day: 7,
      due_frequency: "quarterly",
    },
    {
      country: "GB",
      region: null,
      kind: "vat",
      code: "GB-VAT-RED",
      label: "UK VAT (Reduced 5%)",
      rate: 0.05,
      applies_to: "vat_supplies_reduced",
      recoverable: 1,
      due_day: 7,
      due_frequency: "quarterly",
    },
    {
      country: "GB",
      region: null,
      kind: "payroll",
      code: "GB-PAYE",
      label: "UK PAYE / National Insurance (Employee 12%, Employer 13.8%)",
      rate: 0.138,
      applies_to: "gross_wages",
      due_day: 19,
      due_frequency: "monthly",
    },

    // Switzerland
    {
      country: "CH",
      region: null,
      kind: "corporate",
      code: "CH-FED-CORP",
      label: "Swiss Federal Corporate Tax",
      rate: 0.085,
      applies_to: "net_income",
      due_day: 31,
      due_frequency: "annual",
    },
    {
      country: "CH",
      region: "ZH",
      kind: "corporate",
      code: "CH-ZH-CORP",
      label: "Zurich Cantonal + Municipal Corporate Tax",
      rate: 0.069,
      applies_to: "net_income",
      due_day: 31,
      due_frequency: "annual",
    },
    {
      country: "CH",
      region: null,
      kind: "vat",
      code: "CH-VAT-STD",
      label: "Swiss VAT (Standard 8.1%)",
      rate: 0.081,
      applies_to: "vat_supplies",
      recoverable: 1,
      due_day: 15,
      due_frequency: "quarterly",
    },
    {
      country: "CH",
      region: null,
      kind: "vat",
      code: "CH-VAT-RED",
      label: "Swiss VAT (Reduced 2.6%)",
      rate: 0.026,
      applies_to: "vat_supplies_reduced",
      recoverable: 1,
      due_day: 15,
      due_frequency: "quarterly",
    },
    {
      country: "CH",
      region: null,
      kind: "payroll",
      code: "CH-AHV",
      label: "Swiss AHV/IV/EO (Employee + Employer ~10.6%)",
      rate: 0.106,
      applies_to: "gross_wages",
      due_day: 15,
      due_frequency: "monthly",
    },
    {
      country: "CH",
      region: null,
      kind: "capital_gains",
      code: "CH-CG-PRIV",
      label: "Swiss Private Capital Gains (Wealth Tax applies)",
      rate: 0.0,
      applies_to: "private_capital_gains",
      notes: "Generally exempt; cantons levy wealth tax annually instead.",
      due_day: 31,
      due_frequency: "annual",
    },

    // EU — generic
    {
      country: "EU",
      region: null,
      kind: "vat",
      code: "EU-VAT-STD",
      label: "EU Standard VAT (~21%, varies by country)",
      rate: 0.21,
      applies_to: "vat_supplies",
      recoverable: 1,
      due_day: 20,
      due_frequency: "monthly",
    },

    // Self-employment / freelancers (universal)
    {
      country: "US",
      region: null,
      kind: "income",
      code: "US-FED-INCOME",
      label: "US Federal Income Tax (estimate; brackets in `bracket`)",
      rate: 0.22,
      applies_to: "taxable_income",
      due_day: 15,
      due_frequency: "quarterly",
    },
    {
      country: "GB",
      region: null,
      kind: "income",
      code: "GB-INCOME-PA",
      label: "UK Income Tax (PAYE basic 20%)",
      rate: 0.2,
      applies_to: "taxable_income",
      due_day: 19,
      due_frequency: "monthly",
    },
  ];

  const insert = db.prepare(`
    INSERT OR IGNORE INTO tax_codes
      (id, workspace, country, region, kind, code, label, rate, applies_to, recoverable,
       due_day, due_frequency, active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);
  let count = 0;
  for (const r of rules) {
    const id = uid("tax_");
    const res = insert.run(
      id,
      workspace,
      r.country,
      r.region || null,
      r.kind,
      r.code,
      r.label,
      r.rate,
      r.applies_to || null,
      r.recoverable ? 1 : 0,
      r.due_day || null,
      r.due_frequency || null,
      t,
      t,
    );
    if (res.changes > 0) count++;
  }
  return count;
}

// ────────────────────────────────────────────────────────────────────
// Query helpers
// ────────────────────────────────────────────────────────────────────

export function listTaxCodes(opts: { workspace?: string; country?: string; kind?: string } = {}) {
  const ws = opts.workspace || "default";
  let sql = "SELECT * FROM tax_codes WHERE workspace = ?";
  const p: (string | number)[] = [ws];
  if (opts.country) {
    sql += " AND country = ?";
    p.push(opts.country);
  }
  if (opts.kind) {
    sql += " AND kind = ?";
    p.push(opts.kind);
  }
  sql += " ORDER BY country, kind, code";
  return db.prepare(sql).all(...p) as Record<string, unknown>[];
}

export function getTaxCode(id: string) {
  return db.prepare(`SELECT * FROM tax_codes WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
}

export function getTaxCodeByCode(code: string, workspace = "default") {
  return db
    .prepare(`SELECT * FROM tax_codes WHERE workspace = ? AND code = ?`)
    .get(workspace, code) as Record<string, unknown> | undefined;
}

// ────────────────────────────────────────────────────────────────────
// Tax math
// ────────────────────────────────────────────────────────────────────

export interface TaxCalcInput {
  workspace?: string;
  country: string;
  region?: string;
  kind: TaxKind;
  taxable_amount: number;
  /** Optional bracket JSON for progressive calculation. */
  bracket?: Record<string, unknown>;
  /** Override the rate instead of using the rule's stored rate. */
  rate_override?: number;
}

export interface TaxCalcResult {
  country: string;
  region?: string;
  kind: TaxKind;
  rule_code?: string;
  rule_label?: string;
  rate: number;
  taxable_amount: number;
  tax_owed: number;
  effective_rate: number;
  applied_brackets?: { up_to: number; rate: number; taxed: number }[];
}

export function calculateTax(input: TaxCalcInput): TaxCalcResult {
  const ws = input.workspace || "default";
  // Find a rule: prefer exact country+region, then country-only
  let rule = db
    .prepare(
      `SELECT * FROM tax_codes WHERE workspace = ? AND country = ? AND (region IS ? OR region = ?) AND kind = ? AND active = 1`,
    )
    .get(ws, input.country, input.region || null, input.region || null, input.kind) as Record<string, unknown> | undefined;

  if (!rule) {
    rule = db
      .prepare(
        `SELECT * FROM tax_codes WHERE workspace = ? AND country = ? AND kind = ? AND active = 1 ORDER BY region NULLS LAST LIMIT 1`,
      )
      .get(ws, input.country, input.kind) as Record<string, unknown> | undefined;
  }

  const rate = input.rate_override ?? rule?.rate ?? 0;
  let taxOwed = input.taxable_amount * rate;
  let appliedBrackets: unknown[] | undefined;

  // Progressive bracket support
  if (input.bracket && Array.isArray(input.bracket)) {
    appliedBrackets = [];
    let remaining = input.taxable_amount;
    let prevTop = 0;
    let totalTax = 0;
    for (const b of input.bracket) {
      const width =
        b.up_to === Infinity || b.up_to == null ? Infinity : Math.max(0, b.up_to - prevTop);
      const taxed = Math.min(remaining, width);
      const owed = taxed * b.rate;
      appliedBrackets.push({ up_to: b.up_to ?? Infinity, rate: b.rate, taxed });
      totalTax += owed;
      remaining -= taxed;
      prevTop = b.up_to ?? prevTop;
      if (remaining <= 0) break;
    }
    taxOwed = totalTax;
  }

  return {
    country: input.country,
    region: input.region,
    kind: input.kind,
    rule_code: rule?.code,
    rule_label: rule?.label,
    rate,
    taxable_amount: input.taxable_amount,
    tax_owed: Math.round(taxOwed * 100) / 100,
    effective_rate: input.taxable_amount > 0 ? taxOwed / input.taxable_amount : 0,
    applied_brackets: appliedBrackets,
  };
}

// ────────────────────────────────────────────────────────────────────
// Due dates + filings
// ────────────────────────────────────────────────────────────────────

export function dueDatesThisMonth(
  workspace = "default",
  opts: { country?: string; withinDays?: number } = {},
) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const fromMs = Date.UTC(year, month, 1);
  const withinDays = opts.withinDays ?? 60;
  const toMs = fromMs + withinDays * 86400 * 1000;

  const codes = listTaxCodes({ workspace, country: opts.country });
  const today = now.getUTCDate();

  const upcoming: Record<string, unknown>[] = [];
  for (const c of codes) {
    if (!c.due_day || !c.due_frequency) continue;
    const dates: number[] = [];
    if (c.due_frequency === "monthly") {
      // Due day this month, next month
      for (let m = 0; m < 2; m++) {
        const d = new Date(Date.UTC(year, month + m, Math.min(c.due_day, 28)));
        dates.push(d.getTime());
      }
    } else if (c.due_frequency === "quarterly") {
      // Q end months: Mar, Jun, Sep, Dec (15th)
      const qEndMonths = [2, 5, 8, 11];
      for (const m of qEndMonths) {
        const d = new Date(Date.UTC(year, m, Math.min(c.due_day, 28)));
        dates.push(d.getTime());
      }
    } else if (c.due_frequency === "annual") {
      // April 15 in US / Jan 31 in CH / Jan 31 in UK etc — uses due_day + month
      // Heuristic: April (month 3) for US-style annual
      const months = c.country === "CH" ? [2] : c.country === "GB" ? [0] : [3];
      for (const m of months) {
        const d = new Date(Date.UTC(year, m, Math.min(c.due_day || 15, 28)));
        dates.push(d.getTime());
      }
    }
    for (const due of dates) {
      if (due >= fromMs && due <= toMs) {
        const daysAway = Math.round((due - now.getTime()) / 86400 / 1000);
        upcoming.push({
          tax_code_id: c.id,
          country: c.country,
          region: c.region,
          kind: c.kind,
          label: c.label,
          rate: c.rate,
          due_date: due,
          days_away: daysAway,
          overdue: daysAway < 0,
        });
      }
    }
  }
  // Sort by due date
  upcoming.sort((a, b) => a.due_date - b.due_date);
  return upcoming;
}

export function listFilings(opts: { workspace?: string; status?: string; limit?: number } = {}) {
  const ws = opts.workspace || "default";
  let sql = `SELECT f.*, c.label AS tax_label, c.country, c.kind, c.code AS tax_code
    FROM tax_filings f JOIN tax_codes c ON c.id = f.tax_code_id
    WHERE f.workspace = ?`;
  const p: (string | number)[] = [ws];
  if (opts.status) {
    sql += " AND f.status = ?";
    p.push(opts.status);
  }
  sql += " ORDER BY f.due_date ASC LIMIT ?";
  return db.prepare(sql).all(...p, opts.limit || 100) as Record<string, unknown>[];
}

export function createFiling(input: {
  workspace?: string;
  tax_code_id: string;
  period_start: number;
  period_end: number;
  due_date: number;
  taxable_amount: number;
  tax_owed: number;
  currency?: string;
}): string {
  const id = uid("fil_");
  const t = now();
  db.prepare(
    `
    INSERT INTO tax_filings (id, workspace, tax_code_id, period_start, period_end, due_date,
      taxable_amount, tax_owed, currency, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
  `,
  ).run(
    id,
    input.workspace || "default",
    input.tax_code_id,
    input.period_start,
    input.period_end,
    input.due_date,
    input.taxable_amount,
    input.tax_owed,
    input.currency || "USD",
    t,
    t,
  );
  return id;
}

// ────────────────────────────────────────────────────────────────────
// Law updates
// ────────────────────────────────────────────────────────────────────

export function listLawUpdates(
  opts: { country?: string; severity?: string; onlyUnacknowledged?: boolean; limit?: number } = {},
) {
  let sql = "SELECT * FROM tax_law_updates WHERE 1=1";
  const p: Record<string, unknown>[] = [];
  if (opts.country) {
    sql += " AND country = ?";
    p.push(opts.country);
  }
  if (opts.severity) {
    sql += " AND severity = ?";
    p.push(opts.severity);
  }
  if (opts.onlyUnacknowledged) {
    sql += " AND acknowledged = 0";
  }
  sql += " ORDER BY published_at DESC LIMIT ?";
  return db.prepare(sql).all(...p, opts.limit || 50) as Record<string, unknown>[];
}

export function addLawUpdate(input: {
  country: string;
  region?: string;
  kind: string;
  title: string;
  summary: string;
  source_url?: string;
  effective_date: number;
  published_at: number;
  severity?: string;
}): string {
  const id = uid("law_");
  db.prepare(
    `
    INSERT INTO tax_law_updates (id, country, region, kind, title, summary, source_url,
      effective_date, published_at, severity, acknowledged, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
  `,
  ).run(
    id,
    input.country,
    input.region || null,
    input.kind,
    input.title,
    input.summary,
    input.source_url || null,
    input.effective_date,
    input.published_at,
    input.severity || "info",
    now(),
  );
  return id;
}

export function acknowledgeLawUpdate(id: string) {
  db.prepare(`UPDATE tax_law_updates SET acknowledged = 1 WHERE id = ?`).run(id);
}

// Seed a few illustrative law updates so the notifier UI has something to show
export function seedLawUpdates() {
  const t = Date.now();
  const samples = [
    {
      country: "US",
      kind: "corporate",
      title: "IRS announces 2026 corporate tax brackets unchanged",
      summary:
        "The 21% federal corporate income tax rate remains in effect for 2026. State-level adjustments vary.",
      effective_date: t + 30 * 86400_000,
      published_at: t,
      severity: "info",
    },
    {
      country: "GB",
      kind: "vat",
      title: "UK VAT threshold frozen at £90,000 for 2026-27",
      summary:
        "The VAT registration threshold remains at £90,000 of taxable turnover. Businesses approaching the threshold should plan for registration.",
      effective_date: t + 60 * 86400_000,
      published_at: t,
      severity: "info",
    },
    {
      country: "CH",
      kind: "vat",
      title: "Swiss federal VAT rate confirmed at 8.1%",
      summary:
        "Confirms standard rate 8.1%, reduced 2.6%, lodging 3.8%. No rate change scheduled for 2026.",
      effective_date: t + 5 * 86400_000,
      published_at: t,
      severity: "info",
    },
    {
      country: "US",
      kind: "payroll",
      title: "2026 Social Security wage base projected to rise to $168,600",
      summary:
        "Estimated 2026 Social Security wage base increases from $168,600 to ~$175,000. Plan payroll withholdings accordingly.",
      effective_date: t + 90 * 86400_000,
      published_at: t,
      severity: "warning",
    },
  ];
  for (const s of samples) addLawUpdate(s);
  return samples.length;
}
