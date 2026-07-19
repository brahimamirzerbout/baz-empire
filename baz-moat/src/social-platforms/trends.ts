/**
 * Trend history — the temporal layer of the social-platforms engine.
 *
 * Every platform has a trend lineage: origin → adopters → peak →
 * abandoned/forgotten → successor, across every domain (format, hook, audio,
 * hashtag, creator-archetype, content-mode). This is Schwartz market-
 * sophistication mapped to TREND cycles: a trend at "peak" is already
 * saturating; the lever is to ride "emerging/rising" early (Gary V) and never
 * ship an "abandoned/forgotten" one. Knowing the successor is the moat.
 *
 * Provenance discipline (strict):
 *   [fact]        — widely reported / platform-announced (launches, named
 *                   originators of documented viral moments).
 *   [assumption]  — my inference on dates/adopters/lifecycle stage — flagged
 *                   for the orchestrator's expert inspect (60+ brands).
 *   [composite]  — a lifecycle-stage estimate, not a hard date.
 *
 * This registry is a SEED. It carries the well-documented trends honestly and
 * flags the gaps; the orchestrator's field expertise fills the long tail. Do not
 * treat an [assumption] date as [fact].
 */

import type { SocialPlatform } from "./types.js";

/** The domains a trend lives in. "Everything in each domain" = these axes. */
export type TrendDomain =
  | "format" // Reel vs Carousel vs thread vs pin — the shape of the post
  | "hook" // the opening pattern (POV, "tell me without telling me", demure)
  | "audio" // trending sounds / music
  | "hashtag" // tag-driven discovery waves
  | "creator-archetype" // the persona the platform rewards (influencer → creator → UGC)
  | "content-mode"; // the genre (vlog, GRWM, build-in-public, faceless-AI)

/** One trend in a platform's history. */
export interface Trend {
  id: string;
  platform: SocialPlatform;
  domain: TrendDomain;
  name: string;
  /** Where it started — originator + era. */
  origin: { who?: string; when: string; note: string };
  /** Notable adopters that rode it (creators / brands / archetypes). */
  adopters: string[];
  /** When it saturated / peaked. */
  peak: string;
  /** When + why it was abandoned or forgotten. */
  abandoned: { when: string; why: string };
  /** The trend that replaced it. */
  successor: string;
  status: import("./types.js").TrendStatus;
  provenance: string;
}

/* ------------------------------------------------------------------ *
 * TikTok — interest graph, fastest trend cycle of any platform.
 * Registry ordered NEWEST-FIRST (index 0 = most recent).
 * ------------------------------------------------------------------ */
