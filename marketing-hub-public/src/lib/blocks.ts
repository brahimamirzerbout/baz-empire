// Block-based content model used by the Email Builder and Landing Page Builder.
// Each block is a discriminated union by `type`.

// Centralized font system — client-safe shared module (no DB import).
import { fontStack, FontSettings, DEFAULT_FONT_SETTINGS } from "./fonts-shared";

// Current font settings for export renders. Seeded at the top of each
// request by the route handler so every HTML export matches the user's
// chosen fonts. Falls back to GNOME defaults (Inter/Cantarell/Hack).
let _exportFonts: FontSettings = DEFAULT_FONT_SETTINGS;
export function setExportFontSettings(s: FontSettings) {
  _exportFonts = s;
}

export type Block =
  | {
      id: string;
      type: "heading";
      text: string;
      level: 1 | 2 | 3;
      align?: "left" | "center" | "right";
    }
  | { id: string; type: "text"; html: string; align?: "left" | "center" | "right" }
  | { id: string; type: "image"; src: string; alt: string; width?: string }
  | {
      id: string;
      type: "button";
      label: string;
      href: string;
      align?: "left" | "center" | "right";
      color?: string;
    }
  | { id: string; type: "divider" }
  | { id: string; type: "spacer"; height: number }
  | {
      id: string;
      type: "columns";
      items: Array<{
        heading?: string;
        text?: string;
        image?: string;
        button?: { label: string; href: string };
      }>;
    }
  | { id: string; type: "video"; src: string; poster?: string }
  | { id: string; type: "quote"; text: string; cite?: string }
  | { id: string; type: "list"; ordered: boolean; items: string[] }
  | { id: string; type: "html"; html: string }
  | {
      id: string;
      type: "hero";
      headline: string;
      sub: string;
      cta?: { label: string; href: string };
      bg?: string;
      image?: string;
    }
  | { id: string; type: "features"; items: Array<{ icon?: string; title: string; body: string }> }
  | {
      id: string;
      type: "cta";
      headline: string;
      body?: string;
      button: { label: string; href: string };
      bg?: string;
    }
  | {
      id: string;
      type: "testimonial";
      quote: string;
      author: string;
      role?: string;
      avatar?: string;
    }
  | {
      id: string;
      type: "pricing";
      plans: Array<{
        name: string;
        price: string;
        period?: string;
        features: string[];
        cta: { label: string; href: string };
        highlight?: boolean;
      }>;
    }
  | { id: string; type: "faq"; items: Array<{ q: string; a: string }> }
  | {
      id: string;
      type: "form";
      heading: string;
      fields: Array<{
        name: string;
        label: string;
        type?: string;
        required?: boolean;
        placeholder?: string;
      }>;
      submitLabel: string;
      successMessage?: string;
    }
  | {
      id: string;
      type: "footer";
      copyright: string;
      links?: Array<{ label: string; href: string }>;
    };

export function newBlock(type: Block["type"]): Block {
  const id = Math.random().toString(36).slice(2, 10);
  switch (type) {
    case "heading":
      return { id, type, text: "New heading", level: 2 };
    case "text":
      return { id, type, html: "<p>Your text here.</p>" };
    case "image":
      return { id, type, src: "", alt: "" };
    case "button":
      return { id, type, label: "Click me", href: "#", align: "center" };
    case "divider":
      return { id, type };
    case "spacer":
      return { id, type, height: 24 };
    case "columns":
      return {
        id,
        type,
        items: [{ text: "Column 1" }, { text: "Column 2" }, { text: "Column 3" }],
      };
    case "video":
      return { id, type, src: "" };
    case "quote":
      return { id, type, text: "An inspiring quote.", cite: "Author" };
    case "list":
      return { id, type, ordered: false, items: ["First item", "Second item", "Third item"] };
    case "html":
      return { id, type, html: "<p>Raw HTML</p>" };
    case "hero":
      return {
        id,
        type,
        headline: "Build a landing page",
        sub: "Drag, drop, publish.",
        cta: { label: "Get started", href: "#" },
      };
    case "features":
      return {
        id,
        type,
        items: [
          { title: "Fast", body: "Optimized for speed." },
          { title: "Easy", body: "No code required." },
          { title: "Flexible", body: "Anything you need." },
        ],
      };
    case "cta":
      return {
        id,
        type,
        headline: "Ready to get started?",
        body: "Join thousands of marketers.",
        button: { label: "Sign up free", href: "#" },
      };
    case "testimonial":
      return {
        id,
        type,
        quote: "This changed everything.",
        author: "Jane Doe",
        role: "Marketing Lead",
      };
    case "pricing":
      return {
        id,
        type,
        plans: [
          {
            name: "Starter",
            price: "$0",
            period: "month",
            features: ["1 user", "Basic features"],
            cta: { label: "Start free", href: "#" },
          },
          {
            name: "Pro",
            price: "$29",
            period: "month",
            features: ["Up to 10 users", "All features", "Priority support"],
            cta: { label: "Upgrade", href: "#" },
            highlight: true,
          },
        ],
      };
    case "faq":
      return {
        id,
        type,
        items: [
          { q: "How does it work?", a: "It's easy." },
          { q: "Can I cancel anytime?", a: "Yes." },
        ],
      };
    case "form":
      return {
        id,
        type,
        heading: "Get in touch",
        fields: [{ name: "email", label: "Email", type: "email", required: true }],
        submitLabel: "Submit",
        successMessage: "Thanks!",
      };
    case "footer":
      return {
        id,
        type,
        copyright: `© ${new Date().getFullYear()} Your Brand`,
        links: [
          { label: "Privacy", href: "#" },
          { label: "Terms", href: "#" },
        ],
      };
  }
}

