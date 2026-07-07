/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GLM ENGINE — Zhipu AI / GLM-4 Integration for the Marketing Hub
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Connects to GLM-4 (Zhipu AI) via its OpenAI-compatible API.
 * Falls back to a local rule-based engine when no API key is set.
 *
 * GLM-4 is one of the most powerful Chinese LLMs, capable of:
 *   - Complex reasoning and strategic analysis
 *   - Copywriting in multiple languages
 *   - Data interpretation and pattern recognition
 *   - Long-context understanding (128K tokens)
 *
 * API: https://open.bigmodel.cn/api/paas/v4/chat/completions
 * Models: glm-4-plus, glm-4, glm-4-flash, glm-4-air
 *
 * Set GLM_API_KEY in .env.local to activate.
 */

import OpenAI from "openai";

// ─── GLM Client ─────────────────────────────────────────────────────────────
const GLM_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";
const GLM_MODELS = {
  plus: "glm-4-plus",
  standard: "glm-4",
  flash: "glm-4-flash",
  air: "glm-4-air",
};

function getGLMClient(): OpenAI | null {
  const apiKey = process.env.GLM_API_KEY || process.env.ZHIPU_API_KEY;
  if (!apiKey || apiKey.includes("REPLACE")) return null;
  return new OpenAI({
    apiKey,
    baseURL: GLM_BASE_URL,
  });
}

export function isGLMAvailable(): boolean {
  return getGLMClient() !== null;
}

// ─── Chat Completion ────────────────────────────────────────────────────────
export interface GLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GLMResponse {
  content: string;
  model: string;
  tokens: number;
  ok: boolean;
  error?: string;
}

export async function glmChat(
  messages: GLMMessage[],
  options?: { model?: string; temperature?: number; maxTokens?: number },
): Promise<GLMResponse> {
  const client = getGLMClient();
  if (!client) {
    return {
      content: "",
      model: "none",
      tokens: 0,
      ok: false,
      error: "GLM_API_KEY not set. Add it to .env.local to activate GLM-4.",
    };
  }

  try {
    const model = options?.model || GLM_MODELS.plus;
    const completion = await client.chat.completions.create({
      model,
      messages: messages as unknown[],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
    });

    return {
      content: completion.choices[0]?.message?.content || "",
      model,
      tokens: completion.usage?.total_tokens || 0,
      ok: true,
    };
  } catch (error: unknown) {
    return {
      content: "",
      model: options?.model || GLM_MODELS.plus,
      tokens: 0,
      ok: false,
      error: error.message || "GLM API error",
    };
  }
}

// ─── Strategist System Prompt (the Master Prompt) ───────────────────────────
export const STRATEGIST_SYSTEM_PROMPT = `You are the chief strategist for an elite marketing agency. Your job is to help build, position, sell, and scale an S-tier agency that wins premium clients and delivers measurable growth.

Act like the best parts of top marketers:
- David Ogilvy for clarity, research, and persuasive copy.
- Eugene Schwartz for market sophistication and demand capture.
- Claude Hopkins for testing, direct response, and measurable results.
- Seth Godin for positioning, permission, and category design.
- Dan Kennedy for offers, sales psychology, and response-driven marketing.
- Gary Halbert for headlines, hooks, and high-converting direct response.
- Russell Brunson for funnels, value ladders, and conversion systems.
- Joanna Wiebe for conversion copy and voice-of-customer.
- Ryan Deiss for customer journeys and lifecycle marketing.
- Alex Hormozi for offers, distribution, and lead generation economics.

Your standards:
- Prioritize revenue, retention, and repeatable systems.
- Think in positioning, offer, acquisition, conversion, fulfillment, and scale.
- Use sharp, practical, execution-ready language.
- Always look for leverage, speed, and differentiators.
- Challenge weak ideas and replace them with stronger ones.
- If something is vague, ask the minimum number of questions needed.
- Use first principles, not generic marketing advice.
- Give me options ranked by impact, effort, and speed.
- When useful, provide frameworks, templates, scripts, checklists, and examples.

Output format:
- Start with the best strategic move.
- Then give me a concise plan.
- Then give me the exact assets I need.
- End with the next 3 actions I should take today.

If I ask for copy, write it in a way that is:
- Specific.
- Emotionally sharp.
- Believable.
- Conversion-oriented.
- Tailored to the buyer's sophistication level.

If I ask for strategy, think like a boardroom operator.
If I ask for copy, think like the best direct-response writer alive.
If I ask for systems, think like an operations architect.
If I ask for growth, think like a ruthless but ethical scaler.

You have access to the Marketing Hub's real-time data. Use it. Reference specific numbers, specific deals, specific campaigns. Ground every recommendation in the data provided.`;

