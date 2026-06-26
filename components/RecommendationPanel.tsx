"use client";

import { useState } from "react";
import type { Recommendations } from "@/lib/types";

interface RecommendationPanelProps {
  loading: boolean;
  error: string | null;
  data: Recommendations | null;
  onRetry: () => void;
}

function SkeletonLine({ w }: { w: string }) {
  return <div className={`h-3 animate-pulse rounded bg-surface-2 ${w}`} />;
}

export default function RecommendationPanel({
  loading,
  error,
  data,
  onRetry,
}: RecommendationPanelProps) {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true });

  if (loading) {
    return (
      <div className="space-y-4 rounded-lg border border-hairline bg-surface p-6">
        <div className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wide text-accent">
          <span className="h-2 w-2 animate-ping rounded-full bg-accent" />
          Generating recommendations…
        </div>
        <div className="space-y-2">
          <SkeletonLine w="w-full" />
          <SkeletonLine w="w-11/12" />
          <SkeletonLine w="w-3/4" />
        </div>
        <div className="space-y-2 pt-2">
          <SkeletonLine w="w-1/3" />
          <SkeletonLine w="w-full" />
          <SkeletonLine w="w-5/6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-hairline bg-critical-soft p-6 text-sm shadow-none">
        <p className="font-semibold text-critical">
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-critical align-middle" />
          We couldn&apos;t generate recommendations.
        </p>
        <p className="mt-1 text-muted">{error}</p>
        <button
          onClick={onRetry}
          className="mt-3 rounded-md border border-hairline bg-surface px-3 py-1.5 text-sm font-medium text-ink transition hover:border-accent-line"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-accent-line bg-accent-soft p-6">
        <h3 className="label-mono !text-accent">Overall assessment</h3>
        <p className="mt-2 text-base leading-relaxed text-ink">{data.overall}</p>
      </div>

      <div className="space-y-3">
        <h3 className="label-mono !text-muted">Where to focus first</h3>
        {data.gaps.map((gap, i) => {
          const isOpen = open[i] ?? false;
          return (
            <div
              key={gap.dimension}
              className="overflow-hidden rounded-lg border border-hairline bg-surface"
            >
              <button
                onClick={() => setOpen((o) => ({ ...o, [i]: !isOpen }))}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-surface-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-accent-soft font-mono text-xs font-semibold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-semibold text-ink">{gap.name}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{gap.interpretation}</p>
                </div>
                <span
                  className={`shrink-0 text-faint transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              {isOpen && (
                <ul className="space-y-2 border-t border-hairline-2 px-5 py-4">
                  {gap.actions.map((action, j) => (
                    <li key={j} className="flex gap-2 text-sm text-ink">
                      <span className="mt-0.5 font-mono text-accent">→</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
