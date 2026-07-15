import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback: string): string {
  const v = process.env[name];
  return v !== undefined && v !== "" ? v : fallback;
}

export const config = {
  port: parseInt(required("PORT", "4000"), 10),
  databaseUrl: required("DATABASE_URL", "file:./data/agency.db"),
  corsOrigin: required("CORS_ORIGIN", "*"),
  nodeEnv: required("NODE_ENV", "development"),
  adminApiKey: process.env.ADMIN_API_KEY || "",
  isProd: required("NODE_ENV", "development") === "production",
};

/** Allowed category values — enforced at validation time. */
export const AGENCY_CATEGORIES = [
  "Creative & Design",
  "Digital & Web",
  "Marketing & Sales",
  "Media & Strategy",
] as const;

export type AgencyCategory = (typeof AGENCY_CATEGORIES)[number];