/**
 * Expenses — per-employee, per-project claim management.
 *
 * Approval flow:
 *   submit → approve → reimburse (writes a journal entry crediting the
 *   employee's payable and debiting the expense account).
 *
 * Currency conversion: when the expense is recorded in a non-base currency,
 * we snapshot the FX rate at submit time. When approved, the rate is locked.
 * The journal entry uses the locked rate so reimbursements don't drift.
 */
import { db, uid, now } from "@/lib/db";
import { getRate } from "./fx";
import { createJournalEntry } from "./accounting";

export function submitExpense(input: {
  workspace?: string;
  employee_id: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  receipt_url?: string;
  incurred_on: number;
  project_id?: string;
  tax_code_id?: string;
  notes?: string;
}) {
  const ws = input.workspace || "default";
  const fxRate = input.currency === "USD" ? 1 : getRate(input.currency, "USD")?.rate || 1;
  const id = uid("exp_");
  db.prepare(
    `
    INSERT INTO expenses (id, workspace, employee_id, amount, currency, fx_rate, category,
      description, receipt_url, incurred_on, submitted_at, status, project_id, tax_code_id, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', ?, ?, ?, ?)
  `,
  ).run(
    id,
    ws,
    input.employee_id,
    input.amount,
    input.currency,
    fxRate,
    input.category,
    input.description,
    input.receipt_url || null,
    input.incurred_on,
    now(),
    input.project_id || null,
    input.tax_code_id || null,
    input.notes || null,
    now(),
  );
  return { id, fx_rate: fxRate };
}

export function approveExpense(id: string, approver: string) {
  db.prepare(
    `UPDATE expenses SET status = 'approved', approved_by = ?, approved_at = ? WHERE id = ?`,
  ).run(approver, now(), id);
}

export function rejectExpense(id: string, approver: string) {
  db.prepare(
    `UPDATE expenses SET status = 'rejected', approved_by = ?, approved_at = ? WHERE id = ?`,
  ).run(approver, now(), id);
}

export function reimburseExpense(id: string) {
  const row = db.prepare(`SELECT * FROM expenses WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  if (!row) throw new Error("Expense not found");
  if (row.status !== "approved")
    throw new Error(`Expense must be approved before reimbursement (current: ${row.status})`);

  const employee = db
    .prepare(`SELECT name FROM employees WHERE id = ?`)
    .get(row.employee_id) as Record<string, unknown> | undefined;
  // Choose the expense account code based on category
  const catAccount: Record<string, string> = {
    travel: "6500",
    meals: "6510",
    software: "6300",
    hardware: "1510",
    office: "6700",
    marketing: "6400",
    other: "6700",
  };
  const acct = catAccount[row.category] || "6700";
  const amountBase = row.amount * row.fx_rate;

  const jeId = createJournalEntry({
    workspace: row.workspace,
    txn_date: now(),
    description: `Reimburse ${employee?.name || "employee"} — ${row.description}`,
    reference: row.id,
    source: "expense_reimbursement",
    source_id: row.id,
    currency: "USD",
    lines: [
      {
        account_code: acct,
        debit: amountBase,
        amount_currency: amountBase,
        currency: "USD",
        memo: `${row.category}: ${row.description}`,
      },
      {
        account_code: "2000",
        credit: amountBase,
        amount_currency: amountBase,
        currency: "USD",
        memo: `Payable to ${employee?.name || row.employee_id}`,
      },
    ],
    employee_id: row.employee_id,
  });

  db.prepare(`UPDATE expenses SET status = 'reimbursed', reimbursed_at = ? WHERE id = ?`).run(
    now(),
    id,
  );
  return { expense_id: id, journal_entry_id: jeId, amount_base: amountBase };
}

export function listExpenses(
  opts: { workspace?: string; employee_id?: string; status?: string; limit?: number } = {},
) {
  const ws = opts.workspace || "default";
  let sql = `SELECT e.*, emp.name AS employee_name FROM expenses e LEFT JOIN employees emp ON emp.id = e.employee_id WHERE e.workspace = ?`;
  const p: (string | number)[] = [ws];
  if (opts.employee_id) {
    sql += " AND e.employee_id = ?";
    p.push(opts.employee_id);
  }
  if (opts.status) {
    sql += " AND e.status = ?";
    p.push(opts.status);
  }
  sql += " ORDER BY e.submitted_at DESC LIMIT ?";
  return db.prepare(sql).all(...p, opts.limit || 100) as Record<string, unknown>[];
}

export function employeeTotalExpenses(opts: {
  employee_id: string;
  from?: number;
  to?: number;
  currency?: string;
}) {
  const cur = opts.currency || "USD";
  const params: (string | number)[] = [opts.employee_id];
  let where = "employee_id = ?";
  if (opts.from) {
    where += " AND submitted_at >= ?";
    params.push(opts.from);
  }
  if (opts.to) {
    where += " AND submitted_at <= ?";
    params.push(opts.to);
  }
  const r = db
    .prepare(
      `SELECT COUNT(*) AS n, COALESCE(SUM(amount * fx_rate), 0) AS total_usd FROM expenses WHERE ${where}`,
    )
    .get(...params) as Record<string, unknown> | undefined;
  return r;
}
