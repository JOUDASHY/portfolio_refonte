"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../hooks/LanguageProvider";

export default function MaintenancePage() {
  const { t } = useLanguage();
  return (
    <main className="relative min-h-[90vh] flex items-center justify-center px-4">
      {/* Ambient accent glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-20 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute left-1/2 bottom-10 h-52 w-52 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Glass card */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-xl backdrop-blur-md p-6 sm:p-10 text-center">
        {/* Top accent line (solid) */}
        <div className="absolute inset-x-10 -top-[1px] h-[2px] bg-accent opacity-80" />

        {/* Brand logo */}
        <div className="mx-auto mb-5 inline-flex items-center justify-center rounded-full bg-accent/25 ring-1 ring-accent p-3 animate-pulse">
          <div className="relative h-14 w-14">
            <Image src="/logo_nil.png" alt="Logo" fill sizes="56px" className="object-contain" />
          </div>
        </div>
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-accent uppercase">{t("maintenance.by")} Nilsen</p>

        {/* Title without gradient */}
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">
          {t("maintenance.title")}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-foreground/75">
          {t("maintenance.subtitle")}
        </p>

        {/* Status badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-foreground ring-1 ring-white/15">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-accent">
              <path d="M14.7 6.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4l-8.9 8.9a2 2 0 0 1-1.2.6l-2.8.3a.75.75 0 0 1-.82-.82l.3-2.8a2 2 0 0 1 .6-1.2l8.9-8.9z" />
            </svg>
            {t("maintenance.badges.active")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-foreground ring-1 ring-white/15">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-accent">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.27 3.3 1.9a1 1 0 0 1-1 1.73l-3.8-2.19A1 1 0 0 1 11 12V7a1 1 0 0 1 2 0v5.27z" />
            </svg>
            {t("maintenance.badges.soon")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-foreground ring-1 ring-white/15">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-accent animate-spin" style={{animationDuration: "3s"}}>
              <path d="M19.14 12.94a7.97 7.97 0 0 0 .06-.94c0-.32-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.66l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a8.27 8.27 0 0 0-1.62-.94l-.36-2.54A.5.5 0 0 0 13.32 1h-3.64a.5.5 0 0 0-.49.42l-.36 2.54c-.57.23-1.11.53-1.62.94l-2.39-.96a.5.5 0 0 0-.61.22L1.29 7.98a.5.5 0 0 0 .12.66l2.03 1.58c-.04.31-.06.62-.06.94 0 .32.02.63.06.94L1.41 14.68a.5.5 0 0 0-.12.66l1.92 3.32a.5.5 0 0 0 .61.22l2.39-.96c.51.41 1.05.71 1.62.94l.36 2.54a.5.5 0 0 0 .49.42h3.64a.5.5 0 0 0 .49-.42l.36-2.54c.57-.23 1.11-.53 1.62-.94l2.39.96a.5.5 0 0 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.66l-2.03-1.58ZM12 16a4 4 0 1 1 .001-8.001A4 4 0 0 1 12 16Z" />
            </svg>
            {t("maintenance.badges.updating")}
          </span>
        </div>

        {/* Indeterminate progress bar */}
        <div className="mt-7 h-2 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15">
          <div className="h-full w-1/3 animate-[shimmer_1.6s_ease-in-out_infinite] bg-accent/70" />
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-navy hover:brightness-110 transition">
            {t("maintenance.ctaHome")}
          </Link>
        </div>

        {/* Bottom accent line (solid) */}
        <div className="absolute inset-x-10 -bottom-[1px] h-[2px] bg-accent opacity-80" />
      </div>

      {/* Keyframes for shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(20%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
    </main>
  );
}
