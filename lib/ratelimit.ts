import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

/**
 * IP-based rate limiting for the recommendations API.
 *
 * Uses Upstash Redis when configured via UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN. If those env vars are absent (e.g. local dev),
 * rate limiting is silently disabled so the app still works end to end.
 */

const MAX_REQUESTS_PER_DAY = 5;

function hasUpstashConfig(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

// Log once, when this module is first loaded (i.e. on the first request that
// reaches the recommend route), so the active mode is visible at a glance.
console.log(
  hasUpstashConfig()
    ? `[ratelimit] enabled — ${MAX_REQUESTS_PER_DAY} assessments per IP per day (Upstash Redis)`
    : "[ratelimit] disabled — set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable"
);

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;
  if (!hasUpstashConfig()) return null;

  ratelimit = new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    }),
    // Up to MAX_REQUESTS_PER_DAY assessments per IP, rolling 24-hour window.
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS_PER_DAY, "1 d"),
    analytics: true,
    prefix: "ratelimit:recommend",
  });
  return ratelimit;
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

export interface RateLimitResult {
  success: boolean;
  /** Seconds until the limit resets (only meaningful when success is false). */
  retryAfterSeconds: number;
  limit: number;
  remaining: number;
}

export async function checkRateLimit(
  req: NextRequest
): Promise<RateLimitResult> {
  const limiter = getRatelimit();

  // Rate limiting not configured — allow the request.
  if (!limiter) {
    return {
      success: true,
      retryAfterSeconds: 0,
      limit: MAX_REQUESTS_PER_DAY,
      remaining: MAX_REQUESTS_PER_DAY,
    };
  }

  const ip = getClientIp(req);
  const { success, limit, remaining, reset } = await limiter.limit(ip);
  const retryAfterSeconds = Math.max(0, Math.ceil((reset - Date.now()) / 1000));

  return { success, retryAfterSeconds, limit, remaining };
}
