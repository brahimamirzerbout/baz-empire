// Minimal loading spinner used by buttons.
import { cn } from "@/lib/utils";

interface LoaderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Loader({ width = "16", height = "16", className }: LoaderProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-r-transparent",
        className,
      )}
      style={{ width, height }}
    />
  );
}

export default Loader;
