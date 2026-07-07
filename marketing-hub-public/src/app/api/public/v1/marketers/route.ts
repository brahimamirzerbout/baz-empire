import { json } from "@/lib/api-helpers";
import { listMarketers } from "@/lib/orchestrator";

export const dynamic = "force-dynamic";

/**
 * GET /api/public/v1/marketers
 *   ?specialty=<str>&featured=<1>&search=<q>&limit=<n>
 *
 * Public read-only directory of marketers in the marketplace.
 * No auth. (Internal `workspace_id` fields are stripped.)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const specialty = url.searchParams.get("specialty") || undefined;
  const featured = url.searchParams.get("featured") === "1";
  const search = url.searchParams.get("search") || undefined;
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 200);

  const rows = listMarketers({ specialty, featured, search, limit }).map(
    (m: Record<string, unknown>) => ({
      slug: m.slug,
      name: m.name,
      headline: m.headline,
      bio: m.bio,
      avatar_url: m.avatar_url,
      specialties: m.specialties,
      industries: m.industries,
      availability: m.availability,
      rating: m.rating,
      reviews_count: m.reviews_count,
      wins_count: m.wins_count,
      is_featured: m.is_featured === 1 || m.is_featured === true,
      is_verified: m.is_verified === 1 || m.is_verified === true,
      social_links: m.social_links,
      hourly_rate_cents: m.hourly_rate_cents,
      monthly_rate_cents: m.monthly_rate_cents,
      currency: m.currency,
    }),
  );

  return json({
    rows,
    total: rows.length,
    filters: { specialty, featured, search, limit },
  });
}
