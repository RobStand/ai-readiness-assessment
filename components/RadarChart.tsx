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
  const words = (payload?.value ?? "").split(" ");
  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      fill="#475569"
      fontSize={12}
    >
      {words.map((word, index) => (
        <tspan key={word + index} x={x} dy={index === 0 ? 0 : 14}>
          {word}
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
        <ReRadarChart data={data} outerRadius="62%" margin={{ top: 8, right: 40, bottom: 8, left: 40 }}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="dimension" tick={<WrappedAngleTick />} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tickCount={6}
            tick={{ fill: "#94a3b8", fontSize: 10 }}
          />
          <Radar
            name="Readiness"
            dataKey="score"
            stroke="#4f46e5"
            fill="#6366f1"
            fillOpacity={0.35}
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
