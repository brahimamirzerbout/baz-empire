import { json } from "@/lib/api-helpers";
import { getLoopHealth } from "@/lib/triangle";

export const dynamic = "force-dynamic";

/**
 * GET /api/triangle/health — single payload the cockpit renders.
 * Tells you: is the loop alive? how many leads scored? active enrollments?
 * pipeline value? recent wins? velocity?
 */
export async function GET() {
  return json(getLoopHealth());
}
