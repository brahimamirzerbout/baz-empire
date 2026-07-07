import { NextRequest } from "next/server";
import { json } from "@/lib/api-helpers";
import { listArticles } from "@/lib/marketingDive";

export const dynamic = "force-dynamic";

/**
 * GET /api/dive/articles?topic=creative&format=column&q=brand&limit=30
 * Reads the cached Marketing Dive feed.
 */
export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  return json(
    listArticles({
      topic: u.searchParams.get("topic") ?? undefined,
      format: u.searchParams.get("format") ?? undefined,
      q: u.searchParams.get("q") ?? undefined,
      limit: Number(u.searchParams.get("limit") || 30),
      offset: Number(u.searchParams.get("offset") || 0),
    }),
  );
}
