import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  DIMENSION_KEYS,
  DIMENSION_LABELS,
  type DimensionKey,
  type ReadinessTier,
} from "@/lib/scoring";
import type { Recommendations, RecommendRequest } from "@/lib/types";

export const runtime = "nodejs";

const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are an AI transformation advisor. You help organizations understand their AI readiness and prioritize where to focus. You give direct, practical advice — not generic consulting language. You understand that AI transformation is as much about organizational change as it is about technology.`;

function isValidTier(t: unknown): t is ReadinessTier {
  return (
    t === "Foundation" ||
    t === "Developing" ||
    t === "Scaling" ||
    t === "Leading"
  );
}

function buildUserPrompt(body: RecommendRequest): string {
  const scoreLines = DIMENSION_KEYS.map(
    (k) => `- ${DIMENSION_LABELS[k]}: ${body.scores[k]?.toFixed(1) ?? "n/a"} / 5.0`
  ).join("\n");

  const gapLines = body.topGaps
    .map((k) => `- ${DIMENSION_LABELS[k]} (key: "${k}")`)
    .join("\n");

  return `An organization has completed an AI readiness assessment. Here are their results.

Overall readiness tier: ${body.tier}

Dimension scores (1.0 lowest, 5.0 highest):
${scoreLines}

The three priority gap dimensions to address are:
${gapLines}

Produce a JSON object with exactly this shape:
{
  "overall": "2-3 sentence overall assessment in plain language, specific to these scores",
  "gaps": [
    {
      "dimension": "<the dimension key, e.g. governance_and_risk>",
      "name": "<human-readable dimension name>",
      "interpretation": "one-sentence interpretation of why this score matters for them",
      "actions": ["2-3 concrete, specific recommended actions"]
    }
  ]
}

Include exactly one gaps entry for each of the three priority gap dimensions, in the same order given. Use the exact dimension keys provided. Respond with JSON only — no preamble, no markdown, no code fences.`;
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    return trimmed.slice(first, last + 1);
  }
  return trimmed;
}

function validateBody(body: unknown): body is RecommendRequest {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (!isValidTier(b.tier)) return false;
  if (!b.scores || typeof b.scores !== "object") return false;
  if (!Array.isArray(b.topGaps) || b.topGaps.length === 0) return false;
  return true;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!validateBody(body)) {
    return NextResponse.json(
      { error: "Request must include scores, tier, and topGaps." },
      { status: 400 }
    );
  }

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(body) }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const raw = textBlock && textBlock.type === "text" ? textBlock.text : "";

    let parsed: Recommendations;
    try {
      parsed = JSON.parse(extractJson(raw)) as Recommendations;
    } catch {
      return NextResponse.json(
        { error: "The model returned an unparseable response. Please retry." },
        { status: 502 }
      );
    }

    if (!parsed.overall || !Array.isArray(parsed.gaps)) {
      return NextResponse.json(
        { error: "The model response was missing expected fields." },
        { status: 502 }
      );
    }

    // Coerce dimension keys defensively so the client can render reliably.
    parsed.gaps = parsed.gaps.map((g) => ({
      dimension: g.dimension as DimensionKey,
      name:
        g.name ||
        DIMENSION_LABELS[g.dimension as DimensionKey] ||
        String(g.dimension),
      interpretation: g.interpretation ?? "",
      actions: Array.isArray(g.actions) ? g.actions : [],
    }));

    return NextResponse.json(parsed);
  } catch (err) {
    const messageText =
      err instanceof Error ? err.message : "Unknown error calling the model.";
    return NextResponse.json(
      { error: `Failed to generate recommendations: ${messageText}` },
      { status: 502 }
    );
  }
}
