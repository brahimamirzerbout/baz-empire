/**
 * Intelligence layer — Nova's S-Tier formulas applied across the hub.
 *
 * Each formula is a pure function over the data it cares about. Routes can
 * call these directly. Formulas deliberately use 0..100 normalised scores
 * where it makes sense so the UI can rank and color them uniformly.
 *
 * Philosophy: every score is a decision support signal, not a verdict.
 * Use them to focus attention, not to fire someone.
 */
import { db } from "@/lib/db";
import { retentionScore } from "@/lib/retention";

/* ────────────── helpers ────────────── */

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

type CountRow = { n: number };
type ValueRow = { v: number };
type AovRow = { aov: number };
type CycleRow = { d: number };
type MaxRow = { last: number | null };
type DealSumRow = { v: number } | undefined;
type DealCountRow = { n: number } | undefined;

interface ContactRow {
  id: string;
  score: number | null;
  sentiment: number | null;
  created_at: number;
  source: string | null;
  tags: string | null;
  last_touch_at: number | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  company: string | null;
}

interface CampaignRow {
  budget: number | null;
  spent: number | null;
  metrics: string | null;
}

interface AgentRunRow {
  id: string;
  output: string | null;
  created_at: number;
}

function safeAvg(rows: Record<string, unknown>[], field: string): number {
  if (!rows.length) return 0;
  return rows.reduce((s, r) => s + (Number(r[field]) || 0), 0) / rows.length;
}

function daysSince(ts?: number | null): number {
  if (!ts) return 9999;
  return (Date.now() - ts) / 86400000;
}

function countQuery(sql: string, ...params: (string | number)[]): number {
  const row = db.prepare(sql).get(...params) as CountRow | undefined;
  return row?.n ?? 0;
}

/* ────────────── 1. Relationship Strength Index (RSI) ────────────── */

export function relationshipStrength(contactId: string): {
  score: number;
  recency: number;
  frequency: number;
  quality: number;
  sentiment: number;
  signals: { lastTouchDays: number; touches30d: number; dealCount: number; avgSentiment: number };
} {
  const c = db
    .prepare(`SELECT id, score, sentiment, created_at FROM contacts WHERE id = ?`)
    .get(contactId) as Partial<ContactRow> | undefined;
  if (!c)
    return {
      score: 0,
      recency: 0,
      frequency: 0,
      quality: 0,
      sentiment: 0,
      signals: { lastTouchDays: 9999, touches30d: 0, dealCount: 0, avgSentiment: 0 },
    };

  const lastActivity = db
    .prepare(
      `
    SELECT MAX(created_at) AS last FROM activities WHERE contact_id = ?
  `,
    )
    .get(contactId) as MaxRow | undefined;
  const lastTouchDays = lastActivity?.last ? daysSince(lastActivity.last) : daysSince(c.created_at);

  const recency = clamp(100 - Math.min(lastTouchDays, 180) * (100 / 180));

  const touches30d = countQuery(
    `
    SELECT COUNT(*) AS n FROM activities
    WHERE contact_id = ? AND created_at > ?
  `,
    contactId,
    Date.now() - 30 * 86400000,
  );
  const frequency = clamp(touches30d * 8);

  const dealCount = countQuery(`SELECT COUNT(*) AS n FROM deals WHERE contact_id = ?`, contactId);
  const quality = clamp((Number(c.score) || 0) * 1.2 + Math.min(dealCount, 5) * 8);

  const sent = Number.isFinite(Number(c.sentiment)) ? Number(c.sentiment) : 0.1;
  const avgSentiment = clamp((sent + 1) * 50);

  const score = clamp(recency * 0.3 + frequency * 0.25 + quality * 0.25 + avgSentiment * 0.2);

  return {
    score: Math.round(score),
    recency: Math.round(recency),
    frequency: Math.round(frequency),
    quality: Math.round(quality),
    sentiment: Math.round(avgSentiment),
    signals: {
      lastTouchDays: Math.round(lastTouchDays),
      touches30d,
      dealCount,
      avgSentiment: Math.round(avgSentiment),
    },
  };
}

/* ────────────── 2. Lead Priority Score ────────────── */

