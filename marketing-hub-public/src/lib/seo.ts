export interface SeoIssue {
  level: "error" | "warning" | "info";
  message: string;
  rule: string;
}

export interface SeoAuditResult {
  url: string;
  score: number;
  issues: SeoIssue[];
  metrics: {
    titleLen: number;
    descLen: number;
    h1Count: number;
    wordCount: number;
    hasCanonical: boolean;
    hasViewport: boolean;
    hasOgImage: boolean;
    hasSchema: boolean;
    imagesMissingAlt: number;
    internalLinks: number;
    externalLinks: number;
  };
}

// Minimal, dependency-free HTML extraction
function tag(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? (m[1] ?? "").trim() : null;
}
function tags(html: string, re: RegExp): string[] {
  return Array.from(html.matchAll(re))
    .map((m) => (m[1] ?? "").trim())
    .filter(Boolean);
}

export function auditHtml(html: string, url: string): SeoAuditResult {
  const issues: SeoIssue[] = [];
  const lower = html.toLowerCase();

  const title = tag(html, /<title[^>]*>([\s\S]*?)<\/title>/i) ?? "";
  const desc =
    tag(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ??
    tag(html, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i) ??
    "";
  const canonical = !!tag(html, /<link[^>]+rel=["']canonical["']/i);
  const viewport = !!tag(html, /<meta[^>]+name=["']viewport["']/i);
  const ogImage = !!tag(html, /<meta[^>]+property=["']og:image["']/i);
  const schemaMatch = lower.match(/application\/ld\+json/);
  const hasSchema = !!schemaMatch;
  const h1s = tags(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  const imgs = tags(html, /<img[^>]*>/gi);
  const imagesMissingAlt = imgs.filter((i) => !/alt=/.test(i)).length;
  const allLinks = tags(html, /<a[^>]+href=["']([^"']+)["']/gi);
  const internalLinks = allLinks.filter(
    (l) => l.startsWith("/") || l.includes(url.replace(/^https?:\/\//, "")),
  ).length;
  const externalLinks = allLinks.length - internalLinks;
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyText = (bodyMatch?.[1] ?? html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = bodyText ? bodyText.split(/\s+/).length : 0;

  if (!title) issues.push({ level: "error", rule: "title", message: "Missing <title> tag" });
  else if (title.length < 30)
    issues.push({
      level: "warning",
      rule: "title",
      message: `Title is short (${title.length} chars). Aim for 50–60.`,
    });
  else if (title.length > 65)
    issues.push({
      level: "warning",
      rule: "title",
      message: `Title is long (${title.length} chars). Keep under 60.`,
    });

  if (!desc)
    issues.push({ level: "error", rule: "description", message: "Missing meta description" });
  else if (desc.length < 70)
    issues.push({
      level: "warning",
      rule: "description",
      message: `Meta description is short (${desc.length} chars). Aim for 120–155.`,
    });
  else if (desc.length > 160)
    issues.push({
      level: "warning",
      rule: "description",
      message: `Meta description is long (${desc.length} chars). Keep under 160.`,
    });

  if (h1s.length === 0) issues.push({ level: "error", rule: "h1", message: "No <h1> on page" });
  else if (h1s.length > 1)
    issues.push({
      level: "warning",
      rule: "h1",
      message: `Multiple <h1> tags (${h1s.length}). Use exactly one.`,
    });

  if (!canonical)
    issues.push({ level: "warning", rule: "canonical", message: "No canonical URL set" });
  if (!viewport)
    issues.push({
      level: "error",
      rule: "viewport",
      message: "Missing viewport meta (bad for mobile)",
    });
  if (!ogImage)
    issues.push({
      level: "info",
      rule: "og",
      message: "No og:image — social shares will look plain",
    });
  if (!hasSchema)
    issues.push({ level: "info", rule: "schema", message: "No JSON-LD structured data found" });
  if (imagesMissingAlt > 0)
    issues.push({
      level: "warning",
      rule: "alt",
      message: `${imagesMissingAlt} image(s) missing alt text`,
    });
  if (wordCount < 300)
    issues.push({
      level: "warning",
      rule: "content",
      message: `Thin content (${wordCount} words). Aim for 600+.`,
    });
  if (internalLinks < 3)
    issues.push({
      level: "info",
      rule: "links",
      message: `Only ${internalLinks} internal links. Add more to strengthen topical relevance.`,
    });

  // Score: 100 minus weighted penalties
  let score = 100;
  for (const i of issues) {
    score -= i.level === "error" ? 12 : i.level === "warning" ? 6 : 2;
  }
  score = Math.max(0, Math.min(100, score));

  return {
    url,
    score,
    issues,
    metrics: {
      titleLen: title.length,
      descLen: desc.length,
      h1Count: h1s.length,
      wordCount,
      hasCanonical: canonical,
      hasViewport: viewport,
      hasOgImage: ogImage,
      hasSchema,
      imagesMissingAlt,
      internalLinks,
      externalLinks,
    },
  };
}

export function generateSitemap(
  urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }>,
): string {
  const entries = urls
    .map(
      (u) => `<url>
  <loc>${escapeXml(u.loc)}</loc>
  ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
  ${u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : ""}
  ${u.priority != null ? `<priority>${u.priority}</priority>` : ""}
</url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

export function generateRobots(sitemapUrl?: string): string {
  return `User-agent: *
Allow: /
${sitemapUrl ? `\nSitemap: ${sitemapUrl}` : ""}`;
}

function escapeXml(s: string): string {
  return s.replace(
    /[<>&'"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!,
  );
}

export function keywordDifficulty(volume: number, position: number): number {
  // Toy formula: 30 baseline + position pressure + volume pressure
  const posScore = Math.min(60, Math.max(0, position * 6));
  const volScore = Math.min(40, Math.log10(Math.max(1, volume)) * 10);
  return Math.min(100, Math.round(posScore + volScore - 10));
}

export function keywordOpportunityScore(
  volume: number,
  difficulty: number,
  position: number,
): number {
  // Higher is better. Volume / difficulty ratio, boosted by closeness to top.
  const closeness = position > 0 && position <= 20 ? 1.5 : position <= 50 ? 1.1 : 0.9;
  const raw = (Math.log10(volume + 1) * 30) / Math.max(5, difficulty);
  return Math.round(raw * closeness * 10) / 10;
}