const TIKTOK_TRENDS: Trend[] = [
  {
    id: "tt-longform",
    platform: "tiktok", domain: "content-mode", name: "Long-form (10–30min)",
    origin: { when: "2023–2024", note: "TikTok pushed 10–30min uploads to chase YouTube's watch-time ad revenue." },
    adopters: ["educational creators", "storytellers", "media brands"],
    peak: "[composite] rising, not yet peak",
    abandoned: { when: "—", why: "live; not abandoned" },
    successor: "TBD — the platform is testing whether strangers watch 30min vertical",
    status: "rising", provenance: "[fact] TikTok long-form push 2023–24; [composite] lifecycle stage",
  },
  {
    id: "tt-carousel",
    platform: "tiktok", domain: "format", name: "Photo carousels",
    origin: { when: "2023", note: "TikTok added native photo carousels; the For You test applied to stills." },
    adopters: ["lifestyle creators", "listicle-style brands"],
    peak: "[composite] 2024 peak window",
    abandoned: { when: "—", why: "live" },
    successor: "TBD",
    status: "peak", provenance: "[fact] TikTok photo carousels 2023; [composite] stage",
  },
  {
    id: "tt-demure",
    platform: "tiktok", domain: "hook", name: "\"Very demure, very mindful\"",
    origin: { who: "Jools Lebron", when: "Aug 2024", note: "Workplace-respect hook; exploded in days." },
    adopters: ["brands co-opting it within a week", "broad creator participation"],
    peak: "Aug–Sep 2024",
    abandoned: { when: "Sep 2024", why: "Brand co-option saturated it inside ~3 weeks; audience fatigue + the meme aged out." },
    successor: "the next micro-hook (weekly cycle)",
    status: "forgotten", provenance: "[fact] Jools Lebron origin Aug 2024, widely reported; [composite] abandonment window",
  },
  {
    id: "tt-grwm",
    platform: "tiktok", domain: "content-mode", name: "Get Ready With Me (GRWM)",
    origin: { when: "~2022", note: "Migrated from YouTube; native to vertical + sound-on." },
    adopters: ["beauty creators", "lifestyle", "founders doing 'GRWM while I build'"],
    peak: "[composite] 2022–2023",
    abandoned: { when: "—", why: "live but saturated; still works, lower novelty" },
    successor: "founder-led 'build with me' variant",
    status: "declining", provenance: "[assumption] dates; [composite] stage",
  },
  {
    id: "tt-seashanty",
    platform: "tiktok", domain: "audio", name: "Sea shanties",
    origin: { who: "Nathan Evans (postman)", when: "Jan 2021", note: "Solo voice → duet chain; pure audio trend." },
    adopters: ["mass duet participation", "brands briefly"],
    peak: "Jan–Feb 2021",
    abandoned: { when: "Feb–Mar 2021", why: "Audio trends cycle in weeks; saturation + the moment passed." },
    successor: "next trending-sound wave",
    status: "forgotten", provenance: "[fact] Nathan Evans Jan 2021, widely reported; [composite] window",
  },
  {
    id: "tt-pov",
    platform: "tiktok", domain: "hook", name: "POV",
    origin: { when: "~2020", note: "First-person scenario hook; lowered the production bar." },
    adopters: ["broad creator base", "brands adapting POV ads"],
    peak: "2020–2021",
    abandoned: { when: "~2022", why: "Oversaturated; the format became a cliché, algorithm shifted to storytelling." },
    successor: "storytelling / narrative hooks",
    status: "abandoned", provenance: "[assumption] dates; [composite] stage",
  },
  {
    id: "tt-dance",
    platform: "tiktok", domain: "hook", name: "Dance challenges",
    origin: { who: "Jalaiah Harmon (Renegade, uncredited initially)", when: "Oct 2019", note: "Choreography → mass replication; the format that defined early TikTok." },
    adopters: ["Charli D'Amelio", "the Hype House", "brands sponsoring dances"],
    peak: "2019–2020",
    abandoned: { when: "~2021", why: "Audience fatigue + credit controversies + algorithm shift to storytelling/education." },
    successor: "POV hooks",
    status: "abandoned", provenance: "[fact] Renegade/Jalaiah Harmon Oct 2019, widely reported; [composite] abandonment window",
  },
];

/* ------------------------------------------------------------------ *
 * Instagram — social+interest hybrid; trends swing between aesthetic
 * polish and raw authenticity.
 * ------------------------------------------------------------------ */
const INSTAGRAM_TRENDS: Trend[] = [
  {
    id: "ig-reels",
    platform: "instagram", domain: "format", name: "Reels",
    origin: { when: "Aug 2020", note: "Launched to compete with TikTok; became the reach engine." },
    adopters: ["near-universal creator adoption", "brands pivoting from static"],
    peak: "[composite] peak — the current reach engine",
    abandoned: { when: "—", why: "live; the format IS the platform's reach layer" },
    successor: "TBD — Reels is the floor, not a trend to abandon",
    status: "peak", provenance: "[fact] Reels launched Aug 2020; [composite] stage",
  },
  {
    id: "ig-carousel-saves",
    platform: "instagram", domain: "content-mode", name: "Carousel-for-saves",
    origin: { when: "~2022", note: "Saves emerged as the top feed signal; carousels maximize them." },
    adopters: ["educators", "B2B-on-IG", "listicle brands"],
    peak: "[composite] peak",
    abandoned: { when: "—", why: "live" },
    successor: "TBD",
    status: "peak", provenance: "[assumption] dates; [composite] stage",
  },
  {
    id: "ig-photodump",
    platform: "instagram", domain: "content-mode", name: "Photo dumps",
    origin: { when: "~2021", note: "Anti-aesthetic backlash to the curated grid; raw multi-photo posts." },
    adopters: ["Gen Z", "celebrities", "brands loosening up"],
    peak: "2021–2022",
    abandoned: { when: "~2023", why: "Authenticity became default; the 'dump' lost its edge as a statement." },
    successor: "carousel-for-saves (utility over vibe)",
    status: "declining", provenance: "[assumption] dates; [composite] stage",
  },
  {
    id: "ig-igtv",
    platform: "instagram", domain: "format", name: "IGTV",
    origin: { when: "Jun 2018", note: "Long-form vertical video hub; positioned vs YouTube." },
    adopters: ["early creator push, low adoption"],
    peak: "2018–2019 (never truly peaked)",
    abandoned: { when: "2021", why: "Discontinued — users didn't come to IG for long-form; Reels ate it." },
    successor: "Reels",
    status: "forgotten", provenance: "[fact] IGTV launched Jun 2018, discontinued 2021; [composite] stage",
  },
  {
    id: "ig-aesthetic-grid",
    platform: "instagram", domain: "content-mode", name: "Curated aesthetic grid",
    origin: { when: "~2016–2018", note: "The flawless 3×N grid as a portfolio; influencer-era polish." },
    adopters: ["influencers", "lifestyle brands", "theme accounts"],
    peak: "2018–2019",
    abandoned: { when: "~2021", why: "Replaced by authenticity / photo dumps; grid-perfection read as try-hard." },
    successor: "photo dumps / lo-fi authenticity",
    status: "abandoned", provenance: "[assumption] dates; [composite] stage",
  },
  {
    id: "ig-boomerang",
    platform: "instagram", domain: "format", name: "Boomerang",
    origin: { when: "2016", note: "One-second loop GIF; native IG novelty." },
    adopters: ["mass casual adoption"],
    peak: "2016–2018",
    abandoned: { when: "~2019", why: "Novelty wore off; Reels offered richer motion." },
    successor: "Reels",
    status: "forgotten", provenance: "[fact] Boomerang 2016; [composite] stage",
  },
];

