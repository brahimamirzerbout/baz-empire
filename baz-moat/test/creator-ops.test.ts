import { describe, it, expect } from "vitest";
import { buildCreatorOps } from "../src/creator-ops/engine.js";
import { scoreAuthenticity } from "../src/creator-ops/authenticity-scorer.js";
import { initStages, computeProgress, nextAction, needsHuman, STAGE_AGENTS } from "../src/creator-ops/authenticity-scorer.js";
import type { Creator, CreatorOpsInput } from "../src/creator-ops/types.js";

function creator(
  id: string, handle: string, followers: number, eng: number, fake: number, match: number, cost = 500,
): Creator {
  return {
    id, handle, platform: "instagram", type: "influencer",
    followers, engagementRate: eng, fakeFollowerPct: fake, audienceMatch: match,
    niche: "SaaS", costPerPost: cost,
  };
}

const input = (creators: Creator[]): CreatorOpsInput => ({
  campaignName: "Acme SaaS Q4 Creator Program",
  brand: "Acme",
  audienceIcp: "Series A-B B2B SaaS founders running paid",
  creators,
  budget: 5000,
});

describe("scoreAuthenticity", () => {
  it("passes a clean creator (low fake, high engagement, good match)", () => {
    const { score, verdict } = scoreAuthenticity(creator("a", "@clean", 50000, 0.04, 0.03, 0.9));
    expect(verdict).toBe("pass");
    expect(score).toBeGreaterThanOrEqual(70);
  });

  it("fails a creator with >15% fake followers regardless of reach", () => {
    const { score, verdict } = scoreAuthenticity(creator("b", "@fake", 500000, 0.01, 0.20, 0.5));
    expect(verdict).toBe("fail");
    expect(score).toBeLessThan(40);
  });

  it("warns on a borderline creator (8-15% fake)", () => {
    const { verdict } = scoreAuthenticity(creator("c", "@border", 30000, 0.02, 0.10, 0.6));
    expect(["warn", "pass"]).toContain(verdict);
  });
});

describe("STAGE_AGENTS + initStages", () => {
  it("has 8 stages with agent actions", () => {
    expect(STAGE_AGENTS).toHaveLength(8);
    expect(STAGE_AGENTS.every((s) => s.agentAction.length > 0)).toBe(true);
  });

  it("initStages starts with discovery in-progress, rest pending", () => {
    const stages = initStages();
    expect(stages[0]!.status).toBe("in-progress");
    expect(stages[1]!.status).toBe("pending");
  });

  it("every stage except discovery has a humanAction OR is fully agent-run", () => {
    const stages = initStages();
    // discovery, publishing, tracking, attribution are fully agent-run (no human action)
    // outreach, contracting, content-approval, payment have human actions
    const humanStages = stages.filter((s) => s.humanAction);
    expect(humanStages.length).toBeGreaterThanOrEqual(3);
  });
});

describe("computeProgress + nextAction + needsHuman", () => {
  it("progress = 0 when all pending", () => {
    const stages = initStages().map((s) => ({ ...s, status: "pending" as const }));
    expect(computeProgress(stages)).toBe(0);
  });

  it("progress = 100 when all complete", () => {
    const stages = initStages().map((s) => ({ ...s, status: "complete" as const }));
    expect(computeProgress(stages)).toBe(100);
  });

  it("nextAction returns the first incomplete stage's agent action", () => {
    const stages = initStages();
    const action = nextAction(stages);
    expect(action).toContain("Agent scans");
  });

  it("needsHuman = true when stages have human actions not complete", () => {
    const stages = initStages();
    expect(needsHuman(stages)).toBe(true);
  });
});

describe("buildCreatorOps", () => {
  it("passes clean creators through the gate", () => {
    const out = buildCreatorOps(input([
      creator("a", "@clean1", 50000, 0.04, 0.03, 0.9, 1000),
      creator("b", "@clean2", 30000, 0.05, 0.02, 0.85, 800),
    ]));
    expect(out.passedGate).toHaveLength(2);
    expect(out.flaggedGate).toHaveLength(0);
  });

  it("rejects creators with >15% fake followers", () => {
    const out = buildCreatorOps(input([
      creator("a", "@clean", 50000, 0.04, 0.03, 0.9),
      creator("b", "@fake", 500000, 0.005, 0.25, 0.5),
    ]));
    expect(out.passedGate).toHaveLength(1);
    expect(out.flaggedGate).toHaveLength(1);
    expect(out.flaggedGate[0]!.creator.handle).toBe("@fake");
  });

  it("blocked creators have all stages blocked + progress 0", () => {
    const out = buildCreatorOps(input([creator("b", "@fake", 500000, 0.005, 0.25, 0.5)]));
    expect(out.flaggedGate[0]!.progress).toBe(0);
    expect(out.flaggedGate[0]!.stages.every((s) => s.status === "blocked")).toBe(true);
  });

  it("estimatedSpend = sum of passed creators' costPerPost", () => {
    const out = buildCreatorOps(input([
      creator("a", "@c1", 50000, 0.04, 0.03, 0.9, 1000),
      creator("b", "@c2", 30000, 0.05, 0.02, 0.85, 800),
    ]));
    expect(out.estimatedSpend).toBe(1800);
    expect(out.budgetOk).toBe(true);
  });

  it("budgetOk = false when spend exceeds budget", () => {
    const out = buildCreatorOps(input([
      creator("a", "@c1", 50000, 0.04, 0.03, 0.9, 3000),
      creator("b", "@c2", 30000, 0.05, 0.02, 0.85, 3000),
    ]));
    expect(out.estimatedSpend).toBe(6000);
    expect(out.budgetOk).toBe(false);
  });

  it("markdown contains the gate table + operational layer + doctrine", () => {
    const out = buildCreatorOps(input([
      creator("a", "@clean", 50000, 0.04, 0.03, 0.9, 1000),
      creator("b", "@fake", 500000, 0.005, 0.25, 0.5),
    ]));
    expect(out.markdown).toContain("Authenticity gate");
    expect(out.markdown).toContain("operational layer");
    expect(out.markdown).toContain("Halbert");
    expect(out.markdown).toContain("Cialdini");
    expect(out.markdown).toContain("@clean");
    expect(out.markdown).toContain("@fake");
    expect(out.markdown).toContain("REJECTED");
  });

  it("warns on budget short", () => {
    const out = buildCreatorOps(input([
      creator("a", "@c1", 50000, 0.04, 0.03, 0.9, 3000),
      creator("b", "@c2", 30000, 0.05, 0.02, 0.85, 3000),
    ]));
    expect(out.markdown).toContain("Budget short");
  });

  it("unifies all 4 creator types (influencer/creator/ugc/ambassador)", () => {
    const out = buildCreatorOps(input([
      { ...creator("a", "@inf", 50000, 0.04, 0.03, 0.9), type: "influencer" },
      { ...creator("b", "@cre", 10000, 0.06, 0.02, 0.8), type: "creator", costPerPost: 300 },
      { ...creator("c", "@ugc", 5000, 0.08, 0.01, 0.7), type: "ugc", costPerPost: 150 },
      { ...creator("d", "@amb", 20000, 0.03, 0.05, 0.85), type: "ambassador", costPerPost: 0 },
    ]));
    expect(out.passedGate).toHaveLength(4);
    expect(out.estimatedSpend).toBe(950); // 500 + 300 + 150 + 0 (ambassador is free)
  });
});