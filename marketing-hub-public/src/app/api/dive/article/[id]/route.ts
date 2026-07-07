import { NextRequest } from "next/server";
import { json, err } from "@/lib/api-helpers";
import { getArticle } from "@/lib/marketingDive";

export const dynamic = "force-dynamic";

/** GET /api/dive/article/[id] — full row for a cached article. */
export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  const a = getArticle(ctx.params.id);
  if (!a) return err("not found", 404);
  return json(a);
}
