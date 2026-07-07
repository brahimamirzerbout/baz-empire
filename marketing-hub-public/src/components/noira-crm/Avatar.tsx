import { useState } from "react";
import { cn } from "@/lib/utils";

type AvatarProps = {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  /** Show ring around avatar (active stories, etc) */
  ring?: boolean;
};

const sizeMap = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
  "2xl": "h-24 w-24 text-2xl",
};

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Deterministic color from name
function colorFromName(name?: string): string {
  if (!name) return "#52525B";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 45%)`;
}

const Avatar = ({ src, alt = "", name, size = "md", className, ring = false }: AvatarProps) => {
  const [error, setError] = useState(false);

  const showImage = src && !error;
  const initials = getInitials(name);
  const bg = colorFromName(name);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden flex-shrink-0 select-none",
        sizeMap[size],
        ring && "ring-2 ring-primary-500 ring-offset-2 ring-offset-surface-bg",
        className,
      )}
      style={!showImage ? { backgroundColor: bg } : undefined}
      role="img"
      aria-label={alt || name || "avatar"}
    >
      {showImage ? (
        <img
          src={src as string}
          alt={alt || name || ""}
          loading="lazy"
          onError={() => setError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-bold text-white tracking-wide">{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
