/**
 * Simple in-memory rate limiter.
 * In production, swap this for Redis (e.g., Upstash Redis).
 *
 * Limits are keyed by hashed IP and by email address.
 */

export interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_KEY = 5; // submissions per window per key

function now() {
  return Date.now();
}

function getEntry(key: string): RateLimitEntry {
  const existing = store.get(key);
  if (!existing || existing.resetAt < now()) {
    const fresh: RateLimitEntry = { count: 0, resetAt: now() + WINDOW_MS };
    store.set(key, fresh);
    return fresh;
  }
  return existing;
}

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const entry = getEntry(key);
  if (entry.count >= MAX_REQUESTS_PER_KEY) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(0, Math.ceil((entry.resetAt - now()) / 1000)),
    };
  }
  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