export function leadPriority(contactId: string): {
  score: number;
  intent: number;
  fit: number;
  engagement: number;
  urgency: number;
  value: number;
} {
  const c = db
    .prepare(`SELECT id, score, source, tags, created_at, last_touch_at FROM contacts WHERE id = ?`)
    .get(contactId) as Partial<ContactRow> | undefined;
  if (!c) return { score: 0, intent: 0, fit: 0, engagement: 0, urgency: 0, value: 0 };

  const intent = clamp((Number(c.score) || 0) * 1.2);
  const tags = String(c.tags || "").toLowerCase();
  const fit = clamp(
    (tags.includes("vip") ? 30 : 0) +
      (tags.includes("b2b") ? 25 : 0) +
      (tags.includes("enterprise") ? 25 : 0) +
      (c.source === "referral" ? 20 : c.source === "organic" ? 15 : c.source === "ads" ? 8 : 5),
  );

  const touches = countQuery(
    `SELECT COUNT(*) AS n FROM activities WHERE contact_id = ? AND created_at > ?`,
    contactId,
    Date.now() - 14 * 86400000,
  );
  const engagement = clamp(touches * 12);

  const lastTouchDays = c.last_touch_at ? daysSince(c.last_touch_at) : daysSince(c.created_at);
  const urgency = clamp(100 - Math.min(lastTouchDays, 60) * (100 / 60));

  const deals = db
    .prepare(`SELECT COALESCE(SUM(value),0) AS v FROM deals WHERE contact_id = ?`)
    .get(contactId) as ValueRow | undefined;
  const value = clamp(Math.min(Number(deals?.v ?? 0) / 1000, 100));

  const score = clamp(intent * 0.3 + fit * 0.25 + engagement * 0.2 + urgency * 0.15 + value * 0.1);
  return {
    score: Math.round(score),
    intent: Math.round(intent),
    fit: Math.round(fit),
    engagement: Math.round(engagement),
    urgency: Math.round(urgency),
    value: Math.round(value),
  };
}

/* ────────────── 3. Churn Risk Score ────────────── */

export function churnRisk(contactId: string): {
  score: number;
  factors: {
    lowRecency: number;
    dropEngagement: number;
    negativeSentiment: number;
    supportStress: number;
    noMomentum: number;
  };
} {
  const c = db
    .prepare(`SELECT id, sentiment, created_at, last_touch_at FROM contacts WHERE id = ?`)
    .get(contactId) as Partial<ContactRow> | undefined;
  if (!c)
    return {
      score: 0,
      factors: {
        lowRecency: 0,
        dropEngagement: 0,
        negativeSentiment: 0,
        supportStress: 0,
        noMomentum: 0,
      },
    };

  const lastTouchDays = c.last_touch_at ? daysSince(c.last_touch_at) : daysSince(c.created_at);
  const lowRecency = clamp(lastTouchDays * (100 / 90));

  const last30 = countQuery(
    `SELECT COUNT(*) AS n FROM activities WHERE contact_id = ? AND created_at > ?`,
    contactId,
    Date.now() - 30 * 86400000,
  );
  const prev30 = countQuery(
    `SELECT COUNT(*) AS n FROM activities WHERE contact_id = ? AND created_at BETWEEN ? AND ?`,
    contactId,
    Date.now() - 60 * 86400000,
    Date.now() - 30 * 86400000,
  );
  const drop = prev30 > 0 ? clamp(((prev30 - last30) / prev30) * 100) : last30 === 0 ? 60 : 0;
  const dropEngagement = drop;

  const sent = Number(c.sentiment || 0);
  const negativeSentiment = sent < 0 ? clamp(-sent * 100) : 0;

  const supportStress = clamp(Math.min(last30, 10) * 8);

  const deals = countQuery(
    `SELECT COUNT(*) AS n FROM deals WHERE contact_id = ? AND stage NOT IN ('won','lost')`,
    contactId,
  );
  const noMomentum = deals === 0 && lastTouchDays > 14 ? 70 : deals === 0 ? 30 : 0;

  const score = clamp(
    lowRecency * 0.3 +
      dropEngagement * 0.25 +
      negativeSentiment * 0.2 +
      supportStress * 0.15 +
      noMomentum * 0.1,
  );
  return {
    score: Math.round(score),
    factors: {
      lowRecency: Math.round(lowRecency),
      dropEngagement: Math.round(dropEngagement),
      negativeSentiment: Math.round(negativeSentiment),
      supportStress: Math.round(supportStress),
      noMomentum: Math.round(noMomentum),
    },
  };
}

