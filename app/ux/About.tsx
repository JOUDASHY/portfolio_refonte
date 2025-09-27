"use client";

import Image from "next/image";
import { useLanguage } from "../hooks/LanguageProvider";
import { useTheme } from "../components/ThemeProvider";

export default function About() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  return (
    <section
      id="about"
      className="relative bg-[var(--about-bg)] py-24"
      style={{ ["--about-bg" as string]: theme === "light" ? "var(--white)" : "var(--background)" }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-accent/30 bg-navy p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-3 text-xs font-medium text-white/90">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-accent"><path d="M12 2l2.39 4.84L20 8l-3.5 3.41L17.48 18 12 15.6 6.52 18 7.5 11.41 4 8l5.61-1.16L12 2z"/></svg>
            </span>
            <span className="tracking-wider">INNOVATIVE DEVELOPER</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-lg ring-2 ring-accent/60">
              <Image src="/logo_nil.png" alt="Profile" fill sizes="48px" className="object-contain p-1" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">Nilsen</h2>
          </div>

          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-white inline-flex flex-col">
              <span>{t("about.subtitle")}</span>
              <span className="mt-2 h-[3px] w-28 rounded bg-accent" />
            </h3>
          </div>

          <p className="mt-6 text-white/90 leading-relaxed">
            {t("about.description")}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ContactBlock
              icon={(<svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M21 8V7l-3 2-5-3-5 3-3-2v1l3 2v5l5 3 5-3V10l3-2z"/></svg>)}
              label="EMAIL"
              value="alitsiryeddynilsen@gmail.com"
            />
            <ContactBlock
              icon={(<svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/></svg>)}
              label="LOCATION"
              value="Isada ,Fianarantsoa"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "React","Nextjs","Laravel","Nginx","IIS Web Server",
              "Mysql","Docker","Python","Django","SSL Encryption","Git",
            ].map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 ring-1 ring-white/15">{tag}</span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-white ring-1 ring-white/20 hover:bg-white/15">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.1c.5-1 1.8-2.2 3.7-2.2 4 0 4.7 2.6 4.7 6V24h-4v-7.5c0-1.8 0-4.1-2.5-4.1-2.5 0-2.9 2-2.9 4V24h-4V8z"/></svg>
              Connect
            </a>
            <a href="#" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-white ring-1 ring-white/20 hover:bg-white/15">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              Follow
            </a>
            <a href="/cv.pdf" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 font-semibold text-navy hover:brightness-110">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M5 20h14v-2H5v2zM9 4h6v6h4l-7 7-7-7h4V4z"/></svg>
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-white ring-1 ring-white/10">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">{icon}</span>
      <div className="leading-tight">
        <div className="text-[10px] font-semibold tracking-wider text-white/60">{label}</div>
        <div className="text-sm text-white/90">{value}</div>
      </div>
    </div>
  );
}


