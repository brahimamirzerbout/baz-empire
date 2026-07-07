import { NextRequest } from "next/server";
import { json } from "@/lib/api-helpers";
import { listLibrary, seedLibrary, LIBRARY_FORMATS } from "@/lib/marketingDiveLibrary";

export const dynamic = "force-dynamic";

/**
 * GET /api/dive/library?format=playbook&topic=ai&q=...
 * POST /api/dive/library — body { items: [...] } bulk insert (idempotent).
 */
export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const items = listLibrary({
    format: u.searchParams.get("format") ?? undefined,
    topic: u.searchParams.get("topic") ?? undefined,
    q: u.searchParams.get("q") ?? undefined,
  });
  return json({ items, formats: LIBRARY_FORMATS });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  const items = Array.isArray(body?.items) ? body.items : [];
  const n = seedLibrary(items);
  return json({ seeded: n });
}
