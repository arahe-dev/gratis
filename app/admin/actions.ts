"use server";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export type AdminDataResult =
  | { success: false; message: string }
  | {
      success: true;
      waitlistCount: number;
      sponsorCount: number;
      recentWaitlist: {
        id: string; name: string; email: string; type: string;
        city: string | null; createdAt: Date;
      }[];
      recentSponsors: {
        id: string; name: string; email: string; company: string;
        budgetRange: string; createdAt: Date;
      }[];
    };

export async function getAdminData(password: string): Promise<AdminDataResult> {
  // Local/dev-only dashboard until real authentication exists. It must never be
  // exposed on public production deployments with password-only protection.
  if (process.env.NODE_ENV === "production" || process.env.ENABLE_ADMIN !== "true") {
    notFound();
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) {
    return { success: false, message: "Invalid password." };
  }

  const [waitlistCount, sponsorCount, recentWaitlist, recentSponsors] = await Promise.all([
    prisma.waitlistSignup.count(),
    prisma.sponsorLead.count(),
    prisma.waitlistSignup.findMany({ take: 10, orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, type: true, city: true, createdAt: true } }),
    prisma.sponsorLead.findMany({ take: 10, orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, company: true, budgetRange: true, createdAt: true } }),
  ]);

  return { success: true, waitlistCount, sponsorCount, recentWaitlist, recentSponsors };
}
