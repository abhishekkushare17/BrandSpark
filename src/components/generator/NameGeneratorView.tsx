"use client";

import React, { useState, useRef } from "react";
import {
  Wand2,
  Sparkles,
  Copy,
  Check,
  Heart,
  SlidersHorizontal,
  Edit2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Info,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Flame,
  Star,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { GeneratedName, NameCategory } from "@/types";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const CATEGORY_TABS: { id: "all" | NameCategory | "favorites"; label: string }[] = [
  { id: "all", label: "All Names" },
  { id: "premium", label: "Premium" },
  { id: "short_catchy", label: "Short & Catchy" },
  { id: "modern", label: "Modern" },
  { id: "creative", label: "Creative" },
  { id: "professional", label: "Professional" },
  { id: "invented", label: "Invented" },
  { id: "favorites", label: "Favorites" },
];

export function NameGeneratorView() {
  const { currentProject, setCurrentProject, toggleFavoriteName, addToComparison, selectWinnerName, setActiveTab } =
    useProject();
  const { apiKey } = useAuth();
  const { success, error, info } = useToast();

  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Form State
  const [businessIdea, setBusinessIdea] = useState(
    currentProject?.businessIdea || "An all-in-one AI platform that builds instant corporate identities, naming, and visual design assets."
  );
  const [industry, setIndustry] = useState(currentProject?.industry || "Tech & AI");
  const [targetAudience, setTargetAudience] = useState(currentProject?.targetAudience || "Founders, Creators, & SaaS Agencies");
  const [language, setLanguage] = useState(currentProject?.language || "English");
  const [personality, setPersonality] = useState(currentProject?.personality || "Futuristic & Trustworthy");
  const [keywordsInclude, setKeywordsInclude] = useState(currentProject?.keywordsInclude || "");
  const [keywordsExclude, setKeywordsExclude] = useState(currentProject?.keywordsExclude || "");
  const [nameLength, setNameLength] = useState<"short" | "medium" | "any">(currentProject?.nameLength || "any");

  const [localNames, setLocalNames] = useState<GeneratedName[]>(currentProject?.names || []);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | NameCategory | "favorites">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Editing Name State
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editedNameText, setEditedNameText] = useState("");

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!businessIdea.trim()) {
      error("Missing Input", "Please provide a brief business idea or description.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate/names", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-key": apiKey } : {}),
        },
        body: JSON.stringify({
          businessIdea,
          industry,
          targetAudience,
          language,
          personality,
          keywordsInclude,
          keywordsExclude,
          nameLength,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        error("Generation Failed", data.error || "Could not generate names.");
        return;
      }

      setLocalNames(data.names);

      if (currentProject) {
        setCurrentProject({
          ...currentProject,
          businessIdea,
          industry,
          targetAudience,
          language,
          personality,
          keywordsInclude,
          keywordsExclude,
          nameLength,
          names: data.names,
        });
      }

      success("Names Generated! 🎉", `Generated ${data.names.length} brand names across 6 categories.`);

      // Smooth scroll down to results section
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch {
      error("Network Error", "Failed to connect to generation service.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (id: string, name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedId(id);
    success("Copied to Clipboard", `"${name}" copied!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveEdit = (nameId: string) => {
    if (!editedNameText.trim()) return;
    const updated = localNames.map((n) =>
      n.id === nameId ? { ...n, name: editedNameText.trim() } : n
    );
    setLocalNames(updated);
    if (currentProject) {
      setCurrentProject({ ...currentProject, names: updated });
    }
    setEditingNameId(null);
    success("Name Updated", "Brand name modified.");
  };

  const namesList = localNames.length > 0 ? localNames : currentProject?.names || [];

  // Filter names based on category & search
  const filteredNames = namesList.filter((n) => {
    const matchesCategory =
      selectedCategory === "all"
        ? true
        : selectedCategory === "favorites"
        ? currentProject?.favoriteNameIds.includes(n.id)
        : n.category === selectedCategory;

    const matchesSearch =
      searchQuery === ""
        ? true
        : n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.style.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-3">
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Business Name Generator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Generate Category-Defining Names
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Specify your vision, market, and desired acoustics. BrandSpark will generate up to 24
            curated names grouped into 6 strategic dimensions with phonetic memorability scoring.
          </p>
        </div>

        {/* Input Generator Form */}
        <form onSubmit={handleGenerate} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Business Idea & Description *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe what your business does, your flagship product, and the problem it solves..."
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Industry / Product Type *
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none cursor-pointer"
              >
                <option value="Tech & AI">Tech & AI</option>
                <option value="E-commerce & Retail">E-commerce & Retail</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Finance & Fintech">Finance & Fintech</option>
                <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Creative & Media">Creative & Media</option>
                <option value="Education & EdTech">Education & EdTech</option>
                <option value="Real Estate & PropTech">Real Estate & PropTech</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Target Audience
              </label>
              <input
                type="text"
                placeholder="e.g. B2B Enterprise, Gen-Z Creators, Busy Parents"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder-slate-400"
              />
            </div>
          </div>

          {/* Collapsible Advanced Parameters */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              <span>{isAdvancedOpen ? "Hide Advanced Filters" : "Show Advanced Filters (Keywords, Tone, Length, Language)"}</span>
              {isAdvancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isAdvancedOpen && (
              <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Brand Personality & Tone
                  </label>
                  <input
                    type="text"
                    placeholder="Futuristic, Sophisticated, Playful"
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Preferred Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Japanese (Katakana/Romaji)">Japanese (Romaji)</option>
                    <option value="Latin roots">Latin Roots</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Keywords to Include
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. spark, flux, link"
                    value={keywordsInclude}
                    onChange={(e) => setKeywordsInclude(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Preferred Name Length
                  </label>
                  <select
                    value={nameLength}
                    onChange={(e) => setNameLength(e.target.value as "short" | "medium" | "any")}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                  >
                    <option value="any">Any Length</option>
                    <option value="short">Short & Punchy (4-6 chars)</option>
                    <option value="medium">Medium Balanced (7-10 chars)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Generates 20–24 names across all 6 categories with AI score reasoning</span>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 hover:opacity-95 shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Brand Names...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Names</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Generation Banner Feedback */}
        {isGenerating && (
          <div className="mt-4 p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-center animate-pulse flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-brand-600" />
            <span className="text-xs font-bold text-brand-900 dark:text-brand-200">
              Analyzing phonetics, morphology, and industry resonance for &ldquo;{industry}&rdquo;...
            </span>
          </div>
        )}

        {namesList.length > 0 && !isGenerating && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{namesList.length} Brand Names Ready Below!</span>
            </div>
            <button
              type="button"
              onClick={() => resultsRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1"
            >
              <span>Scroll to Results</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Results Header & Category Filter Tabs */}
      {namesList.length > 0 && (
        <div ref={resultsRef} id="generated-results" className="space-y-4 pt-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              {CATEGORY_TABS.map((tab) => {
                const isActive = selectedCategory === tab.id;
                const count =
                  tab.id === "all"
                    ? namesList.length
                    : tab.id === "favorites"
                    ? currentProject?.favoriteNameIds.length || 0
                    : namesList.filter((n) => n.category === tab.id).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm"
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

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNames.map((nameItem) => {
              const isFav = currentProject?.favoriteNameIds.includes(nameItem.id);
              const isWinner = currentProject?.selectedWinnerName === nameItem.name;
              const isCompared = currentProject?.comparedNameIds.includes(nameItem.id);

              return (
                <div
                  key={nameItem.id}
                  className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 flex flex-col justify-between group hover:shadow-lg hover:-translate-y-0.5 ${
                    isWinner
                      ? "border-brand-500 ring-2 ring-brand-500/20 shadow-brand-500/10"
                      : "border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700"
                  }`}
                >
                  <div>
                    {/* Top Badges & Actions */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/50">
                        {nameItem.categoryLabel}
                      </span>

                      <div className="flex items-center gap-1">
                        {/* Favorite button */}
                        <button
                          onClick={() => toggleFavoriteName(nameItem.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isFav
                              ? "text-rose-500 bg-rose-50 dark:bg-rose-950/50"
                              : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title={isFav ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500" : ""}`} />
                        </button>

                        {/* Copy button */}
                        <button
                          onClick={() => handleCopy(nameItem.id, nameItem.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Copy name"
                        >
                          {copiedId === nameItem.id ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* Inline Edit button */}
                        <button
                          onClick={() => {
                            setEditingNameId(nameItem.id);
                            setEditedNameText(nameItem.name);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit name"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Name Display or Inline Edit Form */}
                    {editingNameId === nameItem.id ? (
                      <div className="flex items-center gap-1.5 my-1">
                        <input
                          type="text"
                          value={editedNameText}
                          onChange={(e) => setEditedNameText(e.target.value)}
                          className="px-2.5 py-1 text-lg font-black rounded-lg border border-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none w-full"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(nameItem.id)}
                          className="px-2 py-1 rounded-lg bg-brand-600 text-white text-xs font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-brand-600 transition-colors">
                          {nameItem.name}
                        </h3>
                        {/* Overall Score Pill */}
                        <div
                          className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono"
                          title="Comprehensive AI Score"
                        >
                          <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                          <span>{nameItem.score.overall}/100</span>
                        </div>
                      </div>
                    )}

                    {/* Meaning & Reasoning */}
                    <div className="mt-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <p className="leading-relaxed">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Meaning: </span>
                        {nameItem.meaning}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">Audience Fit: </span>
                        {nameItem.reasoning}
                      </p>
                    </div>

                    {/* Score Breakdown Bars */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-[10px]">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>Recall</span>
                          <span className="font-mono font-semibold">{nameItem.score.memorability}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full"
                            style={{ width: `${nameItem.score.memorability}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>Phonetics</span>
                          <span className="font-mono font-semibold">{nameItem.score.pronunciation}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${nameItem.score.pronunciation}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>Relevance</span>
                          <span className="font-mono font-semibold">{nameItem.score.relevance}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full"
                            style={{ width: `${nameItem.score.relevance}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* AI Score Explanation Callout */}
                    <p className="mt-2 text-[10px] text-slate-400 leading-tight italic">
                      &ldquo;{nameItem.score.explanation}&rdquo;
                    </p>
                  </div>

                  {/* Bottom Action CTAs */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5 text-xs">
                    <button
                      onClick={() => addToComparison(nameItem.id)}
                      className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                        isCompared
                          ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 border border-amber-200/50"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title="Compare up to 5 names"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>{isCompared ? "Compared" : "Compare"}</span>
                    </button>

                    <button
                      onClick={() => {
                        selectWinnerName(nameItem.name);
                        setActiveTab("studio");
                      }}
                      className="px-3 py-1.5 rounded-lg font-semibold bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/80 text-brand-700 dark:text-brand-300 transition-colors flex items-center gap-1"
                    >
                      <span>Build Brand</span>
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
      {namesList.length === 0 && !isGenerating && (
        <div className="p-12 text-center rounded-3xl bg-slate-50/60 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Names Generated Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Fill out your business description above and click &quot;Generate Names&quot; to spark 20–24
            innovative, trademark-friendly brand name candidates.
          </p>
        </div>
      )}
    </div>
  );
}
