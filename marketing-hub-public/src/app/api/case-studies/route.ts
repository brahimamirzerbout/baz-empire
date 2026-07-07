import { json } from "@/lib/api-helpers";
import { CASES } from "@/app/case-studies/_data";

export const dynamic = "force-dynamic";
export async function GET() {
  return json({ rows: CASES });
}
