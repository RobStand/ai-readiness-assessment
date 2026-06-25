import type { DimensionKey, ReadinessTier } from "@/lib/scoring";

export interface GapRecommendation {
  dimension: DimensionKey;
  name: string;
  interpretation: string;
  actions: string[];
}

export interface Recommendations {
  overall: string;
  gaps: GapRecommendation[];
}

export interface RecommendRequest {
  scores: Record<DimensionKey, number>;
  tier: ReadinessTier;
  topGaps: DimensionKey[];
}
