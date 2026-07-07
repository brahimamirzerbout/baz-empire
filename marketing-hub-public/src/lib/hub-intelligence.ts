/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HUB INTELLIGENCE — The unified brain connecting every feature
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This module connects every system in the Hub:
 * - Dashboard data (CRM, campaigns, revenue)
 * - Loyalty score (9 dimensions)
 * - Brand equity (5 dimensions)
 * - Intelligence (momentum, velocity, forecast)
 * - Patrick Number (cash, MRR, LTV/CAC)
 * - Wire articles (trending topics)
 * - Trends (macro/micro signals)
 * - Masters (16 marketing legends)
 * - Stash (33 templates)
 * - Papers (6 academic papers)
 * - Lexicon (68 terms)
 * - Formulas (41 total)
 * - Strategist (GLM-4)
 * - Brands (36 in the game)
 *
 * Every feature can call this to get cross-referenced intelligence.
 */

import { db } from "@/lib/db";
import { MASTERS } from "@/lib/wisdom";
import { STASH } from "@/lib/stash";
import { PAPERS } from "@/lib/papers";
import { TERMS } from "@/lib/lexicon";
import { FORMULAS } from "@/lib/library";
import { PHI, modulePriority, thresholdColor } from "@/lib/math";

export interface CrossReference {
  source: string;      // which system
  type: string;        // what kind of reference
  title: string;       // display title
  description: string; // why it matters
  href: string;        // link to the feature
  priority: number;    // 0-1, higher = more relevant now
}

export interface HubIntelligence {
  // Real-time scores
  loyaltyScore: number;
  loyaltyGrade: string;
  brandEquityScore: number;
  momentumScore: number;
  patrickScore: number;
  
  // Smart recommendations
  todaysFocus: { title: string; why: string; href: string; impact: string }[];
  stashRecommendation: { id: string; title: string; why: string; author: string; template: boolean };
  masterQuote: { text: string; author: string; category: string };
  paperHighlight: { id: string; title: string; keyFinding: string };
  lexiconTerm: { name: string; short: string; category: string };
  
  // Cross-references for any feature
  crossRefs: CrossReference[];
  
  // System health
  systemHealth: { system: string; status: string; score: number }[];
  
  // Data counts
  counts: { contacts: number; deals: number; campaigns: number; revenue: number; touchpoints: number; testimonials: number; wireArticles: number; competitors: number };
  
  generatedAt: string;
}

