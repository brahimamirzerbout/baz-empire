/**
 * Marketing Dive-style newsletter subscriptions:
 *   - Daily Dive (M-F)
 *   - Mobile Weekly (Thursday)
 *   - Agencies Weekly (Monday)
 * Plus our own brand-specific digests.
 */
import { db, now } from "@/lib/db";

export const NEWSLETTERS = [
  {
    id: "daily-dive",
    label: "Daily Dive",
    cadence: "Weekdays",
    description: "Top marketing industry news, M–F.",
  },
  {
    id: "mobile-weekly",
    label: "Mobile Weekly",
    cadence: "Thursdays",
    description: "Mobile marketing + martech weekly.",
  },
  {
    id: "agencies-weekly",
    label: "Agencies Weekly",
    cadence: "Mondays",
    description: "Agency news + creative industry digest.",
  },
  {
    id: "triangle-pulse",
    label: "Triangle Pulse",
    cadence: "Daily",
    description: "Your Marketing ↔ Sales ↔ Nova loop summary.",
  },
];

export interface NewsletterSub {
  id: string;
  user_id: string;
  newsletter_id: string;
  email: string;
  active: number;
  created_at: number;
}

export function listSubs(userId: string) {
  db.exec(`CREATE TABLE IF NOT EXISTS newsletter_subs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    newsletter_id TEXT NOT NULL,
    email TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    UNIQUE(user_id, newsletter_id)
  );`);
  return db.prepare(`SELECT * FROM newsletter_subs WHERE user_id = ?`).all(userId) as Record<string, unknown>[];
}

export function setSub(userId: string, newsletterId: string, email: string, active: boolean) {
  db.exec(`CREATE TABLE IF NOT EXISTS newsletter_subs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    newsletter_id TEXT NOT NULL,
    email TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    UNIQUE(user_id, newsletter_id)
  );`);
  const id = `sub_${userId}_${newsletterId}`;
  db.prepare(
    `
    INSERT INTO newsletter_subs (id, user_id, newsletter_id, email, active, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, newsletter_id) DO UPDATE SET active = excluded.active, email = excluded.email
  `,
  ).run(id, userId, newsletterId, email, active ? 1 : 0, now());
  return { id, active };
}
