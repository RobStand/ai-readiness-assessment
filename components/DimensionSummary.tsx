import { type DimensionKey, interpretScore } from "@/lib/scoring";

interface DimensionSummaryProps {
  dimensionKey: DimensionKey;
  name: string;
  description: string;
  score: number;
}

function barColor(score: number): string {
  if (score >= 4.0) return "bg-emerald-500";
  if (score >= 3.0) return "bg-brand-500";
  if (score >= 2.0) return "bg-amber-500";
  return "bg-rose-500";
}

export default function DimensionSummary({
  name,
  description,
  score,
}: DimensionSummaryProps) {
  const pct = (score / 5) * 100;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-1 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-slate-800">{name}</h3>
        <span className="text-sm font-semibold tabular-nums text-slate-900">
          {score.toFixed(1)}
          <span className="text-slate-400"> / 5.0</span>
        </span>
      </div>
      <div className="mb-3 mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${barColor(score)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs leading-relaxed text-slate-500">{description}</p>
      <p className="mt-2 text-xs font-medium text-slate-600">
        {interpretScore(score)}
      </p>
    </div>
  );
}
