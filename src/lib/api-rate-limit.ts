import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMITS = {
  login: { windowMs: 15 * 60 * 1000, maxRequests: 10 },
  register: { windowMs: 60 * 60 * 1000, maxRequests: 5 },
  "forgot-password": { windowMs: 60 * 1000, maxRequests: 3 },
  "verify-otp": { windowMs: 15 * 60 * 1000, maxRequests: 10 },
  "reset-password": { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  "referrals-challenge": { windowMs: 60 * 1000, maxRequests: 10 },
  "verify-instagram": { windowMs: 60 * 1000, maxRequests: 10 },
} as const;

type RateLimitKey = keyof typeof RATE_LIMITS;

export function applyRateLimit(request: Request, key: RateLimitKey): NextResponse | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const rateLimitKey = `${key}:${ip}`;
  const config = RATE_LIMITS[key];

  const { allowed, retryAfter } = checkRateLimit(rateLimitKey, config);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": config.maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return null;
}
