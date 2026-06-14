import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { waitlistSchema } from "@/lib/validation";
import { waitlistRateLimit } from "@/lib/rate-limit";
import { getClientIp, hashIp } from "@/lib/security";
import { isUniqueConstraintError } from "@/lib/db-errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Object.prototype.hasOwnProperty.call(body, "website")) {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }

    if (String(body.website).trim().length > 0) {
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

    if (ipHash) {
      const { success } = await waitlistRateLimit.limit(ipHash);
      if (!success) {
        return NextResponse.json(
          { message: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
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
    console.error("Waitlist error:", {
      time: new Date().toISOString(),
      type: error instanceof Error ? error.name : "unknown",
    });

    if (isUniqueConstraintError(error)) {
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