/* ------------------------------------------------------------------ *
 * YouTube — search + recommendations; the slowest, deepest trend cycles.
 * ------------------------------------------------------------------ */
const YOUTUBE_TRENDS: Trend[] = [
  {
    id: "yt-shorts",
    platform: "youtube", domain: "format", name: "Shorts",
    origin: { when: "Mar 2021 (US launch Sep 2021)", note: "YT's vertical answer to TikTok; now a discovery surface." },
    adopters: ["near-universal", "creators repurposing TikTok"],
    peak: "[composite] peak — the reach surface alongside long-form",
    abandoned: { when: "—", why: "live" },
    successor: "TBD",
    status: "peak", provenance: "[fact] Shorts US Sep 2021; [composite] stage",
  },
  {
    id: "yt-faceless-ai",
    platform: "youtube", domain: "content-mode", name: "Faceless AI-narrated channels",
    origin: { when: "~2023", note: "AI VO + stock/stock-style footage; low-cost high-volume." },
    adopters: ["volume operators", "cashflow channel networks"],
    peak: "[composite] rising–peak 2024",
    abandoned: { when: "—", why: "live but trust/quality pressure rising" },
    successor: "creator-led authority (the counter-trend)",
    status: "rising", provenance: "[assumption] dates; [composite] stage",
  },
  {
    id: "yt-mrbeast-stunt",
    platform: "youtube", domain: "content-mode", name: "Stunt/philanthropy spectacle",
    origin: { who: "MrBeast (Jimmy Donaldson)", when: "~2018", note: "Escalating stakes + giveaways; redefined the recommendation CTR bar." },
    adopters: ["the entire creator economy chasing the format"],
    peak: "2020+",
    abandoned: { when: "—", why: "live — the dominant long-form mode" },
    successor: "TBD — the bar keeps rising",
    status: "peak", provenance: "[fact] MrBeast origin widely reported; [composite] stage",
  },
  {
    id: "yt-vlog",
    platform: "youtube", domain: "content-mode", name: "Daily/personal vlog",
    origin: { when: "~2008–2012", note: "Personal-life doc format; the original YouTube genre." },
    adopters: ["early creator class", "lifestyle vloggers"],
    peak: "2010s",
    abandoned: { when: "~2020s", why: "Attention shifted to short-form + spectacle; raw vlogs lost CTR." },
    successor: "Shorts + high-production long-form",
    status: "declining", provenance: "[assumption] dates; [composite] stage",
  },
];

/* ------------------------------------------------------------------ *
 * LinkedIn — professional graph; trends swing between insight and cringe.
 * ------------------------------------------------------------------ */
