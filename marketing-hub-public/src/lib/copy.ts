// Template-based copy generator. No external AI; works fully offline.
// Produces varied output by combining templates with random picks.

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickN<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  const out: T[] = [];
  while (out.length < n && a.length) {
    out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
  }
  return out;
}

export interface CopyInput {
  topic: string;
  audience?: string;
  brand?: string;
  tone?: "friendly" | "professional" | "bold" | "playful" | "urgent";
  benefits?: string[];
  features?: string[];
}

const TONES = {
  friendly: { you: "you", pronoun: "we'd love to", cta: "Give it a try" },
  professional: { you: "you", pronoun: "we recommend", cta: "Learn more" },
  bold: { you: "you", pronoun: "you deserve", cta: "Claim yours now" },
  playful: { you: "you", pronoun: "let's get", cta: "Try it on" },
  urgent: { you: "you", pronoun: "now's the time", cta: "Don't wait" },
};

export function generateHeadlines(input: CopyInput, count = 8): string[] {
  const t = (input.topic || "your goals").trim();
  const aud = (input.audience || "teams like yours").trim();
  const b = input.brand?.trim();
  const bn = input.benefits?.[0];
  const tone = TONES[input.tone || "friendly"];
  const templates = [
    `${cap(t)} — without the headache`,
    `How ${aud} ${tone.pronoun} ${t.toLowerCase()}`,
    `${cap(t)}, simplified`,
    `The smarter way to ${t.toLowerCase()}`,
    `Built for ${aud}`,
    `Stop guessing. Start ${t.toLowerCase()}.`,
    bn ? `${cap(bn)} — ${t.toLowerCase()} that just works` : `${cap(t)} that actually works`,
    b ? `${b}: ${cap(t)} for the rest of us` : `${cap(t)}, made simple`,
    `What if ${t.toLowerCase()} was easy?`,
    `${cap(t)} for ${aud}`,
    `Finally — ${t.toLowerCase()} that scales`,
    `Less busywork. More ${t.toLowerCase()}.`,
    `Your shortcut to ${t.toLowerCase()}`,
    `Three reasons ${aud} love ${t.toLowerCase()}`,
  ];
  return pickN(templates, Math.min(count, templates.length));
}

export function generateHooks(input: CopyInput, count = 8): string[] {
  const t = input.topic || "this";
  const aud = input.audience || "most people";
  const bn = input.benefits?.[0];
  const templates = [
    `Here's the thing about ${t.toLowerCase()} —`,
    `If you're a ${aud}, read this.`,
    `Most people get ${t.toLowerCase()} wrong. Here's why.`,
    `I spent weeks figuring out ${t.toLowerCase()}. Here's what I learned:`,
    `A quick story about ${t.toLowerCase()}:`,
    `Three words changed how I think about ${t.toLowerCase()}:`,
    `Plot twist: ${t} doesn't have to be hard.`,
    bn ? `The real reason ${bn.toLowerCase()} matters:` : `The truth about ${t.toLowerCase()}:`,
    `If ${t.toLowerCase()} feels overwhelming, start here:`,
    `Here's a 60-second lesson in ${t.toLowerCase()}:`,
    `Unpopular opinion: most ${t.toLowerCase()} advice is wrong.`,
    `Steal this ${t.toLowerCase()} framework:`,
  ];
  return pickN(templates, Math.min(count, templates.length));
}

export function generateCTAs(input: CopyInput, count = 10): string[] {
  const t = (input.topic || "this").toLowerCase();
  const bn = input.benefits?.[0];
  const templates = [
    `Get started free`,
    `Try it now`,
    `See it in action`,
    `Start in 60 seconds`,
    `Claim your spot`,
    `Show me how`,
    `Book a demo`,
    `Send me the guide`,
    `Unlock ${bn || t}`,
    `Yes, I want this`,
    `Take the next step`,
    `Get the playbook`,
    `Start ${t} today`,
  ];
  return pickN(templates, Math.min(count, templates.length));
}