export function blockDefaults(): Array<{
  type: Block["type"];
  label: string;
  icon: string;
  group: string;
}> {
  return [
    { type: "hero", label: "Hero", icon: "🌅", group: "Marketing" },
    { type: "features", label: "Features", icon: "✨", group: "Marketing" },
    { type: "cta", label: "Call to action", icon: "📣", group: "Marketing" },
    { type: "testimonial", label: "Testimonial", icon: "💬", group: "Marketing" },
    { type: "pricing", label: "Pricing", icon: "💰", group: "Marketing" },
    { type: "faq", label: "FAQ", icon: "❓", group: "Marketing" },
    { type: "form", label: "Form", icon: "📝", group: "Marketing" },
    { type: "footer", label: "Footer", icon: "🔻", group: "Marketing" },
    { type: "heading", label: "Heading", icon: "H", group: "Basic" },
    { type: "text", label: "Text", icon: "T", group: "Basic" },
    { type: "image", label: "Image", icon: "🖼", group: "Basic" },
    { type: "video", label: "Video", icon: "🎬", group: "Basic" },
    { type: "button", label: "Button", icon: "🔘", group: "Basic" },
    { type: "divider", label: "Divider", icon: "—", group: "Basic" },
    { type: "spacer", label: "Spacer", icon: "↕", group: "Basic" },
    { type: "columns", label: "Columns", icon: "▥", group: "Layout" },
    { type: "list", label: "List", icon: "•", group: "Layout" },
    { type: "quote", label: "Quote", icon: "❝", group: "Layout" },
    { type: "html", label: "Raw HTML", icon: "</>", group: "Advanced" },
  ];
}

