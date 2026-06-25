"use client";

import type { Question } from "@/data/questions";

interface QuestionCardProps {
  question: Question;
  value: number | undefined;
  onChange: (score: number) => void;
}

export default function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-4 text-base font-medium text-slate-800">{question.text}</p>
      <div className="space-y-2">
        {question.options.map((option) => {
          const selected = value === option.score;
          return (
            <label
              key={option.score}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition ${
                selected
                  ? "border-brand-500 bg-brand-50 text-brand-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.score}
                checked={selected}
                onChange={() => onChange(option.score)}
                className="h-4 w-4 accent-brand-600"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
