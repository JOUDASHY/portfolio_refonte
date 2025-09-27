import BarChart from "../../../ux/charts/BarChart";
import LineChart from "../../../ux/charts/LineChart";
import DonutChart from "../../../ux/charts/DonutChart";

export default function DashboardPage() {
  const kpis = [
    { label: "Vues", value: "12.4k", icon: EyeIcon },
    { label: "Projets", value: "24", icon: ProjectIcon },
    { label: "Contacts", value: "58", icon: ContactIcon },
    { label: "Taux conv.", value: "3.2%", icon: TrendingUpIcon },
  ];

  const barData = [
    { label: "Lun", value: 7 },
    { label: "Mar", value: 9 },
    { label: "Mer", value: 5 },
    { label: "Jeu", value: 11 },
    { label: "Ven", value: 8 },
    { label: "Sam", value: 4 },
    { label: "Dim", value: 6 },
  ];

  const lineData = [
    { label: "Jan", value: 12 },
    { label: "Fév", value: 14 },
    { label: "Mar", value: 9 },
    { label: "Avr", value: 16 },
    { label: "Mai", value: 18 },
    { label: "Jun", value: 15 },
  ];

  const donutData = [
    { label: "Web", value: 60, color: "fill-accent" },
    { label: "Mobile", value: 25, color: "fill-white/40" },
    { label: "Autres", value: 15, color: "fill-white/20" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 border border-black/10 data-[theme=light]:bg-white data-[theme=light]:ring-black/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <k.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-sm text-foreground/60">{k.label}</div>
                <div className="mt-1 text-2xl font-semibold text-foreground">{k.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 border border-black/10 data-[theme=light]:bg-white data-[theme=light]:ring-black/10 lg:col-span-2">
          <div className="mb-3 text-sm text-foreground/70">Trafic hebdomadaire</div>
          <BarChart data={barData} />
        </div>

        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 border border-black/10 data-[theme=light]:bg-white data-[theme=light]:ring-black/10">
          <div className="mb-3 text-sm text-foreground/70">Répartition projets</div>
          <div className="flex items-center justify-center">
            <DonutChart data={donutData} />
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

      <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <div className="mb-3 text-sm text-foreground/70">Croissance mensuelle</div>
        <LineChart data={lineData} />
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


