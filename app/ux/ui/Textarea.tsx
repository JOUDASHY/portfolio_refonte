"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, hint, className = "", id, ...props }, ref) => {
    const inputId = id || props.name || undefined;
    return (
      <div>
        {label ? (
          <label htmlFor={inputId} className="block text-var-caption sm:text-sm font-medium text-navy/80">
            {label}
          </label>
        ) : null}
        <textarea
          id={inputId}
          ref={ref}
          className={`mt-1 w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 sm:px-3 sm:py-2 text-var-caption sm:text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
          {...props}
        />
        {hint ? <p className="mt-1 text-var-caption text-navy/60">{hint}</p> : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
