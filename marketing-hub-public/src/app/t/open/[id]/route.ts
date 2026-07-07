import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { logEmailEvent } from "@/lib/email";

export const dynamic = "force-dynamic";

// 1x1 transparent PNG (the canonical tracking pixel)
const PIXEL = Buffer.from(
  "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000D49444154789C636000010000000500010D0A2DB40000000049454E44AE426082",
  "hex",
);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const exists = db.prepare(`SELECT id FROM email_outbox WHERE id = ?`).get(params.id);
  if (exists) {
    logEmailEvent(params.id, "open", undefined, { ua: req.headers.get("user-agent") || "" });
  }
  return new Response(PIXEL, {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": String(PIXEL.length),
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
