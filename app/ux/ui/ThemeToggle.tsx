"use client";

import { useTheme } from "../../components/ThemeProvider";

type ThemeToggleProps = {
  variant?: "inline" | "block";
  className?: string;
};

export default function ThemeToggle({ variant = "inline", className = "" }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();

  if (variant === "block") {
    return (
      <button
        aria-label="Toggle theme"
        onClick={toggle}
        className={`mt-1 sm:mt-2 relative w-full rounded-full py-2 sm:py-2.5 px-10 ring-1 transition-colors ${className}`}
        style={{
          background: theme === "light"
            ? "linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.03))"
            : "linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
          borderColor: theme === "light" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"
        }}
      >
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">🌙</span>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm">☀️</span>
        <span
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 left-2 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-accent shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out ${
            theme === "light" ? "translate-x-[calc(100%+100%)] sm:translate-x-[calc(100%+100%)]" : "translate-x-0"
          }`}
        />
      </button>
    );
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className={`relative h-6 w-12 sm:h-7 sm:w-14 rounded-full ring-1 transition-colors flex-shrink-0 ${className}`}
      style={{
        background: theme === "light"
          ? "linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.03))"
          : "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
        borderColor: theme === "light" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)",
      }}
    >
      <span className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 text-xs">🌙</span>
      <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-xs">☀️</span>
      <span
        className={`absolute top-1/2 -translate-y-1/2 left-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-accent shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out ${
          theme === "light" ? "translate-x-[calc(100%+0.25rem)] sm:translate-x-[calc(100%+0.25rem)]" : "translate-x-0"
        }`}
      />
    </button>
  );
}


