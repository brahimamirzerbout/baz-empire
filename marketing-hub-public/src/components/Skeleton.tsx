import clsx from "clsx";

/** Skeleton primitives — premium shimmer placeholders. */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx("rounded-lg", className)}
      style={{
        background:
          "linear-gradient(90deg, rgb(var(--surface-3)) 25%, rgb(var(--surface-2)) 50%, rgb(var(--surface-3)) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s ease-in-out infinite",
      }}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={clsx("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={clsx("h-3.5", i === lines - 1 && "w-2/3")} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={clsx("card card-pad space-y-3.5", className)}>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="card overflow-hidden">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 1 }}>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="contents">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={`${r}-${c}`}
                className="p-3.5"
                style={{ background: "rgb(var(--surface))" }}
              >
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={clsx("grid grid-cols-3 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Inject the shimmer keyframes once.
if (typeof document !== "undefined" && !document.getElementById("skeleton-keyframes")) {
  const style = document.createElement("style");
  style.id = "skeleton-keyframes";
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}
