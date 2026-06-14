import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { waitlistSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp, hashIp } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot check: if filled, silently reject without revealing it's a honeypot.
    if (body.website && String(body.website).length > 0) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const parsed = waitlistSchema.safeParse(body);
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
    const emailKey = `waitlist:email:${parsed.data.email.toLowerCase()}`;
    const ipKey = `waitlist:ip:${ipHash}`;

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

    await prisma.waitlistSignup.create({
      data: {
        name: parsed.data.name.trim(),
        email: parsed.data.email.trim().toLowerCase(),
        city: parsed.data.city?.trim() || null,
        type: parsed.data.type,
        currentTool: parsed.data.currentTool?.trim() || null,
        whyInterested: parsed.data.whyInterested?.trim() || null,
        consentAt: new Date(),
        source: "website",
        ipHash,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    // Safe logging: no raw UA, no full IP, no stack traces to user.
    console.error("Waitlist error:", {
      time: new Date().toISOString(),
      type: error instanceof Error ? error.name : "unknown",
    });

    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return NextResponse.json(
        { message: "This email is already on the waitlist." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
