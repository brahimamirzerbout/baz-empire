import { json } from "@/lib/api-helpers";
import { runTriangleTick, recordTickResult } from "@/lib/triangle";

export const dynamic = "force-dynamic";

/**
 * POST /api/triangle/run — manually fire one tick of the autonomous loop.
 * The scheduler runs it every 60s automatically; this endpoint exists so
 * operators can trigger it on-demand and so the cockpit "Run now" button works.
 */
export async function POST() {
  const r = await runTriangleTick();
  recordTickResult(r);
  return json(r);
}
