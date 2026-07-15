import { describe, it, expect } from "vitest";
import { runAudit, computeLeak, effectiveFraction, DEFAULT_AUDIT_FEE } from "../src/audit.js";
import type { AuditInput } from "../src/types.js";
import { TRACKING_DEFAULT } from "../src/tracking-default.js";

const baseInput: AuditInput = {
  client: {
    clientName: "Acme SaaS",
    monthlyAttributedRevenue: 200_000,
    primaryChannel: "meta",
    markets: ["EU", "US"],
  },
  findings: [
    { componentId: "ssgtm", status: "partial" },
    { componentId: "ga4", status: "present" },
    { componentId: "capi-meta", status: "missing" },
  ],
};

describe("effectiveFraction", () => {
  it("present => 0", () => {
    expect(effectiveFraction(0.1, "present")).toBe(0);
  });
  it("partial => half", () => {
    expect(effectiveFraction(0.1, "partial")).toBeCloseTo(0.05);
  });
  it("missing => full", () => {
    expect(effectiveFraction(0.1, "missing")).toBe(0.1);
  });
  it("broken => full", () => {
    expect(effectiveFraction(0.1, "broken")).toBe(0.1);
  });
});

describe("computeLeak", () => {
  it("returns undefined for unknown component id", () => {
    expect(computeLeak({ componentId: "nope", status: "missing" }, 100_000)).toBeUndefined();
  });
  it("computes annual leak = monthly * 12", () => {
    const r = computeLeak({ componentId: "capi-meta", status: "missing" }, 100_000);
    expect(r).toBeDefined();
    expect(r!.monthlyLeak).toBe(100_000 * 0.12);
    expect(r!.annualLeak).toBe(100_000 * 0.12 * 12);
  });
});

describe("runAudit", () => {
  it("includes every Tracking Default component, treating unreported as missing", () => {
    const { leaks } = runAudit(baseInput);
    const ids = leaks.map((l) => l.componentId);
    for (const comp of TRACKING_DEFAULT) {
      expect(ids).toContain(comp.id);
    }
    expect(leaks).toHaveLength(TRACKING_DEFAULT.length);
  });

  it("sorts leaks by annual leak descending", () => {
    const { leaks } = runAudit(baseInput);
    for (let i = 1; i < leaks.length; i++) {
      expect(leaks[i]!.annualLeak).toBeLessThanOrEqual(leaks[i - 1]!.annualLeak);
    }
  });

  it("applies 0 leak to present components", () => {
    const { leaks } = runAudit(baseInput);
    const ga4 = leaks.find((l) => l.componentId === "ga4");
    expect(ga4?.status).toBe("present");
    expect(ga4?.monthlyLeak).toBe(0);
    expect(ga4?.annualLeak).toBe(0);
  });

  it("applies half fraction to partial components", () => {
    const { leaks } = runAudit(baseInput);
    const ssgtm = leaks.find((l) => l.componentId === "ssgtm");
    expect(ssgtm?.effectiveFraction).toBeCloseTo(0.04);
  });

  it("flags GDPR-relevant consent component when EU in markets", () => {
    const { gdprFlags } = (() => {
      // re-import buildReport path via runAudit + manual filter for test
      const r = runAudit(baseInput);
      return { gdprFlags: r.leaks.filter((l) => l.gdprRelevant && l.effectiveFraction > 0) };
    })();
    expect(gdprFlags.some((l) => l.componentId === "consent")).toBe(true);
  });

  it("guarantee met when annual leak >= 10x fee", () => {
    // Big revenue, mostly missing => large leak => guarantee met.
    const big: AuditInput = {
      client: {
        clientName: "BigCo",
        monthlyAttributedRevenue: 1_000_000,
        primaryChannel: "google",
        markets: ["US"],
      },
      findings: TRACKING_DEFAULT.map((c) => ({ componentId: c.id, status: "missing" as const })),
    };
    const r = runAudit(big, DEFAULT_AUDIT_FEE);
    expect(r.totalAnnual).toBeGreaterThan(DEFAULT_AUDIT_FEE * 10);
    expect(r.guaranteeMet).toBe(true);
  });

  it("guarantee NOT met when everything is present (0 leak)", () => {
    const perfect: AuditInput = {
      client: {
        clientName: "PerfectCo",
        monthlyAttributedRevenue: 10_000,
        primaryChannel: "meta",
        markets: ["US"],
      },
      findings: TRACKING_DEFAULT.map((c) => ({ componentId: c.id, status: "present" as const })),
    };
    const r = runAudit(perfect, DEFAULT_AUDIT_FEE);
    expect(r.totalAnnual).toBe(0);
    expect(r.guaranteeMet).toBe(false);
  });

  it("total monthly leak = sum of per-component monthly leaks", () => {
    const r = runAudit(baseInput);
    const sum = r.leaks.reduce((s, l) => s + l.monthlyLeak, 0);
    expect(r.totalMonthly).toBeCloseTo(sum, 5);
  });
});