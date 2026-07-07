/**
 * The Agency Swarm.
 *
 * Each agent is a deterministic generator that takes a structured input and
 * produces a structured output grounded in a specific frame. No LLM required —
 * the value is in the FRAMEWORK, not the prose. This means:
 *
 *   1. The marketer gets agency-grade structure every time
 *   2. Works offline (no API keys, no rate limits)
 *   3. Deterministic (the same inputs always yield the same shape)
 *   4. The marketer's own positioning/segment/persona data feeds the agents
 *
 * If the user later adds an LLM provider key, agents can be "augmented" to
 * draft prose from these structures. The structure is the deliverable.
 */

export type AgentId =
  "strategist" | "storyteller" | "copywriter" | "analyst" | "pr_brain" | "researcher";

export type AgentPersona = {
  id: AgentId;
  name: string;
  role: string;
  inspiredBy: string; // attribution to the thinker this agent channels
  emoji: string;
  color: string;
  oneLiner: string;
  inputs: string[]; // what this agent needs from the marketer
  outputs: string[]; // what it produces
  principles: string[]; // the rules it always follows
};

export const AGENTS: Record<AgentId, AgentPersona> = {
  strategist: {
    id: "strategist",
    name: "The Strategist",
    role: "Strategic planning grounded in Kotler's STP + 7Ps",
    inspiredBy: "Philip Kotler (Marketing Management) + Michael Porter",
    emoji: "♟️",
    color: "#1e40af",
    oneLiner: "Finds the smallest viable market and the wedge into it.",
    inputs: [
      "target audience description",
      "competitors",
      "your product/offer",
      "your business goal",
    ],
    outputs: [
      "STP analysis (segment → target → position)",
      "7Ps audit",
      "positioning statement",
      "strategic priorities",
    ],
    principles: [
      "Strategy is what you choose NOT to do.",
      "Segmentation is the foundation. Targeting is the choice. Positioning is the promise.",
      "Cost leadership, differentiation, or focus — pick one and commit.",
      "If you can't say it in one sentence, you don't have a strategy.",
    ],
  },
  storyteller: {
    id: "storyteller",
    name: "The Storyteller",
    role: "Brand narrative + Seth Godin's tribe storytelling",
    inspiredBy: "Seth Godin (This Is Marketing, All Marketers Are Liars, Tribes)",
    emoji: "🔥",
    color: "#dc2626",
    oneLiner: "Builds the story people want to be part of.",
    inputs: ["your brand", "the change you want to make", "your audience's worldview"],
    outputs: [
      "brand narrative arc",
      "three story hooks",
      "tribe definition",
      "the smallest true thing",
    ],
    principles: [
      "People don't buy goods and services. They buy stories and belonging.",
      "Remarkable is the only marketing that spreads.",
      "Find the smallest viable audience. Lead them first.",
      "All marketers are storytellers — and the story has to be true.",
    ],
  },
  copywriter: {
    id: "copywriter",
    name: "The Copywriter",
    role: "Words that move people to act — Eugene Schwartz / Ogilvy / Halbert lineage",
    inspiredBy: "Eugene Schwartz (Breakthrough Advertising) + Gary Halbert + David Ogilvy",
    emoji: "✒️",
    color: "var(--accent)",
    oneLiner: "Writes the headline, the offer, the call to action.",
    inputs: [
      "your positioning",
      "your audience awareness level",
      "the channel",
      "the desired action",
    ],
    outputs: ["5 headline tiers", "the offer in 3 framings", "the CTA", "the email body"],
    principles: [
      "Awareness stages: most aware → solution aware → problem aware → completely unaware. Match the message.",
      "The headline is the only thing most people will read. Make it count.",
      "Specifics sell. 'Lose 7 pounds in 14 days' beats 'lose weight fast'.",
      "The offer is the offer. Copy is just the bridge.",
    ],
  },
  analyst: {
    id: "analyst",
    name: "The Analyst",
    role: "Numbers, funnels, and the metrics that matter — turn data into decisions",
    inspiredBy: "Avinash Kaushik (Web Analytics 2.0) + HBR measurement culture",
    emoji: "📊",
    color: "#0891b2",
    oneLiner: "Turns noise into the one number that changes your week.",
    inputs: ["a campaign or experiment", "your KPIs", "time window"],
    outputs: [
      "the one metric to watch",
      "diagnostic questions",
      "next-step hypothesis",
      "what would change my mind",
    ],
    principles: [
      "Measure the thing that moves the business, not what's easy to count.",
      "Every chart deserves a 'so what?' sentence above it.",
      "Decide in advance what the result would have to be to change your mind.",
      "Statistical significance is a tool, not a verdict.",
    ],
  },
  pr_brain: {
    id: "pr_brain",
    name: "The PR Brain",
    role: "Earned media and ideas worth spreading",
    inspiredBy: "Ryan Holiday (Trust Me I'm Lying) + PR tradition",
    emoji: "📣",
    color: "#ea580c",
    oneLiner: "Finds the angle journalists will actually cover.",
    inputs: ["your news/announcement", "your category", "publication targets"],
    outputs: ["the news hook", "3 journalist angles", "pitch subject lines", "the 'why now'"],
    principles: [
      "Journalists don't owe you coverage. Earn it with genuine news.",
      "Lead with the new fact, not the company name.",
      "The pitch is the headline of the email. Make it the story.",
      "If nobody will be embarrassed, the idea isn't bold enough.",
    ],
  },
  researcher: {
    id: "researcher",
    name: "The Researcher",
    role: "Customer truth — jobs to be done, voice of customer",
    inspiredBy: "Clayton Christensen (Jobs to Be Done) + qualitative research tradition",
    emoji: "🔬",
    color: "#16a34a",
    oneLiner: "Finds out what people actually hire your product to do.",
    inputs: [
      "your product category",
      "an existing customer (or hypothetical)",
      "what they struggle with",
    ],
    outputs: [
      "the job they're hiring for",
      "the emotional job",
      "the social job",
      "interview questions",
    ],
    principles: [
      "People don't want a quarter-inch drill. They want a quarter-inch hole.",
      "Customers hire products to do jobs — emotional, functional, social.",
      "Listen for what they DO, not what they say. Behavior is the truth.",
      "The best research question is one you're afraid to ask.",
    ],
  },
};

