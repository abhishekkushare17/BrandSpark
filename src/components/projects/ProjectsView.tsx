"use client";

import React, { useState } from "react";
import {
  FolderKanban,
  Plus,
  Copy,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  ArrowRight,
  Trophy,
  Check,
  Save,
} from "lucide-react";
import { BrandingProject } from "@/types";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export function ProjectsView() {
  const {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    deleteProject,
    duplicateProject,
    saveCurrentProject,
    setActiveTab,
    isSaving,
  } = useProject();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newIdea, setNewIdea] = useState("");
  const [newIndustry, setNewIndustry] = useState("Tech & AI");
  const [newAudience, setNewAudience] = useState("Modern Professionals");

  // Editing Name Modal / Popover
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newIdea.trim()) {
      error("Missing Information", "Please enter a project title and business description.");
      return;
    }

    await createProject({
      name: newProjectName.trim(),
      businessIdea: newIdea.trim(),
      industry: newIndustry,
      targetAudience: newAudience,
    });

    setIsNewModalOpen(false);
    setNewProjectName("");
    setNewIdea("");
    setActiveTab("generator");
  };

  const handleSaveRename = (project: BrandingProject) => {
    if (!editingTitle.trim()) return;
    const updated = { ...project, name: editingTitle.trim() };
    setCurrentProject(updated);
    setEditingProjectId(null);
    success("Project Renamed", `Title updated to "${editingTitle.trim()}".`);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-3">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Workspace Project Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Saved Branding Projects
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage your brand ventures, review saved naming candidates, duplicate architectures, and continue editing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={saveCurrentProject}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Active Project"}</span>
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Branding Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const isActive = currentProject?.id === proj.id;
          const namesCount = proj.names?.length || 0;
          const slogansCount = proj.slogans?.length || 0;
          const winner = proj.selectedWinnerName || proj.name;

          return (
            <div
              key={proj.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between group ${
                isActive
                  ? "border-brand-500 ring-2 ring-brand-500/20 shadow-md shadow-brand-500/10"
                  : "border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/50">
                    {proj.industry}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Session
                    </span>
                  )}
                </div>

                {/* Project Title with inline rename */}
                {editingProjectId === proj.id ? (
                  <div className="flex items-center gap-1.5 my-1">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="px-2 py-1 text-base font-bold rounded-lg border border-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none w-full"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveRename(proj)}
                      className="p-1 rounded bg-brand-600 text-white"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between group/title">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      {proj.name}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingProjectId(proj.id);
                        setEditingTitle(proj.name);
                      }}
                      className="opacity-0 group-hover/title:opacity-100 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-opacity"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {proj.businessIdea}
                </p>

                {/* Winner Badge */}
                {proj.selectedWinnerName && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Winner: {proj.selectedWinnerName}</span>
                  </div>
                )}

                {/* Metrics */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Names Generated</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {namesCount} items
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Slogans Created</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {slogansCount} items
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateProject(proj.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Duplicate project"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProject(proj.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setCurrentProject(proj);
                    setActiveTab("generator");
                  }}
                  className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/80 text-brand-700 dark:text-brand-300 transition-colors flex items-center gap-1"
                >
                  <span>Continue Editing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW PROJECT MODAL */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Start New Branding Project
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Initialize a clean branding workspace with separate names, slogans, and visual tokens.
            </p>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NextGen SaaS, EcoCoffee Co"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Business Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your core product or service idea..."
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Industry
                  </label>
                  <select
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="Tech & AI">Tech & AI</option>
                    <option value="E-commerce & Retail">E-commerce & Retail</option>
                    <option value="Health & Wellness">Health & Wellness</option>
                    <option value="Finance & Fintech">Finance & Fintech</option>
                    <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Creative & Media">Creative & Media</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
