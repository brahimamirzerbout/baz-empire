/**
 * Marketing Dive ingest + read API.
 *
 * Scrapes marketingdive.com once, caches articles + topic pages in SQLite,
 * exposes them through the Wire so the Triangle loop can use real industry
 * intelligence when scoring/positioning.
 *
 * Topics we follow (the actual vertical taxonomy from marketingdive.com):
 *   brand-strategy · creative · mobile-marketing · social-media-marketing
 *   video-marketing · agencies · cmo-corner · analytics · marketing-tech
 *   influencer-marketing
 *
 * Formats (from real article HTML):
 *   news · opinion · column · qa · sociable · campaign-trail · deep-dive · trendline
 */
import { db, now, uid } from "@/lib/db";

export const DIVE_TOPICS = [
  { id: "brand-strategy", label: "Brand Strategy" },
  { id: "creative", label: "Creative" },
  { id: "mobile-marketing", label: "Mobile Marketing" },
  { id: "social-media-marketing", label: "Social Media" },
  { id: "video-marketing", label: "Video Marketing" },
  { id: "agencies", label: "Agencies" },
  { id: "cmo-corner", label: "CMO Corner" },
  { id: "analytics", label: "Data/Analytics" },
  { id: "marketing-tech", label: "Marketing Tech" },
  { id: "influencer-marketing", label: "Influencer Marketing" },
];

export const DIVE_FORMATS = [
  "news",
  "opinion",
  "column",
  "qa",
  "sociable",
  "campaign-trail",
  "deep-dive",
  "trendline",
];

export interface DiveArticle {
  id: string;
  title: string;
  url: string;
  topic: string;
  format: string; // news | opinion | column | qa | sociable | campaign-trail
  dek: string | null; // 1-2 sentence subhead
  author: string | null;
  image_url: string | null;
  image_credit: string | null;
  published_at: number;
  is_updated: number; // 1 if article shows an "Updated" date
  updated_at: number | null;
  fetched_at: number;
}

/* ────────────────────────────  ingest  ──────────────────────────── */

const HOME = "https://www.marketingdive.com";

/**
 * Fetch a topic page and parse article cards out of it. We do this with
 * regex on the HTML — no cheerio dep, ships with Node.
 */
async function scrapeTopicPage(topic: string, page = 1): Promise<Array<Partial<DiveArticle>>> {
  const url = page === 1 ? `${HOME}/topic/${topic}/` : `${HOME}/topic/${topic}/?page=${page}`;
  let html = "";
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "MarketingHub/1.0 (+local dev)" },
      // Cache at the edge for 5 minutes if the CDN honors it
      signal: AbortSignal.timeout(15_000),
    } as Record<string, unknown>);
    if (!res.ok) return [];
    html = await res.text();
  } catch {
    return [];
  }

  const out: Array<Partial<DiveArticle>> = [];
  // Article cards on a topic page look like:
  //   <div class="...columns"><div class="label label--medium">Column</div><h3>Title</h3></div>
  //   <a class="feed__image" href="/news/<slug>/<id>/"><img.../></a>
  // The format badge sits BEFORE the image anchor, so we look back.
  const cardRe = /<a[^>]+class="feed__image"[^>]+href="\/news\/([^/]+)\/(\d+)\/"/g;
  let m: RegExpExecArray | null;
  while ((m = cardRe.exec(html))) {
    const [, slug, id] = m;
    const liStart = html.lastIndexOf('<li class="row feed__item">', m.index);
    const liEnd = html.indexOf("</li>", m.index);
    const cardHtml =
      liStart >= 0 && liEnd > 0
        ? html.slice(liStart, liEnd)
        : html.slice(Math.max(0, m.index - 3000), m.index + 1500);
    // Title: the <h3> inside THIS card (not the previous one's).
    const headMatch = cardHtml.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
    const titleRaw = headMatch ? headMatch[1].replace(/<[^>]+>/g, "") : "";
    let title = decodeEntities(titleRaw);
    if (!title) title = decodeEntities(slug.replace(/-/g, " "));
    // Image: the first img inside the card.
    const imgMatch = cardHtml.match(/<img[^>]+(?:src|data-src)="([^"]+)"/);
    let format = "news";
    // Find the FIRST non-library label inside this card.
    const labelRe = /<div[^>]*class="[^"]*\blabel\b[^"]*"[^>]*>\s*([A-Za-z &-]+?)\s*<\/div>/gi;
    let firstLabel = "";
    let lm: RegExpExecArray | null;
    while ((lm = labelRe.exec(cardHtml))) {
      const v = lm[1].trim();
      if (
        /Playbook|Webinar|Report|Infographic|Survey|Trendline|Virtual Event|Industry Report|Industry Intel/i.test(
          v,
        )
      )
        continue;
      firstLabel = v;
      break;
    }
    if (/Campaign Trail/i.test(firstLabel)) format = "campaign-trail";
    else if (/Sociable/i.test(firstLabel)) format = "sociable";
    else if (/^Q&A$|Q&amp;A/i.test(firstLabel)) format = "qa";
    else if (/Column/i.test(firstLabel)) format = "column";
    else if (/Opinion/i.test(firstLabel)) format = "opinion";

    out.push({
      id: `md_${id}`,
      title,
      url: `${HOME}/news/${slug}/${id}/`,
      topic,
      format,
      image_url: imgMatch ? imgMatch[1] : null,
      published_at: now(),
      fetched_at: now(),
    });
  }
  return out;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * One ingest pass: walk all topics + the homepage, upsert everything.
 * Returns a small summary for the cockpit.
 */
