"use client";

import { Fragment, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  footer?: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
}: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl",
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleOverlayClick}
      />

      {/* Modal container */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        {/* Modal content */}
        <div
          className={cn(
            "relative w-full bg-white rounded-xl shadow-xl animate-scale-in",
            sizes[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-6 pb-0">
              <div>
                {title && (
                  <h2 className="text-xl font-semibold text-secondary-900">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-secondary-500">{description}</p>
                )}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 -m-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-secondary-50 rounded-b-xl border-t border-secondary-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
