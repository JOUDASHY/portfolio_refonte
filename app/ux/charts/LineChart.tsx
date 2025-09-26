"use client";

type Datum = { label: string; value: number };

export default function LineChart({ data, height = 160, width = 360 }: { data: Datum[]; height?: number; width?: number }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const min = Math.min(0, ...data.map((d) => d.value));
  const range = Math.max(1, max - min);
  const stepX = width / Math.max(1, data.length - 1);
  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = height - ((d.value - min) / range) * (height - 24) - 8;
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeWidth="2"
        points={points.join(" ")}
      />
      {data.map((d, i) => {
        const [xStr, yStr] = points[i].split(",");
        const x = Number(xStr);
        const y = Number(yStr);
        return <circle key={d.label} cx={x} cy={y} r={3} className="fill-accent" />;
      })}
    </svg>
  );
}


