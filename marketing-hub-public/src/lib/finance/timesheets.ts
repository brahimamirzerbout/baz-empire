/**
 * Timesheets — Track billable and non-billable hours per person/project/client.
 *
 * Used for:
 *   - Contractor payment calculations
 *   - Client invoicing (billable hours)
 *   - Project profitability analysis
 *   - Utilization rate tracking
 */

import { db, uid, now } from "@/lib/db";

export type TimesheetStatus = "draft" | "submitted" | "approved" | "invoiced";

export interface TimesheetEntry {
  id: string;
  workspace: string;
  person_type: "contractor" | "employee";
  person_id: string;
  person_name: string;
  project_id: string | null;
  project_name: string | null;
  client_id: string | null;
  client_name: string | null;
  date: number;
  hours: number;
  description: string | null;
  billable: number;
  rate: number | null;
  rate_currency: string;
  amount: number | null;
  approved_by: string | null;
  approved_at: number | null;
  status: TimesheetStatus;
  created_at: number;
  updated_at: number;
}

export function listTimesheets(filters?: {
  person_id?: string;
  project_id?: string;
  client_id?: string;
  status?: TimesheetStatus;
  from?: number;
  to?: number;
}, workspace = "default"): TimesheetEntry[] {
  let sql = `SELECT * FROM timesheets WHERE workspace = ?`;
  const params: unknown[] = [workspace];
  if (filters?.person_id) { sql += ` AND person_id = ?`; params.push(filters.person_id); }
  if (filters?.project_id) { sql += ` AND project_id = ?`; params.push(filters.project_id); }
  if (filters?.client_id) { sql += ` AND client_id = ?`; params.push(filters.client_id); }
  if (filters?.status) { sql += ` AND status = ?`; params.push(filters.status); }
  if (filters?.from) { sql += ` AND date >= ?`; params.push(filters.from); }
  if (filters?.to) { sql += ` AND date <= ?`; params.push(filters.to); }
  sql += ` ORDER BY date DESC, person_name`;
  return db.prepare(sql).all(...params) as TimesheetEntry[];
}

export function getTimesheet(id: string): TimesheetEntry | undefined {
  return db.prepare(`SELECT * FROM timesheets WHERE id = ?`).get(id) as TimesheetEntry | undefined;
}

export function createTimesheet(input: {
  person_type: "contractor" | "employee";
  person_id: string;
  person_name: string;
  project_id?: string;
  project_name?: string;
  client_id?: string;
  client_name?: string;
  date: number;
  hours: number;
  description?: string;
  billable?: boolean;
  rate?: number;
  rate_currency?: string;
}): string {
  const id = uid("ts_");
  const isBillable = input.billable !== false ? 1 : 0;
  const amount = input.rate ? Math.round(input.hours * input.rate * 100) / 100 : null;

  db.prepare(`
    INSERT INTO timesheets (id, workspace, person_type, person_id, person_name, project_id, project_name,
      client_id, client_name, date, hours, description, billable, rate, rate_currency, amount,
      status, created_at, updated_at)
    VALUES (?, 'default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)
  `).run(
    id,
    input.person_type,
    input.person_id,
    input.person_name,
    input.project_id || null,
    input.project_name || null,
    input.client_id || null,
    input.client_name || null,
    input.date,
    input.hours,
    input.description || null,
    isBillable,
    input.rate || null,
    input.rate_currency || "USD",
    amount,
    now(),
    now(),
  );
  return id;
}

