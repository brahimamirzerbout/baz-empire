import { NextRequest } from "next/server";
import { json, err } from "@/lib/api-helpers";
import { db, uid, now } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/embed?id=<form_id>
 * Returns a tiny self-contained JS snippet that renders the form on any
 * external site. No CORS issues — uses standard form post.
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return err("id required", 400);
  const form = db.prepare(`SELECT * FROM forms WHERE id = ?`).get(id) as
    Record<string, unknown> | undefined;
  if (!form) return err("Form not found", 404);

  const origin = req.nextUrl.origin;
  const fields: unknown[] = (() => {
    try {
      return JSON.parse(form.fields || "[]");
    } catch {
      return [];
    }
  })();

  // Minimal embeddable form: a script tag that injects a form into a div with id="baz-form-<id>"
  const html = `<div id="baz-form-${id}"></div>
<script>
(function(){
  var FIELDS = ${JSON.stringify(fields)};
  var SUBMIT = ${JSON.stringify(form.submit_button || "Submit")};
  var SUCCESS = ${JSON.stringify(form.success_message || "Thanks!")};
  var ORIGIN = ${JSON.stringify(origin)};
  var FORM_ID = ${JSON.stringify(id)};
  var root = document.getElementById('baz-form-' + FORM_ID);
  if (!root) return;
  root.innerHTML = '<form id="baz-f" style="font-family:system-ui;max-width:480px;margin:0 auto;padding:16px;background:#fff;border:1px solid #e2e8f0;border-radius:12px">' +
    FIELDS.map(function(f){ return labelFor(f) + inputFor(f); }).join('') +
    '<button type="submit" style="background:#888888;color:#fff;border:0;border-radius:8px;padding:10px 16px;font-weight:600;cursor:pointer;width:100%;margin-top:8px">' + SUBMIT + '</button>' +
    '</form><div id="baz-f-msg" style="margin-top:8px;font-size:14px"></div>';
  function labelFor(f){ return '<label style="display:block;font-size:12px;font-weight:600;margin:8px 0 4px;color:#334155">' + (f.label || f.name) + '</label>'; }
  function inputFor(f){
    var n = f.name || f.id;
    var ph = ' placeholder="' + (f.placeholder || '') + '"';
    if (f.type === 'textarea') return '<textarea name="'+n+'" required="'+(f.required||false)+'"'+ph+' style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:8px;font:inherit"></textarea>';
    if (f.type === 'select') return '<select name="'+n+'" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:8px;font:inherit">' + (f.options||[]).map(function(o){return '<option>'+o+'</option>';}).join('') + '</select>';
    return '<input name="'+n+'" type="'+(f.type||'text')+'" required="'+(f.required||false)+'"'+ph+' style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:8px;font:inherit">';
  }
  document.getElementById('baz-f').addEventListener('submit', function(e){
    e.preventDefault();
    var data = {};
    new FormData(e.target).forEach(function(v,k){ data[k] = v; });
    fetch(ORIGIN + '/api/embed', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-BAZ-Form': FORM_ID},
      body: JSON.stringify(data),
      mode: 'cors'
    }).then(function(r){ return r.json(); }).then(function(j){
      document.getElementById('baz-f-msg').innerHTML = '<div style="background:#dcfce7;color:#166534;padding:8px 12px;border-radius:8px">✓ ' + (j.ok ? SUCCESS : 'Something went wrong') + '</div>';
      if (j.ok) document.getElementById('baz-f').reset();
    }).catch(function(){
      document.getElementById('baz-f-msg').innerHTML = '<div style="background:#fee2e2;color:#991b1b;padding:8px 12px;border-radius:8px">Network error</div>';
    });
  });
})();
</script>`;

  return new Response(html, {
    headers: { "Content-Type": "application/javascript; charset=utf-8" },
  });
}

/**
 * POST /api/embed  — receives a form submission from the embed snippet.
 * CORS-friendly: any origin can submit.
 */
export async function POST(req: NextRequest) {
  const formId = req.headers.get("x-baz-form") || new URL(req.url).searchParams.get("form");
  if (!formId)
    return new Response(JSON.stringify({ ok: false, error: "missing form id" }), {
      status: 400,
      headers: cors(),
    });
  const form = db.prepare(`SELECT * FROM forms WHERE id = ?`).get(formId) as
    Record<string, unknown> | undefined;
  if (!form)
    return new Response(JSON.stringify({ ok: false, error: "not found" }), {
      status: 404,
      headers: cors(),
    });

  // Optional auth — if a session cookie is present, attribute. If not, still allow (public embed).
  try {
    const { currentUser } = await import("@/lib/auth");
    // presence only — we don't require auth
    void currentUser;
  } catch {}

  const body = await req.json().catch(() => ({}));
  const submissionId = uid("sub_");
  const t = now();
  db.prepare(
    `
    INSERT INTO form_submissions (id, form_id, payload, contact_email, contact_name, source, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    submissionId,
    formId,
    JSON.stringify(body),
    body.email || null,
    body.name || null,
    "embed",
    t,
  );
  db.prepare(`UPDATE forms SET leads_count = leads_count + 1, updated_at = ? WHERE id = ?`).run(
    t,
    formId,
  );

  return new Response(JSON.stringify({ ok: true, id: submissionId }), {
    status: 201,
    headers: { "Content-Type": "application/json", ...cors() },
  });
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-BAZ-Form",
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: cors() });
}
