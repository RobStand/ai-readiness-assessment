# Claude Code Build Instructions: AI Readiness Assessment Tool

## What we're building

A standalone web app that helps organizations assess their AI readiness across six dimensions. Users answer ~25 questions, get a scored radar chart profile, a readiness tier, and Claude-generated personalized recommendations. Results are shareable via URL.

This is a portfolio project — it should look and feel like a real product, not a prototype.

---

## Tech stack

- **Framework**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts (radar chart)
- **AI**: Anthropic SDK (`@anthropic-ai/sdk`) for generating personalized recommendations
- **Data**: No database — all state lives in the browser, results encoded in URL query params

---

## Project structure

```
/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── assessment/
│   │   └── page.tsx              # Assessment flow
│   ├── results/
│   │   └── page.tsx              # Results page (reads from URL params)
│   └── api/
│       └── recommend/
│           └── route.ts          # API route: calls Claude for recommendations
├── data/
│   └── questions.ts              # Question bank and scoring config
├── lib/
│   ├── scoring.ts                # Scoring logic
│   └── encoding.ts               # URL encode/decode for shareable results
└── components/
    ├── QuestionCard.tsx
    ├── ProgressBar.tsx
    ├── RadarChart.tsx
    ├── DimensionSummary.tsx
    └── RecommendationPanel.tsx
```

---

## Data: questions.ts

Define questions as a typed config. Each question has an id, dimension, text, and five answer options with labels and numeric scores (1-5).

The six dimensions are:

1. **data_foundation** — Data quality, accessibility, and governance
2. **technology_infrastructure** — Cloud posture, integration capability, security controls
3. **talent_and_skills** — AI literacy, leadership understanding, technical depth
4. **governance_and_risk** — Policies, compliance posture, ethical AI framework
5. **use_case_pipeline** — Ability to identify, prioritize, and scope AI opportunities
6. **change_readiness** — Leadership alignment, change management capability, culture

Use this question bank (add or refine as needed):

**Data foundation**
- "How would you describe the accessibility of your core business data to analytics and AI teams?" (1=siloed/manual, 5=API-accessible and well-documented)
- "How confident are you in the accuracy and completeness of your organization's data?" (1=significant quality issues, 5=trusted and validated)
- "Does your organization have documented data governance policies?" (1=none, 5=mature policies actively enforced)
- "How well does your organization manage data privacy and compliance requirements?" (1=ad hoc, 5=systematic with clear ownership)

**Technology infrastructure**
- "How would you describe your organization's cloud adoption?" (1=predominantly on-premises, 5=cloud-native with modern architecture)
- "How easily can new AI tools and services be integrated into your existing technology stack?" (1=very difficult/many blockers, 5=well-defined APIs and integration patterns)
- "How mature are your organization's security controls around data and systems access?" (1=basic, 5=comprehensive with regular audits)
- "Do you have the compute and storage infrastructure to support AI workloads?" (1=significant gaps, 5=scalable and ready)

**Talent and skills**
- "How would you rate AI and data literacy among frontline employees?" (1=very low awareness, 5=widespread comfort with AI tools)
- "How well does senior leadership understand the strategic implications of AI?" (1=minimal awareness, 5=actively informed and engaged)
- "Does your organization have dedicated AI/ML engineering or data science capability?" (1=none, 5=established team with proven delivery)
- "How effectively does your organization upskill employees on new technologies?" (1=rarely/reactively, 5=proactive learning culture)

**Governance and risk**
- "Does your organization have a defined process for evaluating AI vendor risk?" (1=none, 5=formal process with documented criteria)
- "How well does your organization understand the regulatory environment for AI in your industry?" (1=limited awareness, 5=actively monitoring and preparing)
- "Is there a named owner or committee responsible for AI governance?" (1=no clear ownership, 5=established with clear mandate)
- "How does your organization approach bias, fairness, and explainability in algorithmic decisions?" (1=not yet considered, 5=active frameworks in place)

**Use case pipeline**
- "How effectively does your organization identify and prioritize AI use cases?" (1=ad hoc and opportunistic, 5=systematic process with clear criteria)
- "How well does your organization scope and size AI initiatives before committing?" (1=rarely done, 5=consistent discovery and feasibility process)
- "Does your organization have a backlog of validated AI use cases ready for development?" (1=none, 5=robust prioritized pipeline)
- "How successful has your organization been at moving AI pilots into production?" (1=most stall, 5=consistent delivery track record)

**Change readiness**
- "Is there a named executive sponsor actively championing AI transformation?" (1=no clear sponsor, 5=engaged sponsor with dedicated budget)
- "How has your organization historically responded to major technology-driven change?" (1=significant resistance, 5=embraces change with strong adoption)
- "How aligned is senior leadership on the priority and urgency of AI investment?" (1=significant disagreement, 5=strong unified commitment)
- "Does your organization have change management capability to support AI adoption?" (1=none, 5=experienced team with proven methodology)
- "How effectively does your organization communicate about technology change to employees?" (1=poor/reactive, 5=proactive and transparent)

---

## Scoring logic: lib/scoring.ts

