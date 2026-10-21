"use client";

import React from "react";
import {
  Wand2,
  Sparkles,
  Palette,
  Shapes,
  Globe,
  SlidersHorizontal,
  FolderKanban,
  Download,
  Bot,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";

interface SidebarProps {
  onOpenExportModal: () => void;
  onOpenAssistant: () => void;
  onOpenNewProjectModal?: () => void;
}

export function Sidebar({ onOpenExportModal, onOpenAssistant, onOpenNewProjectModal }: SidebarProps) {
  const { activeTab, setActiveTab, currentProject } = useProject();

  const navigation = [
    { id: "generator", label: "Business Names", icon: Wand2, count: currentProject?.names?.length || 0 },
    { id: "slogans", label: "Slogans & Taglines", icon: Sparkles, count: currentProject?.slogans?.length || 0 },
    { id: "studio", label: "Brand Studio", icon: Palette, highlight: Boolean(currentProject?.brandIdentity) },
    { id: "logos", label: "Vector Logos", icon: Shapes, count: currentProject?.logos?.length || 0 },
    { id: "domains", label: "Domains & Social", icon: Globe },
    { id: "compare", label: "Name Comparison", icon: SlidersHorizontal, count: currentProject?.comparedNameIds?.length || 0 },
    { id: "projects", label: "Saved Projects", icon: FolderKanban },
  ] as const;

  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md flex flex-col justify-between shrink-0 p-4 h-[calc(100vh-4rem)] sticky top-16 hidden md:flex">
      <div className="space-y-6">
        {/* Active Project Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Project
            </span>
            <button
              onClick={() => setActiveTab("projects")}
              className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold hover:underline"
            >
              Switch
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-xs shrink-0">
              {currentProject?.name?.charAt(0) || "B"}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentProject?.name || "Untitled Venture"}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">
                {currentProject?.industry || "Technology"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {"count" in item && item.count > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        {/* Spark AI Launcher button */}
        <button
          onClick={onOpenAssistant}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-violet-600 to-brand-600 text-white shadow-md shadow-brand-500/20 hover:opacity-95 transition-all text-xs font-bold"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            <span>Spark AI Assistant</span>
          </div>
          <ChevronRight className="w-4 h-4 text-white/70" />
        </button>

        {/* Export Brand Kit */}
        <button
          onClick={onOpenExportModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export Brand Kit</span>
        </button>
      </div>
    </aside>
  );
}
