"use client";

type Datum = { label: string; value: number };

export default function BarChart({ data, height = 160 }: { data: Datum[]; height?: number }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barWidth = 24;
  const gap = 16;
  const width = data.length * (barWidth + gap) + gap;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <g transform={`translate(${gap / 2}, 8)`}>
        {data.map((d, i) => {
          const h = Math.max(2, Math.round(((height - 24) * d.value) / max));
          const x = i * (barWidth + gap);
          const y = height - 24 - h;
          return (
            <g key={d.label} transform={`translate(${x}, 0)`}>
              <rect
                x={0}
                y={y}
                width={barWidth}
                height={h}
                rx={6}
                className="fill-accent/80"
              />
              <text x={barWidth / 2} y={height - 8} textAnchor="middle" className="fill-current text-[10px] opacity-70">
                {d.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}


