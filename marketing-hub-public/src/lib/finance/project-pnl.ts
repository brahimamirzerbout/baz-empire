/**
 * Project Profitability — Revenue vs cost per project/client.
 *
 * Computes gross margin by pulling:
 *   - Revenue from client_invoices (paid invoices)
 *   - Labor cost from timesheets (approved hours × rate)
 *   - Media cost from expenses (tagged to project)
 *   - Tools cost from budget_items (tagged to project)
 *   - Overhead (allocated % of total fixed costs)
 */

import { db, uid, now } from "@/lib/db";

export interface ProjectPnL {
  id: string;
  workspace: string;
  project_id: string;
  project_name: string;
  client_id: string | null;
  client_name: string | null;
  period_start: number;
  period_end: number;
  revenue: number;
  cost_labor: number;
  cost_media: number;
  cost_tools: number;
  cost_overhead: number;
  cost_total: number;
  gross_margin: number;
  gross_margin_pct: number;
  currency: string;
  metadata: string | null;
  created_at: number;
  updated_at: number;
}

export function listPnL(filters?: { client_id?: string; project_id?: string }, workspace = "default"): ProjectPnL[] {
  let sql = `SELECT * FROM project_pnl WHERE workspace = ?`;
  const params: unknown[] = [workspace];
  if (filters?.client_id) { sql += ` AND client_id = ?`; params.push(filters.client_id); }
  if (filters?.project_id) { sql += ` AND project_id = ?`; params.push(filters.project_id); }
  sql += ` ORDER BY period_start DESC`;
  return db.prepare(sql).all(...params) as ProjectPnL[];
}

export function getPnL(id: string): ProjectPnL | undefined {
  return db.prepare(`SELECT * FROM project_pnl WHERE id = ?`).get(id) as ProjectPnL | undefined;
}

/** Compute P&L for a project over a period. */
export function computeProjectPnL(input: {
  project_id: string;
  project_name: string;
  client_id?: string;
  client_name?: string;
  period_start: number;
  period_end: number;
  overhead_pct?: number; // e.g. 0.15 = 15% overhead on labor
  currency?: string;
}, workspace = "default"): string {
  const id = uid("pnl_");

  // Revenue from paid invoices
  const invoices = db.prepare(
    `SELECT total, paid_amount, currency FROM client_invoices WHERE workspace = ? AND project_id = ? AND status = 'paid' AND issue_date >= ? AND issue_date <= ?`
  ).all(workspace, input.project_id, input.period_start, input.period_end) as Array<{ total: number; paid_amount: number; currency: string }>;
  const revenue = invoices.reduce((sum, inv) => sum + (inv.paid_amount || inv.total), 0);

  // Labor cost from approved timesheets
  const timesheets = db.prepare(
    `SELECT hours, amount, rate_currency FROM timesheets WHERE workspace = ? AND project_id = ? AND status IN ('approved', 'invoiced') AND date >= ? AND date <= ?`
  ).all(workspace, input.project_id, input.period_start, input.period_end) as Array<{ hours: number; amount: number; rate_currency: string }>;
  const costLabor = timesheets.reduce((sum, ts) => sum + (ts.amount || 0), 0);

  // Media cost from expenses tagged to this project
  const expenses = db.prepare(
    `SELECT amount FROM expenses WHERE workspace = ? AND metadata LIKE ? AND incurred_on >= ? AND incurred_on <= ?`
  ).all(workspace, `%"project_id":"${input.project_id}"%`, input.period_start, input.period_end) as Array<{ amount: number }>;
  const costMedia = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  // Tools cost from budget_items
  const budgetItems = db.prepare(
    `SELECT actual FROM budget_items WHERE workspace = ? AND notes LIKE ?`
  ).all(workspace, `%"project_id":"${input.project_id}"%`) as Array<{ actual: number }>;
  const costTools = budgetItems.reduce((sum, b) => sum + (b.actual || 0), 0);

  // Overhead allocation
  const overheadPct = input.overhead_pct ?? 0.15;
  const costOverhead = Math.round(costLabor * overheadPct * 100) / 100;

  const costTotal = Math.round((costLabor + costMedia + costTools + costOverhead) * 100) / 100;
  const grossMargin = Math.round((revenue - costTotal) * 100) / 100;
  const grossMarginPct = revenue > 0 ? Math.round(grossMargin / revenue * 10000) / 100 : 0;

  db.prepare(`
    INSERT INTO project_pnl (id, workspace, project_id, project_name, client_id, client_name,
      period_start, period_end, revenue, cost_labor, cost_media, cost_tools, cost_overhead,
      cost_total, gross_margin, gross_margin_pct, currency, metadata, created_at, updated_at)
    VALUES (?, 'default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, input.project_id, input.project_name, input.client_id || null, input.client_name || null,
    input.period_start, input.period_end, revenue, costLabor, costMedia, costTools, costOverhead,
    costTotal, grossMargin, grossMarginPct, input.currency || "USD",
    JSON.stringify({ invoice_count: invoices.length, timesheet_count: timesheets.length, expense_count: expenses.length }),
    now(), now(),
  );

  return id;
}

/** Dashboard summary across all projects. */
export function pnlSummary(workspace = "default"): {
  total_revenue: number;
  total_cost: number;
  total_margin: number;
  avg_margin_pct: number;
  projects: Array<{ project_id: string; project_name: string; client_name: string; revenue: number; cost: number; margin: number; margin_pct: number }>;
} {
  const rows = db.prepare(
    `SELECT project_id, project_name, client_name, revenue, cost_total, gross_margin, gross_margin_pct
     FROM project_pnl WHERE workspace = ?
     AND id IN (SELECT MAX(id) FROM project_pnl WHERE workspace = ? GROUP BY project_id)`
  ).all(workspace, workspace) as Array<{ project_id: string; project_name: string; client_name: string; revenue: number; cost_total: number; gross_margin: number; gross_margin_pct: number }>;

  let totalRevenue = 0, totalCost = 0, totalMargin = 0;
  const projects = rows.map(r => {
    totalRevenue += r.revenue;
    totalCost += r.cost_total;
    totalMargin += r.gross_margin;
    return {
      project_id: r.project_id,
      project_name: r.project_name,
      client_name: r.client_name || "—",
      revenue: r.revenue,
      cost: r.cost_total,
      margin: r.gross_margin,
      margin_pct: r.gross_margin_pct,
    };
  });

  return {
    total_revenue: Math.round(totalRevenue * 100) / 100,
    total_cost: Math.round(totalCost * 100) / 100,
    total_margin: Math.round(totalMargin * 100) / 100,
    avg_margin_pct: totalRevenue > 0 ? Math.round(totalMargin / totalRevenue * 10000) / 100 : 0,
    projects,
  };
}