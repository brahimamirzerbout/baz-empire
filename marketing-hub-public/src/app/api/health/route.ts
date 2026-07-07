/**
 * GET /api/health — liveness + readiness probe
 *
 * Public, no auth. Used by uptime monitors (Pingdom, UptimeRobot,
 * kubernetes livenessProbe, Docker HEALTHCHECK, etc).
 *
 * Returns 200 with payload when healthy, 503 when DB is broken.
 */
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const t0 = Date.now();
  let dbOk = true;
  let dbError: string | null = null;
  try {
    db.prepare("SELECT 1").get();
  } catch (e: unknown) {
    dbOk = false;
    dbError = e?.message || "unknown";
  }

  const status = dbOk ? "ok" : "degraded";
  const code = dbOk ? 200 : 503;
  return new Response(
    JSON.stringify({
      status,
      service: "marketing-hub",
      version: "1.0.0",
      uptime_check_ms: Date.now() - t0,
      db: { ok: dbOk, error: dbError },
      timestamp: new Date().toISOString(),
    }),
    {
      status: code,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    },
  );
}
