// Deterministic mock data generator for analytics (so the dashboard looks real).
// Same seed → same numbers.

export function seeded(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export function trendSeries(
  days: number,
  base: number,
  variance: number,
  seed = 42,
): { date: string; value: number }[] {
  const r = seeded(seed);
  const out: { date: string; value: number }[] = [];
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    const v = base + (r() - 0.5) * variance + Math.sin(i / 3) * variance * 0.3;
    out.push({ date: d.toISOString().slice(5, 10), value: Math.max(0, Math.round(v)) });
  }
  return out;
}

export function channelBreakdown(seed = 42): { name: string; value: number; color: string }[] {
  const r = seeded(seed);
  const channels = [
    { name: "Organic", color: "#16a34a" },
    { name: "Paid", color: "var(--accent)" },
    { name: "Social", color: "#0ea5e9" },
    { name: "Email", color: "#f59e0b" },
    { name: "Direct", color: "#64748b" },
    { name: "Referral", color: "#ec4899" },
  ];
  const raw = channels.map((c) => ({ ...c, value: 800 + r() * 4000 }));
  const total = raw.reduce((s, x) => s + x.value, 0);
  return raw.map((c) => ({ ...c, value: Math.round((c.value / total) * 100) }));
}

export function funnel(stages: string[]): { stage: string; count: number; rate: number }[] {
  const r = seeded(7);
  const counts: number[] = [];
  let prev = 8000 + r() * 4000;
  for (let i = 0; i < stages.length; i++) {
    counts.push(Math.round(prev));
    prev = prev * (0.4 + r() * 0.4);
  }
  return stages.map((stage, i) => {
    const count = counts[i];
    const rate = i === 0 ? 100 : Math.round((count / counts[0]) * 100);
    return { stage, count, rate };
  });
}
