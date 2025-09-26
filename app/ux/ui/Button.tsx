"use client";

import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

export default function Button({ variant = "primary", fullWidth, className = "", ...props }: Props) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 font-semibold transition-colors";
  const variants: Record<string, string> = {
    primary: "bg-navy text-white hover:opacity-95",
    secondary: "bg-white/10 text-foreground ring-1 ring-white/20 hover:bg-white/15",
    ghost: "text-foreground hover:bg-white/10",
  };
  const width = fullWidth ? "w-full" : "";
  return <button className={`${base} ${variants[variant]} ${width} ${className}`} {...props} />;
}



