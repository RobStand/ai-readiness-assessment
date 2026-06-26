import { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-paper">
          <p className="font-mono text-xs uppercase tracking-wide text-faint">Loading your results…</p>
        </main>
      }
    >
      <ResultsClient />
    </Suspense>
  );
}
