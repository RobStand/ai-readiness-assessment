"use client";

import type { Question } from "@/data/questions";

interface QuestionCardProps {
  question: Question;
  value: number | undefined;
  onChange: (score: number) => void;
}

export default function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <div className="rounded-lg border border-hairline bg-surface p-5">
      <p className="mb-4 text-base font-medium text-ink">{question.text}</p>
      <div className="space-y-2">
        {question.options.map((option, index) => {
          const selected = value === option.score;
          const key = String.fromCharCode(65 + index); // A, B, C, ...
          return (
            <label
              key={option.score}
              className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-2.5 text-sm transition ${
                selected
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-hairline bg-surface text-muted hover:border-accent-line hover:bg-surface-2"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.score}
                checked={selected}
                onChange={() => onChange(option.score)}
                className="peer sr-only"
              />
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border font-mono text-xs font-semibold peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-1 ${
                  selected
                    ? "border-accent bg-accent text-white"
                    : "border-hairline text-faint"
                }`}
              >
                {key}
              </span>
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
