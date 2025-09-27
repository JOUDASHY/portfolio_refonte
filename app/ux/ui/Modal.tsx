"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  disableCloseOnBackdrop?: boolean;
  disableCloseOnEsc?: boolean;
  className?: string;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  disableCloseOnBackdrop,
  disableCloseOnEsc,
  className = "",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape" && !disableCloseOnEsc) onClose();
    }
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [open, onClose, disableCloseOnEsc]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (typeof window === "undefined") return null;
  if (!open) return null;

  const sizeClass = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[size];

  return createPortal(
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? "modal-title" : undefined}
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      onMouseDown={(e) => {
        if (disableCloseOnBackdrop) return;
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        className={`relative z-[1001] w-full ${sizeClass} mx-4 rounded-2xl bg-white/95 text-navy shadow-xl ring-1 ring-black/10 ${className}`}
      >
        {title ? (
          <div className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-4">
            <h2 id="modal-title" className="text-base font-semibold text-navy">{title}</h2>
            <button
              aria-label="Close"
              onClick={onClose}
              className="rounded-md p-1 text-navy/70 hover:bg-black/5 hover:text-navy"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M18.3 5.71L12 12.01 5.7 5.7 4.29 7.11 10.6 13.4l-6.3 6.3 1.41 1.41 6.3-6.3 6.3 6.3 1.41-1.41-6.3-6.3 6.3-6.3z"/></svg>
            </button>
          </div>
        ) : null}

        <div className="px-5 py-4 text-navy">{children}</div>

        {footer ? (
          <div className="flex items-center justify-between gap-2 border-t border-black/10 px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}


