import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { serializeAgency } from "../lib/serialize";
import { createCampaignSchema, logAdMetricSchema } from "../schemas/agency-os";
import type { AdMetricInput } from "../types";

/** GET /api/campaigns — list, optional ?agencyId= */
export async function listCampaigns(req: Request, res: Response, next: NextFunction) {
  try {
    const agencyId = req.query.agencyId ? parseInt(String(req.query.agencyId), 10) : undefined;
    const rows = await prisma.campaign.findMany({
      where: agencyId ? { agencyId } : undefined,
      include: { _count: { select: { adMetrics: true, seoAudits: true } } },
      orderBy: { id: "asc" },
    });
    res.json({ count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
}

/** POST /api/campaigns — create a campaign under an agency */
export async function createCampaign(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createCampaignSchema.parse(req.body);
    const row = await prisma.campaign.create({ data: input });
    res.status(201).json({ data: row });
  } catch (err) {
    next(err);
  }
}

/** POST /api/campaigns/:id/metrics — log an ad-metric data point */
export async function logAdMetric(req: Request, res: Response, next: NextFunction) {
  try {
    const campaignId = parseInt(req.params.id, 10);
    if (Number.isNaN(campaignId)) {
      res.status(400).json({ error: "id must be an integer." });
      return;
    }
    const input = logAdMetricSchema.parse(req.body);
    const row = await prisma.adMetric.create({ data: { ...input, campaignId } });
    res.status(201).json({ data: row });
  } catch (err) {
    next(err);
  }
}

/** GET /api/campaigns/:id/metrics — fetch raw ad metrics for a campaign */
export async function getCampaignMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    const campaignId = parseInt(req.params.id, 10);
    if (Number.isNaN(campaignId)) {
      res.status(400).json({ error: "id must be an integer." });
      return;
    }
    const rows = await prisma.adMetric.findMany({ where: { campaignId }, orderBy: { loggedAt: "asc" } });
    const data: AdMetricInput[] = rows.map((r) => ({
      channel: r.channel,
      budgetSpent: r.budgetSpent,
      impressions: r.impressions,
      clicks: r.clicks,
      conversions: r.conversions,
      revenue: r.revenue,
    }));
    res.json({ count: rows.length, data });
  } catch (err) {
    next(err);
  }
}

/** GET /api/agencies/:id/campaigns — convenience: campaigns for an agency */
export async function getAgencyCampaigns(req: Request, res: Response, next: NextFunction) {
  try {
    const agencyId = parseInt(req.params.id, 10);
    if (Number.isNaN(agencyId)) {
      res.status(400).json({ error: "id must be an integer." });
      return;
    }
    const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
    if (!agency) {
      res.status(404).json({ error: "Agency not found." });
      return;
    }
    const rows = await prisma.campaign.findMany({
      where: { agencyId },
      orderBy: { id: "asc" },
    });
    res.json({ count: rows.length, data: rows, agency: serializeAgency(agency) });
  } catch (err) {
    next(err);
  }
}