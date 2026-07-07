/**
 * Supabase Finance Client — PostgreSQL-backed agency operations.
 *
 * When SUPABASE_URL is set, the finance API routes use Supabase (PostgreSQL)
 * instead of SQLite. This module provides typed client functions for:
 *   - Contractors (international workers)
 *   - Payouts (payments via Plaid/Revolut/Wise)
 *   - Timesheets (billable hours tracking)
 *   - Invoices (client billing)
 *   - Project PnL (profitability)
 *
 * Uses the Supabase JS client for reads/writes and falls back to
 * SQLite (better-sqlite3) when Supabase is not configured.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) return null;
  if (!client) {
    client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: true },
      db: { schema: "public" },
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }
  return client;
}

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseKey;

// ─────────────────────────────────────────────────────────────────
// CONTRACTORS
// ─────────────────────────────────────────────────────────────────

export async function listContractorsSupabase(workspace = "default") {
  const sb = getSupabaseClient();
  if (!sb) return [];
  const { data, error } = await sb.from("contractors").select("*").eq("workspace", workspace).neq("status", "archived").order("name");
  if (error) { console.error("[supabase] listContractors:", error.message); return []; }
  return data || [];
}

export async function getContractorSupabase(id: string) {
  const sb = getSupabaseClient();
  if (!sb) return undefined;
  const { data, error } = await sb.from("contractors").select("*").eq("id", id).single();
  if (error) { console.error("[supabase] getContractor:", error.message); return undefined; }
  return data;
}

export async function createContractorSupabase(input: Record<string, unknown>) {
  const sb = getSupabaseClient();
  if (!sb) return null;
  const { data, error } = await sb.from("contractors").insert(input).select().single();
  if (error) { console.error("[supabase] createContractor:", error.message); return null; }
  return data;
}

export async function updateContractorSupabase(id: string, updates: Record<string, unknown>) {
  const sb = getSupabaseClient();
  if (!sb) return false;
  const { error } = await sb.from("contractors").update({ ...updates, updated_at: Date.now() }).eq("id", id);
  if (error) { console.error("[supabase] updateContractor:", error.message); return false; }
  return true;
}

// ─────────────────────────────────────────────────────────────────
// PAYOUTS
// ─────────────────────────────────────────────────────────────────

export async function listPayoutsSupabase(filters?: { status?: string; payee_id?: string; provider?: string }, workspace = "default") {
  const sb = getSupabaseClient();
  if (!sb) return [];
  let q = sb.from("payouts").select("*").eq("workspace", workspace);
  if (filters?.status) q = q.eq("status", filters.status);
  if (filters?.payee_id) q = q.eq("payee_id", filters.payee_id);
  if (filters?.provider) q = q.eq("provider", filters.provider);
  q = q.order("created_at", { ascending: false });
  const { data, error } = await q;
  if (error) { console.error("[supabase] listPayouts:", error.message); return []; }
  return data || [];
}

export async function createPayoutSupabase(input: Record<string, unknown>) {
  const sb = getSupabaseClient();
  if (!sb) return null;
  const { data, error } = await sb.from("payouts").insert(input).select().single();
  if (error) { console.error("[supabase] createPayout:", error.message); return null; }
  return data;
}

export async function updatePayoutSupabase(id: string, updates: Record<string, unknown>) {
  const sb = getSupabaseClient();
  if (!sb) return false;
  const { error } = await sb.from("payouts").update({ ...updates, updated_at: Date.now() }).eq("id", id);
  if (error) { console.error("[supabase] updatePayout:", error.message); return false; }
  return true;
}

// ─────────────────────────────────────────────────────────────────
// TIMESHEETS
// ─────────────────────────────────────────────────────────────────

export async function listTimesheetsSupabase(filters?: { person_id?: string; project_id?: string; client_id?: string; status?: string; from?: number; to?: number }, workspace = "default") {
  const sb = getSupabaseClient();
  if (!sb) return [];
  let q = sb.from("timesheets").select("*").eq("workspace", workspace);
  if (filters?.person_id) q = q.eq("person_id", filters.person_id);
  if (filters?.project_id) q = q.eq("project_id", filters.project_id);
  if (filters?.client_id) q = q.eq("client_id", filters.client_id);
  if (filters?.status) q = q.eq("status", filters.status);
  if (filters?.from) q = q.gte("date", filters.from);
  if (filters?.to) q = q.lte("date", filters.to);
  q = q.order("date", { ascending: false });
  const { data, error } = await q;
  if (error) { console.error("[supabase] listTimesheets:", error.message); return []; }
  return data || [];
}

export async function createTimesheetSupabase(input: Record<string, unknown>) {
  const sb = getSupabaseClient();
  if (!sb) return null;
  const { data, error } = await sb.from("timesheets").insert(input).select().single();
  if (error) { console.error("[supabase] createTimesheet:", error.message); return null; }
  return data;
}

export async function updateTimesheetSupabase(id: string, updates: Record<string, unknown>) {
  const sb = getSupabaseClient();
  if (!sb) return false;
  const { error } = await sb.from("timesheets").update({ ...updates, updated_at: Date.now() }).eq("id", id);
  if (error) { console.error("[supabase] updateTimesheet:", error.message); return false; }
  return true;
}

// ─────────────────────────────────────────────────────────────────
// INVOICES
// ─────────────────────────────────────────────────────────────────

export async function listInvoicesSupabase(filters?: { client_id?: string; status?: string }, workspace = "default") {
  const sb = getSupabaseClient();
  if (!sb) return [];
  let q = sb.from("client_invoices").select("*").eq("workspace", workspace);
  if (filters?.client_id) q = q.eq("client_id", filters.client_id);
  if (filters?.status) q = q.eq("status", filters.status);
  q = q.order("issue_date", { ascending: false });
  const { data, error } = await q;
  if (error) { console.error("[supabase] listInvoices:", error.message); return []; }
  return data || [];
}

export async function getInvoiceSupabase(id: string) {
  const sb = getSupabaseClient();
  if (!sb) return undefined;
  const { data, error } = await sb.from("client_invoices").select("*").eq("id", id).single();
  if (error) { console.error("[supabase] getInvoice:", error.message); return undefined; }
  return data;
}

export async function createInvoiceSupabase(input: Record<string, unknown>) {
  const sb = getSupabaseClient();
  if (!sb) return null;
  const { data, error } = await sb.from("client_invoices").insert(input).select().single();
  if (error) { console.error("[supabase] createInvoice:", error.message); return null; }
  return data;
}

export async function updateInvoiceSupabase(id: string, updates: Record<string, unknown>) {
  const sb = getSupabaseClient();
  if (!sb) return false;
  const { error } = await sb.from("client_invoices").update({ ...updates, updated_at: Date.now() }).eq("id", id);
  if (error) { console.error("[supabase] updateInvoice:", error.message); return false; }
  return true;
}

// ─────────────────────────────────────────────────────────────────
// PROJECT PNL
// ─────────────────────────────────────────────────────────────────

export async function listPnLSupabase(filters?: { client_id?: string; project_id?: string }, workspace = "default") {
  const sb = getSupabaseClient();
  if (!sb) return [];
  let q = sb.from("project_pnl").select("*").eq("workspace", workspace);
  if (filters?.client_id) q = q.eq("client_id", filters.client_id);
  if (filters?.project_id) q = q.eq("project_id", filters.project_id);
  q = q.order("period_start", { ascending: false });
  const { data, error } = await q;
  if (error) { console.error("[supabase] listPnL:", error.message); return []; }
  return data || [];
}

export async function createPnLSupabase(input: Record<string, unknown>) {
  const sb = getSupabaseClient();
  if (!sb) return null;
  const { data, error } = await sb.from("project_pnl").insert(input).select().single();
  if (error) { console.error("[supabase] createPnL:", error.message); return null; }
  return data;
}

// ─────────────────────────────────────────────────────────────────
// REALTIME SUBSCRIPTIONS
// ─────────────────────────────────────────────────────────────────

export function subscribeToTable(table: string, callback: (payload: Record<string, unknown>) => void) {
  const sb = getSupabaseClient();
  if (!sb) return () => {};
  const channel = sb
    .channel(`${table}-changes`)
    .on("postgres_changes", { event: "*", schema: "public", table }, callback)
    .subscribe();
  return () => { sb.removeChannel(channel); };
}