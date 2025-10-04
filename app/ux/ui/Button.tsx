"use client";

import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

export default function Button({ variant = "primary", fullWidth, className = "", ...props }: Props) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-semibold transition-colors button-themed-border";
  const variants: Record<string, string> = {
    primary: "bg-navy text-white hover:opacity-95",
    secondary: "bg-white/20 text-foreground ring-1 ring-white/30 dark:ring-white/30 ring-black/30 hover:bg-white/30",
    ghost: "text-foreground hover:bg-white/10",
  };
  const width = fullWidth ? "w-full" : "";
  
  // Style spécial pour le bouton Annuler avec couleur jaune
  const isCancelButton = props.children === "Annuler";
  const cancelStyle = isCancelButton ? { 
    backgroundColor: '#f68c09', 
    color: 'white',
    border: '1px solid #f68c09'
  } : {};
  
  return (
    <button 
      className={`${base} ${variants[variant]} ${width} ${className}`} 
      style={cancelStyle}
      {...props} 
    />
  );
}



