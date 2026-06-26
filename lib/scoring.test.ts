import { describe, it, expect } from "vitest";
import {
  computeDimensionScores,
  computeOverallScore,
  getReadinessTier,
  getTopGaps,
  rankDimensionsByScore,
} from "./scoring";
import { QUESTIONS } from "@/data/questions";

function answersForDimension(dimension: string, value: number) {
  const a: Record<string, number> = {};
  for (const q of QUESTIONS) {
    if (q.dimension === dimension) a[q.id] = value;
  }
  return a;
}

function allAnswers(value: number) {
  const a: Record<string, number> = {};
  for (const q of QUESTIONS) a[q.id] = value;
  return a;
}

describe("computeDimensionScores", () => {
  it("averages answers within a dimension", () => {
    const scores = computeDimensionScores(answersForDimension("data_foundation", 4));
    expect(scores.data_foundation).toBe(4);
  });

  it("returns 0 for unanswered dimensions", () => {
    const scores = computeDimensionScores({});
    expect(scores.governance_and_risk).toBe(0);
  });

  it("rounds to one decimal place", () => {
    const scores = computeDimensionScores({ df_1: 5, df_2: 4, df_3: 4, df_4: 4 });
    expect(scores.data_foundation).toBe(4.3);
  });
});

describe("computeOverallScore", () => {
  it("averages across all six dimensions", () => {
    const scores = computeDimensionScores(allAnswers(3));
    expect(computeOverallScore(scores)).toBe(3);
  });
});

describe("getReadinessTier", () => {
  it("maps score ranges to tiers", () => {
    expect(getReadinessTier(1.5)).toBe("Foundation");
    expect(getReadinessTier(2.0)).toBe("Developing");
    expect(getReadinessTier(2.9)).toBe("Developing");
    expect(getReadinessTier(3.0)).toBe("Scaling");
    expect(getReadinessTier(4.0)).toBe("Leading");
    expect(getReadinessTier(5.0)).toBe("Leading");
  });
});

describe("getTopGaps", () => {
  it("returns the three lowest-scoring dimensions", () => {
    const scores = {
      data_foundation: 5,
      technology_infrastructure: 4,
      talent_and_skills: 1,
      governance_and_risk: 2,
      use_case_pipeline: 3,
      change_readiness: 4.5,
    } as const;
    const gaps = getTopGaps({ ...scores });
    expect(gaps).toEqual([
      "talent_and_skills",
      "governance_and_risk",
      "use_case_pipeline",
    ]);
  });
});

describe("rankDimensionsByScore", () => {
  it("ranks highest score as 1 and lowest as 6", () => {
    const scores = {
      data_foundation: 5,
      technology_infrastructure: 4,
      talent_and_skills: 1,
      governance_and_risk: 2,
      use_case_pipeline: 3,
      change_readiness: 4.5,
    } as const;
    const ranks = rankDimensionsByScore({ ...scores });
    expect(ranks.data_foundation).toBe(1);
    expect(ranks.change_readiness).toBe(2);
    expect(ranks.technology_infrastructure).toBe(3);
    expect(ranks.use_case_pipeline).toBe(4);
    expect(ranks.governance_and_risk).toBe(5);
    expect(ranks.talent_and_skills).toBe(6);
  });

  it("breaks ties by canonical dimension order (stable)", () => {
    const scores = {
      data_foundation: 3,
      technology_infrastructure: 3,
      talent_and_skills: 3,
      governance_and_risk: 3,
      use_case_pipeline: 3,
      change_readiness: 3,
    } as const;
    const ranks = rankDimensionsByScore({ ...scores });
    expect(ranks.data_foundation).toBe(1);
    expect(ranks.technology_infrastructure).toBe(2);
    expect(ranks.change_readiness).toBe(6);
  });

  it("assigns every dimension a unique rank 1..6", () => {
    const scores = {
      data_foundation: 4.2,
      technology_infrastructure: 3.8,
      talent_and_skills: 3.2,
      governance_and_risk: 3.6,
      use_case_pipeline: 2.9,
      change_readiness: 3.7,
    } as const;
    const ranks = rankDimensionsByScore({ ...scores });
    expect(new Set(Object.values(ranks))).toEqual(new Set([1, 2, 3, 4, 5, 6]));
  });
});
