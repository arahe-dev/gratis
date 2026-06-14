import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sponsorSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp, hashIp } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot check
    if (body.website && String(body.website).length > 0) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const parsed = sponsorSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return NextResponse.json({ message: "Please check the form.", fieldErrors }, { status: 400 });
    }

    const ip = await getClientIp();
    const ipHash = hashIp(ip);
    const emailKey = `sponsor:email:${parsed.data.email.toLowerCase()}`;
    const ipKey = `sponsor:ip:${ipHash}`;

    const emailLimit = checkRateLimit(emailKey);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { message: "Too many submissions from this email. Please try again later." },
        { status: 429 }
      );
    }

    const ipLimit = checkRateLimit(ipKey);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { message: "Too many submissions from this network. Please try again later." },
        { status: 429 }
      );
    }

    await prisma.sponsorLead.create({
      data: {
        name: parsed.data.name.trim(),
        email: parsed.data.email.trim().toLowerCase(),
        company: parsed.data.company.trim(),
        budgetRange: parsed.data.budgetRange,
        targetAudience: parsed.data.targetAudience?.trim() || null,
        message: parsed.data.message?.trim() || null,
        consentAt: new Date(),
        source: "website",
        ipHash,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Sponsor error:", {
      time: new Date().toISOString(),
      type: error instanceof Error ? error.name : "unknown",
    });

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
