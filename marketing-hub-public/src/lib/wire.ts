/**
 * The Wire — daily marketing intelligence feed.
 *
 * Seeds a curated set of evergreen marketing articles + Nova takes. In a
 * future version, the lib can fetch from RSS/Atom or scrape specific
 * sources. Today the value is in the curated seed + Nova's per-workspace
 * relevance scoring + the "save as idea" loop that keeps the marketer in
 * flow.
 */
import { db } from "@/lib/db";

export type WireCategory =
  "strategy" | "copy" | "brand" | "growth" | "product" | "ai" | "seo" | "story" | "pricing";

export interface WireArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  author: string;
  published_at: number;
  category: WireCategory;
  summary: string;
  nova_take: string;
  relevance: number; // 0..100
  is_featured: number;
  is_read: number;
  is_saved: number;
  linked_idea_id?: string | null;
  created_at: number;
}

const SEEDS: Omit<
  WireArticle,
  "id" | "relevance" | "is_featured" | "is_read" | "is_saved" | "linked_idea_id" | "created_at"
>[] = [
  // strategy
  {
    title: "Strategy is what you choose NOT to do.",
    url: "https://seths.blog/2024/05/strategy/",
    source: "Seth's Blog",
    author: "Seth Godin",
    published_at: Date.now() - 2 * 86400000,
    category: "strategy",
    summary:
      "If everything is priority, nothing is. A short, sharp reminder that strategy is subtraction.",
    nova_take:
      "Open your strategy doc. Cross out three items. The remaining ones get your best week.",
  },
  {
    title: "The 7 Ps are still the work.",
    url: "https://www.kotlermarketing.com/",
    source: "Kotler Marketing",
    author: "Philip Kotler",
    published_at: Date.now() - 4 * 86400000,
    category: "strategy",
    summary:
      "Product, price, place, promotion, people, process, physical evidence. Walk each one. Ask: does this support the position, or undermine it?",
    nova_take:
      "Run the Strategist agent. Walk your top campaign against the 7 Ps. The gap that shows up is your week.",
  },
  {
    title: "Find the smallest viable audience.",
    url: "https://seths.blog/2018/04/the-smallest-viable-audience/",
    source: "Seth's Blog",
    author: "Seth Godin",
    published_at: Date.now() - 1 * 86400000,
    category: "story",
    summary:
      "If your story is for everyone, it's for no one. Find the 100 people who would recognize themselves immediately. Lead them first.",
    nova_take:
      "Open Personas. Pick ONE. Don't publish this week's campaign until it would make that one person stop scrolling.",
  },
  // copy
  {
    title: "Awareness stages — Schwartz in 2024.",
    url: "https://en.wikipedia.org/wiki/Breakthrough_Advertising",
    source: "Schwartz Notes",
    author: "Eugene Schwartz",
    published_at: Date.now() - 3 * 86400000,
    category: "copy",
    summary:
      "Your copy must match where the reader is, not where you wish they were. Five stages: most aware → product aware → solution aware → problem aware → completely unaware.",
    nova_take:
      "Run the Copywriter agent with awareness='problem_aware'. Compare against your last email subject line. Are you pitching to someone who doesn't know they have the problem yet?",
  },
  {
    title: "Specifics sell.",
    url: "https://www.copyblogger.com/",
    source: "Copyblogger",
    author: "Brian Clark",
    published_at: Date.now() - 6 * 86400000,
    category: "copy",
    summary:
      "'Lose 7 pounds in 14 days' beats 'lose weight fast'. Numbers, timeframes, names — they earn belief.",
    nova_take:
      "Take your last 5 headlines. How many have a number? Add one to each. Re-score the voice.",
  },
  // brand
  {
    title: "Permission marketing, still.",
    url: "https://seths.blog/2018/04/permission-marketing/",
    source: "Seth's Blog",
    author: "Seth Godin",
    published_at: Date.now() - 8 * 86400000,
    category: "brand",
    summary:
      "Marketing is the privilege of delivering anticipated, personal, relevant messages to people who actually want to get them.",
    nova_take:
      "Audit your last 10 emails. Are they anticipated? Personal? Relevant? Or are you shouting at a list that didn't opt in?",
  },
  {
    title: "Brand voice is a verb.",
    url: "https://www.intercom.com/blog/",
    source: "Intercom Blog",
    author: "Des Traynor",
    published_at: Date.now() - 5 * 86400000,
    category: "brand",
    summary:
      "A brand voice isn't a list of adjectives. It's how the brand shows up in 200 customer service replies.",
    nova_take:
      "Run your last 20 replies through /api/copy/voice. The score reveals whether your voice is a slogan or a muscle.",
  },
  // growth
  {
    title: "Activation > acquisition.",
    url: "https://lennysnewsletter.com/",
    source: "Lenny's Newsletter",
    author: "Lenny Rachitsky",
    published_at: Date.now() - 7 * 86400000,
    category: "growth",
    summary:
      "Most teams over-invest in acquisition and under-invest in activation. The fix is to measure day-7 retention before you measure signups.",
    nova_take:
      "Open Retention. Sort by W1. Which cohorts retained >40%? What did they share in common?",
  },
  {
    title: "The JTBD interview question that works.",
    url: "https://hbr.org/",
    source: "Harvard Business Review",
    author: "Clayton Christensen",
    published_at: Date.now() - 9 * 86400000,
    category: "product",
    summary:
      "'Tell me about the last time you [did the job]. Walk me through it.' Five questions, 15 minutes, more truth than a 50-question survey.",
    nova_take:
      "Run the Researcher agent. Use the 5 questions on your top 5 customers. Write the answers in one page. Share with the team.",
  },
  // ai
  {
    title: "AI for marketers: drafts, not decisions.",
    url: "https://www.gartner.com/",
    source: "Gartner",
    author: "Gartner Research",
    published_at: Date.now() - 10 * 86400000,
    category: "ai",
    summary:
      "AI is best at the first 80%. The last 20% — your taste, your judgment, your audience — is the work.",
    nova_take:
      "AI draft → you rewrite → you ship. Three steps. Skip the second step and your brand becomes a thousand other brands.",
  },
  // seo
  {
    title: "Topical authority beats keyword volume.",
    url: "https://ahrefs.com/blog/",
    source: "Ahrefs",
    author: "Tim Soulo",
    published_at: Date.now() - 11 * 86400000,
    category: "seo",
    summary:
      "Owning a topic cluster beats ranking for one keyword. Pick the cluster. Cover it fully. Then write the next one.",
    nova_take:
      "Open SEO. Group your keywords by cluster. Which cluster has the most depth? Which has the least? Pick the thin one. Write 5 articles this month.",
  },
  // pricing
  {
    title: "Decoy effect, still the cheapest test.",
    url: "https://www.behavioraleconomics.com/",
    source: "Behavioral Economics",
    author: "Dan Ariely",
    published_at: Date.now() - 12 * 86400000,
    category: "pricing",
    summary:
      "Add a third (deliberately worse) option. The middle option wins. No copy change required.",
    nova_take:
      "Open Pricing. Add a 'Platinum' tier above your current top tier. 2x the price, 80% the features. Watch the middle tier win.",
  },
  {
    title: "StoryBrand in 7 sentences.",
    url: "https://storybrand.com/",
    source: "StoryBrand",
    author: "Donald Miller",
    published_at: Date.now() - 14 * 86400000,
    category: "story",
    summary:
      "A character has a problem and meets a guide who gives them a plan and calls them to action that ends in success or avoids failure.",
    nova_take:
      "Use the StoryBrand framework in /copy. Drop the output into a /studio-pro social card. Ship in 5 minutes.",
  },
  {
    title: "The Remarkable IM ME test.",
    url: "https://seths.blog/2017/11/remarkable/",
    source: "Seth's Blog",
    author: "Seth Godin",
    published_at: Date.now() - 15 * 86400000,
    category: "brand",
    summary:
      "Remarkable = Incongruous, Minimal, Memorable, Endorsed, Emotional, Stories. If it doesn't pass, it doesn't spread.",
    nova_take: "Score your last campaign against IM ME. Which letter fails? That's the edit.",
  },
];

