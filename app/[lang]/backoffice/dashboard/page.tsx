"use client";

import { useEffect, useMemo, useState } from "react";
import LineChart from "../../../ux/charts/LineChart";
import DonutChart from "../../../ux/charts/DonutChart";
import { visitService } from "../../../services/backoffice/visitService";
import { projetService } from "../../../services/backoffice/projetService";
import { competenceService } from "../../../services/backoffice/competenceService";

interface ProjectData {
  id: number;
  nom: string;
  average_score?: number | null;
}

interface SkillData {
  id: number;
  name: string;
  niveau?: number | null;
}

export default function DashboardPage() {
  const [monthly, setMonthly] = useState<{ label: string; value: number }[]>([]);
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [projectsCount, setProjectsCount] = useState<number>(0);
  const [skillsCount, setSkillsCount] = useState<number>(0);
  const [topProjects, setTopProjects] = useState<{ id: string; name: string; stars?: number | null }[]>([]);
  const [topSkills, setTopSkills] = useState<{ id: string; name: string; level?: number | null }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const latestMonth = useMemo(() => {
    if (monthly && monthly.length > 0) return monthly[monthly.length - 1]?.label || "";
    try {
      return new Date().toLocaleString("fr-FR", { month: "long", year: "numeric" });
    } catch {
      return "";
    }
  }, [monthly]);

  // Calcul de la tendance (variation mois actuel vs mois précédent)
  const trend = useMemo(() => {
    if (monthly.length < 2) return null;
    const current = monthly[monthly.length - 1]?.value || 0;
    const previous = monthly[monthly.length - 2]?.value || 0;
    if (previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0,
      raw: change
    };
  }, [monthly]);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: monthlyData }, { data: totalData }, { data: projects }, { data: skills }] = await Promise.all([
          visitService.monthlyStats(),
          visitService.total(),
          projetService.list(),
          competenceService.list(),
        ]);
        const m = Array.isArray(monthlyData) ? monthlyData : [];
        const sorted = [...m].reverse();
        setMonthly(sorted.map((x: { month: string; count: number }) => ({ label: x.month, value: x.count })));
        setTotalVisits(Number(totalData?.total_visits || 0));

        const projArr = Array.isArray(projects) ? projects : [];
        setProjectsCount(projArr.length);
        setTopProjects(projArr.slice(0, 10).map((p: ProjectData) => ({ id: String(p.id), name: p.nom, stars: p.average_score ?? null })));

        const skillArr = Array.isArray(skills) ? skills : [];
        setSkillsCount(skillArr.length);
        setTopSkills(skillArr.slice(0, 10).map((s: SkillData) => ({ id: String(s.id), name: s.name, level: s.niveau ?? null })));
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Échec du chargement du tableau de bord");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kpis = useMemo(() => ([
    { 
      label: "Visites totales", 
      value: String(totalVisits), 
      icon: EyeIcon,
      color: "from-[#f68c09]/20 to-[#f68c09]/30",
      iconBg: "bg-[#f68c09]/15",
      iconColor: "text-[#f68c09]",
      trend: trend
    },
    { 
      label: "Projets", 
      value: String(projectsCount), 
      icon: ProjectIcon,
      color: "from-[#f68c09]/20 to-[#f68c09]/30",
      iconBg: "bg-[#f68c09]/15",
      iconColor: "text-[#f68c09]"
    },
    { 
      label: "Compétences", 
      value: String(skillsCount), 
      icon: CodeIcon,
      color: "from-[#f68c09]/20 to-[#f68c09]/30",
      iconBg: "bg-[#f68c09]/15",
      iconColor: "text-[#f68c09]"
    },
    { 
      label: "Taux conversion", 
      value: "—", 
      icon: TrendingUpIcon,
      color: "from-[#f68c09]/20 to-[#f68c09]/30",
      iconBg: "bg-[#f68c09]/15",
      iconColor: "text-[#f68c09]"
    },
  ]), [totalVisits, projectsCount, skillsCount, trend]);


  const lineData = monthly.length > 0 ? monthly : [
    { label: "Jan", value: 0 },
    { label: "Fév", value: 0 },
    { label: "Mar", value: 0 },
    { label: "Avr", value: 0 },
    { label: "Mai", value: 0 },
    { label: "Jun", value: 0 },
  ];

  const donutData = [
    { label: "Web", value: 60, color: "fill-[#f68c09]" },
    { label: "Mobile", value: 25, color: "fill-[#f68c09]/70" },
    { label: "Autres", value: 15, color: "fill-[#f68c09]/40" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-sm text-foreground/60 mt-1">Vue d'ensemble de vos statistiques</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-foreground/60">
          <CalendarIcon className="w-4 h-4" />
          <span>{new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/20 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <AlertIcon className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, idx) => (
          <div
            key={k.label}
            className="group relative overflow-hidden rounded-2xl p-5 ring-1 ring-white/10 border border-black/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur data-[theme=light]:bg-white data-[theme=light]:ring-black/10 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom"
            style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "backwards" }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${k.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${k.iconBg} ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300`}>
                  <k.icon className={`h-6 w-6 ${k.iconColor}`} />
                </div>
                {k.trend && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${k.trend.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {k.trend.isPositive ? <TrendUpIcon className="w-3 h-3" /> : <TrendDownIcon className="w-3 h-3" />}
                    <span>{k.trend.value}%</span>
                  </div>
                )}
              </div>
              <div className="text-sm font-medium text-foreground/60 mb-1">{k.label}</div>
              <div className="text-3xl font-bold text-foreground">
                {loading ? <Skeleton w="5rem" h="2rem" /> : k.value}
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 p-6 ring-1 ring-white/10 border border-black/10 backdrop-blur data-[theme=light]:bg-white data-[theme=light]:ring-black/10 lg:col-span-2 hover:shadow-xl transition-shadow duration-300 animate-in slide-in-from-left delay-200">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <ChartIcon className="w-5 h-5 text-[#f68c09]" />
                Visites mensuelles
              </h3>
              {!loading && (
                <p className="text-xs text-foreground/50 mt-1">
                  {latestMonth} • {totalVisits.toLocaleString()} visites au total
                </p>
              )}
            </div>
            {trend && !loading && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${trend.isPositive ? 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20' : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'}`}>
                {trend.isPositive ? <TrendUpIcon className="w-4 h-4" /> : <TrendDownIcon className="w-4 h-4" />}
                <span>{trend.isPositive ? '+' : ''}{trend.value}% vs mois dernier</span>
              </div>
            )}
          </div>
          {loading ? <ChartSkeleton /> : (
            <div className="mt-4">
              <LineChart
                data={lineData}
                width="100%"
                variant="line"
                smooth
                showArea={false}
                color="#f68c09"
              />
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 p-6 ring-1 ring-white/10 border border-black/10 backdrop-blur data-[theme=light]:bg-white data-[theme=light]:ring-black/10 hover:shadow-xl transition-shadow duration-300 animate-in slide-in-from-right delay-300">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-[#f68c09]" />
            Répartition projets
          </h3>
          <div className="flex items-center justify-center">
            {loading ? <ChartSkeleton /> : <DonutChart data={donutData} />}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 text-xs">
            {donutData.map((d) => (
              <div key={d.label} className="flex items-center justify-between p-2 rounded-lg bg-white/5 ring-1 ring-white/10">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${d.color.replace('fill-', 'bg-')}`}></span>
                  <span className="text-foreground/80 font-medium">{d.label}</span>
                </div>
                <span className="text-foreground/60 font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Top Lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 p-6 ring-1 ring-white/10 border border-black/10 backdrop-blur data-[theme=light]:bg-white data-[theme=light]:ring-black/10 hover:shadow-xl transition-shadow duration-300 animate-in slide-in-from-left delay-400">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <StarIcon className="w-5 h-5 text-[#f68c09]" />
            Top 10 projets
          </h3>
          <ul className="divide-y divide-white/5 rounded-xl bg-white/0 ring-1 ring-white/5">
            {(loading ? Array.from({ length: 5 }, (_, i) => ({ id: `loading-${i}`, name: '', stars: null })) : topProjects).map((p, idx: number) => (
              <li key={p?.id ?? idx} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
                {loading ? (
                  <Skeleton w="80%" />
                ) : (
                  <>
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f68c09]/20 to-[#f68c09]/30 text-xs font-bold uppercase text-[#f68c09] ring-1 ring-[#f68c09]/30 group-hover:scale-110 transition-transform">
                        {getInitials(p?.name || "")}
                      </span>
                      <span className="truncate text-foreground/90 font-medium">{p?.name}</span>
                    </span>
                    <span className="ml-3 inline-flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#f68c09]/10 ring-1 ring-[#f68c09]/20">
                        <StarIcon className="h-3.5 w-3.5 text-[#f68c09]" />
                        <span className="text-xs font-semibold text-[#f68c09]">{formatStars(p?.stars)}</span>
                      </span>
                      <span className="text-xs font-medium text-foreground/40">#{idx + 1}</span>
                    </span>
                  </>
                )}
              </li>
            ))}
            {!loading && topProjects.length === 0 && (
              <li className="px-4 py-8 text-center text-foreground/40 text-sm">Aucun projet disponible</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 p-6 ring-1 ring-white/10 border border-black/10 backdrop-blur data-[theme=light]:bg-white data-[theme=light]:ring-black/10 hover:shadow-xl transition-shadow duration-300 animate-in slide-in-from-right delay-500">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <CodeIcon className="w-5 h-5 text-[#f68c09]" />
            Top 10 compétences
          </h3>
          <ul className="divide-y divide-white/5 rounded-xl bg-white/0 ring-1 ring-white/5">
            {(loading ? Array.from({ length: 5 }, (_, i) => ({ id: `loading-${i}`, name: '', level: null })) : topSkills).map((s, idx: number) => (
              <li key={s?.id ?? idx} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
                {loading ? (
                  <Skeleton w="70%" />
                ) : (
                  <>
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f68c09]/20 to-[#f68c09]/30 text-xs font-bold uppercase text-[#f68c09] ring-1 ring-[#f68c09]/30 group-hover:scale-110 transition-transform">
                        {getInitials(s?.name || "")}
                      </span>
                      <span className="truncate text-foreground/90 font-medium">{s?.name}</span>
                    </span>
                    <span className="ml-3 inline-flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-3 w-3 ${i < (s?.level || 0) ? 'text-[#f68c09]' : 'text-white/20'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-foreground/40">#{idx + 1}</span>
                    </span>
                  </>
                )}
              </li>
            ))}
            {!loading && topSkills.length === 0 && (
              <li className="px-4 py-8 text-center text-foreground/40 text-sm">Aucune compétence disponible</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}


// Icons
function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 11a4 4 0 110-8 4 4 0 010 8z" />
    </svg>
  );
}

function ProjectIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 4h16v4H4V4zm0 6h10v10H4V10zm12 0h4v10h-4V10z" />
    </svg>
  );
}

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  );
}

function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
    </svg>
  );
}

function TrendUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function TrendDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  );
}

function ChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9M13 17V5M8 17v-3" />
    </svg>
  );
}

function PieChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2l2.39 4.84L20 8l-3.5 3.41L17.48 18 12 15.6 6.52 18 7.5 11.41 4 8l5.61-1.16L12 2z" />
    </svg>
  );
}

function Skeleton({ w = "100%", h = "1rem" }: { w?: string; h?: string }) {
  return <span className="inline-block animate-pulse rounded bg-white/10" style={{ width: w, height: h }} />;
}

function ChartSkeleton() {
  return (
    <div className="h-48 w-full animate-pulse rounded-xl bg-white/10" />
  );
}

function getInitials(name: string): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] || "";
  const second = words[1]?.[0] || (words[0]?.[1] || "");
  return (first + second).toUpperCase();
}

function formatStars(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  return Number(value).toFixed(1);
}