```typescript
export type DimensionKey =
  | 'data_foundation'
  | 'technology_infrastructure'
  | 'talent_and_skills'
  | 'governance_and_risk'
  | 'use_case_pipeline'
  | 'change_readiness'

export type DimensionScores = Record<DimensionKey, number> // 1.0 - 5.0

export type ReadinessTier = 'Foundation' | 'Developing' | 'Scaling' | 'Leading'

export function computeDimensionScores(answers: Record<string, number>): DimensionScores {
  // Group answers by dimension, average them
}

export function computeOverallScore(scores: DimensionScores): number {
  // Simple average across six dimensions
}

export function getReadinessTier(overall: number): ReadinessTier {
  // Foundation: 1.0-2.0, Developing: 2.0-3.0, Scaling: 3.0-4.0, Leading: 4.0-5.0
}

export function getTopGaps(scores: DimensionScores): DimensionKey[] {
  // Return the 3 lowest-scoring dimensions
}
```

---

## URL encoding: lib/encoding.ts

Encode the full answer map as a base64 query param so results pages are shareable and bookmarkable.

```typescript
export function encodeAnswers(answers: Record<string, number>): string
export function decodeAnswers(encoded: string): Record<string, number>
```

On the results page, read answers from `?r=<encoded>` and recompute scores client-side. No server needed.

---

## API route: app/api/recommend/route.ts

POST endpoint that accepts the dimension scores and returns Claude-generated recommendations.

Request body:
```json
{
  "scores": { "data_foundation": 3.2, "governance_and_risk": 1.8, ... },
  "tier": "Developing",
  "topGaps": ["governance_and_risk", "use_case_pipeline", "change_readiness"]
}
```

System prompt for Claude:
```
You are an AI transformation advisor. You help organizations understand their AI readiness 
and prioritize where to focus. You give direct, practical advice — not generic consulting 
language. You understand that AI transformation is as much about organizational change 
as it is about technology.
```

User prompt: construct dynamically from scores, tier, and gap dimensions. Ask Claude to produce:
- A 2-3 sentence overall assessment in plain language
- For each of the top 3 gap dimensions: a dimension name, a one-sentence interpretation of the score, and 2-3 concrete recommended actions

Return as structured JSON. Prompt Claude to respond in JSON only, no preamble.

Use `claude-sonnet-4-6`. Stream the response if you want a faster perceived load time, otherwise a single completion is fine.

Set the Anthropic API key from `process.env.ANTHROPIC_API_KEY`.

---

## Pages

### Landing page: app/page.tsx

Clean, minimal. Should feel like a real SaaS product.

- Headline: "Understand your organization's AI readiness"
- Subheadline: one sentence on what the assessment does and how long it takes (~5 minutes)
- Brief description of the six dimensions (can be a simple icon grid)
- Single CTA button: "Start assessment"
- Note: "No account required. Results are private and shareable via link."

### Assessment flow: app/assessment/page.tsx

Single-page flow — do not navigate between questions. Show all questions for one dimension at a time, with a progress indicator showing which dimension the user is on (1 of 6, 2 of 6, etc.).

- Show dimension name and a one-sentence description at the top of each section
- Each question displays with five labeled radio options
- "Next" button advances to the next dimension; disabled until all questions in the current dimension are answered
- "Back" button available from dimension 2 onward
- On the final dimension, button label changes to "See results"
- On submit: encode answers, navigate to `/results?r=<encoded>`

Do not use a form element. Use React state and onClick handlers.

### Results page: app/results/page.tsx

Reads `?r=` param on load, decodes answers, computes scores. Then fires the `/api/recommend` POST.

Layout (top to bottom):
1. Readiness tier badge (e.g. "Developing") with a brief tier description
2. Overall score (e.g. "2.8 / 5.0")
3. Radar chart showing all six dimension scores
4. Dimension summary cards — one per dimension, showing score and a static one-line interpretation (derive from score range, no Claude needed)
5. Claude recommendations panel — loading state while the API call is in flight, then overall assessment + top 3 gaps with recommended actions
6. Share button — copies the current URL to clipboard
7. "Retake assessment" link

---

## Visual design

Use Tailwind. Aim for clean and professional — this is a portfolio piece that should look like something you'd pay for.

- Background: white or very light gray
- Primary accent: a single color (suggest indigo or slate-blue — appropriate for enterprise/financial context)
- Typography: system font stack is fine, or Inter via Google Fonts
- Radar chart: use Recharts `RadarChart` with `PolarGrid`, `PolarAngleAxis`, `Radar`. Fill with a semi-transparent accent color.
- Dimension cards: subtle border, score shown as both a number and a small horizontal bar
- Tier badge: color-coded (e.g. gray=Foundation, blue=Developing, green=Scaling, purple=Leading)
- Mobile responsive — the assessment flow especially needs to work well on phone

---

## Environment

Create a `.env.local` file with:
```
ANTHROPIC_API_KEY=your_key_here
```

Add `.env.local` to `.gitignore`.

---

## What to build first (suggested order)

1. Scaffold Next.js project with Tailwind
2. Build `questions.ts` data file
3. Build `scoring.ts` and `encoding.ts` utilities with unit tests
4. Build the assessment flow page
5. Build the results page with radar chart (use mock scores first)
6. Build the `/api/recommend` route and wire up Claude
7. Build the landing page
8. Polish: loading states, error handling, mobile layout, share button

---

## Definition of done

- Assessment flow works end to end: land → answer questions → see results
- Radar chart renders correctly with real scores
- Claude recommendations load and display (with a loading state)
- Share URL works: opening it in a new tab shows the same results
- Looks professional enough to include in a portfolio or demo to an employer
- No hardcoded API keys, no console errors in production build
