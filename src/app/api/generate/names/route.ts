import { NextRequest, NextResponse } from "next/server";
import { generateBusinessNames } from "@/lib/ai-generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessIdea,
      industry,
      targetAudience,
      language,
      personality,
      keywordsInclude,
      keywordsExclude,
      nameLength,
    } = body;

    if (!businessIdea || !industry) {
      return NextResponse.json(
        { error: "Business idea and industry are required." },
        { status: 400 }
      );
    }

    const customApiKey = req.headers.get("x-gemini-key") || undefined;

    const names = await generateBusinessNames({
      businessIdea,
      industry,
      targetAudience: targetAudience || "General Consumers",
      language: language || "English",
      personality: personality || "Modern & Innovative",
      keywordsInclude,
      keywordsExclude,
      nameLength,
      customApiKey,
    });

    return NextResponse.json({
      success: true,
      count: names.length,
      names,
      aiModel: customApiKey || process.env.GEMINI_API_KEY ? "Gemini-Enhanced" : "BrandSpark-Neural-Algorithmic",
    });
  } catch (err) {
    console.error("Name generation route error:", err);
    return NextResponse.json({ error: "Failed to generate names." }, { status: 500 });
  }
}
