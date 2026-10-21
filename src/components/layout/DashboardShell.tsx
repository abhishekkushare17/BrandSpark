"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { LandingPage } from "../landing/LandingPage";
import { NameGeneratorView } from "../generator/NameGeneratorView";
import { SloganGeneratorView } from "../slogan/SloganGeneratorView";
import { BrandIdentityStudioView } from "../studio/BrandIdentityStudioView";
import { LogoStudioView } from "../logo/LogoStudioView";
import { DomainCheckerView } from "../domains/DomainCheckerView";
import { BrandComparisonView } from "../compare/BrandComparisonView";
import { ProjectsView } from "../projects/ProjectsView";
import { SparkAssistantDrawer } from "../assistant/SparkAssistantDrawer";
import { ApiKeyModal } from "../settings/ApiKeyModal";
import { AuthModals } from "../auth/AuthModals";
import { ExportKitModal } from "../export/ExportKitModal";
import { useProject } from "@/context/ProjectContext";

export function DashboardShell() {
  const { activeTab, setActiveTab, currentProject, setCurrentProject } = useProject();

  // Modals state
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Check if landing page should be shown (e.g. if explicitly selected or on first landing)
  const [showLanding, setShowLanding] = useState(false);

  const handleStartFromLanding = (initialIdea: string, initialIndustry: string) => {
    if (currentProject) {
      setCurrentProject({
        ...currentProject,
        businessIdea: initialIdea,
        industry: initialIndustry,
      });
    }
    setShowLanding(false);
    setActiveTab("generator");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <Navbar
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenAuthModal={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        showLanding={showLanding}
        setShowLanding={setShowLanding}
      />

      {/* Main Workspace Body */}
      {showLanding ? (
        <main className="flex-1">
          <LandingPage onStartGenerator={handleStartFromLanding} />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Left Sidebar */}
          <Sidebar
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />

          {/* Main Active Tab Content View */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-5xl">
            {activeTab === "generator" && <NameGeneratorView />}
            {activeTab === "slogans" && <SloganGeneratorView />}
            {activeTab === "studio" && <BrandIdentityStudioView />}
            {activeTab === "logos" && <LogoStudioView />}
            {activeTab === "domains" && <DomainCheckerView />}
            {activeTab === "compare" && <BrandComparisonView />}
            {activeTab === "projects" && <ProjectsView />}
          </main>
        </div>
      )}

      {/* Modals and Drawers */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <AuthModals
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <SparkAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      <ExportKitModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
