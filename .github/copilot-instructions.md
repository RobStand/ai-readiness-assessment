# Copilot instructions

AI Readiness Assessment — a Next.js (App Router) + TypeScript app that scores an
organization's AI readiness across six dimensions, renders a radar chart and
tier, and generates Claude-powered recommendations. There is **no database**:
all state lives in the browser and shareable results are encoded into the URL.

## Commands

```bash
npm run dev        # dev server (http://localhost:3000)
npm run build      # production build (also type-checks all routes)
npm run start      # run the production build
npm test           # all unit tests (Vitest)
npm run lint       # next lint
```

Run a single test file or test by name:

```bash
npx vitest run lib/scoring.test.ts          # one file
npx vitest run -t "returns the three lowest" # one test by name (substring)
npx vitest                                   # watch mode
```

## Architecture: the data flow

The whole app is built around one piece of state — a `Record<string, number>`
mapping question id → answer score (1–5). Trace it end to end before changing
behavior:

1. **`data/questions.ts`** defines the question bank. Each question has a
   `dimension` (a `DimensionKey`) and five options scored 1–5.
2. **`app/assessment/page.tsx`** collects answers in React state, then
   `encodeAnswers()` serializes the map and navigates to
   `/results?r=<base64url>`.
3. **`app/results/ResultsClient.tsx`** reads `?r=`, calls `decodeAnswers()`,
   and recomputes everything client-side via `lib/scoring.ts`
   (`computeDimensionScores` → `computeOverallScore` → `getReadinessTier` /
   `getTopGaps`).
4. It then POSTs `{ scores, tier, topGaps }` to **`app/api/recommend/route.ts`**,
   which calls Claude and returns structured JSON recommendations.

Because results are recomputed purely from the URL, **opening a results link in a
new tab must reproduce the same page** — never introduce results state that
isn't derivable from `?r=`.

## Key conventions

- **`DimensionKey` in `lib/scoring.ts` is the single source of truth** for the
  six dimensions. `data/questions.ts` imports it, and `DIMENSION_KEYS` /
  `DIMENSION_LABELS` / `DIMENSIONS` must stay in sync with it. To add a
  question, append to `QUESTIONS` with an existing `dimension` key — scoring
  averages by dimension automatically, so no scoring code changes are needed.
- **`lib/scoring.ts` and `lib/encoding.ts` are isomorphic** (run on both server
  and client). `encoding.ts` branches on `typeof window` to use `Buffer` vs
  `btoa/atob`. Keep these files free of browser- or Node-only globals without a
  guard. `decodeAnswers` must never throw — it returns `{}` on bad input.
- **Path alias `@/` maps to the repo root**, configured in both `tsconfig.json`
  and `vitest.config.ts`. If you add a new top-level dir that tests import,
  update the alias in `vitest.config.ts`.
- **Pages using `useSearchParams` must be wrapped in `<Suspense>`.** That's why
  `app/results/` is split into `page.tsx` (Suspense boundary) and
  `ResultsClient.tsx` (the client component). Follow this split for any new
  search-param-driven page.
- **The assessment flow deliberately avoids a `<form>` element** — it uses React
  state and `onClick` handlers, advancing one dimension at a time. Don't convert
  it to a form.
- **Graceful degradation in the API route.** `app/api/recommend/route.ts`
  returns a clear error (not a crash) when `ANTHROPIC_API_KEY` is unset, parses
  Claude output defensively (`extractJson`), and validates the request body
  before doing any work. Preserve this — the rest of the app must work without an
  API key.
- **Rate limiting is opt-in via env.** `lib/ratelimit.ts` enables Upstash-backed
  IP rate limiting (5/IP/day) only when `UPSTASH_REDIS_REST_URL` and
  `UPSTASH_REDIS_REST_TOKEN` are set; otherwise it no-ops. It logs the active
  mode (`[ratelimit] enabled/disabled`) when the route first loads.
- **Claude model is pinned** to `claude-sonnet-4-6` in `app/api/recommend/route.ts`.
- **Styling is Tailwind only**, with an indigo `brand` color scale defined in
  `tailwind.config.ts`. Use `brand-*` classes for the primary accent.

## Environment

`ANTHROPIC_API_KEY` is required for recommendations; the two `UPSTASH_*` vars are
optional (rate limiting). See `.env.example`. `.env.local` is git-ignored — never
commit it or hardcode keys.
