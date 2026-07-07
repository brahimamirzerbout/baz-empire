/**
 * Nova Bridge — TypeScript client (browser-friendly).
 *
 * Use this from React components, hooks, or anywhere that runs in
 * the browser. Calls go through the Next.js route at /api/nova/delegate,
 * which handles auth + proxies to Python.
 *
 * Server-side code (route handlers, scripts, workers) should import
 * from "@/lib/nova-bridge/server" instead, which talks to Python
 * directly without the extra hop.
 */

export type NovaProfile = "default" | "researcher" | "coder" | "reviewer";

export interface NovaBridgeAnswer {
  ok: boolean;
  profile_used?: string;
  answer?: string;
  error?: string;
  trace_summary?: { step_count: number; tool_calls: number; errors: number };
  memory_recalled?: Array<{ text: string; kind: string; score?: number }>;
  bridge_url?: string;
  proxied_at?: number;
  generated_at?: number;
}

export interface NovaBridgeHealth {
  ok: boolean;
  bridge?: { ok: boolean; service: string; nova_home: string; ts: number };
  error?: string;
}

const NOVA_BASE = process.env.NEXT_PUBLIC_NOVA_BASE || "";

export async function checkNovaBridge(): Promise<NovaBridgeHealth> {
  try {
    const res = await fetch(`${NOVA_BASE}/api/nova/delegate`, {
      method: "GET",
      signal: AbortSignal.timeout(2000),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, bridge: data };
  } catch (e: unknown) {
    return { ok: false, error: `health check failed: ${e?.message || e}` };
  }
}

export async function delegateToNova(
  question: string,
  opts: { profile?: NovaProfile; context?: Record<string, any> } = {},
): Promise<NovaBridgeAnswer> {
  try {
    const res = await fetch(`${NOVA_BASE}/api/nova/delegate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        profile: opts.profile || "default",
        context: opts.context || {},
      }),
      signal: AbortSignal.timeout(8000),
    });
    return await res.json();
  } catch (e: unknown) {
    return { ok: false, error: `bridge call failed: ${e?.message || e}` };
  }
}