/* ────────────── 4. Revenue Forecast Confidence ────────────── */

export function forecastConfidence(): {
  score: number;
  numerator: number;
  denominator: number;
  verified: number;
  active: number;
  recentTouches: number;
  stale: number;
} {
  const verified = countQuery(`SELECT COUNT(*) AS n FROM deals WHERE stage = 'won'`);
  const active = countQuery(`SELECT COUNT(*) AS n FROM deals WHERE stage NOT IN ('won','lost')`);
  const recentTouches = countQuery(
    `SELECT COUNT(*) AS n FROM activities WHERE created_at > ?`,
    Date.now() - 7 * 86400000,
  );
  const stale = countQuery(
    `SELECT COUNT(*) AS n FROM deals WHERE stage NOT IN ('won','lost') AND updated_at < ?`,
    Date.now() - 30 * 86400000,
  );

  const numerator = verified + active + Math.min(recentTouches, 50);
  const denominator = 1 + active * 0.5 + stale * 2 + Math.max(0, 50 - recentTouches) * 0.3;
  const score = clamp((numerator / denominator) * 4);
  return {
    score: Math.round(score),
    numerator,
    denominator: Math.round(denominator),
    verified,
    active,
    recentTouches,
    stale,
  };
}

/* ────────────── 5. Campaign ROI ────────────── */

export function campaignRoi(campaignId: string): {
  roi: number;
  revenue: number;
  cost: number;
  attributed: number;
} {
  const c = db
    .prepare(`SELECT budget, spent, metrics FROM campaigns WHERE id = ?`)
    .get(campaignId) as Partial<CampaignRow> | undefined;
  if (!c) return { roi: 0, revenue: 0, cost: 0, attributed: 0 };

  let conversions = 0;
  try {
    conversions = Number(JSON.parse(c.metrics || "{}").conversions || 0);
  } catch {
    /* metrics not valid JSON */
  }
  const aovRow = db.prepare(`SELECT COALESCE(AVG(value), 800) AS aov FROM deals`).get() as
    AovRow | undefined;
  const aov = aovRow?.aov ?? 800;
  const attributed = conversions * aov;
  const cost = Number(c.spent || 0) || Number(c.budget || 0);
  const roi = cost > 0 ? ((attributed - cost) / cost) * 100 : 0;
  return {
    roi: Math.round(roi),
    revenue: Math.round(attributed),
    cost: Math.round(cost),
    attributed: Math.round(attributed),
  };
}

/* ────────────── 6. Pipeline Velocity ────────────── */

export function pipelineVelocity(): {
  velocityPerDay: number;
  wonDeals: number;
  avgDealSize: number;
  avgCycleDays: number;
} {
  const wonDeals = db
    .prepare(`SELECT COUNT(*) AS n, COALESCE(AVG(value),0) AS v FROM deals WHERE stage='won'`)
    .get() as { n: number; v: number } | undefined;
  const cycle = db
    .prepare(
      `
    SELECT AVG((updated_at - created_at) / 86400000.0) AS d
    FROM deals WHERE stage='won'
  `,
    )
    .get() as CycleRow | undefined;
  const avgDealSize = Number(wonDeals?.v ?? 0);
  const avgCycleDays = Math.max(1, Number(cycle?.d ?? 30));
  const velocityPerDay = (Number(wonDeals?.n ?? 0) * avgDealSize) / avgCycleDays;
  return {
    velocityPerDay: Math.round(velocityPerDay),
    wonDeals: Number(wonDeals?.n ?? 0),
    avgDealSize: Math.round(avgDealSize),
    avgCycleDays: Math.round(avgCycleDays),
  };
}

/* ────────────── 7. Next Best Action (NBA) ────────────── */

export type NextAction =
  | { action: "call"; label: string; reason: string; score: number }
  | { action: "email_reengage"; label: string; reason: string; score: number }
  | { action: "send_offer"; label: string; reason: string; score: number }
  | { action: "ask_referral"; label: string; reason: string; score: number }
  | { action: "qualify"; label: string; reason: string; score: number }
  | { action: "nurture"; label: string; reason: string; score: number };

