import { NextRequest, NextResponse } from "next/server";
import { extractAuthUser } from "@/lib/auth";
import { deleteProject, getProjectById, saveProject } from "@/lib/db";
import { BrandingProject } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = extractAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = getProjectById(params.id, user.id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, project });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = extractAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = getProjectById(params.id, user.id);
  if (!existing) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  try {
    const updates = (await req.json()) as Partial<BrandingProject>;
    const updatedProject: BrandingProject = {
      ...existing,
      ...updates,
      id: existing.id,
      userId: user.id,
      updatedAt: new Date().toISOString(),
    };

    const saved = saveProject(updatedProject);
    return NextResponse.json({ success: true, project: saved });
  } catch (err) {
    console.error("Update project error:", err);
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = extractAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const success = deleteProject(params.id, user.id);
  if (!success) {
    return NextResponse.json({ error: "Project not found or already deleted." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Project deleted successfully" });
}
