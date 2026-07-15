import { describe, it, expect } from "vitest";
import { buildReport } from "../src/report.js";
import type { AuditInput } from "../src/types.js";
import { TRACKING_DEFAULT } from "../src/tracking-default.js";

const input: AuditInput = {
  client: {
    clientName: "Acme SaaS",
    monthlyAttributedRevenue: 200_000,
    primaryChannel: "meta",
    markets: ["EU", "US"],
    avgOrderValue: 1200,
  },
  findings: [
    { componentId: "ssgtm", status: "partial" },
    { componentId: "ga4", status: "present" },
    { componentId: "capi-meta", status: "missing" },
  ],
};

describe("buildReport", () => {
  const report = buildReport(input, 5000);

  it("emits a markdown report with the client name as H1", () => {
    expect(report.markdown).toContain("# Revenue Attribution Diagnostic — Acme SaaS");
  });

  it("emits a 90-day plan H1", () => {
    expect(report.plan).toContain("# 90-Day Plan — Acme SaaS");
  });

  it("includes every tracking-default component label in the table", () => {
    for (const c of TRACKING_DEFAULT) {
      expect(report.markdown).toContain(c.label);
    }
  });

  it("flags GDPR for EU markets", () => {
    expect(report.markdown).toContain("EU market detected");
  });

  it("guarantee line reflects the 10x test", () => {
    // 200k revenue with several missing components should clear 10x of 5k = 50k.
    expect(report.guaranteeMet).toBe(true);
    expect(report.markdown).toContain("Guarantee met");
  });

  it("plan references the top leak as the biggest hole", () => {
    expect(report.markdown).toContain("single biggest hole is");
  });

  it("plan has three day phases", () => {
    expect(report.plan).toContain("Days 0–30");
    expect(report.plan).toContain("Days 31–60");
    expect(report.plan).toContain("Days 61–90");
  });

  it("when no actionable leaks, plan says so and does not crash", () => {
    const perfect: AuditInput = {
      client: {
        clientName: "PerfectCo",
        monthlyAttributedRevenue: 10_000,
        primaryChannel: "meta",
        markets: ["US"],
      },
      findings: TRACKING_DEFAULT.map((c) => ({ componentId: c.id, status: "present" as const })),
    };
    const r = buildReport(perfect, 5000);
    expect(r.plan).toContain("No actionable leaks detected");
    expect(r.plan).toContain("shift budget from audit to growth");
  });
});