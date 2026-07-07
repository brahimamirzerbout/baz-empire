import { json } from "@/lib/api-helpers";
import { BLOG_POSTS, getBlogPost, getRelatedPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

/**
 * GET /api/public/v1/blog
 *   ?slug=<id>            — single post (with body)
 *   ?category=<cat>       — filter by category
 *   ?tag=<tag>            — filter by tag
 *   ?limit=<n>            — max posts (default 50, cap 200)
 *   ?includeBody=<0|1>    — include full body (default 0 in list mode)
 *
 * Public read-only access to the BAZ Empire blog. No auth.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const category = url.searchParams.get("category");
  const tag = url.searchParams.get("tag");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 200);
  const includeBody = url.searchParams.get("includeBody") === "1";

  if (slug) {
    const post = getBlogPost(slug);
    if (!post) return json({ error: "Post not found" }, { status: 404 });
    return json({ post, related: getRelatedPosts(slug) });
  }

  let posts = BLOG_POSTS;
  if (category) posts = posts.filter((p) => p.category === category);
  if (tag) posts = posts.filter((p) => p.tags.includes(tag));

  const rows = posts
    .slice(0, limit)
    .map(({ body, ...rest }) => (includeBody ? { ...rest, body } : rest));

  return json({
    rows,
    total: posts.length,
    filters: { category, tag },
    rss: "/api/public/v1/blog/rss",
  });
}
