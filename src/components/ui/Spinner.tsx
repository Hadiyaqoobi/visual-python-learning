import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "white";
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", variant = "primary", ...props }, ref) => {
    const sizes = {
      xs: "w-3 h-3 border-[2px]",
      sm: "w-4 h-4 border-2",
      md: "w-6 h-6 border-2",
      lg: "w-8 h-8 border-[3px]",
      xl: "w-12 h-12 border-4",
    };

    const variants = {
      primary: "border-primary-200 border-t-primary-600",
      secondary: "border-secondary-200 border-t-secondary-600",
      white: "border-white/30 border-t-white",
    };

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn(
          "animate-spin rounded-full",
          sizes[size],
          variants[variant],
          className
        )}
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
