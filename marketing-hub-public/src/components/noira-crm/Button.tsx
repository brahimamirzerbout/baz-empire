import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "dark" | "danger";
  isLoading?: boolean;
};

const variantClasses: Record<string, string> = {
  primary: "bg-primary-500 hover:bg-primary-600 text-white font-semibold transition",
  ghost: "bg-transparent hover:bg-dark-4 text-light-1 transition border border-dark-4",
  dark: "bg-dark-4 hover:bg-dark-3 text-light-1 transition",
  danger: "bg-red-600 hover:bg-red-700 text-white font-semibold transition",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, disabled, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm disabled:opacity-50 disabled:pointer-events-none transition-all",
          variantClasses[variant],
          className,
        )}
        disabled={disabled || isLoading}
        {...rest}
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
