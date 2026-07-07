import { json } from "@/lib/api-helpers";
import { macroTrends, microTrends, adoptionCurves } from "@/lib/trends";

export const dynamic = "force-dynamic";

/**
 * GET /api/public/v1/trends
 *   ?view=<macro|micro|curves|all>
 *
 * Public read-only access to the trend monitor (macro + micro + adoption curves).
 * No auth.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const view = url.searchParams.get("view") || "all";

  const payload: Record<string, unknown> = {};
  if (view === "macro" || view === "all") payload.macro = macroTrends();
  if (view === "micro" || view === "all") payload.micro = microTrends();
  if (view === "curves" || view === "all") payload.curves = adoptionCurves();

  return json({
    view,
    counts: {
      macro: payload.macro?.length ?? 0,
      micro: payload.micro?.length ?? 0,
      curves: payload.curves?.length ?? 0,
    },
    data: payload,
    generated_at: new Date().toISOString(),
  });
}
