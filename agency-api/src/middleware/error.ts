import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { classifyError } from "../lib/serialize";

/** Centralized error handler — mounted last. Converts every thrown error
 *  into a clean JSON response. Never leaks stack traces in production. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1) Zod validation errors → 422 with field-level detail
  if (err instanceof ZodError) {
    res.status(422).json({
      error: "Validation failed.",
      details: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
    return;
  }

  // 2) Prisma / known DB errors
  const { status, message } = classifyError(err);
  const body: Record<string, unknown> = { error: message };
  if (process.env.NODE_ENV !== "production" && status === 500 && err instanceof Error) {
    body.detail = err.message;
  }
  res.status(status).json(body);
}