import { NextRequest, NextResponse } from "next/server";
import { extractAuthUser } from "@/lib/auth";
import { getUserProjects, saveProject } from "@/lib/db";
import { BrandingProject } from "@/types";

export async function GET(req: NextRequest) {
  const user = extractAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = getUserProjects(user.id);
  return NextResponse.json({ success: true, projects });
}

export async function POST(req: NextRequest) {
  const user = extractAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projectData = (await req.json()) as BrandingProject;

    if (!projectData.name) {
      return NextResponse.json({ error: "Project name is required." }, { status: 400 });
    }

    const projectToSave: BrandingProject = {
      ...projectData,
      id: projectData.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id,
      names: projectData.names || [],
      slogans: projectData.slogans || [],
      logos: projectData.logos || [],
      comparedNameIds: projectData.comparedNameIds || [],
      favoriteNameIds: projectData.favoriteNameIds || [],
      favoriteSloganIds: projectData.favoriteSloganIds || [],
      createdAt: projectData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = saveProject(projectToSave);
    return NextResponse.json({ success: true, project: saved });
  } catch (err) {
    console.error("Project save error:", err);
    return NextResponse.json({ error: "Failed to save project." }, { status: 500 });
  }
}
