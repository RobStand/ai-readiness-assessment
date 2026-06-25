interface ProgressBarProps {
  current: number; // 1-based index of current dimension
  total: number;
  labels: string[];
}

export default function ProgressBar({ current, total, labels }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-brand-700">
          {labels[current - 1]}
        </span>
        <span className="text-slate-500">
          Section {current} of {total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
