import { QUESTIONS } from "@/data/questions";

export type DimensionKey =
  | "data_foundation"
  | "technology_infrastructure"
  | "talent_and_skills"
  | "governance_and_risk"
  | "use_case_pipeline"
  | "change_readiness";

export type DimensionScores = Record<DimensionKey, number>; // 1.0 - 5.0

export type ReadinessTier = "Foundation" | "Developing" | "Scaling" | "Leading";

export const DIMENSION_KEYS: DimensionKey[] = [
  "data_foundation",
  "technology_infrastructure",
  "talent_and_skills",
  "governance_and_risk",
  "use_case_pipeline",
  "change_readiness",
];

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  data_foundation: "Data Foundation",
  technology_infrastructure: "Technology Infrastructure",
  talent_and_skills: "Talent & Skills",
  governance_and_risk: "Governance & Risk",
  use_case_pipeline: "Use Case Pipeline",
  change_readiness: "Change Readiness",
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Group answers by dimension and average them. Questions without an answer
 * are ignored; a dimension with no answers defaults to 0.
 */
export function computeDimensionScores(
  answers: Record<string, number>
): DimensionScores {
  const sums: Record<DimensionKey, number> = {
    data_foundation: 0,
    technology_infrastructure: 0,
    talent_and_skills: 0,
    governance_and_risk: 0,
    use_case_pipeline: 0,
    change_readiness: 0,
  };
  const counts: Record<DimensionKey, number> = {
    data_foundation: 0,
    technology_infrastructure: 0,
    talent_and_skills: 0,
    governance_and_risk: 0,
    use_case_pipeline: 0,
    change_readiness: 0,
  };

  for (const q of QUESTIONS) {
    const value = answers[q.id];
    if (typeof value === "number" && !Number.isNaN(value)) {
      sums[q.dimension] += value;
      counts[q.dimension] += 1;
    }
  }

  const scores = {} as DimensionScores;
  for (const key of DIMENSION_KEYS) {
    scores[key] = counts[key] > 0 ? round1(sums[key] / counts[key]) : 0;
  }
  return scores;
}

export function computeOverallScore(scores: DimensionScores): number {
  const values = DIMENSION_KEYS.map((k) => scores[k]);
  const total = values.reduce((a, b) => a + b, 0);
  return round1(total / values.length);
}

export function getReadinessTier(overall: number): ReadinessTier {
  if (overall >= 4.0) return "Leading";
  if (overall >= 3.0) return "Scaling";
  if (overall >= 2.0) return "Developing";
  return "Foundation";
}

/**
 * Return the 3 lowest-scoring dimensions (ascending by score). Ties are broken
 * by the canonical dimension order.
 */
export function getTopGaps(scores: DimensionScores): DimensionKey[] {
  return [...DIMENSION_KEYS]
    .sort((a, b) => {
      if (scores[a] !== scores[b]) return scores[a] - scores[b];
      return DIMENSION_KEYS.indexOf(a) - DIMENSION_KEYS.indexOf(b);
    })
    .slice(0, 3);
}

/**
 * Rank dimensions by score (highest = rank 1) for the mono rank chips on the
 * results page. Ties are broken by the canonical dimension order so the ranking
 * is stable. Returns a map of dimension key → 1-based rank.
 */
export function rankDimensionsByScore(
  scores: DimensionScores
): Record<DimensionKey, number> {
  const ordered = [...DIMENSION_KEYS].sort((a, b) => {
    if (scores[a] !== scores[b]) return scores[b] - scores[a];
    return DIMENSION_KEYS.indexOf(a) - DIMENSION_KEYS.indexOf(b);
  });
  const ranks = {} as Record<DimensionKey, number>;
  ordered.forEach((key, index) => {
    ranks[key] = index + 1;
  });
  return ranks;
}

export const TIER_DESCRIPTIONS: Record<ReadinessTier, string> = {
  Foundation:
    "You're at the beginning of the journey. Focus on building the data, governance, and leadership foundations that everything else depends on.",
  Developing:
    "The building blocks are emerging. Prioritize closing your biggest gaps and turning isolated wins into repeatable practices.",
  Scaling:
    "You have real momentum. Concentrate on operationalizing what works and removing the bottlenecks that slow delivery.",
  Leading:
    "You're operating at a high level of maturity. Sustain your advantage by deepening governance, talent, and a steady use-case pipeline.",
};

export function interpretScore(score: number): string {
  if (score >= 4.0) return "A clear strength to build on.";
  if (score >= 3.0) return "Solid, with room to mature.";
  if (score >= 2.0) return "Developing — needs focused investment.";
  if (score > 0) return "An early-stage gap to prioritize.";
  return "Not yet assessed.";
}
