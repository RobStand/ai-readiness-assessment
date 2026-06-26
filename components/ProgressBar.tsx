interface ProgressBarProps {
  current: number; // 1-based index of current dimension
  total: number;
  labels: string[];
}

export default function ProgressBar({ current, total, labels }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">
          {labels[current - 1]}
        </span>
        <span className="font-mono text-xs font-semibold text-faint">
          {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