function esc(s: string): string {
  return String(s ?? "").replace(
    /[<>&"']/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

// === Landing page HTML ===
export function renderLandingPage(
  blocks: Block[],
  opts: { title: string; metaDescription?: string; theme?: string; slug?: string },
): string {
  const body = blocks.map(renderLandingBlock).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.metaDescription || "")}">
<meta property="og:title" content="${esc(opts.title)}">
<meta property="og:description" content="${esc(opts.metaDescription || "")}">
<meta property="og:type" content="website">
<style>
:root { --brand: ${opts.theme || "var(--accent)"}; }
* { box-sizing: border-box; }
body { margin: 0; font-family: ${fontStack("body", _exportFonts)}; color: #0f172a; line-height: 1.6; }
.lp-container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
.lp-hero { padding: 96px 24px; text-align: center; }
.lp-hero h1 { font-size: 56px; margin: 0 0 16px; line-height: 1.1; letter-spacing: -0.02em; }
.lp-hero p { font-size: 20px; color: #475569; margin: 0 0 32px; }
.lp-btn { display: inline-block; background: var(--brand); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: transform .1s; }
.lp-btn:hover { transform: translateY(-1px); }
.lp-section { padding: 64px 24px; }
.lp-section h2 { font-size: 36px; margin: 0 0 16px; }
.lp-section p { color: #475569; font-size: 18px; }
.lp-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 32px; }
.lp-feature { padding: 24px; border-radius: 12px; background: #f8fafc; }
.lp-feature h3 { margin: 0 0 8px; font-size: 20px; }
.lp-pricing { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
.lp-plan { padding: 32px; border: 2px solid #e2e8f0; border-radius: 12px; text-align: center; }
.lp-plan.highlight { border-color: var(--brand); position: relative; }
.lp-plan .price { font-size: 48px; font-weight: 700; }
.lp-plan ul { list-style: none; padding: 0; margin: 24px 0; }
.lp-plan ul li { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
.lp-cta { background: var(--brand); color: white; padding: 80px 24px; text-align: center; border-radius: 16px; margin: 24px; }
.lp-cta h2 { color: white; font-size: 36px; margin: 0 0 16px; }
.lp-cta .lp-btn { background: white; color: var(--brand); }
.lp-testimonial { text-align: center; max-width: 700px; margin: 0 auto; font-style: italic; font-size: 22px; }
.lp-testimonial cite { display: block; margin-top: 16px; font-style: normal; color: #64748b; font-size: 16px; }
.lp-faq-item { border-bottom: 1px solid #e2e8f0; padding: 20px 0; }
.lp-faq-item h3 { font-size: 18px; margin: 0 0 8px; }
.lp-faq-item p { margin: 0; color: #475569; }
.lp-form { max-width: 500px; margin: 0 auto; display: grid; gap: 16px; }
.lp-form input, .lp-form textarea { padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px; font-family: inherit; }
.lp-form button { padding: 14px; background: var(--brand); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px; }
.lp-footer { padding: 40px 24px; text-align: center; color: #64748b; border-top: 1px solid #e2e8f0; margin-top: 64px; }
.lp-footer a { color: #64748b; margin: 0 8px; }
.lp-columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
.lp-divider { border: none; border-top: 1px solid #e2e8f0; margin: 32px 0; }
img.lp-img { max-width: 100%; height: auto; border-radius: 8px; }
@media (max-width: 600px) { .lp-hero h1 { font-size: 36px; } .lp-hero p { font-size: 16px; } }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

export function renderLandingBlock(b: Block): string {
  switch (b.type) {
    case "hero":
      return `<section class="lp-hero" style="${b.bg ? `background:${esc(b.bg)};color:white;` : ""}">
        <div class="lp-container">
          <h1>${esc(b.headline)}</h1>
          <p>${esc(b.sub)}</p>
          ${b.cta ? `<a class="lp-btn" href="${esc(b.cta.href)}">${esc(b.cta.label)}</a>` : ""}
        </div>
      </section>`;
    case "features":
      return `<section class="lp-section"><div class="lp-container">
        <div class="lp-features">
          ${b.items.map((f) => `<div class="lp-feature">${f.icon ? `<div style="font-size:32px;margin-bottom:8px">${esc(f.icon)}</div>` : ""}<h3>${esc(f.title)}</h3><p>${esc(f.body)}</p></div>`).join("")}
        </div>
      </div></section>`;
    case "cta":
      return `<section class="lp-cta" style="${b.bg ? `background:${esc(b.bg)};` : ""}">
        <h2>${esc(b.headline)}</h2>
        ${b.body ? `<p style="color:rgba(255,255,255,.85);font-size:18px;margin-bottom:24px">${esc(b.body)}</p>` : ""}
        <a class="lp-btn" href="${esc(b.button.href)}">${esc(b.button.label)}</a>
      </section>`;
    case "testimonial":
      return `<section class="lp-section"><div class="lp-container">
        <blockquote class="lp-testimonial">"${esc(b.quote)}"<cite>— ${esc(b.author)}${b.role ? `, ${esc(b.role)}` : ""}</cite></blockquote>
      </div></section>`;
    case "pricing":
      return `<section class="lp-section"><div class="lp-container">
        <div class="lp-pricing">
          ${b.plans
            .map(
              (p) => `<div class="lp-plan${p.highlight ? " highlight" : ""}">
            <h3>${esc(p.name)}</h3>
            <div class="price">${esc(p.price)}${p.period ? `<span style="font-size:16px;color:#64748b">/${esc(p.period)}</span>` : ""}</div>
            <ul>${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
            <a class="lp-btn" href="${esc(p.cta.href)}">${esc(p.cta.label)}</a>
          </div>`,
            )
            .join("")}
        </div>
      </div></section>`;
    case "faq":
      return `<section class="lp-section"><div class="lp-container" style="max-width:700px">
        <h2 style="text-align:center;margin-bottom:40px">Frequently asked questions</h2>
        ${b.items.map((i) => `<div class="lp-faq-item"><h3>${esc(i.q)}</h3><p>${esc(i.a)}</p></div>`).join("")}
      </div></section>`;
    case "form":
      return `<section class="lp-section"><div class="lp-container">
        <h2 style="text-align:center">${esc(b.heading)}</h2>
        <form class="lp-form" onsubmit="event.preventDefault();alert('${esc(b.successMessage || "Thanks!")}')">
          ${b.fields.map((f) => `<div><label style="display:block;margin-bottom:4px;font-weight:600">${esc(f.label)}${f.required ? " *" : ""}</label><input type="${esc(f.type || "text")}" name="${esc(f.name)}" placeholder="${esc(f.placeholder || "")}" ${f.required ? "required" : ""}></div>`).join("")}
          <button type="submit">${esc(b.submitLabel)}</button>
        </form>
      </div></section>`;
    case "footer":
      return `<footer class="lp-footer">
        <p>${esc(b.copyright)}</p>
        ${b.links ? `<p>${b.links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join("")}</p>` : ""}
      </footer>`;
    case "heading":
      return `<div class="lp-container" style="text-align:${b.align || "left"}"><h${b.level}>${esc(b.text)}</h${b.level}></div>`;
    case "text":
      return `<div class="lp-container" style="text-align:${b.align || "left"}">${b.html}</div>`;
    case "image":
      return `<div class="lp-container" style="text-align:center"><img class="lp-img" src="${esc(b.src)}" alt="${esc(b.alt)}"${b.width ? ` style="width:${esc(b.width)}"` : ""}></div>`;
    case "button":
      return `<div class="lp-container" style="text-align:${b.align || "center"};margin:24px 0"><a class="lp-btn" href="${esc(b.href)}" style="${b.color ? `background:${esc(b.color)}` : ""}">${esc(b.label)}</a></div>`;
    case "divider":
      return `<div class="lp-container"><hr class="lp-divider"></div>`;
    case "spacer":
      return `<div class="lp-container" style="height:${b.height}px"></div>`;
    case "columns":
      return `<div class="lp-container"><div class="lp-columns">${b.items.map((c) => `<div>${c.heading ? `<h3>${esc(c.heading)}</h3>` : ""}${c.image ? `<img class="lp-img" src="${esc(c.image)}">` : ""}${c.text ? `<p>${esc(c.text)}</p>` : ""}${c.button ? `<a class="lp-btn" href="${esc(c.button.href)}">${esc(c.button.label)}</a>` : ""}</div>`).join("")}</div></div>`;
    case "video":
      return `<div class="lp-container" style="text-align:center"><video controls src="${esc(b.src)}"${b.poster ? ` poster="${esc(b.poster)}"` : ""} style="max-width:100%"></video></div>`;
    case "quote":
      return `<div class="lp-container"><blockquote style="border-left:4px solid var(--brand);padding:16px 24px;font-style:italic;font-size:20px">"${esc(b.text)}"<footer style="margin-top:8px;font-style:normal;color:#64748b">— ${esc(b.cite || "")}</footer></blockquote></div>`;
    case "list":
      return `<div class="lp-container">${b.ordered ? `<ol>${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ol>` : `<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`}</div>`;
    case "html":
      return `<div class="lp-container">${b.html}</div>`;
  }
}

// === Email HTML ===
export function renderEmail(
  blocks: Block[],
  opts: { subject: string; preheader?: string; fromName?: string },
): string {
  const body = blocks.map(renderEmailBlock).join("\n");
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(opts.subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:${fontStack("body", _exportFonts)}">
${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden">${esc(opts.preheader)}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9">
<tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:8px;overflow:hidden;max-width:600px">
<tr><td>
${body}
</td></tr>
</table>
<div style="text-align:center;padding:24px;font-size:12px;color:#94a3b8">
${esc(opts.fromName || "Marketing Hub")} · <a href="{{unsubscribe}}" style="color:#94a3b8">Unsubscribe</a>
</div>
</td></tr>
</table>
</body>
</html>`;
}

export function renderEmailBlock(b: Block): string {
  const cell = (inner: string) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:16px 24px">${inner}</td></tr></table>`;
  switch (b.type) {
    case "heading":
      return cell(
        `<h${b.level} style="margin:0;font-size:${b.level === 1 ? 28 : b.level === 2 ? 22 : 18}px;text-align:${b.align || "left"}">${esc(b.text)}</h${b.level}>`,
      );
    case "text":
      return cell(
        `<div style="text-align:${b.align || "left"};font-size:16px;color:#334155">${b.html}</div>`,
      );
    case "image":
      return `<table role="presentation" width="100%"><tr><td align="center" style="padding:16px 24px"><img src="${esc(b.src)}" alt="${esc(b.alt)}" style="max-width:100%;border-radius:4px"${b.width ? ` width="${esc(b.width)}"` : ""}></td></tr></table>`;
    case "button":
      return `<table role="presentation" width="100%"><tr><td align="${b.align || "center"}" style="padding:16px 24px"><a href="${esc(b.href)}" style="display:inline-block;background:${esc(b.color || "var(--accent)")};color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600">${esc(b.label)}</a></td></tr></table>`;
    case "divider":
      return `<table role="presentation" width="100%"><tr><td style="padding:8px 24px"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0"></td></tr></table>`;
    case "spacer":
      return `<table role="presentation" width="100%"><tr><td style="height:${b.height}px"></td></tr></table>`;
    case "columns": {
      const cols = b.items.length || 1;
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${b.items.map((c) => `<td valign="top" style="padding:8px 12px;width:${100 / cols}%">${c.heading ? `<strong>${esc(c.heading)}</strong><br>` : ""}${c.text ? `<span style="color:#475569;font-size:14px">${esc(c.text)}</span>` : ""}${c.button ? `<br><a href="${esc(c.button.href)}" style="color:var(--accent)">${esc(c.button.label)}</a>` : ""}</td>`).join("")}</tr></table>`;
    }
    case "video":
      return cell(
        `<a href="${esc(b.src)}" style="display:block;padding:32px;background:#0f172a;color:white;text-align:center;border-radius:6px;text-decoration:none">▶ Watch video</a>`,
      );
    case "quote":
      return cell(
        `<blockquote style="border-left:3px solid var(--accent);padding-left:16px;font-style:italic;color:#475569">"${esc(b.text)}"${b.cite ? `<br><span style="font-style:normal;color:#94a3b8">— ${esc(b.cite)}</span>` : ""}</blockquote>`,
      );
    case "list":
      return cell(
        b.ordered
          ? `<ol style="padding-left:20px">${b.items.map((i) => `<li style="margin:4px 0">${esc(i)}</li>`).join("")}</ol>`
          : `<ul style="padding-left:20px">${b.items.map((i) => `<li style="margin:4px 0">${esc(i)}</li>`).join("")}</ul>`,
      );
    case "html":
      return cell(b.html);
    case "hero":
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${esc(b.bg || "var(--accent)")};color:white"><tr><td align="center" style="padding:48px 24px"><h1 style="margin:0 0 12px;font-size:32px">${esc(b.headline)}</h1><p style="margin:0 0 24px;font-size:18px;opacity:.9">${esc(b.sub)}</p>${b.cta ? `<a href="${esc(b.cta.href)}" style="display:inline-block;background:white;color:var(--accent);padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600">${esc(b.cta.label)}</a>` : ""}</td></tr></table>`;
    case "features":
      return cell(
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${b.items.map((f) => `<tr><td style="padding:12px 0"><strong style="font-size:18px">${f.icon ? esc(f.icon) + " " : ""}${esc(f.title)}</strong><div style="color:#475569;margin-top:4px">${esc(f.body)}</div></td></tr>`).join("")}</table>`,
      );
    case "cta":
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${esc(b.bg || "#f8fafc")}"><tr><td align="center" style="padding:40px 24px"><h2 style="margin:0 0 8px">${esc(b.headline)}</h2>${b.body ? `<p style="color:#64748b;margin:0 0 20px">${esc(b.body)}</p>` : ""}<a href="${esc(b.button.href)}" style="display:inline-block;background:var(--accent);color:white;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600">${esc(b.button.label)}</a></td></tr></table>`;
    case "testimonial":
      return cell(
        `<blockquote style="font-style:italic;color:#475569;font-size:18px;margin:0">"${esc(b.quote)}"<br><span style="display:inline-block;margin-top:8px;font-style:normal;font-size:14px;color:#94a3b8">— ${esc(b.author)}${b.role ? `, ${esc(b.role)}` : ""}</span></blockquote>`,
      );
    case "pricing":
      return cell(
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${b.plans.map((p) => `<tr><td style="padding:12px;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:8px"><strong>${esc(p.name)}</strong> — ${esc(p.price)}${p.period ? `/${esc(p.period)}` : ""}<br><span style="color:#64748b;font-size:13px">${p.features.join(" · ")}</span><br><a href="${esc(p.cta.href)}" style="color:var(--accent);font-weight:600">${esc(p.cta.label)} →</a></td></tr>`).join("")}</table>`,
      );
    case "faq":
      return cell(
        b.items
          .map(
            (i) =>
              `<div style="padding:12px 0;border-bottom:1px solid #e2e8f0"><strong>${esc(i.q)}</strong><div style="color:#475569;margin-top:4px">${esc(i.a)}</div></div>`,
          )
          .join(""),
      );
    case "form":
      return cell(
        `<form style="display:grid;gap:8px"><strong>${esc(b.heading)}</strong>${b.fields.map((f) => `<input type="${esc(f.type || "text")}" name="${esc(f.name)}" placeholder="${esc(f.label)}${f.required ? " *" : ""}" style="padding:10px;border:1px solid #cbd5e1;border-radius:4px;font-family:inherit">`).join("")}<button type="button" onclick="this.form.reset();alert('${esc(b.successMessage || "Thanks!")}')" style="padding:12px;background:var(--accent);color:white;border:none;border-radius:4px;font-weight:600;cursor:pointer">${esc(b.submitLabel)}</button></form>`,
      );
    case "footer":
      return `<table role="presentation" width="100%"><tr><td align="center" style="padding:24px;font-size:12px;color:#94a3b8">${esc(b.copyright)}${b.links ? ` · ${b.links.map((l) => `<a href="${esc(l.href)}" style="color:#94a3b8">${esc(l.label)}</a>`).join(" · ")}` : ""}</td></tr></table>`;
  }
}

// Plain-text version for emails
export function emailPlainText(blocks: Block[]): string {
  const parts: string[] = [];
  for (const b of blocks) {
    switch (b.type) {
      case "heading":
        parts.push(`\n${b.text}\n${"=".repeat(b.text.length)}`);
        break;
      case "text":
        parts.push(stripHtml(b.html));
        break;
      case "button":
        parts.push(`[${b.label}] ${b.href}`);
        break;
      case "image":
        parts.push(`[Image: ${b.alt || b.src}]`);
        break;
      case "divider":
        parts.push("--");
        break;
      case "quote":
        parts.push(`"${b.text}" — ${b.cite || ""}`);
        break;
      case "list":
        b.items.forEach((i, idx) => parts.push(`${b.ordered ? `${idx + 1}.` : "-"} ${i}`));
        break;
      case "spacer":
      case "html":
        break;
      case "hero":
        parts.push(`${b.headline}\n${b.sub}${b.cta ? `\n\n${b.cta.label}: ${b.cta.href}` : ""}`);
        break;
      case "features":
        b.items.forEach((f) => parts.push(`${f.title} — ${f.body}`));
        break;
      case "cta":
        parts.push(`${b.headline}\n${b.body || ""}\n${b.button.label}: ${b.button.href}`);
        break;
      case "testimonial":
        parts.push(`"${b.quote}" — ${b.author}${b.role ? `, ${b.role}` : ""}`);
        break;
      case "pricing":
        b.plans.forEach((p) =>
          parts.push(
            `${p.name}: ${p.price}${p.period ? `/${p.period}` : ""} — ${p.features.join(", ")}`,
          ),
        );
        break;
      case "faq":
        b.items.forEach((i) => parts.push(`Q: ${i.q}\nA: ${i.a}`));
        break;
      case "form":
        parts.push(
          `${b.heading}\n${b.fields.map((f) => `${f.label}: ${f.placeholder || ""}`).join("\n")}`,
        );
        break;
      case "footer":
        parts.push(b.copyright);
        break;
      case "video":
        parts.push(`Video: ${b.src}`);
        break;
      case "columns":
        b.items.forEach((c) => parts.push([c.heading, c.text].filter(Boolean).join(": ")));
        break;
    }
  }
  return parts.filter(Boolean).join("\n\n");
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
