#!/usr/bin/env node
/**
 * BAZ moat CLI.
 *
 * Commands:
 *   diagnostic  — Revenue Attribution Diagnostic (audit + report + 90-day plan)
 *   ask         — Operator Agent (synthesis-sequence answer to a client question)
 *
 * Pipe output to a file to capture the deliverable.
 */

import { buildReport } from "./report.js";
import { DEFAULT_AUDIT_FEE } from "./audit.js";
import { answer as operatorAnswer, render as renderOperator } from "./operator-agent/engine.js";
import type { AwarenessStage, MarketStage } from "./operator-agent/knowledge.js";
import { buildSequence, buildGate } from "./cold-email/sequence-builder.js";
import type { AwarenessStage as ColdAwareness, GateItem, SequenceInput } from "./cold-email/types.js";
import { buildCRO } from "./cro/engine.js";
import type { CROInput, FrictionSignal } from "./cro/types.js";
import { buildAISEO } from "./seo/engine.js";
import { resolveProvider } from "./seo/serp-client.js";
import type { SerpResult, AISEOInput, GeoCitation } from "./seo/types.js";
import { buildAdCreative } from "./ad-creative/engine.js";
import type { AdCreativeInput, BrandKit, Platform } from "./ad-creative/types.js";
import { buildCreatorOps } from "./creator-ops/engine.js";
import type { CreatorOpsInput, Creator } from "./creator-ops/types.js";
import type { AuditFinding, AuditInput, ClientContext, ComponentStatus } from "./types.js";

const VALID_STATUS: ReadonlySet<string> = new Set(["present", "partial", "missing", "broken"]);
const VALID_AWARENESS: ReadonlySet<string> = new Set([
  "unaware", "problem-aware", "solution-aware", "product-aware", "most-aware",
]);

interface ParsedArgs {
  command?: string;
  client?: string;
  revenue?: number;
  channel?: string;
  markets?: string;
  fee?: number;
  findings: AuditFinding[];
  // ask-specific
  question?: string;
  awareness?: AwarenessStage;
  marketStage?: MarketStage;
  metric?: string;
  json?: boolean;
  // sequence-specific
  seqName?: string;
  seqIcp?: string;
  seqOffer?: string;
  seqChannel?: "email" | "linkedin" | "mixed";
  seqMailboxes?: number;
  seqWarmup?: number;
  seqAwareness?: ColdAwareness;
  // gate overrides (status per gate item id)
  gate: Record<string, GateItem["status"]>;
  // cro-specific
  croClient?: string;
  croSessions?: number;
  croRate?: number;
  croValue?: number;
  croReplay?: boolean;
  croSignals: FrictionSignal[];
  // seo-specific
  seoKeyword?: string;
  seoDraft?: string;
  seoBrand?: string;
  seoTopN?: number;
  seoSerpKey?: string;
  geo?: boolean;
  // ad-creative-specific
  adBrief?: string;
  adOffer?: string;
  adAwareness?: AdCreativeInput["awareness"];
  adProof?: string;
  adBrandName?: string;
  adVoice?: string;
  adColorPrimary?: string;
  adColorAccent?: string;
  adPlatforms?: string;
  // creator-ops-specific
  creatorCampaign?: string;
  creatorBrand?: string;
  creatorIcp?: string;
  creatorBudget?: number;
  creators: Creator[];
}

