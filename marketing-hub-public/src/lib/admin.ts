/**
 * Admin guard — small helper for mutating API routes. Returns either the
 * authenticated user, or a NextResponse to return (401). Usage:
 *
 *   const guard = requireUser();
 *   if (guard instanceof NextResponse) return guard;
 *   const user = guard;
 */
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

export function requireUser() {
  const u = currentUser();
  if (!u) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  return u;
}
