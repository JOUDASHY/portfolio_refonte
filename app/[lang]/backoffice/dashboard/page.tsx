import BarChart from "../../../ux/charts/BarChart";
import LineChart from "../../../ux/charts/LineChart";
import DonutChart from "../../../ux/charts/DonutChart";

export default function DashboardPage() {
  const kpis = [
    { label: "Vues", value: "12.4k" },
    { label: "Projets", value: "24" },
    { label: "Contacts", value: "58" },
    { label: "Taux conv.", value: "3.2%" },
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
          <div key={k.label} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm text-foreground/60">{k.label}</div>
            <div className="mt-1 text-2xl font-semibold text-foreground">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 lg:col-span-2">
          <div className="mb-3 text-sm text-foreground/70">Trafic hebdomadaire</div>
          <BarChart data={barData} />
        </div>

        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
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


