"use client";

import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Checkbox({ label, className = "", ...props }: Props) {
  return (
    <label className={`inline-flex items-center gap-2 text-sm text-navy/80 ${className}`}>
      <input type="checkbox" className="h-4 w-4 rounded border-black/20 text-accent focus:ring-accent" {...props} />
      {label}
    </label>
  );
}



