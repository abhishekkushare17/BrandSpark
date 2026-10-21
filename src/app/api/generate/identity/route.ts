import { NextRequest, NextResponse } from "next/server";
import { generateBrandIdentity } from "@/lib/ai-generator";

export async function POST(req: NextRequest) {
  try {
    const { brandName, businessIdea, industry, audience, tone } = await req.json();

    if (!brandName) {
      return NextResponse.json({ error: "Brand name is required." }, { status: 400 });
    }

    const customApiKey = req.headers.get("x-gemini-key") || undefined;

    const brandIdentity = await generateBrandIdentity(
      brandName,
      businessIdea || `${brandName} in ${industry || "Technology"}`,
      industry || "Technology",
      audience || "Modern Professionals",
      tone || "Innovative & Trustworthy",
      customApiKey
    );

    return NextResponse.json({
      success: true,
      brandIdentity,
    });
  } catch (err) {
    console.error("Brand identity generation error:", err);
    return NextResponse.json({ error: "Failed to generate brand identity." }, { status: 500 });
  }
}