export function getHubIntelligence(): HubIntelligence {
  // Pull real data
  const contacts = (db.prepare("SELECT count(*) as c FROM contacts").get() as { c: number } | undefined)?.c;
  const deals = db.prepare("SELECT * FROM deals").all() as Record<string, unknown>[];
  const campaigns = (db.prepare("SELECT count(*) as c FROM campaigns").get() as { c: number } | undefined)?.c;
  const revenue = db.prepare("SELECT * FROM revenue_events ORDER BY occurred_at DESC LIMIT 30").all() as Record<string, unknown>[];
  const touchpoints = (db.prepare("SELECT count(*) as c FROM touchpoints").get() as { c: number } | undefined)?.c;
  const testimonials = (db.prepare("SELECT count(*) as c FROM testimonials").get() as { c: number } | undefined)?.c;
  const wireArticles = (db.prepare("SELECT count(*) as c FROM wire_articles").get() as { c: number } | undefined)?.c;
  const competitors = (db.prepare("SELECT count(*) as c FROM competitors").get() as { c: number } | undefined)?.c;
  
  const wonDeals = deals.filter(d => d.stage === "won").length;
  const lostDeals = deals.filter(d => d.stage === "lost").length;
  const activeDeals = deals.filter(d => d.stage !== "won" && d.stage !== "lost");
  const pipelineValue = activeDeals.reduce((s, d) => s + (d.value || 0), 0);
  const totalRevenue = revenue.reduce((s, r) => s + (r.amount || 0), 0);
  const winRate = wonDeals + lostDeals > 0 ? Math.round(wonDeals / (wonDeals + lostDeals) * 100) : 0;
  
  // Calculate scores
  const loyaltyScore = Math.min(100, Math.round(60 + (testimonials / 20) * 10 + (touchpoints / 600) * 15 + (revenue.length / 40) * 15));
  const loyaltyGrade = loyaltyScore >= 90 ? "A" : loyaltyScore >= 80 ? "B+" : loyaltyScore >= 70 ? "B" : "C";
  const brandEquityScore = Math.min(100, Math.round(70 + (testimonials / 20) * 10 + (competitors / 10) * 10 + (campaigns / 10) * 10));
  const momentumScore = Math.min(100, Math.round(50 + (activeDeals.length / 10) * 20 + (touchpoints / 600) * 15 + (revenue.length / 40) * 15));
  const patrickScore = Math.min(100, Math.round(70 + (totalRevenue / 400000) * 15 + (winRate / 100) * 15));
  
  // Today's focus — cross-referenced recommendations
  const todaysFocus: Record<string, unknown>[] = [];
  
  if (winRate < 50) {
    todaysFocus.push({
      title: "Fix your win rate",
      why: `You're winning ${winRate}% of deals. Use the Objection Handlers (Stash) and Risk Reversal (Hormozi) to flip it.`,
      href: "/stash",
      impact: "+10-15% close rate",
    });
  }
  if (loyaltyScore < 85) {
    todaysFocus.push({
      title: "Boost loyalty",
      why: `Loyalty is ${loyaltyScore}/100. The Fealty Oath and referral system could add 10+ points.`,
      href: "/loyalty",
      impact: "+10 loyalty points",
    });
  }
  if (activeDeals.length > 5) {
    todaysFocus.push({
      title: "Move stalled deals",
      why: `${activeDeals.length} active deals in pipeline. Use the 5-touch sequence (Stash) to re-engage.`,
      href: "/crm",
      impact: `+${activeDeals.length * 5000} potential pipeline`,
    });
  }
  todaysFocus.push({
    title: "Ask the Strategist",
    why: "GLM-4 has access to all 400+ content items. Ask it to diagnose your biggest bottleneck.",
    href: "/strategist",
    impact: "Strategic clarity",
  });
  
  // Stash recommendation — pick based on current state
  const stashRecs = STASH.filter(s => {
    if (winRate < 50 && s.category === "script") return true;
    if (loyaltyScore < 85 && s.category === "growth") return true;
    if (pipelineValue > 100000 && s.category === "funnel") return true;
    return s.category === "framework";
  });
  const stashRec = stashRecs[Math.floor(Math.random() * stashRecs.length)] || STASH[0];
  
  // Master quote — random from 52 wisdom quotes
  const allQuotes = MASTERS.flatMap(m => m.quotes);
  const masterQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
  
  // Paper highlight
  const paperHighlight = PAPERS[Math.floor(Math.random() * PAPERS.length)];
  
  // Lexicon term
  const lexiconTerm = TERMS[Math.floor(Math.random() * TERMS.length)];
  
  // Cross-references
  const crossRefs: CrossReference[] = [
    { source: "Loyalty", type: "score", title: `Loyalty: ${loyaltyScore}/100`, description: `${loyaltyGrade} grade. ${testimonials} testimonials, ${touchpoints} touchpoints.`, href: "/loyalty", priority: loyaltyScore < 85 ? 0.9 : 0.5 },
    { source: "Brand Equity", type: "score", title: `Brand Equity: ${brandEquityScore}/100`, description: `${testimonials} testimonials, ${competitors} competitors tracked.`, href: "/brand-equity", priority: 0.6 },
    { source: "Intelligence", type: "score", title: `Momentum: ${momentumScore}/100`, description: `${activeDeals.length} active deals, ${touchpoints} touchpoints.`, href: "/intelligence", priority: 0.7 },
    { source: "Patrick", type: "score", title: `Patrick: ${patrickScore}/100`, description: `$${totalRevenue.toLocaleString()} revenue, ${winRate}% win rate.`, href: "/patrick", priority: 0.8 },
    { source: "Stash", type: "template", title: stashRec?.title || "Grand Slam Offer", description: `By ${stashRec?.author}. ${stashRec?.body.slice(0, 80)}...`, href: "/stash", priority: 0.75 },
    { source: "Masters", type: "wisdom", title: masterQuote?.text || "Ship often.", description: `— ${masterQuote?.author}`, href: "/masters", priority: 0.5 },
    { source: "Papers", type: "research", title: paperHighlight?.title || "Attention Decay", description: paperHighlight?.keyFindings?.[0] || "Attention spans are shrinking.", href: "/papers", priority: 0.4 },
    { source: "Lexicon", type: "term", title: lexiconTerm?.name || "ROAS", description: lexiconTerm?.short || "Return on ad spend.", href: "/lexicon", priority: 0.3 },
  ];
  
  // System health
  const systemHealth = [
    { system: "CRM", status: contacts > 50 ? "healthy" : "thin", score: Math.min(100, contacts * 2) },
    { system: "Pipeline", status: pipelineValue > 100000 ? "strong" : "building", score: Math.min(100, pipelineValue / 10000) },
    { system: "Revenue", status: totalRevenue > 300000 ? "exceptional" : "growing", score: Math.min(100, totalRevenue / 5000) },
    { system: "Loyalty", status: loyaltyScore >= 80 ? "strong" : "needs work", score: loyaltyScore },
    { system: "Brand", status: brandEquityScore >= 80 ? "strong" : "building", score: brandEquityScore },
    { system: "Intelligence", status: momentumScore >= 80 ? "strong" : "moderate", score: momentumScore },
    { system: "Wire", status: wireArticles > 10 ? "active" : "needs seeding", score: Math.min(100, wireArticles * 8) },
    { system: "Masters", type: "knowledge", status: "16 loaded", score: 100 },
    { system: "Stash", type: "templates", status: "33 loaded", score: 100 },
    { system: "Papers", type: "research", status: "6 loaded", score: 100 },
    { system: "Lexicon", type: "terms", status: "68 loaded", score: 100 },
    { system: "Strategist", type: "ai", status: "local engine", score: 85 },
  ];
  
  return {
    loyaltyScore,
    loyaltyGrade,
    brandEquityScore,
    momentumScore,
    patrickScore,
    todaysFocus: todaysFocus.slice(0, 4),
    stashRecommendation: { id: stashRec?.id || "of-grand-slam", title: stashRec?.title || "Grand Slam Offer", why: stashRec?.body.slice(0, 100) || "Make an offer so good people feel stupid saying no.", author: stashRec?.author || "Alex Hormozi", template: !!stashRec?.template },
    masterQuote: { text: masterQuote?.text || "Ship often.", author: masterQuote?.author || "Seth Godin", category: "action" },
    paperHighlight: { id: paperHighlight?.id || "attention-decay-2026", title: paperHighlight?.title || "Attention Decay", keyFinding: paperHighlight?.keyFindings?.[0] || "Attention spans dropped to 8.25 seconds." },
    lexiconTerm: { name: lexiconTerm?.name || "ROAS", short: lexiconTerm?.short || "Return on ad spend.", category: lexiconTerm?.category || "analytics" },
    crossRefs,
    systemHealth,
    counts: { contacts, deals: deals.length, campaigns, revenue: revenue.length, touchpoints, testimonials, wireArticles, competitors },
    generatedAt: new Date().toISOString(),
  };
}
