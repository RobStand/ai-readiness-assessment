# Design System — AI Readiness Assessment

> Source of truth for all visual and UI decisions. Read this before writing any
> component, page, or style. Created by `/design-consultation`.

## Product Context
- **What this is:** A standalone Next.js web app that scores an organization's AI
  readiness across six dimensions, renders a radar profile + readiness tier, and
  generates Claude-powered recommendations. Results are fully shareable by URL.
- **Who it's for:** Organizational decision-makers (directors, VPs, transformation
  leads) evaluating their org's readiness for AI.
- **Space/industry:** B2B SaaS / AI-transformation / maturity assessment.
- **Project type:** Web app — assessment flow + a results "report" page.
- **The memorable thing:** Every design decision serves one goal — *"An expert in
  AI transformation built this."* Authority comes from rigor and precision, not
  decoration. When in doubt, choose the more engineered, more legible option.

## Aesthetic Direction
- **Direction:** Instrument — technical precision. Cool neutrals, a grotesk
  display, monospace readouts, one confident accent. The product reads like a
  measurement instrument, not a quiz.
- **Decoration level:** Minimal — hairline rules, thin grid lines, monospace
  micro-labels. No gradients, no blobs, no drop-shadow-heavy cards.
- **Mood:** Precise, confident, legible, sequenced. Calm and exact.
- **Deliberately avoid:** warm-paper + serif + green/gold palettes (the current
  AI-design-tool default), purple/violet gradients, 3-column icon grids,
  centered-everything, bubble-radius on everything, Inter/Space Grotesk as
  display, system-ui as a type choice.
- **Reference feel:** Vercel / Stripe docs / Linear-grade engineered restraint.

## Typography
- **Display/Hero:** **Hanken Grotesk**, weight 800, letter-spacing −0.035em.
  Characterful grotesk, tight and confident — deliberately not Inter.
- **Body:** **Hanken Grotesk**, weight 400–500, letter-spacing −0.005em.
- **UI/Labels:** Hanken Grotesk (500–600). Uppercase micro-labels use **JetBrains
  Mono** (see below).
- **Data/Tables/Readouts:** **JetBrains Mono**, weight 600. All numeric scores,
  the radar tick + axis labels, dimension values, progress counters, and answer
  keys (A–D) render in mono — this is the core "instrument" signal. Monospace is
  naturally tabular, so columns align.
- **Code:** JetBrains Mono.
- **Loading:** Google Fonts —
  `https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap`
- **Scale (px):** display 56–72 / h1 28 / h2 23 / h3 19–20 / body 16 / small 14 /
  micro-label 11–12 (mono, uppercase, letter-spacing 0.05em).

## Color
- **Approach:** Restrained — cool neutrals + one cobalt accent. Color is rare and
  meaningful; the accent carries the brand and the data emphasis.

### Light (default)
- **Paper (background):** `#FBFBFA`
- **Surface:** `#FFFFFF`
- **Surface-2 (insets/inputs):** `#F5F6F6`
- **Ink (primary text):** `#111316`
- **Muted (secondary text):** `#686D74`
- **Faint (tertiary/labels):** `#9AA0A6`
- **Hairline:** `#E5E7E9` · **Hairline-2:** `#EEF0F1`
- **Accent — Cobalt:** `#2348FF` (primary actions, radar fill/stroke, selection,
  brand). Soft fill `rgba(35,72,255,.08)`, line `rgba(35,72,255,.22)`.

### Semantic (functional, not brand — small usage: dots, bars, alerts)
- **Positive:** `#1F8A52` · **Caution:** `#B26B00` · **Critical:** `#D2402E`
- Lowest-scoring dimensions use Caution on their bar fill; everything else uses
  the cobalt accent.

### Dark
- **Paper:** `#0C0D0F` · **Surface:** `#141619` · **Surface-2:** `#101215`
- **Ink:** `#ECEEF1` · **Muted:** `#9AA0A8` · **Faint:** `#6A7078`
- **Hairline:** `#23262B` · **Hairline-2:** `#1B1E22`
- **Accent — Cobalt:** `#5B7BFF` (lightened for contrast on dark)
- **Semantic:** Positive `#3FB07A` · Caution `#D69A3A` · Critical `#E26A5B`
- **Strategy:** redesign surfaces (don't just invert); accent lightens ~12% in
  lightness; semantics desaturate slightly.

## Spacing
- **Base unit:** 8px (4px allowed for tight micro-adjustments).
- **Density:** Comfortable — generous around the assessment flow and the report,
  tighter inside data grids.
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64).

## Layout
- **Approach:** Grid-disciplined. Hairline grids and explicit alignment. The
  results page is the hero surface — treat it as a precision readout (verdict +
  radar side by side, then a ranked dimension grid, then sequenced
  recommendations).
- **Grid:** results report top is a 2-col split (verdict / radar) collapsing to 1
  col under 860px; dimension cards are a 3-col grid (2-col on small screens).
- **Max content width:** 1080px, 32px gutters.
- **Border radius (hierarchical):** sm 3px · md 6px · lg 10px · card 14px. No
  fully-round pills except the mono tier tags (use radius-sm there, not 9999px) —
  progress tracks and score bars are the only `999px` radii.

## Motion
- **Approach:** Minimal-functional. Only transitions that aid comprehension.
- **Signature moments:** radar polygon draws/scales in on results load; dimension
  cards may stagger subtly. Nothing bouncy — restraint reads as authority.
- **Easing:** enter `ease-out` · exit `ease-in` · move `ease-in-out`.
- **Duration:** micro 50–100ms (hover/active) · short 150–250ms (selection,
  buttons) · medium 250–400ms (radar/entrance) · long 400–700ms (rare).

## Component Notes
- **Buttons:** primary = solid cobalt, white text, radius-md; secondary = surface
  + hairline border (hover → cobalt border); ghost = cobalt text, no fill.
- **Answer options:** mono key chip (A–D) + label; selected state = cobalt border
  + `accent-soft` background + cobalt key. The flow stays one question per view
  with a `n / 25` mono counter and a thin cobalt progress track.
- **Dimension cards:** name + mono rank (`01`–`06`), big mono value `/ 5`, a thin
  score bar (cobalt, or caution for the lowest dimensions).
- **Tier badge:** mono, uppercase, radius-sm; active tier filled cobalt.
- **Radar chart:** cool hairline rings + axes, mono tick numbers and axis labels,
  cobalt polygon (`accent-soft` fill, 2.5px cobalt stroke), surface-filled
  cobalt-stroked vertices. It is the hero artifact — give it room.
- **Alerts/status:** surface-2 background, hairline border, a small semantic dot,
  bold lead word.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-25 | Initial design system created (Instrument direction) | Created by `/design-consultation`. Researched Anthropic / Linear / Vanta; chose engineered precision over editorial warmth to serve the "an expert built this" goal. |
| 2026-06-25 | Rejected warm-paper + serif (Fraunces) + spruce/gold | User feedback: read as "AI-generated." That palette has become the default AI-design-tool look. |
| 2026-06-25 | Hanken Grotesk + JetBrains Mono; cobalt `#2348FF` on cool neutral `#FBFBFA` | Distinctive non-default grotesk; monospace readouts signal a precision instrument; single saturated accent carries brand + data emphasis. |
