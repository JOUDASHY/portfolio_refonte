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
      return new Date().toLocaleString("fr-FR", { month: "long" });
    } catch {
      return "";
    }
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
        setMonthly(m.map((x: { month: string; count: number }) => ({ label: x.month, value: x.count })));
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
    { label: "Visites (total)", value: String(totalVisits), icon: EyeIcon },
    { label: "Projets", value: String(projectsCount), icon: ProjectIcon },
    { label: "Compétences", value: String(skillsCount), icon: ContactIcon },
    { label: "Taux conv.", value: "—", icon: TrendingUpIcon },
  ]), [totalVisits, projectsCount, skillsCount]);


  const lineData = monthly.length > 0 ? monthly : [
    { label: "Jan", value: 0 },
    { label: "Fév", value: 0 },
    { label: "Mar", value: 0 },
    { label: "Avr", value: 0 },
    { label: "Mai", value: 0 },
    { label: "Jun", value: 0 },
  ];

  const donutData = [
    { label: "Web", value: 60, color: "fill-accent" },
    { label: "Mobile", value: 25, color: "fill-white/40" },
    { label: "Autres", value: 15, color: "fill-white/20" },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl p-4 ring-1 ring-white/10 border border-black/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur data-[theme=light]:bg-white data-[theme=light]:ring-black/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 ring-1 ring-accent/20">
                <k.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-sm text-foreground/60">{k.label}</div>
                <div className="mt-1 text-2xl font-semibold text-foreground">{loading ? <Skeleton w="5rem" /> : k.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 border border-black/10 data-[theme=light]:bg-white data-[theme=light]:ring-black/10 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between text-sm text-foreground/70">
            <span>Visites mensuelles</span>
            {!loading && (
              <span className="text-foreground/50">Mois: {latestMonth} • Total: {totalVisits}</span>
            )}
          </div>
          {loading ? <ChartSkeleton /> : (
            <LineChart
              data={lineData}
              width="100%"
              variant="line"
              smooth
              showArea={false}
              color="#6366f1"
            />
          )}
        </div>

        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 border border-black/10 data-[theme=light]:bg-white data-[theme=light]:ring-black/10">
          <div className="mb-3 text-sm text-foreground/70">Répartition projets</div>
          <div className="flex items-center justify-center">
            {loading ? <ChartSkeleton /> : <DonutChart data={donutData} />}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-foreground/70">
            {donutData.map((d) => (
              <div key={d.label} className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded ${d.color || "bg-accent"}`}></span>
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

 

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="mb-3 text-sm text-foreground/70">Top 10 projets</div>
          <ul className="divide-y divide-white/10 rounded-xl bg-white/0 ring-1 ring-white/10">
            {(loading ? Array.from({ length: 5 }, (_, i) => ({ id: `loading-${i}`, name: '', stars: null })) : topProjects).map((p, idx: number) => (
              <li key={p?.id ?? idx} className="flex items-center justify-between px-3 py-2">
                {loading ? (
                  <Skeleton w="80%" />
                ) : (
                  <>
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-[0.7rem] font-semibold uppercase text-accent ring-1 ring-accent/20">
                        {getInitials(p?.name || "")}
                      </span>
                      <span className="truncate text-foreground/90">{p?.name}</span>
                    </span>
                    <span className="ml-3 inline-flex items-center gap-1 text-xs text-foreground/70">
                      <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
                      <span>{formatStars(p?.stars)}</span>
                      <span className="text-foreground/40">#{idx + 1}</span>
                    </span>
                  </>
                )}
              </li>
            ))}
            {!loading && topProjects.length === 0 && <li className="px-3 py-2 text-foreground/60">Aucun projet</li>}
          </ul>
        </div>
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="mb-3 text-sm text-foreground/70">Top 10 compétences</div>
          <ul className="divide-y divide-white/10 rounded-xl bg-white/0 ring-1 ring-white/10">
            {(loading ? Array.from({ length: 5 }, (_, i) => ({ id: `loading-${i}`, name: '', level: null })) : topSkills).map((s, idx: number) => (
              <li key={s?.id ?? idx} className="flex items-center justify-between px-3 py-2">
                {loading ? (
                  <Skeleton w="70%" />
                ) : (
                  <>
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[0.7rem] font-semibold uppercase text-foreground ring-1 ring-white/20">
                        {getInitials(s?.name || "")}
                      </span>
                      <span className="truncate text-foreground/90">{s?.name}</span>
                    </span>
                    <span className="ml-3 inline-flex items-center gap-1 text-xs text-foreground/70">
                      <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
                      <span>{formatStars(s?.level)}</span>
                      <span className="text-foreground/40">#{idx + 1}</span>
                    </span>
                  </>
                )}
              </li>
            ))}
            {!loading && topSkills.length === 0 && <li className="px-3 py-2 text-foreground/60">Aucune compétence</li>}
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

function ContactIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
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

// Small skeletons
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

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2l2.39 4.84L20 8l-3.5 3.41L17.48 18 12 15.6 6.52 18 7.5 11.41 4 8l5.61-1.16L12 2z" />
    </svg>
  );
}

function formatStars(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  return Number(value).toFixed(1);
}


