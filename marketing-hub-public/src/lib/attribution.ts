/**
 * Multi-touch attribution.
 *
 * The core insight: a deal almost never closes from a single touchpoint.
 * "Last-touch" attribution over-credits the final channel; "first-touch"
 * over-credits awareness. Real attribution distributes credit.
 *
 * Models implemented:
 *   - first_touch   — 100% credit to the first touchpoint
 *   - last_touch    — 100% credit to the last touchpoint (HubSpot default)
 *   - linear        — equal credit across all touchpoints
 *   - time_decay    — exponentially more credit to recent touches (half-life 7d)
 *   - position_based — 40% first + 40% last + 20% spread across middle (U-shaped)
 *   - data_driven   — heuristic: channels with >50% conversion rate get more credit
 */
import { db } from "@/lib/db";

export type AttributionModel =
  "first_touch" | "last_touch" | "linear" | "time_decay" | "position_based" | "data_driven";

export interface Touchpoint {
  id: string;
  deal_id: string;
  contact_id?: string;
  channel: string;
  campaign_id?: string;
  asset?: string;
  occurred_at: number;
}

export interface ChannelCredit {
  channel: string;
  credit: number; // absolute $ amount
  share: number; // 0..1 of total
  touchpoint_count: number;
}

export interface DealAttribution {
  deal_id: string;
  deal_title: string;
  deal_value: number;
  model: AttributionModel;
  touchpoints: number;
  credits: ChannelCredit[];
  first_touch_channel: string;
  last_touch_channel: string;
  days_to_close: number;
}

const VALID_MODELS: AttributionModel[] = [
  "first_touch",
  "last_touch",
  "linear",
  "time_decay",
  "position_based",
  "data_driven",
];

function getTouchpointsForDeal(dealId: string): Touchpoint[] {
  return db
    .prepare(`SELECT * FROM touchpoints WHERE deal_id = ? ORDER BY occurred_at ASC`)
    .all(dealId) as Record<string, unknown>[];
}

function getConversionRateByChannel(): Record<string, number> {
  // Data-driven prior: ratio of touches that resulted in a won deal
  const rows = db
    .prepare(
      `
    SELECT t.channel,
           COUNT(DISTINCT t.id) AS touches,
           COUNT(DISTINCT CASE WHEN d.stage = 'won' THEN d.id END) AS won_deals
    FROM touchpoints t
    LEFT JOIN deals d ON d.id = t.deal_id
    GROUP BY t.channel
  `,
    )
    .all() as Record<string, unknown>[];
  const out: Record<string, number> = {};
  for (const r of rows) {
    out[r.channel] = r.touches > 0 ? r.won_deals / r.touches : 0;
  }
  return out;
}

