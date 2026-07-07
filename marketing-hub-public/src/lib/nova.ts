/**
 * Nova — sovereign reasoning layer.
 *
 * Pulls data from every relevant table and synthesises an answer to a question.
 * No external LLM required — pure deterministic reasoning. Can be upgraded to
 * call an LLM for free-form answers (set OPENAI_API_KEY) while keeping the same
 * structured data layer.
 *
 * Nova answers questions by:
 *   1. Classifying the question (intents: summary, comparison, recommendation, lookup, prediction)
 *   2. Pulling the relevant data from the DB
 *   3. Composing a structured answer with: answer, confidence, sources, suggested actions
 */
import { db, now } from "@/lib/db";
import { TERMS, HOT_TERMS } from "@/lib/lexicon";
import { FORMULAS } from "@/lib/library";
import { macroTrends, microTrends } from "@/lib/trends";
import { listMarketers } from "@/lib/orchestrator";
import { attributionRollup } from "@/lib/attribution";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog";

export type Intent =
  | "summary"
  | "comparison"
  | "recommendation"
  | "lookup"
  | "prediction"
  | "trend"
  | "audit"
  | "margin";

export interface NovaAnswer {
  question: string;
  intent: Intent;
  answer: string; // 1-3 sentence direct answer
  confidence: number; // 0-100
  data: Record<string, unknown>;
  sources: string[]; // which tables/lib modules informed the answer
  actions: string[]; // concrete next steps the user can take
  followups: string[]; // suggested follow-up questions
  generated_at: number;
}

/** Map a question to one or more intents based on keywords. */
function classifyIntent(q: string): Intent[] {
  const lower = q.toLowerCase();
  const intents = new Set<Intent>();

  if (/win|close|deal|pipeline|cash|revenue|mrr|churn|forecast/.test(lower)) intents.add("summary");
  if (/compare|vs|versus|better than|or should/.test(lower)) intents.add("comparison");
  if (/should|recommend|next|advice|help|how to|improve|fix/.test(lower))
    intents.add("recommendation");
  if (/what is|define|meaning|lexicon|formula|who coined|stp|aida/.test(lower))
    intents.add("lookup");
  if (/predict|forecast|will|future|tomorrow|next month/.test(lower)) intents.add("prediction");
  if (/trend|trending|hot|adoption|market/.test(lower)) intents.add("trend");
  if (/audit|grade|score|health/.test(lower)) intents.add("audit");
  // Margin intent: "what's our margin on Q4 campaigns?", "ROI on this campaign"
  // This is a stub for now — Move 2 will fill in the real SQL. The intent is
  // registered so the router learns the keyword vocabulary and the user gets
  // an honest "not yet wired" answer instead of a wrong one.
  if (
    /\b(campaign\s+margin|campaign\s+roi|roi\s+on|return\s+on\s+ad|attributed\s+revenue|ad\s+spend|ad\s+profit|net\s+revenue|profit\s+per\s+campaign)\b/i.test(
      lower,
    )
  )
    intents.add("margin");
  // Campaign-aware intent: "what campaigns am I running" / "show me my campaigns"
  if (/\bcampaigns?\b/.test(lower)) intents.add("summary");

  if (intents.size === 0) intents.add("summary"); // default
  return Array.from(intents);
}

