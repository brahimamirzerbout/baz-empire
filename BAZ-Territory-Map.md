# BAZ Territory Map — what we covered + the future heatmap & social network

> A map of the territory we've covered (the DZ domination play) and the layers still
> to come: a geo-heatmap of per-region metrics (DEFERRED) and the hub's marketer
> social network (Snapchat + LinkedIn + Minnect). The map is the unified VIEW; the
> data behind each region is an isolated BRANCH.
> Companion: `~/BAZ-DZ-Local-Domination.md` (the focused aspect + offer).

## The north star — best in market, the level setter for Algeria

The hub is built to be the **best app in the market** and the **level setter for
the Algerian market** — the standard the whole market benchmarks against and rises
to. It carries that bar because **BAZ is international** (MENA / EU / US, 60+
brands, senior-partner caliber): international-grade standard, set for Algeria.

- **Not a competitor — the standard.** BAZ doesn't compete in the Algerian market;
  it defines the level. Others benchmark against the hub. [grounded-in: Godin —
  category design; set the category, don't fight in it.]
- **International caliber sets the level (build-time); agents deliver it (runtime).**
  The orchestrator authors the DZ branch to international-grade standards; the agent
  fleet delivers that standard at DZ scale + price. The isolation (§4) protects the
  peak-skill IP — it never lowers the level. [grounded-in: Schwartz — enter an
  unsophisticated market as the sophisticated standard-bearer; you define, you don't
  compete.]
- **The market rises to the level.** Every DZ business on the hub gets
  international-grade execution (agents) + reporting (the heatmap) + network (the
  social layer). The market's floor rises because BAZ set it. [grounded-in: Ogilvy —
  the Big Idea: "the international level, set for Algeria."]

**Positioning line:** *The international level, set for Algeria — delivered by
agents, owned by the network.*

> This is the north star the territory (§0-6), the re-engagement engine (§7),
> and the ecosystem governance (§8) all serve: be the best, set the level, raise
> the market.

## 0. The map at a glance — one view, many isolated branches

The map unifies the geography; each region's intel lives in its own branch,
isolated from the others. The heatmap reads each branch's metrics — never mixing
the intel.

| region | data branch | labor | status |
|---|---|---|---|
| **Algeria (DZ)** | isolated DZ intel branch (`src/lib/algeria/`) — self-contained, agent-runnable | **solely by agents** | mapping now |
| MENA (ex-DZ) | peak-skill core (`src/lib/loot/` + lineage) | senior-partner | future |
| EU | peak-skill core | senior-partner | future |
| US | peak-skill core | senior-partner | future |

> The DZ branch imports NOTHING from the peak-skill core. The chef's-kiss skills
> are the founder's weapon (build-time), not the DZ fleet's runtime — protecting
> the moat and keeping the volume play lean.

## 1. What we covered — the DZ territory (the mapped ground)

### Regions (geography) — dominate one by one
| wilaya | vertical lock | role | branch |
|---|---|---|---|
| Alger (Algiers) | dental / medical | **pilot #1 (72h)** | DZ isolated |
| Oran | real-estate | queued | DZ isolated |
| Constantine | clinic / medical | queued | DZ isolated |
| Blida | auto dealer | queued | DZ isolated |
| Sétif | pharmacy / retail | queued | DZ isolated |

### Verticals (the conquest route — one, then the next)
1. dental / medical → 2. real-estate → 3. auto → 4. beauty / barber
> [grounded-in: Sabri Suby] "completely and utterly dominated that category did he
> move into other sectors." One vertical, then the next — not horizontal sprawl.

### Channels (routes in)
GBP (wedge) → WhatsApp (conversion) → reviews (flywheel) → FB/IG lead-ads (ascension)

### Agents (the workforce — solely by agents)
Prospector · GBP-Optimizer · Responder · Review · Reporter  (QC = a taper, not a pod)

### Offer (the gate into each region)
30,000 DZD/mo · 14-day free pilot · 30-day pay-after-lift · Darija / French

### Waypoints (the path per client)
prospect → pilot → rank (top-3 pack) → respond (<60s) → review (5★) → ascend (Meta)

## 2. The heatmap (FUTURE layer — deferred)

The map carries a geo-heatmap of per-region metrics. **Deferred** — it ships inside
the hub's social network (§3), not as a standalone build now.

| metric per region | source | what it shows |
|---|---|---|
| GBP rank coverage % | GBP API | % of target verticals ranked top-3 |
| calls + DMs / mo | GBP + WhatsApp | demand captured |
| bookings / mo | responder agent | revenue signal |
| # clients / region | CRM | penetration |
| market share % | computed | domination level |
| agent gross margin | reporter | unit economics |
| response time p95 | WhatsApp | the moat (24/7 <60s) |

