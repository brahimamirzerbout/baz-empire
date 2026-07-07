import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { renderLandingPage, Block } from "@/lib/blocks";
import { loadFontSettings } from "@/lib/fonts";

/**
 * Public landing page renderer. Lives at /p/[slug] and bypasses the
 * dashboard layout entirely (this is a route handler, not a page.tsx).
 */
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const row = db
    .prepare(`SELECT * FROM landing_pages WHERE slug = ? AND published = 1`)
    .get(params.slug) as Record<string, unknown> | undefined;
  if (!row) {
    return new Response(render404(), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
  let blocks: Block[] = [];
  try {
    blocks = JSON.parse(row.blocks || "[]");
  } catch {}
  if (!Array.isArray(blocks)) blocks = [];

  const fonts = await loadFontSettings();
  const { setExportFontSettings } = await import("@/lib/blocks");
  setExportFontSettings(fonts);

  const html = renderLandingPage(blocks, {
    title: row.meta_title || row.title,
    metaDescription: row.meta_description || row.description || "",
    theme: "#b87adb",
    slug: row.slug,
  });

  // Log a view event (best-effort)
  try {
    const { logEmailEvent } = await import("@/lib/email");
    logEmailEvent("lp:" + row.id, "open", `/p/${row.slug}`, { source: "landing_page_view" });
  } catch {}

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

function render404() {
  return `<!doctype html><html><head><title>Page not found</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
      body{margin:0;font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;display:grid;place-items:center;min-height:100vh;text-align:center;padding:24px}
      h1{font-size:24px;margin:0 0 8px}
      p{color:#94a3b8;margin:0}
    </style></head>
    <body><div><h1>This page isn't published.</h1><p>The link may be wrong, or the page was unpublished.</p></div></body></html>`;
}