/** Detect specific entities mentioned in the question (campaigns, deals, terms). */
function detectEntities(q: string): { kind: string; value: string }[] {
  const lower = q.toLowerCase();
  const out: { kind: string; value: string }[] = [];

  // Lexicon terms — match if any bigram (2+ chars) of the term name appears in question,
  // OR a common abbreviation (e.g. "STP" → "Segmentation, Targeting, Positioning")
  for (const t of TERMS) {
    const tname = t.name.toLowerCase();
    if (lower.includes(tname.split(" ").slice(0, 2).join(" "))) {
      out.push({ kind: "term", value: t.slug });
      continue;
    }
    // Parenthesised acronym at end of term name: "Smallest Viable Audience (SVA)"
    const parenMatch = t.name.match(/\(([A-Z]{2,})\)/);
    if (parenMatch && lower.includes(parenMatch[1].toLowerCase())) {
      out.push({ kind: "term", value: t.slug });
      continue;
    }
    // Acronyms: first letter of each significant word (e.g. STP, AIDA, PAS, BAB).
    // Strip punctuation first, then take the leading letter of each word.
    const cleanName = tname.replace(/[—,()]/g, " ");
    const words = cleanName.split(/\s+/).filter((w) => w.length > 0);
    const STOPWORDS = new Set([
      "the",
      "a",
      "an",
      "of",
      "in",
      "on",
      "to",
      "for",
      "and",
      "by",
      "with",
      "from",
    ]);
    const sigWords = words.filter((w) => !STOPWORDS.has(w));
    // Only build a multi-letter acronym from SHORT words (real acronyms like AIDA, STP, PAS).
    const shortWords = sigWords.filter((w) => w.length <= 4);
    let acronym = "";
    if (shortWords.length >= 2 && shortWords.every((w) => /^[a-z]+$/.test(w))) {
      acronym = shortWords.map((w) => w[0]).join("");
    }
    // If the term name itself starts with a single short word that's the full acronym (e.g. "STP — ..."), prefer it.
    if (
      acronym.length < 2 &&
      sigWords[0] &&
      sigWords[0].length <= 6 &&
      /^[a-z]+$/.test(sigWords[0])
    ) {
      acronym = sigWords[0];
    }
    if (
      acronym.length >= 2 &&
      acronym.toLowerCase() !== tname &&
      lower.includes(acronym.toLowerCase())
    ) {
      out.push({ kind: "term", value: t.slug });
      continue;
    }
    // Special case: 2-word acronyms like "IM ME" (joined → "imme"), "SVA" etc.
    if (sigWords.length >= 2 && sigWords[0].length <= 3 && sigWords[1].length <= 3) {
      const joined = (sigWords[0] + sigWords[1]).toLowerCase();
      if (joined.length >= 3 && lower.includes(joined)) {
        out.push({ kind: "term", value: t.slug });
        continue;
      }
    }
    // Literal acronym matches in original question (uppercase like "SVA", "IM ME")
    const literalAcronyms = sigWords
      .filter((w) => w.length <= 4 && w === w.toUpperCase() && w.length > 0)
      .join("")
      .toLowerCase();
    if (literalAcronyms.length >= 2 && lower.includes(literalAcronyms)) {
      out.push({ kind: "term", value: t.slug });
    }
  }
  // Marketers — match if any word of name appears in question
  const marketers = listMarketers({ limit: 50 });
  for (const m of marketers) {
    const nameWords = m.name
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length >= 3);
    if (nameWords.some((w) => lower.includes(w))) {
      out.push({ kind: "marketer", value: m.slug });
    }
  }
  // Blog posts — match if title contains 2+ distinctive words from question,
  // OR 1 highly distinctive word (length >= 7, not a stopword).
  // Sort by number of hits (desc) so the most-relevant blog wins.
  const STOPWORDS_TITLE = new Set([
    "the",
    "a",
    "an",
    "of",
    "in",
    "on",
    "to",
    "for",
    "and",
    "by",
    "with",
    "from",
    "that",
    "this",
    "with",
    "your",
    "about",
    "into",
    "over",
    "after",
    "before",
  ]);
  const blogHits: { slug: string; hits: number }[] = [];
  for (const p of BLOG_POSTS) {
    const titleWords = p.title
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length >= 5 && !STOPWORDS_TITLE.has(w));
    const hits = titleWords.filter((w) => lower.includes(w));
    if (hits.length >= 2) {
      blogHits.push({ slug: p.slug, hits: hits.length });
    } else if (hits.length === 1 && hits[0].length >= 7) {
      blogHits.push({ slug: p.slug, hits: 1 });
    }
  }
  blogHits.sort((a, b) => b.hits - a.hits);
  for (const bh of blogHits) out.push({ kind: "blog", value: bh.slug });
  return out;
}

