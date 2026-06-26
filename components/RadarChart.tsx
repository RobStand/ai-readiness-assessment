"use client";

import {
  Radar,
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  DIMENSION_KEYS,
  DIMENSION_LABELS,
  type DimensionScores,
} from "@/lib/scoring";
import { wrapDimensionLabel } from "@/lib/wrapLabel";

interface RadarChartProps {
  scores: DimensionScores;
}

interface AngleTickProps {
  x?: number;
  y?: number;
  textAnchor?: "start" | "middle" | "end" | "inherit";
  payload?: { value?: string };
}

// Wrap multi-word dimension labels onto separate lines so long labels
// (e.g. "Technology Infrastructure") don't overflow and clip on narrow viewports.
function WrappedAngleTick({ x = 0, y = 0, textAnchor, payload }: AngleTickProps) {
  const lines = wrapDimensionLabel(payload?.value ?? "");
  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      fill="var(--muted)"
      fontSize={11}
      fontFamily="JetBrains Mono, ui-monospace, monospace"
      letterSpacing="0.02em"
    >
      {lines.map((line, index) => (
        <tspan key={line + index} x={x} dy={index === 0 ? 0 : 14}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export default function RadarChart({ scores }: RadarChartProps) {
  const data = DIMENSION_KEYS.map((key) => ({
    dimension: DIMENSION_LABELS[key],
    score: scores[key],
  }));

  return (
    <div className="h-[340px] w-full sm:h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <ReRadarChart data={data} outerRadius="60%" margin={{ top: 8, right: 64, bottom: 8, left: 64 }}>
          <PolarGrid stroke="var(--hairline)" />
          <PolarAngleAxis dataKey="dimension" tick={<WrappedAngleTick />} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tickCount={6}
            tick={{
              fill: "var(--faint)",
              fontSize: 10,
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
            }}
          />
          <Radar
            name="Readiness"
            dataKey="score"
            stroke="var(--accent)"
            strokeWidth={2.5}
            fill="var(--accent)"
            fillOpacity={0.12}
            dot={{ fill: "var(--surface)", stroke: "var(--accent)", strokeWidth: 2, r: 3 }}
            isAnimationActive
            animationDuration={350}
            animationEasing="ease-out"
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
