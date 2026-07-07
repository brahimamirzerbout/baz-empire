/**
 * Nova Bridge — Server-side client.
 *
 * Use this from Next.js route handlers, scripts, or workers.
 * Talks to the Python bridge directly via an absolute URL — no
 * relative-path resolution needed in Node.
 *
 * The browser-side equivalent is in `@/lib/nova-bridge` (the package
 * root). It calls through the route; this module bypasses the route
 * because we're IN the route.
 */

const BRIDGE_URL = process.env.NOVA_BRIDGE_URL || "http://127.0.0.1:8081";

export type NovaProfile = "default" | "researcher" | "coder" | "reviewer";

export interface NovaBridgeAnswer {
  ok: boolean;
  profile_used?: string;
  answer?: string;
  error?: string;
  trace_summary?: { step_count: number; tool_calls: number; errors: number };
  memory_recalled?: Array<{ text: string; kind: string; score?: number }>;
  bridge_url?: string;
  generated_at?: number;
}

export interface NovaBridgeHealth {
  ok: boolean;
  bridge?: { ok: boolean; service: string; nova_home: string; ts: number };
  error?: string;
}

export async function checkNovaBridge(): Promise<NovaBridgeHealth> {
  try {
    const res = await fetch(`${BRIDGE_URL}/health`, {
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
    const res = await fetch(`${BRIDGE_URL}/delegate`, {
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