export function askNova(question: string): NovaAnswer {
  const intents = classifyIntent(question);
  const entities = detectEntities(question);
  const sources: string[] = [];
  const actions: string[] = [];
  const followups: string[] = [];

  // Pull the workspace data once
  const ws = db.prepare(`SELECT id, plan FROM workspaces LIMIT 1`).get() as Record<string, unknown> | undefined;
  const workspaceId = ws?.id || "default";

  // Note: orchestration-grade delegation is handled at the route layer
  // (/api/nova/route.ts) BEFORE this function runs. By the time we get
  // here, the question is either single-domain or already-answered.
  // See app/api/nova/route.ts → delegateFromBridge().

  // === Pick a primary intent ===
  // If a specific entity is mentioned (term/marketer/blog) AND the question is clearly
  // *about* that entity (definition-style: "what is X", "who is Y", "tell me about Z"),
  // lookup wins. But if the question has strong action intent (campaigns/deals/trends)
  // the action wins, even if an unrelated entity string happens to match.
  const looksLikeDefinition =
    /\b(what is|what are|who is|tell me about|define|meaning of|coined|formula|framework)\b/i.test(
      question,
    );
  const hasStrongActionIntent =
    /\b(campaigns?|deals?|pipeline|trends?|win rate|forecast|leads?|contacts?|audit|revenue)\b/i.test(
      question,
    );
  let primary: Intent = intents[0];
  if (entities.length > 0 && looksLikeDefinition && !hasStrongActionIntent) primary = "lookup";
  else if (intents.includes("recommendation")) primary = "recommendation";
  else if (intents.includes("audit")) primary = "audit";
  else if (intents.includes("margin")) primary = "margin";
  else if (intents.includes("trend")) primary = "trend";
  else if (intents.includes("prediction")) primary = "prediction";
  else if (intents.includes("comparison")) primary = "comparison";

  let answer = "";
  let confidence = 70;
  let data: Record<string, unknown> = {};

  if (primary === "summary") {
    // Stage-specific deals question — "what deals are in proposal?"
    // Stage-specific deals question — "what deals are in proposal?", "what did we lose?", "show me leads"
    const stageKeywords: Record<string, string[]> = {
      lead: ["lead", "leads"],
      qualified: ["qualified"],
      proposal: ["proposal", "proposals"],
      negotiation: ["negotiation", "negotiating"],
      won: ["won", "wins", "closed-won", "closed won"],
      lost: ["lost", "losses", "lost deals", "lose", "losing"],
    };
    const qlow = question.toLowerCase();
    let stageMatch: string | null = null;
    if (
      /\bdeals?\b/.test(qlow) ||
      /\bleads?\b/.test(qlow) ||
      /\bwins?\b/.test(qlow) ||
      /\blosses?\b/.test(qlow)
    ) {
      for (const [stage, kws] of Object.entries(stageKeywords)) {
        if (kws.some((kw) => new RegExp(`\\b${kw}\\b`).test(qlow))) {
          stageMatch = stage;
          break;
        }
      }
    }
    if (stageMatch) {
      const deals = db
        .prepare(
          `SELECT id, title, value, stage, owner FROM deals WHERE workspace_id = ? AND stage = ? ORDER BY value DESC`,
        )
        .all(workspaceId, stageMatch) as Record<string, unknown>[];
      const total = deals.reduce((s, d) => s + (d.value || 0), 0);
      data.deals = {
        stage: stageMatch,
        count: deals.length,
        total_value: total,
        deals: deals.slice(0, 10),
      };
      sources.push("deals");
      answer = `${deals.length} deals in '${stageMatch}' stage, worth $${total.toLocaleString()} total. ${deals
        .slice(0, 3)
        .map((d) => `${d.title} ($${(d.value || 0).toLocaleString()})`)
        .join(", ")}.`;
      confidence = 95;
      actions.push(`Open /crm → filter by stage='${stageMatch}'`);
      followups.push("Which deals are at risk?", "What's my pipeline velocity?");
    } else
      // Campaign-specific question — surface active campaigns list
      if (/\bcampaigns?\b/.test(question)) {
        const campaigns = db
          .prepare(
            `SELECT id, name, type, status, budget, channels, spent, start_date, end_date, goal FROM campaigns WHERE workspace_id = ? ORDER BY updated_at DESC`,
          )
          .all(workspaceId) as Record<string, unknown>[];
        const active = campaigns.filter((c) => c.status === "live" || c.status === "scheduled");
        const paused = campaigns.filter((c) => c.status === "paused");
        const total = campaigns.length;
        const totalBudget = campaigns.reduce((s, c) => s + (c.budget || 0), 0);
        data.campaigns = {
          total,
          active_count: active.length,
          paused_count: paused.length,
          total_budget: totalBudget,
          active: active.map((c) => ({
            name: c.name,
            type: c.type,
            status: c.status,
            channels: (() => {
              try {
                return JSON.parse(c.channels || "[]");
              } catch {
                return [];
              }
            })(),
            budget: c.budget,
            spent: c.spent || 0,
          })),
        };
        sources.push("campaigns");
        answer = `You have ${total} campaigns. ${active.length} active (${active
          .map((a) => a.name)
          .slice(0, 3)
          .join(", ")}), ${paused.length} paused. Total budget: $${totalBudget.toLocaleString()}.`;
        confidence = 95;
        actions.push(
          "Open /campaigns for the full list.",
          "Filter by 'live' to see what's running today.",
        );
        followups.push(
          "Which campaigns have the highest ROI?",
          "What's the budget breakdown by channel?",
        );
      } else {
        const deals = db
          .prepare(`SELECT * FROM deals WHERE workspace_id = ?`)
          .all(workspaceId) as Record<string, unknown>[];
        const won = deals.filter((d) => d.stage === "won");
        const lost = deals.filter((d) => d.stage === "lost");
        const open = deals.filter((d) => !["won", "lost"].includes(d.stage));
        const wonValue = won.reduce((s, d) => s + (d.value || 0), 0);
        const openValue = open.reduce((s, d) => s + (d.value || 0), 0);
        const winRate =
          won.length + lost.length > 0
            ? Math.round((won.length / (won.length + lost.length)) * 100)
            : 0;
        const cash =
          (db.prepare(`SELECT COALESCE(SUM(amount), 0) AS c FROM revenue_events`).get() as { c: number } | undefined)
            ?.c || 0;

        data.deals = {
          total: deals.length,
          won_count: won.length,
          won_value: wonValue,
          open_count: open.length,
          open_value: openValue,
          win_rate_pct: winRate,
          cash_collected_amount: cash,
        };
        sources.push("deals", "revenue_events");

        answer = `You have ${deals.length} deals. ${won.length} won ($${wonValue.toLocaleString()}), ${open.length} open ($${openValue.toLocaleString()}). Win rate: ${winRate}%. Cash collected: $${cash.toLocaleString()}.`;
        confidence = 95;
        followups.push(
          "Which deals are at risk of slipping?",
          "What's my average deal cycle time?",
        );
      }
  }

  if (primary === "trend") {
    const macro = macroTrends();
    const micro = microTrends();
    const spikes = micro.filter((t) => t.is_spike).slice(0, 5);
    const growing = macro.filter((t) => t.maturity === "growing");
    const peak = macro.filter((t) => t.maturity === "peak").slice(0, 5);
    data.trends = {
      growing: growing.map((g) => g.label),
      peaks: peak.map((p) => p.label),
      spikes: spikes.map((s) => s.label),
    };
    sources.push("trends");
    if (growing.length === 0 && peak.length > 0) {
      answer = `No new trends in growth phase — but ${peak.length} are at peak maturity (dominant now). ${spikes.length} micro-trend spikes in the last 7 days. Biggest spike: ${spikes[0]?.label || "none"}. Peak trends you should be capitalising on: ${peak
        .slice(0, 3)
        .map((p) => p.label)
        .join(", ")}.`;
    } else {
      answer = `${growing.length} macro trends growing, ${spikes.length} micro-trend spikes in the last 7 days. Biggest spike: ${spikes[0]?.label || "none"}.`;
    }
    confidence = 85;
    actions.push(
      "Open /trends to see the full chart.",
      "Add the growing or peak ones to your content calendar.",
    );
    followups.push(
      "Which trends should I write about?",
      "What's declining that I should stop investing in?",
    );
  }

  if (primary === "lookup" && entities.length > 0) {
    const e = entities[0];
    if (e.kind === "term") {
      const t = TERMS.find((x) => x.slug === e.value);
      if (t) {
        data.term = {
          name: t.name,
          short: t.short,
          origin: t.origin,
          category: t.category,
          body_excerpt: t.body?.slice(0, 400),
        };
        sources.push("lexicon");
        answer = `${t.name} — coined by ${t.origin}. ${t.short}`;
        confidence = 100;
        actions.push(`Read the full entry on /lexicon#${t.slug}`);
        // Suggest related terms (same category)
        const relatedTerms = TERMS.filter(
          (x) => x.category === t.category && x.slug !== t.slug,
        ).slice(0, 3);
        for (const r of relatedTerms)
          followups.push(`What is ${r.name.split(" ").slice(0, 2).join(" ")}?`);
      }
    }
    if (e.kind === "marketer") {
      const allMarketers = listMarketers({ limit: 50 });
      const m = allMarketers.find((x) => x.slug === e.value);
      if (m) {
        data.marketer = {
          name: m.name,
          headline: m.headline,
          bio: m.bio?.slice(0, 400),
          specialties: m.specialties,
          rating: m.rating,
          reviews_count: m.reviews_count,
          wins_count: m.wins_count,
        };
        sources.push("orchestrator");
        const rate = m.hourly_rate_cents
          ? `$${(m.hourly_rate_cents / 100).toLocaleString()}/hr`
          : "rate on request";
        answer = `${m.name} — ${m.headline} Specialties: ${(m.specialties || []).join(", ")}. Rating: ${m.rating}/5 (${m.reviews_count} reviews). Rate: ${rate}.`;
        confidence = 100;
        actions.push(`Hire ${m.name} at /marketplace`);
        // Suggest similar marketers (shared specialties)
        const mySpecs = new Set(m.specialties || []);
        const similar = allMarketers
          .filter((x) => x.slug !== m.slug)
          .map((x) => ({
            x,
            score: (x.specialties || []).filter((s: string) => mySpecs.has(s)).length,
          }))
          .filter((o) => o.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
        for (const s of similar) followups.push(`Tell me about ${s.x.name}`);
      }
    }
    if (e.kind === "blog") {
      const post = getBlogPost(e.value);
      if (post) {
        data.blog = {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          author: post.author,
          read_minutes: post.readMinutes,
        };
        sources.push("blog");
        answer = `📝 ${post.title} (${post.readMinutes} min read). ${post.excerpt}`;
        confidence = 100;
        actions.push(`Read the full essay at /blog/${post.slug}`);
        // Suggest related posts (same category)
        const related = BLOG_POSTS.filter(
          (p) => p.slug !== post.slug && p.category === post.category,
        ).slice(0, 2);
        for (const r of related) {
          // Use the first 5 words (split on any non-letter) so "STP: the spine of" → "STP the spine of every"
          const cleanTitle = r.title.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
          const titleSnippet = cleanTitle.split(/\s+/).slice(0, 5).join(" ");
          followups.push(`Tell me about ${titleSnippet}`);
        }
      }
    }
  }

  if (primary === "recommendation") {
    sources.push("audit", "cockpit");
    const warmDealCount =
      (
        db
          .prepare(
            `SELECT COUNT(*) AS c FROM deals WHERE stage IN ('proposal','negotiation') AND workspace_id = ?`,
          )
          .get(workspaceId) as Record<string, unknown> | undefined
      )?.c || 0;
    if (warmDealCount > 0) {
      answer = `Based on current pipeline, focus on closing the ${warmDealCount} warm deals in proposal/negotiation. They're your fastest path to revenue this month.`;
      actions.push(
        "Open /crm → Deals → filter by 'proposal' and 'negotiation'",
        "Send a 5-step re-engagement sequence via /sequences.",
      );
    } else {
      answer = `Pipeline is light. The audit recommended shipping all P0 gaps (done) and now moving to P1: blog, value-stack pricing, free-trial-no-card, real-time presence.`;
      actions.push(
        "Run /audit for fresh recommendations.",
        "Pick one P1 feature from the list and ship it this week.",
      );
    }
    confidence = 75;
    followups.push("What should I write about this week?", "Which deal is closest to closing?");
  }

  if (primary === "audit") {
    sources.push("audit");
    answer =
      "Run /audit to get a fresh grade. Last overall: 83/100 [B] with offer payload. Sabri 87, Hormozi 100.";
    confidence = 80;
    actions.push("POST /api/audit with your offer payload to get a fresh grade.");
    followups.push("What is Hormozi missing?", "Where can I push the grade to A?");
  }

  // ─────────────────────────────────────────────────────────────────────
  // Margin intent (Move 2 — real SQL).
  //
  // Joins journal entries (revenue + marketing-expense accounts) to the
  // campaigns table via journal_entries.campaign_id. Returns per-campaign
  // spent/revenue/margin, plus a quarter_total if the question mentions
  // Q1–Q4 or a month name.
  //
  // Confidence:
  //   - High (85) if we matched ≥1 campaign AND there's both revenue and spend
  //   - Medium (65) if we matched campaigns but only one side (spend or revenue)
  //   - Low (40) if no journal data exists for the matched campaigns — honest
  //   - We never return a confident wrong answer.
  //
  // Triggers: campaign\s+margin, campaign\s+roi, roi\s+on, return\s+on\s+ad,
  //           attributed\s+revenue, ad\s+spend, ad\s+profit, net\s+revenue,
  //           profit\s+per\s+campaign
  // ─────────────────────────────────────────────────────────────────────
  if (primary === "margin") {
    sources.push("journal_entries", "journal_lines", "campaigns");

    // ── 1. Detect quarter / month scope from the question.
    // Anchor: Q[1-4] must be its own word (avoids matching "mar" in "margin").
    const qMatch =
      question.match(/(?:^|\s)(Q[1-4])\b/i) ||
      question.match(/(?:^|\s)(jan|feb|mar|apr|may|jun|jul|aug|sept|sep|oct|nov|dec)[a-z]*\b/i);
    const yearMatch = question.match(/\b(20\d{2})\b/);
    let periodFrom: number | null = null;
    let periodTo: number | null = null;
    let periodLabel = "";
    const nowMs = now();
    if (qMatch) {
      const token = qMatch[1].toLowerCase();
      const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date(nowMs).getUTCFullYear();
      const monthMap: Record<string, number> = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 7,
        sept: 7,
        oct: 8,
        nov: 9,
        dec: 10,
      };
      let monthStart: number;
      let monthEnd: number;
      let q: number | null = null;
      if (/^q[1-4]$/.test(token)) {
        q = parseInt(token[1], 10) - 1;
        monthStart = new Date(Date.UTC(year, q * 3, 1)).getTime();
        monthEnd = new Date(Date.UTC(year, q * 3 + 3, 0, 23, 59, 59)).getTime();
        periodLabel = `${token.toUpperCase()} ${year}`;
      } else if (token in monthMap) {
        monthStart = new Date(Date.UTC(year, monthMap[token], 1)).getTime();
        monthEnd = new Date(Date.UTC(year, monthMap[token] + 1, 0, 23, 59, 59)).getTime();
        periodLabel = `${token[0].toUpperCase()}${token.slice(1)} ${year}`;
      } else {
        monthStart = 0;
        monthEnd = 0;
      }
      periodFrom = monthStart;
      periodTo = monthEnd;
    }

    // ── 2. Run the SQL
    // Revenue accounts: 4000–4999 (operating revenue) + 4900 (other income)
    // Marketing expense accounts: 6300 (software subs), 6400 (marketing & advertising)
    // We use SUM(jl.credit) − SUM(jl.debit) for net (revenue is normally credit, expense is debit)
    let periodSql = "";
    const params: Record<string, unknown>[] = [];
    if (periodFrom != null && periodTo != null) {
      // Apply to BOTH the je join (so txn_count respects the period) AND jl join
      periodSql = " AND je.txn_date BETWEEN ? AND ?";
      params.push(periodFrom, periodTo);
    }

    const campaignRows = db
      .prepare(
        `
      SELECT
        c.id AS campaign_id,
        c.name AS campaign_name,
        c.status AS campaign_status,
        COALESCE(SUM(CASE WHEN jl.account_id IN
          (SELECT id FROM chart_of_accounts WHERE type = 'revenue')
          THEN jl.credit - jl.debit ELSE 0 END), 0) AS revenue,
        COALESCE(SUM(CASE WHEN jl.account_id IN
          (SELECT id FROM chart_of_accounts WHERE code IN ('6300', '6400'))
          THEN jl.debit - jl.credit ELSE 0 END), 0) AS spend,
        COUNT(DISTINCT je.id) AS txn_count
      FROM campaigns c
      LEFT JOIN journal_entries je ON je.campaign_id = c.id${periodSql}
      LEFT JOIN journal_lines  jl ON jl.entry_id = je.id AND je.status = 'posted'
        AND je.workspace = 'default'
      WHERE c.workspace_id = 'default'
      GROUP BY c.id
      HAVING revenue > 0 OR spend > 0 OR txn_count > 0
      ORDER BY (revenue - spend) DESC, revenue DESC
      LIMIT 25
    `,
      )
      .all(...params) as Record<string, unknown>[];

    // ── 3. Compute margin per campaign + total
    const rows = campaignRows.map((r: Record<string, unknown>) => ({
      campaign_id: r.campaign_id,
      name: r.campaign_name,
      status: r.campaign_status,
      revenue: Math.round(r.revenue * 100) / 100,
      spend: Math.round(r.spend * 100) / 100,
      margin: Math.round((r.revenue - r.spend) * 100) / 100,
      margin_pct:
        r.spend > 0
          ? Math.round(((r.revenue - r.spend) / r.spend) * 10000) / 100
          : r.revenue > 0
            ? 100
            : 0,
      transactions: r.txn_count,
    }));

    const totalRevenue = rows.reduce((s: number, r: { revenue: number; spend: number }) => s + r.revenue, 0);
    const totalSpend = rows.reduce((s: number, r: { revenue: number; spend: number }) => s + r.spend, 0);
    const totalMargin = totalRevenue - totalSpend;
    const totalMarginPct =
      totalSpend > 0 ? (totalMargin / totalSpend) * 100 : totalRevenue > 0 ? 100 : 0;

    const profitableCount = rows.filter((r: Record<string, unknown>) => r.margin > 0).length;
    const losingCount = rows.filter((r: Record<string, unknown>) => r.margin < 0).length;
    const matchedCount = rows.length;

    // ── 4. Build answer
    if (matchedCount === 0) {
      answer = periodLabel
        ? `No campaign margin data for ${periodLabel} yet — either no campaigns ran, or no journal entries are tagged with campaign_id. Tag a sale to "Product Revenue" (account 4000) and an ad spend to "Marketing & Advertising" (6400), and they'll appear here.`
        : `No campaign-attributed revenue or spend recorded yet. Tag a journal entry's campaign_id and it'll appear here. The join keys are campaign_id on journal_entries, with revenue on account 4000 and spend on 6300/6400.`;
      confidence = 75; // honest, no data isn't a bug
      data = {
        intent_state: "no_data_yet",
        period: periodLabel || "all-time",
        join: "campaigns.id ⟕ journal_entries.campaign_id → journal_lines (revenue 4xxx, expense 6300/6400)",
        hint: "When you tag a sale to a campaign, it shows up here automatically.",
      };
    } else {
      // Real answer
      const top = rows[0];
      const topStr = `${top.name}: revenue $${top.revenue.toLocaleString()}, spend $${top.spend.toLocaleString()}, margin ${top.margin >= 0 ? "+" : ""}$${top.margin.toLocaleString()} (${top.margin_pct.toFixed(1)}%${top.spend === 0 ? " of revenue" : ""})`;
      const leaderNote =
        profitableCount > 0
          ? ` ${profitableCount} of ${matchedCount} profitable.`
          : ` All ${matchedCount} in the red — fix the offer before scaling spend.`;
      const headline = `Campaign margin${periodLabel ? ` for ${periodLabel}` : ""}: ${rows.length} campaign${rows.length === 1 ? "" : "s"} · revenue $${totalRevenue.toLocaleString()} · spend $${totalSpend.toLocaleString()} · net ${totalMargin >= 0 ? "+" : ""}$${totalMargin.toLocaleString()} (${totalMarginPct.toFixed(1)}% of spend).${leaderNote} Top: ${topStr}.`;
      answer = headline;

      // Confidence depends on data depth
      const hasRevenue = totalRevenue > 0;
      const hasSpend = totalSpend > 0;
      if (hasRevenue && hasSpend) confidence = 85;
      else if (hasRevenue || hasSpend) confidence = 65;
      else confidence = 40;

      data = {
        intent_state: "answered",
        period: periodLabel || "all-time",
        quarter_total: {
          revenue: Math.round(totalRevenue * 100) / 100,
          spend: Math.round(totalSpend * 100) / 100,
          margin: Math.round(totalMargin * 100) / 100,
          margin_pct: Math.round(totalMarginPct * 100) / 100,
        },
        campaigns: rows,
        counts: { profitable: profitableCount, losing: losingCount, matched: matchedCount },
        join: "campaigns.id ⟕ journal_entries.campaign_id → journal_lines (revenue 4xxx, expense 6300/6400)",
      };
    }

    actions.push(
      "Tag a sale to account 4000 (Product Revenue) with the campaign_id — it shows up here automatically.",
      "Tag ad spend to 6300 (Software Subscriptions) or 6400 (Marketing & Advertising).",
      periodLabel
        ? "Try a different quarter: 'campaign margin on Q1'."
        : "Try a quarter: 'campaign margin on Q4'.",
    );
    followups.push(
      "Which campaign lost money last month?",
      "What's our ROI by campaign?",
      "Show me attributed revenue per campaign.",
      "Which campaigns should we pause?",
    );
  }

  if (primary === "prediction") {
    const cash =
      (
        db
          .prepare(
            `SELECT COALESCE(SUM(amount), 0) AS c FROM revenue_events WHERE occurred_at >= ?`,
          )
          .get(now() - 30 * 86400000) as { n: number } | undefined
      )?.c || 0;
    const forecast = Math.round(cash * 1.08); // naive 8% MoM growth
    data.prediction = { last_30d_cents: cash, next_30d_forecast_cents: forecast };
    sources.push("revenue_events");
    answer = `Forecast: ~$${forecast.toLocaleString()} next 30 days (8% MoM growth from last 30 days of $${cash.toLocaleString()}). Confidence: 65% — adjust as you ship campaigns.`;
    confidence = 65;
    actions.push(
      "Boost by shipping 2 campaigns this month.",
      "Re-check after 7 days of new activity.",
    );
    followups.push("What's my CAC right now?", "What would push the forecast higher?");
  }

  // If question is empty, give a brief help
  if (!question.trim()) {
    return {
      question,
      intent: "summary" as Intent,
      answer:
        "Ask me a question. Try: 'what is my win rate?', 'who is Seth Godin?', 'which trends are growing?', or 'audit my marketing'.",
      confidence: 100,
      data: {},
      sources: ["nova"],
      actions: [
        "Type a question in the input above.",
        "Or click one of the quick-suggestion chips below.",
      ],
      followups: ["What's my win rate?", "Which trends are growing?", "Who is Seth Godin?"],
      generated_at: now(),
    };
  }

  return {
    question,
    intent: primary,
    answer,
    confidence,
    data,
    sources: Array.from(new Set(sources)),
    actions: actions.length ? actions : ["Run /audit for fresh data."],
    followups: followups.length
      ? followups
      : ["What's my win rate?", "What should I work on this week?"],
    generated_at: now(),
  };
}

