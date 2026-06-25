import Link from "next/link";
import { DIMENSIONS } from "@/data/questions";

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

        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Understand your organization&apos;s AI readiness
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            A focused, ~5-minute assessment that scores your organization across
            six dimensions and returns a personalized readiness profile with
            practical, prioritized recommendations.
          </p>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Start assessment
            </Link>
            <p className="text-sm text-slate-500">
              No account required. Results are private and shareable via link.
            </p>
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
