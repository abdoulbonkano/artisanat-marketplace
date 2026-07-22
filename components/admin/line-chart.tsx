"use client";

import { useState } from "react";

function formatValue(value: number, unit: "eur" | "count") {
  if (unit === "eur") return `${value.toFixed(2)} EUR`;
  return `${value} inscription${value > 1 ? "s" : ""}`;
}

export function LineChart({
  data,
  colorClass,
  unit = "count",
}: {
  data: { label: string; value: number }[];
  colorClass: "chart-1" | "chart-2";
  unit?: "eur" | "count";
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const width = 600;
  const height = 200;
  const paddingTop = 12;
  const paddingBottom = 24;
  const plotHeight = height - paddingTop - paddingBottom;

  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const min = 0;

  const points = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * width : width / 2;
    const y = paddingTop + plotHeight - ((d.value - min) / (max - min || 1)) * plotHeight;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1]?.x ?? 0},${height - paddingBottom} L${points[0]?.x ?? 0},${height - paddingBottom} Z`;

  const strokeClass = colorClass === "chart-1" ? "stroke-chart-1" : "stroke-chart-2";
  const fillClass = colorClass === "chart-1" ? "fill-chart-1" : "fill-chart-2";
  const dotFillClass = colorClass === "chart-1" ? "fill-chart-1" : "fill-chart-2";

  function handlePointerMove(event: React.PointerEvent<SVGRectElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = ((event.clientX - rect.left) / rect.width) * width;
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - relativeX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: 160 }}
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            x2={width}
            y1={paddingTop + plotHeight * f}
            y2={paddingTop + plotHeight * f}
            className="stroke-border"
            strokeWidth={1}
          />
        ))}

        <path d={areaPath} className={fillClass} opacity={0.1} stroke="none" />
        <path
          d={linePath}
          className={strokeClass}
          fill="none"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={4}
            className={dotFillClass}
            stroke="var(--card)"
            strokeWidth={2}
          />
        )}

        {hovered && (
          <>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={paddingTop}
              y2={height - paddingBottom}
              className="stroke-muted-foreground"
              strokeWidth={1}
              opacity={0.4}
            />
            <circle
              cx={hovered.x}
              cy={hovered.y}
              r={4}
              className={dotFillClass}
              stroke="var(--card)"
              strokeWidth={2}
            />
          </>
        )}

        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
        />
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-md border border-border bg-popover px-2 py-1 text-xs shadow-md"
          style={{ left: `${(hovered.x / width) * 100}%` }}
        >
          <p className="font-medium text-popover-foreground">{formatValue(hovered.value, unit)}</p>
          <p className="text-muted-foreground">{hovered.label}</p>
        </div>
      )}
    </div>
  );
}
