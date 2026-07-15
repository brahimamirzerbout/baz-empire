import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "./lib/config";
import agenciesRouter from "./routes/agencies";
import agencyOsRouter from "./routes/agency-os";
import { notFoundHandler } from "./middleware/notFound";
import { errorHandler } from "./middleware/error";

export function createApp() {
  const app = express();

  // ── Security & transport ──────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin === "*" ? true : config.corsOrigin.split(",").map((s) => s.trim()),
    })
  );
  app.use(express.json({ limit: "256kb" })); // reject oversized payloads
  app.use(express.urlencoded({ extended: false }));

  // ── Logging ───────────────────────────────────────────
  app.use(morgan(config.isProd ? "combined" : "dev"));

  // ── Rate limiting (general) ───────────────────────────
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 min
      max: 300, // 300 req / 15 min / IP
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Too many requests. Please slow down." },
    })
  );

  // ── Health ────────────────────────────────────────────
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // ── Routes ────────────────────────────────────────────
  app.use("/api/agencies", agenciesRouter);
  app.use("/api", agencyOsRouter); // campaigns, performance, seo, influencers

  // ── Fallbacks ─────────────────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler); // must be last

  return app;
}