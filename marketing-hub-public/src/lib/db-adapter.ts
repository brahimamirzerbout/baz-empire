/**
 * Database Adapter — SQLite locally, Supabase in production
 * 
 * When SUPABASE_URL and SUPABASE_ANON_KEY are set, uses Supabase.
 * Otherwise, falls back to better-sqlite3 for local development.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabase = !!supabaseUrl && !!supabaseKey && !supabaseUrl.includes("REPLACE");

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabase) {
    // Production safety: better-sqlite3 cannot persist on Vercel serverless.
    // Fail loud if Supabase isn't configured in production; local dev uses SQLite.
    if (process.env.VERCEL) {
      throw new Error(
        "[db-adapter] Production (Vercel) requires SUPABASE_URL and SUPABASE_ANON_KEY env vars. " +
          "Set them in the Vercel project (see DEPLOY.md). better-sqlite3 does not work on serverless.",
      );
    }
    return null;
  }
  if (!client) {
    client = createClient(supabaseUrl!, supabaseKey!);
  }
  return client;
}

// Helper: execute a query on either SQLite or Supabase
// For Supabase, this translates basic SQL to Supabase client calls
// For local dev, it uses better-sqlite3 directly (via the existing db export)
export async function query(table: string, options?: {
  select?: string;
  where?: Record<string, any>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  single?: boolean;
}) {
  const supabase = getSupabase();
  if (supabase) {
    let q = supabase.from(table).select(options?.select || "*");
    if (options?.where) {
      for (const [key, value] of Object.entries(options.where)) {
        q = q.eq(key, value);
      }
    }
    if (options?.order) {
      q = q.order(options.order.column, { ascending: options.order.ascending ?? false });
    }
    if (options?.limit) {
      q = q.limit(options.limit);
    }
    if (options?.single) {
      const { data, error } = await q.single();
      if (error) throw error;
      return data;
    }
    const { data, error } = await q;
    if (error) throw error;
    return data;
  }
  // Fallback: return null — caller should use SQLite directly
  return null;
}

// Helper: insert a row
export async function insert(table: string, data: Record<string, any>) {
  const supabase = getSupabase();
  if (supabase) {
    const { data: result, error } = await supabase.from(table).insert(data).select().single();
    if (error) throw error;
    return result;
  }
  return null;
}

// Helper: update a row
export async function update(table: string, id: string, data: Record<string, any>) {
  const supabase = getSupabase();
  if (supabase) {
    const { data: result, error } = await supabase.from(table).update(data).eq("id", id).select().single();
    if (error) throw error;
    return result;
  }
  return null;
}

// Helper: delete a row
export async function remove(table: string, id: string) {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
    return true;
  }
  return false;
}
