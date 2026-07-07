import { ReactNode } from "react";
import clsx from "clsx";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "md",
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const padding = size === "sm" ? "py-10" : size === "lg" ? "py-24" : "py-16";
  const iconSize = size === "sm" ? "w-12 h-12" : size === "lg" ? "w-24 h-24" : "w-16 h-16";
  const iconInner = size === "sm" ? 22 : size === "lg" ? 40 : 30;
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center px-6",
        padding,
        className,
      )}
    >
      {Icon && (
        <div
          className={clsx(iconSize, "rounded-2xl grid place-items-center mb-4 relative")}
          style={{
            background:
              "linear-gradient(135deg, var(--theme-brand, rgba(100,100,100,0.08)), var(--theme-brand-soft, rgba(100,100,100,0.03)))",
          }}
        >
          <div className="absolute inset-0 rounded-2xl ring-1 ring-[rgba(var(--theme-brand-rgb),0.15)]" />
          <Icon className="text-[var(--accent)] dark:text-[color-mix(in srgb,var(--accent),white 5%)] relative" size={iconInner} />
        </div>
      )}
      <h3
        className={clsx(
          "font-bold tracking-tight text-slate-900 dark:text-white",
          size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base",
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={clsx(
            "text-slate-500 dark:text-zinc-400 mt-1.5 max-w-md",
            size === "sm" ? "text-xs" : "text-sm",
          )}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
