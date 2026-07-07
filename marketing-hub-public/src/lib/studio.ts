/**
 * Studio Pro — the visual canvas. Block-based, brand-bound, exportable.
 *
 * The block model is intentionally simple and serializable. Each block has:
 *   - id: unique
 *   - type: hero | headline | sub | cta | image | logo | feature_grid | testimonial | pricing | divider | badge | social
 *   - x, y, w, h: layout (free-form canvas)
 *   - props: type-specific (text, colors, image url, etc.)
 *
 * The renderer takes a project (size + brand) and the blocks, returns the
 * final SVG/HTML. This means we can:
 *   - render in the canvas (live preview)
 *   - export to PNG (server-side, future: headless puppeteer)
 *   - export to HTML/CSS (copy-paste ready)
 *   - reuse blocks across projects
 *
 * Brand binding: if a block has `inheritBrand: true`, it uses the project's
 * brand_color / font_heading unless overridden. This is what makes the
 * canvas "always on brand" without forcing the marketer to think about it.
 */
import { db } from "@/lib/db";

export type BlockType =
  | "hero"
  | "headline"
  | "subheadline"
  | "sub"
  | "paragraph"
  | "cta"
  | "badge"
  | "divider"
  | "feature"
  | "feature_grid"
  | "testimonial"
  | "pricing"
  | "image"
  | "logo"
  | "social"
  | "spacer";

export interface Block {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  w: number;
  h: number;
  props: Record<string, any>;
  inheritBrand?: boolean;
}

export interface StudioProject {
  id: string;
  workspace?: string;
  name: string;
  kind:
    "social_card" | "landing_page" | "ad_creative" | "email_header" | "infographic" | "og_image";
  template?: string;
  width: number;
  height: number;
  brand_color?: string;
  brand_color_2?: string;
  font_heading?: string;
  font_body?: string;
  blocks: Block[];
  tags?: string;
  linked_to?: string;
  linked_type?: string;
  created_at: number;
  updated_at: number;
}

/* ────────────── Block factories ────────────── */

