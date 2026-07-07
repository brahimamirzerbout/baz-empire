/**
 * CSV export — turn any list of objects into a downloadable CSV.
 * RFC 4180 compliant: quotes, escapes, BOM optional.
 */
export function toCSV(rows: Record<string, unknown>[], columns?: string[]): string {
  if (!rows || !rows.length) return columns ? columns.join(",") : "";
  const cols = columns || Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const esc = (v: unknown): string => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const header = cols.join(",");
  const body = rows.map((r) => cols.map((c) => esc(r[c])).join(",")).join("\n");
  return header + "\n" + body + "\n";
}

export function csvResponse(rows: Record<string, unknown>[], columns?: string[], filename = "export.csv"): Response {
  const csv = toCSV(rows, columns);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
