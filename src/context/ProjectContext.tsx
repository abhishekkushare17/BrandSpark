"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { BrandingProject, GeneratedName, GeneratedSlogan, LogoConfig } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

interface ProjectContextType {
  currentProject: BrandingProject | null;
  projects: BrandingProject[];
  activeTab: "generator" | "slogans" | "studio" | "logos" | "domains" | "compare" | "projects" | "export";
  setActiveTab: (tab: ProjectContextType["activeTab"]) => void;
  setCurrentProject: React.Dispatch<React.SetStateAction<BrandingProject | null>>;
  loadProjects: () => Promise<void>;
  createProject: (input: {
    name: string;
    businessIdea: string;
    industry: string;
    targetAudience: string;
    language?: string;
    personality?: string;
    keywordsInclude?: string;
    keywordsExclude?: string;
    nameLength?: "short" | "medium" | "any";
  }) => Promise<BrandingProject>;
  saveCurrentProject: () => Promise<void>;
  deleteProject: (id: string) => Promise<boolean>;
  duplicateProject: (id: string) => Promise<boolean>;
  toggleFavoriteName: (nameId: string) => void;
  toggleFavoriteSlogan: (sloganId: string) => void;
  addToComparison: (nameId: string) => boolean;
  removeFromComparison: (nameId: string) => void;
  selectWinnerName: (name: string) => void;
  addLogoToProject: (logo: LogoConfig) => void;
  isSaving: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const DEFAULT_DEMO_PROJECT: BrandingProject = {
  id: "proj_demo_nexus",
  userId: "demo_guest",
  name: "BrandSpark AI Venture",
  businessIdea: "An all-in-one AI platform that builds instant corporate identities, naming, and visual design assets.",
  industry: "Tech & AI",
  targetAudience: "Founders, Creators, & SaaS Agencies",
  language: "English",
  personality: "Futuristic, Sophisticated & Trustworthy",
  keywordsInclude: "spark, nexus",
  keywordsExclude: "cheap, basic",
  nameLength: "medium",
  selectedWinnerName: "BrandSpark",
  names: [],
  slogans: [],
  logos: [],
  comparedNameIds: [],
  favoriteNameIds: [],
  favoriteSloganIds: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { success, error, warning } = useToast();
  const [currentProject, setCurrentProject] = useState<BrandingProject | null>(DEFAULT_DEMO_PROJECT);
  const [projects, setProjects] = useState<BrandingProject[]>([]);
  const [activeTab, setActiveTab] = useState<ProjectContextType["activeTab"]>("generator");
  const [isSaving, setIsSaving] = useState(false);

  const loadProjects = useCallback(async () => {
    if (!user) {
      setProjects([DEFAULT_DEMO_PROJECT]);
      return;
    }
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        if (data.projects && data.projects.length > 0 && currentProject?.id === DEFAULT_DEMO_PROJECT.id) {
          setCurrentProject(data.projects[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  }, [user, currentProject?.id]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const saveCurrentProject = async () => {
    if (!currentProject) return;
    setIsSaving(true);
    try {
      if (!user) {
        // Save in localStorage for guest
        localStorage.setItem(`brandspark_guest_${currentProject.id}`, JSON.stringify(currentProject));
        success("Saved Locally", "Sign in to securely sync your projects across devices.");
        setIsSaving(false);
        return;
      }

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProject),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentProject(data.project);
        setProjects((prev) => {
          const idx = prev.findIndex((p) => p.id === data.project.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = data.project;
            return copy;
          }
          return [data.project, ...prev];
        });
        success("Project Saved", `"${currentProject.name}" saved successfully.`);
      } else {
        error("Save Error", "Could not save project to server.");
      }
    } catch {
      error("Save Error", "Network error while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const createProject = async (input: {
    name: string;
    businessIdea: string;
    industry: string;
    targetAudience: string;
    language?: string;
    personality?: string;
    keywordsInclude?: string;
    keywordsExclude?: string;
    nameLength?: "short" | "medium" | "any";
  }): Promise<BrandingProject> => {
    const newProj: BrandingProject = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user?.id || "guest",
      name: input.name || "Untitled Project",
      businessIdea: input.businessIdea,
      industry: input.industry,
      targetAudience: input.targetAudience,
      language: input.language || "English",
      personality: input.personality || "Modern & Innovative",
      keywordsInclude: input.keywordsInclude || "",
      keywordsExclude: input.keywordsExclude || "",
      nameLength: input.nameLength || "any",
      names: [],
      slogans: [],
      logos: [],
      comparedNameIds: [],
      favoriteNameIds: [],
      favoriteSloganIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (user) {
      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProj),
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentProject(data.project);
          setProjects((prev) => [data.project, ...prev]);
          success("Project Created", `Started project "${data.project.name}"`);
          return data.project;
        }
      } catch (err) {
        console.error("Create project error:", err);
      }
    }

    // Guest fallback
    setCurrentProject(newProj);
    setProjects((prev) => [newProj, ...prev]);
    success("Project Created", `Started project "${newProj.name}"`);
    return newProj;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    if (user) {
      try {
        const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
        if (!res.ok) {
          error("Delete Error", "Could not delete project from database.");
          return false;
        }
      } catch {
        error("Delete Error", "Network error.");
        return false;
      }
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (currentProject?.id === id) {
      const remaining = projects.filter((p) => p.id !== id);
      setCurrentProject(remaining[0] || DEFAULT_DEMO_PROJECT);
    }
    success("Project Deleted", "Project was removed.");
    return true;
  };

  const duplicateProject = async (id: string): Promise<boolean> => {
    if (user) {
      try {
        const res = await fetch(`/api/projects/${id}/duplicate`, { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          setProjects((prev) => [data.project, ...prev]);
          setCurrentProject(data.project);
          success("Project Duplicated", `Created copy "${data.project.name}"`);
          return true;
        }
      } catch {
        error("Duplicate Error", "Network error.");
        return false;
      }
    }

    // Guest fallback
    const target = projects.find((p) => p.id === id) || currentProject;
    if (!target) return false;
    const duplicated: BrandingProject = {
      ...JSON.parse(JSON.stringify(target)),
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [duplicated, ...prev]);
    setCurrentProject(duplicated);
    success("Project Duplicated", `Created copy "${duplicated.name}"`);
    return true;
  };

  const toggleFavoriteName = (nameId: string) => {
    if (!currentProject) return;
    const isFav = currentProject.favoriteNameIds.includes(nameId);
    const updatedFavs = isFav
      ? currentProject.favoriteNameIds.filter((id) => id !== nameId)
      : [...currentProject.favoriteNameIds, nameId];

    const updatedNames = currentProject.names.map((n) =>
      n.id === nameId ? { ...n, isFavorite: !isFav } : n
    );

    setCurrentProject({
      ...currentProject,
      favoriteNameIds: updatedFavs,
      names: updatedNames,
    });
  };

  const toggleFavoriteSlogan = (sloganId: string) => {
    if (!currentProject) return;
    const isFav = currentProject.favoriteSloganIds.includes(sloganId);
    const updatedFavs = isFav
      ? currentProject.favoriteSloganIds.filter((id) => id !== sloganId)
      : [...currentProject.favoriteSloganIds, sloganId];

    const updatedSlogans = currentProject.slogans.map((s) =>
      s.id === sloganId ? { ...s, isFavorite: !isFav } : s
    );

    setCurrentProject({
      ...currentProject,
      favoriteSloganIds: updatedFavs,
      slogans: updatedSlogans,
    });
  };

  const addToComparison = (nameId: string): boolean => {
    if (!currentProject) return false;
    if (currentProject.comparedNameIds.includes(nameId)) {
      warning("Already Added", "This name is already in your comparison table.");
      return false;
    }
    if (currentProject.comparedNameIds.length >= 5) {
      warning("Limit Reached", "You can compare up to 5 names at a time.");
      return false;
    }

    setCurrentProject({
      ...currentProject,
      comparedNameIds: [...currentProject.comparedNameIds, nameId],
    });
    success("Added to Compare", "Name added to side-by-side comparison matrix.");
    return true;
  };

  const removeFromComparison = (nameId: string) => {
    if (!currentProject) return;
    setCurrentProject({
      ...currentProject,
      comparedNameIds: currentProject.comparedNameIds.filter((id) => id !== nameId),
    });
  };

  const selectWinnerName = (name: string) => {
    if (!currentProject) return;
    setCurrentProject({
      ...currentProject,
      selectedWinnerName: name,
    });
    success("Winner Selected! 🏆", `"${name}" chosen as final brand name.`);
  };

  const addLogoToProject = (logo: LogoConfig) => {
    if (!currentProject) return;
    setCurrentProject({
      ...currentProject,
      logos: [logo, ...currentProject.logos],
    });
    success("Logo Saved", "Vector logo asset added to project kit.");
  };

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        projects,
        activeTab,
        setActiveTab,
        setCurrentProject,
        loadProjects,
        createProject,
        saveCurrentProject,
        deleteProject,
        duplicateProject,
        toggleFavoriteName,
        toggleFavoriteSlogan,
        addToComparison,
        removeFromComparison,
        selectWinnerName,
        addLogoToProject,
        isSaving,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
