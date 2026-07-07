/**
 * Accounting — double-entry ledger engine.
 *
 * Principles:
 *   - Every journal_entry has ≥2 journal_lines
 *   - Sum(debit) === Sum(credit) in BASE currency, for every entry
 *   - All amounts stored in line.currency + line.amount_currency; base
 *     currency conversion via line.fx_rate (snapshotted at posting time)
 *   - Chart of accounts is a tree (parent_id) with 5 types:
 *       asset, liability, equity, revenue, expense
 *
 * Reports we generate from this:
 *   - P&L (revenue - expense) over a period
 *   - Balance sheet at a point in time
 *   - Cash flow (movement in cash-equivalent accounts)
 *
 * All functions are pure — they read the DB but don't mutate it.
 * Mutation lives in the API routes under /api/finance/*.
 */
import { db, uid, now } from "@/lib/db";

export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";
export type EntryStatus = "draft" | "posted" | "void" | "reconciled";

export interface JournalLine {
  id: string;
  account_id: string;
  debit: number; // base currency
  credit: number; // base currency
  currency: string;
  amount_currency: number;
  fx_rate: number;
  memo?: string;
}

export interface JournalEntry {
  id: string;
  txn_date: number;
  posted_at: number;
  description: string;
  reference?: string;
  source: string;
  source_id?: string;
  currency: string;
  fx_rate: number;
  status: EntryStatus;
  lines: JournalLine[];
  contact_id?: string;
  campaign_id?: string;
  employee_id?: string;
  tags?: string[];
}

// ────────────────────────────────────────────────────────────────────
// Chart of accounts
// ────────────────────────────────────────────────────────────────────

export function listAccounts(workspace = "default") {
  return db
    .prepare(`SELECT * FROM chart_of_accounts WHERE workspace = ? AND active = 1 ORDER BY code`)
    .all(workspace) as Record<string, unknown>[];
}

export function getAccount(code: string, workspace = "default") {
  return db
    .prepare(`SELECT * FROM chart_of_accounts WHERE workspace = ? AND code = ?`)
    .get(workspace, code) as Record<string, unknown> | undefined;
}

export function seedDefaultChartOfAccounts(workspace = "default") {
  const defaults: Array<{ code: string; name: string; type: AccountType; subtype?: string }> = [
    // Assets
    { code: "1000", name: "Cash", type: "asset", subtype: "current" },
    { code: "1100", name: "Bank — Operating", type: "asset", subtype: "current" },
    { code: "1110", name: "Bank — Payroll", type: "asset", subtype: "current" },
    { code: "1120", name: "Bank — Tax Reserve", type: "asset", subtype: "current" },
    { code: "1200", name: "Accounts Receivable", type: "asset", subtype: "current" },
    { code: "1300", name: "Inventory", type: "asset", subtype: "current" },
    { code: "1500", name: "Office Equipment", type: "asset", subtype: "fixed" },
    { code: "1510", name: "Software & Licences", type: "asset", subtype: "fixed" },
    { code: "1600", name: "Deposits Paid", type: "asset", subtype: "current" },

    // Liabilities
    { code: "2000", name: "Accounts Payable", type: "liability", subtype: "current" },
    { code: "2100", name: "VAT / GST Payable", type: "liability", subtype: "current" },
    { code: "2110", name: "Sales Tax Payable", type: "liability", subtype: "current" },
    { code: "2200", name: "Payroll Tax Payable", type: "liability", subtype: "current" },
    { code: "2210", name: "Income Tax Payable", type: "liability", subtype: "current" },
    { code: "2300", name: "Wages Payable", type: "liability", subtype: "current" },
    { code: "2500", name: "Loans Payable", type: "liability", subtype: "long-term" },

    // Equity
    { code: "3000", name: "Owner's Equity", type: "equity" },
    { code: "3100", name: "Retained Earnings", type: "equity" },
    { code: "3200", name: "Distributions / Dividends", type: "equity" },

    // Revenue
    { code: "4000", name: "Product Revenue", type: "revenue", subtype: "operating" },
    { code: "4100", name: "Service Revenue", type: "revenue", subtype: "operating" },
    { code: "4200", name: "Subscription Revenue", type: "revenue", subtype: "operating" },
    { code: "4900", name: "Other Income", type: "revenue", subtype: "non-op" },

    // Expenses (operating)
    { code: "5000", name: "Cost of Goods Sold", type: "expense", subtype: "cogs" },
    { code: "6000", name: "Salaries & Wages", type: "expense", subtype: "opex" },
    { code: "6010", name: "Payroll Taxes", type: "expense", subtype: "opex" },
    { code: "6020", name: "Employee Benefits", type: "expense", subtype: "opex" },
    { code: "6030", name: "Contractors", type: "expense", subtype: "opex" },
    { code: "6100", name: "Rent", type: "expense", subtype: "opex" },
    { code: "6200", name: "Utilities", type: "expense", subtype: "opex" },
    { code: "6300", name: "Software Subscriptions", type: "expense", subtype: "opex" },
    { code: "6400", name: "Marketing & Advertising", type: "expense", subtype: "opex" },
    { code: "6500", name: "Travel & Entertainment", type: "expense", subtype: "opex" },
    { code: "6510", name: "Meals (50% deductible)", type: "expense", subtype: "opex" },
    { code: "6600", name: "Professional Fees", type: "expense", subtype: "opex" },
    { code: "6610", name: "Bank Fees", type: "expense", subtype: "opex" },
    { code: "6620", name: "Interest Expense", type: "expense", subtype: "non-op" },
    { code: "6700", name: "Office Supplies", type: "expense", subtype: "opex" },
    { code: "6800", name: "Insurance", type: "expense", subtype: "opex" },
    { code: "6900", name: "Depreciation", type: "expense", subtype: "non-op" },
  ];

  const insert = db.prepare(
    `INSERT OR IGNORE INTO chart_of_accounts
      (id, workspace, code, name, type, subtype, currency, active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'USD', 1, ?)`,
  );
  const t = now();
  let count = 0;
  for (const a of defaults) {
    const r = insert.run(uid("acct_"), workspace, a.code, a.name, a.type, a.subtype || null, t);
    if (r.changes > 0) count++;
  }
  return count;
}

