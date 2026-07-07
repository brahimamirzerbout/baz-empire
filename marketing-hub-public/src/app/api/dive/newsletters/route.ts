import { NextRequest } from "next/server";
import { json } from "@/lib/api-helpers";
import { listSubs, setSub, NEWSLETTERS } from "@/lib/marketingDiveNewsletters";

export const dynamic = "force-dynamic";

/** GET /api/dive/newsletters — list available + current user's subs. */
export async function GET() {
  // For now, "user" is single-tenant (use a fixed id). Real auth-aware later.
  const userId = "default";
  return json({ newsletters: NEWSLETTERS, subs: listSubs(userId) });
}

/** POST /api/dive/newsletters { newsletter_id, email, active } */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  if (!body?.newsletter_id || !body?.email)
    return json({ error: "newsletter_id + email required" }, 400);
  const r = setSub("default", body.newsletter_id, body.email, !!body.active);
  return json(r);
}
