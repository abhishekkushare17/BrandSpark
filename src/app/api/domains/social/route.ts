import { NextRequest, NextResponse } from "next/server";
import { SocialCheckResult } from "@/types";
import { verifySocialHandle } from "@/lib/domain-verifier";

const PLATFORMS: SocialCheckResult["platform"][] = [
  "GitHub",
  "YouTube",
  "Twitter / X",
  "Instagram",
  "LinkedIn",
  "Facebook",
];

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const results = await Promise.all(
      PLATFORMS.map((platform) => verifySocialHandle(name, platform))
    );

    return NextResponse.json({
      success: true,
      name,
      results,
    });
  } catch (err) {
    console.error("Social handles check error:", err);
    return NextResponse.json({ error: "Failed to verify social handles." }, { status: 500 });
  }
}
