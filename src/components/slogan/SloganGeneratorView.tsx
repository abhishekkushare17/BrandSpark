"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Heart,
  Edit2,
  RefreshCw,
  MessageSquareQuote,
  ArrowRight,
  Filter,
} from "lucide-react";
import { GeneratedSlogan, SloganStyle } from "@/types";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const STYLE_TABS: { id: "all" | SloganStyle | "favorites"; label: string }[] = [
  { id: "all", label: "All Styles" },
  { id: "professional", label: "Professional" },
  { id: "funny", label: "Clever & Funny" },
  { id: "emotional", label: "Emotional" },
  { id: "luxury", label: "Luxury" },
  { id: "minimalist", label: "Minimalist" },
  { id: "inspirational", label: "Inspirational" },
  { id: "favorites", label: "Favorites" },
];

export function SloganGeneratorView() {
  const { currentProject, setCurrentProject, toggleFavoriteSlogan, setActiveTab } = useProject();
  const { apiKey } = useAuth();
  const { success, error } = useToast();

  const [brandName, setBrandName] = useState(
    currentProject?.selectedWinnerName || currentProject?.name || "BrandSpark"
  );
  const [businessIdea, setBusinessIdea] = useState(
    currentProject?.businessIdea || "AI-powered branding platform for modern creators"
  );
  const [industry, setIndustry] = useState(currentProject?.industry || "Tech & AI");

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<"all" | SloganStyle | "favorites">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inline editing
  const [editingSloganId, setEditingSloganId] = useState<string | null>(null);
  const [editedSloganText, setEditedSloganText] = useState("");

  const slogansList = currentProject?.slogans || [];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!brandName.trim()) {
      error("Missing Brand Name", "Please specify a brand name to craft slogans for.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate/slogans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-key": apiKey } : {}),
        },
        body: JSON.stringify({
          brandName,
          businessIdea,
          industry,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        error("Generation Failed", data.error || "Could not generate slogans.");
        return;
      }

      if (currentProject) {
        setCurrentProject({
          ...currentProject,
          selectedWinnerName: brandName,
          slogans: data.slogans,
        });
      }

      success("Slogans Generated! ✨", `Created ${data.slogans.length} slogans across 6 emotional styles.`);
    } catch {
      error("Network Error", "Could not reach slogan generation service.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success("Copied to Clipboard", `"${text}" copied!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveEdit = (sloganId: string) => {
    if (!currentProject || !editedSloganText.trim()) return;
    const updated = currentProject.slogans.map((s) =>
      s.id === sloganId ? { ...s, text: editedSloganText.trim() } : s
    );
    setCurrentProject({ ...currentProject, slogans: updated });
    setEditingSloganId(null);
    success("Slogan Updated", "Changes saved.");
  };

  const filteredSlogans = slogansList.filter((s) => {
    if (selectedStyle === "all") return true;
    if (selectedStyle === "favorites") return currentProject?.favoriteSloganIds.includes(s.id);
    return s.style === selectedStyle;
  });

  return (
    <div className="space-y-8">
      {/* Header Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>AI Slogan & Tagline Generator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Craft Resonant, Memorable Slogans
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Generate slogans tailored across 6 distinct emotional registers: Professional, Clever &
            Funny, Emotional, Quiet Luxury, Ultra-Minimalist, and Inspirational.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Target Brand Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. BrandSpark, VeloCore"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Industry Context
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Value Proposition
            </label>
            <input
              type="text"
              value={businessIdea}
              onChange={(e) => setBusinessIdea(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3 flex justify-end mt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-violet-600 to-brand-600 hover:opacity-95 shadow-md shadow-violet-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Copy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Slogans</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Slogans List */}
      {slogansList.length > 0 && (
        <div className="space-y-4">
          {/* Style Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
            {STYLE_TABS.map((tab) => {
              const isActive = selectedStyle === tab.id;
              const count =
                tab.id === "all"
                  ? slogansList.length
                  : tab.id === "favorites"
                  ? currentProject?.favoriteSloganIds.length || 0
                  : slogansList.filter((s) => s.style === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStyle(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/70 dark:bg-slate-700 font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSlogans.map((slogan) => {
              const isFav = currentProject?.favoriteSloganIds.includes(slogan.id);

              return (
                <div
                  key={slogan.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/50 dark:border-violet-800/50">
                        {slogan.styleLabel}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleFavoriteSlogan(slogan.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isFav
                              ? "text-rose-500 bg-rose-50 dark:bg-rose-950/50"
                              : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Favorite slogan"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500" : ""}`} />
                        </button>
                        <button
                          onClick={() => handleCopy(slogan.id, slogan.text)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Copy text"
                        >
                          {copiedId === slogan.id ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingSloganId(slogan.id);
                            setEditedSloganText(slogan.text);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit slogan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {editingSloganId === slogan.id ? (
                      <div className="flex items-center gap-1.5 my-1">
                        <input
                          type="text"
                          value={editedSloganText}
                          onChange={(e) => setEditedSloganText(e.target.value)}
                          className="px-2.5 py-1 text-sm font-bold rounded-lg border border-violet-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none w-full"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(slogan.id)}
                          className="px-2.5 py-1 rounded-lg bg-violet-600 text-white text-xs font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <p className="text-base font-bold text-slate-900 dark:text-white leading-snug tracking-tight">
                        &ldquo;{slogan.text}&rdquo;
                      </p>
                    )}

                    <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {slogan.explanation}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => {
                        if (currentProject) {
                          setCurrentProject({
                            ...currentProject,
                            brandIdentity: currentProject.brandIdentity
                              ? { ...currentProject.brandIdentity, marketingTagline: slogan.text }
                              : undefined,
                          });
                        }
                        setActiveTab("studio");
                        success("Applied Tagline", `"${slogan.text}" set as official marketing tagline.`);
                      }}
                      className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                    >
                      <span>Use in Brand Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {slogansList.length === 0 && !isGenerating && (
        <div className="p-12 text-center rounded-3xl bg-slate-50/60 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center mx-auto mb-4">
            <MessageSquareQuote className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Slogans Generated Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Specify your brand name above and click &quot;Generate Slogans&quot; to synthesize evocative
            hooks, taglines, and emotional messaging.
          </p>
        </div>
      )}
    </div>
  );
}
