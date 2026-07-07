/**
 * GDPR consent management.
 *
 * Records every grant/revoke with timestamp, source, and metadata.
 * Provides data-export and right-to-be-forgotten endpoints.
 */
import { db, uid, now } from "@/lib/db";

export type ConsentPurpose = "marketing" | "analytics" | "sales" | "third_party" | "all";

export interface ConsentRecord {
  id: string;
  contact_id: string;
  purpose: ConsentPurpose;
  granted: boolean;
  ip?: string;
  user_agent?: string;
  source?: string;
  occurred_at: number;
}

export function recordConsent(input: Omit<ConsentRecord, "id" | "occurred_at">): ConsentRecord {
  const id = uid("cn_");
  const t = now();
  db.prepare(
    `
    INSERT INTO consent_log (id, contact_id, purpose, granted, ip, user_agent, source, occurred_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    input.contact_id,
    input.purpose,
    input.granted ? 1 : 0,
    input.ip || null,
    input.user_agent || null,
    input.source || null,
    t,
  );
  return { ...input, id, occurred_at: t };
}

export function latestConsent(contactId: string, purpose: ConsentPurpose): ConsentRecord | null {
  return db
    .prepare(
      `
    SELECT * FROM consent_log
    WHERE contact_id = ? AND purpose = ?
    ORDER BY occurred_at DESC LIMIT 1
  `,
    )
    .get(contactId, purpose) as Record<string, unknown> | undefined;
}

export function consentOverview(): {
  byPurpose: Record<string, { granted: number; revoked: number }>;
} {
  const rows = db
    .prepare(
      `
    SELECT purpose, granted, COUNT(*) AS n FROM consent_log GROUP BY purpose, granted
  `,
    )
    .all() as Record<string, unknown>[];
  const byPurpose: Record<string, { granted: number; revoked: number }> = {};
  for (const r of rows) {
    if (!byPurpose[r.purpose]) byPurpose[r.purpose] = { granted: 0, revoked: 0 };
    if (r.granted) byPurpose[r.purpose].granted += r.n;
    else byPurpose[r.purpose].revoked += r.n;
  }
  return { byPurpose };
}

/** Right to be forgotten — anonymize a contact, keep aggregates. */
export function forgetContact(contactId: string) {
  const contact = db.prepare(`SELECT * FROM contacts WHERE id = ?`).get(contactId) as Record<string, unknown> | undefined;
  if (!contact) return false;
  const now_ = Date.now();
  db.prepare(
    `
    UPDATE contacts SET
      first_name = 'Erased',
      last_name = '',
      email = ?,
      phone = '',
      company = '',
      title = '',
      notes = '',
      tags = '[]',
      sentiment = 0,
      score = 0,
      source = 'erased',
      status = 'erased'
    WHERE id = ?
  `,
  ).run(`erased+${contactId}@deleted.local`, contactId);
  db.prepare(
    `INSERT INTO consent_log (id, contact_id, purpose, granted, source, occurred_at) VALUES (?, ?, 'all', 0, 'gdpr_forget', ?)`,
  ).run(uid("cn_"), contactId, now_);
  return true;
}

/** Export all data for a contact (subject access request). */
export function exportContactData(contactId: string) {
  const contact = db.prepare(`SELECT * FROM contacts WHERE id = ?`).get(contactId) as Record<string, unknown> | undefined;
  const activities = db
    .prepare(`SELECT * FROM activities WHERE contact_id = ?`)
    .all(contactId) as Record<string, unknown>[];
  const deals = db.prepare(`SELECT * FROM deals WHERE contact_id = ?`).all(contactId) as Record<string, unknown>[];
  const consents = db
    .prepare(`SELECT * FROM consent_log WHERE contact_id = ? ORDER BY occurred_at DESC`)
    .all(contactId) as Record<string, unknown>[];
  const touchpoints = db
    .prepare(`SELECT * FROM touchpoints WHERE contact_id = ?`)
    .all(contactId) as Record<string, unknown>[];
  const enrollments = db
    .prepare(`SELECT * FROM sequence_enrollments WHERE contact_id = ?`)
    .all(contactId) as Record<string, unknown>[];
  return { contact, activities, deals, consents, touchpoints, sequence_enrollments: enrollments };
}
