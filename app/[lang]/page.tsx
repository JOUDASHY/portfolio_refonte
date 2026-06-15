"use client";

import Hero from "../ux/Hero";
import About from "../ux/About";
import Skills from "../ux/Skills";
import Education from "../ux/Education";
import Projects from "../ux/Projects";
import Gallery from "../ux/Gallery";
import Experience from "../ux/Experience";
import Internships from "../ux/Internships";
import Contact from "../ux/Contact";
import SocialDock from "../ux/SocialDock";
import { useVisitTracker } from "../hooks/useVisitTracker";
import { useLanguage } from "../hooks/LanguageProvider";

/* ── TechExpert Banner ─────────────────────────────────────── */
function TechExpertBanner({ title, subtitle, badgeLabel }: { title: string; subtitle: string; badgeLabel: string }) {
  const row1 = ["React", "Next.js", "TypeScript", "Tailwind", "Laravel", "Django", "Docker", "Nginx", "MySQL", "PostgreSQL", "Git", "SSL"];
  const row2 = ["Node.js", "Python", "PHP", "Linux", "IIS", "Redis", "REST API", "CI/CD", "Webpack", "Prisma", "JWT", "DevOps"];
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-navy py-8 sm:py-14 lg:py-20">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-55"
        style={{ backgroundImage: "url('https://wallpapercave.com/wp/wp10599480.jpg')" }} />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/60 via-navy/50 to-navy/30" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-center mx-auto max-w-7xl px-6 lg:px-12">
        <div className="lg:pr-12 lg:border-r lg:border-white/10">
          <div className="flex items-center gap-2 mb-3 sm:mb-5">
            <span className="font-mono text-accent text-xs sm:text-sm">~/portfolio</span>
            <span className="font-mono text-white/30 text-xs sm:text-sm">$</span>
            <span className="font-mono text-white/50 text-xs sm:text-sm animate-pulse">_</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-5xl font-black text-white leading-tight tracking-tight">{title}</h2>
          <div className="mt-2 sm:mt-3 w-12 sm:w-16 h-1 rounded-full bg-accent" />
          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-white/50 max-w-md leading-relaxed">{subtitle}</p>
          <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-3 sm:px-4 py-1.5 sm:py-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-accent">
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
            <span className="text-xs font-semibold text-accent">{row1.length + row2.length}+ {badgeLabel}</span>
          </div>
        </div>

        <div className="lg:pl-12 flex flex-col gap-3 sm:gap-4 overflow-hidden">
          <div className="flex gap-3 animate-scroll whitespace-nowrap">
            {[...row1, ...row1].map((tech, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />{tech}
              </span>
            ))}
          </div>
          <div className="flex gap-3 whitespace-nowrap" style={{ animation: "scroll 15s linear infinite reverse" }}>
            {[...row2, ...row2].map((tech, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 shrink-0 rounded-lg border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-semibold text-accent/80">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />{tech}
              </span>
            ))}
          </div>
          <div className="flex gap-3 whitespace-nowrap" style={{ animation: "scroll 25s linear infinite" }}>
            {[...row1.slice(4), ...row2.slice(4), ...row1.slice(4), ...row2.slice(4)].map((tech, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 shrink-0 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/40">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Collaboration Banner ──────────────────────────────────── */
function CollaborationBanner({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden bg-navy border-y border-white/10">
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_60%_50%,rgba(246,140,9,0.07),transparent)]" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[160px] sm:text-[220px] font-black text-white/[0.025] leading-none select-none pointer-events-none">&</span>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[260px] sm:min-h-[320px] lg:min-h-[380px]">
        {/* LEFT — with bg image */}
        <div className="relative flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-8 sm:py-14 lg:py-20 overflow-hidden">
          {/* BG image on left column */}
          <div className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('https://wallpaperaccess.com/full/5675692.jpg')" }} />
          <div className="absolute inset-0 bg-navy/75" />
          <div className="absolute left-0 top-12 bottom-12 w-1 rounded-full bg-gradient-to-b from-transparent via-accent to-transparent" />
          <span className="relative z-10 text-[9px] sm:text-xs font-bold tracking-[0.3em] text-accent/70 uppercase mb-3 sm:mb-4">Open to collaboration</span>
          <h2 className="relative z-10 text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">{title}</h2>
          <p className="relative z-10 mt-3 sm:mt-4 text-xs sm:text-base text-white/60 max-w-sm leading-relaxed">{subtitle}</p>
          <div className="relative z-10 mt-5 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
            <a href="#contact" className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-black text-navy hover:brightness-110 shadow-lg shadow-accent/25 transition-all duration-200 hover:scale-105">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              Me contacter
            </a>
            <a href="#projects" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white/80 hover:border-accent/40 hover:text-white transition-all duration-200">
              Voir projets →
            </a>
          </div>
        </div>

        {/* RIGHT — 4 stats cards */}
        <div className="relative grid grid-cols-2 divide-x divide-y divide-white/[0.07] overflow-hidden">
          {[
            { num: "3+",   label: "Ans d'expérience",   icon: "⚡", desc: "Full-Stack & DevOps",  bg: "https://wallpaperaccess.com/full/5675692.jpg" },
            { num: "20+",  label: "Projets livrés",     icon: "🚀", desc: "Web · Mobile · Infra", bg: "https://53.fs1.hubspotusercontent-na1.net/hubfs/53/Projet%20web-1.webp" },
            { num: "100%", label: "Satisfaction client", icon: "✦", desc: "Qualité garantie",      bg: "https://www.advancia-teleservices.com/wp-content/uploads/2025/05/satisfaction-client-croissance-entreprise-1.jpg" },
            { num: "∞",    label: "Passion du code",    icon: "💡", desc: "Always learning",       bg: "https://assets.content.technologyadvice.com/635831819349231309_9ba5c39c6c.webp" },
          ].map(({ num, label, icon, desc, bg }) => (
            <div key={label} className="group relative flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10 overflow-hidden cursor-default min-h-[110px] sm:min-h-[140px] lg:min-h-[160px]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${bg}')` }} />
              <div className="absolute inset-0 bg-navy/70 group-hover:bg-navy/60 transition-colors duration-300" />
              <span className="text-base sm:text-xl mb-1 sm:mb-2 relative z-10">{icon}</span>
              <p className="text-xl sm:text-3xl lg:text-4xl font-black text-accent leading-none relative z-10">{num}</p>
              <p className="text-[10px] sm:text-sm font-semibold text-white/90 mt-1 relative z-10">{label}</p>
              <p className="hidden sm:block text-[10px] sm:text-xs text-white/50 mt-0.5 relative z-10">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
export default function Home() {
  useVisitTracker();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <CollaborationBanner title={t("banner.collaboration")} subtitle={t("banner.collaborationSubtitle")} />
      <Skills />
      <TechExpertBanner title={t("banner.techExpert")} subtitle={t("banner.techExpertSubtitle")} badgeLabel={t("banner.techExpertBadge")} />
      <Experience />
      <Projects />
      <Gallery />
      <Education />
      <Contact />
      <SocialDock />
      <Internships />

    </div>
  );
}
