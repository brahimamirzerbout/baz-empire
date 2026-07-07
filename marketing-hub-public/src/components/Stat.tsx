"use client";
import clsx from "clsx";
import { ArrowDown, ArrowUp, Sparkles } from "lucide-react";
import { CountUp, motion } from "./Anim";
import { useId } from "react";

interface Props {
  label: string;
  value: string | number;
  delta?: number;
  sub?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  sparkline?: number[];
  animate?: boolean;
}

export function Stat({
  label,
  value,
  delta,
  sub,
  icon: Icon,
  color = "brand",
  sparkline,
  animate,
}: Props) {
  const numericValue = typeof value === "number" ? value : null;
  const shouldAnimate = animate !== false && numericValue !== null;
  const id = useId().replace(/:/g, "");
  const colorClasses: Record<
    string,
    { bg: string; text: string; ring: string; spark: string; glow: string }
  > = {
    brand: {
      bg: "bg-[rgba(var(--theme-brand-rgb),0.055)]",
      text: "text-[color-mix(in srgb,var(--accent),black 20%)]",
      ring: "ring-[rgba(var(--theme-brand-rgb),0.15)]",
      spark: "var(--theme-brand, #888)",
      glow: "var(--theme-brand-glow, rgba(100,100,100,0.15))",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      ring: "ring-emerald-100",
      spark: "#16a34a",
      glow: "rgba(22,163,74,0.15)",
    },
    violet: {
      bg: "bg-violet-50",
      text: "text-violet-600",
      ring: "ring-violet-100",
      spark: "var(--accent)",
      glow: "rgba(139,92,246,0.15)",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      ring: "ring-amber-100",
      spark: "#f59e0b",
      glow: "rgba(245,158,11,0.15)",
    },
    sky: {
      bg: "bg-sky-50",
      text: "text-sky-600",
      ring: "ring-sky-100",
      spark: "#0ea5e9",
      glow: "rgba(14,165,233,0.15)",
    },
  };
  const c = colorClasses[color] || colorClasses.brand;

  return (
    <motion.div
      whileHover={{
        y: -3,
        boxShadow:
          "0 12px 32px -8px rgba(15, 23, 42, 0.12), 0 4px 12px -4px rgba(15, 23, 42, 0.06)",
      }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="card card-pad relative overflow-hidden cursor-default group"
    >
      {/* Subtle gradient glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${c.glow}, transparent 60%)`,
        }}
      />

      {sparkline && sparkline.length > 1 && <Sparkline data={sparkline} color={c.spark} />}

      <div className="flex items-start justify-between relative">
        <div className="min-w-0 flex-1">
          <div className="text-xs muted uppercase font-bold tracking-wider">{label}</div>
          <div className="text-2xl font-black mt-1.5 truncate tracking-tight">
            {shouldAnimate ? (
              <CountUp
                value={numericValue!}
                duration={0.9}
                format={(n) => Math.round(n).toLocaleString()}
              />
            ) : (
              value
            )}
          </div>
          {delta != null && (
            <div className={clsx("flex items-center gap-1 text-xs mt-1.5 font-bold")}>
              <span
                className={clsx(
                  "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-bold",
                  delta >= 0 ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50",
                )}
              >
                {delta >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(delta).toFixed(1)}%
              </span>
              {sub && <span className="muted font-normal text-[11px]">{sub}</span>}
            </div>
          )}
          {!delta && sub && <div className="text-xs muted mt-1">{sub}</div>}
        </div>
        {Icon && (
          <div
            className={clsx(
              "w-10 h-10 rounded-lg flex items-center justify-center ring-1 flex-shrink-0 transition-transform group-hover:scale-110",
              c.bg,
              c.ring,
            )}
          >
            <Icon className={clsx("w-5 h-5", c.text)} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 100,
    h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const lastX = w;
  const lastY = h - ((data[data.length - 1] - min) / range) * h;
  const gradId = `spark-${color.replace("#", "")}-${Math.random().toString(36).slice(2, 6)}`;
  return (
    <svg
      className="absolute bottom-0 left-0 right-0 opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity duration-300"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ height: 36 }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${points} ${lastX},${h}`} fill={`url(#${gradId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      <circle cx={lastX} cy={lastY} r={2} fill={color} />
    </svg>
  );
}
