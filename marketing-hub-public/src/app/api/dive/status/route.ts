import { json } from "@/lib/api-helpers";
import { getDiveStatus } from "@/lib/marketingDive";

export const dynamic = "force-dynamic";

/** GET /api/dive/status — counts per topic, total, last fetch timestamp. */
export async function GET() {
  return json(getDiveStatus());
}