const LINKEDIN_TRENDS: Trend[] = [
  {
    id: "li-ai-generic",
    platform: "linkedin", domain: "content-mode", name: "AI-generated generic posts",
    origin: { when: "2023", note: "LLM-written 'insight' posts flooded the feed post-ChatGPT." },
    adopters: ["mass low-effort adoption", "growth-hackers"],
    peak: "2023–2024",
    abandoned: { when: "—", why: "live but trust collapsed — audiences flag AI-slop, engagement falling" },
    successor: "personal-voice / documented experience",
    status: "declining", provenance: "[assumption] dates; [composite] stage",
  },
  {
    id: "li-build-public",
    platform: "linkedin", domain: "content-mode", name: "Build in public",
    origin: { when: "~2021", note: "Openly sharing metrics/learnings as a founder." },
    adopters: ["founders", "indie hackers", "VCs"],
    peak: "2021–2023",
    abandoned: { when: "—", why: "live but saturated — every founder does it, novelty diluted" },
    successor: "specific-case teardowns over generalized 'building' posts",
    status: "declining", provenance: "[assumption] dates; [composite] stage",
  },
  {
    id: "li-document-carousel",
    platform: "linkedin", domain: "format", name: "Document (PDF) carousels",
    origin: { when: "~2020", note: "PDF swipe decks; maximize dwell time + the 'see more' gate." },
    adopters: ["B2B marketers", "consultants", "educators"],
    peak: "[composite] peak — the dwell-time format",
    abandoned: { when: "—", why: "live" },
    successor: "TBD",
    status: "peak", provenance: "[assumption] dates; [composite] stage",
  },
  {
    id: "li-poll",
    platform: "linkedin", domain: "format", name: "Polls",
    origin: { when: "~2021", note: "Low-friction engagement; cheap reach." },
    adopters: ["mass adoption — every B2B account"],
    peak: "2021",
    abandoned: { when: "~2022", why: "Overused engagement-bait; audience fatigue; LinkedIn de-weighted." },
    successor: "text + a real question (comment-bait)",
    status: "abandoned", provenance: "[assumption] dates; [composite] stage",
  },
  {
    id: "li-broetry",
    platform: "linkedin", domain: "hook", name: "\"Broetry\" (one-line-per-line poems)",
    origin: { when: "~2019", note: "Line-break 'poem' hooks ('I quit. / My job. / Best decision...'); high dwell, low substance." },
    adopters: ["growth-hacker influencers", "fake-founder accounts"],
    peak: "2019–2021",
    abandoned: { when: "~2021", why: "Ridiculed as cringe; LinkedIn + audience de-weighted the style." },
    successor: "document carousels (substance over cadence)",
    status: "abandoned", provenance: "[fact] 'broetry' widely documented ~2019–21; [composite] stage",
  },
];

/* ------------------------------------------------------------------ *
 * X — velocity + replies; trends are conversational formats.
 * ------------------------------------------------------------------ */
const X_TRENDS: Trend[] = [
  {
    id: "x-longform",
    platform: "x", domain: "format", name: "Long-form posts (Premium)",
    origin: { when: "2023", note: "X Premium unlocked long posts; pushed depth over the 280 limit." },
    adopters: ["creator/analyst class", "newsletter-style posters"],
    peak: "[composite] rising",
    abandoned: { when: "—", why: "live" },
    successor: "TBD",
    status: "rising", provenance: "[fact] X Premium long-form 2023; [composite] stage",
  },
  {
    id: "x-spaces",
    platform: "x", domain: "format", name: "Spaces (live audio)",
    origin: { when: "2021", note: "Clubhouse-clone live audio rooms." },
    adopters: ["tech/finance communities", "AMA hosts"],
    peak: "2021–2022",
    abandoned: { when: "~2023", why: "Audio-hype faded; usage dropped; niche-only now." },
    successor: "long-form text posts (depth without scheduling a room)",
    status: "declining", provenance: "[fact] Spaces 2021; [composite] stage",
  },
  {
    id: "x-ratio",
    platform: "x", domain: "hook", name: "The 'ratio'",
    origin: { when: "~2020", note: "Quote-reply dunk where the reply out-engages the original." },
    adopters: ["political/comedy posters"],
    peak: "2020–2022",
    abandoned: { when: "~2023", why: "Became a cliché; engagement-bait; lost bite." },
    successor: "quote-with-take (added value over pure dunk)",
    status: "forgotten", provenance: "[assumption] dates; [composite] stage",
  },
  {
    id: "x-thread",
    platform: "x", domain: "format", name: "Hashtag threads (1/🧵)",
    origin: { when: "~2017", note: "Numbered threads for long-form; the depth workaround pre-Premium." },
    adopters: ["educators", "marketers", "analysts"],
    peak: "2018–2020",
    abandoned: { when: "~2023", why: "Long-form posts replaced the thread hack; audiences skim threads less." },
    successor: "long-form posts",
    status: "declining", provenance: "[fact] threads widely documented ~2017+; [composite] stage",
  },
];

