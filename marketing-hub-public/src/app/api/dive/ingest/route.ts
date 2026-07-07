import { NextRequest } from "next/server";
import { json, err, readJson } from "@/lib/api-helpers";
import { ingestMarketingDive } from "@/lib/marketingDive";

export const dynamic = "force-dynamic";
// Scraping can take 10-30s across all topics.
export const maxDuration = 60;

/**
 * POST /api/dive/ingest — fetch + cache the latest Marketing Dive articles.
 * Body: { maxPagesPerTopic?: number } (default 1)
 */
export async function POST(req: NextRequest) {
  const body = await readJson<Record<string, unknown>>(req).catch(() => ({} as Record<string, unknown>));
  const maxPages = Math.min(Number(body?.maxPagesPerTopic || 1), 3);
  const r = await ingestMarketingDive({ maxPagesPerTopic: maxPages });
  return json(r);
}