Color scale: cold (untouched) → warm (active) → hot (dominated). The heatmap reads
each branch's metrics in isolation — DZ numbers never blend with international
numbers; the DZ agents never see the peak-skill core.

## 3. The hub's social network (the "for later" home of the map + heatmap)

The map + heatmap ship inside a marketer social network built into the hub. The
brief: the perfect mix of three products.

| layer | inspired by | what it does |
|---|---|---|
| identity + deals | **LinkedIn** | marketer profiles, credentials, deal board, jobs/requests |
| feed + stories | **Snapchat** | visual / ephemeral explore feed |
| paid connections | **Minnect** | pay-per-minute 1:1 expert micro-consults |
| marketplace | LinkedIn + Minnect | get deals · make requests · match by region/vertical |

**Core verbs (orchestrator's spec):** minnect with marketers · explore feed · get
deals · make requests.

**Where the map fits:** the map/heatmap is the **geo-discovery layer** of the
network — find marketers, deals, and experts by region; see domination density at a
glance. The DZ isolated branch + the international peak-skill branches are the data
behind each region's tile.

## 4. Architecture — unified view, isolated branches

- **The map = the unified VIEW.** One geo-canvas across all regions (DZ + future
  MENA/EU/US). Visual only — it holds metrics, never the intel.
- **The data = isolated BRANCHES.** Each region's intel is its own branch:
  - **DZ branch** (`src/lib/algeria/`) — self-contained, agent-runnable, imports
    nothing from the peak-skill core. All the DZ intel needed to dominate.
  - **International branches** — the peak-skill core (`src/lib/loot/` + the
    marketing lineage), used by BAZ's Core/Growth/Project tiers for high-end
    international clients. Never fed to the DZ agent runtime.
- **One-way build, isolated runtime.** The orchestrator authors the DZ branch
  USING the peak skills (build time, human); the DZ agents RUN only on the isolated
  DZ intel (runtime).
- **Why isolate:** (a) protects senior-partner IP from the high-volume agent fleet;
  (b) keeps the DZ operation lean + cheap (agents don't carry the heavy global
  core); (c) prevents the volume play from diluting the chef's-kiss brand;
  (d) clean attribution — DZ metrics are DZ, never blended.

## 5. Roadmap — now vs later

| layer | now | later |
|---|---|---|
| DZ intel branch (`src/lib/algeria/`) | spec'd (this map + DZ doc) | build when green-lit |
| `/algeria` public route | deferred | build with the branch |
| geo-heatmap | deferred | ship inside the social network |
| marketer social network (Snapchat+LinkedIn+Minnect) | vision captured (§3) | a hub pillar, post-DZ-pilot |
| **72h DZ pilot (1 business, 1 city, 1 agent)** | **the live move** | — |

## 6. Next action (the one thing that's NOT "for later")

The map is the overview; the live move is unchanged: **one business, one city, one
channel, one agent.** Claim + optimize the first Algiers dental/medical GBP today,
deploy the WhatsApp-responder agent, baseline GBP insights + WhatsApp volume. Prove
the 30-day lift on ONE client. The map, heatmap, and social network are the
territory — this pilot is the first dot on it.

> Everything visual (heatmap + network) is deferred — captured here so it's not
> lost. The 72h pilot is the only thing that moves revenue this week.

## 7. Strategic purpose — the re-engagement engine

The map, heatmap, and social network are not features — they are BAZ's
**re-engagement strategy**: the retention layer that keeps every user *always
connected, always reminded, always making money.* Acquire a user once, compound
their value forever — retention is the biggest leverage in the model.
[grounded-in: Hormozi — retention > acquisition, LTV > CAC; Deiss — the customer-value
journey's ascension / advocacy / retention stages; Brunson — the continuity /
community rung of the value ladder; Godin — the permission asset + the tribe;
Kennedy — keep the herd, milk the lifetime value.]

### The three "always" hooks (the re-engagement mechanics)
| hook | what it is | the pull-back trigger | lineage |
|---|---|---|---|
| **always connected** | persistent presence — profile, feed, network, agent, dashboard | you're IN; the network is your pro home base | Godin (tribe) · LinkedIn (identity) |
| **always reminded** | the nudge engine — feed updates, deal/request matches, agent status ("you ranked," "you got a booking," "review to answer") | notifications pull you back before you drift | Deiss (lifecycle) · Kennedy (herd contact) |
| **always making money** | the revenue layer — deals close, consults pay, the agent engine keeps booking, the marketplace transacts | you stay because it pays, not because it's novel | Hormozi (value equation, delivered continuously) |

### Applied hub-wide (one thesis, three user types)
| user | always connected | always reminded | always making money |
|---|---|---|---|
| DZ SMB client | to their agent + dashboard | agent nudges (rank, booking, review) | bookings keep coming (agent-run) |
| marketer (network) | feed + network + profile | deal / request matches, feed | deals + paid consults close |
| international client | BAZ partner + dashboard | strategy nudges, reporting | growth compounds (senior-partner) |

### Why it's great for everyone (the network effect)
- **user** keeps earning with near-zero effort → never has a reason to leave.
- **BAZ** compounds LTV on a one-time acquisition → the moat.
- **the network** densifies with every user → more deals, more matches, more money
  → greater monopoly, more leverage. [grounded-in: Hormozi — "greater and greater
  Monopoly and have more leverage" (L9957).]

> Re-engagement is not a campaign — it's the operating system. The social network
> is the mechanism for the marketer segment; the agent fleet for DZ; the partner
> for international. One thesis, three engines, three hooks each.

## 8. Governance — the umbrella + the piece (how the orchestrator already does business)

The governance is the orchestrator's established model, codified: **other agencies
and entrepreneurs make their own deals, under BAZ's hand — everybody eats, BAZ gets
a piece.** BAZ is the governing umbrella (the hand), not the doer. It scales
asset-light — by governing operators under its level, not by hiring junior pods.
[grounded-in: the orchestrator's operating model; Hormozi — own the governing layer
+ a piece of every deal = the monopoly leverage; respects BAZ's no-junior-pod
doctrine — operators are independent entrepreneurs, not BAZ juniors.]

### The tier ladder (who serves what, under the hand)
| tier | deal size | served by | under the hand as | BAZ's cut |
|---|---|---|---|---|
| **top — heavy** | Core $6.5–9.5k / Growth $18–28k / Project $12–80k | BAZ senior-partner | BAZ's own deals | 100% (BAZ's revenue) |
| **middle** | below BAZ, above unserved | independent agencies / entrepreneurs | **their own deals**, under BAZ's umbrella | **a piece** (take-rate) |
| **bottom — unserved** | unprofitable for any human | BAZ agent fleet | BAZ's own (agent-run) deals | 100% (BAZ's revenue) |