export async function ingestMarketingDive(opts: { maxPagesPerTopic?: number } = {}): Promise<{
  topics_scanned: number;
  fetched: number;
  inserted: number;
  updated: number;
  errors: string[];
}> {
  const maxPages = opts.maxPagesPerTopic ?? 1;
  const summary = {
    topics_scanned: 0,
    fetched: 0,
    inserted: 0,
    updated: 0,
    errors: [] as string[],
  };

  // Homepage (top stories / latest)
  try {
    const home = await scrapeHomepage();
    summary.fetched += home.length;
    const r = upsertArticles(home, "home");
    summary.inserted += r.inserted;
    summary.updated += r.updated;
  } catch (e: unknown) {
    summary.errors.push(`home: ${e?.message ?? e}`);
  }

  // Topic pages
  for (const t of DIVE_TOPICS) {
    summary.topics_scanned++;
    for (let p = 1; p <= maxPages; p++) {
      try {
        const rows = await scrapeTopicPage(t.id, p);
        summary.fetched += rows.length;
        if (rows.length === 0) break;
        const r = upsertArticles(rows, t.id);
        summary.inserted += r.inserted;
        summary.updated += r.updated;
      } catch (e: unknown) {
        summary.errors.push(`${t.id}: ${e?.message ?? e}`);
      }
    }
  }

  return summary;
}

async function scrapeHomepage(): Promise<Array<Partial<DiveArticle>>> {
  let html = "";
  try {
    const res = await fetch(HOME + "/", {
      headers: { "user-agent": "MarketingHub/1.0 (+local dev)" },
      signal: AbortSignal.timeout(15_000),
    } as Record<string, unknown>);
    if (!res.ok) return [];
    html = await res.text();
  } catch {
    return [];
  }

  const out: Array<Partial<DiveArticle>> = [];
  const cardRe = /<a[^>]+class="feed__image"[^>]+href="\/news\/([^/]+)\/(\d+)\/"/g;
  let m: RegExpExecArray | null;
  while ((m = cardRe.exec(html))) {
    const [, slug, id] = m;
    const liStart = html.lastIndexOf('<li class="row feed__item">', m.index);
    const liEnd = html.indexOf("</li>", m.index);
    const cardHtml =
      liStart >= 0 && liEnd > 0
        ? html.slice(liStart, liEnd)
        : html.slice(Math.max(0, m.index - 3000), m.index + 1500);
    const h3 = cardHtml.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
    const img = cardHtml.match(/<img[^>]+(?:src|data-src)="([^"]+)"/);
    let format = "news";
    const labelRe = /<div[^>]*class="[^"]*\blabel\b[^"]*"[^>]*>\s*([A-Za-z &-]+?)\s*<\/div>/gi;
    let firstLabel = "";
    let lm: RegExpExecArray | null;
    while ((lm = labelRe.exec(cardHtml))) {
      const v = lm[1].trim();
      if (
        /Playbook|Webinar|Report|Infographic|Survey|Trendline|Virtual Event|Industry Report|Industry Intel/i.test(
          v,
        )
      )
        continue;
      firstLabel = v;
      break;
    }
    if (/Campaign Trail/i.test(firstLabel)) format = "campaign-trail";
    else if (/Sociable/i.test(firstLabel)) format = "sociable";
    else if (/^Q&A$|Q&amp;A/i.test(firstLabel)) format = "qa";
    else if (/Column/i.test(firstLabel)) format = "column";
    else if (/Opinion/i.test(firstLabel)) format = "opinion";
    out.push({
      id: `md_${id}`,
      title: h3
        ? decodeEntities(h3[1].replace(/<[^>]+>/g, ""))
        : decodeEntities(slug.replace(/-/g, " ")),
      url: `${HOME}/news/${slug}/${id}/`,
      topic: "home",
      format,
      image_url: img ? img[1] : null,
      published_at: now(),
      fetched_at: now(),
    });
  }
  // de-dupe
  const seen = new Set<string>();
  return out.filter((a) => (seen.has(a.id!) ? false : (seen.add(a.id!), true)));
}

