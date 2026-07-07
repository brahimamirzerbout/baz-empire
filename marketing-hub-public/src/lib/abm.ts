/**
 * ABM (Account-Based Marketing) — target companies, not just contacts.
 *
 * Tiered approach:
 *   - tier_1: Strategic — hand-crafted outreach, named owner, deep personalization
 *   - tier_2: Named — semi-personalized at scale
 *   - tier_3: Programmatic — automated, rules-based
 *
 * Account scoring:
 *   - abm_score = weighted engagement from contacts at the company
 *   - intent_score = external signals (placeholder; wire to Bombora/6sense in real impl)
 *   - tier = highest tier assigned to the company
 */
import { db, uid, now } from "@/lib/db";

export interface Account {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  revenue_range?: string;
  tier: "tier_1" | "tier_2" | "tier_3";
  abm_score: number;
  intent_score: number;
  owner?: string;
  notes?: string;
  created_at: number;
  updated_at: number;
}

export function listAccounts(): Account[] {
  return db.prepare(`SELECT * FROM accounts ORDER BY abm_score DESC, name ASC`).all() as Record<string, unknown>[];
}

export function getAccount(id: string): Account | null {
  return db.prepare(`SELECT * FROM accounts WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
}

export function createAccount(input: Partial<Account>): Account {
  const id = input.id || uid("acc_");
  const t = now();
  db.prepare(
    `
    INSERT INTO accounts (id, name, domain, industry, size, revenue_range, tier, abm_score, intent_score, owner, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    input.name || "Untitled Account",
    input.domain || null,
    input.industry || null,
    input.size || null,
    input.revenue_range || null,
    input.tier || "tier_3",
    input.abm_score || 0,
    input.intent_score || 0,
    input.owner || null,
    input.notes || null,
    t,
    t,
  );
  return getAccount(id)!;
}

export function updateAccount(id: string, patch: Partial<Account>): Account | null {
  const existing = getAccount(id);
  if (!existing) return null;
  const merged = { ...existing, ...patch, updated_at: now() };
  db.prepare(
    `
    UPDATE accounts SET name=?, domain=?, industry=?, size=?, revenue_range=?, tier=?, abm_score=?, intent_score=?, owner=?, notes=?, updated_at=?
    WHERE id=?
  `,
  ).run(
    merged.name,
    merged.domain,
    merged.industry,
    merged.size,
    merged.revenue_range,
    merged.tier,
    merged.abm_score,
    merged.intent_score,
    merged.owner,
    merged.notes,
    merged.updated_at,
    id,
  );
  return merged;
}

export function deleteAccount(id: string) {
  db.prepare(`DELETE FROM accounts WHERE id = ?`).run(id);
}

/** Recompute every account's abm_score from its contacts' engagement. */
export function recomputeAccountScores(): number {
  const accounts = db.prepare(`SELECT id, name FROM accounts`).all() as Record<string, unknown>[];
  // Map contact → account via company match (lowercase company name === account name)
  let updated = 0;
  for (const a of accounts) {
    const like = a.name.toLowerCase();
    const contacts = db
      .prepare(
        `
      SELECT c.id, c.score, c.sentiment, c.last_touch_at,
             (SELECT COUNT(*) FROM activities WHERE contact_id = c.id) AS activity_count,
             (SELECT COUNT(*) FROM deals WHERE contact_id = c.id AND stage = 'won') AS won_deals,
             (SELECT COALESCE(SUM(value),0) FROM deals WHERE contact_id = c.id AND stage = 'won') AS won_value
      FROM contacts c
      WHERE LOWER(c.company) = ?
    `,
      )
      .all(like) as Record<string, unknown>[];

    if (contacts.length === 0) {
      db.prepare(`UPDATE accounts SET abm_score = 0, updated_at = ? WHERE id = ?`).run(now(), a.id);
      continue;
    }
    // ABM score = weighted aggregate
    let score = 0;
    for (const c of contacts) {
      const contactScore =
        (c.score || 0) * 0.4 +
        Math.min(50, (c.activity_count || 0) * 2) * 0.3 +
        (c.last_touch_at && Date.now() - c.last_touch_at < 30 * 86400000 ? 20 : 0) * 0.3;
      score += contactScore;
    }
    // Won deals boost score heavily
    const wonBoost = contacts.reduce((s, c) => s + (c.won_value || 0) / 100, 0);
    score = Math.min(100, Math.round(score / Math.max(1, contacts.length) + wonBoost));
    db.prepare(`UPDATE accounts SET abm_score = ?, updated_at = ? WHERE id = ?`).run(
      score,
      now(),
      a.id,
    );
    updated++;
  }
  return updated;
}

/** Tier distribution + top accounts. */
export function abmOverview() {
  const byTier = db
    .prepare(`SELECT tier, COUNT(*) AS n FROM accounts GROUP BY tier`)
    .all() as Record<string, unknown>[];
  const top = listAccounts().slice(0, 10);
  const totalAccounts = db.prepare(`SELECT COUNT(*) AS n FROM accounts`).get() as Record<string, unknown> | undefined;
  return {
    total_accounts: totalAccounts.n || 0,
    by_tier: byTier.reduce((acc: Record<string, number>, r: Record<string, unknown>) => {
      acc[r.tier] = r.n;
      return acc;
    }, {}),
    top_accounts: top,
  };
}
