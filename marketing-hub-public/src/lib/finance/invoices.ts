/**
 * Client Invoices — Generate, send, and track invoices for clients.
 *
 * Supports multi-currency, line items, tax, discounts, and Stripe integration.
 * Links to timesheets for billable hours invoicing.
 */

import { db, uid, now } from "@/lib/db";

export type InvoiceStatus = "draft" | "sent" | "viewed" | "paid" | "overdue" | "void";

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  currency?: string;
}

export interface ClientInvoice {
  id: string;
  workspace: string;
  invoice_number: string;
  client_id: string;
  client_name: string;
  project_id: string | null;
  project_name: string | null;
  status: InvoiceStatus;
  issue_date: number;
  due_date: number;
  currency: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_rate: number;
  discount_amount: number;
  total: number;
  paid_amount: number;
  notes: string | null;
  terms: string | null;
  line_items: string; // JSON
  pdf_url: string | null;
  stripe_invoice_id: string | null;
  paid_at: number | null;
  created_at: number;
  updated_at: number;
}

function nextInvoiceNumber(workspace = "default"): string {
  const last = db.prepare(
    `SELECT invoice_number FROM client_invoices WHERE workspace = ? ORDER BY created_at DESC LIMIT 1`
  ).get(workspace) as { invoice_number: string } | undefined;
  if (!last) return "INV-0001";
  const match = last.invoice_number.match(/INV-(\d+)/);
  if (!match) return "INV-0001";
  const num = parseInt(match[1], 10) + 1;
  return `INV-${String(num).padStart(4, "0")}`;
}

export function listInvoices(filters?: { client_id?: string; status?: InvoiceStatus }, workspace = "default"): ClientInvoice[] {
  let sql = `SELECT * FROM client_invoices WHERE workspace = ?`;
  const params: unknown[] = [workspace];
  if (filters?.client_id) { sql += ` AND client_id = ?`; params.push(filters.client_id); }
  if (filters?.status) { sql += ` AND status = ?`; params.push(filters.status); }
  sql += ` ORDER BY issue_date DESC`;
  return db.prepare(sql).all(...params) as ClientInvoice[];
}

export function getInvoice(id: string): ClientInvoice | undefined {
  return db.prepare(`SELECT * FROM client_invoices WHERE id = ?`).get(id) as ClientInvoice | undefined;
}

export function createInvoice(input: {
  client_id: string;
  client_name: string;
  project_id?: string;
  project_name?: string;
  currency?: string;
  tax_rate?: number;
  discount_rate?: number;
  line_items: InvoiceLineItem[];
  notes?: string;
  terms?: string;
  due_days?: number;
}): string {
  const id = uid("inv_");
  const invoiceNumber = nextInvoiceNumber();
  const issueDate = now();
  const dueDays = input.due_days || 30;
  const dueDate = issueDate + dueDays * 86400000;
  const subtotal = input.line_items.reduce((sum, li) => sum + li.amount, 0);
  const taxAmount = Math.round(subtotal * (input.tax_rate || 0) * 100) / 100;
  const discountAmount = Math.round(subtotal * (input.discount_rate || 0) * 100) / 100;
  const total = Math.round((subtotal + taxAmount - discountAmount) * 100) / 100;

  db.prepare(`
    INSERT INTO client_invoices (id, workspace, invoice_number, client_id, client_name, project_id, project_name,
      status, issue_date, due_date, currency, subtotal, tax_rate, tax_amount, discount_rate, discount_amount,
      total, paid_amount, notes, terms, line_items, created_at, updated_at)
    VALUES (?, 'default', ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)
  `).run(
    id, invoiceNumber, input.client_id, input.client_name, input.project_id || null, input.project_name || null,
    issueDate, dueDate, input.currency || "USD", subtotal, input.tax_rate || 0, taxAmount, input.discount_rate || 0, discountAmount,
    total, input.notes || null, input.terms || "Payment due within 30 days.", JSON.stringify(input.line_items),
    now(), now(),
  );
  return id;
}

