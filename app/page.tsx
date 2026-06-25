import Link from "next/link";
import { DIMENSIONS } from "@/data/questions";
import RadarChart from "@/components/RadarChart";
import type { DimensionScores } from "@/lib/scoring";

// Illustrative profile so first-time visitors can see the deliverable at a glance.
const SAMPLE_SCORES: DimensionScores = {
  data_foundation: 4.3,
  technology_infrastructure: 3.8,
  talent_and_skills: 3.2,
  governance_and_risk: 3.6,
  use_case_pipeline: 2.9,
  change_readiness: 3.7,
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <header className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            AI
          </div>
          <span className="text-sm font-semibold text-slate-700">
            AI Readiness Assessment
          </span>
        </header>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Understand your organization&apos;s AI readiness
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              A focused, ~5-minute assessment that scores your organization
              across six dimensions and returns a personalized readiness profile
              with practical, prioritized recommendations.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href="/assessment"
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Start assessment
              </Link>
              <p className="text-sm text-slate-500">
                No account required. Results are private and shareable via link.
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Sample readiness profile
              </p>
              <RadarChart scores={SAMPLE_SCORES} />
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Six dimensions of readiness
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DIMENSIONS.map((d) => (
              <div
                key={d.key}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-base font-semibold text-slate-800">
                  {d.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {d.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
