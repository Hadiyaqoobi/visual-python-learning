"use client";

import { forwardRef, InputHTMLAttributes, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, X, AlertCircle, CheckCircle2 } from "lucide-react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputSize?: "sm" | "md" | "lg";
  showPasswordToggle?: boolean;
  clearable?: boolean;
  showCharCount?: boolean;
  fullWidth?: boolean;
  onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      inputSize = "md",
      type = "text",
      id,
      disabled,
      required,
      maxLength,
      value,
      showPasswordToggle = false,
      clearable = false,
      showCharCount = false,
      fullWidth = true,
      onChange,
      onClear,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState("");

    // Use controlled or uncontrolled value
    const currentValue = value !== undefined ? String(value) : internalValue;

    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    // Determine if we need right padding for icons/buttons
    const hasRightElement = rightIcon || (isPassword && showPasswordToggle) || (clearable && currentValue);
    const rightElementCount = [
      rightIcon,
      isPassword && showPasswordToggle,
      clearable && currentValue,
    ].filter(Boolean).length;

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-4 py-3 text-lg",
    };

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-5 h-5",
    };

    const labelSizes = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    // Handle internal change for uncontrolled usage
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    // Handle clear button
    const handleClear = () => {
      setInternalValue("");
      onClear?.();
      // Create synthetic event for controlled components
      const syntheticEvent = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    // Determine border/ring color based on state
    const stateStyles = error
      ? "border-error-500 focus:ring-error-500/20 focus:border-error-500"
      : success
      ? "border-success-500 focus:ring-success-500/20 focus:border-success-500"
      : "border-secondary-300 focus:ring-primary-500/20 focus:border-primary-500 hover:border-secondary-400";

    return (
      <div className={cn("w-full", !fullWidth && "w-auto")}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block font-medium text-secondary-700 mb-1.5",
              labelSizes[inputSize]
            )}
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none",
                iconSizes[inputSize]
              )}
            >
              {leftIcon}
            </div>
          )}

          {/* Input element */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            value={value}
            onChange={handleChange}
            className={cn(
              "w-full rounded-lg border bg-white transition-all duration-200",
              "placeholder:text-secondary-400",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              sizes[inputSize],
              leftIcon && "pl-10",
              hasRightElement && `pr-${10 + (rightElementCount - 1) * 8}`,
              stateStyles,
              disabled && "bg-secondary-100 cursor-not-allowed opacity-60",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${inputId}-error`
                : success
                ? `${inputId}-success`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {/* Right side elements container */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Success icon */}
            {success && !error && (
              <CheckCircle2 className={cn(iconSizes[inputSize], "text-success-500")} />
            )}

            {/* Error icon */}
            {error && (
              <AlertCircle className={cn(iconSizes[inputSize], "text-error-500")} />
            )}

            {/* Clear button */}
            {clearable && currentValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors rounded-full hover:bg-secondary-100"
                aria-label="Clear input"
              >
                <X className={iconSizes[inputSize]} />
              </button>
            )}

            {/* Password toggle */}
            {isPassword && showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors rounded-full hover:bg-secondary-100"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className={iconSizes[inputSize]} />
                ) : (
                  <Eye className={iconSizes[inputSize]} />
                )}
              </button>
            )}

            {/* Custom right icon */}
            {rightIcon && !error && !success && (
              <span className={cn(iconSizes[inputSize], "text-secondary-400")}>
                {rightIcon}
              </span>
            )}
          </div>
        </div>

        {/* Bottom row: messages and character count */}
        <div className="flex justify-between items-start mt-1.5 gap-2">
          <div className="flex-1">
            {/* Error message */}
            {error && (
              <p
                id={`${inputId}-error`}
                className="text-sm text-error-600 flex items-center gap-1"
              >
                {error}
              </p>
            )}

            {/* Success message */}
            {success && !error && (
              <p
                id={`${inputId}-success`}
                className="text-sm text-success-600 flex items-center gap-1"
              >
                {success}
              </p>
            )}

            {/* Helper text */}
            {helperText && !error && !success && (
              <p id={`${inputId}-helper`} className="text-sm text-secondary-500">
                {helperText}
              </p>
            )}
          </div>

          {/* Character count */}
          {showCharCount && maxLength && (
            <p
              className={cn(
                "text-sm",
                currentValue.length >= maxLength
                  ? "text-error-500"
                  : currentValue.length >= maxLength * 0.8
                  ? "text-warning-500"
                  : "text-secondary-400"
              )}
            >
              {currentValue.length}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