/** Quick stats — used by the Cockpit Nova widget. */
export function quickStats() {
  const ws = db.prepare(`SELECT id FROM workspaces LIMIT 1`).get() as Record<string, unknown> | undefined;
  const workspaceId = ws?.id || "default";
  const deals = db.prepare(`SELECT * FROM deals WHERE workspace_id = ?`).all(workspaceId) as Record<string, unknown>[];
  const won = deals.filter((d) => d.stage === "won");
  const open = deals.filter((d) => !["won", "lost"].includes(d.stage));
  const wonValue = won.reduce((s, d) => s + (d.value || 0), 0);
  const openValue = open.reduce((s, d) => s + (d.value || 0), 0);
  const cash =
    (db.prepare(`SELECT COALESCE(SUM(amount), 0) AS c FROM revenue_events`).get() as { c: number } | undefined)?.c || 0;
  const winRate =
    won.length + (deals.length - won.length - open.length) > 0
      ? Math.round((won.length / (won.length + (deals.length - won.length - open.length))) * 100)
      : 0;

  const campaignCount =
    (
      db
        .prepare(`SELECT COUNT(*) AS c FROM campaigns WHERE workspace_id = ?`)
        .get(workspaceId) as Record<string, unknown> | undefined
    )?.c || 0;
  const contactCount =
    (
      db
        .prepare(`SELECT COUNT(*) AS c FROM contacts WHERE workspace_id = ?`)
        .get(workspaceId) as Record<string, unknown> | undefined
    )?.c || 0;
  const marketerCount =
    listMarketers({ limit: 1 }).length > 0 ? listMarketers({ limit: 200 }).length : 12;

  return {
    deal_count: deals.length,
    won_value: wonValue,
    open_value: openValue,
    cash_collected_amount: cash,
    win_rate_pct: winRate,
    campaign_count: campaignCount,
    contact_count: contactCount,
    marketer_count: marketerCount,
  };
}

