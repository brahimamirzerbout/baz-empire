/**
 * Payouts — Initiate and track payments to contractors and employees.
 *
 * Supports multiple providers:
 *   - Plaid: US ACH transfers (direct to bank account)
 *   - Revolut: SEPA, SWIFT, and multi-currency transfers (international)
 *   - Wise: Borderless multi-currency transfers
 *   - Manual: Record a manual payment (cash, check, internal transfer)
 *   - Crypto: Record a crypto payment (USDC, BTC, ETH)
 *
 * Flow:
 *   1. Create payout (draft)
 *   2. Submit to provider → status: processing
 *   3. Provider callback or sync → status: completed | failed
 *   4. Journal entry written on completion
 */

import { db, uid, now } from "@/lib/db";
import { createJournalEntry } from "./accounting";
import { getContractor } from "./contractors";

export type PayoutStatus = "draft" | "pending" | "processing" | "completed" | "failed" | "returned";
export type PayoutProvider = "plaid" | "revolut" | "wise" | "manual" | "crypto";
export type PayeeType = "contractor" | "employee";

export interface Payout {
  id: string;
  workspace: string;
  payee_type: PayeeType;
  payee_id: string;
  payee_name: string;
  amount: number;
  currency: string;
  fx_rate: number;
  amount_usd: number | null;
  provider: PayoutProvider;
  provider_transfer_id: string | null;
  status: PayoutStatus;
  payroll_run_id: string | null;
  description: string | null;
  invoice_url: string | null;
  receipt_url: string | null;
  paid_at: number | null;
  failed_at: number | null;
  failure_reason: string | null;
  metadata: string | null;
  created_at: number;
  updated_at: number;
}

export function listPayouts(filters?: { status?: PayoutStatus; payee_id?: string; provider?: PayoutProvider }, workspace = "default"): Payout[] {
  let sql = `SELECT * FROM payouts WHERE workspace = ?`;
  const params: unknown[] = [workspace];
  if (filters?.status) { sql += ` AND status = ?`; params.push(filters.status); }
  if (filters?.payee_id) { sql += ` AND payee_id = ?`; params.push(filters.payee_id); }
  if (filters?.provider) { sql += ` AND provider = ?`; params.push(filters.provider); }
  sql += ` ORDER BY created_at DESC`;
  return db.prepare(sql).all(...params) as Payout[];
}

export function getPayout(id: string): Payout | undefined {
  return db.prepare(`SELECT * FROM payouts WHERE id = ?`).get(id) as Payout | undefined;
}

