/**
 * Payroll — gross → tax → net.
 *
 * Run flow:
 *   1. Pick a period (e.g. 2026-01-01 → 2026-01-31)
 *   2. Pull all active employees
 *   3. Calculate gross for each based on pay_frequency
 *   4. Apply per-employee tax jurisdiction
 *   5. Sum into a payroll_run + payroll_lines
 *   6. On approval, write a single balanced journal entry covering all lines
 */

import { db, uid, now } from "@/lib/db";
import { calculateTax } from "./tax";
import { createJournalEntry } from "./accounting";

export function listEmployees(workspace = "default") {
  return db
    .prepare(`SELECT * FROM employees WHERE workspace = ? ORDER BY name`)
    .all(workspace) as Record<string, unknown>[];
}

export function getEmployee(id: string) {
  return db.prepare(`SELECT * FROM employees WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
}

export function createEmployee(input: {
  workspace?: string;
  name: string;
  email?: string;
  role?: string;
  department?: string;
  base_salary: number;
  currency?: string;
  pay_frequency?: string;
  start_date: number;
  end_date?: number;
  tax_jurisdiction?: string;
  notes?: string;
}) {
  const id = uid("emp_");
  db.prepare(
    `
    INSERT INTO employees (id, workspace, name, email, role, department, base_salary, currency,
      pay_frequency, start_date, end_date, tax_jurisdiction, notes, status, created_at)
    VALUES (?, 'default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
  `,
  ).run(
    id,
    input.name,
    input.email || null,
    input.role || null,
    input.department || null,
    input.base_salary,
    input.currency || "USD",
    input.pay_frequency || "monthly",
    input.start_date,
    input.end_date || null,
    input.tax_jurisdiction || null,
    input.notes || null,
    now(),
  );
  return id;
}

/**
 * Compute gross pay for one employee in one period, taking pay_frequency into account.
 * Returns the gross in the EMPLOYEE's base currency.
 */
function grossForPeriod(employee: Record<string, unknown>, periodStart: number, periodEnd: number): number {
  // Convert salary to period amount
  const annual = employee.base_salary;
  let divisor = 12;
  if (employee.pay_frequency === "weekly") divisor = 52;
  else if (employee.pay_frequency === "biweekly") divisor = 26;
  else if (employee.pay_frequency === "annual") divisor = 1;
  const perPeriod = annual / divisor;
  // Pro-rate by days if period is partial
  const days = (periodEnd - periodStart) / 86400_000;
  const fullDays =
    employee.pay_frequency === "weekly"
      ? 7
      : employee.pay_frequency === "biweekly"
        ? 14
        : employee.pay_frequency === "annual"
          ? 365
          : 30;
  const ratio = Math.min(1, Math.max(0, days / fullDays));
  return Math.round(perPeriod * ratio * 100) / 100;
}

/** Create a draft payroll run for a period. */
export function createPayrollRun(opts: {
  workspace?: string;
  period_start: number;
  period_end: number;
}) {
  const ws = opts.workspace || "default";
  const employees = listEmployees(ws).filter((e) => e.status === "active");
  const id = uid("pay_");
  const t = now();

  let totalGross = 0,
    totalTax = 0,
    totalNet = 0;
  const insertLine = db.prepare(`
    INSERT INTO payroll_lines (id, run_id, employee_id, gross, tax, deductions, net, currency, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const emp of employees) {
    const gross = grossForPeriod(emp, opts.period_start, opts.period_end);
    if (gross <= 0) continue;
    const tax = calculateTax({
      country: emp.tax_jurisdiction || "US",
      kind: "payroll",
      taxable_amount: gross,
    });
    const net = gross - tax.tax_owed;
    insertLine.run(
      uid("pl_"),
      id,
      emp.id,
      gross,
      tax.tax_owed,
      0,
      net,
      emp.currency,
      `${tax.rule_label || "payroll tax"}`,
    );
    totalGross += gross;
    totalTax += tax.tax_owed;
    totalNet += net;
  }
  db.prepare(
    `
    INSERT INTO payroll_runs (id, workspace, period_start, period_end, currency, total_gross, total_net, total_tax, status, created_at)
    VALUES (?, ?, ?, ?, 'USD', ?, ?, ?, 'draft', ?)
  `,
  ).run(id, ws, opts.period_start, opts.period_end, totalGross, totalNet, totalTax, t);

  return {
    id,
    total_gross: totalGross,
    total_net: totalNet,
    total_tax: totalTax,
    employees: employees.length,
  };
}

/** Approve + post a payroll run to the ledger. */
export function approvePayrollRun(runId: string, approver: string) {
  const row = db.prepare(`SELECT * FROM payroll_runs WHERE id = ?`).get(runId) as Record<string, unknown> | undefined;
  if (!row) throw new Error("Payroll run not found");
  if (row.status === "paid") throw new Error("Payroll run already paid");

  const lines = db.prepare(`SELECT * FROM payroll_lines WHERE run_id = ?`).all(runId) as Record<string, unknown>[];
  // One balanced journal entry covering all wages + taxes
  createJournalEntry({
    workspace: row.workspace,
    txn_date: row.period_end,
    description: `Payroll ${new Date(row.period_start).toISOString().slice(0, 10)} → ${new Date(row.period_end).toISOString().slice(0, 10)}`,
    source: "payroll",
    source_id: row.id,
    currency: row.currency,
    lines: [
      // Debit salaries expense for gross total
      {
        account_code: "6000",
        debit: row.total_gross,
        amount_currency: row.total_gross,
        currency: row.currency,
      },
      // Credit wages payable for net
      {
        account_code: "2300",
        credit: row.total_net,
        amount_currency: row.total_net,
        currency: row.currency,
      },
      // Credit payroll tax payable for withheld tax
      {
        account_code: "2200",
        credit: row.total_tax,
        amount_currency: row.total_tax,
        currency: row.currency,
      },
    ],
  });
  db.prepare(`UPDATE payroll_runs SET status = 'approved', approved_by = ? WHERE id = ?`).run(
    approver,
    runId,
  );
}

export function markPayrollPaid(runId: string) {
  db.prepare(`UPDATE payroll_runs SET status = 'paid', paid_at = ? WHERE id = ?`).run(now(), runId);
}

export function listPayrollRuns(opts: { workspace?: string; limit?: number } = {}) {
  const ws = opts.workspace || "default";
  return db
    .prepare(`SELECT * FROM payroll_runs WHERE workspace = ? ORDER BY period_start DESC LIMIT ?`)
    .all(ws, opts.limit || 50) as Record<string, unknown>[];
}
