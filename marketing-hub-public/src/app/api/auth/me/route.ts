import { NextRequest } from "next/server";
import { json } from "@/lib/api-helpers";
import { currentUser, getUserCount, ensureAdminFromEnv } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  // Seed admin from env on every cold start (Vercel serverless /tmp is ephemeral)
  ensureAdminFromEnv();
  const count = getUserCount();
  if (count === 0) return json({ user: null, needsSetup: true });
  const user = currentUser();
  return json({ user, needsSetup: false });
}