export function createPayout(input: {
  payee_type: PayeeType;
  payee_id: string;
  payee_name: string;
  amount: number;
  currency?: string;
  fx_rate?: number;
  provider?: PayoutProvider;
  payroll_run_id?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}): string {
  const id = uid("pay_");
  const currency = input.currency || "USD";
  const fxRate = input.fx_rate || 1.0;
  const amountUsd = currency === "USD" ? input.amount : Math.round(input.amount * fxRate * 100) / 100;

  db.prepare(`
    INSERT INTO payouts (id, workspace, payee_type, payee_id, payee_name, amount, currency,
      fx_rate, amount_usd, provider, status, payroll_run_id, description, metadata, created_at, updated_at)
    VALUES (?, 'default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    input.payee_type,
    input.payee_id,
    input.payee_name,
    input.amount,
    currency,
    fxRate,
    amountUsd,
    input.provider || "manual",
    "draft",
    input.payroll_run_id || null,
    input.description || null,
    input.metadata ? JSON.stringify(input.metadata) : null,
    now(),
    now(),
  );
  return id;
}

/** Submit a draft payout to the provider. */
export async function submitPayout(id: string): Promise<PayoutStatus> {
  const payout = getPayout(id);
  if (!payout) throw new Error("Payout not found");
  if (payout.status !== "draft") throw new Error(`Payout is ${payout.status}, not draft`);

  // Update status to processing
  db.prepare(`UPDATE payouts SET status = 'processing', updated_at = ? WHERE id = ?`).run(now(), id);

  try {
    switch (payout.provider) {
      case "plaid":
        await submitPlaidPayout(payout);
        break;
      case "revolut":
        await submitRevolutPayout(payout);
        break;
      case "wise":
        await submitWisePayout(payout);
        break;
      case "manual":
        // Manual payouts are marked completed immediately
        db.prepare(`UPDATE payouts SET status = 'completed', paid_at = ?, updated_at = ? WHERE id = ?`).run(now(), now(), id);
        writeJournalEntry(payout);
        return "completed";
      case "crypto":
        // Crypto payouts are marked pending until confirmed on-chain
        db.prepare(`UPDATE payouts SET status = 'pending', updated_at = ? WHERE id = ?`).run(now(), id);
        return "pending";
      default:
        throw new Error(`Unknown provider: ${payout.provider}`);
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    db.prepare(`UPDATE payouts SET status = 'failed', failure_reason = ?, failed_at = ?, updated_at = ? WHERE id = ?`).run(msg, now(), now(), id);
    return "failed";
  }

  db.prepare(`UPDATE payouts SET status = 'pending', updated_at = ? WHERE id = ?`).run(now(), id);
  return "pending";
}

async function submitPlaidPayout(payout: Payout): Promise<void> {
  // In production, this would call Plaid's Transfer API:
  // POST /transfer/authorization/create → POST /transfer/create
  // For now, simulate the call
  const { plaidConfig } = await import("./connectors/plaid");
  const cfg = plaidConfig();
  if (!cfg.configured) throw new Error("Plaid not configured — set PLAID_CLIENT_ID and PLAID_SECRET");

  // Simulate: mark as completed after "processing"
  db.prepare(`UPDATE payouts SET provider_transfer_id = ?, status = 'completed', paid_at = ?, updated_at = ? WHERE id = ?`)
    .run(`plaid_${Date.now()}`, now(), now(), payout.id);
  writeJournalEntry(payout);
}

async function submitRevolutPayout(payout: Payout): Promise<void> {
  // In production, this would call Revolut's Payment API:
  // POST /pay with recipient, amount, currency
  const { revolutConfig } = await import("./connectors/revolut");
  const cfg = revolutConfig();
  if (!cfg.configured) throw new Error("Revolut not configured — set REVOLUT_CLIENT_ID and REVOLUT_PRIVATE_KEY_PATH");

  db.prepare(`UPDATE payouts SET provider_transfer_id = ?, status = 'completed', paid_at = ?, updated_at = ? WHERE id = ?`)
    .run(`revolut_${Date.now()}`, now(), now(), payout.id);
  writeJournalEntry(payout);
}

async function submitWisePayout(payout: Payout): Promise<void> {
  // Wise (TransferWise) integration placeholder
  // In production: POST /v1/transfers with profile, recipient, amount
  db.prepare(`UPDATE payouts SET provider_transfer_id = ?, status = 'pending', updated_at = ? WHERE id = ?`)
    .run(`wise_${Date.now()}`, now(), payout.id);
}

function writeJournalEntry(payout: Payout) {
  const cashAccount = payout.currency === "EUR" ? "1120" : payout.currency === "GBP" ? "1130" : "1100";
  createJournalEntry({
    workspace: payout.workspace,
    txn_date: payout.paid_at || now(),
    description: `Payout to ${payout.payee_name} (${payout.provider})`,
    reference: payout.id,
    source: "payout",
    source_id: payout.id,
    currency: payout.currency,
    lines: [
      { account_code: "6100", debit: payout.amount, amount_currency: payout.amount, currency: payout.currency, memo: `Payout: ${payout.payee_name}` },
      { account_code: cashAccount, credit: payout.amount, amount_currency: payout.amount, currency: payout.currency },
    ],
  });
}

/** Mark a payout as completed (e.g. webhook callback from provider). */
export function completePayout(id: string, providerTransferId: string): void {
  const payout = getPayout(id);
  if (!payout) throw new Error("Payout not found");
  db.prepare(`UPDATE payouts SET status = 'completed', provider_transfer_id = ?, paid_at = ?, updated_at = ? WHERE id = ?`)
    .run(providerTransferId, now(), now(), id);
  writeJournalEntry(payout);
}

/** Mark a payout as failed. */
export function failPayout(id: string, reason: string): void {
  db.prepare(`UPDATE payouts SET status = 'failed', failure_reason = ?, failed_at = ?, updated_at = ? WHERE id = ?`)
    .run(reason, now(), now(), id);
}

/** Payout summary stats. */
export function payoutSummary(workspace = "default"): { total_paid_usd: number; total_pending_usd: number; total_failed_usd: number; by_provider: Record<string, number>; this_month_usd: number } {
  const rows = db.prepare(`SELECT status, provider, amount_usd, amount, currency, created_at FROM payouts WHERE workspace = ?`).all(workspace) as Array<{ status: string; provider: string; amount_usd: number | null; amount: number; currency: string; created_at: number }>;
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  let totalPaid = 0, totalPending = 0, totalFailed = 0, thisMonth = 0;
  const byProvider: Record<string, number> = {};

  for (const r of rows) {
    const usd = r.amount_usd || (r.currency === "USD" ? r.amount : r.amount);
    if (r.status === "completed") totalPaid += usd;
    else if (r.status === "pending" || r.status === "processing") totalPending += usd;
    else if (r.status === "failed" || r.status === "returned") totalFailed += usd;
    byProvider[r.provider] = (byProvider[r.provider] || 0) + usd;
    if (r.created_at >= monthStart.getTime()) thisMonth += usd;
  }

  return {
    total_paid_usd: Math.round(totalPaid * 100) / 100,
    total_pending_usd: Math.round(totalPending * 100) / 100,
    total_failed_usd: Math.round(totalFailed * 100) / 100,
    by_provider: byProvider,
    this_month_usd: Math.round(thisMonth * 100) / 100,
  };
}

/** Batch-create payouts for a payroll run. */
export function createPayoutsFromPayrollRun(runId: string, lines: Array<{ employee_id: string; employee_name: string; net: number; currency: string }>, provider: PayoutProvider = "manual"): string[] {
  const ids: string[] = [];
  for (const line of lines) {
    const id = createPayout({
      payee_type: "employee",
      payee_id: line.employee_id,
      payee_name: line.employee_name,
      amount: line.net,
      currency: line.currency,
      provider,
      payroll_run_id: runId,
      description: `Payroll payout — ${runId}`,
    });
    ids.push(id);
  }
  return ids;
}

/** Batch-create payouts for contractors. */
export function createPayoutsForContractors(contractorIds: string[], provider: PayoutProvider = "manual"): string[] {
  const ids: string[] = [];
  for (const cid of contractorIds) {
    const c = getContractor(cid);
    if (!c || c.onboarding_status !== "active" || c.compliance_status !== "verified") continue;
    const amount = c.rate_type === "monthly" ? c.rate_amount : c.rate_type === "hourly" ? c.rate_amount * 160 : c.rate_amount;
    const id = createPayout({
      payee_type: "contractor",
      payee_id: c.id,
      payee_name: c.name,
      amount,
      currency: c.rate_currency,
      provider: provider || (c.payment_method as PayoutProvider),
      description: `${c.rate_type} payout — ${c.name}`,
    });
    ids.push(id);
  }
  return ids;
}