import type { WebPerfBudget, LcpAllocation, CwvMetric } from "../types";

/**
 * Web Performance — LCP budget allocator + Core Web Vitals pass-rate.
 *
 * Extracted from the dominator methodology of Increasio, Tridence, Lucky Media,
 * Digital Heroes and Neogen Media — the category kings that ship **Core Web Vitals
 * by contract** (LCP < 2.5s / INP < 200ms / CLS < 0.1, refunded if missed). BAZ's
 * own doctrine sets the floor at sub-1.5s LCP.
 *
 * The allocator takes a target LCP and a set of asset contributions (server response,
 * render-blocking JS, image, font, client JS) and redistributes a budget so the
 * largest contentful paint lands under target. Returns per-asset budgets + a verdict.
 *
 * Pure function — no I/O, deterministic. Unit-tested.
 */
export class WebPerfService {
  /**
   * Allocate an LCP budget across the contributing phases.
   *
   * LCP = TTFB + resource load delay + resource load time + element render delay.
   * We model 5 contributors and weight the budget by each one's typical share,
   * penalising contributors that are already over their healthy ceiling.
   */
  static allocateLcpBudget(budget: WebPerfBudget): LcpAllocation {
    if (budget.targetLcpMs <= 0) throw new Error("targetLcpMs must be > 0");

    // Healthy ceilings (ms) per contributor — industry dominator benchmarks.
    const CEILINGS = {
      ttfb: 600,            // server response (TTFB) — good < 600ms
      renderBlockingJs: 200, // render-blocking JS/CSS in <head>
      imageLoad: 800,        // LCP image load (largest lever)
      fontLoad: 300,         // web font swap
      clientJs: 400,         // hydration / client JS execution
    } as const;

    // Weight each contributor by how far UNDER its ceiling it is (room to spend),
    // capped so no single phase eats the whole budget.
    type Key = keyof typeof CEILINGS;
    const current = budget.current as Record<Key, number>;
    const ceilings = CEILINGS;

    let totalRoom = 0;
    const rooms: Record<Key, number> = {} as Record<Key, number>;
    (Object.keys(ceilings) as Key[]).forEach((k) => {
      const room = Math.max(ceilings[k] - (current[k] ?? 0), 0);
      rooms[k] = room;
      totalRoom += room;
    });

    // If everything is already over ceiling, distribute the target evenly as a cap.
    const target = budget.targetLcpMs;
    const allocations: Record<Key, number> = {} as Record<Key, number>;
    if (totalRoom <= 0) {
      (Object.keys(ceilings) as Key[]).forEach((k) => {
        allocations[k] = Math.round((target / 5) * 100) / 100;
      });
    } else {
      (Object.keys(ceilings) as Key[]).forEach((k) => {
        // Proportional to room, but never exceed the ceiling (the healthy max).
        const share = totalRoom > 0 ? rooms[k] / totalRoom : 1 / 5;
        allocations[k] = Math.min(
          ceilings[k],
          Math.round(share * target * 100) / 100
        );
      });
    }

    const projectedLcp =
      Math.round(
        (Object.keys(allocations) as Key[]).reduce(
          (sum, k) => sum + allocations[k],
          0
        ) * 100
      ) / 100;

    const pass = projectedLcp <= target;
    const overage = Math.max(0, Math.round((projectedLcp - target) * 100) / 100);

    // Identify the largest remaining lever (biggest current-vs-ceiling gap).
    let worstLever: Key = "imageLoad";
    let worstGap = -Infinity;
    (Object.keys(ceilings) as Key[]).forEach((k) => {
      const gap = (current[k] ?? 0) - ceilings[k];
      if (gap > worstGap) {
        worstGap = gap;
        worstLever = k;
      }
    });

    const recommendations: string[] = [];
    if (current.ttfb > CEILINGS.ttfb)
      recommendations.push("Move to edge rendering / ISR to cut TTFB below 600ms.");
    if (current.renderBlockingJs > CEILINGS.renderBlockingJs)
      recommendations.push("Defer or remove render-blocking JS/CSS in <head>.");
    if (current.imageLoad > CEILINGS.imageLoad)
      recommendations.push("Serve the LCP image as next/image with priority + WebP/AVIF.");
    if (current.fontLoad > CEILINGS.fontLoad)
      recommendations.push("Preload the primary web font; use font-display: swap.");
    if (current.clientJs > CEILINGS.clientJs)
      recommendations.push("Move to React Server Components to cut client JS hydration.");
    if (recommendations.length === 0)
      recommendations.push("All contributors within healthy ceilings — ship the contract.");

    return {
      targetLcpMs: target,
      allocations,
      projectedLcpMs: projectedLcp,
      pass,
      overageMs: overage,
      worstLever,
      recommendations,
    };
  }

  /**
   * Score a set of Core Web Vitals field metrics against the BAZ contract
   * (LCP < 1.5s floor [doctrine], INP < 200ms, CLS < 0.1). Returns a pass-rate
   * and a per-metric verdict — the "CWV pass rate" dominator KPI.
   */
  static scoreCwv(metrics: CwvMetric[]): {
    passRate: number;
    total: number;
    passed: number;
    perMetric: { metric: string; p75: number; target: number; pass: boolean }[];
  } {
    if (metrics.length === 0)
      return { passRate: 0, total: 0, passed: 0, perMetric: [] };

    const TARGETS: Record<string, number> = {
      lcp: 1500,  // BAZ doctrine: sub-1.5s LCP floor (stricter than Google's 2.5s)
      inp: 200,
      cls: 0.1,
    };

    const perMetric = metrics.map((m) => {
      const target = TARGETS[m.metric] ?? 0;
      // For CLS, lower is better (p75 < target). For LCP/INP, lower is better.
      const pass = m.p75 <= target;
      return { metric: m.metric, p75: m.p75, target, pass };
    });

    const passed = perMetric.filter((p) => p.pass).length;
    return {
      passRate: Math.round((passed / perMetric.length) * 100),
      total: perMetric.length,
      passed,
      perMetric,
    };
  }
}