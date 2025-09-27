"use client";

import { InputHTMLAttributes, useEffect, useRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  indeterminate?: boolean;
};

export default function Checkbox({ label, className = "", indeterminate, ...props }: Props) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate || false;
    }
  }, [indeterminate]);

  return (
    <label className={`inline-flex items-center gap-2 text-sm text-navy/80 ${className}`}>
      <input 
        ref={checkboxRef}
        type="checkbox" 
        className="h-4 w-4 rounded border-black/20 text-accent focus:ring-accent" 
        {...props} 
      />
      {label}
    </label>
  );
}



