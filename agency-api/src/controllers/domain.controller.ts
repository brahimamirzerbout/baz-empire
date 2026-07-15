import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { PerformanceService } from "../services/performance.service";
import { SeoService } from "../services/seo.service";
import { InfluencerService } from "../services/influencer.service";
import { WebPerfService } from "../services/webperf.service";
import { MediaService } from "../services/media.service";
import { CommerceService } from "../services/commerce.service";
import { OutreachService } from "../services/outreach.service";
import { LeadScoringService } from "../services/leadscoring.service";
import {
  optimizeBudgetSchema,
  seoAuditSchema,
  influencerMatchSchema,
  createInfluencerSchema,
} from "../schemas/agency-os";
import type { AdMetricInput, InfluencerInput, WebPerfBudget, CwvMetric, MediaChannel, CommerceInput, OutreachSequence, LeadSignal } from "../types";

/* ── Performance: POST /api/performance/optimize ── */
export async function optimizeCampaignBudget(req: Request, res: Response, next: NextFunction) {
  try {
    const { campaignId, totalBudget } = optimizeBudgetSchema.parse(req.body);

    const rows = await prisma.adMetric.findMany({ where: { campaignId } });
    if (rows.length === 0) {
      res.status(404).json({ error: "No ad-metric history found for this campaign." });
      return;
    }

    const metrics: AdMetricInput[] = rows.map((r) => ({
      channel: r.channel,
      budgetSpent: r.budgetSpent,
      impressions: r.impressions,
      clicks: r.clicks,
      conversions: r.conversions,
      revenue: r.revenue,
    }));

    const optimizedAllocations = PerformanceService.calculateOptimalBudgets(metrics, totalBudget);
    res.json({ campaignId, totalBudget, optimizedAllocations });
  } catch (err) {
    next(err);
  }
}

/* ── SEO: POST /api/seo/analyze ── */
export async function runSeoAudit(req: Request, res: Response, next: NextFunction) {
  try {
    const { htmlContent, targetKeyword, campaignId } = seoAuditSchema.parse(req.body);
    const result = SeoService.analyzePage(htmlContent, targetKeyword);

    // Optionally persist the audit against a campaign
    let saved: { id: number } | null = null;
    if (campaignId) {
      const row = await prisma.seoAudit.create({
        data: {
          campaignId,
          targetUrl: "(inline payload)",
          score: result.score,
          issues: JSON.stringify(result.issues),
          keyword: targetKeyword,
          density: result.keywordDensity,
        },
      });
      saved = { id: row.id };
    }

    res.json({ ...result, saved });
  } catch (err) {
    next(err);
  }
}

/* ── Influencer: POST /api/influencers/match ── */
export async function matchCampaignInfluencers(req: Request, res: Response, next: NextFunction) {
  try {
    const { targetCategories, maxBudget } = influencerMatchSchema.parse(req.body);

    const rows = await prisma.influencer.findMany();
    const pool: InfluencerInput[] = rows.map((r) => {
      let categories: string[] = [];
      try {
        const p = JSON.parse(r.categories);
        if (Array.isArray(p)) categories = p.filter((c) => typeof c === "string");
      } catch {
        categories = [];
      }
      return {
        id: r.id,
        name: r.name,
        platform: r.platform,
        handle: r.handle,
        followers: r.followers,
        engagementRate: r.engagementRate,
        costPerPost: r.costPerPost,
        categories,
      };
    });

    const recommendedPartners = InfluencerService.calculateMatches(pool, targetCategories, maxBudget);
    res.json({ count: recommendedPartners.length, recommendedPartners });
  } catch (err) {
    next(err);
  }
}

/* ── Influencer: GET /api/influencers (list) ── */
export async function listInfluencers(_req: Request, res: Response, next: NextFunction) {
  try {
    const rows = await prisma.influencer.findMany({ orderBy: { id: "asc" } });
    const data = rows.map((r) => {
      let categories: string[] = [];
      try {
        const p = JSON.parse(r.categories);
        if (Array.isArray(p)) categories = p.filter((c) => typeof c === "string");
      } catch {
        categories = [];
      }
      return { ...r, categories };
    });
    res.json({ count: rows.length, data });
  } catch (err) {
    next(err);
  }
}

/* ── Influencer: POST /api/influencers (create) ── */
export async function createInfluencer(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createInfluencerSchema.parse(req.body);
    const row = await prisma.influencer.create({
      data: {
        name: input.name,
        platform: input.platform,
        handle: input.handle,
        followers: input.followers,
        engagementRate: input.engagementRate,
        costPerPost: input.costPerPost,
        categories: JSON.stringify(input.categories),
      },
    });
    res.status(201).json({ data: { ...row, categories: input.categories } });
  } catch (err) {
    next(err);
  }
}