/* ------------------------------------------------------------------ *
 * Facebook — community graph; trends track the platform's retreat to
 * groups + native video as organic page reach collapsed.
 * ------------------------------------------------------------------ */
const FACEBOOK_TRENDS: Trend[] = [
  {
    id: "fb-reels",
    platform: "facebook", domain: "format", name: "Reels",
    origin: { when: "2022", note: "FB Reels rolled out globally to chase short-form." },
    adopters: ["creators repurposing IG/TikTok", "local businesses"],
    peak: "[composite] rising–peak",
    abandoned: { when: "—", why: "live" },
    successor: "TBD",
    status: "rising", provenance: "[fact] FB Reels 2022; [composite] stage",
  },
  {
    id: "fb-groups-focus",
    platform: "facebook", domain: "content-mode", name: "Groups over Pages",
    origin: { when: "2018", note: "MSI update deprioritized page reach; groups became the organic surface." },
    adopters: ["brands building communities", "local/niche operators"],
    peak: "[composite] peak — the organic reality of the platform",
    abandoned: { when: "—", why: "live — the platform's organic layer" },
    successor: "TBD",
    status: "peak", provenance: "[fact] MSI update 2018; [composite] stage",
  },
  {
    id: "fb-live",
    platform: "facebook", domain: "format", name: "Facebook Live",
    origin: { when: "2016", note: "Live video push; early algorithm boost." },
    adopters: ["publishers", "brands", "personal users"],
    peak: "2016–2018",
    abandoned: { when: "~2020", why: "Live hype faded; Reels/short-form ate attention." },
    successor: "Reels",
    status: "declining", provenance: "[fact] FB Live 2016; [composite] stage",
  },
];

/* ------------------------------------------------------------------ *
 * Pinterest — visual search; the slowest, most evergreen cycles. Pins
 * live for months, so "trends" here are format/feature waves, not fads.
 * ------------------------------------------------------------------ */
const PINTEREST_TRENDS: Trend[] = [
  {
    id: "pin-shopping-tags",
    platform: "pinterest", domain: "content-mode", name: "Shopping/product tags",
    origin: { when: "~2020", note: "Tag products on pins for direct outbound-click commerce." },
    adopters: ["DTC brands", "retailers", "affiliates"],
    peak: "[composite] rising — commerce is the platform's direction",
    abandoned: { when: "—", why: "live" },
    successor: "TBD",
    status: "rising", provenance: "[assumption] dates; [composite] stage",
  },
  {
    id: "pin-idea-pin",
    platform: "pinterest", domain: "format", name: "Idea Pins (video pins)",
    origin: { when: "2020 (Story Pins) → renamed Idea Pins 2021", note: "Multi-page video pin for creators." },
    adopters: ["creators", "lifestyle brands"],
    peak: "[composite] peak — the creator format",
    abandoned: { when: "—", why: "live" },
    successor: "TBD",
    status: "peak", provenance: "[fact] Story Pins 2020 → Idea Pins 2021; [composite] stage",
  },
  {
    id: "pin-standard",
    platform: "pinterest", domain: "format", name: "Standard vertical pin",
    origin: { when: "~2010", note: "The foundational 2:3 pin; the evergreen unit." },
    adopters: ["everyone — the default"],
    peak: "[composite] evergreen — not a trend, the platform's floor",
    abandoned: { when: "—", why: "never — it's the atomic unit" },
    successor: "—",
    status: "peak", provenance: "[fact] Pinterest founding format; [composite] stage",
  },
];

/** All trends, flat. */
export const TRENDS: Trend[] = [
  ...TIKTOK_TRENDS, ...INSTAGRAM_TRENDS, ...YOUTUBE_TRENDS,
  ...LINKEDIN_TRENDS, ...X_TRENDS, ...FACEBOOK_TRENDS, ...PINTEREST_TRENDS,
];

/** Trends grouped by platform (newest-first, as authored). */
export const TRENDS_BY_PLATFORM: Record<SocialPlatform, Trend[]> = {
  tiktok: TIKTOK_TRENDS,
  instagram: INSTAGRAM_TRENDS,
  youtube: YOUTUBE_TRENDS,
  linkedin: LINKEDIN_TRENDS,
  x: X_TRENDS,
  facebook: FACEBOOK_TRENDS,
  pinterest: PINTEREST_TRENDS,
};

