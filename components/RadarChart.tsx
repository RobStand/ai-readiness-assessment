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

export default function RadarChart({ scores }: RadarChartProps) {
  const data = DIMENSION_KEYS.map((key) => ({
    dimension: DIMENSION_LABELS[key],
    score: scores[key],
  }));

  return (
    <div className="h-[340px] w-full sm:h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <ReRadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#475569", fontSize: 12 }}
          />
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