function parseArgs(argv: string[]): ParsedArgs {
  const out: ParsedArgs = { findings: [], gate: {}, croSignals: [], creators: [] };
  const next = (arr: string[], i: number): string => arr[++i]!;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    switch (a) {
      case "--client": out.client = next(argv, i); break;
      case "--revenue": out.revenue = Number(next(argv, i)); break;
      case "--channel": out.channel = next(argv, i); break;
      case "--markets": out.markets = next(argv, i); break;
      case "--fee": out.fee = Number(next(argv, i)); break;
      case "--question": out.question = next(argv, i); break;
      case "--metric": out.metric = next(argv, i); break;
      case "--json": out.json = true; break;
      case "--seq-name": out.seqName = next(argv, i); break;
      case "--seq-icp": out.seqIcp = next(argv, i); break;
      case "--seq-offer": out.seqOffer = next(argv, i); break;
      case "--seq-channel": out.seqChannel = next(argv, i) as SequenceInput["channel"]; break;
      case "--seq-mailboxes": out.seqMailboxes = Number(next(argv, i)); break;
      case "--seq-warmup": out.seqWarmup = Number(next(argv, i)); break;
      case "--seq-awareness": out.seqAwareness = next(argv, i) as ColdAwareness; break;
      case "--cro-client": out.croClient = next(argv, i); break;
      case "--cro-sessions": out.croSessions = Number(next(argv, i)); break;
      case "--cro-rate": out.croRate = Number(next(argv, i)); break;
      case "--cro-value": out.croValue = Number(next(argv, i)); break;
      case "--cro-replay": out.croReplay = true; break;
      case "--seo-keyword": out.seoKeyword = next(argv, i); break;
      case "--seo-draft": out.seoDraft = next(argv, i); break;
      case "--seo-brand": out.seoBrand = next(argv, i); break;
      case "--seo-top-n": out.seoTopN = Number(next(argv, i)); break;
      case "--seo-serp-key": out.seoSerpKey = next(argv, i); break;
      case "--geo": out.geo = true; break;
      case "--ad-brief": out.adBrief = next(argv, i); break;
      case "--ad-offer": out.adOffer = next(argv, i); break;
      case "--ad-awareness": out.adAwareness = next(argv, i) as AdCreativeInput["awareness"]; break;
      case "--ad-proof": out.adProof = next(argv, i); break;
      case "--ad-brand": out.adBrandName = next(argv, i); break;
      case "--ad-voice": out.adVoice = next(argv, i); break;
      case "--ad-color-primary": out.adColorPrimary = next(argv, i); break;
      case "--ad-color-accent": out.adColorAccent = next(argv, i); break;
      case "--ad-platforms": out.adPlatforms = next(argv, i); break;
      case "--creator-campaign": out.creatorCampaign = next(argv, i); break;
      case "--creator-brand": out.creatorBrand = next(argv, i); break;
      case "--creator-icp": out.creatorIcp = next(argv, i); break;
      case "--creator-budget": out.creatorBudget = Number(next(argv, i)); break;
      case "--creator": {
        // Format: id|handle|platform|type|followers|engagement|fake|match|niche|cost
        const pair = next(argv, i) ?? "";
        const parts = pair.split("|");
        if (parts.length < 8) throw new Error(`Invalid --creator "${pair}". Expected id|handle|platform|type|followers|engagement(0-1)|fake(0-1)|match(0-1)[|niche|cost]`);
        const [id, handle, platform, type, followers, engagement, fake, match, niche, cost] = parts;
        out.creators.push({
          id: id!, handle: handle!, platform: platform as Creator["platform"], type: type as Creator["type"],
          followers: Number(followers), engagementRate: Number(engagement), fakeFollowerPct: Number(fake),
          audienceMatch: Number(match), niche: niche ?? "general", costPerPost: cost ? Number(cost) : 0,
        });
        break;
      }
      case "--cro-signal": {
        const pair = next(argv, i) ?? "";
        const parts = pair.split("|");
        if (parts.length < 4) throw new Error(`Invalid --cro-signal "${pair}". Expected id|type|location|observation[|step[|sessions[|rate]]]`);
        const [id, type, location, observation, step, sessions, rate] = parts;
        out.croSignals.push({
          id: id!,
          type: type as FrictionSignal["type"],
          location: location as FrictionSignal["location"],
          observation: observation!,
          funnelStep: step ? Number(step) : 1,
          monthlySessions: sessions ? Number(sessions) : undefined,
          currentRate: rate ? Number(rate) : undefined,
        });
        break;
      }
      case "--gate": {
        const pair = next(argv, i) ?? "";
        const [id, status] = pair.split("=");
        if (!id || !status || !["pass", "fail", "unknown"].includes(status)) throw new Error(`Invalid --gate "${pair}". Expected id=<pass|fail|unknown>`);
        out.gate[id] = status as GateItem["status"];
        break;
      }
      case "--awareness": {
        const v = next(argv, i);
        if (!VALID_AWARENESS.has(v)) throw new Error(`Invalid --awareness "${v}". Valid: ${[...VALID_AWARENESS].join("|")}`);
        out.awareness = v as AwarenessStage;
        break;
      }
      case "--market-stage": {
        const v = Number(next(argv, i));
        if (![1, 2, 3, 4, 5].includes(v)) throw new Error(`Invalid --market-stage "${v}". Valid: 1|2|3|4|5`);
        out.marketStage = v as MarketStage;
        break;
      }
      case "--finding": {
        const pair = next(argv, i);
        const [id, status] = pair.split("=");
        if (!id || !status || !VALID_STATUS.has(status)) {
          throw new Error(`Invalid --finding "${pair}". Expected id=<present|partial|missing|broken>`);
        }
        out.findings.push({ componentId: id, status: status as ComponentStatus });
        break;
      }
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
      default:
        // First non-flag positional arg is the command.
        if (!a.startsWith("--") && !out.command) out.command = a;
    }
  }
  return out;
}

