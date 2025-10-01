"use client";

type Datum = { label: string; value: number };

export default function LineChart({ data, height = 240, width = 720, paddingX = 48, color = "#6366f1" }: { data: Datum[]; height?: number; width?: number | string; paddingX?: number; color?: string }) {
  const widthIsPercent = typeof width === "string";
  const internalWidth = widthIsPercent ? Math.max(600, data.length * 80) : (width as number);
  const widthAttr = widthIsPercent ? (width as string) : String(width);
  const max = Math.max(1, ...data.map((d) => d.value));
  const min = 0; // start at 0 like the reference image
  const niceMax = Math.max(1, Math.ceil(max / 250) * 250); // round up to nearest 250
  const range = Math.max(1, niceMax - min);
  const innerWidth = Math.max(0, internalWidth - paddingX * 2);
  const stepX = innerWidth / Math.max(1, data.length - 1);
  const points = data.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = height - ((d.value - min) / range) * (height - 56) - 16; // leave more space for labels
    return `${x},${y}`;
  });
  // Y ticks (0 to niceMax with 4 intervals)
  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round((niceMax / 4) * i));

  return (
    <svg width={widthAttr} height={height} viewBox={`0 0 ${internalWidth} ${height}`} className="overflow-visible text-foreground/80">
      {/* Axes */}
      <line x1={paddingX} y1={height - 16} x2={internalWidth - paddingX} y2={height - 16} className="stroke-white/20" strokeWidth={1} />
      <line x1={paddingX} y1={8} x2={paddingX} y2={height - 16} className="stroke-white/20" strokeWidth={1} />

      {/* Horizontal grid + labels */}
      {yTicks.map((val, idx) => {
        const y = height - 16 - (val / range) * (height - 56);
        return (
          <g key={val}>
            <line x1={paddingX} y1={y} x2={internalWidth - paddingX} y2={y} className="stroke-white/10" strokeDasharray="4 4" strokeWidth={1} />
            <text x={paddingX - 8} y={y + 3} textAnchor="end" className="fill-current text-[10px] opacity-70">{val}</text>
          </g>
        );
      })}

      {/* Vertical grid per month */}
      {data.map((d, i) => {
        const x = paddingX + i * stepX;
        return <line key={`vx-${i}`} x1={x} y1={8} x2={x} y2={height - 16} className="stroke-white/10" strokeDasharray="4 4" strokeWidth={1} />;
      })}

      {/* Area under curve */}
      <polyline
        fill="none"
        stroke={color}
        strokeOpacity={0.6}
        strokeWidth={2}
        points={points.join(" ")}
      />

      {/* Points and X labels */}
      {data.map((d, i) => {
        const [xStr, yStr] = points[i].split(",");
        const x = Number(xStr);
        const y = Number(yStr);
        return (
          <g key={d.label}>
            <circle cx={x} cy={y} r={4} fill="#fff" stroke={color} strokeWidth={2} />
            <text x={x} y={height - 2} textAnchor="middle" className="fill-current text-[10px] opacity-70">
              {d.label}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${paddingX}, ${height - 36})`}>
        <circle cx={0} cy={0} r={4} fill="#fff" stroke={color} strokeWidth={2} />
        <text x={10} y={3} className="fill-current text-[10px] opacity-80">count</text>
      </g>
    </svg>
  );
}


