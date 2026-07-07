import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full rounded-lg border border-dark-4 bg-dark-3 px-4 py-3 text-light-1 placeholder:text-light-4 outline-none focus:border-primary-500 transition disabled:opacity-50",
          className,
        )}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...rest }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-dark-4 bg-dark-3 px-4 py-3 text-light-1 placeholder:text-light-4 outline-none focus:border-primary-500 transition custom-scrollbar",
        className,
      )}
      {...rest}
    />
  );
});
Textarea.displayName = "Textarea";

export { Input, Textarea };