export const AGENT_LIST = Object.values(AGENTS);

export type AgentRunInput = Record<string, any>;
export type AgentRunOutput = {
  summary: string;
  sections: { title: string; body: string; bullets?: string[] }[];
  next_steps?: string[];
};

/**
 * Run an agent. Inputs are agent-specific; outputs are always structured the
 * same way so the UI can render them consistently.
 *
 * NOTE: This is FRAMEWORK-DRIVEN, not LLM-driven. The output is a
 * structured framework the marketer fills in / learns from — not prose.
 */
export async function runAgent(agent: AgentId, input: AgentRunInput): Promise<AgentRunOutput> {
  const fn = runners[agent];
  return fn(input);
}

const runners: Record<AgentId, (input: Record<string, unknown>) => AgentRunOutput> = {
  strategist: runStrategist,
  storyteller: runStoryteller,
  copywriter: runCopywriter,
  analyst: runAnalyst,
  pr_brain: runPrBrain,
  researcher: runResearcher,
};

// ─────────────────────────────────────────────────────────────────────
// Strategist (Kotler STP + 7 Ps)
// ─────────────────────────────────────────────────────────────────────
function runStrategist(input: Record<string, unknown>): AgentRunOutput {
  const { target = "", competitors = "", offer = "", goal = "" } = input;
  return {
    summary: `Strategic frame for "${offer || "your offer"}" aimed at "${target || "your audience"}".`,
    sections: [
      {
        title: "1. Segmentation — slice the market",
        body: "A segment is a group of people with the same job-to-be-done who respond similarly to your message. Don't start with demographics — start with needs.",
        bullets: [
          "Need-based: what problem are they solving?",
          "Behavior-based: how do they currently solve it?",
          "Identity-based: how does the solution fit who they want to be?",
          "Define 3–5 candidate segments; size each; rank by winnability.",
        ],
      },
      {
        title: "2. Targeting — choose your wedge",
        body: "Pick ONE primary segment to win first. The biggest temptation in marketing is to be for everyone. Don't.",
        bullets: [
          "Mass marketing: one offer for everyone (rarely works; needs huge budget).",
          "Differentiated: different offer per segment (costs more; needed if segments don't overlap).",
          "Niche/focused: one offer, one segment, deeply (best for most businesses).",
          "Micromarketing: hyper-local or hyper-personal (community-defining).",
        ],
      },
      {
        title: "3. Positioning — write the sentence",
        body: "Positioning is the promise you make AND the choice you give up. The best positioning is a trade the customer gets to make.",
        bullets: [
          "Frame of reference: who else does this customer compare you to?",
          "Points of difference: 1–3 things only you deliver.",
          "Reasons to believe: proof the customer will accept.",
          "One-line test: 'For [target] who [need], [brand] is the [category] that [promise] because [proof].'",
        ],
      },
      {
        title: "4. The 7 Ps — your tactical checklist",
        body: "Walk each P and ask: does this support the position, or undermine it?",
        bullets: [
          "Product: features → benefits → experience. Which job does this win?",
          "Price: signal, not just number. Too cheap = suspect. Too high = unsold.",
          "Place: where does the customer expect to find you?",
          "Promotion: the story, not the spend. Most marketers over-promote.",
          "People: every touchpoint is the brand. Hire for character, train for skill.",
          "Process: can the customer succeed in 3 minutes? If not, they won't.",
          "Physical evidence: receipts, packaging, screenshots — proof the deal is real.",
        ],
      },
      {
        title: "5. The strategic priorities (3, not 10)",
        body: "Three priorities. If everything is priority, nothing is. Each priority must move a metric the CEO cares about.",
        bullets: [
          "Priority 1 (this quarter): the one that makes everything else easier.",
          "Priority 2 (this quarter): the one that compounds.",
          "Priority 3 (this quarter): the one that defends the position.",
        ],
      },
    ],
    next_steps: [
      `Map "${competitors || "your competitors"}" against the 7Ps and find the gap nobody else owns.`,
      `Validate the wedge by talking to 5 customers in the target segment.`,
      `Write the positioning sentence in plain language; test it on a stranger.`,
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────
// Storyteller (Seth Godin)
// ─────────────────────────────────────────────────────────────────────
function runStoryteller(input: Record<string, unknown>): AgentRunOutput {
  const { brand = "", change = "", audience = "" } = input;
  return {
    summary: `Story frame for "${brand || "your brand"}" — the change you're leading.`,
    sections: [
      {
        title: "The smallest viable audience",
        body: "If your story is for everyone, it's for no one. Find the 100 people who would recognize themselves immediately. Lead them first.",
        bullets: [
          `Who is "${audience || "your audience"}" when nobody is watching?`,
          "What do they believe that almost no one else believes?",
          "What language do they use among themselves?",
          "Whose permission do they need, and from whom do they seek it?",
        ],
      },
      {
        title: "The narrative arc — three stories worth telling",
        body: "Three stories. Pick one for the next campaign. The right story changes the conversation.",
        bullets: [
          "Change-of-heart story: 'I used to think X. Now I know Y.'",
          "Origin story: 'Why we built this, and the day we almost didn't.'",
          "Tribe story: 'A movement of people like us, doing the thing we said we'd do.'",
        ],
      },
      {
        title: "The remarkable test",
        body: "Remarkable = worth making a remark about. Apply the IM ME checklist (Godin):",
        bullets: [
          "Incongruous — surprise.",
          "Minimal — one idea, not ten.",
          "Memorable — fits in a sentence.",
          "Endorsed — a real person would put their name on it.",
          "Emotional — taps a feeling, not a feature.",
          "Stories — has a character, a conflict, a resolution.",
        ],
      },
      {
        title: "The smallest true thing",
        body: "Every brand has a 'smallest true thing' — the line you could print on a t-shirt and the team would still wear it next year. Find it.",
        bullets: [
          `For "${brand || "your brand"}" leading the change of "${change || "[your change]"}", what is the smallest true thing?`,
          "If you can't state it, you don't know what you're selling.",
        ],
      },
    ],
    next_steps: [
      "Write the three stories as 100-word vignettes. Pick the strongest.",
      "Find 3 customers whose stories confirm the narrative; ask permission to use them.",
      "Post the smallest true thing on the inside of every team notebook.",
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────
// Copywriter (Schwartz levels of awareness + Halbert/Ogilvy)
// ─────────────────────────────────────────────────────────────────────
function runCopywriter(input: Record<string, unknown>): AgentRunOutput {
  const {
    positioning = "",
    channel = "email",
    awareness = "solution_aware",
    action = "buy",
  } = input;
  return {
    summary: `Copy brief for ${channel} — audience at the "${awareness}" stage — desired action: "${action}".`,
    sections: [
      {
        title: "Level of awareness (Eugene Schwartz)",
        body: "Your copy must match where the reader is, not where you wish they were.",
        bullets: [
          "Most aware: already wants it. Just give them the offer and the deadline.",
          "Product-aware: knows you exist. Talk mechanism, proof, comparison.",
          "Solution-aware: knows the problem. Identify it vividly, then introduce the category.",
          "Problem-aware: feels the pain. Name it, agitate, then promise a category of solution.",
          "Completely unaware: needs a status-quo story first. Don't pitch yet.",
        ],
      },
      {
        title: "Headline tiers (write 5)",
        body: "The headline is 80% of the work. Generate five flavors and pick the most concrete.",
        bullets: [
          "Curiosity: an open loop that promises a payoff.",
          "Specificity: a number, a time, a thing.",
          "Identity: 'For the person who...' — they see themselves.",
          "Controversy: a frame most people would disagree with (in your audience).",
          "Promise: a single sentence of the outcome, in their words.",
        ],
      },
      {
        title: "The offer (in 3 framings)",
        body: "The offer is everything. The copy is the bridge to the offer.",
        bullets: [
          "The bundle: what's included (and what's intentionally NOT included).",
          "The guarantee: how the risk is removed.",
          "The urgency: the reason to act now that's also true.",
        ],
      },
      {
        title: "The CTA — one job, one button",
        body: "One CTA per page. If you can't say what you want the reader to do in five words, you don't know yet.",
        bullets: [
          "Start with a verb: Get, Book, Start, Try, Send, Reserve.",
          "Make the value visible: 'Get my free trial', not 'Submit'.",
          "Remove choices that don't move the goal.",
        ],
      },
      {
        title: "Sample first draft — ${channel}",
        body: `Subject / Hook:   _[your headline]_\n\nOpen:    _[the pain or the promise — match ${awareness}]_\n\nBody:    _[mechanism → proof → objection → close]_\n\nCTA:     _[${action}]_`,
      },
    ],
    next_steps: [
      `Write 5 headlines (one from each tier) before you write a single body sentence.`,
      "Cut every adverb. Cut every adjective that isn't load-bearing.",
      "Read it aloud. If you wouldn't say it to a friend, rewrite.",
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────
// Analyst (Kaushik + HBR)
// ─────────────────────────────────────────────────────────────────────
function runAnalyst(input: Record<string, unknown>): AgentRunOutput {
  const { campaign = "this campaign", kpi = "conversions", window = "last 7 days" } = input;
  return {
    summary: `Analysis plan for "${campaign}" — KPI "${kpi}" — window ${window}.`,
    sections: [
      {
        title: "The one metric",
        body: "Every campaign has one metric that, if it moves, changes everything else. Find it before you do anything else.",
        bullets: [
          `What single number, if it doubled, would make this campaign a success? (Hint: it's rarely traffic.)`,
          "If you can't pick one, you haven't decided what success is yet.",
        ],
      },
      {
        title: "Diagnostic questions",
        body: "The funnel has stages. A number moving wrong tells you which stage to look at.",
        bullets: [
          "Acquisition: are we reaching the right people, or just more people?",
          "Activation: do they take the first meaningful action?",
          "Retention: do they come back for a second session?",
          "Revenue: do they pay, and do they pay again?",
          "Referral: do they tell anyone else?",
        ],
      },
      {
        title: "Hypothesis + experiment",
        body: "If the number is bad, the next thing to do is NOT to spend more — it's to run the smallest experiment that could move it.",
        bullets: [
          "State the hypothesis as 'If we change X, then Y will happen because Z.'",
          "Pick the smallest test (one email, one page, one channel).",
          "Decide the success threshold BEFORE you look at the data.",
        ],
      },
      {
        title: "What would change my mind",
        body: "Pre-commit to the conditions under which you'd call it. Otherwise you'll move the goalposts.",
        bullets: [
          "If [metric] moves [X%] over [window], we double down.",
          "If [metric] doesn't move, we kill it or change the offer.",
          "If [counter-metric] moves the wrong way, we stop immediately.",
        ],
      },
    ],
    next_steps: [
      `Look at the last 3 changes to "${campaign}". Which one moved the number? Which moved a vanity number?`,
      `Build a 3-line dashboard: ${kpi}, supporting metric, counter-metric.`,
      "Schedule a 15-minute review at the end of every week. Same time. Same agenda.",
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────
// PR Brain (Holiday + classic PR)
// ─────────────────────────────────────────────────────────────────────
function runPrBrain(input: Record<string, unknown>): AgentRunOutput {
  const { news = "", category = "your category", targets = "industry publications" } = input;
  return {
    summary: `PR brief for the announcement: "${news || "[your news]"}".`,
    sections: [
      {
        title: "Is it actually news?",
        body: "Journalists owe you nothing. The first question to ask honestly: would a disinterested reader learn anything new?",
        bullets: [
          "New fact (not a new claim about an old fact).",
          "New scale (a number 10x bigger than what was known).",
          "New conflict (a tension that hasn't been resolved publicly).",
          "New character (someone whose perspective hasn't been heard).",
        ],
      },
      {
        title: "Three journalist angles",
        body: "Three angles means three different headlines, three different stories, three different outlets. The news is one thing; the angle is the entry.",
        bullets: [
          "Industry angle: how does this change ${category}?",
          "Human angle: whose life does this change first?",
          "Trend angle: what does this say about the next 12 months?",
        ],
      },
      {
        title: "Pitch subject lines (3)",
        body: "The subject line is the pitch. Write it as the headline of the article you want them to write.",
        bullets: [
          "Subject 1: 'How [company] just [made X happen] — and what it means for [target]'",
          "Subject 2: 'The [category] story nobody's covering yet'",
          "Subject 3: 'Quick question for [journalist]' (use only if you can ask a real one).",
        ],
      },
      {
        title: "The 'why now'",
        body: "Timeliness is half the value. If you can't answer 'why this week', wait until you can.",
        bullets: [
          "External event you can attach to.",
          "Internal milestone with a number.",
          "A genuine controversy you can comment on.",
        ],
      },
    ],
    next_steps: [
      `Pick the strongest of the three angles; build a one-page press kit.`,
      `Find 10 journalists at "${targets}" who wrote about this category in the last 30 days.`,
      "Send the pitch on Tuesday or Wednesday, between 9 and 11 in their time zone.",
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────
// Researcher (Christensen JTBD)
// ─────────────────────────────────────────────────────────────────────
function runResearcher(input: Record<string, unknown>): AgentRunOutput {
  const { product = "your product", customer = "your customer", struggle = "" } = input;
  return {
    summary: `Customer-truth brief for "${customer}" and "${product}".`,
    sections: [
      {
        title: "The job they hired you to do",
        body: "People don't buy products. They 'hire' products to do a job. Find the job before you improve the product.",
        bullets: [
          "Functional job: what is the literal outcome they want?",
          "Emotional job: how do they want to feel when it's done?",
          "Social job: how do they want others to see them for choosing this?",
        ],
      },
      {
        title: "The forces of progress (JTBD)",
        body: "A customer switches to a new solution when the forces pushing them past the status quo outweigh the forces holding them back.",
        bullets: [
          "Push of the current situation: what's frustrating them right now?",
          "Pull of the new solution: what does the new life look like?",
          "Anxiety of the new: what are they afraid will go wrong if they switch?",
          "Habit of the present: what's comfortable about doing nothing?",
        ],
      },
      {
        title: "Five questions to ask (in a 15-min interview)",
        body: "These five questions, asked well, will tell you more than a 50-question survey.",
        bullets: [
          "Tell me about the last time you [did the job]. Walk me through it.",
          "What were you doing right before that?",
          "What did you do after?",
          "How did that make you feel?",
          "If a magic wand could fix one thing about it, what would it be?",
        ],
      },
      {
        title: "Signal vs noise",
        body: "Customers lie about what they want. Watch what they DO.",
        bullets: [
          "Behavior > stated preference.",
          "Time spent > words said.",
          "Money paid > engagement clicked.",
          "Return visits > first-visit praise.",
        ],
      },
    ],
    next_steps: [
      `Find 5 people who switched to "${product}" in the last 30 days. Ask them Q1.`,
      `Find 5 people who almost switched but didn't. Ask Q3 and Q4.`,
      "Write a one-page 'Day in the Life' of the customer and share with the team.",
    ],
  };
}
