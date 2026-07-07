/**
 * Marketing Dive-style Library: gated resources — playbooks, webinars,
 * reports, infographics, surveys. Stored locally; the original library is
 * sponsored content, so we mirror that model: every resource has a sponsor
 * and a format.
 */
import { db, now } from "@/lib/db";

export const LIBRARY_FORMATS = [
  { id: "playbook", label: "Playbook" },
  { id: "webinar", label: "Webinar (on demand)" },
  { id: "report", label: "Industry Report" },
  { id: "infographic", label: "Infographic" },
  { id: "survey", label: "Survey Report" },
  { id: "trendline", label: "Trendline" },
  { id: "virtual-event", label: "Virtual Event Playback" },
];

export interface LibraryItem {
  id: string;
  title: string;
  url: string;
  format: string;
  sponsor: string;
  topic: string;
  description: string | null;
  published_at: number;
}

export function listLibrary(opts: { format?: string; topic?: string; q?: string } = {}) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS dive_library (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      format TEXT NOT NULL,
      sponsor TEXT NOT NULL,
      topic TEXT NOT NULL,
      description TEXT,
      published_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_lib_format ON dive_library(format);
    CREATE INDEX IF NOT EXISTS idx_lib_topic ON dive_library(topic);
  `);
  const where: string[] = [];
  const params: Record<string, unknown>[] = [];
  if (opts.format && opts.format !== "all") {
    where.push("format = ?");
    params.push(opts.format);
  }
  if (opts.topic && opts.topic !== "all") {
    where.push("topic = ?");
    params.push(opts.topic);
  }
  if (opts.q) {
    where.push("title LIKE ?");
    params.push(`%${opts.q}%`);
  }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const rows = db
    .prepare(`SELECT * FROM dive_library ${w} ORDER BY published_at DESC LIMIT 100`)
    .all(...params) as Record<string, unknown>[];
  return rows;
}

export function seedLibrary(rows: Array<Omit<LibraryItem, "id" | "published_at">>) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS dive_library (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      format TEXT NOT NULL,
      sponsor TEXT NOT NULL,
      topic TEXT NOT NULL,
      description TEXT,
      published_at INTEGER NOT NULL
    );
  `);
  const insert = db.prepare(`
    INSERT OR IGNORE INTO dive_library (id, title, url, format, sponsor, topic, description, published_at)
    VALUES (@id, @title, @url, @format, @sponsor, @topic, @description, @published_at)
  `);
  let n = 0;
  const tx = db.transaction(() => {
    for (const r of rows) {
      const id = `lib_${r.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .slice(0, 40)}_${r.sponsor.toLowerCase().replace(/[^a-z0-9]+/g, "")}`;
      const ok = insert.run({ id, ...r, published_at: now() });
      if (ok.changes) n++;
    }
  });
  tx();
  return n;
}
