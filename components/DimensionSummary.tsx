import { type DimensionKey, interpretScore } from "@/lib/scoring";

interface DimensionSummaryProps {
  dimensionKey: DimensionKey;
  name: string;
  description: string;
  score: number;
  rank: number;
  isGap?: boolean;
}

export default function DimensionSummary({
  name,
  description,
  score,
  rank,
  isGap = false,
}: DimensionSummaryProps) {
  const pct = (score / 5) * 100;
  return (
    <div className="rounded-lg border border-hairline bg-surface p-5">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs font-semibold text-faint">
            {String(rank).padStart(2, "0")}
          </span>
          <h3 className="text-sm font-semibold text-ink">{name}</h3>
        </div>
        <span className="font-mono text-sm font-semibold text-ink">
          {score.toFixed(1)}
          <span className="text-faint"> / 5</span>
        </span>
      </div>
      <div className="mb-3 mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full ${isGap ? "bg-caution" : "bg-accent"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs leading-relaxed text-muted">{description}</p>
      <p className="mt-2 text-xs font-medium text-ink">{interpretScore(score)}</p>
    </div>
  );
}