export function generateAdCopy(input: CopyInput): {
  primary: string;
  headline: string;
  description: string;
  cta: string;
} {
  const headlines = generateHeadlines(input, 1);
  const ctas = generateCTAs(input, 1);
  const t = input.topic || "this";
  const bn = input.benefits?.[0] || "real results";
  return {
    primary: `${headlines[0]}. ${bn}.`,
    headline: headlines[0],
    description: `${bn}, made simple for ${input.audience || "busy teams"}.`,
    cta: ctas[0],
  };
}

export function generateEmailSequence(
  input: CopyInput,
): Array<{ day: number; subject: string; preheader: string; body: string }> {
  const t = input.topic || "this";
  const aud = input.audience || "you";
  const bn = input.benefits?.[0] || "real value";
  const brand = input.brand || "We";
  return [
    {
      day: 0,
      subject: `Welcome — let's get you started with ${t}`,
      preheader: `Quick wins in your first 5 minutes`,
      body: `Hi {{first_name}},\n\nWelcome aboard. Here's the fastest path to ${bn.toLowerCase()} with ${t}.\n\n1. Do this one thing first\n2. Then this\n3. Watch the magic\n\nReply if you get stuck — we read every message.\n\n— ${brand}`,
    },
    {
      day: 2,
      subject: `The one mistake ${aud} make with ${t}`,
      preheader: `And how to avoid it`,
      body: `Hi {{first_name}},\n\nQuick one — most ${aud} jump into ${t} without this step, and it costs them hours.\n\nThe fix is simple: [describe].\n\nTry it today and let me know how it goes.\n\n— ${brand}`,
    },
    {
      day: 5,
      subject: `A shortcut for ${t}`,
      preheader: `Save this for later`,
      body: `Hi {{first_name}},\n\nSaw you checking things out — here's a shortcut we use internally:\n\n[TIP]. It cuts the time for ${t} in half.\n\n— ${brand}`,
    },
    {
      day: 7,
      subject: `Still thinking it over?`,
      preheader: `Last note from me`,
      body: `Hi {{first_name}},\n\nNo pressure — just wanted to ask: is there anything blocking you from getting started with ${t}?\n\nIf I can help, hit reply.\n\n— ${brand}`,
    },
  ];
}

export function generateBlogOutline(input: CopyInput): {
  title: string;
  meta: string;
  sections: Array<{ heading: string; points: string[] }>;
} {
  const t = cap(input.topic || "this topic");
  const aud = input.audience || "readers";
  return {
    title: `The Complete Guide to ${t} for ${cap(aud)}`,
    meta: `Everything ${aud} need to know about ${t.toLowerCase()} — practical steps, common mistakes, and what to do next.`,
    sections: [
      {
        heading: `Why ${t.toLowerCase()} matters in ${new Date().getFullYear()}`,
        points: [
          "The shift you should know about",
          "Where most teams go wrong",
          "What winners do differently",
        ],
      },
      {
        heading: `The 3-step framework`,
        points: [
          "Step 1: Audit your current state",
          "Step 2: Set a measurable goal",
          "Step 3: Iterate weekly",
        ],
      },
      {
        heading: `Common pitfalls (and how to dodge them)`,
        points: ["Mistake #1", "Mistake #2", "Mistake #3"],
      },
      {
        heading: `Tools and templates`,
        points: ["Free checklist", "Recommended stack", "Sample workflow"],
      },
      {
        heading: `Putting it all together`,
        points: ["Your 7-day plan", "What to track", "When to course-correct"],
      },
      {
        heading: `FAQ`,
        points: [
          "How long until I see results?",
          "What if I'm just starting?",
          "How do I scale this?",
        ],
      },
    ],
  };
}

export function generateSocialPosts(
  input: CopyInput,
  count = 6,
): Array<{ channel: string; body: string; hashtags: string[] }> {
  const hooks = generateHooks(input, count);
  const channels = ["twitter", "linkedin", "instagram", "facebook", "threads"];
  const tags = (input.topic || "marketing")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => `#${t.replace(/[^a-z0-9]/gi, "")}`);
  const brandTag = input.brand ? [input.brand.replace(/\s+/g, "")] : [];
  return hooks.map((h, i) => ({
    channel: channels[i % channels.length],
    body: `${h}\n\n${input.benefits?.[0] || ""}\n\n${[...tags.slice(0, 3), ...brandTag].join(" ")}`.trim(),
    hashtags: [...tags.slice(0, 3), ...brandTag],
  }));
}

