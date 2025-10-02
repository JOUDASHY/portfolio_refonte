"use client";

import { useMemo, useState, useCallback } from "react";

type Datum = { label: string; value: number };

export default function LineChart({
  data,
  height = 240,
  width = 720,
  paddingX = 48,
  color = "#6366f1",
  smooth = true,
  showArea = false,
  variant = "line",
}: {
  data: Datum[];
  height?: number;
  width?: number | string;
  paddingX?: number;
  color?: string;
  smooth?: boolean;
  showArea?: boolean;
  variant?: "line" | "bar";
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gradientId = useMemo(() => `linechart-gradient-${Math.random().toString(36).slice(2)}`, []);
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
    return { x, y };
  });
  // Y ticks (0 to niceMax with 4 intervals)
  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round((niceMax / 4) * i));

  const getPathD = useCallback((pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    if (!smooth || pts.length < 3) {
      return `M ${pts.map((p) => `${p.x} ${p.y}`).join(" L ")}`;
    }
    // Catmull-Rom to Bezier conversion for smooth curve
    const tension = 0.2; // 0..1
    const d: string[] = [];
    d.push(`M ${pts[0].x} ${pts[0].y}`);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;
      const cp1x = p1.x + ((p2.x - p0.x) / 6) * (1 + tension);
      const cp1y = p1.y + ((p2.y - p0.y) / 6) * (1 + tension);
      const cp2x = p2.x - ((p3.x - p1.x) / 6) * (1 + tension);
      const cp2y = p2.y - ((p3.y - p1.y) / 6) * (1 + tension);
      d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
    }
    return d.join(" ");
  }, [smooth]);

  const lineD = useMemo(() => getPathD(points), [points, getPathD]);
  const areaD = useMemo(() => {
    if (points.length === 0) return "";
    const baseY = height - 16;
    return `${lineD} L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`;
  }, [lineD, points, height]);

  return (
    <svg width={widthAttr} height={height} viewBox={`0 0 ${internalWidth} ${height}`} className="overflow-visible text-foreground/80">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0.03} />
        </linearGradient>
      </defs>
      {/* Axes */}
      <line x1={paddingX} y1={height - 16} x2={internalWidth - paddingX} y2={height - 16} className="stroke-white/20" strokeWidth={1} />
      <line x1={paddingX} y1={8} x2={paddingX} y2={height - 16} className="stroke-white/20" strokeWidth={1} />

      {/* Horizontal grid + labels */}
      {yTicks.map((val) => {
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

      {/* Area under curve (line variant) */}
      {variant === "line" && showArea && (
        <path d={areaD} fill={`url(#${gradientId})`} opacity={1} />
      )}

      {/* Smooth line */}
      {variant === "line" && (
        <path
          d={lineD}
          fill="none"
          stroke={color}
          strokeOpacity={0.8}
          strokeWidth={2}
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: 2000,
            animation: "line-reveal 1200ms ease forwards",
          }}
        />
      )}

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes line-reveal { to { stroke-dashoffset: 0; } }
      `}</style>

      {/* Bars + labels (bar variant) */}
      {variant === "bar" && (
        <g>
          {data.map((d, i) => {
            const centerX = paddingX + i * stepX;
            const barWidth = Math.max(6, Math.min(32, stepX * 0.6));
            const valueHeight = ((d.value - min) / range) * (height - 56);
            const topY = height - 16 - valueHeight;
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={`bar-${d.label}-${i}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <rect
                  x={centerX - barWidth / 2}
                  y={topY}
                  width={barWidth}
                  height={valueHeight}
                  rx={barWidth / 4}
                  fill={`url(#${gradientId})`}
                  stroke={color}
                  strokeOpacity={0.4}
                  strokeWidth={1}
                >
                  <animate attributeName="y" from={height - 16} to={topY} dur="500ms" fill="freeze" />
                  <animate attributeName="height" from={0} to={valueHeight} dur="500ms" fill="freeze" />
                </rect>
                {isHovered && (
                  <g transform={`translate(${centerX}, ${topY - 12})`}>
                    <rect x={-24} y={-18} rx={4} ry={4} width={48} height={18} fill="#111827" opacity={0.9} />
                    <text x={0} y={-6} textAnchor="middle" className="fill-white text-[10px]">{d.value}</text>
                  </g>
                )}
                <text x={centerX} y={height - 2} textAnchor="middle" className="fill-current text-[10px] opacity-70">{d.label}</text>
              </g>
            );
          })}
        </g>
      )}

      {/* Points and labels (line variant) */}
      {variant === "line" && data.map((d, i) => {
        const { x, y } = points[i];
        const isHovered = hoveredIndex === i;
        return (
          <g
            key={d.label}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <circle cx={x} cy={y} r={isHovered ? 5 : 3} fill="#fff" stroke={color} strokeWidth={2} />
            {isHovered && (
              <g transform={`translate(${x}, ${y - 16})`}>
                <rect x={-24} y={-18} rx={4} ry={4} width={48} height={18} fill="#111827" opacity={0.9} />
                <text x={0} y={-6} textAnchor="middle" className="fill-white text-[10px]">{d.value}</text>
              </g>
            )}
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


