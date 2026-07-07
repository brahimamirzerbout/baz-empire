import { json } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/**
 * GET /api/public/v1/health
 * Public liveness probe. Returns 200 + payload so external monitors can verify.
 * No auth, no DB writes, no secrets.
 */
export async function GET() {
  return json({
    status: "ok",
    service: "marketing-hub",
    version: "1.0.0",
    public_api: "v1",
    docs: "/api/public/v1/docs",
    timestamp: new Date().toISOString(),
  });
}
