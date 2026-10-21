"use client";

import React, { useState } from "react";
import {
  Download,
  X,
  FileText,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { useToast } from "@/context/ToastContext";
import { downloadJsonKit, downloadSvgFile, generateBrandKitPdf } from "@/lib/export-pdf";
import { generateSvgLogo } from "@/lib/svg-logo";

interface ExportKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportKitModal({ isOpen, onClose }: ExportKitModalProps) {
  const { currentProject } = useProject();
  const { success, info } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const brandName = currentProject?.selectedWinnerName || currentProject?.name || "BrandSpark";
  const identity = currentProject?.brandIdentity;

  const handleDownloadPdf = () => {
    setIsExporting(true);
    info("Generating PDF", "Compiling high-resolution vector brand book...");
    try {
      generateBrandKitPdf({
        brandName,
        industry: currentProject?.industry || "Technology",
        brandIdentity: identity,
        selectedSlogan: identity?.marketingTagline,
        slogans: currentProject?.slogans,
      });
      success("PDF Downloaded! 📄", `${brandName}-brand-kit.pdf is ready.`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSvg = () => {
    const primary = identity?.colorPalette?.[0]?.hex || "#6366F1";
    const secondary = identity?.colorPalette?.[1]?.hex || "#8B5CF6";
    const accent = identity?.colorPalette?.[2]?.hex || "#06B6D4";

    const svg = generateSvgLogo({
      brandName,
      slogan: identity?.marketingTagline,
      style: "minimalist",
      colorScheme: {
        primary,
        secondary,
        accent,
        background: "#ffffff",
        textColor: "#0F172A",
      },
      iconShape: "spark",
      showSlogan: true,
    });

    downloadSvgFile(svg, `${brandName.toLowerCase()}-brandmark.svg`);
    success("SVG Downloaded! 🎨", "Scalable vector logo saved.");
  };

  const handleDownloadJson = () => {
    const kitData = {
      brandName,
      industry: currentProject?.industry,
      targetAudience: currentProject?.targetAudience,
      brandIdentity: identity,
      slogans: currentProject?.slogans,
      namesShortlist: currentProject?.names,
      exportedAt: new Date().toISOString(),
      generator: "BrandSpark AI v2.5",
    };

    downloadJsonKit(kitData, `${brandName.toLowerCase()}-brand-spec.json`);
    success("JSON Exported! 💻", "Developer token specification downloaded.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Export Complete Branding Kit</h3>
              <p className="text-xs text-slate-500">Asset bundle for &ldquo;{brandName}&rdquo;</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checklist of Included Assets */}
        <div className="py-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Included Assets</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Multi-Page Brand Guidelines PDF</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Scalable SVG Vector Logo Mark</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>5-Token HEX & RGB Color System</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Typography Pairing Specification</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Official Mission, Vision & Values</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Developer JSON Design Tokens</span>
            </div>
          </div>

          {/* Export Action Cards */}
          <div className="space-y-3 pt-3">
            {/* PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="w-full p-4 rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50/60 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-brand-900 dark:text-brand-200">
                    Official Brand Guidelines Book (.PDF)
                  </h5>
                  <p className="text-[11px] text-brand-700/80 dark:text-brand-300/80">
                    Ready-to-print corporate brand book with typography, color swatches, and narrative.
                  </p>
                </div>
              </div>
              <Download className="w-4 h-4 text-brand-600 group-hover:translate-y-0.5 transition-transform shrink-0" />
            </button>

            {/* SVG Button */}
            <button
              onClick={handleDownloadSvg}
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                    Vector Brandmark Asset (.SVG)
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Pure vector graphic suitable for apps, websites, and apparel.
                  </p>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-transform shrink-0" />
            </button>

            {/* JSON Button */}
            <button
              onClick={handleDownloadJson}
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center shrink-0">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                    Design Tokens Specification (.JSON)
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Structured data for Tailwind configs, React themes, and CSS variables.
                  </p>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-transform shrink-0" />
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