export function seedWire() {
  const count = (db.prepare(`SELECT COUNT(*) AS n FROM wire_articles`).get() as { n: number } | undefined)?.n || 0;
  if (count > 0) return { skipped: count };
  const now = Date.now();
  for (const a of SEEDS) {
    db.prepare(
      `
      INSERT INTO wire_articles
        (id, title, url, source, author, published_at, category, summary, nova_take, relevance, is_featured, is_read, is_saved, linked_idea_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, NULL, ?)
    `,
    ).run(
      uid("wa_"),
      a.title,
      a.url,
      a.source,
      a.author,
      a.published_at,
      a.category,
      a.summary,
      a.nova_take,
      now,
    );
  }
  return { seeded: SEEDS.length };
}

function uid(p: string) {
  return p + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function listArticles(opts?: {
  category?: string;
  unread?: boolean;
  featured?: boolean;
  limit?: number;
}) {
  const where: string[] = [];
  const args: Record<string, unknown>[] = [];
  if (opts?.category) {
    where.push("category = ?");
    args.push(opts.category);
  }
  if (opts?.unread) {
    where.push("is_read = 0");
  }
  if (opts?.featured) {
    where.push("is_featured = 1");
  }
  const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";
  const limit = opts?.limit || 50;
  return db
    .prepare(`SELECT * FROM wire_articles ${whereSql} ORDER BY published_at DESC LIMIT ?`)
    .all(...args, limit) as Record<string, unknown>[];
}

export function getArticle(id: string) {
  return db.prepare(`SELECT * FROM wire_articles WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
}

export function markRead(id: string, read: boolean) {
  db.prepare(`UPDATE wire_articles SET is_read = ? WHERE id = ?`).run(read ? 1 : 0, id);
}
export function markSaved(id: string, saved: boolean) {
  db.prepare(`UPDATE wire_articles SET is_saved = ? WHERE id = ?`).run(saved ? 1 : 0, id);
}

/**
 * Score every article's relevance against the workspace's positioning,
 * voice, tribe, and personas. Cheap heuristic, but it makes the feed
 * feel alive instead of generic.
 */
export function scoreRelevance(): number {
  // Refresh all relevance scores
  const articles = db.prepare(`SELECT * FROM wire_articles`).all() as Record<string, unknown>[];
  const positioning =
    (db.prepare(`SELECT value FROM settings WHERE key = 'smallest_true_thing'`).get() as { value: string } | undefined)
      ?.value || "";
  const change =
    (db.prepare(`SELECT value FROM settings WHERE key = 'change_we_lead'`).get() as { value: string } | undefined)?.value ||
    "";
  const tribe =
    (db.prepare(`SELECT value FROM settings WHERE key = 'tribe'`).get() as { value: string } | undefined)?.value || "";
  const wordsUse =
    (db.prepare(`SELECT value FROM settings WHERE key = 'words_use'`).get() as { value: string } | undefined)?.value || "";
  const ctx = `${positioning} ${change} ${tribe} ${wordsUse}`.toLowerCase();
  const ctxTerms = ctx.split(/\W+/).filter((w: string) => w.length > 3);

  let updated = 0;
  for (const a of articles) {
    const text = `${a.title} ${a.summary} ${a.nova_take}`.toLowerCase();
    const hits = ctxTerms.reduce((s: number, t: string) => s + (text.includes(t) ? 1 : 0), 0);
    const rel = Math.min(100, 30 + hits * 12 + (a.is_featured ? 10 : 0));
    db.prepare(`UPDATE wire_articles SET relevance = ? WHERE id = ?`).run(rel, a.id);
    updated++;
  }
  return updated;
}

export function saveAsIdea(articleId: string): { ideaId: string } {
  const a = getArticle(articleId);
  if (!a) throw new Error("Article not found");
  const id = uid("ide_");
  const t = Date.now();
  db.prepare(
    `
    INSERT INTO ideas
      (id, workspace, title, description, category, audience, why_now, estimated_effort, expected_impact, experiment, status, notes, created_at, updated_at)
    VALUES (?, 'default', ?, ?, ?, '', ?, 's', 'm', ?, 'seed', ?, ?, ?)
  `,
  ).run(
    id,
    `From Wire: ${a.title}`,
    `${a.summary}\n\nSource: ${a.source} (${a.url})\n\nNova's take: ${a.nova_take}`,
    a.category === "copy" ? "memorable" : a.category === "story" ? "story" : "remarkable",
    `Why now: ${a.nova_take}`,
    `Apply: read ${a.url}, then test the smallest version of this idea.`,
    `Auto-saved from Marketing Wire · ${a.source}`,
    t,
    t,
  );
  db.prepare(`UPDATE wire_articles SET is_saved = 1, linked_idea_id = ? WHERE id = ?`).run(
    id,
    articleId,
  );
  return { ideaId: id };
}
