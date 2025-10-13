"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import { useTheme } from "../components/ThemeProvider";
import { getAdaptiveShadow, getAdaptiveBorderColor } from "../lib/shadowUtils";
import { useProfile } from "../hooks/useProfile";

export default function About() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { profile, loading, error } = useProfile();
  const isDark = theme === "dark";
  function AnimatedBox({ children, delayMs = 0 }: { children: React.ReactNode; delayMs?: number }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisible(true);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);
    return (
      <div
        ref={ref}
        className={`${visible ? "animate-fade-in-up" : "opacity-0 translate-y-3"}`}
        style={visible ? { animationDelay: `${delayMs}ms` } : undefined}
      >
        {children}
      </div>
    );
  }
  if (loading) {
    return (
      <section
        id="about"
        className="relative bg-[var(--about-bg)] py-16 sm:py-20 lg:py-24 border-b-2"
        style={{ 
          ["--about-bg" as string]: theme === "light" ? "var(--white)" : "var(--background)",
          borderColor: getAdaptiveBorderColor(isDark),
          boxShadow: getAdaptiveShadow(isDark)
        }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl sm:rounded-3xl border border-accent/30 bg-navy p-4 sm:p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
            <div className="animate-pulse">
              <div className="h-6 w-32 bg-white/10 rounded mb-4"></div>
              <div className="h-12 w-48 bg-white/10 rounded mb-6"></div>
              <div className="h-4 w-full bg-white/10 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-white/10 rounded mb-6"></div>
              <div className="h-16 w-full bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="about"
        className="relative bg-[var(--about-bg)] py-16 sm:py-20 lg:py-24 border-b-2"
        style={{ 
          ["--about-bg" as string]: theme === "light" ? "var(--white)" : "var(--background)",
          borderColor: getAdaptiveBorderColor(isDark),
          boxShadow: getAdaptiveShadow(isDark)
        }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl sm:rounded-3xl border border-accent/30 bg-navy p-4 sm:p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
            <div className="text-center text-white">
              <p className="text-red-400 mb-4">Error loading profile: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-accent text-navy rounded-lg hover:brightness-110 transition-all"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="relative bg-[var(--about-bg)] py-16 sm:py-20 lg:py-24 border-b-2"
      style={{ 
        ["--about-bg" as string]: theme === "light" ? "var(--white)" : "var(--background)",
        borderColor: getAdaptiveBorderColor(isDark),
        boxShadow: getAdaptiveShadow(isDark)
      }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl border border-accent/30 bg-navy p-4 sm:p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          <AnimatedBox>
          <div className="flex items-center gap-2 sm:gap-3 font-medium text-white/90">
            <span className="inline-flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
              <svg viewBox="0 0 24 24" fill="currentColor" className="icon-xs sm:icon-sm text-accent"><path d="M12 2l2.39 4.84L20 8l-3.5 3.41L17.48 18 12 15.6 6.52 18 7.5 11.41 4 8l5.61-1.16L12 2z"/></svg>
            </span>
            <span className="text-var-caption tracking-wider font-medium">INNOVATIVE DEVELOPER</span>
          </div>
          </AnimatedBox>

          <AnimatedBox delayMs={80}>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-lg ring-2 ring-accent/60">
              <Image 
                src={profile?.image || "/logo_nil.png"} 
                alt={profile?.username || "Profile"} 
                fill 
                sizes="(max-width: 640px) 40px, 48px" 
                className="object-cover" 
              />
            </div>
            <h2 className="text-var-title sm:text-3xl font-extrabold text-white">{profile?.username || "Nilsen"}</h2>
          </div>
          </AnimatedBox>

          <AnimatedBox delayMs={160}>
          <div className="mt-4 sm:mt-6">
            <h3 className="text-var-body sm:text-2xl font-semibold text-white inline-flex flex-col">
              <span>{t("about.subtitle")}</span>
              <span className="mt-2 h-[2px] sm:h-[3px] w-20 sm:w-28 rounded bg-accent" />
            </h3>
          </div>
          </AnimatedBox>

          <AnimatedBox delayMs={240}>
            <p className="mt-4 sm:mt-6 text-var-caption sm:text-base text-white/90 leading-relaxed">
              {profile?.about || t("about.description")}
            </p>
          </AnimatedBox>

          <AnimatedBox delayMs={320}>
          <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4">
            <ContactBlock
              icon={(<svg viewBox="0 0 24 24" fill="currentColor" className="icon-sm sm:icon-md"><path d="M21 8V7l-3 2-5-3-5 3-3-2v1l3 2v5l5 3 5-3V10l3-2z"/></svg>)}
              label="EMAIL"
              value={profile?.email || "alitsiryeddynilsen@gmail.com"}
            />
            <ContactBlock
              icon={(<svg viewBox="0 0 24 24" fill="currentColor" className="icon-sm sm:icon-md"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/></svg>)}
              label="LOCATION"
              value={profile?.address || "Isada ,Fianarantsoa"}
            />
            {profile?.phone_number && (
              <ContactBlock
                icon={(<svg viewBox="0 0 24 24" fill="currentColor" className="icon-sm sm:icon-md"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>)}
                label="PHONE"
                value={profile.phone_number}
              />
            )}
          </div>
          </AnimatedBox>

          <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2">
            {[
              "React","Nextjs","Laravel","Nginx","IIS Web Server",
              "Mysql","Docker","Python","Django","SSL Encryption","Git",
            ].map((tag, idx) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-2 sm:px-3 py-1 text-xs text-white/90 ring-1 ring-white/15 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${360 + idx * 80}ms` }}
              >
                {tag}
              </span>
            ))}
          </div>

          <AnimatedBox delayMs={360 + 80 * 10}>
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
            {profile?.link_linkedin && (
              <a href={profile.link_linkedin} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 px-3 sm:px-5 py-1.5 sm:py-2 text-white ring-1 ring-white/20 hover:bg-white/15 transition-all duration-200">
                <svg viewBox="0 0 24 24" fill="currentColor" className="icon-xs sm:icon-sm"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.1c.5-1 1.8-2.2 3.7-2.2 4 0 4.7 2.6 4.7 6V24h-4v-7.5c0-1.8 0-4.1-2.5-4.1-2.5 0-2.9 2-2.9 4V24h-4V8z"/></svg>
                <span className="text-var-caption sm:text-sm">LinkedIn</span>
              </a>
            )}
            {profile?.link_github && (
              <a href={profile.link_github} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 px-3 sm:px-5 py-1.5 sm:py-2 text-white ring-1 ring-white/20 hover:bg-white/15 transition-all duration-200">
                <svg viewBox="0 0 24 24" fill="currentColor" className="icon-xs sm:icon-sm"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span className="text-var-caption sm:text-sm">GitHub</span>
              </a>
            )}
            {profile?.link_facebook && (
              <a href={profile.link_facebook} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 px-3 sm:px-5 py-1.5 sm:py-2 text-white ring-1 ring-white/20 hover:bg-white/15 transition-all duration-200">
                <svg viewBox="0 0 24 24" fill="currentColor" className="icon-xs sm:icon-sm"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span className="text-var-caption sm:text-sm">Facebook</span>
              </a>
            )}
            <a href="/cv.pdf" className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-accent px-3 sm:px-5 py-1.5 sm:py-2 font-semibold text-navy hover:brightness-110 transition-all duration-200">
              <svg viewBox="0 0 24 24" fill="currentColor" className="icon-xs sm:icon-sm"><path d="M5 20h14v-2H5v2zM9 4h6v6h4l-7 7-7-7h4V4z"/></svg>
              <span className="text-var-caption sm:text-sm">Download CV</span>
            </a>
          </div>
          </AnimatedBox>
        </div>
      </div>
    </section>
  );
}

function ContactBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-white/5 dark:bg-white/5 bg-white p-3 sm:p-4 text-white ring-1 ring-white/10 dark:ring-white/10 ring-black/10">
      <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-white/10 dark:bg-white/10 bg-gray-100 ring-1 ring-white/15 dark:ring-white/15 ring-black/15">{icon}</span>
      <div className="leading-tight min-w-0 flex-1">
        <div className="text-var-caption font-semibold tracking-wider text-white/60">{label}</div>
        <div className="text-var-caption sm:text-sm text-white/90 truncate">{value}</div>
      </div>
    </div>
  );
}


