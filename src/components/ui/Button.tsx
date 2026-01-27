import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      "inline-flex items-center justify-center font-medium rounded-lg",
      "transition-all duration-200 ease-out",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
      "active:scale-[0.98]"
    );

    const variants = {
      primary: cn(
        "bg-primary-600 text-white",
        "hover:bg-primary-700",
        "focus:ring-primary-500",
        "shadow-sm hover:shadow-md"
      ),
      secondary: cn(
        "bg-secondary-100 text-secondary-900",
        "hover:bg-secondary-200",
        "focus:ring-secondary-500",
        "shadow-sm"
      ),
      outline: cn(
        "border-2 border-secondary-300 text-secondary-700 bg-transparent",
        "hover:bg-secondary-50 hover:border-secondary-400",
        "focus:ring-secondary-500"
      ),
      ghost: cn(
        "text-secondary-700 bg-transparent",
        "hover:bg-secondary-100",
        "focus:ring-secondary-500"
      ),
      danger: cn(
        "bg-error-600 text-white",
        "hover:bg-error-700",
        "focus:ring-error-500",
        "shadow-sm hover:shadow-md"
      ),
      success: cn(
        "bg-success-600 text-white",
        "hover:bg-success-700",
        "focus:ring-success-500",
        "shadow-sm hover:shadow-md"
      ),
    };

    const sizes = {
      xs: "px-2.5 py-1 text-xs gap-1",
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-5 py-2.5 text-base gap-2",
      xl: "px-6 py-3 text-lg gap-2.5",
    };

    const iconSizes = {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-4 h-4",
      lg: "w-5 h-5",
      xl: "w-6 h-6",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className={cn("animate-spin", iconSizes[size])}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className={iconSizes[size]}>{leftIcon}</span>}
            {children}
            {rightIcon && <span className={iconSizes[size]}>{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