export function updateInvoice(id: string, updates: Partial<ClientInvoice>): boolean {
  const fields: string[] = [];
  const values: unknown[] = [];
  for (const [k, v] of Object.entries(updates)) {
    if (k === "id" || k === "created_at" || k === "invoice_number") continue;
    fields.push(`${k} = ?`);
    values.push(v);
  }
  if (fields.length === 0) return false;
  fields.push("updated_at = ?");
  values.push(now());
  values.push(id);
  db.prepare(`UPDATE client_invoices SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  return true;
}

/** Mark invoice as sent. */
export function sendInvoice(id: string): InvoiceStatus {
  updateInvoice(id, { status: "sent" });
  return "sent";
}

/** Mark invoice as paid. */
export function markInvoicePaid(id: string, paidAmount?: number): InvoiceStatus {
  const inv = getInvoice(id);
  if (!inv) throw new Error("Invoice not found");
  const amount = paidAmount ?? inv.total;
  updateInvoice(id, { status: "paid", paid_amount: amount, paid_at: now() });
  return "paid";
}

/** Mark overdue invoices. Call periodically (cron job). */
export function markOverdueInvoices(): number {
  const t = now();
  const result = db.prepare(
    `UPDATE client_invoices SET status = 'overdue', updated_at = ? WHERE status = 'sent' AND due_date < ?`
  ).run(t, t);
  return result.changes;
}

/** Void an invoice. */
export function voidInvoice(id: string): InvoiceStatus {
  updateInvoice(id, { status: "void" });
  return "void";
}

/** Create invoice from approved timesheets for a client. */
export function createInvoiceFromTimesheets(clientId: string, clientName: string, projectId?: string, currency = "USD"): string {
  const timesheets = db.prepare(
    `SELECT * FROM timesheets WHERE client_id = ? AND status = 'approved' AND billable = 1 ${projectId ? " AND project_id = ?" : ""}`
  ).all(...(projectId ? [clientId, projectId] : [clientId])) as Array<Record<string, unknown>>;

  if (timesheets.length === 0) throw new Error("No approved billable timesheets found for this client");

  const lineItems: InvoiceLineItem[] = [];
  for (const ts of timesheets) {
    lineItems.push({
      description: `${ts.person_name} — ${ts.description || ts.project_name || "Consulting"}`,
      quantity: ts.hours as number,
      unit_price: (ts.rate as number) || 0,
      amount: (ts.amount as number) || 0,
      currency: (ts.rate_currency as string) || currency,
    });
  }

  const invoiceId = createInvoice({
    client_id: clientId,
    client_name: clientName,
    project_id: projectId,
    currency,
    line_items: lineItems,
    notes: `Auto-generated from ${timesheets.length} approved timesheet entries.`,
  });

  // Mark timesheets as invoiced
  for (const ts of timesheets) {
    db.prepare(`UPDATE timesheets SET status = 'invoiced', updated_at = ? WHERE id = ?`).run(now(), ts.id);
  }

  return invoiceId;
}

/** Invoice summary stats. */
export function invoiceSummary(workspace = "default"): {
  total_outstanding: number;
  total_paid: number;
  total_overdue: number;
  by_status: Record<string, number>;
  this_month_revenue: number;
  aging: Array<{ bucket: string; count: number; amount: number }>;
} {
  const rows = db.prepare(`SELECT * FROM client_invoices WHERE workspace = ?`).all(workspace) as ClientInvoice[];
  let outstanding = 0, paid = 0, overdue = 0, thisMonth = 0;
  const byStatus: Record<string, number> = {};
  const now1 = Date.now();
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);

  // Aging buckets
  const buckets = [
    { label: "Current", min: 0, max: 30 },
    { label: "1–30 days", min: 1, max: 30 },
    { label: "31–60 days", min: 31, max: 60 },
    { label: "61–90 days", min: 61, max: 90 },
    { label: "90+ days", min: 91, max: 9999 },
  ];
  const aging = buckets.map(b => ({ ...b, count: 0, amount: 0 }));

  for (const inv of rows) {
    byStatus[inv.status] = (byStatus[inv.status] || 0) + inv.total;
    if (inv.status === "paid") { paid += inv.paid_amount; }
    else if (inv.status === "overdue") { overdue += inv.total - inv.paid_amount; outstanding += inv.total - inv.paid_amount; }
    else if (inv.status === "sent" || inv.status === "viewed") { outstanding += inv.total - inv.paid_amount; }
    if (inv.issue_date >= monthStart.getTime()) thisMonth += inv.total;

    // Aging for unpaid invoices
    if (inv.status !== "paid" && inv.status !== "void") {
      const daysOutstanding = Math.floor((now1 - inv.issue_date) / 86400000);
      for (const b of aging) {
        if (daysOutstanding >= b.min && daysOutstanding <= b.max) {
          b.count++;
          b.amount += inv.total - inv.paid_amount;
          break;
        }
      }
    }
  }

  return {
    total_outstanding: Math.round(outstanding * 100) / 100,
    total_paid: Math.round(paid * 100) / 100,
    total_overdue: Math.round(overdue * 100) / 100,
    by_status: Object.fromEntries(Object.entries(byStatus).map(([k, v]) => [k, Math.round(v * 100) / 100])),
    this_month_revenue: Math.round(thisMonth * 100) / 100,
    aging: aging.map(b => ({ bucket: b.label, count: b.count, amount: Math.round(b.amount * 100) / 100 })),
  };
}