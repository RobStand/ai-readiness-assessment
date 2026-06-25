import type { DimensionKey } from "@/lib/scoring";

export interface AnswerOption {
  label: string;
  score: number; // 1-5
}

export interface Question {
  id: string;
  dimension: DimensionKey;
  text: string;
  options: AnswerOption[];
}

export interface DimensionMeta {
  key: DimensionKey;
  name: string;
  description: string;
}

export const DIMENSIONS: DimensionMeta[] = [
  {
    key: "data_foundation",
    name: "Data Foundation",
    description: "Data quality, accessibility, and governance.",
  },
  {
    key: "technology_infrastructure",
    name: "Technology Infrastructure",
    description: "Cloud posture, integration capability, and security controls.",
  },
  {
    key: "talent_and_skills",
    name: "Talent & Skills",
    description: "AI literacy, leadership understanding, and technical depth.",
  },
  {
    key: "governance_and_risk",
    name: "Governance & Risk",
    description: "Policies, compliance posture, and ethical AI framework.",
  },
  {
    key: "use_case_pipeline",
    name: "Use Case Pipeline",
    description: "Ability to identify, prioritize, and scope AI opportunities.",
  },
  {
    key: "change_readiness",
    name: "Change Readiness",
    description: "Leadership alignment, change management capability, and culture.",
  },
];

// Reusable 5-point option helper. Labels are tailored per question.
function opts(labels: [string, string, string, string, string]): AnswerOption[] {
  return labels.map((label, i) => ({ label, score: i + 1 }));
}

