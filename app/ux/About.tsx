"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import { useTheme } from "../components/ThemeProvider";
import { getAdaptiveShadow, getAdaptiveBorderColor } from "../lib/shadowUtils";
import { useProfile } from "../hooks/useProfile";
import { useCV } from "../hooks/useCV";

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function About() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { profile, loading, error } = useProfile();
  const { cv, getDownloadUrl } = useCV();
  const isDark = theme === "dark";

  if (loading) {
    return (
      <section id="about" className="relative bg-white py-10 sm:py-20 lg:py-32 border-b-2 overflow-hidden"
        style={{ borderColor: getAdaptiveBorderColor(isDark), boxShadow: getAdaptiveShadow(isDark) }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="aspect-[4/5] max-w-xs sm:max-w-sm mx-auto w-full rounded-2xl bg-navy/10" />
            <div className="space-y-4">
              <div className="h-3 w-20 bg-navy/10 rounded-full" />
              <div className="h-8 w-48 bg-navy/10 rounded-xl" />
              <div className="space-y-2 pt-2">
                {[1, 2, 3].map(i => <div key={i} className="h-3 bg-navy/10 rounded" style={{ width: `${90 - i * 10}%` }} />)}
              </div>
              <div className="grid grid-cols-3 gap-3 pt-4">
                {[0, 1, 2].map(i => <div key={i} className="h-16 bg-navy/10 rounded-xl" />)}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="about" className="bg-white py-10 border-b-2 border-accent/20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-accent text-sm mb-3">{t("about.error")}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:brightness-110 transition-all">
            {t("about.retry")}
          </button>
        </div>
      </section>
    );
  }

  const stats = [
    { num: "3+",   sub: t("about.stats.years")        },
    { num: "20+",  sub: t("about.stats.projects")     },
    { num: "100%", sub: t("about.stats.satisfaction") },
  ];

  const stack = [
    { label: t("about.stack.frontend"), items: ["React", "Next.js", "Tailwind"] },
    { label: t("about.stack.backend"),  items: ["Laravel", "Django", "Node.js"] },
    { label: t("about.stack.devops"),   items: ["Docker", "Nginx", "Git", "SSL"] },
    { label: t("about.stack.database"), items: ["MySQL", "PostgreSQL"]           },
  ];

  const socials = [
    { href: profile?.link_linkedin, label: "LinkedIn",
      icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.1c.5-1 1.8-2.2 3.7-2.2 4 0 4.7 2.6 4.7 6V24h-4v-7.5c0-1.8 0-4.1-2.5-4.1-2.5 0-2.9 2-2.9 4V24h-4V8z"/></svg> },
    { href: profile?.link_github, label: "GitHub",
      icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
    { href: profile?.link_facebook, label: "Facebook",
      icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
    { href: profile?.link_whatsapp ? `https://wa.me/${profile.link_whatsapp.replace(/\D/g, "")}` : null, label: "WhatsApp",
      icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg> },
  ];

  return (
    <section id="about" className="relative bg-white py-10 sm:py-20 lg:py-32 border-b-2 overflow-hidden"
      style={{ borderColor: getAdaptiveBorderColor(isDark), boxShadow: getAdaptiveShadow(isDark) }}>

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-navy/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <Reveal className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-4 sm:py-2 rounded-full bg-white border border-accent/30 shadow-sm mb-3 sm:mb-5">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] sm:text-sm font-medium text-navy">{t("about.eyebrow")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-navy mb-2 sm:mb-4">
            {t("about.title")}
          </h2>
          <p className="text-xs sm:text-lg text-navy/60 max-w-xl mx-auto">{t("about.subtitle")}</p>
        </Reveal>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-start">

          {/* ── Photo ── */}
          <Reveal delay={80} className="relative flex justify-center">
            <div className="relative w-full max-w-[320px] sm:max-w-sm lg:max-w-md aspect-[4/5] rounded-2xl overflow-hidden bg-navy/5 shadow-xl group">
              <Image
                src="/nilsen-Photoroom.png"
                alt={profile?.username || "Nilsen – Développeur Full-Stack"}
                fill
                sizes="(max-width: 640px) 260px, (max-width: 1024px) 384px, 448px"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-navy/80 to-transparent" />
              <div className="absolute inset-0 rounded-2xl border-2 border-accent/60 pointer-events-none z-30" />

              {/* Experience badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-navy rounded-xl sm:rounded-2xl shadow-xl px-3 py-2 sm:px-4 sm:py-3 z-20">
                <p className="text-lg sm:text-2xl font-black text-accent leading-none">3+</p>
                <p className="text-white/50 text-[9px] sm:text-xs mt-0.5 leading-tight">{t("about.stats.years")}</p>
              </div>

              {/* Name chip */}
              <div className="absolute bottom-3 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                <p className="text-white font-extrabold text-sm sm:text-lg tracking-tight leading-snug">
                  {profile?.username || "Nilsen Tovohery"}
                </p>
                <p className="text-accent text-[11px] sm:text-sm font-semibold mt-0.5">{t("about.subtitle")}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="block h-[2px] w-6 sm:w-8 rounded-full bg-accent" />
                  <span className="text-accent text-[9px] sm:text-xs font-semibold tracking-widest uppercase">{t("about.location")}</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── Content ── */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-7">

            {/* Description */}
            <Reveal delay={120}>
              <p className="text-navy/70 text-xs sm:text-[15px] leading-relaxed sm:leading-[1.85]">{t("about.description")}</p>
            </Reveal>

            {/* Contact info */}
            <Reveal delay={180}>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                {[
                  { label: profile?.email || "alitsiryeddynilsen@gmail.com",
                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
                  { label: profile?.address || "Fianarantsoa, Madagascar",
                    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
                ].map(({ label, icon }) => (
                  <div key={label} className="flex items-center gap-2 text-xs sm:text-sm text-navy">
                    <span className="text-accent">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={240}>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {stats.map(({ num, sub }) => (
                  <div key={sub} className="text-center p-2.5 sm:p-5 rounded-lg sm:rounded-xl bg-white border border-accent/20 shadow-sm hover:border-accent/50 transition-all duration-300">
                    <p className="text-lg sm:text-3xl font-bold text-accent">{num}</p>
                    <p className="text-[9px] sm:text-xs text-navy mt-0.5 sm:mt-1 leading-tight">{sub}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Stack */}
            <Reveal delay={300}>
              <p className="text-[9px] sm:text-xs font-bold text-navy/40 tracking-widest uppercase mb-2 sm:mb-3">{t("about.stack.title")}</p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {stack.map(({ label, items }) => (
                  <div key={label} className="relative rounded-lg sm:rounded-xl bg-white border border-slate-200 p-2.5 sm:p-4 shadow-sm hover:shadow-md group overflow-hidden transition-all duration-300">
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <p className="relative text-[10px] sm:text-xs font-bold text-navy mb-1.5 sm:mb-2">{label}</p>
                    <div className="relative flex flex-wrap gap-1">
                      {items.map(item => (
                        <span key={item} className="text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Socials + CV */}
            <Reveal delay={380}>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                <div className="flex gap-1.5 sm:gap-2">
                  {socials.filter(s => s.href).map(({ href, label, icon }) => (
                    <a key={label} href={href!} target="_blank" rel="noreferrer noopener" aria-label={label}
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl bg-navy text-accent hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-md sm:shadow-lg">
                      {icon}
                    </a>
                  ))}
                </div>

                <div className="w-px h-6 sm:h-8 bg-accent/20" />

                {cv && (
                  <div className="flex gap-1.5 sm:gap-2">
                    <a href={cv.file_url} target="_blank" rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-navy border border-accent/30 hover:border-accent hover:text-accent transition-all duration-200">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                      {t("about.cv.view")}
                    </a>
                    <a href={getDownloadUrl()} target="_blank" rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-accent text-xs sm:text-sm font-bold text-white hover:brightness-110 shadow-md sm:shadow-lg shadow-accent/30 transition-all duration-200 group">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-y-0.5 transition-transform">
                        <path d="M5 20h14v-2H5v2zM9 4h6v6h4l-7 7-7-7h4V4z"/>
                      </svg>
                      {t("about.cv.download")}
                    </a>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