export function updateTimesheet(id: string, updates: Partial<TimesheetEntry>): boolean {
  const fields: string[] = [];
  const values: unknown[] = [];
  for (const [k, v] of Object.entries(updates)) {
    if (k === "id" || k === "created_at") continue;
    fields.push(`${k} = ?`);
    values.push(v);
  }
  if (fields.length === 0) return false;
  fields.push("updated_at = ?");
  values.push(now());
  values.push(id);
  db.prepare(`UPDATE timesheets SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  return true;
}

/** Submit a draft timesheet for approval. */
export function submitTimesheet(id: string): TimesheetStatus {
  updateTimesheet(id, { status: "submitted" });
  return "submitted";
}

/** Approve a submitted timesheet. */
export function approveTimesheet(id: string, approvedBy: string): TimesheetStatus {
  updateTimesheet(id, { status: "approved", approved_by: approvedBy, approved_at: now() });
  return "approved";
}

/** Mark timesheet as invoiced (linked to a client invoice). */
export function invoiceTimesheet(id: string): TimesheetStatus {
  updateTimesheet(id, { status: "invoiced" });
  return "invoiced";
}

/** Bulk-approve submitted timesheets. */
export function bulkApprove(ids: string[], approvedBy: string): number {
  const stmt = db.prepare(`UPDATE timesheets SET status = 'approved', approved_by = ?, approved_at = ?, updated_at = ? WHERE id = ? AND status = 'submitted'`);
  let count = 0;
  for (const id of ids) {
    count += stmt.run(approvedBy, now(), now(), id).changes;
  }
  return count;
}

/** Timesheet summary for a date range. */
export function timesheetSummary(from: number, to: number, workspace = "default"): {
  total_hours: number;
  billable_hours: number;
  non_billable_hours: number;
  total_amount: number;
  by_person: Array<{ person_id: string; person_name: string; hours: number; amount: number }>;
  by_project: Array<{ project_id: string; project_name: string; hours: number; amount: number }>;
  by_client: Array<{ client_id: string; client_name: string; hours: number; amount: number }>;
  utilization: number;
} {
  const rows = db.prepare(
    `SELECT * FROM timesheets WHERE workspace = ? AND date >= ? AND date <= ?`
  ).all(workspace, from, to) as TimesheetEntry[];

  let totalHours = 0, billableHours = 0, totalAmount = 0;
  const byPerson: Record<string, { hours: number; amount: number; name: string }> = {};
  const byProject: Record<string, { hours: number; amount: number; name: string }> = {};
  const byClient: Record<string, { hours: number; amount: number; name: string }> = {};

  for (const r of rows) {
    totalHours += r.hours;
    if (r.billable) billableHours += r.hours;
    totalAmount += r.amount || 0;
    if (!byPerson[r.person_id]) byPerson[r.person_id] = { hours: 0, amount: 0, name: r.person_name };
    byPerson[r.person_id].hours += r.hours;
    byPerson[r.person_id].amount += r.amount || 0;
    const projKey = r.project_id || "_none";
    if (!byProject[projKey]) byProject[projKey] = { hours: 0, amount: 0, name: r.project_name || "No project" };
    byProject[projKey].hours += r.hours;
    byProject[projKey].amount += r.amount || 0;
    const cliKey = r.client_id || "_none";
    if (!byClient[cliKey]) byClient[cliKey] = { hours: 0, amount: 0, name: r.client_name || "No client" };
    byClient[cliKey].hours += r.hours;
    byClient[cliKey].amount += r.amount || 0;
  }

  return {
    total_hours: Math.round(totalHours * 100) / 100,
    billable_hours: Math.round(billableHours * 100) / 100,
    non_billable_hours: Math.round((totalHours - billableHours) * 100) / 100,
    total_amount: Math.round(totalAmount * 100) / 100,
    by_person: Object.entries(byPerson).map(([id, v]) => ({ person_id: id, person_name: v.name, hours: Math.round(v.hours * 100) / 100, amount: Math.round(v.amount * 100) / 100 })),
    by_project: Object.entries(byProject).map(([id, v]) => ({ project_id: id, project_name: v.name, hours: Math.round(v.hours * 100) / 100, amount: Math.round(v.amount * 100) / 100 })),
    by_client: Object.entries(byClient).map(([id, v]) => ({ client_id: id, client_name: v.name, hours: Math.round(v.hours * 100) / 100, amount: Math.round(v.amount * 100) / 100 })),
    utilization: totalHours > 0 ? Math.round(billableHours / totalHours * 10000) / 100 : 0,
  };
}