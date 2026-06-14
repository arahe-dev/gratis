import { createHmac } from "crypto";
import { headers } from "next/headers";

const IP_HASH_SALT = process.env.IP_HASH_SALT;

if (!IP_HASH_SALT) {
  // Allow builds to proceed, but warn loudly.
  if (process.env.NODE_ENV === "production") {
    console.warn("IP_HASH_SALT is not set. Rate limiting will use a fallback salt.");
  }
}

/**
 * Hash an IP address with a server-side salt.
 * Used only for abuse prevention / rate limiting.
 */
export function hashIp(ip: string): string {
  const salt = IP_HASH_SALT ?? "gratiscode-fallback-salt-do-not-use-in-production";
  return createHmac("sha256", salt).update(ip).digest("hex");
}

/**
 * Extract the client IP from request headers in a proxy-safe way.
 * Falls back to "unknown" so rate limiting still has a key.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  const realIp = h.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

/**
 * Coarse, privacy-safe metadata for request logging.
 * Avoids storing raw UA, full IP, or other fingerprintable fields.
 */
export function coarseMetadata() {
  return {
    timestamp: new Date().toISOString(),
    // No user agent, no full IP, no fingerprinting.
  };
}
