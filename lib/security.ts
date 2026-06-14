import crypto from "node:crypto";
import { headers } from "next/headers";

const salt = process.env.IP_HASH_SALT;

if (!salt && process.env.NODE_ENV === "production") {
  throw new Error("IP_HASH_SALT must be set in production.");
}

export function hashIp(ip: string | null): string | null {
  if (!ip) return null;

  const effectiveSalt = salt ?? "dev-only-local-salt";

  return crypto
    .createHmac("sha256", effectiveSalt)
    .update(ip)
    .digest("hex");
}

export async function getClientIp(): Promise<string | null> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  const realIp = h.get("x-real-ip");
  if (realIp) return realIp;
  return null;
}

export function coarseMetadata() {
  return { timestamp: new Date().toISOString() };
}