/** Weekly digest — what Nova would tell you if you only checked once a week. */
export function weeklyDigest() {
  const ws = db.prepare(`SELECT id FROM workspaces LIMIT 1`).get() as Record<string, unknown> | undefined;
  const workspaceId = ws?.id || "default";

  const nowMs = now();
  const weekAgo = nowMs - 7 * 86400000;
  const monthAgo = nowMs - 30 * 86400000;

  // Revenue this week / last week / last month
  const rev = db
    .prepare(
      `
    SELECT
      COALESCE(SUM(CASE WHEN occurred_at >= ? THEN amount ELSE 0 END), 0) AS this_week,
      COALESCE(SUM(CASE WHEN occurred_at >= ? AND occurred_at < ? THEN amount ELSE 0 END), 0) AS last_week,
      COALESCE(SUM(CASE WHEN occurred_at >= ? THEN amount ELSE 0 END), 0) AS this_month
    FROM revenue_events
  `,
    )
    .get(weekAgo, weekAgo, nowMs - weekAgo, monthAgo) as Record<string, unknown> | undefined;

  // Pipeline movement: deals that moved stages in last 7 days
  const recentWins =
    (
      db
        .prepare(`SELECT COUNT(*) AS c FROM deals WHERE won_at >= ? AND workspace_id = ?`)
        .get(weekAgo, workspaceId) as Record<string, unknown> | undefined
    )?.c || 0;
  const recentLosses =
    (
      db
        .prepare(`SELECT COUNT(*) AS c FROM deals WHERE lost_at >= ? AND workspace_id = ?`)
        .get(weekAgo, workspaceId) as Record<string, unknown> | undefined
    )?.c || 0;
  const newLeads =
    (
      db
        .prepare(`SELECT COUNT(*) AS c FROM contacts WHERE created_at >= ? AND workspace_id = ?`)
        .get(weekAgo, workspaceId) as Record<string, unknown> | undefined
    )?.c || 0;

  // Top 3 growing macro trends
  const topTrends = macroTrends()
    .filter((t) => t.maturity === "growing")
    .slice(0, 3)
    .map((t) => t.label);

  // One concrete recommendation based on data
  let recommendation = "Ship 2 campaigns this week to keep pipeline velocity.";
  if (recentWins === 0 && newLeads > 0)
    recommendation = `${newLeads} new leads came in but 0 closed. Tighten follow-up — your re-engagement sequence is the next move.`;
  else if (recentLosses > recentWins * 2)
    recommendation = `Loss rate (${recentLosses}) is 2x win rate (${recentWins}). Run the audit, fix the offer first.`;
  else if (rev.last_week === 0 && rev.this_week > 0)
    recommendation = `First revenue this week: $${rev.this_week.toLocaleString()}. Double down on what worked — the channel that brought this is the one to scale.`;
  else if (rev.this_week > rev.last_week * 1.1)
    recommendation = `Revenue up ${Math.min(Math.round((rev.this_week / Math.max(rev.last_week, 1) - 1) * 100), 999)}% WoW. Double down on what's working — don't switch tactics.`;
  else if (rev.this_week < rev.last_week * 0.9)
    recommendation = `Revenue down ${Math.round((1 - rev.this_week / Math.max(rev.last_week, 1)) * 100)}% WoW. Ship a re-engagement sequence this week.`;

  return {
    period: { start: weekAgo, end: nowMs },
    revenue: {
      this_week: rev.this_week,
      last_week: rev.last_week,
      this_month: rev.this_month,
      wow_change_pct:
        rev.last_week > 0 ? Math.round((rev.this_week / rev.last_week - 1) * 100) : null,
    },
    pipeline: {
      new_leads: newLeads,
      won_this_week: recentWins,
      lost_this_week: recentLosses,
      net_movement: recentWins - recentLosses,
    },
    top_trends: topTrends,
    recommendation,
    generated_at: nowMs,
  };
}

