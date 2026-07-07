/**
 * Today's Moves — the 3 (or up to 5) highest-leverage actions a marketer
 * should take today, derived from the live intelligence layer.
 *
 * Heuristic, but grounded in the Nova formulas and the existing data.
 * Each move explains WHY it was chosen.
 */
import { db } from "@/lib/db";
import { fullIntelligence, nextBestAction, relationshipStrength } from "@/lib/intelligence";

export interface Move {
  priority: number; // 1..5
  icon: string; // lucide icon name (UI resolves)
  title: string;
  why: string;
  action: string; // short CTA-style verb
  href: string; // deep link
  ctaLabel: string;
  meta?: Record<string, any>;
}

export function todaysMoves(limit = 5): Move[] {
  const intel = fullIntelligence();
  const moves: Move[] = [];

  // 1) Stale deals → highest leverage if there are any
  if (intel.forecast.stale > 0) {
    const stale = db
      .prepare(
        `
      SELECT id, title, value, contact_id FROM deals
      WHERE stage NOT IN ('won','lost') AND updated_at < ?
      ORDER BY value DESC LIMIT 1
    `,
      )
      .get(Date.now() - 30 * 86400000) as Record<string, unknown> | undefined;
    if (stale) {
      moves.push({
        priority: 1,
        icon: "Flame",
        title: `Re-engage the "${stale.title}" deal ($${(stale.value || 0).toLocaleString()})`,
        why: `${intel.forecast.stale} deals have gone cold 30+ days. The top one by value is still winnable with a personal touch — a Loom beats another templated email.`,
        action: "Send a personal re-engagement",
        href: `/crm`,
        ctaLabel: "Open CRM",
        meta: { dealId: stale.id, contactId: stale.contact_id },
      });
    }
  }

  // 2) Hot contact → relationship moment
  const hot = db
    .prepare(
      `
    SELECT id, first_name, last_name, email, company, score FROM contacts
    WHERE last_touch_at IS NULL OR last_touch_at < ?
    ORDER BY score DESC LIMIT 50
  `,
    )
    .all(Date.now() - 7 * 86400000) as Record<string, unknown>[];
  let best: Record<string, unknown> | null = null;
  let bestRsi = -1;
  for (const c of hot) {
    const rsi = relationshipStrength(c.id).score;
    if (rsi > bestRsi) {
      bestRsi = rsi;
      best = c;
    }
  }
  if (best && bestRsi > 0) {
    const nba = nextBestAction(best.id);
    moves.push({
      priority: 2,
      icon: "PhoneCall",
      title: `${nba.label}: ${[best.first_name, best.last_name].filter(Boolean).join(" ") || best.email}`,
      why: nba.reason + ` · RSI ${bestRsi}.`,
      action: nba.label,
      href: `/crm`,
      ctaLabel: "Open contact",
      meta: { contactId: best.id, rsi: bestRsi, nba: nba.action },
    });
  }

  // 3) Underused channel or no recent agent runs
  if (intel.momentum.insightsGenerated === 0) {
    moves.push({
      priority: 3,
      icon: "Sparkles",
      title: "Run the Strategist agent for a fresh campaign brief",
      why: "Zero Strategy Agent runs this week. A 5-minute brief unblocks the next quarter of positioning, story, and offers.",
      action: "Hire the Strategist",
      href: `/strategy/agents`,
      ctaLabel: "Open Agency",
    });
  }

  // 4) Pipeline velocity: if low and no momentum, push next-week experiment
  if (intel.velocity.velocityPerDay < 1000 && intel.velocity.wonDeals > 0) {
    moves.push({
      priority: 4,
      icon: "FlaskConical",
      title: "Ship one A/B test on the top-of-funnel CTA",
      why: `Pipeline velocity is $${intel.velocity.velocityPerDay.toLocaleString()}/day. A 1pt lift on CTR compounds more than another week of new content.`,
      action: "Set up an experiment",
      href: `/experiments`,
      ctaLabel: "Open experiments",
    });
  }

  // 5) Content cadence
  const last7Content =
    (
      db
        .prepare(`SELECT COUNT(*) AS n FROM content WHERE created_at > ?`)
        .get(Date.now() - 7 * 86400000) as Record<string, unknown> | undefined
    ).n || 0;
  if (last7Content < 3) {
    moves.push({
      priority: 5,
      icon: "Calendar",
      title: "Fill this week's content calendar",
      why: `Only ${last7Content} content pieces in the last 7 days. Cadence beats brilliance — pick three slots and ship.`,
      action: "Plan content",
      href: `/calendar`,
      ctaLabel: "Open calendar",
    });
  }

  // 6) Voice guardrails: if any global story settings, surface them as a daily reminder
  const story = db
    .prepare(`SELECT value FROM settings WHERE key = 'smallest_true_thing'`)
    .get() as Record<string, unknown> | undefined;
  if (story?.value) {
    moves.push({
      priority: moves.length + 1,
      icon: "Quote",
      title: `Today: lead with your smallest true thing`,
      why: `"${story.value}" — the more often this phrase shows up in this week's copy, the more the brand compounds.`,
      action: "Open Copy generator",
      href: `/copy`,
      ctaLabel: "Open Copy",
    });
  }

  return moves.slice(0, limit);
}
