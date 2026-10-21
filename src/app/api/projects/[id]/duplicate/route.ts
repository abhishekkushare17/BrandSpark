import { NextRequest, NextResponse } from "next/server";
import { extractAuthUser } from "@/lib/auth";
import { duplicateProject } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = extractAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const duplicated = duplicateProject(params.id, user.id);
  if (!duplicated) {
    return NextResponse.json({ error: "Project could not be duplicated" }, { status: 404 });
  }

  return NextResponse.json({ success: true, project: duplicated });
}
