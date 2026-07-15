import { z } from "zod";

/* ── Campaign ── */
export const createCampaignSchema = z.object({
  agencyId: z.number().int().positive(),
  name: z.string().trim().min(2).max(160),
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED"]).default("ACTIVE"),
  budget: z.number().min(0).default(0),
});

/* ── Ad metric log ── */
export const logAdMetricSchema = z.object({
  channel: z.string().trim().min(1).max(80),
  budgetSpent: z.number().min(0),
  impressions: z.number().int().min(0),
  clicks: z.number().int().min(0),
  conversions: z.number().int().min(0),
  revenue: z.number().min(0),
});

/* ── Performance optimize ── */
export const optimizeBudgetSchema = z.object({
  campaignId: z.number().int().positive(),
  totalBudget: z.number().min(0),
});

/* ── SEO audit ── */
export const seoAuditSchema = z.object({
  htmlContent: z.string().min(1, "htmlContent must be provided"),
  targetKeyword: z.string().trim().min(1, "targetKeyword must be provided"),
  campaignId: z.number().int().positive().optional(),
});

/* ── Influencer match ── */
export const influencerMatchSchema = z.object({
  targetCategories: z.array(z.string().min(1)).min(1, "targetCategories must be a non-empty array"),
  maxBudget: z.number().min(0),
});

/* ── Influencer create ── */
export const createInfluencerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  platform: z.string().trim().min(2).max(60),
  handle: z.string().trim().min(2).max(120),
  followers: z.number().int().min(0),
  engagementRate: z.number().min(0).max(1),
  costPerPost: z.number().min(0),
  categories: z.array(z.string().min(1)).max(20),
});