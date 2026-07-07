import { json } from "@/lib/api-helpers";
import { buildOrgChart } from "@/data/team";

export const dynamic = "force-dynamic";

// Public, unauthenticated. Returns the org chart grouped by department
// (Executive / Finance / Marketing) and by reporting line
// (CEO → CFO/CMO → VP → Director → Lead).
//
// Source of truth: src/data/team.ts (a static fixture). Seed.ts keeps the
// Hub `contacts` table in sync so private Hub views match.
export async function GET() {
  const org = buildOrgChart();
  return json({
    generated_at: new Date().toISOString(),
    org,
  });
}