### What "under my hand" means (the umbrella the operator pays the piece for)
- **the brand + trust** — BAZ's name opens doors the operator's alone can't.
- **the level** — international-grade standards; the hub enforces quality. Non-negotiable.
- **the platform** — the hub, the agent fleet, the CRM, the reporting / heatmap.
- **the demand** — the network + heatmap route deals to the operator.
In exchange, BAZ takes a piece of every deal closed under the hand. The operator
eats the rest — and eats *better than alone*, because the umbrella multiplies their
reach + closes. [grounded-in: Hormozi — the deal must clear for both sides; the
operator's value equation must win too, or they won't join.]

### The take-rate (the "piece") — [assumption: pending the orchestrator's number]
- **structure:** a % of each closed deal (marketplace take-rate) + optional flat
  platform / network access fee. Sized so the operator still eats well — the umbrella
  must beat going alone, or operators won't come under the hand.
- **what BAZ captures:** the piece on the middle (independents) + 100% on top and
  bottom (BAZ's own). The leverage: a piece of *every* deal in the ecosystem, at
  near-zero marginal cost — BAZ governs, it doesn't execute the middle.

### The governance rules
1. **BAZ partners take only the heavy top.** Below that = operators under the hand,
   not BAZ's to do. Don't dilute the senior-partner model.
2. **Operators make their own deals — BAZ doesn't source for them.** Independence
   is the point: they prospect, close, serve. BAZ gives the umbrella + takes a piece;
   it doesn't step on toes or take their bread — it governs and feeds demand.
3. **The agent fleet dominates only the unserved bottom** — what no human operator
   can profitably serve. Feeding the un-fed, not taking bread. [grounded-in: Halbert
   — the starving crowd nobody else serves.]
4. **The level is non-negotiable.** Every deal under the hand meets the BAZ
   international standard; the hub enforces it. The umbrella's value = the level.
5. **Ascension routes up.** An operator's client that elevates → BAZ partner (top);
   an agent-served client that grows → an operator (middle) → BAZ (top) if it
   elevates. The hub routes the climb. [grounded-in: Deiss — customer-value
   journey ascension; Brunson — value ladder.]

### Why this is the moat
- **Asset-light + take-rate = the monopoly.** BAZ scales by governing operators, not
  by hiring. A piece of every deal in the ecosystem, at near-zero marginal cost.
  [grounded-in: Hormozi — "greater and greater Monopoly and have more leverage"
  (L9957).]
- BAZ owns the governing layer (brand + level + platform + demand-routing) + the two
  ends (top by partners, bottom by agents); the middle feeds itself under the hand.
  Every tier eats; BAZ captures the umbrella + the piece.
- The network effect compounds: more operators → more deals under the hand → more
  value → more demand → greater monopoly.

> Govern the way you already do: operators make their own deals under your hand;
> everybody eats; you get a piece. The hub is the hand.

---

**Diagnose first, architect the offer, ship the system, hold the line on what
moves revenue.**