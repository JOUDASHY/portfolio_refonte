"use client";

type Slice = { label: string; value: number; color?: string };

export default function DonutChart({ data, size = 160, thickness = 16 }: { data: Slice[]; size?: number; thickness?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = size / 2;
  const inner = radius - thickness;
  let angle = -Math.PI / 2;

  const segments = data.map((d) => {
    const portion = d.value / total;
    const start = angle;
    angle += portion * Math.PI * 2;
    const end = angle;

    const x1 = radius + radius * Math.cos(start);
    const y1 = radius + radius * Math.sin(start);
    const x2 = radius + radius * Math.cos(end);
    const y2 = radius + radius * Math.sin(end);
    const largeArc = portion > 0.5 ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${radius + inner * Math.cos(end)} ${radius + inner * Math.sin(end)}`,
      `A ${inner} ${inner} 0 ${largeArc} 0 ${radius + inner * Math.cos(start)} ${radius + inner * Math.sin(start)}`,
      "Z",
    ].join(" ");

    return { path, color: d.color };
  });

  return (
    <svg width={size} height={size} className="overflow-visible">
      {segments.map((s, i) => (
        <path key={i} d={s.path} className={s.color || "fill-accent/70"} />
      ))}
    </svg>
  );
}


