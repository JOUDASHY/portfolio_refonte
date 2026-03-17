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
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        ) : null}
        <textarea
          id={inputId}
          ref={ref}
          className={`mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
          {...props}
        />
        {hint ? <p className="mt-1 text-xs text-foreground/60">{hint}</p> : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
