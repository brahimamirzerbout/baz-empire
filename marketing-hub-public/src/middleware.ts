/**
 * Edge-runtime middleware — cookie-presence check only.
 *
 * The real auth check (DB lookup) happens in the root layout / API routes.
 * This layer cheaply blocks obvious "no cookie at all" requests from
 * rendering the app shell, saving the layout from doing extra work.
 *
 * It also handles the redirect from "/" to /login when needed.
 */
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "mh_session";
const DEV_SESSION_TOKEN = "dev-session-baz-empire"; // pre-seeded in DB for local dev
const PUBLIC_PATHS = new Set([
  "/",
  "/enterprise",
  "/developers",
  "/design-system",
  "/login",
  "/setup",
  "/site",
  "/site/demo",
  "/leads",
  "/onboarding",
  "/case-studies",
  "/pricing",
  "/demo",
  "/status",
  "/trust",
]);
const PUBLIC_PREFIXES = [
  "/p/",
  "/t/",
  "/api/auth/",
  "/api/embed",
  "/api/case-studies",
  "/api/leads",
  "/api/public/",
  "/api/status",
  "/api/health",
  "/api/triangle/",
  "/api/dive/status",
  "/api/dive/topics",
  "/_next/",
  "/public",
  "/.well-known/",
  "/sitemap",
  "/favicon",
  "/site/",
  "/case-studies/",
  "/blog/",
  "/blog",
  "/c/",
  "/manifest.json",
  "/sw.js",
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.svg|robots.txt|sitemap.xml|public).*)",
  ],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // CORS for cross-origin browser calls (e.g. BAZ homepage fetching /api/triangle/health).
  // Only allow same-host or any localhost in dev. Block cross-origin in production
  // unless explicitly allowed via ALLOWED_ORIGIN env var.
  const origin = req.headers.get("origin") || "";
  const isDev = process.env.NODE_ENV !== "production";
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin);
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "";
  const isAllowed = isLocal || (allowedOrigin && origin === allowedOrigin);
  const corsHeaders: Record<string, string> = isAllowed
    ? {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      }
    : {};

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  if (isPublic(pathname)) {
    // Pass a header the root layout can read to know it's a public route
    const res = NextResponse.next({
      request: { headers: new Headers({ ...Object.fromEntries(req.headers), "x-mh-public": "1" }) },
    });
    for (const [k, v] of Object.entries(corsHeaders)) res.headers.set(k, v);
    return res;
  }

  let hasCookie = !!req.cookies.get(SESSION_COOKIE)?.value;

  // Dev-mode auto-auth: in development, always inject a pre-seeded session
  // token so the app works without manual login (or with stale cookies).
  if (isDev) {
    const devHeaders = new Headers(req.headers);
    devHeaders.set("cookie", `${SESSION_COOKIE}=${DEV_SESSION_TOKEN}`);
    const res = NextResponse.next({ request: { headers: devHeaders } });
    res.cookies.set(SESSION_COOKIE, DEV_SESSION_TOKEN, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
    for (const [k, v] of Object.entries(corsHeaders)) res.headers.set(k, v);
    return res;
  }

  if (!hasCookie) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401, headers: corsHeaders },
      );
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("returnTo", pathname);
    const r = NextResponse.redirect(url);
    for (const [k, v] of Object.entries(corsHeaders)) r.headers.set(k, v);
    return r;
  }
  const res = NextResponse.next();
  for (const [k, v] of Object.entries(corsHeaders)) res.headers.set(k, v);
  return res;
}
