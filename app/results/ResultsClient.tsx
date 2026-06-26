"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DIMENSIONS } from "@/data/questions";
import { decodeAnswers } from "@/lib/encoding";
import {
  computeDimensionScores,
  computeOverallScore,
  getReadinessTier,
  getTopGaps,
  rankDimensionsByScore,
  TIER_DESCRIPTIONS,
} from "@/lib/scoring";
import type { Recommendations, RecommendRequest } from "@/lib/types";
import RadarChart from "@/components/RadarChart";
import DimensionSummary from "@/components/DimensionSummary";
import RecommendationPanel from "@/components/RecommendationPanel";
import TierBadge from "@/components/TierBadge";

export default function ResultsClient() {
  const params = useSearchParams();
  const encoded = params.get("r") ?? "";

  const answers = useMemo(() => decodeAnswers(encoded), [encoded]);
  const hasAnswers = Object.keys(answers).length > 0;

  const scores = useMemo(() => computeDimensionScores(answers), [answers]);
  const overall = useMemo(() => computeOverallScore(scores), [scores]);
  const tier = useMemo(() => getReadinessTier(overall), [overall]);
  const topGaps = useMemo(() => getTopGaps(scores), [scores]);

  // Rank dimensions by score (highest = 01) for the mono rank chips, and mark
  // the three lowest as gaps so their score bars read caution, not cobalt.
  const rankByKey = useMemo(() => rankDimensionsByScore(scores), [scores]);
  const gapSet = useMemo(() => new Set(topGaps), [topGaps]);

  const [recs, setRecs] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    if (!hasAnswers) return;
    setLoading(true);
    setError(null);
    setRecs(null);
    const payload: RecommendRequest = { scores, tier, topGaps };
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Request failed.");
      }
      setRecs(data as Recommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [hasAnswers, scores, tier, topGaps]);

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encoded]);

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  if (!hasAnswers) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold tracking-display text-ink">No results found</h1>
          <p className="mt-2 text-muted">
            This results link is missing or invalid. Take the assessment to
            generate your readiness profile.
          </p>
          <Link
            href="/assessment"
            className="mt-6 inline-flex rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Start assessment
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
        <div className="mb-6">
          <Link
            href="/"
            className="font-mono text-xs font-medium uppercase tracking-wide text-faint transition hover:text-ink"
          >
            ← Home
          </Link>
        </div>

        {/* Tier + overall */}
        <section className="rounded-card border border-hairline bg-surface p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="label-mono">Your readiness tier</p>
              <div className="mt-2">
                <TierBadge tier={tier} />
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="label-mono">Overall score</p>
              <p className="mt-1 font-mono text-3xl font-semibold text-ink">
                {overall.toFixed(1)}
                <span className="text-lg font-medium text-faint"> / 5.0</span>
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {TIER_DESCRIPTIONS[tier]}
          </p>
        </section>

        {/* Radar */}
        <section className="mt-6 rounded-card border border-hairline bg-surface p-4 sm:p-6">
          <h2 className="mb-2 px-2 label-mono !text-muted">Readiness profile</h2>
          <RadarChart scores={scores} />
        </section>

        {/* Dimension cards */}
        <section className="mt-6">
          <h2 className="mb-3 label-mono !text-muted">Dimension breakdown</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DIMENSIONS.map((d) => (
              <DimensionSummary
                key={d.key}
                dimensionKey={d.key}
                name={d.name}
                description={d.description}
                score={scores[d.key]}
                rank={rankByKey[d.key] ?? 0}
                isGap={gapSet.has(d.key)}
              />
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="mt-8">
          <h2 className="mb-3 label-mono !text-muted">Personalized recommendations</h2>
          <RecommendationPanel
            loading={loading}
            error={error}
            data={recs}
            onRetry={fetchRecommendations}
          />
        </section>

        {/* Actions */}
        <section className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-hairline pt-6 sm:flex-row">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {copied ? "Link copied!" : "Share results"}
          </button>
          <Link
            href="/assessment"
            className="text-sm font-medium text-faint transition hover:text-ink"
          >
            Retake assessment
          </Link>
        </section>
      </div>
    </main>
  );
}
