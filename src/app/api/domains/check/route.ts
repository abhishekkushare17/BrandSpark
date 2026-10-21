import { NextRequest, NextResponse } from "next/server";
import { SUPPORTED_EXTENSIONS, verifyDomain } from "@/lib/domain-verifier";

export async function POST(req: NextRequest) {
  try {
    const { name, extensions } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Domain base name is required." }, { status: 400 });
    }

    const extsToCheck: string[] = Array.isArray(extensions) && extensions.length > 0 ? extensions : SUPPORTED_EXTENSIONS;

    // Check in parallel with Promise.all
    const results = await Promise.all(
      extsToCheck.map((ext) => verifyDomain(name, ext))
    );

    return NextResponse.json({
      success: true,
      name,
      results,
    });
  } catch (err) {
    console.error("Domain check error:", err);
    return NextResponse.json({ error: "Failed to verify domain availability." }, { status: 500 });
  }
}