// ────────────────────────────────────────────────────────────────────
// Journal entry creation
// ────────────────────────────────────────────────────────────────────

/**
 * Create a balanced journal entry.
 *
 * @param input.lines Array of { account_code, debit, credit, currency, amount_currency, fx_rate, memo? }
 *   - debit/credit in BASE currency
 *   - amount_currency in the LINE currency
 *   - fx_rate converts amount_currency → base (e.g. 1 EUR = 1.08 USD)
 *
 * Returns the full entry, or throws "UNBALANCED" if debits != credits.
 */
export function createJournalEntry(input: {
  workspace?: string;
  txn_date: number;
  description: string;
  reference?: string;
  source?: string;
  source_id?: string;
  currency?: string;
  fx_rate?: number;
  contact_id?: string;
  campaign_id?: string;
  employee_id?: string;
  tags?: string[];
  attachment_url?: string;
  created_by?: string;
  lines: Array<{
    account_code: string;
    debit?: number;
    credit?: number;
    currency?: string;
    amount_currency?: number;
    fx_rate?: number;
    memo?: string;
  }>;
}): JournalEntry {
  const ws = input.workspace || "default";
  if (!input.lines || input.lines.length < 2)
    throw new Error("Need at least 2 lines for a journal entry");

  const totalDebit = input.lines.reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredit = input.lines.reduce((s, l) => s + (l.credit || 0), 0);
  // Allow 0.005 rounding tolerance
  if (Math.abs(totalDebit - totalCredit) > 0.005) {
    throw new Error(
      `UNBALANCED: debits=${totalDebit.toFixed(2)} credits=${totalCredit.toFixed(2)}`,
    );
  }

  const entryId = uid("je_");
  const t = now();
  const entryCurrency = input.currency || "USD";
  const entryFx = input.fx_rate || 1.0;

  const insertEntry = db.prepare(`
    INSERT INTO journal_entries
      (id, workspace, txn_date, posted_at, description, reference, source, source_id,
       currency, fx_rate, status, contact_id, campaign_id, employee_id, attachment_url, tags,
       created_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'posted', ?, ?, ?, ?, ?, ?, ?)
  `);
  insertEntry.run(
    entryId,
    ws,
    input.txn_date,
    t,
    input.description,
    input.reference || null,
    input.source || "manual",
    input.source_id || null,
    entryCurrency,
    entryFx,
    input.contact_id || null,
    input.campaign_id || null,
    input.employee_id || null,
    input.attachment_url || null,
    input.tags ? JSON.stringify(input.tags) : null,
    input.created_by || null,
    t,
  );

  const insertLine = db.prepare(`
    INSERT INTO journal_lines
      (id, entry_id, account_id, debit, credit, currency, amount_currency, fx_rate, memo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const lines: JournalLine[] = [];
  for (const l of input.lines) {
    const acct = getAccount(l.account_code, ws);
    if (!acct) throw new Error(`Unknown account code: ${l.account_code}`);
    const lineId = uid("jl_");
    const lineCurrency = l.currency || entryCurrency;
    const lineFx = l.fx_rate || entryFx;
    const amountCurrency =
      l.amount_currency != null ? l.amount_currency : (l.debit || l.credit || 0) / lineFx;
    insertLine.run(
      lineId,
      entryId,
      acct.id,
      l.debit || 0,
      l.credit || 0,
      lineCurrency,
      amountCurrency,
      lineFx,
      l.memo || null,
    );
    lines.push({
      id: lineId,
      account_id: acct.id,
      debit: l.debit || 0,
      credit: l.credit || 0,
      currency: lineCurrency,
      amount_currency: amountCurrency,
      fx_rate: lineFx,
      memo: l.memo,
    });
  }

  return {
    id: entryId,
    txn_date: input.txn_date,
    posted_at: t,
    description: input.description,
    reference: input.reference,
    source: input.source || "manual",
    source_id: input.source_id,
    currency: entryCurrency,
    fx_rate: entryFx,
    status: "posted",
    contact_id: input.contact_id,
    campaign_id: input.campaign_id,
    employee_id: input.employee_id,
    tags: input.tags,
    lines,
  };
}

// ────────────────────────────────────────────────────────────────────
// Read helpers
// ────────────────────────────────────────────────────────────────────

export function listJournalEntries(
  opts: { workspace?: string; from?: number; to?: number; limit?: number } = {},
) {
  const ws = opts.workspace || "default";
  const limit = opts.limit || 200;
  const params: (string | number)[] = [ws];
  let where = "workspace = ?";
  if (opts.from) {
    where += " AND txn_date >= ?";
    params.push(opts.from);
  }
  if (opts.to) {
    where += " AND txn_date <= ?";
    params.push(opts.to);
  }
  const rows = db
    .prepare(
      `SELECT * FROM journal_entries WHERE ${where} ORDER BY txn_date DESC, posted_at DESC LIMIT ?`,
    )
    .all(...params, limit) as Record<string, unknown>[];

  return rows.map((e) => {
    const lines = db.prepare(`SELECT * FROM journal_lines WHERE entry_id = ?`).all(e.id) as Record<string, unknown>[];
    return {
      ...e,
      tags: e.tags ? JSON.parse(e.tags) : null,
      lines,
    };
  });
}

export function getJournalEntry(id: string) {
  const e = db.prepare(`SELECT * FROM journal_entries WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  if (!e) return null;
  const lines = db.prepare(`SELECT * FROM journal_lines WHERE entry_id = ?`).all(id) as Record<string, unknown>[];
  return { ...e, tags: e.tags ? JSON.parse(e.tags) : null, lines };
}

/** Sum debit - credit across all lines for one account, in BASE currency. */
export function accountBalance(accountCode: string, workspace = "default", asOf?: number): number {
  const acct = getAccount(accountCode, workspace);
  if (!acct) return 0;
  let sql = `
    SELECT COALESCE(SUM(jl.debit - jl.credit), 0) AS bal
    FROM journal_lines jl
    JOIN journal_entries je ON je.id = jl.entry_id
    WHERE jl.account_id = ? AND je.status = 'posted' AND je.workspace = ?
  `;
  const params: (string | number)[] = [acct.id, workspace];
  if (asOf) {
    sql += " AND je.txn_date <= ?";
    params.push(asOf);
  }
  const r = db.prepare(sql).get(...params) as Record<string, unknown> | undefined;
  // For liability/equity/revenue, "balance" as reported is credit-side-positive;
  // for asset/expense, debit-side-positive. The function returns raw (debit-credit),
  // which is the natural "balance" sign for assets and expenses.
  return r.bal || 0;
}

/** Cash position: sum of all asset accounts that are cash-like. */
export function cashPosition(workspace = "default", asOf?: number): number {
  const asOfDate = asOf || Date.now();
  const rows = db
    .prepare(
      `
    SELECT a.code, a.name,
      COALESCE(SUM(jl.debit - jl.credit), 0) AS bal
    FROM chart_of_accounts a
    LEFT JOIN journal_lines jl ON jl.account_id = a.id
    LEFT JOIN journal_entries je ON je.id = jl.entry_id AND je.status = 'posted'
        AND (je.txn_date <= ?)
        AND je.workspace = ?
    WHERE a.workspace = ? AND a.type = 'asset' AND a.subtype = 'current'
    GROUP BY a.id
    ORDER BY a.code
  `,
    )
    .all(asOfDate, workspace, workspace) as Record<string, unknown>[];

  // Cash-like: code starts with 1 (asset) AND name matches cash/bank
  const cash = rows
    .filter((r) => /cash|bank/i.test(r.name || ""))
    .reduce((s, r) => s + (r.bal || 0), 0);
  return cash;
}

// ────────────────────────────────────────────────────────────────────
// FINANCIAL STATEMENTS
// ────────────────────────────────────────────────────────────────────

export interface ProfitAndLoss {
  workspace: string;
  from: number;
  to: number;
  revenue: { code: string; name: string; amount: number }[];
  expenses: { code: string; name: string; amount: number; subtype?: string }[];
  total_revenue: number;
  total_expense: number;
  net_income: number;
  gross_margin?: number;
  operating_margin?: number;
}

export function profitAndLoss(opts: {
  workspace?: string;
  from: number;
  to: number;
}): ProfitAndLoss {
  const ws = opts.workspace || "default";
  // Revenue and expense totals per account
  const revenueRows = db
    .prepare(
      `
    SELECT a.code, a.name, COALESCE(SUM(jl.credit - jl.debit), 0) AS amount
    FROM chart_of_accounts a
    LEFT JOIN journal_lines jl ON jl.account_id = a.id
    LEFT JOIN journal_entries je ON je.id = jl.entry_id AND je.status = 'posted'
        AND je.txn_date BETWEEN ? AND ? AND je.workspace = ?
    WHERE a.workspace = ? AND a.type = 'revenue' AND a.active = 1
    GROUP BY a.id ORDER BY a.code
  `,
    )
    .all(opts.from, opts.to, ws, ws) as Record<string, unknown>[];

  const expenseRows = db
    .prepare(
      `
    SELECT a.code, a.name, a.subtype, COALESCE(SUM(jl.debit - jl.credit), 0) AS amount
    FROM chart_of_accounts a
    LEFT JOIN journal_lines jl ON jl.account_id = a.id
    LEFT JOIN journal_entries je ON je.id = jl.entry_id AND je.status = 'posted'
        AND je.txn_date BETWEEN ? AND ? AND je.workspace = ?
    WHERE a.workspace = ? AND a.type = 'expense' AND a.active = 1
    GROUP BY a.id ORDER BY a.code
  `,
    )
    .all(opts.from, opts.to, ws, ws) as Record<string, unknown>[];

  const total_revenue = revenueRows.reduce((s, r) => s + (r.amount || 0), 0);
  const total_expense = expenseRows.reduce((s, r) => s + (r.amount || 0), 0);

  return {
    workspace: ws,
    from: opts.from,
    to: opts.to,
    revenue: revenueRows,
    expenses: expenseRows,
    total_revenue,
    total_expense,
    net_income: total_revenue - total_expense,
    gross_margin: total_revenue
      ? (total_revenue -
          expenseRows.filter((e) => e.subtype === "cogs").reduce((s, e) => s + e.amount, 0)) /
        total_revenue
      : undefined,
    operating_margin: total_revenue
      ? (total_revenue -
          expenseRows.filter((e) => e.subtype === "opex").reduce((s, e) => s + e.amount, 0)) /
        total_revenue
      : undefined,
  };
}

export interface BalanceSheet {
  workspace: string;
  as_of: number;
  assets: { code: string; name: string; amount: number }[];
  liabilities: { code: string; name: string; amount: number }[];
  equity: { code: string; name: string; amount: number }[];
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  /** Balance check: should always be ~0. */
  imbalance: number;
}

export function balanceSheet(opts: { workspace?: string; asOf: number }): BalanceSheet {
  const ws = opts.workspace || "default";
  function rows(type: string, flipSign: boolean) {
    const r = db
      .prepare(
        `
      SELECT a.code, a.name, COALESCE(SUM(jl.debit - jl.credit), 0) AS raw
      FROM chart_of_accounts a
      LEFT JOIN journal_lines jl ON jl.account_id = a.id
      LEFT JOIN journal_entries je ON je.id = jl.entry_id AND je.status = 'posted'
          AND je.txn_date <= ? AND je.workspace = ?
      WHERE a.workspace = ? AND a.type = ? AND a.active = 1
      GROUP BY a.id ORDER BY a.code
    `,
      )
      .all(opts.asOf, ws, ws, type) as Record<string, unknown>[];
    return r.map((x) => ({ code: x.code, name: x.name, amount: flipSign ? -x.raw : x.raw }));
  }
  const assets = rows("asset", false);
  const liabilities = rows("liability", true); // liabilities naturally have credit balance, flip
  const equity = rows("equity", true);

  const total_assets = assets.reduce((s, a) => s + a.amount, 0);
  const total_liabilities = liabilities.reduce((s, a) => s + a.amount, 0);
  const total_equity = equity.reduce((s, a) => s + a.amount, 0);

  return {
    workspace: ws,
    as_of: opts.asOf,
    assets,
    liabilities,
    equity,
    total_assets,
    total_liabilities,
    total_equity,
    imbalance: total_assets - total_liabilities - total_equity,
  };
}

export interface CashFlow {
  workspace: string;
  from: number;
  to: number;
  opening_cash: number;
  closing_cash: number;
  net_change: number;
  operating_inflows: number;
  operating_outflows: number;
  investing: number;
  financing: number;
}

export function cashFlowStatement(opts: {
  workspace?: string;
  from: number;
  to: number;
}): CashFlow {
  const ws = opts.workspace || "default";
  const openingCash = cashPosition(ws, opts.from - 1);
  const closingCash = cashPosition(ws, opts.to);

  // Simple 3-bucket classification: operating (revenue + opex + cogs),
  // investing (fixed asset purchases), financing (equity/loans/dividends).
  function sumByAccountType(type: string, signs: "debit" | "credit" | "net") {
    const r = db
      .prepare(
        `
      SELECT COALESCE(SUM(${signs === "credit" ? "jl.credit - jl.debit" : signs === "debit" ? "jl.debit - jl.credit" : "jl.debit - jl.credit"}), 0) AS amount
      FROM chart_of_accounts a
      LEFT JOIN journal_lines jl ON jl.account_id = a.id
      LEFT JOIN journal_entries je ON je.id = jl.entry_id AND je.status = 'posted'
          AND je.txn_date BETWEEN ? AND ? AND je.workspace = ?
      WHERE a.workspace = ? AND a.type = ? AND a.active = 1
    `,
      )
      .all(opts.from, opts.to, ws, ws, type) as Record<string, unknown>[];
    return r.amount || 0;
  }

  const operating_inflows = sumByAccountType("revenue", "credit");
  const operating_outflows = sumByAccountType("expense", "debit");
  const investing = -sumByAccountType("asset", "debit"); // increase in fixed assets = investing outflow
  const financing = sumByAccountType("equity", "credit") + sumByAccountType("liability", "credit");

  return {
    workspace: ws,
    from: opts.from,
    to: opts.to,
    opening_cash: openingCash,
    closing_cash: closingCash,
    net_change: closingCash - openingCash,
    operating_inflows,
    operating_outflows,
    investing,
    financing,
  };
}

/**
 * Health snapshot used by Nova.
 * Returns a single JSON-friendly blob summarising the company's
 * financial position.
 */
export function financialHealth(opts: { workspace?: string; periodDays?: number } = {}) {
  const ws = opts.workspace || "default";
  const days = opts.periodDays || 30;
  const to = Date.now();
  const from = to - days * 86400 * 1000;

  const pl = profitAndLoss({ workspace: ws, from, to });
  const bs = balanceSheet({ workspace: ws, asOf: to });
  const cf = cashFlowStatement({ workspace: ws, from, to });
  const cash = cashPosition(ws, to);

  return {
    workspace: ws,
    period_days: days,
    as_of: to,
    cash_position: cash,
    revenue: pl.total_revenue,
    expenses: pl.total_expense,
    net_income: pl.net_income,
    gross_margin: pl.gross_margin,
    operating_margin: pl.operating_margin,
    total_assets: bs.total_assets,
    total_liabilities: bs.total_liabilities,
    total_equity: bs.total_equity,
    balance_sheet_imbalance: bs.imbalance,
    cash_inflow_outflow: cf.operating_inflows - cf.operating_outflows,
  };
}
