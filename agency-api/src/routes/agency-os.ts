import { Router } from "express";
import { requireAdminKey } from "../middleware/auth";
import {
  listCampaigns,
  createCampaign,
  logAdMetric,
  getCampaignMetrics,
  getAgencyCampaigns,
} from "../controllers/campaign.controller";
import {
  optimizeCampaignBudget,
  runSeoAudit,
  matchCampaignInfluencers,
  listInfluencers,
  createInfluencer,
  allocateLcpBudget,
  scoreCoreWebVitals,
  optimizeMediaMix,
  analyzeCommerceUnit,
  forecastOutreach,
  scoreLead,
  scoreLeadBatch,
} from "../controllers/domain.controller";

const router = Router();

// ── Campaigns ──
router.get("/campaigns", listCampaigns);
router.post("/campaigns", requireAdminKey, createCampaign);
router.get("/agencies/:id/campaigns", getAgencyCampaigns);
router.get("/campaigns/:id/metrics", getCampaignMetrics);
router.post("/campaigns/:id/metrics", requireAdminKey, logAdMetric);

// ── Performance Marketing engine ──
router.post("/performance/optimize", optimizeCampaignBudget);

// ── SEO & Content engine ──
router.post("/seo/analyze", runSeoAudit);

// ── Influencer engine ──
router.get("/influencers", listInfluencers);
router.post("/influencers", requireAdminKey, createInfluencer);
router.post("/influencers/match", matchCampaignInfluencers);

// ── Web Performance engine (dominator: Increasio / Tridence — CWV by contract) ──
router.post("/webperf/lcp-budget", allocateLcpBudget);
router.post("/webperf/cwv-score", scoreCoreWebVitals);

// ── Media Buying engine (dominator: WPP Media / Publicis Media — CPM-min mix) ──
router.post("/media/optimize-mix", optimizeMediaMix);

// ── E-commerce engine (dominator: Fuel Made / BVA — break-even ROAS) ──
router.post("/commerce/analyze", analyzeCommerceUnit);

// ── Outreach engine (dominator: ORRJO — demand-before-outbound, 90% show-rate) ──
router.post("/outreach/forecast", forecastOutreach);

// ── Lead Scoring engine (dominator: ORRJO 100-pt / 15-signal model) ──
router.post("/leads/score", scoreLead);
router.post("/leads/score-batch", scoreLeadBatch);

export default router;