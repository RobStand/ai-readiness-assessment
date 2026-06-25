import { describe, it, expect } from "vitest";
import {
  computeDimensionScores,
  computeOverallScore,
  getReadinessTier,
  getTopGaps,
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
