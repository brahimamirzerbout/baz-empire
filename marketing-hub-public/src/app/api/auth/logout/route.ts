import { NextRequest } from "next/server";
import { json } from "@/lib/api-helpers";
import { destroySession, clearSessionCookie, SESSION_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) destroySession(token);
  clearSessionCookie();
  return json({ ok: true });
}
