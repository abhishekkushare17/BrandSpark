"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Palette,
  Wand2,
  Globe,
  SlidersHorizontal,
  Download,
  Star,
  Zap,
  Flame,
  Layers,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";

interface LandingPageProps {
  onStartGenerator: (initialIdea: string, initialIndustry: string) => void;
}

export function LandingPage({ onStartGenerator }: LandingPageProps) {
  const { setActiveTab } = useProject();
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("Tech & AI");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) {
      onStartGenerator("An AI-powered productivity workspace for high-performing teams", industry);
    } else {
      onStartGenerator(idea, industry);
    }
  };

  const industries = [
    "Tech & AI",
    "E-commerce & Retail",
    "Health & Wellness",
    "Finance & Fintech",
    "Fashion & Lifestyle",
    "Food & Beverage",
    "Creative & Media",
  ];

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Background glowing gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-brand-500/15 via-violet-500/15 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin" />
          <span>Next-Generation AI Branding Studio</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          <span className="text-slate-500 font-normal">v2.5 Live</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Your Next Big Brand{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-600">
            Starts Here.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Transform a raw concept into a category-defining identity. Generate trademarkable
          business names, magnetic slogans, vector logos, verified domains, and complete brand
          guideline books in seconds.
        </p>

        {/* Interactive Quick Generator Bar */}
        <div className="mt-10 max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="p-2 sm:p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl shadow-brand-500/10 backdrop-blur-md flex flex-col sm:flex-row gap-2.5 items-center"
          >
            <div className="flex-1 w-full text-left px-3 py-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                Describe Your Business Idea
              </label>
              <input
                type="text"
                placeholder="e.g. Ultra-fast AI analytics tool for modern ecommerce stores..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="w-full sm:w-48 text-left px-3 py-1 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                {industries.map((ind) => (
                  <option key={ind} value={ind} className="bg-white dark:bg-slate-900">
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 hover:opacity-95 shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Spark Brand</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Suggestions Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
            <span>Trending niches:</span>
            {[
              "Autonomous AI Agent",
              "Cold Brew Coffee Club",
              "SaaS Micro-Acquisitions",
              "Eco-Luxury Fashion",
            ].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => setIdea(sample)}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Live Mockup Showcase Card */}
        <div className="mt-16 relative max-w-5xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-slate-400 ml-2">brandspark.ai / studio-live-preview</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-brand-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Identity Engine
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Column 1: Generated Names Preview */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">6 Naming Dimensions</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">96/100 Score</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">VeloCore</span>
                    <span className="text-[10px] text-brand-600 font-semibold">Premium</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">High prestige index with acoustic resonance.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">Syntra</span>
                    <span className="text-[10px] text-indigo-500 font-semibold">Modern</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Modular agility engineered for digital scale.</p>
                </div>
              </div>
            </div>

            {/* Column 2: Live Brand Guidelines Preview */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Visual Palette & Tokens</span>
              <div className="flex h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex-1 bg-[#6366F1] flex items-center justify-center text-[10px] text-white font-mono font-bold">#6366F1</div>
                <div className="flex-1 bg-[#8B5CF6] flex items-center justify-center text-[10px] text-white font-mono font-bold">#8B5CF6</div>
                <div className="flex-1 bg-[#06B6D4] flex items-center justify-center text-[10px] text-white font-mono font-bold">#06B6D4</div>
                <div className="flex-1 bg-[#0F172A] flex items-center justify-center text-[10px] text-white font-mono font-bold">#0F172A</div>
              </div>
              <div className="text-xs space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Typography Harmony:</p>
                <p className="text-[11px] text-slate-500">Outfit Bold (Headlines) + Inter Regular (Body)</p>
              </div>
            </div>

            {/* Column 3: Live Verification */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Live DNS & Social Verification</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300">
                  <span className="font-mono font-semibold">velocore.ai</span>
                  <span className="text-[10px] font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Verified Available
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-mono font-medium">@velocorehq (GitHub)</span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">Everything You Need</h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              An End-to-End Platform for Modern Brand Architecture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center mb-5">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI Business Name Generator</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generates 20+ names categorized into Premium, Short & Catchy, Modern, Creative,
                Professional, and Invented. Includes phonetic scores, lexical etymology, and audience rationale.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Multi-Tone Slogan Generator</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Explore slogans across 6 distinct emotional registers: Professional, Clever/Funny,
                Emotional, Luxury, Ultra-Minimalist, and Inspirational.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-5">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Live Brand Identity Studio</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Preview your brand across realistic responsive mockups: website hero headers, business
                cards, social banners, and complete visual guidelines.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-5">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Live Domain & Social Verification</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Never guess availability. We run real-time DNS over HTTPS and registry lookups across .com,
                .io, .ai, .co, and public handles for GitHub, YouTube, and more.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-5">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Side-by-Side Brand Comparison</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Shortlist up to 5 names and evaluate them side-by-side on memorability, pronunciation,
                market fit, and domain availability to crown a definitive winner.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-5">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Export Professional Brand Kit</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Download a complete multi-page PDF Brand Guidelines Book, vector SVG marks, PNG assets,
                and structured JSON kits ready for design and development teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-700 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Build your unforgettable brand today.
          </h2>
          <p className="text-brand-100 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Join thousands of modern founders and designers crafting memorable brands with BrandSpark.
          </p>
          <button
            onClick={() => setActiveTab("generator")}
            className="px-8 py-4 rounded-2xl font-bold text-sm bg-white text-slate-900 hover:bg-slate-100 shadow-xl transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Launch Brand Generator</span>
            <ArrowRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </section>
    </div>
  );
}