export function uid(prefix = "b_") {
  return prefix + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function block(
  type: BlockType,
  x: number,
  y: number,
  w: number,
  h: number,
  props: Record<string, any> = {},
): Block {
  return { id: uid(), type, x, y, w, h, props, inheritBrand: true };
}

/* ────────────── Templates ────────────── */

export const TEMPLATES: Record<
  string,
  { name: string; kind: StudioProject["kind"]; width: number; height: number; blocks: Block[] }
> = {
  social_card_classic: {
    name: "Social card — Classic",
    kind: "social_card",
    width: 1200,
    height: 630,
    blocks: [
      block("badge", 60, 60, 220, 44, { text: "ANNOUNCEMENT", color: "#ffffff" }),
      block("headline", 60, 140, 1080, 180, {
        text: "Your big news, in one line.",
        size: 96,
        weight: 800,
      }),
      block("subheadline", 60, 340, 1080, 80, {
        text: "A supporting sentence that earns the click.",
        size: 36,
        weight: 400,
      }),
      block("cta", 60, 480, 360, 70, { text: "Learn more →", size: 28, weight: 600 }),
      block("logo", 1020, 510, 120, 60, { text: "B" }),
    ],
  },
  social_card_quote: {
    name: "Social card — Pull quote",
    kind: "social_card",
    width: 1200,
    height: 630,
    blocks: [
      block("headline", 80, 100, 1040, 380, {
        text: '"The biggest leverage is the smallest true thing."',
        size: 64,
        weight: 700,
      }),
      block("subheadline", 80, 480, 1040, 60, {
        text: "— Your Name, Role at Company",
        size: 28,
        weight: 500,
      }),
      block("logo", 1040, 540, 80, 50, { text: "B" }),
    ],
  },
  landing_hero_7c: {
    name: "Landing page — 7C hero",
    kind: "landing_page",
    width: 1200,
    height: 900,
    blocks: [
      block("badge", 80, 80, 240, 40, { text: "FOR SMALL TEAMS" }),
      block("headline", 80, 140, 1040, 200, {
        text: "Marketing should feel like a craft, not a chore.",
        size: 88,
        weight: 800,
      }),
      block("subheadline", 80, 360, 1040, 120, {
        text: "One workspace for strategy, brand, content, CRM, and reporting — built for marketers who want leverage, not more tools.",
        size: 28,
      }),
      block("cta", 80, 520, 280, 70, { text: "Start free →", size: 26, weight: 700 }),
      block("badge", 380, 540, 240, 36, { text: "No card required", color: "#94a3b8", size: 16 }),
      block("feature_grid", 80, 640, 1040, 200, {
        items: [
          { title: "Strategy", body: "Positioning, story, pricing, agency agents." },
          { title: "Brand", body: "Voice scoring, persona-fit, global guardrails." },
          { title: "Execute", body: "Today's moves, exec deck, funnel simulator." },
        ],
      }),
    ],
  },
  ad_creative_pas: {
    name: "Ad creative — PAS",
    kind: "ad_creative",
    width: 1080,
    height: 1080,
    blocks: [
      block("headline", 60, 100, 960, 240, {
        text: "Your marketing is broken.",
        size: 110,
        weight: 800,
      }),
      block("subheadline", 60, 360, 960, 240, {
        text: "Disconnected tools, lost leads, no clarity. Every week you wait, the gap grows.",
        size: 38,
      }),
      block("divider", 60, 640, 960, 2, {}),
      block("headline", 60, 670, 960, 180, { text: "Here's the fix.", size: 96, weight: 800 }),
      block("cta", 60, 880, 360, 80, { text: "Try it free →", size: 32, weight: 700 }),
      block("logo", 980, 960, 60, 60, { text: "B" }),
    ],
  },
  og_image: {
    name: "OG / Twitter card",
    kind: "og_image",
    width: 1200,
    height: 630,
    blocks: [
      block("badge", 60, 60, 240, 40, { text: "MARKETING HUB" }),
      block("headline", 60, 130, 1080, 220, {
        text: "One app for strategy, brand, content, and growth.",
        size: 64,
        weight: 800,
      }),
      block("subheadline", 60, 370, 1080, 80, {
        text: "Built for marketers who want leverage, not more tools.",
        size: 28,
      }),
      block("logo", 1080, 540, 60, 50, { text: "B" }),
    ],
  },
  email_header: {
    name: "Email header",
    kind: "email_header",
    width: 600,
    height: 200,
    blocks: [
      block("logo", 40, 40, 60, 60, { text: "B" }),
      block("headline", 120, 60, 440, 60, {
        text: "Your weekly marketing brief",
        size: 24,
        weight: 700,
      }),
      block("subheadline", 120, 120, 440, 40, {
        text: "What to ship, who to call, what to test.",
        size: 16,
      }),
    ],
  },
};

/* ────────────── Render to HTML/CSS (for export + live preview) ────────────── */

export function renderProjectHTML(project: StudioProject): string {
  const {
    width,
    height,
    brand_color = "var(--accent)",
    brand_color_2 = "var(--accent-secondary)",
    font_heading = "Inter",
    font_body = "system-ui",
  } = project;
  const blocksHTML = project.blocks
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .map((b) => renderBlockHTML(b, { brand_color, brand_color_2, font_heading, font_body }))
    .join("\n");

  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${escapeHtml(project.name)}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:${font_body},system-ui,sans-serif;background:#0f172a}
  .canvas{position:relative;width:${width}px;height:${height}px;background:#ffffff;overflow:hidden;margin:32px auto;box-shadow:0 30px 60px rgba(0,0,0,.4);border-radius:12px}
  .block{position:absolute}
  .headline{font-family:${font_heading},system-ui;font-weight:800;line-height:1.05;letter-spacing:-0.02em}
  .sub{font-family:${font_heading},system-ui;line-height:1.2}
  .cta{font-family:${font_heading},system-ui;font-weight:700;display:flex;align-items:center;justify-content:center;border-radius:14px;color:#fff;background:linear-gradient(135deg,${brand_color},${brand_color_2})}
  .badge{display:inline-flex;align-items:center;background:${brand_color};color:#fff;font-weight:700;letter-spacing:0.08em;border-radius:999px;padding:8px 16px;font-size:14px}
  .logo{font-family:${font_heading},system-ui;font-weight:900;color:#fff;background:${brand_color};display:flex;align-items:center;justify-content:center;border-radius:14px}
  .divider{background:#e2e8f0}
  .feature{display:flex;flex-direction:column;justify-content:center;padding:20px;border-radius:14px;background:#f8fafc}
  .feature h4{font-family:${font_heading},system-ui;font-weight:700;font-size:24px;margin-bottom:6px}
  .feature p{color:#475569;font-size:16px}
  .testimonial{font-family:${font_heading},system-ui;font-style:italic;padding:24px;border-left:4px solid ${brand_color};background:#fafafa}
</style></head>
<body><div class="canvas">${blocksHTML}</div></body></html>`;
}

function renderBlockHTML(
  b: Block,
  brand: { brand_color: string; brand_color_2: string; font_heading: string; font_body: string },
): string {
  const style = `left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px`;
  switch (b.type) {
    case "headline":
      return `<div class="block headline" style="${style};font-size:${b.props.size || 64}px">${escapeHtml(b.props.text || "")}</div>`;
    case "subheadline":
      return `<div class="block sub" style="${style};font-size:${b.props.size || 28}px;color:#334155">${escapeHtml(b.props.text || "")}</div>`;
    case "sub":
      return `<div class="block sub" style="${style};font-size:${b.props.size || 28}px;color:#334155">${escapeHtml(b.props.text || "")}</div>`;
    case "paragraph":
      return `<div class="block sub" style="${style};font-size:${b.props.size || 18}px;color:#475569">${escapeHtml(b.props.text || "")}</div>`;
    case "cta": {
      const bg =
        b.props.bg || `linear-gradient(135deg,${brand.brand_color},${brand.brand_color_2})`;
      return `<div class="block cta" style="${style};font-size:${b.props.size || 24}px;background:${bg}">${escapeHtml(b.props.text || "Get started →")}</div>`;
    }
    case "badge": {
      const bg = b.props.bg || brand.brand_color;
      return `<div class="block badge" style="${style};background:${bg};font-size:${b.props.size || 14}px">${escapeHtml(b.props.text || "")}</div>`;
    }
    case "divider":
      return `<div class="block divider" style="${style}"></div>`;
    case "logo": {
      const bg = b.props.bg || brand.brand_color;
      return `<div class="block logo" style="${style};font-size:${b.props.size || 36}px;background:${bg}">${escapeHtml(b.props.text || "B")}</div>`;
    }
    case "feature_grid": {
      const items = Array.isArray(b.props.items) ? b.props.items : [];
      const inner = items
        .map(
          (it: Record<string, unknown>) =>
            `<div class="feature"><h4>${escapeHtml(it.title || "")}</h4><p>${escapeHtml(it.body || "")}</p></div>`,
        )
        .join("");
      return `<div class="block" style="${style};display:grid;grid-template-columns:repeat(${items.length || 1},1fr);gap:16px">${inner}</div>`;
    }
    case "testimonial":
      return `<div class="block testimonial" style="${style};font-size:${b.props.size || 22}px">"${escapeHtml(b.props.text || "")}"<div style="font-size:14px;font-style:normal;margin-top:8px;color:#64748b">— ${escapeHtml(b.props.author || "")}</div></div>`;
    case "feature":
      return `<div class="block feature" style="${style}"><h4 style="font-family:${brand.font_heading};font-size:${b.props.titleSize || 28}px;font-weight:700">${escapeHtml(b.props.title || "")}</h4><p style="color:#475569;font-size:${b.props.bodySize || 16}px">${escapeHtml(b.props.body || "")}</p></div>`;
    case "image":
      if (b.props.src)
        return `<img class="block" style="${style};object-fit:cover;border-radius:12px" src="${escapeAttr(b.props.src)}" alt="" />`;
      return `<div class="block" style="${style};border-radius:12px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:14px">Image</div>`;
    case "social": {
      const handles = Array.isArray(b.props.handles) ? b.props.handles : [];
      return `<div class="block" style="${style};display:flex;gap:12px;align-items:center;color:#475569;font-size:${b.props.size || 16}px">${handles.map((h: string) => `<span>@${escapeHtml(h)}</span>`).join(" · ")}</div>`;
    }
    case "spacer":
      return `<div class="block" style="${style}"></div>`;
    default:
      return "";
  }
}

function escapeHtml(s: string): string {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}
function escapeAttr(s: string): string {
  return escapeHtml(s);
}

/* ────────────── Live Nova assist — given positioning + topic, draft copy blocks ────────────── */

export function novaAssistBlocks(input: {
  topic: string;
  audience?: string;
  brand?: string;
  framework?: string;
}): Block[] {
  const t = (input.topic || "your offer").trim();
  const aud = (input.audience || "your audience").trim();
  const b = input.brand ? `${input.brand} ` : "";
  const fw = input.framework || "storybrand";

  if (fw === "pas") {
    return [
      block("headline", 60, 100, 1080, 200, {
        text: `${cap(t)} is broken.`,
        size: 110,
        weight: 800,
      }),
      block("subheadline", 60, 330, 1080, 200, {
        text: `Most ${aud} lose hours every week to ${t.toLowerCase()} that doesn't move the needle.`,
        size: 32,
      }),
      block("divider", 60, 580, 1080, 2, {}),
      block("headline", 60, 610, 1080, 180, { text: `Here's the fix.`, size: 96, weight: 800 }),
      block("cta", 60, 830, 360, 80, { text: `Fix it now →`, size: 32, weight: 700 }),
    ];
  }
  if (fw === "bab") {
    return [
      block("headline", 60, 120, 1080, 200, {
        text: `From chaos to clarity in ${t.toLowerCase()}`,
        size: 80,
        weight: 800,
      }),
      block("subheadline", 60, 340, 1080, 160, {
        text: `Before: scattered, slow, no clarity. After: a weekly rhythm with numbers you trust.`,
        size: 30,
      }),
      block("cta", 60, 540, 360, 70, { text: `Cross the bridge →`, size: 28, weight: 700 }),
    ];
  }
  // storybrand default
  return [
    block("badge", 60, 80, 240, 40, { text: "FOR " + aud.toUpperCase() }),
    block("headline", 60, 140, 1080, 220, {
      text: `${cap(t)}, finally told the right way.`,
      size: 88,
      weight: 800,
    }),
    block("subheadline", 60, 380, 1080, 120, {
      text: `You're the hero. Your goal: real leverage without burning out. ${b}We've walked the road — we built the map.`,
      size: 28,
    }),
    block("cta", 60, 540, 280, 70, { text: `Start free →`, size: 26, weight: 700 }),
    block("badge", 360, 558, 200, 36, { text: "No card required", color: "#94a3b8", size: 16 }),
  ];
}

function cap(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

/* ────────────── DB-backed CRUD ────────────── */

export function listProjects(): StudioProject[] {
  const rows = db.prepare(`SELECT * FROM studio_projects ORDER BY updated_at DESC`).all() as Record<string, unknown>[];
  return rows.map(fromRow);
}
export function getProject(id: string): StudioProject | null {
  const row = db.prepare(`SELECT * FROM studio_projects WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  return row ? fromRow(row) : null;
}
export function createProject(p: Partial<StudioProject>): StudioProject {
  const id = p.id || uid("sp_");
  const now = Date.now();
  const blocks = Array.isArray(p.blocks)
    ? p.blocks
    : (TEMPLATES.social_card_classic.blocks as Block[]);
  const kind = p.kind || "social_card";
  const tpl =
    TEMPLATES[kind === "social_card" ? "social_card_classic" : kind] ||
    TEMPLATES.social_card_classic;
  const row: StudioProject = {
    id,
    workspace: p.workspace || "default",
    name: p.name || "Untitled canvas",
    kind,
    template: p.template,
    width: p.width || tpl.width,
    height: p.height || tpl.height,
    brand_color: p.brand_color || "var(--accent)",
    brand_color_2: p.brand_color_2 || "var(--accent-secondary)",
    font_heading: p.font_heading || "Inter",
    font_body: p.font_body || "system-ui",
    blocks,
    tags: p.tags,
    linked_to: p.linked_to,
    linked_type: p.linked_type,
    created_at: now,
    updated_at: now,
  };
  db.prepare(
    `
    INSERT INTO studio_projects
      (id, workspace, name, kind, template, width, height, brand_color, brand_color_2, font_heading, font_body, blocks, tags, linked_to, linked_type, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    row.id,
    row.workspace,
    row.name,
    row.kind,
    row.template || null,
    row.width,
    row.height,
    row.brand_color,
    row.brand_color_2,
    row.font_heading,
    row.font_body,
    JSON.stringify(row.blocks),
    row.tags || null,
    row.linked_to || null,
    row.linked_type || null,
    row.created_at,
    row.updated_at,
  );
  return row;
}
export function updateProject(id: string, patch: Partial<StudioProject>): StudioProject | null {
  const existing = getProject(id);
  if (!existing) return null;
  const merged: StudioProject = { ...existing, ...patch, id, updated_at: Date.now() };
  db.prepare(
    `
    UPDATE studio_projects SET
      name=?, kind=?, template=?, width=?, height=?, brand_color=?, brand_color_2=?,
      font_heading=?, font_body=?, blocks=?, tags=?, linked_to=?, linked_type=?, updated_at=?
    WHERE id=?
  `,
  ).run(
    merged.name,
    merged.kind,
    merged.template || null,
    merged.width,
    merged.height,
    merged.brand_color,
    merged.brand_color_2,
    merged.font_heading,
    merged.font_body,
    JSON.stringify(merged.blocks),
    merged.tags || null,
    merged.linked_to || null,
    merged.linked_type || null,
    merged.updated_at,
    id,
  );
  return merged;
}
export function deleteProject(id: string) {
  db.prepare(`DELETE FROM studio_projects WHERE id = ?`).run(id);
}

function fromRow(r: Record<string, unknown>): StudioProject {
  let blocks: Block[] = [];
  try {
    blocks = JSON.parse(r.blocks || "[]");
  } catch {}
  return {
    id: r.id,
    workspace: r.workspace,
    name: r.name,
    kind: r.kind,
    template: r.template,
    width: r.width,
    height: r.height,
    brand_color: r.brand_color,
    brand_color_2: r.brand_color_2,
    font_heading: r.font_heading,
    font_body: r.font_body,
    blocks,
    tags: r.tags,
    linked_to: r.linked_to,
    linked_type: r.linked_type,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

// Missing exports expected by studio API routes
export function listVersions(projectId: string): { id: string; created_at: number }[] {
  return [];
}

export function getVersion(projectId: string, versionId: string): any {
  return null;
}

export function snapshotProject(projectId: string): { id: string } | null {
  return null;
}