function cap(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

/* ────────────── v2: classic copywriting frameworks ──────────────
 * Added in the "Make it Savage" pass. Each framework outputs a full
 * ready-to-paste structure that respects the requested tone. */

export type FrameworkId =
  | "aida" // Attention → Interest → Desire → Action
  | "pas" // Problem → Agitate → Solution
  | "bab" // Before → After → Bridge
  | "storybrand" // Character → Problem → Guide → Plan → Call → Avoid → Success
  | "hso" // Hook → Story → Offer
  | "4c" // Clear → Concise → Compelling → Credible
  | "7c"; // Clear → Concise → Compelling → Credible → Current → Consistent → Conversion-led

export const COPY_FRAMEWORKS: { id: FrameworkId; label: string; when: string; beats: string[] }[] =
  [
    {
      id: "aida",
      label: "AIDA",
      when: "Classic conversion pages and ads",
      beats: ["Attention", "Interest", "Desire", "Action"],
    },
    {
      id: "pas",
      label: "PAS",
      when: "When the pain is vivid and the fix is obvious",
      beats: ["Problem", "Agitate", "Solution"],
    },
    {
      id: "bab",
      label: "Before–After–Bridge",
      when: "Status-quo disruption, transformation narratives",
      beats: ["Before", "After", "Bridge"],
    },
    {
      id: "storybrand",
      label: "StoryBrand",
      when: "When you need narrative clarity (Godin/Schmitt hybrid)",
      beats: [
        "Character",
        "Problem",
        "Guide",
        "Plan",
        "Call to Action",
        "Failure Aversion",
        "Success",
      ],
    },
    {
      id: "hso",
      label: "Hook–Story–Offer",
      when: "Cold traffic, short-form, sales letters",
      beats: ["Hook", "Story", "Offer"],
    },
    {
      id: "4c",
      label: "4C",
      when: "Tight, exec-friendly copy",
      beats: ["Clear", "Concise", "Compelling", "Credible"],
    },
    {
      id: "7c",
      label: "7C",
      when: "Long-form landing pages & VSL scripts",
      beats: [
        "Clear",
        "Concise",
        "Compelling",
        "Credible",
        "Current",
        "Consistent",
        "Conversion-led",
      ],
    },
  ];

export interface FrameworkCopy {
  framework: FrameworkId;
  headline: string;
  beats: Array<{ name: string; body: string }>;
  cta: string;
  rationale: string;
}

export function generateFramework(input: CopyInput, framework: FrameworkId): FrameworkCopy {
  const t = (input.topic || "your goals").trim();
  const aud = (input.audience || "teams like yours").trim();
  const b = input.brand?.trim();
  const bn = input.benefits?.[0] || "real results";
  const feat = input.features?.[0];
  const capT = cap(t);
  const brand = b ? `${b} ` : "";

  let headline = "";
  let beats: { name: string; body: string }[] = [];
  let cta = "Get started";
  let rationale = "";

  switch (framework) {
    case "aida":
      headline = `How ${aud} get ${bn.toLowerCase()} with ${t.toLowerCase()}`;
      beats = [
        {
          name: "Attention",
          body: `If ${t.toLowerCase()} has felt harder than it should be, you're not alone.`,
        },
        {
          name: "Interest",
          body: `${capT} works when you stop guessing and start with a clear system.`,
        },
        {
          name: "Desire",
          body: `Imagine hitting ${bn.toLowerCase()} without the busywork — every week.`,
        },
        { name: "Action", body: `It starts with one decision. We'll show you the rest.` },
      ];
      cta = "Show me how";
      rationale = "Classic funnel: grab attention, build interest, create desire, command action.";
      break;

    case "pas":
      headline = `${capT} is broken. Here's the fix.`;
      beats = [
        {
          name: "Problem",
          body: `${aud} waste hours every week on ${t.toLowerCase()} that doesn't move the needle.`,
        },
        {
          name: "Agitate",
          body: `Every week you delay, competitors pull ahead — and the gap is harder to close.`,
        },
        {
          name: "Solution",
          body: `${brand}turns ${t.toLowerCase()} into a repeatable system so you stop reacting.`,
        },
      ];
      cta = "Fix it now";
      rationale =
        "PAS hits pain first, then offers relief. Best when the problem is widely recognized.";
      break;

    case "bab":
      headline = `From chaos to clarity in ${t.toLowerCase()}`;
      beats = [
        {
          name: "Before",
          body: `Today: ${t.toLowerCase()} feels scattered. Reports don't agree. The team is tired.`,
        },
        {
          name: "After",
          body: `Soon: a clear weekly rhythm. Numbers you trust. Time back in your day.`,
        },
        {
          name: "Bridge",
          body: `${brand}gives you the bridge — the framework, the tools, and the playbook.`,
        },
      ];
      cta = "Cross the bridge";
      rationale = "Before/After/Bridge paints a vivid contrast and hands the reader the key.";
      break;

    case "storybrand":
      headline = `${capT}, finally told the right way`;
      beats = [
        {
          name: "Character",
          body: `You're the hero. Your goal: ${bn.toLowerCase()} without burning out.`,
        },
        {
          name: "Problem",
          body: `External: too many tools. Internal: feeling behind. Philosophical: ${t.toLowerCase()} shouldn't be this hard.`,
        },
        {
          name: "Guide",
          body: `${brand}We've walked this road. We know the traps. We built the map.`,
        },
        {
          name: "Plan",
          body: `Step 1: audit. Step 2: install the framework. Step 3: iterate weekly.`,
        },
        {
          name: "Call to Action",
          body: `Start with the free audit. No card. No demo gatekeeping.`,
        },
        {
          name: "Failure Aversion",
          body: `Without this, you'll spend another quarter firefighting — not leading.`,
        },
        { name: "Success", body: `With it, you become the team that ships while others plan.` },
      ];
      cta = "Get the free audit";
      rationale =
        "StoryBrand (Donald Miller): customer is hero, brand is guide, plan removes confusion, success is vivid.";
      break;

    case "hso":
      headline = `One idea that changed how we think about ${t.toLowerCase()}`;
      beats = [
        {
          name: "Hook",
          body: `Most ${aud} get ${t.toLowerCase()} backwards. They optimise noise instead of signal.`,
        },
        {
          name: "Story",
          body: `We tried it the wrong way for months. Then one shift unlocked everything: focus on the smallest repeatable win, not the biggest possible campaign.`,
        },
        {
          name: "Offer",
          body: `That's what ${brand}you get: the framework, the templates, and the first win in 7 days.`,
        },
      ];
      cta = "Get the offer";
      rationale =
        "Hook–Story–Offer (Brunson): grab attention, build belief with a story, close with a real offer.";
      break;

    case "4c":
      headline = `${capT}, without the fluff`;
      beats = [
        {
          name: "Clear",
          body: `${capT} should produce one number that matters: ${bn.toLowerCase()}.`,
        },
        { name: "Concise", body: `We say it in one sentence, then we back it up.` },
        {
          name: "Compelling",
          body: feat
            ? `Because ${feat.toLowerCase()}, you stop guessing and start shipping.`
            : `Because the framework is built-in, you stop guessing and start shipping.`,
        },
        { name: "Credible", body: `${aud} already use it to produce weekly wins.` },
      ];
      cta = "See for yourself";
      rationale = "4C: Clear, Concise, Compelling, Credible — the exec-friendly check.";
      break;

    case "7c":
      headline = `${capT}, done the way ${aud} should`;
      beats = [
        { name: "Clear", body: `${capT} is one decision at a time, in the right order.` },
        { name: "Concise", body: `No fluff. No 80-slide decks. One page that everyone reads.` },
        { name: "Compelling", body: `Built for the team that has to ship this quarter.` },
        { name: "Credible", body: `Used by ${aud} who've already produced results like yours.` },
        {
          name: "Current",
          body: `Updated for ${new Date().getFullYear()} — with the latest playbooks.`,
        },
        { name: "Consistent", body: `Same voice across email, ads, landing pages, and sales.` },
        { name: "Conversion-led", body: `Every line ends with: what does the reader do next?` },
      ];
      cta = "Start now";
      rationale = "7C: long-form landing page rubric — every line earns its place.";
      break;
  }

  return { framework, headline, beats, cta, rationale };
}

/* ────────────── Brand Voice Consistency Scorer ────────────── */

/**
 * Given a generated copy (framework copy or arbitrary text) and a brand
 * voice spec (an array of attributes with weights), score how well the
 * copy matches. Returns 0..100 plus per-attribute notes.
 *
 * This is a deterministic scorer — it uses keyword matching, length,
 * sentence patterns, and punctuation signals. Not an LLM, but gives
 * marketers a fast gut-check before they ship.
 */
export interface VoiceAttribute {
  id: string;
  label: string;
  weight: number;
}
export interface VoiceScore {
  total: number;
  perAttribute: Array<{ id: string; label: string; score: number; signals: string[] }>;
  warnings: string[];
  strengths: string[];
}

const VOICE_RULES: Record<string, { positive: RegExp[]; negative: RegExp[] }> = {
  bold: {
    positive: [/\b(never|always|now|today|breakthrough|unstoppable|raw|real)\b/i, /!/],
    negative: [/\b(maybe|perhaps|might|just|simply|kind of|sort of)\b/i],
  },
  warm: {
    positive: [/\b(you|your|we|us|together|friend|welcome|glad|love)\b/i],
    negative: [/\b(must|shall|required|mandatory)\b/i],
  },
  technical: {
    positive: [
      /\b(api|sdk|stack|workflow|architecture|pipeline|latency|throughput|schema|metric)\b/i,
    ],
    negative: [/\b(magic|easy|simple|just)\b/i],
  },
  playful: {
    positive: [/\b(hey|yo|fun|wild|silly|plot twist|steal this|nope|yep)\b/i, /😀|😂|🎯|🚀/],
    negative: [/\b(formal|kindly|sincerely|regards)\b/i],
  },
  concise: {
    positive: [], // handled in scorer
    negative: [],
  },
  urgent: {
    positive: [/\b(today|now|deadline|last chance|expires|only|limited|hurry)\b/i],
    negative: [/\b(whenever|someday|eventually|maybe)\b/i],
  },
  premium: {
    positive: [/\b(crafted|bespoke|signature|exclusive|elevated|curated)\b/i],
    negative: [/\b(cheap|budget|affordable|low[-\s]cost)\b/i],
  },
  honest: {
    positive: [/\b(honest|truth|real|actually|frankly|straight)\b/i],
    negative: [/\b(guaranteed|miracle|instant|effortless)\b/i],
  },
};

export function scoreVoice(text: string, voice: VoiceAttribute[]): VoiceScore {
  const t = text || "";
  const sentences = t
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const avgSentenceLen = sentences.length ? t.split(/\s+/).length / sentences.length : 0;
  const exclamCount = (t.match(/!/g) || []).length;

  const perAttribute: VoiceScore["perAttribute"] = [];
  const warnings: string[] = [];
  const strengths: string[] = [];

  for (const attr of voice) {
    const rule = VOICE_RULES[attr.id];
    let score = 50; // neutral
    const signals: string[] = [];

    if (rule) {
      const pos = rule.positive.reduce((n, r) => n + (t.match(r) || []).length, 0);
      const neg = rule.negative.reduce((n, r) => n + (t.match(r) || []).length, 0);
      if (pos) {
        score += Math.min(40, pos * 10);
        signals.push(`${pos} on-voice signal${pos > 1 ? "s" : ""}`);
      }
      if (neg) {
        score -= Math.min(40, neg * 12);
        signals.push(`${neg} off-voice signal${neg > 1 ? "s" : ""}`);
      }
    }

    if (attr.id === "concise") {
      // Reward 12–20 words/sentence, penalize >28 or <5
      if (avgSentenceLen >= 12 && avgSentenceLen <= 20) {
        score += 30;
        signals.push(`avg ${avgSentenceLen.toFixed(1)} words/sentence — ideal`);
      } else if (avgSentenceLen > 28) {
        score -= 25;
        warnings.push(
          `Sentences are long (avg ${avgSentenceLen.toFixed(1)} words). Aim for 12–20.`,
        );
        signals.push(`avg ${avgSentenceLen.toFixed(1)} words/sentence — too long`);
      } else if (avgSentenceLen < 5) {
        score -= 10;
        signals.push(`avg ${avgSentenceLen.toFixed(1)} words/sentence — choppy`);
      }
    }

    if (attr.id === "bold" || attr.id === "urgent") {
      if (exclamCount === 0 && attr.id === "bold") {
        score -= 10;
        signals.push("No exclamation marks — consider one for emphasis");
      }
      if (exclamCount > 5) {
        score -= 20;
        warnings.push("Too many exclamation marks dilute the message.");
      }
    }

    if (attr.id === "warm") {
      const youCount = (t.match(/\byou\b/gi) || []).length;
      const weCount = (t.match(/\bwe\b/gi) || []).length;
      if (youCount + weCount >= 3) {
        score += 15;
        signals.push(`${youCount + weCount} inclusive pronouns`);
      }
    }

    score = Math.max(0, Math.min(100, score));
    perAttribute.push({ id: attr.id, label: attr.label, score: Math.round(score), signals });

    if (score >= 75) strengths.push(`Strong on **${attr.label}** (${score}).`);
    if (score < 40) warnings.push(`Weak on **${attr.label}** (${score}) — adjust before shipping.`);
  }

  const total = Math.round(
    perAttribute.reduce(
      (s, a) => s + a.score * (voice.find((v) => v.id === a.id)?.weight || 1),
      0,
    ) /
      Math.max(
        1,
        voice.reduce((s, v) => s + v.weight, 0),
      ),
  );

  return { total, perAttribute, warnings, strengths };
}

/* ────────────── Persona fit scorer ────────────── */

/**
 * Given generated copy + a persona (with channels + pains), score how well
 * the copy matches the persona. Helps marketers avoid writing for the wrong
 * audience.
 */
export interface PersonaSignal {
  id: string;
  label: string;
  channels: string[];
  pains: string[];
  goals: string[];
}
export interface PersonaFit {
  total: number;
  channelMatch: number;
  painMatch: number;
  toneMatch: number;
  notes: string[];
}

export function scorePersonaFit(
  copy: string,
  persona: PersonaSignal,
  opts?: { voice?: VoiceAttribute[] },
): PersonaFit {
  const t = (copy || "").toLowerCase();
  const pains = persona.pains || [];
  const goals = persona.goals || [];
  const notes: string[] = [];

  const painHit = pains.reduce((n, p) => n + (p && t.includes(p.toLowerCase()) ? 1 : 0), 0);
  const goalHit = goals.reduce((n, g) => n + (g && t.includes(g.toLowerCase()) ? 1 : 0), 0);
  const painMatch = pains.length
    ? Math.min(100, (painHit / pains.length) * 100 + (goalHit / Math.max(1, goals.length)) * 40)
    : 50;
  if (painMatch < 30) notes.push("Copy doesn't echo persona pains or goals. Add at least one.");
  if (painMatch > 70) notes.push("Strong resonance with persona pains and goals.");

  const channelMatch = 60; // neutral by default (no channel signal in copy alone)
  notes.push(
    "Match this copy to a persona channel (" +
      (persona.channels.join(", ") || "—") +
      ") when distributing.",
  );

  const voice = opts?.voice || [];
  const toneMatch = voice.length ? Math.round(scoreVoice(copy, voice).total) : 65;

  const total = Math.round(painMatch * 0.55 + channelMatch * 0.15 + toneMatch * 0.3);
  return {
    total,
    channelMatch: Math.round(channelMatch),
    painMatch: Math.round(painMatch),
    toneMatch,
    notes,
  };
}