function printHelp(): void {
  // eslint-disable-next-line no-console
  console.log(`BAZ moat — Revenue Attribution Diagnostic + Operator Agent

USAGE:
  baz-moat diagnostic --client "Acme" --revenue 250000 --channel meta --markets EU,US \\
    --finding ssgtm=partial --finding ga4=present --finding capi-meta=missing

  baz-moat ask --question "Our paid CAC is rising — what do we do?" \\
    --awareness solution-aware --market-stage 4 --channel meta --markets EU,US --metric CAC

DIAGNOSTIC OPTIONS:
  --client NAME        Client name
  --revenue USD        Monthly attributed revenue (USD)
  --channel CH         Primary paid channel
  --markets LIST       Comma-separated: MENA,EU,US
  --fee USD            Audit fee for 10x guarantee (default ${DEFAULT_AUDIT_FEE})
  --finding id=status   status: present|partial|missing|broken (unlisted = missing)

ASK OPTIONS:
  --question "Q"       The client question
  --awareness STAGE    unaware|problem-aware|solution-aware|product-aware|most-aware
  --market-stage N     1|2|3|4|5 (Schwartz sophistication)
  --channel CH         Primary channel
  --markets LIST       Comma-separated
  --metric NAME        The metric in play (CAC, LTV, ROAS, pipeline, ...)

SEQUENCE OPTIONS (cold email):
  --seq-name "N"       Campaign name
  --seq-icp "I"        The starving crowd (who + why hungry)
  --seq-offer "O"      The first yes (the offer)
  --seq-channel C      email|linkedin|mixed
  --seq-mailboxes N    Sending mailboxes in rotation
  --seq-warmup N       Warmup days completed
  --seq-awareness S    unaware|problem-aware|solution-aware|product-aware|most-aware
  --gate id=status     Deliverability gate override: id=pass|fail|unknown (repeatable)
                       ids: spf,dkim,dmarc,warmup,per-mailbox-cap,list-verified,
                            unsubscribe,seed-test,complaint-rate

CRO OPTIONS:
  --cro-client "N"     Client name
  --cro-sessions N    Monthly sessions to the page/funnel
  --cro-rate R         Baseline conversion rate (0-1, e.g. 0.03 for 3%)
  --cro-value V        Average conversion value (USD)
  --cro-replay         Flag: Microsoft Clarity / replay is instrumented
  --cro-signal S       One per friction signal: id|type|location|observation[|step[|sessions[|rate]]]
                       type: rage-click|dead-click|drop-off|form-abandonment|slow-lcp|unclear-cta|no-proof|friction-copy
                       location: landing|form|checkout|pricing|nav|cta|above-fold|mobile

SEO / GEO OPTIONS:
  --seo-keyword "K"    Target keyword to score the draft against
  --seo-draft "D"     The draft content (body text) to score
  --seo-brand "B"      Brand name (for GEO citation tracking)
  --seo-top-n N        Number of top SERP results to analyze (default 10)
  --seo-serp-key KEY   Live serpapi.com key (uses env SERPAPI_KEY if omitted)
  --geo                Flag: check GEO citations (requires a live GEO provider — offline stub if absent)

AD CREATIVE OPTIONS:
  --ad-brief "B"       The big idea / campaign brief
  --ad-offer "O"      The offer (the first yes — risk-reversed)
  --ad-awareness S    unaware|problem-aware|solution-aware|product-aware|most-aware
  --ad-proof "P"      Proof (a case-study metric or testimonial)
  --ad-brand "N"      Brand name
  --ad-voice "V"      Brand voice (one line)
  --ad-color-primary C  Primary brand color (hex)
  --ad-color-accent C   Accent brand color (hex)
  --ad-platforms LIST  Comma-separated: meta-feed,meta-reel,meta-story,google-display,tiktok-feed,linkedin-single,x-single

CREATOR OPS OPTIONS:
  --creator-campaign "N"  Campaign name
  --creator-brand "B"    Brand name
  --creator-icp "I"      The audience ICP creators must match
  --creator-budget $     Campaign budget (USD)
  --creator C           One per creator: id|handle|platform|type|followers|engagement(0-1)|fake(0-1)|match(0-1)[|niche|cost]
                         platform: instagram|tiktok|youtube|x|linkedin
                         type: influencer|creator|ugc|ambassador

  -h, --help           Show this help
`);
}