export function nextBestAction(contactId: string): NextAction {
  const c = db.prepare(`SELECT * FROM contacts WHERE id = ?`).get(contactId) as
    Partial<ContactRow> | undefined;
  if (!c) return { action: "qualify", label: "Qualify", reason: "Unknown contact", score: 0 };

  const rsi = relationshipStrength(contactId);
  const churn = churnRisk(contactId);
  const lead = leadPriority(contactId);
  const lastTouchDays = c.last_touch_at ? daysSince(c.last_touch_at) : daysSince(c.created_at);
  const dealsOpen = countQuery(
    `SELECT COUNT(*) AS n FROM deals WHERE contact_id = ? AND stage NOT IN ('won','lost')`,
    contactId,
  );

  const candidates: NextAction[] = [];

  candidates.push({
    action: "call",
    score: lead.score * 0.8 + (rsi.score > 60 ? 20 : 0),
    label: "Call now",
    reason: `Lead priority ${lead.score}, RSI ${rsi.score}. High-intent contact deserves voice.`,
  });
  candidates.push({
    action: "send_offer",
    score: lead.score > 70 ? lead.score : lead.score * 0.4,
    label: "Send tailored offer",
    reason: "Lead score is high — present the offer directly with a deadline.",
  });
  candidates.push({
    action: "email_reengage",
    score: rsi.score < 40 ? 70 + churn.score * 0.3 : 30,
    label: "Re-engage by email",
    reason:
      lastTouchDays > 14
        ? `It's been ${Math.round(lastTouchDays)} days. A short, personal re-engagement wins attention.`
        : "Touch base to keep the relationship warm.",
  });
  candidates.push({
    action: "ask_referral",
    score: rsi.score > 75 && dealsOpen === 0 ? 75 : 20,
    label: "Ask for referral",
    reason: "RSI high and no open deal — best moment to expand the network.",
  });
  candidates.push({
    action: "nurture",
    score: lead.score < 40 && rsi.score < 50 ? 60 : 25,
    label: "Add to nurture sequence",
    reason: "Not sales-ready yet — drip education, case studies, and proof.",
  });
  candidates.push({
    action: "qualify",
    score: lead.fit < 30 ? 65 : 15,
    label: "Qualify further",
    reason: "Low fit signals — confirm ICP match before investing more time.",
  });

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0];
}

/* ────────────── 8. Customer Health Score ────────────── */

export function customerHealth(contactId: string): {
  score: number;
  usage: number;
  satisfaction: number;
  engagement: number;
  renewal: number;
} {
  const c = db
    .prepare(`SELECT sentiment, last_touch_at FROM contacts WHERE id = ?`)
    .get(contactId) as Partial<ContactRow> | undefined;
  if (!c) return { score: 0, usage: 0, satisfaction: 0, engagement: 0, renewal: 0 };

  const touches30d = countQuery(
    `SELECT COUNT(*) AS n FROM activities WHERE contact_id = ? AND created_at > ?`,
    contactId,
    Date.now() - 30 * 86400000,
  );
  const usage = clamp(touches30d * 6);

  const satisfaction = clamp(((Number(c.sentiment) || 0) + 1) * 50);

  const engagement = clamp(touches30d * 5);

  const renewalDeals = countQuery(
    `
    SELECT COUNT(*) AS n FROM deals WHERE contact_id = ? AND stage = 'won'
  `,
    contactId,
  );
  const renewal = clamp((renewalDeals > 0 ? 80 : 40) - (daysSince(c.last_touch_at) > 90 ? 30 : 0));

  const score = clamp(usage * 0.3 + satisfaction * 0.25 + engagement * 0.2 + renewal * 0.25);
  return {
    score: Math.round(score),
    usage: Math.round(usage),
    satisfaction: Math.round(satisfaction),
    engagement: Math.round(engagement),
    renewal: Math.round(renewal),
  };
}

/* ────────────── 9. Agent Efficiency Score ────────────── */