// ─── Data Context Builder ───────────────────────────────────────────────────
export function buildHubDataContext(data: {
  patrick?: Record<string, unknown>;
  intelligence?: Record<string, unknown>;
  dashboard?: Record<string, unknown>;
  trends?: Record<string, unknown>;
  today?: Record<string, unknown>;
}): string {
  const ctx: string[] = [];

  if (data.patrick) {
    const p = data.patrick;
    ctx.push(`=== FINANCIAL REALITY (The Patrick Number) ===
Cash collected this month: $${p.cash?.collectedThisMonth?.toLocaleString() || 0}
Cash delta vs last month: ${p.cash?.deltaPct || 0}%
MRR: $${p.mrr?.currentMrr?.toLocaleString() || 0}/mo (ARR: $${p.mrr?.arr?.toLocaleString() || 0})
LTV/CAC: ${p.unitEconomics?.ltvCacRatio || 0}x
Win rate: ${p.pipeline?.winRate || 0}% (${p.pipeline?.wonThisMonth || 0} won, ${p.pipeline?.lostThisMonth || 0} lost)
Active pipeline: $${p.pipeline?.activeValue?.toLocaleString() || 0}
Weighted pipeline: $${p.pipeline?.weightedValue?.toLocaleString() || 0}
Verdict: ${p.score?.overall || 0}/100 (cash: ${p.score?.cash}, growth: ${p.score?.growth}, efficiency: ${p.score?.efficiency}, risk: ${p.score?.risk})
Risks: ${(p.risks || []).map((r: Record<string, unknown>) => r.title).join("; ") || "none"}
Leverage: ${(p.leverage || []).map((l: Record<string, unknown>) => l.title).join("; ") || "none"}`);
  }

  if (data.intelligence) {
    const i = data.intelligence;
    ctx.push(`=== INTELLIGENCE ===
Momentum: ${i.momentum?.score || 0}/100 (${i.momentum?.dealsProgressed || 0} deals progressed, ${i.momentum?.followupsSent || 0} follow-ups)
Velocity: $${i.velocity?.velocityPerDay?.toLocaleString() || 0}/day
Forecast confidence: ${i.forecast?.score || 0}% (${i.forecast?.verified || 0} verified, ${i.forecast?.active || 0} active)
Agent efficiency: ${i.agents?.score || 0}%`);
  }

  if (data.dashboard) {
    const d = data.dashboard;
    ctx.push(`=== OPERATIONS ===
Contacts: ${d.metrics?.contactCount || 0}
Active deals: ${d.metrics?.dealCount || 0}
Pipeline value: $${d.metrics?.pipelineValue?.toLocaleString() || 0}
Campaigns: ${(d.campaigns || []).length}
Budget planned: $${d.metrics?.plannedThisMonth?.toLocaleString() || 0}
Budget actual: $${d.metrics?.actualThisMonth?.toLocaleString() || 0}
Personas: ${d.metrics?.personas || 0}
Competitors: ${d.metrics?.competitors || 0}
Forms: ${d.metrics?.forms || 0}
Experiments: ${d.metrics?.experiments || 0}
Testimonials: ${d.metrics?.testimonials || 0}
Unread inbox: ${d.metrics?.unreadInbox || 0}
Playbooks: ${d.metrics?.playbooks || 0}`);
  }

  if (data.trends?.macro) {
    const trends = data.trends.macro.slice(0, 5);
    ctx.push(`=== TREND SIGNALS ===
${trends.map((t: Record<string, unknown>) => `${t.label}: ${t.maturity} (${t.adoption_pct}% adoption, velocity ${t.velocity_30d > 0 ? "+" : ""}${t.velocity_30d}%)`).join("\n")}`);
  }

  if (data.today?.moves?.length) {
    ctx.push(`=== TODAY'S PRIORITY MOVES ===
${data.today.moves.map((m: Record<string, unknown>) => `#${m.priority}: ${m.title} — ${m.why}`).join("\n")}`);
  }

  return ctx.join("\n\n");
}

// ─── Strategist Query ───────────────────────────────────────────────────────
export interface StrategistRequest {
  question: string;
  mode?: "strategy" | "copy" | "systems" | "growth" | "diagnosis";
  hubData?: {
    patrick?: Record<string, unknown>;
    intelligence?: Record<string, unknown>;
    dashboard?: Record<string, unknown>;
    trends?: Record<string, unknown>;
    today?: Record<string, unknown>;
  };
}

export interface StrategistResponse {
  answer: string;
  mode: string;
  model: string;
  tokens: number;
  ok: boolean;
  error?: string;
  contextUsed: boolean;
  generatedAt: string;
}

export async function askStrategist(req: StrategistRequest): Promise<StrategistResponse> {
  const mode = req.mode || "strategy";
  const context = req.hubData ? buildHubDataContext(req.hubData) : "";

  const modePrompt: Record<string, string> = {
    strategy:
      "Think like a boardroom operator. Focus on positioning, market opportunity, and competitive moats.",
    copy: "Think like the best direct-response copywriter alive. Write specific, emotionally sharp, conversion-oriented copy.",
    systems:
      "Think like an operations architect. Design repeatable systems, SOPs, and automation flows.",
    growth:
      "Think like a ruthless but ethical scaler. Focus on acquisition channels, conversion optimization, and retention loops.",
    diagnosis:
      "Diagnose the market and identify the best opportunity. Be brutally honest about weaknesses.",
  };

  const messages: GLMMessage[] = [
    { role: "system", content: STRATEGIST_SYSTEM_PROMPT },
    { role: "system", content: `Mode: ${mode}. ${modePrompt[mode] || modePrompt.strategy}` },
    ...(context
      ? [
          {
            role: "system",
            content: `Here is the real-time data from the Marketing Hub:\n\n${context}`,
          } as GLMMessage,
        ]
      : []),
    { role: "user", content: req.question },
  ];

  const result = await glmChat(messages, {
    model: GLM_MODELS.plus,
    temperature: mode === "copy" ? 0.8 : 0.6,
    maxTokens: 4096,
  });

  if (!result.ok) {
    // Fallback to local engine
    return {
      answer: localStrategist(req, context),
      mode,
      model: "local-engine",
      tokens: 0,
      ok: true,
      contextUsed: !!context,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    answer: result.content,
    mode,
    model: result.model,
    tokens: result.tokens,
    ok: true,
    contextUsed: !!context,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Local Fallback Engine ──────────────────────────────────────────────────
function localStrategist(req: StrategistRequest, context: string): string {
  const q = req.question.toLowerCase();

  // Parse key data from context if available
  const cashMatch = context.match(/Cash collected.*?\$(\d[\d,]*)/);
  const cash = cashMatch ? parseInt(cashMatch[1].replace(/,/g, "")) : 0;
  const verdictMatch = context.match(/Verdict:\s*(\d+)/);
  const verdict = verdictMatch ? parseInt(verdictMatch[1]) : 0;
  const winRateMatch = context.match(/Win rate:\s*([\d.]+)%/);
  const winRate = winRateMatch ? parseFloat(winRateMatch[1]) : 0;
  const ltvCacMatch = context.match(/LTV\/CAC:\s*([\d.]+)x/);
  const ltvCac = ltvCacMatch ? parseFloat(ltvCacMatch[1]) : 0;
  const pipelineMatch = context.match(/Active pipeline:\s*\$(\d[\d,]*)/);
  const pipeline = pipelineMatch ? parseInt(pipelineMatch[1].replace(/,/g, "")) : 0;

  const lines: string[] = [];

  lines.push("## 🔥 HIGHEST-LEVERAGE INSIGHT");
  if (ltvCac > 10) {
    lines.push(
      `Your LTV/CAC ratio is ${ltvCac}x — this is extraordinarily high (benchmark: 3x). Your unit economics are exceptional, which means **you are under-investing in acquisition**. Every dollar you're not spending on acquisition is leaving money on the table. Scale your ad spend and outbound immediately.`,
    );
  } else if (winRate < 50) {
    lines.push(
      `Your win rate is ${winRate}% — you're losing more deals than you win. The highest-leverage fix is not more leads, it's better qualification and a stronger offer. Tighten your ICP definition and add risk reversal to your close.`,
    );
  } else if (verdict >= 80) {
    lines.push(
      `Your Patrick Number is ${verdict}/100 with $${cash?.toLocaleString()} cash collected. The business is healthy. The highest-leverage move now is **building repeatable systems** — you've proven the model works, now make it work without you.`,
    );
  } else {
    lines.push(
      `With $${cash?.toLocaleString()} cash collected and a ${verdict}/100 verdict, focus on the bottleneck: if cash is low, fix acquisition; if pipeline is low, fix outbound; if win rate is low, fix the offer.`,
    );
  }

  lines.push("\n## 📋 CONCISE PLAN");

  if (q.includes("offer") || q.includes("positioning") || q.includes("niche")) {
    lines.push("### Offer Architecture (Hormozi Framework)");
    lines.push(`1. **Dream Outcome**: Define the exact transformation — not the service, the outcome. "We help [niche] achieve [specific result] in [timeframe]."
2. **Belief Mechanism**: Why it works when nothing else has. Your unique mechanism — the thing only you do.
3. **Risk Reversal**: "If we don't [specific result] in [timeframe], you don't pay." Make saying yes risk-free.
4. **Value Stack**: Core service + bonuses + support + guarantee. Stack until perceived value is 10x price.
5. **Urgency**: Genuine scarcity — limited capacity, time-bound bonus, or cohort-based enrollment.

**Your offer should be so good people feel stupid saying no.**`);

    lines.push("\n## 📝 EXACT ASSETS NEEDED");
    lines.push("- [ ] One-sentence offer statement (dream outcome + timeframe + mechanism)");
    lines.push("- [ ] 3-tier pricing structure (Good / Better / Best with middle pre-selected)");
    lines.push("- [ ] Risk reversal guarantee (specific, not 'satisfaction guaranteed')");
    lines.push("- [ ] Value stack document (list every bonus with its standalone value)");
    lines.push("- [ ] Objection handler script (top 5 objections → specific responses)");
  } else if (
    q.includes("copy") ||
    q.includes("headline") ||
    q.includes("ad") ||
    q.includes("email")
  ) {
    lines.push("### Copy Framework (Ogilvy + Schwartz + Sugarman)");

    lines.push("\n**Headline Formulas (Ogilvy):**");
    lines.push('- "How to [desired result] without [common pain]"');
    lines.push('- "The [adjective] way to [result] in [timeframe]"');
    lines.push('- "[Number] [things] that [benefit] — and the one that works best"');
    lines.push('- "What [authority figure] knows about [topic] that you don\'t"');

    lines.push("\n**Awareness Level Match (Schwartz):**");
    lines.push(
      "- Unaware: 'Do you have [problem]?'\n- Problem Aware: 'How to solve [problem]'\n- Solution Aware: 'Why [your solution] is different'\n- Product Aware: 'Why [your product] beats [alternative]'",
    );

    lines.push("\n**Slippery Slope (Sugarman):**");
    lines.push(
      "- Headline → must make you read sentence 1\n- Sentence 1 → must make you read sentence 2\n- Each sentence creates desire for the next\n- By the time they see the price, they're already sold",
    );

    if (pipeline > 0) {
      lines.push(
        `\n**Data-driven angle**: Your pipeline is $${pipeline?.toLocaleString()}. Your average deal size suggests you're selling premium services. Premium copy should focus on **transformation and ROI**, not features and discounts.`,
      );
    }

    lines.push("\n## 📝 EXACT ASSETS NEEDED");
    lines.push("- [ ] 10 headline variations (test with Experiments module)");
    lines.push("- [ ] Email sequence: 3 value jabs + 1 right hook (GaryVee framework)");
    lines.push("- [ ] Landing page with StoryBrand structure (hero, problem, guide, plan, CTA)");
    lines.push("- [ ] Ad copy matched to each awareness level");
  } else if (
    q.includes("system") ||
    q.includes("sop") ||
    q.includes("process") ||
    q.includes("automation")
  ) {
    lines.push("### Systems Architecture (Hopkins + Deiss)");

    lines.push("\n**The 6-System Agency Stack:**");
    lines.push("1. **Acquisition System**: Lead sources → qualification → booking → pitch");
    lines.push("2. **Conversion System**: Pitch → proposal → close → onboarding");
    lines.push("3. **Fulfillment System**: Kickoff → delivery milestones → reporting → review");
    lines.push("4. **Retention System**: QBRs → upsell triggers → churn early-warning → win-back");
    lines.push(
      "5. **Referral System**: NPS → testimonial collection → referral asks → case studies",
    );
    lines.push("6. **Scale System**: SOPs → automation → delegation → AI augmentation");

    if (context.includes("Contacts:")) {
      const contactsMatch = context.match(/Contacts:\s*(\d+)/);
      const contacts = contactsMatch ? parseInt(contactsMatch[1]) : 0;
      if (contacts > 50) {
        lines.push(
          `\n**Data insight**: You have ${contacts} contacts but may not have a systematic follow-up process. Build a 5-touch sequence: Day 1 (value), Day 3 (case study), Day 7 (offer), Day 14 (social proof), Day 30 (check-in).`,
        );
      }
    }

    lines.push("\n## 📝 EXACT ASSETS NEEDED");
    lines.push(
      "- [ ] Client journey map (acquisition → onboarding → delivery → retention → referral)",
    );
    lines.push("- [ ] 5 SOPs: sales call, onboarding, weekly report, QBR, offboarding");
    lines.push(
      "- [ ] Automation triggers: new lead → 5-touch sequence, deal won → onboarding flow",
    );
    lines.push(
      "- [ ] KPI dashboard: Patrick Number (daily), pipeline (weekly), retention (monthly)",
    );
  } else if (
    q.includes("growth") ||
    q.includes("scale") ||
    q.includes("acquisition") ||
    q.includes("lead")
  ) {
    lines.push("### Growth Strategy (Hormozi + Halbert + Vaynerchuk)");

    lines.push("\n**The Growth Equation:**");
    lines.push("Revenue = (Leads × Close Rate × Deal Size × Frequency) - CAC - Delivery Cost");
    lines.push(
      "To 2x revenue: you can 2x any ONE variable, or 1.2x all four. The second is easier.",
    );

    if (ltvCac > 10) {
      lines.push(
        `\n**🔥 Critical insight**: Your LTV/CAC is ${ltvCac}x. This means you can afford to spend ${Math.floor(ltvCac * 0.5)}x more on acquisition and still be profitable. You are LEAVING MONEY ON THE TABLE by under-investing in ads and outbound.`,
      );
    }

    lines.push("\n**Acquisition Channels (ranked by leverage):**");
    lines.push(
      "1. **Outbound + Personalization** — highest close rate, lowest volume. Cold email + LinkedIn + Loom.",
    );
    lines.push("2. **Referral Systems** — highest ROI, built on retention. NPS → ask → reward.");
    lines.push("3. **Content + SEO** — compounding, slow start. Document, don't create (GaryVee).");
    lines.push(
      "4. **Paid Acquisition** — fastest scale, requires CAC discipline. Only if LTV/CAC > 3x.",
    );
    lines.push(
      "5. **Partnerships** — leverage others' audiences. Agency-to-agency, complementary services.",
    );

    lines.push("\n## 📝 EXACT ASSETS NEEDED");
    lines.push("- [ ] Cold email sequence (4 emails: value, case study, offer, break-up)");
    lines.push("- [ ] LinkedIn outbound script (connection → value → soft pitch)");
    lines.push("- [ ] Referral system: NPS survey → testimonial request → referral ask → reward");
    lines.push("- [ ] Lead magnet aligned to your highest-converting service");
  } else {
    // General diagnosis / strategy
    lines.push("### Market Diagnosis (Schwartz + Godin + Halbert)");

    lines.push("\n**1. Find the Starving Crowd (Halbert)**");
    lines.push(
      "Who is already desperate for what you sell? Not who might want it — who NEEDS it? Your CRM has the answer: look at which deals closed fastest and which clients referred the most.",
    );

    lines.push("\n**2. Market Sophistication (Schwartz)**");
    lines.push("- If you're first: claim the benefit directly.");
    lines.push("- If competitors exist: claim superiority with a mechanism.");
    lines.push("- If market is saturated: reframe the entire problem.");
    lines.push("- If me-too products: sell the story, not the features.");

    lines.push("\n**3. Positioning (Godin)**");
    lines.push(
      "Find the smallest viable audience. Be remarkable. Your positioning should make someone say: 'Finally, someone gets it.' If your positioning could describe 10 other agencies, it's not positioning — it's a category description.",
    );

    if (winRate > 0 && winRate < 50) {
      lines.push(
        `\n**⚠️ Bottleneck detected**: Win rate is ${winRate}%. You're losing more than winning. Before scaling acquisition, fix the close. Common culprits: weak offer, no risk reversal, poor qualification, or pricing mismatch.`,
      );
    }

    lines.push("\n## 📝 EXACT ASSETS NEEDED");
    lines.push("- [ ] One-page positioning statement (who, what, why you, why now)");
    lines.push("- [ ] ICP definition (firmographics + psychographics + pain points)");
    lines.push("- [ ] Competitive matrix (feature comparison + positioning map)");
    lines.push("- [ ] Core offer document (promise + mechanism + proof + price)");
  }

  lines.push("\n## ✅ NEXT 3 ACTIONS TO TAKE TODAY");
  lines.push(
    "1. **Write your one-sentence offer** — 'We help [who] achieve [what] in [timeframe] via [mechanism].'",
  );
  lines.push(
    "2. **Identify your starving crowd** — open CRM, find the 3 deals that closed fastest. What do they have in common?",
  );
  lines.push(
    "3. **Add risk reversal to your close** — 'If we don't [result] in [timeframe], you don't pay.' Test it on your next 3 pitches.",
  );

  lines.push("\n---");
  lines.push(
    "*Powered by the Marketing Hub Strategist Engine. Set GLM_API_KEY in .env.local to activate GLM-4 for AI-powered strategic analysis.*",
  );

  return lines.join("\n");
}
// ─── Enhanced context with stash + masters ─────────────────────────────────
export function buildFullContext(hubData: Record<string, unknown>): string {
  const base = buildHubDataContext(hubData);
  return (
    base +
    `

=== AVAILABLE RESOURCES ===
The Hub contains these resources you can reference:
- 16 marketing masters with 45 core teachings (see /masters)
- 33 battle-tested templates in the Secret Stash (see /stash)
- 6 academic papers on attention economics (see /papers)
- 68 marketing terms in the Lexicon (see /lexicon)
- 27 modern marketing formulas (see /library)
- 14 legacy formulas from the Old School (see /old-school)
- 9-dimension Loyalty Score (see /loyalty)
- 5-dimension Brand Equity Score (see /brand-equity)
- Funnel Builder with leak detection (see /funnel-builder)
- ROI Marketing brand bible (see /roi-marketing)

When recommending strategies, reference specific masters and templates.
Example: "Use Hormozi's Grand Slam Offer framework (Stash: of-grand-slam)"
Example: "Apply Schwartz's 5 Levels of Awareness (Masters: Eugene Schwartz)"
Example: "Follow Sugarman's Slippery Slope (Stash: fw-slippery-slope)"`
  );
}
