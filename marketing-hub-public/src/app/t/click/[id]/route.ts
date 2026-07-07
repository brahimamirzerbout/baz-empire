import { NextRequest } from "next/server";
import { logEmailEvent } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const target = req.nextUrl.searchParams.get("u");
  // Only honor http(s) — never let a tracker redirect to javascript: or data: URIs
  let safeTarget = "/";
  if (target && /^https?:\/\//i.test(target)) {
    safeTarget = target;
  }
  logEmailEvent(params.id, "click", safeTarget, { ua: req.headers.get("user-agent") || "" });
  return Response.redirect(safeTarget, 302);
}
