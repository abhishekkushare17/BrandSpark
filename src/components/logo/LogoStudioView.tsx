"use client";

import React, { useState, useRef } from "react";
import {
  Palette,
  Sparkles,
  Download,
  Check,
  RefreshCw,
  Layers,
  Shapes,
  Maximize2,
  Sliders,
  Type,
  FileCode,
} from "lucide-react";
import { LogoConfig, LogoStyleType } from "@/types";
import { useProject } from "@/context/ProjectContext";
import { useToast } from "@/context/ToastContext";
import { generateSvgLogo } from "@/lib/svg-logo";
import { downloadSvgFile } from "@/lib/export-pdf";

const LOGO_STYLES: { id: LogoStyleType; label: string; desc: string }[] = [
  { id: "minimalist", label: "Minimalist Clean", desc: "Horizontal balanced icon & modern sans wordmark" },
  { id: "geometric", label: "Geometric Gradient", desc: "Vibrant gradient-filled forward-leaning mark" },
  { id: "emblem", label: "Circular Emblem", desc: "Prestigious framed badge with concentric rings" },
  { id: "monogram", label: "Bold Monogram", desc: "Prominent lettermark glyph inside an app tile" },
  { id: "typographic", label: "Typographic Modern", desc: "Integrated typographic brandmark with dot accent" },
];

const ICON_SHAPES: { id: LogoConfig["iconShape"]; label: string }[] = [
  { id: "spark", label: "Sparkle / Star" },
  { id: "cube", label: "Isometric Cube" },
  { id: "hexagon", label: "Hexagon Shield" },
  { id: "shield", label: "Security Shield" },
  { id: "flame", label: "Momentum Flame" },
  { id: "circle_orbit", label: "Orbital Rings" },
  { id: "letter", label: "Letter Initial" },
  { id: "crown", label: "Prestige Crown" },
];

export function LogoStudioView() {
  const { currentProject, addLogoToProject } = useProject();
  const { success, error, info } = useToast();

  const brandName = currentProject?.selectedWinnerName || currentProject?.name || "BrandSpark";
  const slogan = currentProject?.brandIdentity?.marketingTagline || currentProject?.slogans?.[0]?.text || "Innovation in Motion";

  // Palette default
  const defaultPrimary = currentProject?.brandIdentity?.colorPalette?.[0]?.hex || "#6366F1";
  const defaultSecondary = currentProject?.brandIdentity?.colorPalette?.[1]?.hex || "#8B5CF6";
  const defaultAccent = currentProject?.brandIdentity?.colorPalette?.[2]?.hex || "#06B6D4";

  const [style, setStyle] = useState<LogoStyleType>("minimalist");
  const [iconShape, setIconShape] = useState<LogoConfig["iconShape"]>("spark");
  const [primaryColor, setPrimaryColor] = useState(defaultPrimary);
  const [secondaryColor, setSecondaryColor] = useState(defaultSecondary);
  const [accentColor, setAccentColor] = useState(defaultAccent);
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [textColor, setTextColor] = useState("#0F172A");
  const [showSlogan, setShowSlogan] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate real SVG code
  const svgCode = generateSvgLogo({
    brandName,
    slogan,
    style,
    colorScheme: {
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor,
      background: bgColor,
      textColor,
    },
    iconShape,
    showSlogan,
  });

  const handleDownloadSvg = () => {
    downloadSvgFile(svgCode, `${brandName.toLowerCase()}-logo.svg`);
    success("SVG Downloaded", "Vector SVG saved to your downloads.");
  };

  const handleDownloadPng = () => {
    // Render SVG into HTML5 Canvas and export as high-res PNG
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = style === "emblem" ? 1200 : 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgCode], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `${brandName.toLowerCase()}-logo.png`;
      a.click();
      success("PNG Downloaded", "High-resolution PNG saved.");
    };
    img.src = url;
  };

  const handleSaveToProject = () => {
    const config: LogoConfig = {
      id: `logo_${Date.now()}`,
      brandName,
      slogan,
      style,
      colorScheme: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor,
        background: bgColor,
        textColor,
      },
      iconShape,
      fontFamily: "Outfit, Inter",
      showSlogan,
      svgCode,
      createdAt: new Date().toISOString(),
    };
    addLogoToProject(config);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-3">
            <Shapes className="w-3.5 h-3.5" />
            <span>AI Vector Logo Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Design & Export Vector Brand Marks
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Customize geometry, layout styles, and color harmonies with real vector SVG export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadSvg}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download SVG</span>
          </button>
          <button
            onClick={handleDownloadPng}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={handleSaveToProject}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 transition-colors"
          >
            Save to Brand Kit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Sidebar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          {/* Logo Style Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Layout & Composition Style
            </label>
            <div className="space-y-2">
              {LOGO_STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    style === s.id
                      ? "border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 font-semibold shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <p className="font-bold">{s.label}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Geometry Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Icon Geometry & Symbol
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ICON_SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => setIconShape(shape.id)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    iconShape === shape.id
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {shape.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Scheme Controls */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Color Harmonies
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="block text-[10px] text-slate-500 mb-1">Primary</span>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5"
                />
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 mb-1">Secondary</span>
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5"
                />
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 mb-1">Accent</span>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5"
                />
              </div>
            </div>
          </div>

          {/* Slogan Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Display Tagline Slogan
            </span>
            <input
              type="checkbox"
              checked={showSlogan}
              onChange={(e) => setShowSlogan(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Live Vector Canvas & Concept Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Visual Display */}
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden shadow-sm">
            {/* Background Checkerboard pattern toggle */}
            <div className="w-full max-w-lg aspect-[2/1] rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-xl flex items-center justify-center transition-all">
              <div
                className="w-full h-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: svgCode }}
              />
            </div>

            <p className="mt-6 text-xs text-slate-400 font-mono">
              Rendered via Precision SVG Engine (Infinite Vector Scalability)
            </p>
          </div>

          {/* Concept Strategy & AI Symbology Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>AI Logo Concept Specification</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">Geometric Rationale</span>
                <p className="text-slate-500 leading-relaxed">
                  The {iconShape.replace("_", " ")} motif leverages dynamic symmetry with dual-stop
                  linear gradients ({primaryColor} to {secondaryColor}). Optimized for recognition at
                  16x16px favicon scale and billboards.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">Typography Pairing</span>
                <p className="text-slate-500 leading-relaxed">
                  Headings utilize 800-weight geometric letterforms with tight tracking (-1px) for
                  assertive executive presence, paired with wide letter-spaced secondary subtext.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