export function attributeDeal(
  dealId: string,
  model: AttributionModel = "position_based",
): DealAttribution | null {
  if (!VALID_MODELS.includes(model)) return null;
  const deal = db.prepare(`SELECT * FROM deals WHERE id = ?`).get(dealId) as Record<string, unknown> | undefined;
  if (!deal) return null;
  const tps = getTouchpointsForDeal(dealId);
  if (!tps.length) {
    return {
      deal_id: dealId,
      deal_title: deal.title,
      deal_value: deal.value || 0,
      model,
      touchpoints: 0,
      credits: [],
      first_touch_channel: "—",
      last_touch_channel: "—",
      days_to_close: deal.won_at ? Math.floor((deal.won_at - deal.created_at) / 86400000) : 0,
    };
  }

  const value = deal.value || 0;
  let weights: number[];

  switch (model) {
    case "first_touch":
      weights = tps.map((_, i) => (i === 0 ? 1 : 0));
      break;
    case "last_touch":
      weights = tps.map((_, i) => (i === tps.length - 1 ? 1 : 0));
      break;
    case "linear":
      weights = tps.map(() => 1 / tps.length);
      break;
    case "time_decay": {
      const halfLife = 7 * 86400000;
      const last = Math.max(...tps.map((t) => t.occurred_at));
      weights = tps.map((t) => Math.pow(0.5, (last - t.occurred_at) / halfLife));
      const wsum = weights.reduce((s, w) => s + w, 0);
      weights = weights.map((w) => w / wsum);
      break;
    }
    case "position_based": {
      // U-shaped: 40% first + 40% last + 20% spread
      if (tps.length === 1) weights = [1];
      else if (tps.length === 2) weights = [0.5, 0.5];
      else {
        weights = tps.map(() => 0);
        weights[0] = 0.4;
        weights[weights.length - 1] = 0.4;
        const middle = 0.2 / (tps.length - 2);
        for (let i = 1; i < tps.length - 1; i++) weights[i] = middle;
      }
      break;
    }
    case "data_driven": {
      const rates = getConversionRateByChannel();
      const mean =
        Object.values(rates).reduce((s, r) => s + r, 0) / Math.max(1, Object.keys(rates).length);
      weights = tps.map((t) => Math.max(0.1, rates[t.channel] || mean));
      const wsum = weights.reduce((s, w) => s + w, 0);
      weights = weights.map((w) => w / wsum);
      break;
    }
  }

  // Aggregate by channel
  const channelMap = new Map<string, { credit: number; count: number }>();
  tps.forEach((t, i) => {
    const w = weights[i];
    const credit = value * w;
    const cur = channelMap.get(t.channel) || { credit: 0, count: 0 };
    cur.credit += credit;
    cur.count += 1;
    channelMap.set(t.channel, cur);
  });

  const credits: ChannelCredit[] = Array.from(channelMap.entries())
    .map(([channel, v]) => ({
      channel,
      credit: Math.round(v.credit),
      share: value > 0 ? v.credit / value : 0,
      touchpoint_count: v.count,
    }))
    .sort((a, b) => b.credit - a.credit);

  return {
    deal_id: dealId,
    deal_title: deal.title,
    deal_value: value,
    model,
    touchpoints: tps.length,
    credits,
    first_touch_channel: tps[0].channel,
    last_touch_channel: tps[tps.length - 1].channel,
    days_to_close: deal.won_at ? Math.floor((deal.won_at - deal.created_at) / 86400000) : 0,
  };
}

/** Attribute ALL won deals and roll up by channel. */
export function attributionRollup(model: AttributionModel = "position_based"): {
  channel_credits: ChannelCredit[];
  total_attributed: number;
  deals_attributed: number;
  model: AttributionModel;
} {
  const deals = db.prepare(`SELECT id FROM deals WHERE stage = 'won'`).all() as Record<string, unknown>[];
  const channelMap = new Map<string, number>();
  let totalAttributed = 0;
  let count = 0;
  for (const d of deals) {
    const r = attributeDeal(d.id, model);
    if (!r) continue;
    count++;
    totalAttributed += r.deal_value;
    for (const c of r.credits) {
      channelMap.set(c.channel, (channelMap.get(c.channel) || 0) + c.credit);
    }
  }
  const channel_credits: ChannelCredit[] = Array.from(channelMap.entries())
    .map(([channel, credit]) => ({
      channel,
      credit: Math.round(credit),
      share: totalAttributed > 0 ? credit / totalAttributed : 0,
      touchpoint_count: 0,
    }))
    .sort((a, b) => b.credit - a.credit);
  return { channel_credits, total_attributed: totalAttributed, deals_attributed: count, model };
}

export function logTouchpoint(t: Omit<Touchpoint, "id">): Touchpoint {
  const id = `tp_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
  db.prepare(
    `
    INSERT INTO touchpoints (id, deal_id, contact_id, channel, campaign_id, asset, occurred_at, attribution_weight, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1.0, ?)
  `,
  ).run(
    id,
    t.deal_id,
    t.contact_id || null,
    t.channel,
    t.campaign_id || null,
    t.asset || null,
    t.occurred_at,
    Date.now(),
  );
  return { ...t, id };
}
