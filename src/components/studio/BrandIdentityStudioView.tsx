"use client";

import React, { useState } from "react";
import {
  Palette,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Download,
  Shield,
  Zap,
  Heart,
  Globe,
  Sliders,
  CheckCircle2,
  XCircle,
  FileText,
  CreditCard,
  Layout,
  ExternalLink,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { generateBrandKitPdf } from "@/lib/export-pdf";

export function BrandIdentityStudioView() {
  const { currentProject, setCurrentProject, setActiveTab } = useProject();
  const { apiKey } = useAuth();
  const { success, error, info } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<"website" | "card" | "social">("website");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const brandName = currentProject?.selectedWinnerName || currentProject?.name || "BrandSpark";
  const identity = currentProject?.brandIdentity;

  const handleGenerateIdentity = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate/identity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-key": apiKey } : {}),
        },
        body: JSON.stringify({
          brandName,
          businessIdea: currentProject?.businessIdea,
          industry: currentProject?.industry,
          audience: currentProject?.targetAudience,
          tone: currentProject?.personality,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        error("Synthesis Error", data.error || "Failed to generate brand identity.");
        return;
      }

      if (currentProject) {
        setCurrentProject({
          ...currentProject,
          brandIdentity: data.brandIdentity,
        });
      }

      success("Brand Identity Synthesized! 🎨", "Complete brand guidelines and tokens created.");
    } catch {
      error("Network Error", "Could not connect to brand identity generator.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    success("HEX Copied", `${hex} copied to clipboard!`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleExportPdf = () => {
    if (!identity) {
      error("No Brand Data", "Generate your brand identity before exporting guidelines.");
      return;
    }
    info("Preparing PDF...", "Rendering high-resolution vector PDF brand book.");
    generateBrandKitPdf({
      brandName,
      industry: currentProject?.industry || "Technology",
      brandIdentity: identity,
      selectedSlogan: identity.marketingTagline,
      slogans: currentProject?.slogans,
    });
    success("PDF Exported", "Brand guidelines book downloaded.");
  };

  const primaryColor = identity?.colorPalette?.[0]?.hex || "#6366F1";
  const secondaryColor = identity?.colorPalette?.[1]?.hex || "#8B5CF6";
  const accentColor = identity?.colorPalette?.[2]?.hex || "#06B6D4";

  return (
    <div className="space-y-8">
      {/* Studio Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-3">
            <Palette className="w-3.5 h-3.5" />
            <span>Brand Identity Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Brand Identity for <span className="text-brand-600">&ldquo;{brandName}&rdquo;</span>
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {identity?.marketingTagline ||
              "Synthesize full brand narrative, color harmonies, typography tokens, and responsive mockups."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleGenerateIdentity}
            disabled={isGenerating}
            className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-600 to-violet-600 hover:opacity-95 shadow-md shadow-brand-500/25 flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Studio...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{identity ? "Regenerate Identity" : "Generate Brand Identity"}</span>
              </>
            )}
          </button>

          {identity && (
            <button
              onClick={handleExportPdf}
              className="px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF Guidelines</span>
            </button>
          )}
        </div>
      </div>

      {identity ? (
        <div className="space-y-8">
          {/* LIVE BRAND PREVIEW MOCKUPS SHOWCASE */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layout className="w-5 h-5 text-brand-600" />
                  <span>Live Brand Preview</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Interactive real-time preview of your brand applied across real-world collateral.
                </p>
              </div>

              {/* Preview Format Switcher */}
              <div className="flex p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setActivePreviewTab("website")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activePreviewTab === "website"
                      ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website Hero</span>
                </button>
                <button
                  onClick={() => setActivePreviewTab("card")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activePreviewTab === "card"
                      ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Business Card</span>
                </button>
                <button
                  onClick={() => setActivePreviewTab("social")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activePreviewTab === "social"
                      ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Social Banner</span>
                </button>
              </div>
            </div>

            {/* WEBSITE HERO MOCKUP */}
            {activePreviewTab === "website" && (
              <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 overflow-hidden shadow-lg animate-in fade-in">
                {/* Browser bar */}
                <div className="px-4 py-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 max-w-sm mx-auto px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-center font-mono text-slate-500">
                    https://www.{brandName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com
                  </div>
                </div>

                {/* Hero section */}
                <div className="p-8 sm:p-14 text-center max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border" style={{ color: primaryColor, borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}10` }}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Next-Generation Solutions</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                    {identity.marketingTagline}
                  </h1>

                  <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {identity.mission}
                  </p>

                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <button
                      className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition-transform hover:scale-105"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Get Started with {brandName}
                    </button>
                    <button className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* BUSINESS CARD MOCKUP */}
            {activePreviewTab === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in max-w-4xl mx-auto">
                {/* Front of Card */}
                <div
                  className="aspect-[1.75/1] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl text-white relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor} 0%, #0F172A 100%)`,
                  }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-xl">
                    {brandName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black tracking-tight">{brandName}</h4>
                    <p className="text-xs text-white/80 font-medium tracking-wider uppercase mt-1">
                      {identity.marketingTagline}
                    </p>
                  </div>
                </div>

                {/* Back of Card */}
                <div className="aspect-[1.75/1] rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xl text-slate-900 dark:text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-base font-bold">Alex Rivera</p>
                      <p className="text-xs text-slate-500 font-medium">Founder & CEO</p>
                    </div>
                    <span className="font-bold text-xs text-brand-600">{brandName}</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
                    <p>hello@{brandName.toLowerCase()}.com</p>
                    <p>+1 (555) 019-2834</p>
                    <p>www.{brandName.toLowerCase()}.com</p>
                  </div>
                </div>
              </div>
            )}

            {/* SOCIAL BANNER MOCKUP */}
            {activePreviewTab === "social" && (
              <div
                className="w-full aspect-[3/1] rounded-2xl p-8 sm:p-12 flex flex-col justify-center items-center text-center shadow-xl text-white relative overflow-hidden animate-in fade-in"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, #0F172A 100%)`,
                }}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl mb-3 shadow-lg">
                  {brandName.charAt(0)}
                </div>
                <h3 className="text-2xl sm:text-4xl font-black tracking-tight">{brandName}</h3>
                <p className="mt-2 text-xs sm:text-sm text-white/90 max-w-xl font-medium">
                  {identity.marketingTagline}
                </p>
              </div>
            )}
          </div>

          {/* COLOR PALETTE SYSTEM */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Brand Color Palette</h3>
                <p className="text-xs text-slate-500">Click any HEX code to copy to clipboard.</p>
              </div>
              <span className="text-xs font-semibold text-brand-600 font-mono">5 Color Harmony</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {identity.colorPalette.map((color) => (
                <div
                  key={color.hex}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="h-24 w-full relative flex items-end p-2"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 text-white backdrop-blur-sm">
                      {color.role}
                    </span>
                  </div>
                  <div className="p-3.5 space-y-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{color.name}</p>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleCopyHex(color.hex)}
                        className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                      >
                        <span>{color.hex.toUpperCase()}</span>
                        {copiedHex === color.hex ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono">{color.rgb}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1 leading-snug">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TYPOGRAPHY & BRAND VOICE GUIDELINES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Typography */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Typography Direction</h3>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Headline Font</span>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                      {identity.typography.headerFont}
                    </h4>
                  </div>
                  {identity.typography.headerFontUrl && (
                    <a
                      href={identity.typography.headerFontUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-brand-600 hover:underline flex items-center gap-1"
                    >
                      <span>Google Fonts</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Body Font</span>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                      {identity.typography.bodyFont}
                    </h4>
                  </div>
                  {identity.typography.bodyFontUrl && (
                    <a
                      href={identity.typography.bodyFontUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-brand-600 hover:underline flex items-center gap-1"
                    >
                      <span>Google Fonts</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 pt-2 leading-relaxed">
                  {identity.typography.fontPairingExplanation}
                </p>
              </div>
            </div>

            {/* Brand Voice Spectrum */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Brand Voice Spectrum</h3>
              <div className="space-y-4">
                {identity.brandVoice.toneSpectrum.map((spectrum) => (
                  <div key={spectrum.label}>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>{spectrum.left}</span>
                      <span className="text-brand-600">{spectrum.right}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-violet-600 rounded-full"
                        style={{ width: `${spectrum.value * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Do's and Don'ts */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Do&apos;s
                  </span>
                  <ul className="space-y-1 text-[11px] text-emerald-900 dark:text-emerald-200 list-disc list-inside">
                    {identity.brandVoice.dos.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-xs">
                  <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1 mb-1.5">
                    <XCircle className="w-3.5 h-3.5" />
                    Don&apos;ts
                  </span>
                  <ul className="space-y-1 text-[11px] text-rose-900 dark:text-rose-200 list-disc list-inside">
                    {identity.brandVoice.donts.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* BRAND STORY & VALUES */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Brand Narrative & Story</h3>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed whitespace-pre-line">
                {identity.story}
              </div>
            </div>

            {/* Core Values */}
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3">Core Brand Values</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {identity.values.map((v) => (
                  <div
                    key={v.title}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center mb-2.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">{v.title}</h5>
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SOCIAL MEDIA BIOS */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Social Media Bios</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {identity.socialBios.map((sb) => (
                <div
                  key={sb.platform}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-brand-600">{sb.platform}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{sb.charCount} chars</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                      {sb.bio}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-end">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(sb.bio);
                        success("Copied", `${sb.platform} bio copied!`);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Bio</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-slate-50/60 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center mx-auto mb-4">
            <Palette className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Brand Identity Not Yet Synthesized
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Click &quot;Generate Brand Identity&quot; above to synthesize the origin story, mission &
            vision, HEX color codes, typography pairings, and responsive collateral for &quot;
            {brandName}&quot;.
          </p>
        </div>
      )}
    </div>
  );
}
