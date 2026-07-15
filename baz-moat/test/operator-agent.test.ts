import { describe, it, expect } from "vitest";
import {
  answer,
  render,
  awarenessEntry,
  sophisticationStrategy,
  recommendTier,
  type ClientQuestion,
} from "../src/operator-agent/engine.js";
import { SYNTHESIS_SEQUENCE, VOICE, GUARDRAILS } from "../src/operator-agent/knowledge.js";

const baseQ: ClientQuestion = {
  question: "Our paid CAC is rising and ROAS is slipping — what do we do?",
  awareness: "solution-aware",
  marketStage: 4,
  channel: "meta",
  markets: ["EU", "US"],
  metric: "CAC",
};

describe("awarenessEntry", () => {
  it("maps each stage to a distinct entry strategy", () => {
    const entries = [
      awarenessEntry("unaware"),
      awarenessEntry("problem-aware"),
      awarenessEntry("solution-aware"),
      awarenessEntry("product-aware"),
      awarenessEntry("most-aware"),
    ];
    expect(new Set(entries).size).toBe(5);
  });
  it("most-aware leads with the offer", () => {
    expect(awarenessEntry("most-aware")).toContain("Lead with the offer");
  });
  it("solution-aware leads with the mechanism", () => {
    expect(awarenessEntry("solution-aware")).toContain("unique mechanism");
  });
});

describe("sophisticationStrategy", () => {
  it("stage 1 = direct claim, stage 5 = identity", () => {
    expect(sophisticationStrategy(1)).toContain("State the benefit directly");
    expect(sophisticationStrategy(5)).toContain("identity");
  });
  it("covers all 5 stages without throwing", () => {
    for (const s of [1, 2, 3, 4, 5] as const) {
      expect(sophisticationStrategy(s).length).toBeGreaterThan(0);
    }
  });
});

describe("recommendTier", () => {
  it("most-aware + mature market => Growth", () => {
    const tier = recommendTier({ ...baseQ, awareness: "most-aware", marketStage: 5 });
    expect(tier).toContain("Growth");
  });
  it("mature but not most-aware => Core", () => {
    const tier = recommendTier({ ...baseQ, awareness: "solution-aware", marketStage: 4 });
    expect(tier).toContain("Core");
  });
  it("early market => Project", () => {
    const tier = recommendTier({ ...baseQ, awareness: "problem-aware", marketStage: 1 });
    expect(tier).toContain("Project");
  });
});

describe("answer", () => {
  const res = answer(baseQ);

  it("runs every lens in the synthesis sequence", () => {
    expect(res.lensFindings).toHaveLength(SYNTHESIS_SEQUENCE.length);
    const ids = res.lensFindings.map((l) => l.lensId);
    SYNTHESIS_SEQUENCE.forEach((l) => expect(ids).toContain(l.id));
  });

  it("diagnosis references the market stage and the metric", () => {
    expect(res.diagnosis).toContain("stage-4");
    expect(res.diagnosis).toContain("CAC");
  });

  it("the move names the diagnostic as highest-leverage", () => {
    expect(res.theMove).toContain("Revenue Attribution Diagnostic");
  });

  it("offer section mentions risk reversal", () => {
    expect(res.offerAndMessaging).toContain("risk-reversed");
  });

  it("architecture includes the conversion threshold", () => {
    expect(res.architecture).toContain("≥40%");
  });

  it("next action is a single 72h action", () => {
    expect(res.nextAction).toContain("72 hours");
    expect(res.nextAction).toContain("book the diagnostic kickoff");
  });

  it("carries all BAZ guardrails through to the output", () => {
    GUARDRAILS.forEach((g) => expect(res.guardrails).toContain(g));
  });

  it("never uses the anti-lexicon in findings", () => {
    const blob = JSON.stringify(res);
    VOICE.antiLexicon.forEach((w) => {
      expect(blob).not.toContain(w);
    });
  });

  it("render() produces a markdown H1 and all 5 sections", () => {
    const md = render(res);
    expect(md).toContain("# Operator Agent — response");
    expect(md).toContain("## 1. Diagnosis");
    expect(md).toContain("## 2. The move");
    expect(md).toContain("## 5. Next action (72h)");
    expect(md).toContain("## Guardrails");
    expect(md).toContain(VOICE.oneLiner);
  });
});