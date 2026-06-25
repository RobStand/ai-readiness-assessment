"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DIMENSIONS, questionsForDimension } from "@/data/questions";
import { encodeAnswers } from "@/lib/encoding";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // index into DIMENSIONS
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const total = DIMENSIONS.length;
  const dimension = DIMENSIONS[step];
  const questions = useMemo(
    () => questionsForDimension(dimension.key),
    [dimension.key]
  );
  const labels = useMemo(() => DIMENSIONS.map((d) => d.name), []);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const isLast = step === total - 1;

  function setAnswer(id: string, score: number) {
    setAnswers((prev) => ({ ...prev, [id]: score }));
  }

  function handleNext() {
    if (!allAnswered) return;
    if (isLast) {
      const encoded = encodeAnswers(answers);
      router.push(`/results?r=${encoded}`);
      return;
    }
    setStep((s) => s + 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    if (step === 0) return;
    setStep((s) => s - 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-5 py-8 sm:py-12">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            ← Home
          </Link>
        </div>

        <ProgressBar current={step + 1} total={total} labels={labels} />

        <div className="mt-8">
          <h1 className="text-2xl font-bold text-slate-900">{dimension.name}</h1>
          <p className="mt-1 text-sm text-slate-500">{dimension.description}</p>
        </div>

        <div className="mt-6 space-y-4">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              value={answers[q.id]}
              onChange={(score) => setAnswer(q.id, score)}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!allAnswered}
            className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition enabled:hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLast ? "See results" : "Next"}
          </button>
        </div>

        {!allAnswered && (
          <p className="mt-3 text-center text-xs text-slate-400">
            Answer all questions in this section to continue.
          </p>
        )}
      </div>
    </main>
  );
}
