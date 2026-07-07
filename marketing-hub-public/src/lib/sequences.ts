/**
 * Sales sequences — multi-step outbound cadences.
 *
 * Step shape:
 *   { day: number, channel: 'email' | 'task' | 'linkedin', subject?, body?, task_title?, delay_hours? }
 *
 * On enrollment:
 *   - contact gets step 1 at enroll time (delay 0)
 *   - subsequent steps fire at next_action_at = previous_action_at + step.day * 86400000
 *   - if contact replies, sequence pauses (status='replied')
 *   - if sequence books a meeting, status='booked'
 */
import { db, uid, now } from "@/lib/db";

export interface SequenceStep {
  day: number;
  channel: "email" | "task" | "linkedin";
  subject?: string;
  body?: string;
  task_title?: string;
}

export interface Sequence {
  id: string;
  name: string;
  description?: string;
  active: number;
  steps: SequenceStep[];
  enrolled_count: number;
  replied_count: number;
  booked_count: number;
  created_at: number;
}

export function listSequences(): Sequence[] {
  return db.prepare(`SELECT * FROM sales_sequences ORDER BY created_at DESC`).all() as Record<string, unknown>[];
}

export function getSequence(id: string): Sequence | null {
  const row = db.prepare(`SELECT * FROM sales_sequences WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  if (!row) return null;
  let steps: SequenceStep[] = [];
  try {
    steps = JSON.parse(row.steps || "[]");
  } catch {}
  return { ...row, steps };
}

export function createSequence(input: Record<string, unknown>): Sequence {
  const id = input.id || uid("seq_");
  const t = now();
  db.prepare(
    `
    INSERT INTO sales_sequences (id, name, description, active, steps, enrolled_count, replied_count, booked_count, created_at)
    VALUES (?, ?, ?, ?, ?, 0, 0, 0, ?)
  `,
  ).run(
    id,
    input.name || "Untitled sequence",
    input.description || "",
    input.active === false ? 0 : 1,
    JSON.stringify(input.steps || []),
    t,
  );
  return getSequence(id)!;
}

export function updateSequence(id: string, patch: Partial<Sequence>): Sequence | null {
  const existing = getSequence(id);
  if (!existing) return null;
  const merged = { ...existing, ...patch };
  db.prepare(
    `
    UPDATE sales_sequences SET name=?, description=?, active=?, steps=? WHERE id=?
  `,
  ).run(merged.name, merged.description || "", merged.active, JSON.stringify(merged.steps), id);
  return merged;
}

export function deleteSequence(id: string) {
  db.prepare(`DELETE FROM sequence_enrollments WHERE sequence_id = ?`).run(id);
  db.prepare(`DELETE FROM sales_sequences WHERE id = ?`).run(id);
}

/** Enroll a contact into a sequence. */
export function enroll(sequenceId: string, contactId: string, dealId?: string): { id: string } {
  const id = uid("enr_");
  const t = now();
  // First step fires immediately
  const seq = getSequence(sequenceId);
  const firstAt = seq?.steps?.[0]?.day ? t + seq.steps[0].day * 86400000 : t;
  db.prepare(
    `
    INSERT INTO sequence_enrollments
      (id, sequence_id, contact_id, deal_id, current_step, status, enrolled_at, next_action_at, events, created_at)
    VALUES (?, ?, ?, ?, 0, 'active', ?, ?, '[]', ?)
  `,
  ).run(id, sequenceId, contactId, dealId || null, t, firstAt, t);
  db.prepare(`UPDATE sales_sequences SET enrolled_count = enrolled_count + 1 WHERE id = ?`).run(
    sequenceId,
  );
  return { id };
}

export function stopEnrollment(enrollmentId: string, reason = "manual") {
  const e = db.prepare(`SELECT * FROM sequence_enrollments WHERE id = ?`).get(enrollmentId) as Record<string, unknown> | undefined;
  if (!e) return;
  db.prepare(`UPDATE sequence_enrollments SET status = ?, last_event_at = ? WHERE id = ?`).run(
    `stopped:${reason}`,
    Date.now(),
    enrollmentId,
  );
}

/** Mark contact as replied → sequence pauses. */
export function markReplied(enrollmentId: string) {
  db.prepare(
    `UPDATE sequence_enrollments SET status = 'replied', last_event_at = ? WHERE id = ?`,
  ).run(Date.now(), enrollmentId);
  const e = db
    .prepare(`SELECT sequence_id FROM sequence_enrollments WHERE id = ?`)
    .get(enrollmentId) as Record<string, unknown> | undefined;
  if (e)
    db.prepare(`UPDATE sales_sequences SET replied_count = replied_count + 1 WHERE id = ?`).run(
      e.sequence_id,
    );
}

export function markBooked(enrollmentId: string) {
  db.prepare(
    `UPDATE sequence_enrollments SET status = 'booked', last_event_at = ? WHERE id = ?`,
  ).run(Date.now(), enrollmentId);
  const e = db
    .prepare(`SELECT sequence_id FROM sequence_enrollments WHERE id = ?`)
    .get(enrollmentId) as Record<string, unknown> | undefined;
  if (e)
    db.prepare(`UPDATE sales_sequences SET booked_count = booked_count + 1 WHERE id = ?`).run(
      e.sequence_id,
    );
}

/** Tick — advance active enrollments whose next_action_at <= now. */
export function tickSequences(now = Date.now()): number {
  const due = db
    .prepare(
      `
    SELECT e.*, s.steps AS seq_steps
    FROM sequence_enrollments e
    JOIN sales_sequences s ON s.id = e.sequence_id
    WHERE e.status = 'active' AND e.next_action_at <= ?
    LIMIT 50
  `,
    )
    .all(now) as Record<string, unknown>[];

  let fired = 0;
  for (const e of due) {
    let steps: SequenceStep[] = [];
    try {
      steps = JSON.parse(e.seq_steps || "[]");
    } catch {}
    const nextStepIdx = e.current_step + 1;
    if (nextStepIdx >= steps.length) {
      db.prepare(
        `UPDATE sequence_enrollments SET status = 'completed', last_event_at = ? WHERE id = ?`,
      ).run(now, e.id);
      continue;
    }
    const step = steps[nextStepIdx];
    const events = JSON.parse(e.events || "[]");
    events.push({
      at: now,
      step: nextStepIdx,
      channel: step.channel,
      action: step.subject || step.task_title || "step",
    });
    const nextActionAt = step.day ? now + step.day * 86400000 : now + 86400000;
    db.prepare(
      `
      UPDATE sequence_enrollments
      SET current_step = ?, events = ?, next_action_at = ?, last_event_at = ?
      WHERE id = ?
    `,
    ).run(nextStepIdx, JSON.stringify(events), nextActionAt, now, e.id);
    // Real send would happen here — for now we log as if queued to outbox
    if (step.channel === "email" && step.subject && step.body) {
      try {
        const { db: db2 } = require("@/lib/db");
        db2
          .prepare(
            `
          INSERT INTO email_outbox
            (id, to_email, to_name, from_email, from_name, subject, body_html, body_text, status, provider, attempts, created_at)
          VALUES (?, (SELECT email FROM contacts WHERE id = ?), (SELECT first_name || ' ' || last_name FROM contacts WHERE id = ?),
                  ?, ?, ?, ?, ?, 'queued', 'local', 0, ?)
        `,
          )
          .run(
            uid("rev_"),
            e.contact_id,
            e.contact_id,
            "sales@marketing-hub.local",
            "Sales",
            step.subject,
            `<p>${step.body.replace(/\n/g, "<br>")}</p>`,
            step.body,
            now,
          );
      } catch {}
    }
    if (step.channel === "task" && step.task_title) {
      try {
        const { db: db2 } = require("@/lib/db");
        db2
          .prepare(
            `
          INSERT INTO tasks (id, title, project, priority, due_date, created_at)
          VALUES (?, ?, 'sequences', 'medium', ?, ?)
        `,
          )
          .run(uid("tk_"), `Sequence: ${step.task_title}`, now + 86400000, now);
      } catch {}
    }
    fired++;
  }
  return fired;
}

export function enrollmentsFor(sequenceId?: string) {
  if (sequenceId) {
    return db
      .prepare(
        `SELECT * FROM sequence_enrollments WHERE sequence_id = ? ORDER BY enrolled_at DESC LIMIT 200`,
      )
      .all(sequenceId) as Record<string, unknown>[];
  }
  return db
    .prepare(`SELECT * FROM sequence_enrollments ORDER BY enrolled_at DESC LIMIT 200`)
    .all() as Record<string, unknown>[];
}

export function enrollmentStats(sequenceId: string) {
  const all = db
    .prepare(
      `SELECT status, COUNT(*) AS n FROM sequence_enrollments WHERE sequence_id = ? GROUP BY status`,
    )
    .all(sequenceId) as Record<string, unknown>[];
  const out: Record<string, number> = {};
  for (const r of all) out[r.status] = r.n;
  return out;
}
