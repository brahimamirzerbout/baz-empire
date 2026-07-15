import type { Request, Response, NextFunction } from "express";
import { config } from "../lib/config";

/**
 * Protects write endpoints (POST/PUT/DELETE) with a shared admin API key.
 * If ADMIN_API_KEY is unset/empty the guard is a no-op (dev convenience).
 * Clients send the key as `X-Api-Key: <key>`.
 */
export function requireAdminKey(req: Request, res: Response, next: NextFunction): void {
  if (!config.adminApiKey) return next(); // disabled in dev
  const provided = req.header("X-Api-Key");
  if (!provided || provided !== config.adminApiKey) {
    res.status(401).json({ error: "Unauthorized — valid X-Api-Key required." });
    return;
  }
  next();
}