export function agentEfficiency(): {
  score: number;
  usefulActions: number;
  totalRuns: number;
  errorRate: number;
  avgMs: number;
} {
  const runs = db
    .prepare(`SELECT id, output, created_at FROM agent_runs ORDER BY created_at DESC LIMIT 200`)
    .all() as AgentRunRow[];
  if (!runs.length) return { score: 0, usefulActions: 0, totalRuns: 0, errorRate: 0, avgMs: 0 };

  const usefulActions = runs.filter((r) => {
    try {
      const o = JSON.parse(r.output || "{}") as Record<string, unknown>;
      return (
        o &&
        (o.text || o.output || o.headline || o.copy || (o.ideas as unknown[] | undefined)?.length)
      );
    } catch {
      return false;
    }
  }).length;

  const errors = runs.filter((r) => /error|failed/i.test(r.output || "")).length;
  const errorRate = (errors / runs.length) * 100;

  const score = clamp((usefulActions / runs.length) * 100 - errorRate * 0.5);
  return {
    score: Math.round(score),
    usefulActions,
    totalRuns: runs.length,
    errorRate: Math.round(errorRate),
    avgMs: 0,
  };
}

/* ────────────── 10. Business Momentum Score ────────────── */

export function businessMomentum(): {
  score: number;
  tasksCompleted: number;
  dealsProgressed: number;
  followupsSent: number;
  insightsGenerated: number;
} {
  const last7 = Date.now() - 7 * 86400000;

  const tasksCompleted = countQuery(
    `SELECT COUNT(*) AS n FROM tasks WHERE status='done' AND updated_at > ?`,
    last7,
  );
  const dealsProgressed = countQuery(`SELECT COUNT(*) AS n FROM deals WHERE updated_at > ?`, last7);
  const followupsSent = countQuery(
    `SELECT COUNT(*) AS n FROM email_outbox WHERE sent_at > ?`,
    last7,
  );
  const insightsGenerated = countQuery(
    `SELECT COUNT(*) AS n FROM agent_runs WHERE created_at > ?`,
    last7,
  );

  const score = clamp(
    Math.min(tasksCompleted, 20) * 5 +
      Math.min(dealsProgressed, 20) * 5 +
      Math.min(followupsSent, 30) * 3.3 +
      Math.min(insightsGenerated, 15) * 6.7,
  );

  return {
    score: Math.round(score),
    tasksCompleted,
    dealsProgressed,
    followupsSent,
    insightsGenerated,
  };
}

/* ────────────── Full CRM intelligence bundle ────────────── */

export function fullIntelligence() {
  return {
    momentum: businessMomentum(),
    velocity: pipelineVelocity(),
    forecast: forecastConfidence(),
    agents: agentEfficiency(),
    retention: retentionScore(),
    generated_at: new Date().toISOString(),
  };
}

export function intelligenceForContact(contactId: string) {
  return {
    rsi: relationshipStrength(contactId),
    leadPriority: leadPriority(contactId),
    churn: churnRisk(contactId),
    health: customerHealth(contactId),
    nba: nextBestAction(contactId),
  };
}

/** Rank all contacts by lead priority — for the "hot list" view. */
export function topLeads(limit = 20) {
  const contacts = db
    .prepare(
      `
    SELECT id, first_name, last_name, email, company, score, source, last_touch_at
    FROM contacts
    ORDER BY score DESC NULLS LAST
    LIMIT 200
  `,
    )
    .all() as Partial<ContactRow>[];
  return contacts
    .map((c) => {
      const lp = leadPriority(c.id!);
      const name = [c.first_name, c.last_name].filter(Boolean).join(" ").trim() || c.email!;
      const { score: _dbScore, ...rest } = c;
      return { ...rest, name, ...lp };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Rank all contacts by churn risk — for the "save list" view. */
export function atRisk(limit = 20) {
  const contacts = db
    .prepare(
      `
    SELECT id, first_name, last_name, email, company, sentiment, last_touch_at
    FROM contacts
    ORDER BY id LIMIT 500
  `,
    )
    .all() as Partial<ContactRow>[];
  return contacts
    .map((c) => {
      const cr = churnRisk(c.id!);
      const name = [c.first_name, c.last_name].filter(Boolean).join(" ").trim() || c.email!;
      const { score: _dbScore, ...rest } = c;
      return { ...rest, name, ...cr };
    })
    .filter((c) => c.score > 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
