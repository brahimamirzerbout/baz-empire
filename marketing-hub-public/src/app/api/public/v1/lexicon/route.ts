import { json } from "@/lib/api-helpers";
import { TERMS, HOT_TERMS, searchTerms, CATEGORY_LABELS } from "@/lib/lexicon";

export const dynamic = "force-dynamic";

/**
 * GET /api/public/v1/lexicon
 *   ?q=<search>&category=<cat>&limit=<n>
 *
 * Public read-only access to the marketing lexicon.
 * No auth. Rate-limited per-instance via standard Node limits.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  const category = url.searchParams.get("category");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100", 10) || 100, 500);

  let terms = TERMS;
  if (q) terms = searchTerms(q);
  if (category) terms = terms.filter((t) => t.category === category);

  // Strip the verbose body to keep payloads tight; clients fetch /:slug for full.
  const rows = terms.slice(0, limit).map((t) => ({
    slug: t.slug,
    name: t.name,
    short: t.short,
    category: t.category,
    category_label: CATEGORY_LABELS[t.category] ?? t.category,
    origin: t.origin,
    tags: t.tags,
    hot:
      (HOT_TERMS as readonly any[]).some((h: Record<string, unknown>) => h?.slug === t.slug) ||
      t.hot === true,
  }));

  return json({
    rows,
    total: terms.length,
    categories: Object.entries(CATEGORY_LABELS).map(([k, v]) => ({ id: k, label: v })),
    hot_count: HOT_TERMS.length,
  });
}