/** The most recent LIVE trend on a platform (emerging/rising/peak); else the newest entry. */
export function latestLiveTrend(platform: SocialPlatform): Trend | undefined {
  const list = TRENDS_BY_PLATFORM[platform] ?? [];
  return list.find((t) => t.status === "emerging" || t.status === "rising" || t.status === "peak")
    ?? list[0];
}

/** Operator note by lifecycle status — ride early, or avoid. */
export function lifecycleNote(status: import("./types.js").TrendStatus): string {
  switch (status) {
    case "emerging": return "Ride it NOW — low competition, peak early-mover ROI. (Gary V: be early on the trend.)";
    case "rising": return "Ride it while you can — adopters piling in, still profitable, window closing.";
    case "peak": return "Saturated — high competition, declining ROI. Only if you out-execute; better to find the next trend.";
    case "declining": return "Past peak — avoid; ride the successor instead.";
    case "abandoned": return "Dead trend — do NOT ride it. Looks out of touch. The successor is the play.";
    case "forgotten": return "Dead and dated — reference only ironically. Ship the successor.";
  }
}

/** Build the full trend-history deliverable (origin → adopters → peak → abandoned → successor, per platform per domain). */
export function buildTrendHistory(platforms?: SocialPlatform[]): {
  perPlatform: { platform: SocialPlatform; trends: Trend[] }[];
  markdown: string;
} {
  const ids = platforms && platforms.length > 0 ? platforms : (Object.keys(TRENDS_BY_PLATFORM) as SocialPlatform[]);
  const perPlatform = ids
    .map((id) => ({ platform: id, trends: TRENDS_BY_PLATFORM[id] ?? [] }))
    .filter((p) => p.trends.length > 0);

  const sections = perPlatform
    .map(({ platform, trends }) => {
      const name = platformLabel(platform);
      const rows = trends
        .map((t) => {
          const origin = t.origin.who ? `${t.origin.who}, ${t.origin.when}` : t.origin.when;
          return `### ${t.name} — ${t.domain} · ${statusGlyph(t.status)} ${t.status}

- **Origin:** ${origin} — ${t.origin.note}
- **Adopters:** ${t.adopters.join(", ") || "—"}
- **Peak:** ${t.peak}
- **Abandoned / forgotten:** ${t.abandoned.when} — ${t.abandoned.why}
- **Successor:** ${t.successor}
- **Provenance:** ${t.provenance}
`;
        })
        .join("\n");
      return `## ${name}

${rows}`;
    })
    .join("\n");

  const markdown = `# Social Trend History — origin → adopters → peak → abandoned → successor

> Every platform's trend lineage, across every domain (format, hook, audio,
> hashtag, creator-archetype, content-mode). Schwartz sophistication applied to
> trend cycles: ride emerging/rising early (Gary V), never ship an abandoned/
> forgotten one, and know the successor.

${sections}

## How to read this
- **emerging / rising** → ride it. Low competition, high early-mover ROI.
- **peak** → saturated. Only if you out-execute; otherwise find the next trend.
- **declining / abandoned / forgotten** → do not ride. Ship the successor.

## Provenance + gaps
- \`[fact]\` = widely reported / platform-announced. \`[assumption]\` = my inference
  on dates/adopters — flagged for the orchestrator's expert inspect. \`[composite]\`
  = a lifecycle-stage estimate, not a hard date.
- This registry is a **SEED**. It carries the well-documented trends honestly and
  flags the gaps; the orchestrator's 60+ brands of field expertise fills the long
  tail. Do not treat an \`[assumption]\` date as \`[fact]\`.

## Lineage held
- **Schwartz** — market sophistication mapped to trend cycles; the lifecycle stage decides ride/avoid.
- **Gary Vaynerchuk** — be early on the trend; the early-mover captures the cheap reach.
- **Hopkins** — measure the trend's actual ROI by stage, not its hype.
`;

  return { perPlatform, markdown };
}

/** Human platform label. */
export function platformLabel(platform: SocialPlatform): string {
  return { tiktok: "TikTok", instagram: "Instagram", youtube: "YouTube", linkedin: "LinkedIn", x: "X (Twitter)", facebook: "Facebook", pinterest: "Pinterest" }[platform];
}

/** Status glyph for markdown. */
export function statusGlyph(status: import("./types.js").TrendStatus): string {
  return { emerging: "🌱", rising: "📈", peak: "⚡", declining: "📉", abandoned: "💀", forgotten: "🪦" }[status];
}