function runDiagnostic(args: ParsedArgs): void {
  if (!args.client || args.revenue === undefined || !args.channel || !args.markets) {
    printHelp();
    process.exit(1);
  }
  const markets = args.markets.split(",").map((m) => m.trim().toUpperCase()) as ClientContext["markets"];
  const client: ClientContext = {
    clientName: args.client,
    monthlyAttributedRevenue: args.revenue,
    primaryChannel: args.channel,
    markets,
  };
  const input: AuditInput = { client, findings: args.findings };
  const report = buildReport(input, args.fee ?? DEFAULT_AUDIT_FEE);
  if (args.json) {
    // Emit the structured DiagnosticReport as JSON (consumed by the reporting-layer dashboard).
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  // eslint-disable-next-line no-console
  console.log(`${report.markdown}\n\n---\n\n${report.plan}`);
}

function runAsk(args: ParsedArgs): void {
  if (!args.question || !args.awareness || !args.marketStage || !args.channel || !args.markets) {
    printHelp();
    process.exit(1);
  }
  const res = operatorAnswer({
    question: args.question,
    awareness: args.awareness,
    marketStage: args.marketStage,
    channel: args.channel,
    markets: args.markets.split(",").map((m) => m.trim()),
    metric: args.metric,
  });
  // eslint-disable-next-line no-console
  console.log(renderOperator(res));
}

function runSequence(args: ParsedArgs): void {
  if (!args.seqName || !args.seqIcp || !args.seqOffer || !args.seqChannel ||
      args.seqMailboxes === undefined || args.seqWarmup === undefined || !args.seqAwareness) {
    printHelp();
    process.exit(1);
  }
  const gate = buildGate(args.gate);
  const input: SequenceInput = {
    name: args.seqName,
    icp: args.seqIcp,
    channel: args.seqChannel,
    offer: args.seqOffer,
    awareness: args.seqAwareness,
    mailboxCount: args.seqMailboxes,
    warmupDays: args.seqWarmup,
    gate,
  };
  const out = buildSequence(input);
  // eslint-disable-next-line no-console
  console.log(out.markdown);
}

function runCRO(args: ParsedArgs): void {
  if (!args.croClient || args.croSessions === undefined || args.croRate === undefined) {
    printHelp();
    process.exit(1);
  }
  const input: CROInput = {
    clientName: args.croClient,
    monthlySessions: args.croSessions,
    baselineRate: args.croRate,
    avgValue: args.croValue,
    signals: args.croSignals,
    hasReplay: args.croReplay === true,
  };
  const out = buildCRO(input);
  // eslint-disable-next-line no-console
  console.log(out.markdown);
}

async function runSEO(args: ParsedArgs): Promise<void> {
  if (!args.seoKeyword || !args.seoDraft) {
    printHelp();
    process.exit(1);
  }
  const apiKey = args.seoSerpKey ?? process.env.SERPAPI_KEY;
  // Offline mode: no key → no snapshot → engine refuses (surgical). With a key, we'd fetch live.
  // For the CLI offline run, we pass an empty snapshot; the engine refuses + tells the user to supply a key.
  const serpResults: SerpResult[] = [];
  if (apiKey) {
    try {
      const provider = resolveProvider(serpResults, apiKey);
      if (provider) {
        const fetched = await provider.fetchTopResults(args.seoKeyword, args.seoTopN ?? 10);
        serpResults.push(...fetched);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`SERP API fetch failed: ${(e as Error).message}. Scoring against empty SERP (engine will refuse).`);
    }
  }
  const seoInput: AISEOInput = {
    keyword: args.seoKeyword,
    draft: args.seoDraft,
    brand: args.seoBrand,
    serpResults,
    topN: args.seoTopN,
    geoCitations: args.geo ? [] : undefined, // geo flag → engine marks "not checked" if empty
  };
  const out = buildAISEO(seoInput);
  // eslint-disable-next-line no-console
  console.log(out.markdown);
}

function runAd(args: ParsedArgs): void {
  if (!args.adBrief || !args.adOffer || !args.adAwareness || !args.adBrandName) {
    printHelp();
    process.exit(1);
  }
  const platforms = (args.adPlatforms ?? "meta-feed,tiktok-feed,linkedin-single")
    .split(",")
    .map((p) => p.trim() as Platform);
  const brand: BrandKit = {
    name: args.adBrandName,
    colors: {
      primary: args.adColorPrimary ?? "#22D3EE",
      secondary: "#818CF8",
      accent: args.adColorAccent ?? "#22D3EE",
      bg: "#020617",
      text: "#F8FAFC",
    },
    fonts: { heading: "Inter", body: "Inter" },
    voice: args.adVoice ?? "senior, precise, confident",
  };
  const input: AdCreativeInput = {
    brief: args.adBrief,
    offer: args.adOffer,
    awareness: args.adAwareness,
    brand,
    platforms,
    proof: args.adProof,
  };
  const out = buildAdCreative(input);
  // eslint-disable-next-line no-console
  console.log(out.markdown);
}

function runCreator(args: ParsedArgs): void {
  if (!args.creatorCampaign || !args.creatorBrand || !args.creatorIcp || args.creatorBudget === undefined || args.creators.length === 0) {
    printHelp();
    process.exit(1);
  }
  const input: CreatorOpsInput = {
    campaignName: args.creatorCampaign,
    brand: args.creatorBrand,
    audienceIcp: args.creatorIcp,
    creators: args.creators,
    budget: args.creatorBudget,
  };
  const out = buildCreatorOps(input);
  // eslint-disable-next-line no-console
  console.log(out.markdown);
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const command = args.command ?? "diagnostic";
  if (command === "ask") runAsk(args);
  else if (command === "sequence") runSequence(args);
  else if (command === "cro") runCRO(args);
  else if (command === "seo") { void runSEO(args); }
  else if (command === "ad") runAd(args);
  else if (command === "creator") runCreator(args);
  else if (command === "seo") runSEO(args);
  else if (command === "diagnostic") runDiagnostic(args);
  else { printHelp(); process.exit(1); }
}

main();