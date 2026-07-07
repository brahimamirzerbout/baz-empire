/**
 * Tracking helper — injects an open-tracking pixel and rewrites <a href> URLs
 * to a click-tracking redirect. Pure string ops, no DOM (safe to call on server).
 *
 * Why server-side? We want the armed HTML to be stored in the outbox so retries
 * don't lose tracking, and so that even local-only sends are still measured
 * inside the app.
 */

const PLACEHOLDER_OPENER = /<body\b[^>]*>/i;

export function linkifyHtml(html: string, opts: { outboxId: string; baseUrl?: string }): string {
  let armed = html;

  // 1) Rewrite <a href="..."> to go through /t/click/[id]?u=<encoded>
  armed = armed.replace(/<a\b([^>]*?)\s+href=(["'])([^"']+)\2/gi, (_m, attrs, q, url) => {
    // Skip anchors, mailto, tel, javascript, and our own tracker
    if (/^(#|mailto:|tel:|javascript:)/i.test(url)) return _m;
    if (url.includes("/t/click/")) return _m;
    const redirect = `/t/click/${opts.outboxId}?u=${encodeURIComponent(url)}`;
    return `<a${attrs} href=${q}${redirect}${q}`;
  });

  // 2) Inject open pixel before </body> (or at end if no body tag)
  const pixel = `<img src="/t/open/${opts.outboxId}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;opacity:0.01" />`;
  if (PLACEHOLDER_OPENER.test(armed)) {
    armed = armed.replace(/<\/body>/i, `${pixel}</body>`);
  } else {
    armed = armed + pixel;
  }

  return armed;
}

/** Strip tracking wrappers for plain-text fallback. */
export function stripTracking(html: string): string {
  return html
    .replace(/<img src="\/t\/open\/[^"]+"[^>]*>/g, "")
    .replace(
      /href="\/t\/click\/[^"]+\?u=([^&"]+)&?"/g,
      (_m, enc) => `href="${decodeURIComponent(enc)}"`,
    );
}
