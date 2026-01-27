"use client";

import { forwardRef, TextareaHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  textareaSize?: "sm" | "md" | "lg";
  showCharCount?: boolean;
  fullWidth?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      success,
      helperText,
      textareaSize = "md",
      id,
      disabled,
      required,
      maxLength,
      value,
      showCharCount = false,
      fullWidth = true,
      resize = "vertical",
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState("");
    const currentValue = value !== undefined ? String(value) : internalValue;
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const sizes = {
      sm: "px-3 py-2 text-sm min-h-[80px]",
      md: "px-4 py-2.5 text-base min-h-[120px]",
      lg: "px-4 py-3 text-lg min-h-[160px]",
    };

    const labelSizes = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    const resizeStyles = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const stateStyles = error
      ? "border-error-500 focus:ring-error-500/20 focus:border-error-500"
      : success
      ? "border-success-500 focus:ring-success-500/20 focus:border-success-500"
      : "border-secondary-300 focus:ring-primary-500/20 focus:border-primary-500 hover:border-secondary-400";

    return (
      <div className={cn("w-full", !fullWidth && "w-auto")}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "block font-medium text-secondary-700 mb-1.5",
              labelSizes[textareaSize]
            )}
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            value={value}
            onChange={handleChange}
            className={cn(
              "w-full rounded-lg border bg-white transition-all duration-200",
              "placeholder:text-secondary-400",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              sizes[textareaSize],
              resizeStyles[resize],
              stateStyles,
              disabled && "bg-secondary-100 cursor-not-allowed opacity-60",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${textareaId}-error`
                : success
                ? `${textareaId}-success`
                : helperText
                ? `${textareaId}-helper`
                : undefined
            }
            {...props}
          />

          {/* Status icon */}
          {(error || success) && (
            <div className="absolute right-3 top-3">
              {error && <AlertCircle className="w-5 h-5 text-error-500" />}
              {success && !error && <CheckCircle2 className="w-5 h-5 text-success-500" />}
            </div>
          )}
        </div>

        <div className="flex justify-between items-start mt-1.5 gap-2">
          <div className="flex-1">
            {error && (
              <p id={`${textareaId}-error`} className="text-sm text-error-600">
                {error}
              </p>
            )}
            {success && !error && (
              <p id={`${textareaId}-success`} className="text-sm text-success-600">
                {success}
              </p>
            )}
            {helperText && !error && !success && (
              <p id={`${textareaId}-helper`} className="text-sm text-secondary-500">
                {helperText}
              </p>
            )}
          </div>

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

Textarea.displayName = "Textarea";

export { Textarea };