/* ────────────────────────────  storage  ──────────────────────────── */

function ensureSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS dive_articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      topic TEXT NOT NULL,
      format TEXT NOT NULL DEFAULT 'news',
      dek TEXT,
      author TEXT,
      image_url TEXT,
      image_credit TEXT,
      published_at INTEGER NOT NULL,
      is_updated INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER,
      fetched_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_dive_topic ON dive_articles(topic);
    CREATE INDEX IF NOT EXISTS idx_dive_published ON dive_articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_dive_format ON dive_articles(format);
  `);
}

function upsertArticles(rows: Array<Partial<DiveArticle>>, defaultTopic: string) {
  ensureSchema();
  const insert = db.prepare(`
    INSERT INTO dive_articles (id, title, url, topic, format, image_url, published_at, fetched_at)
    VALUES (@id, @title, @url, @topic, @format, @image_url, @published_at, @fetched_at)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      topic = excluded.topic,
      format = excluded.format,
      image_url = COALESCE(excluded.image_url, dive_articles.image_url),
      fetched_at = excluded.fetched_at
  `);

  let inserted = 0,
    updated = 0;
  const tx = db.transaction(() => {
    for (const r of rows) {
      if (!r.id || !r.title || !r.url) continue;
      const existing = db.prepare(`SELECT id FROM dive_articles WHERE id = ?`).get(r.id);
      insert.run({
        id: r.id,
        title: r.title,
        url: r.url,
        topic: r.topic || defaultTopic,
        format: r.format || "news",
        image_url: r.image_url || null,
        published_at: r.published_at || now(),
        fetched_at: now(),
      });
      if (existing) updated++;
      else inserted++;
    }
  });
  tx();
  return { inserted, updated };
}

/* ────────────────────────────  read  ──────────────────────────── */

export function listArticles(
  opts: {
    topic?: string;
    format?: string;
    q?: string;
    limit?: number;
    offset?: number;
  } = {},
) {
  ensureSchema();
  const where: string[] = [];
  const params: Record<string, unknown>[] = [];
  if (opts.topic && opts.topic !== "all") {
    where.push("topic = ?");
    params.push(opts.topic);
  }
  if (opts.format && opts.format !== "all") {
    where.push("format = ?");
    params.push(opts.format);
  }
  if (opts.q) {
    where.push("(title LIKE ? OR url LIKE ?)");
    params.push(`%${opts.q}%`, `%${opts.q}%`);
  }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const limit = Math.min(opts.limit ?? 30, 100);
  const offset = opts.offset ?? 0;
  const rows = db
    .prepare(
      `
    SELECT * FROM dive_articles ${w}
    ORDER BY published_at DESC LIMIT ? OFFSET ?
  `,
    )
    .all(...params, limit, offset) as Record<string, unknown>[];
  const total =
    (db.prepare(`SELECT COUNT(*) AS n FROM dive_articles ${w}`).get(...params) as { n: number } | undefined)?.n || 0;
  return { rows, total };
}

export function getArticle(id: string) {
  ensureSchema();
  return db.prepare(`SELECT * FROM dive_articles WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
}

export function getDiveStatus() {
  ensureSchema();
  const lastFetch = db.prepare(`SELECT MAX(fetched_at) AS at FROM dive_articles`).get() as Record<string, unknown> | undefined;
  const counts = db
    .prepare(
      `
    SELECT topic, COUNT(*) AS n FROM dive_articles GROUP BY topic
  `,
    )
    .all() as Record<string, unknown>[];
  return {
    last_fetch_at: lastFetch?.at ?? null,
    by_topic: counts,
    total: counts.reduce((s, c) => s + c.n, 0),
  };
}
