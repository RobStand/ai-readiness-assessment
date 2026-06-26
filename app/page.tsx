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
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <header className="mb-6 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent font-mono text-xs font-semibold text-white">
            AI
          </div>
          <span className="label-mono !text-muted">AI Readiness Assessment</span>
        </header>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-display text-ink sm:text-5xl">
              Understand your organization&apos;s AI readiness
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              A focused, ~5-minute assessment that scores your organization
              across six dimensions and returns a personalized readiness profile
              with practical, prioritized recommendations.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href="/assessment"
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-accent px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
              >
                Start assessment
              </Link>
              <p className="text-sm text-faint">
                No account required. Results are private and shareable via link.
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-card border border-hairline bg-surface p-6">
              <p className="label-mono">Sample readiness profile</p>
              <RadarChart scores={SAMPLE_SCORES} />
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="label-mono !text-muted">Six dimensions of readiness</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DIMENSIONS.map((d, i) => (
              <div
                key={d.key}
                className="rounded-lg border border-hairline bg-surface p-5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-semibold text-ink">{d.name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted">
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