export const QUESTIONS: Question[] = [
  // Data foundation
  {
    id: "df_1",
    dimension: "data_foundation",
    text: "How would you describe the accessibility of your core business data to analytics and AI teams?",
    options: opts([
      "Siloed and manual to retrieve",
      "Accessible with significant effort",
      "Available through some shared systems",
      "Mostly accessible with documentation",
      "API-accessible and well-documented",
    ]),
  },
  {
    id: "df_2",
    dimension: "data_foundation",
    text: "How confident are you in the accuracy and completeness of your organization's data?",
    options: opts([
      "Significant quality issues",
      "Frequent gaps and errors",
      "Mixed — varies by system",
      "Generally reliable",
      "Trusted and validated",
    ]),
  },
  {
    id: "df_3",
    dimension: "data_foundation",
    text: "Does your organization have documented data governance policies?",
    options: opts([
      "None",
      "Informal or partial",
      "Documented but inconsistently followed",
      "Documented and mostly followed",
      "Mature policies actively enforced",
    ]),
  },
  {
    id: "df_4",
    dimension: "data_foundation",
    text: "How well does your organization manage data privacy and compliance requirements?",
    options: opts([
      "Ad hoc",
      "Reactive to incidents",
      "Defined but uneven ownership",
      "Systematic with some ownership",
      "Systematic with clear ownership",
    ]),
  },

  // Technology infrastructure
  {
    id: "ti_1",
    dimension: "technology_infrastructure",
    text: "How would you describe your organization's cloud adoption?",
    options: opts([
      "Predominantly on-premises",
      "Early cloud experiments",
      "Hybrid with some cloud workloads",
      "Cloud-first for new systems",
      "Cloud-native with modern architecture",
    ]),
  },
  {
    id: "ti_2",
    dimension: "technology_infrastructure",
    text: "How easily can new AI tools and services be integrated into your existing technology stack?",
    options: opts([
      "Very difficult — many blockers",
      "Difficult and slow",
      "Possible with custom work",
      "Generally straightforward",
      "Well-defined APIs and integration patterns",
    ]),
  },
  {
    id: "ti_3",
    dimension: "technology_infrastructure",
    text: "How mature are your organization's security controls around data and systems access?",
    options: opts([
      "Basic",
      "Developing",
      "Defined and documented",
      "Strong with periodic review",
      "Comprehensive with regular audits",
    ]),
  },
  {
    id: "ti_4",
    dimension: "technology_infrastructure",
    text: "Do you have the compute and storage infrastructure to support AI workloads?",
    options: opts([
      "Significant gaps",
      "Limited capacity",
      "Adequate for small workloads",
      "Solid with room to grow",
      "Scalable and ready",
    ]),
  },

  // Talent and skills
  {
    id: "ts_1",
    dimension: "talent_and_skills",
    text: "How would you rate AI and data literacy among frontline employees?",
    options: opts([
      "Very low awareness",
      "Limited and pockets only",
      "Growing in some teams",
      "Broadly comfortable",
      "Widespread comfort with AI tools",
    ]),
  },
  {
    id: "ts_2",
    dimension: "talent_and_skills",
    text: "How well does senior leadership understand the strategic implications of AI?",
    options: opts([
      "Minimal awareness",
      "Surface-level interest",
      "Aware but not deeply engaged",
      "Informed and supportive",
      "Actively informed and engaged",
    ]),
  },
  {
    id: "ts_3",
    dimension: "talent_and_skills",
    text: "Does your organization have dedicated AI/ML engineering or data science capability?",
    options: opts([
      "None",
      "Individual contributors only",
      "Small emerging team",
      "Established team building track record",
      "Established team with proven delivery",
    ]),
  },
  {
    id: "ts_4",
    dimension: "talent_and_skills",
    text: "How effectively does your organization upskill employees on new technologies?",
    options: opts([
      "Rarely or reactively",
      "Occasional ad hoc training",
      "Some structured programs",
      "Consistent learning opportunities",
      "Proactive learning culture",
    ]),
  },

  // Governance and risk
  {
    id: "gr_1",
    dimension: "governance_and_risk",
    text: "Does your organization have a defined process for evaluating AI vendor risk?",
    options: opts([
      "None",
      "Informal case-by-case",
      "Partial process",
      "Defined process in most cases",
      "Formal process with documented criteria",
    ]),
  },
  {
    id: "gr_2",
    dimension: "governance_and_risk",
    text: "How well does your organization understand the regulatory environment for AI in your industry?",
    options: opts([
      "Limited awareness",
      "Aware of headline risks",
      "Tracking key developments",
      "Actively monitoring",
      "Actively monitoring and preparing",
    ]),
  },
  {
    id: "gr_3",
    dimension: "governance_and_risk",
    text: "Is there a named owner or committee responsible for AI governance?",
    options: opts([
      "No clear ownership",
      "Informal ownership",
      "Owner identified but limited mandate",
      "Committee forming with mandate",
      "Established with clear mandate",
    ]),
  },
  {
    id: "gr_4",
    dimension: "governance_and_risk",
    text: "How does your organization approach bias, fairness, and explainability in algorithmic decisions?",
    options: opts([
      "Not yet considered",
      "Discussed but no action",
      "Some informal checks",
      "Emerging frameworks",
      "Active frameworks in place",
    ]),
  },

  // Use case pipeline
  {
    id: "uc_1",
    dimension: "use_case_pipeline",
    text: "How effectively does your organization identify and prioritize AI use cases?",
    options: opts([
      "Ad hoc and opportunistic",
      "Driven by individual champions",
      "Some structured intake",
      "Repeatable prioritization",
      "Systematic process with clear criteria",
    ]),
  },
  {
    id: "uc_2",
    dimension: "use_case_pipeline",
    text: "How well does your organization scope and size AI initiatives before committing?",
    options: opts([
      "Rarely done",
      "Lightweight estimates only",
      "Inconsistent discovery",
      "Usually scoped before commit",
      "Consistent discovery and feasibility process",
    ]),
  },
  {
    id: "uc_3",
    dimension: "use_case_pipeline",
    text: "Does your organization have a backlog of validated AI use cases ready for development?",
    options: opts([
      "None",
      "A few unvalidated ideas",
      "Some validated candidates",
      "Growing prioritized list",
      "Robust prioritized pipeline",
    ]),
  },
  {
    id: "uc_4",
    dimension: "use_case_pipeline",
    text: "How successful has your organization been at moving AI pilots into production?",
    options: opts([
      "Most stall",
      "Rarely reach production",
      "Some make it through",
      "Often reach production",
      "Consistent delivery track record",
    ]),
  },

  // Change readiness
  {
    id: "cr_1",
    dimension: "change_readiness",
    text: "Is there a named executive sponsor actively championing AI transformation?",
    options: opts([
      "No clear sponsor",
      "Nominal sponsor only",
      "Sponsor with limited involvement",
      "Engaged sponsor",
      "Engaged sponsor with dedicated budget",
    ]),
  },
  {
    id: "cr_2",
    dimension: "change_readiness",
    text: "How has your organization historically responded to major technology-driven change?",
    options: opts([
      "Significant resistance",
      "Slow and reluctant",
      "Mixed adoption",
      "Generally adapts well",
      "Embraces change with strong adoption",
    ]),
  },
  {
    id: "cr_3",
    dimension: "change_readiness",
    text: "How aligned is senior leadership on the priority and urgency of AI investment?",
    options: opts([
      "Significant disagreement",
      "Divided views",
      "Loosely aligned",
      "Mostly aligned",
      "Strong unified commitment",
    ]),
  },
  {
    id: "cr_4",
    dimension: "change_readiness",
    text: "Does your organization have change management capability to support AI adoption?",
    options: opts([
      "None",
      "Limited and informal",
      "Some capability in pockets",
      "Established capability",
      "Experienced team with proven methodology",
    ]),
  },
  {
    id: "cr_5",
    dimension: "change_readiness",
    text: "How effectively does your organization communicate about technology change to employees?",
    options: opts([
      "Poor and reactive",
      "Inconsistent",
      "Adequate for major changes",
      "Generally clear and timely",
      "Proactive and transparent",
    ]),
  },
];

export function questionsForDimension(dimension: DimensionKey): Question[] {
  return QUESTIONS.filter((q) => q.dimension === dimension);
}
