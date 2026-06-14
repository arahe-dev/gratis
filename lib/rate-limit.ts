import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

interface RateLimitResult {
  success: boolean;
}

function createDevRatelimit(): { limit: (key: string) => Promise<RateLimitResult> } {
  const store = new Map<string, { count: number; resetAt: number }>();
  const WINDOW_MS = 10 * 60 * 1000;
  const MAX = 5;

  return {
    async limit(key: string): Promise<RateLimitResult> {
      const now = Date.now();
      const entry = store.get(key);
      if (!entry || entry.resetAt < now) {
        store.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return { success: true };
      }
      if (entry.count >= MAX) {
        return { success: false };
      }
      entry.count += 1;
      return { success: true };
    },
  };
}

function createRatelimit(prefix: string): { limit: (key: string) => Promise<RateLimitResult> } {
  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      return {
        async limit(): Promise<RateLimitResult> {
          throw new Error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN. Rate limiting requires Upstash Redis in production.");
        },
      };
    }
    return createDevRatelimit();
  }

  const redis = new Redis({ url, token });
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: false,
    prefix,
  });

  return {
    async limit(key: string): Promise<RateLimitResult> {
      const { success } = await ratelimit.limit(key);
      return { success };
    },
  };
}

export const waitlistRateLimit = createRatelimit("gratiscode:waitlist");
export const sponsorRateLimit = createRatelimit("gratiscode:sponsor");
