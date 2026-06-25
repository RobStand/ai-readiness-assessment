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
  return <div className={`h-3 animate-pulse rounded bg-slate-200 ${w}`} />;
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
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-brand-700">
          <span className="h-2 w-2 animate-ping rounded-full bg-brand-500" />
          Generating your personalized recommendations…
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
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 shadow-sm">
        <p className="font-medium">We couldn&apos;t generate recommendations.</p>
        <p className="mt-1 text-rose-700">{error}</p>
        <button
          onClick={onRetry}
          className="mt-3 rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-6 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-700">
          Overall assessment
        </h3>
        <p className="text-base leading-relaxed text-slate-800">{data.overall}</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Where to focus first
        </h3>
        {data.gaps.map((gap, i) => {
          const isOpen = open[i] ?? false;
          return (
            <div
              key={gap.dimension}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <button
                onClick={() => setOpen((o) => ({ ...o, [i]: !isOpen }))}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{gap.name}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{gap.interpretation}</p>
                </div>
                <span
                  className={`shrink-0 text-slate-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              {isOpen && (
                <ul className="space-y-2 border-t border-slate-100 px-5 py-4">
                  {gap.actions.map((action, j) => (
                    <li key={j} className="flex gap-2 text-sm text-slate-700">
                      <span className="mt-0.5 text-brand-500">→</span>
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