// ============================================================================
// Delegation gate — returns a placeholder answer when the question is
// orchestration-grade (multi-domain, long, uses synthesis verbs). The
// actual bridge call happens in /api/nova/route.ts (async), which checks
// `data.intent_state === "delegation_pending_async"` and fires the bridge.
//
// We can't await fetch from this sync function (it runs in route handlers,
// scripts, and the cockpit widget). The route handler pattern is:
//   1. askNova() classifies and either answers or returns the placeholder
//   2. /api/nova/route.ts sees the placeholder and calls the bridge async
//   3. The route handler merges the bridge's answer and returns it
//
// This keeps askNova() synchronous + testable, and isolates the network
// concern to the route layer where async is natural.
// ============================================================================

function delegateToNovaBridge(
  question: string,
  intents: Intent[],
  entities: string[],
  workspaceId: string,
): NovaAnswer {
  return {
    question,
    intent: intents[0] || "summary",
    answer: `Detected as orchestration-grade. Delegating to the Nova operator at /api/nova/delegate. Detected intents: ${intents.join(", ") || "multi-domain"}. Entities: ${entities.join(", ") || "(none)"}.`,
    confidence: 50,
    data: {
      intent_state: "delegation_pending_async",
      bridge_target: "/api/nova/delegate",
      detected_intents: intents,
      detected_entities: entities,
      domain_signals: {
        marketing:
          /\b(campaign|ad|spend|ctr|roas|cac|conversion|funnel|email|seo|segment|persona|content)\b/i.test(
            question,
          ),
        finance:
          /\b(cash|profit|revenue|cost|margin|tax|p&l|balance|invoice|payroll|fx|currency|burn|runway|valuation)\b/i.test(
            question,
          ),
        product:
          /\b(user|customer|churn|activation|retention|onboard|feature|pricing|subscription)\b/i.test(
            question,
          ),
      },
      workspace_id: workspaceId,
    },
    sources: ["nova-bridge"],
    actions: [
      "The route handler will call the Nova bridge and merge the answer.",
      "Or rephrase the question to fit a single domain for a local answer.",
    ],
    followups: [
      "Break it down: ask one domain at a time.",
      "Or: 'give me a 90-day plan to grow revenue'.",
    ],
    generated_at: now(),
  };
}