/* ── Web Performance: POST /api/webperf/lcp-budget (dominator: Increasio / BAZ doctrine) ── */
export async function allocateLcpBudget(req: Request, res: Response, next: NextFunction) {
  try {
    const budget: WebPerfBudget = req.body;
    if (!budget?.targetLcpMs || !budget?.current) {
      res.status(422).json({ error: "targetLcpMs and current { ttfb, renderBlockingJs, imageLoad, fontLoad, clientJs } are required." });
      return;
    }
    const result = WebPerfService.allocateLcpBudget(budget);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/* ── Web Performance: POST /api/webperf/cwv-score (BAZ doctrine: sub-1.5s LCP floor) ── */
export async function scoreCoreWebVitals(req: Request, res: Response, next: NextFunction) {
  try {
    const metrics: CwvMetric[] = req.body?.metrics;
    if (!Array.isArray(metrics) || metrics.length === 0) {
      res.status(422).json({ error: "metrics[] with { metric, p75 } is required." });
      return;
    }
    const result = WebPerfService.scoreCwv(metrics);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/* ── Media Buying: POST /api/media/optimize-mix (dominator: WPP Media / Publicis Media) ── */
export async function optimizeMediaMix(req: Request, res: Response, next: NextFunction) {
  try {
    const { channels, totalBudget, reachTarget } = req.body ?? {};
    if (!Array.isArray(channels) || channels.length === 0) {
      res.status(422).json({ error: "channels[] with { channel, cpm, audienceSize, maxSpend? } is required." });
      return;
    }
    if (typeof totalBudget !== "number" || totalBudget <= 0) {
      res.status(422).json({ error: "totalBudget must be a positive number." });
      return;
    }
    const pool: MediaChannel[] = channels.map((c: any) => ({
      channel: String(c.channel),
      cpm: Number(c.cpm),
      audienceSize: Number(c.audienceSize),
      maxSpend: c.maxSpend ? Number(c.maxSpend) : undefined,
    }));
    const result = MediaService.optimizeMix(pool, totalBudget, reachTarget);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/* ── E-commerce: POST /api/commerce/analyze (dominator: Fuel Made / BVA — break-even ROAS) ── */
export async function analyzeCommerceUnit(req: Request, res: Response, next: NextFunction) {
  try {
    const input: CommerceInput = req.body?.input;
    const growthRate: number = req.body?.growthRate ?? 0;
    if (!input || input.productPrice == null || input.orders == null) {
      res.status(422).json({ error: "input { productPrice, costOfGoods, adSpend, shippingHandling, transactionFeeRate, orders } is required." });
      return;
    }
    const result = CommerceService.analyze(input, growthRate);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/* ── Outreach: POST /api/outreach/forecast (dominator: ORRJO — demand-before-outbound) ── */
export async function forecastOutreach(req: Request, res: Response, next: NextFunction) {
  try {
    const seq: OutreachSequence = req.body;
    if (!seq || seq.steps == null || !Array.isArray(seq.channels) || seq.prospectCount == null) {
      res.status(422).json({ error: "{ steps, channels[], warmMarket, deliverabilityScore, personalizationLevel, prospectCount } is required." });
      return;
    }
    const result = OutreachService.forecast(seq);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/* ── Lead Scoring: POST /api/leads/score (dominator: ORRJO 100-pt / 15-signal model) ── */
export async function scoreLead(req: Request, res: Response, next: NextFunction) {
  try {
    const signal: LeadSignal = req.body;
    if (!signal || signal.fitScore == null || signal.engagementScore == null || signal.intentScore == null) {
      res.status(422).json({ error: "{ fitScore (0-50), engagementScore (0-30), intentScore (0-20) } is required." });
      return;
    }
    const result = LeadScoringService.score(signal);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/* ── Lead Scoring: POST /api/leads/score-batch (return Tier A only, sorted) ── */
export async function scoreLeadBatch(req: Request, res: Response, next: NextFunction) {
  try {
    const signals: LeadSignal[] = req.body?.signals;
    if (!Array.isArray(signals) || signals.length === 0) {
      res.status(422).json({ error: "signals[] with { fitScore, engagementScore, intentScore } is required." });
      return;
    }
    const result = LeadScoringService.scoreBatch(signals);
    res.json({ count: result.length, tierA: result });
  } catch (err) {
    next(err);
  }
}