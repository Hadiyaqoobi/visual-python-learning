import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      dot = false,
      removable = false,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-secondary-100 text-secondary-700 border-secondary-200",
      primary: "bg-primary-100 text-primary-700 border-primary-200",
      secondary: "bg-secondary-100 text-secondary-700 border-secondary-200",
      success: "bg-success-100 text-success-700 border-success-200",
      warning: "bg-warning-100 text-warning-700 border-warning-200",
      error: "bg-error-100 text-error-700 border-error-200",
      info: "bg-info-100 text-info-700 border-info-200",
    };

    const dotColors = {
      default: "bg-secondary-500",
      primary: "bg-primary-500",
      secondary: "bg-secondary-500",
      success: "bg-success-500",
      warning: "bg-warning-500",
      error: "bg-error-500",
      info: "bg-info-500",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-sm",
      lg: "px-3 py-1.5 text-base",
    };

    const dotSizes = {
      sm: "w-1.5 h-1.5",
      md: "w-2 h-2",
      lg: "w-2.5 h-2.5",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 font-medium rounded-full border",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn("rounded-full", dotColors[variant], dotSizes[size])}
          />
        )}
        {children}
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Remove"
          >
            <svg
              className={cn(
                size === "sm" ? "w-3 h-3" : size === "md" ? "w-3.5 h-3.5" : "w-4 h-4"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
