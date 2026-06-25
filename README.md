# AI Readiness Assessment

A standalone Next.js web app that helps organizations assess their AI readiness
across six dimensions. Users answer ~25 questions and receive a scored radar
chart profile, a readiness tier, and Claude-generated personalized
recommendations. Results are fully shareable via URL — no database required.

## Six dimensions

1. **Data Foundation** — Data quality, accessibility, and governance
2. **Technology Infrastructure** — Cloud posture, integration, security controls
3. **Talent & Skills** — AI literacy, leadership understanding, technical depth
4. **Governance & Risk** — Policies, compliance posture, ethical AI framework
5. **Use Case Pipeline** — Identifying, prioritizing, and scoping AI opportunities
6. **Change Readiness** — Leadership alignment, change management, culture

## Tech stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Recharts** for the radar chart
- **@anthropic-ai/sdk** for personalized recommendations
- No database — answers are encoded into the results URL (`?r=<base64>`)

## Getting started

```bash
npm install
cp .env.example .env.local   # then add your real key
npm run dev
```

Open http://localhost:3000.

### Environment

Create `.env.local` with:

```
ANTHROPIC_API_KEY=your_key_here
```

The `/api/recommend` route returns a clear error if the key is missing, so the
rest of the app (scoring, radar chart, dimension cards, share link) works
without it.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm test` | Run unit tests (Vitest) for scoring + encoding |

## How it works

- **`data/questions.ts`** — typed question bank (5 labeled options per question).
- **`lib/scoring.ts`** — dimension averages, overall score, tier, and top gaps.
- **`lib/encoding.ts`** — URL-safe base64 encode/decode of the answer map.
- **`app/assessment`** — single-page, dimension-by-dimension flow with progress.
- **`app/results`** — decodes the URL, computes scores client-side, renders the
  radar chart and dimension cards, then calls `/api/recommend` for Claude advice.
- **`app/api/recommend/route.ts`** — builds a prompt from scores/tier/gaps and
  asks Claude (`claude-sonnet-4-6`) to return structured JSON recommendations.

## Tests

```bash
npm test
```

Covers dimension averaging/rounding, overall score, tier thresholds, top-gap
selection, and the encoding round-trip (including URL-safety and invalid input).
