import { json } from "@/lib/api-helpers";
import { FORMULAS, FORMULAS_BY_CATEGORY } from "@/lib/library";

export const dynamic = "force-dynamic";

/**
 * GET /api/public/v1/library
 *   ?category=<cat>&limit=<n>
 *
 * Public read-only access to the codified marketing formulas (modern set).
 * No auth.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100", 10) || 100, 500);

  let formulas = FORMULAS;
  if (category)
    formulas = FORMULAS_BY_CATEGORY[category as keyof typeof FORMULAS_BY_CATEGORY] || [];

  // Strip heavy fields (formula text, computed examples) to keep payloads light.
  const rows = formulas.slice(0, limit).map((f) => ({
    id: f.id,
    name: f.name,
    category: f.category,
    short: f.short,
    when: f.when,
    inputs: f.inputs?.map((i) => ({ name: i.name, label: i.label, type: i.type })),
  }));

  return json({
    rows,
    total: formulas.length,
    categories: Object.keys(FORMULAS_BY_CATEGORY),
  });
}
