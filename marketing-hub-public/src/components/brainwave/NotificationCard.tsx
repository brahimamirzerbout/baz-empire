"use client";

/**
 * NotificationCard — a glassy "social proof" notification.
 * Originally from sanidhyy's Brainwave template (src/components/Notification.jsx).
 *
 * Adapted for Marketing Hub:
 *   - Drop-in, no external assets required (default avatars ship in brainwave/assets/notification/)
 *   - Renders properly in both dark and light themes
 *   - Avatar list is overridable via `avatars` prop
 *   - Sub-component pattern: pass `<NotificationCard.Title>` if you want full control
 *
 * Usage:
 *   <NotificationCard
 *     title="Sarah just signed up"
 *     avatars={["/avatars/a.png", "/avatars/b.png"]}
 *     time="2m ago"
 *   />
 */

import { useId } from "react";
import clsx from "clsx";

// Default avatars ship with the component (from Brainwave's own notification set)
import avatar1 from "./assets/notification/image-1.png";
import avatar2 from "./assets/notification/image-2.png";
import avatar3 from "./assets/notification/image-3.png";
import avatar4 from "./assets/notification/image-4.png";

const DEFAULT_AVATARS = [avatar1, avatar2, avatar3, avatar4];

export type NotificationCardProps = {
  title: string;
  time?: string;
  /** Override the avatar list. Pass empty array to hide. */
  avatars?: string[];
  /** Render an icon at the left edge (e.g. a Bell or product mark). */
  iconSrc?: string;
  className?: string;
  /** Visual variant — "glass" (default) suits dark hero, "card" suits light UI. */
  variant?: "glass" | "card";
};

export function NotificationCard({
  title,
  time = "1m ago",
  avatars = DEFAULT_AVATARS,
  iconSrc,
  className,
  variant = "glass",
}: NotificationCardProps) {
  const id = useId();
  const isGlass = variant === "glass";

  return (
    <div
      className={clsx(
        "flex items-center gap-4 p-4 pr-6 rounded-2xl border",
        isGlass
          ? "bg-slate-900 dark:bg-black dark:bg-black/40 backdrop-blur-md border-white/10"
          : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm",
        className,
      )}
    >
      {iconSrc && (
        <img
          src={iconSrc}
          alt=""
          className={clsx("rounded-lg", isGlass ? "" : "ring-1 ring-slate-200")}
          width={56}
          height={56}
        />
      )}
      <div className="flex-1 min-w-0">
        <h6
          className={clsx(
            "font-semibold text-sm truncate",
            isGlass ? "text-white" : "text-slate-900 dark:text-white",
          )}
        >
          {title}
        </h6>
        <div className="flex items-center justify-between mt-1">
          {avatars.length > 0 ? (
            <ul className="flex -space-x-2">
              {avatars.slice(0, 4).map((src, i) => (
                <li
                  key={`${id}-${i}`}
                  className={clsx(
                    "w-6 h-6 rounded-full overflow-hidden border-2",
                    isGlass ? "border-slate-900" : "border-white",
                  )}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
          <div className={clsx("text-xs", isGlass ? "text-slate-400 dark:text-zinc-500" : "text-slate-500 dark:text-zinc-400")}>
            {time}
          </div>
        </div>
      </div>
    </div>
  );
}
