import { NextRequest, NextResponse } from "next/server";
import { generateSlogans } from "@/lib/ai-generator";

export async function POST(req: NextRequest) {
  try {
    const { brandName, businessIdea, industry } = await req.json();

    if (!brandName) {
      return NextResponse.json({ error: "Brand name is required." }, { status: 400 });
    }

    const customApiKey = req.headers.get("x-gemini-key") || undefined;

    const slogans = await generateSlogans(
      brandName,
      businessIdea || `A modern venture in ${industry || "commercial technology"}`,
      industry || "Technology",
      customApiKey
    );

    return NextResponse.json({
      success: true,
      count: slogans.length,
      slogans,
    });
  } catch (err) {
    console.error("Slogan generation route error:", err);
    return NextResponse.json({ error: "Failed to generate slogans." }, { status: 500 });
  }
}
