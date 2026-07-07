import { json } from "@/lib/api-helpers";
import { DIVE_TOPICS, DIVE_FORMATS } from "@/lib/marketingDive";

export const dynamic = "force-dynamic";

/** GET /api/dive/topics — the full Marketing Dive vertical taxonomy. */
export async function GET() {
  return json({ topics: DIVE_TOPICS, formats: DIVE_FORMATS });
}
