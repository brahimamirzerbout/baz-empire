/**
 * Seed: International contractors, payouts, timesheets, invoices, and profitability.
 *
 * Run: npx tsx scripts/seed-agency-finance.ts
 *
 * Creates realistic data for:
 *   - 12 contractors across 8 countries
 *   - 6 payouts (mix of providers and statuses)
 *   - 15 timesheet entries
 *   - 4 client invoices
 *   - 3 project P&L snapshots
 */

import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = path.join(__dirname, "..", "data", "hub.sqlite");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function uid(prefix: string) {
  return prefix + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const now = Date.now();
const DAY = 86400000;

// ─── Contractors ───
const contractors = [
  { name: "Amira Zerhouni", email: "amira@zerhouni.design", country: "MA", role: "Senior Brand Designer", department: "Creative", rate_amount: 65, rate_currency: "EUR", rate_type: "hourly", payment_method: "revolut" },
  { name: "Carlos Mendez", email: "carlos@mendez.dev", country: "ES", role: "Full-Stack Developer", department: "Creative", rate_amount: 85, rate_currency: "EUR", rate_type: "hourly", payment_method: "revolut" },
  { name: "Priya Sharma", email: "priya@sharma.io", country: "IN", role: "SEO Strategist", department: "Media", rate_amount: 45, rate_currency: "USD", rate_type: "hourly", payment_method: "wise" },
  { name: "James Wright", email: "james@wright.co", country: "GB", role: "Content Director", department: "Creative", rate_amount: 5500, rate_currency: "GBP", rate_type: "monthly", payment_method: "revolut" },
  { name: "Fatima Al-Rashid", email: "fatima@rashid.ae", country: "AE", role: "Performance Marketer", department: "Media", rate_amount: 12000, rate_currency: "AED", rate_type: "monthly", payment_method: "manual" },
  { name: "Sophie Laurent", email: "sophie@laurent.fr", country: "FR", role: "UX Researcher", department: "Strategy", rate_amount: 70, rate_currency: "EUR", rate_type: "hourly", payment_method: "revolut" },
  { name: "Kofi Asante", email: "kofi@asante.gh", country: "GH", role: "Data Analyst", department: "Analytics", rate_amount: 35, rate_currency: "USD", rate_type: "hourly", payment_method: "wise" },
  { name: "Yuki Tanaka", email: "yuki@tanaka.jp", country: "JP", role: "Motion Designer", department: "Creative", rate_amount: 80, rate_currency: "USD", rate_type: "hourly", payment_method: "wise" },
  { name: "Lars Eriksson", email: "lars@eriksson.se", country: "CH", role: "CRM Architect", department: "Revenue", rate_amount: 120, rate_currency: "CHF", rate_type: "hourly", payment_method: "revolut" },
  { name: "Maria Santos", email: "maria@santos.br", country: "BR", role: "Social Media Manager", department: "Media", rate_amount: 55, rate_currency: "USD", rate_type: "hourly", payment_method: "wise" },
  { name: "Ahmed Ben Ali", email: "ahmed@benali.tn", country: "TN", role: "Copywriter", department: "Creative", rate_amount: 40, rate_currency: "EUR", rate_type: "hourly", payment_method: "manual" },
  { name: "Rachel Kim", email: "rachel@kim.sg", country: "SG", role: "Growth Lead", department: "Revenue", rate_amount: 8000, rate_currency: "SGD", rate_type: "monthly", payment_method: "plaid" },
];

const contractorIds: string[] = [];
for (const c of contractors) {
  const id = uid("ctr_");
  const statuses = ["draft", "invited", "contract_sent", "signed", "active", "active", "active", "active", "active", "active", "active", "active"];
  const complianceStatuses = ["pending", "pending", "pending", "verified", "verified", "verified", "verified", "verified", "verified", "verified", "verified", "verified"];
  const idx = contractors.indexOf(c);
  db.prepare(`
    INSERT INTO contractors (id, workspace, name, email, country, role, department,
      rate_currency, rate_amount, rate_type, payment_method, onboarding_status, compliance_status, status, created_at, updated_at)
    VALUES (?, 'default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
  `).run(id, c.name, c.email, c.country, c.role, c.department, c.rate_currency, c.rate_amount, c.rate_type, c.payment_method, statuses[idx], complianceStatuses[idx], now - (30 - idx) * DAY, now);
  contractorIds.push(id);
}

console.log(`✓ Seeded ${contractorIds.length} contractors`);

// ─── Payouts ───
const payouts = [
  { payee_name: "Amira Zerhouni", amount: 4160, currency: "EUR", provider: "revolut", status: "completed" },
  { payee_name: "James Wright", amount: 5500, currency: "GBP", provider: "revolut", status: "completed" },
  { payee_name: "Priya Sharma", amount: 3600, currency: "USD", provider: "wise", status: "processing" },
  { payee_name: "Fatima Al-Rashid", amount: 12000, currency: "AED", provider: "manual", status: "pending" },
  { payee_name: "Sophie Laurent", amount: 2800, currency: "EUR", provider: "revolut", status: "draft" },
  { payee_name: "Rachel Kim", amount: 8000, currency: "SGD", provider: "plaid", status: "failed" },
];

for (const p of payouts) {
  const id = uid("pay_");
  const fxRates: Record<string, number> = { EUR: 1.08, GBP: 1.27, AED: 0.27, SGD: 0.74, USD: 1, CHF: 1.12 };
  const fx = fxRates[p.currency] || 1;
  db.prepare(`
    INSERT INTO payouts (id, workspace, payee_type, payee_id, payee_name, amount, currency, fx_rate, amount_usd, provider, status, description, created_at, updated_at)
    VALUES (?, 'default', 'contractor', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, contractorIds[0], p.payee_name, p.amount, p.currency, fx, Math.round(p.amount * fx * 100) / 100, p.provider, p.status,
    `${p.status === "completed" ? "Monthly retainer" : p.status === "failed" ? "Payment returned" : "Pending payout"}`,
    now - Math.floor(Math.random() * 14) * DAY, now - Math.floor(Math.random() * 7) * DAY);
  if (p.status === "completed") {
    db.prepare(`UPDATE payouts SET paid_at = ? WHERE id = ?`).run(now - 5 * DAY, id);
  }
}

console.log(`✓ Seeded ${payouts.length} payouts`);

// ─── Timesheets ───
const timesheetEntries = [
  { person_name: "Amira Zerhouni", project_name: "ViralVista Rebrand", client_name: "ViralVista Inc.", hours: 32, rate: 65, description: "Brand identity system — logos, color palette, typography" },
  { person_name: "Amira Zerhouni", project_name: "Northwind Launch", client_name: "Northwind FinTech", hours: 16, rate: 65, description: "UI design for onboarding flow" },
  { person_name: "Carlos Mendez", project_name: "ViralVista Rebrand", client_name: "ViralVista Inc.", hours: 40, rate: 85, description: "Frontend development — component library" },
  { person_name: "Priya Sharma", project_name: "Northwind SEO", client_name: "Northwind FinTech", hours: 24, rate: 45, description: "Keyword research + content brief for 12 articles" },
  { person_name: "James Wright", project_name: "EngageEra Lifecycle", client_name: "EngageEra", hours: 20, rate: 34.37, description: "Email sequence copywriting — 8-email nurture" },
  { person_name: "Sophie Laurent", project_name: "EngageEra UX Audit", client_name: "EngageEra", hours: 12, rate: 70, description: "UX research — user interviews, heatmaps, funnel analysis" },
  { person_name: "Kofi Asante", project_name: "ViralVista Analytics", client_name: "ViralVista Inc.", hours: 8, rate: 35, description: "Attribution model setup — GA4 + CAPI" },
  { person_name: "Yuki Tanaka", project_name: "Northwind Launch", client_name: "Northwind FinTech", hours: 24, rate: 80, description: "Motion graphics for product video" },
  { person_name: "Lars Eriksson", project_name: "EngageEra CRM", client_name: "EngageEra", hours: 16, rate: 120, description: "HubSpot migration + lifecycle flow design" },
  { person_name: "Maria Santos", project_name: "ViralVista Social", client_name: "ViralVista Inc.", hours: 20, rate: 55, description: "Social media calendar — 30 posts, 8 stories" },
  { person_name: "Ahmed Ben Ali", project_name: "Northwind Content", client_name: "Northwind FinTech", hours: 16, rate: 40, description: "Blog posts — 4 fintech comparison articles" },
  { person_name: "Rachel Kim", project_name: "EngageEra Growth", client_name: "EngageEra", hours: 8, rate: 50, description: "Growth strategy audit — channel analysis" },
];

const statuses = ["draft", "submitted", "approved", "approved", "approved", "approved", "approved", "invoiced", "invoiced", "approved", "submitted", "draft"];

for (let i = 0; i < timesheetEntries.length; i++) {
  const t = timesheetEntries[i];
  const id = uid("ts_");
  db.prepare(`
    INSERT INTO timesheets (id, workspace, person_type, person_id, person_name, project_name, client_name,
      date, hours, description, billable, rate, rate_currency, amount, status, created_at, updated_at)
    VALUES (?, 'default', 'contractor', ?, ?, ?, ?, ?, ?, ?, 1, ?, 'USD', ?, ?, ?, ?)
  `).run(id, contractorIds[i] || contractorIds[0], t.person_name, t.project_name, t.client_name,
    now - (14 - i) * DAY, t.hours, t.description, t.rate, Math.round(t.hours * t.rate * 100) / 100,
    statuses[i], now - (14 - i) * DAY, now);
}

console.log(`✓ Seeded ${timesheetEntries.length} timesheet entries`);

// ─── Client Invoices ───
const invoices = [
  { client_name: "ViralVista Inc.", project_name: "ViralVista Rebrand", total: 28500, status: "paid", currency: "USD",
    line_items: [{ description: "Brand identity system", quantity: 1, unit_price: 15000, amount: 15000 }, { description: "Frontend development — component library", quantity: 1, unit_price: 8500, amount: 8500 }, { description: "Social media package — 30 posts", quantity: 1, unit_price: 5000, amount: 5000 }] },
  { client_name: "Northwind FinTech", project_name: "Northwind Launch", total: 18720, status: "sent", currency: "USD",
    line_items: [{ description: "UI design — onboarding flow", quantity: 16, unit_price: 65, amount: 1040 }, { description: "Motion graphics — product video", quantity: 24, unit_price: 80, amount: 1920 }, { description: "SEO content — 12 articles", quantity: 1, unit_price: 10800, amount: 10800 }, { description: "Fintech comparison blog posts", quantity: 1, unit_price: 4960, amount: 4960 }] },
  { client_name: "EngageEra", project_name: "EngageEra Lifecycle", total: 15360, status: "overdue", currency: "USD",
    line_items: [{ description: "Email sequence — 8-email nurture", quantity: 1, unit_price: 3200, amount: 3200 }, { description: "UX research + funnel analysis", quantity: 1, unit_price: 840, amount: 840 }, { description: "HubSpot migration + lifecycle flows", quantity: 1, unit_price: 1920, amount: 1920 }, { description: "Growth strategy audit", quantity: 1, unit_price: 400, amount: 400 }, { description: "Monthly retainer — Q1 2026", quantity: 3, unit_price: 3000, amount: 9000 }] },
  { client_name: "EngageEra", project_name: "EngageEra CRM", total: 9200, status: "draft", currency: "USD",
    line_items: [{ description: "CRM architecture + implementation", quantity: 1, unit_price: 7200, amount: 7200 }, { description: "Data migration — 50K contacts", quantity: 1, unit_price: 2000, amount: 2000 }] },
];

for (const inv of invoices) {
  const id = uid("inv_");
  const num = `INV-${String(1001 + invoices.indexOf(inv)).padStart(4, "0")}`;
  const paidAmount = inv.status === "paid" ? inv.total : 0;
  db.prepare(`
    INSERT INTO client_invoices (id, workspace, invoice_number, client_id, client_name, project_name,
      status, issue_date, due_date, currency, subtotal, tax_rate, tax_amount, discount_rate, discount_amount,
      total, paid_amount, line_items, created_at, updated_at)
    VALUES (?, 'default', ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, ?, ?, ?, ?, ?)
  `).run(id, num, `cli_${invoices.indexOf(inv)}`, inv.client_name, inv.project_name,
    inv.status, now - (30 - invoices.indexOf(inv) * 7) * DAY, now - (invoices.indexOf(inv) * 7 - 2) * DAY,
    inv.currency, inv.total, inv.total, paidAmount,
    JSON.stringify(inv.line_items), now - (30 - invoices.indexOf(inv) * 7) * DAY, now);
}

console.log(`✓ Seeded ${invoices.length} invoices`);

// ─── Project P&L ───
const pnlEntries = [
  { project_name: "ViralVista Rebrand", client_name: "ViralVista Inc.", revenue: 28500, cost_labor: 7800, cost_media: 2100, cost_tools: 450, gross_margin: 18150, gross_margin_pct: 63.7 },
  { project_name: "Northwind Launch", client_name: "Northwind FinTech", revenue: 18720, cost_labor: 5200, cost_media: 3400, cost_tools: 600, gross_margin: 9520, gross_margin_pct: 50.9 },
  { project_name: "EngageEra Lifecycle", client_name: "EngageEra", revenue: 15360, cost_labor: 4600, cost_media: 1800, cost_tools: 350, gross_margin: 8610, gross_margin_pct: 56.1 },
];

for (const pnl of pnlEntries) {
  const id = uid("pnl_");
  db.prepare(`
    INSERT INTO project_pnl (id, workspace, project_id, project_name, client_id, client_name,
      period_start, period_end, revenue, cost_labor, cost_media, cost_tools, cost_overhead,
      cost_total, gross_margin, gross_margin_pct, currency, metadata, created_at, updated_at)
    VALUES (?, 'default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'USD', ?, ?, ?)
  `).run(id, `proj_${pnlEntries.indexOf(pnl)}`, pnl.project_name, `cli_${pnlEntries.indexOf(pnl)}`, pnl.client_name,
    now - 90 * DAY, now, pnl.revenue, pnl.cost_labor, pnl.cost_media, pnl.cost_tools,
    Math.round(pnl.cost_labor * 0.15 * 100) / 100,
    Math.round((pnl.cost_labor + pnl.cost_media + pnl.cost_tools + pnl.cost_labor * 0.15) * 100) / 100,
    pnl.gross_margin, pnl.gross_margin_pct,
    JSON.stringify({ invoice_count: 1, timesheet_count: 3, expense_count: 2 }),
    now, now);
}

console.log(`✓ Seeded ${pnlEntries.length} project P&L entries`);

console.log("\n✅ Agency finance seed complete!");
console.log("  12 contractors across 8 countries");
console.log("  6 payouts (Plaid, Revolut, Wise, manual)");
console.log("  12 timesheet entries (4 approved, 2 invoiced)");
console.log("  4 client invoices (1 paid, 1 sent, 1 overdue, 1 draft)");
console.log("  3 project P&L snapshots");