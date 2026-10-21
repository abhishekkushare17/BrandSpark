"use client";

import React from "react";
import {
  SlidersHorizontal,
  Trophy,
  CheckCircle2,
  XCircle,
  Trash2,
  ArrowRight,
  Star,
  Sparkles,
  Palette,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { useToast } from "@/context/ToastContext";

export function BrandComparisonView() {
  const { currentProject, setCurrentProject, selectWinnerName, removeFromComparison, setActiveTab } =
    useProject();
  const { success, info } = useToast();

  const comparedIds = currentProject?.comparedNameIds || [];
  const allNames = currentProject?.names || [];
  const comparedNames = allNames.filter((n) => comparedIds.includes(n.id));

  // Quick auto-populate if user has names but none added to comparison
  const handleAutoPopulate = () => {
    if (allNames.length === 0) return;
    const top5 = allNames.slice(0, 5).map((n) => n.id);
    if (currentProject) {
      setCurrentProject({
        ...currentProject,
        comparedNameIds: top5,
      });
      success("Added Top Candidates", "Top 5 generated names added to comparison.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-3">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Side-by-Side Evaluation Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Brand Name Comparison
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Compare up to 5 shortlisted brand names across phonetics, memorability, trademark
            elasticity, and crown your official winner.
          </p>
        </div>

        {allNames.length > 0 && comparedNames.length < 5 && (
          <button
            onClick={handleAutoPopulate}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Compare Top 5</span>
          </button>
        )}
      </div>

      {comparedNames.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                <th className="p-4 sm:p-6 text-xs font-bold uppercase tracking-wider text-slate-400 w-44">
                  Dimension
                </th>
                {comparedNames.map((nameItem) => {
                  const isWinner = currentProject?.selectedWinnerName === nameItem.name;
                  return (
                    <th key={nameItem.id} className="p-4 sm:p-6 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/60">
                          {nameItem.categoryLabel}
                        </span>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                          {nameItem.name}
                        </h3>
                        {isWinner && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold shadow-sm">
                            <Trophy className="w-3 h-3 text-amber-500" />
                            Official Winner
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {/* Overall AI Score */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-4 sm:p-6 font-bold text-slate-700 dark:text-slate-300">
                  Overall AI Score
                </td>
                {comparedNames.map((n) => (
                  <td key={n.id} className="p-4 sm:p-6 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono font-black text-sm">
                      <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                      {n.score.overall}/100
                    </span>
                  </td>
                ))}
              </tr>

              {/* Memorability Recall */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-4 sm:p-6 font-bold text-slate-700 dark:text-slate-300">
                  Memorability & Recall
                </td>
                {comparedNames.map((n) => (
                  <td key={n.id} className="p-4 sm:p-6 text-center">
                    <div className="max-w-[120px] mx-auto">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {n.score.memorability}%
                      </span>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${n.score.memorability}%` }} />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Pronunciation Ease */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-4 sm:p-6 font-bold text-slate-700 dark:text-slate-300">
                  Phonetic Pronunciation
                </td>
                {comparedNames.map((n) => (
                  <td key={n.id} className="p-4 sm:p-6 text-center">
                    <div className="max-w-[120px] mx-auto">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {n.score.pronunciation}%
                      </span>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${n.score.pronunciation}%` }} />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Industry Relevance */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-4 sm:p-6 font-bold text-slate-700 dark:text-slate-300">
                  Industry Relevance
                </td>
                {comparedNames.map((n) => (
                  <td key={n.id} className="p-4 sm:p-6 text-center">
                    <div className="max-w-[120px] mx-auto">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {n.score.relevance}%
                      </span>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${n.score.relevance}%` }} />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Acoustic & Style */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-4 sm:p-6 font-bold text-slate-700 dark:text-slate-300">
                  Acoustic & Style
                </td>
                {comparedNames.map((n) => (
                  <td key={n.id} className="p-4 sm:p-6 text-center text-slate-600 dark:text-slate-300 font-medium">
                    {n.style}
                  </td>
                ))}
              </tr>

              {/* Meaning & Symbolism */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-4 sm:p-6 font-bold text-slate-700 dark:text-slate-300">
                  Meaning & Symbolism
                </td>
                {comparedNames.map((n) => (
                  <td key={n.id} className="p-4 sm:p-6 text-center text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed max-w-xs mx-auto">
                    {n.meaning}
                  </td>
                ))}
              </tr>

              {/* Actions Row */}
              <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                <td className="p-4 sm:p-6 font-bold text-slate-700 dark:text-slate-300">
                  Actions
                </td>
                {comparedNames.map((n) => {
                  const isWinner = currentProject?.selectedWinnerName === n.name;
                  return (
                    <td key={n.id} className="p-4 sm:p-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => {
                            selectWinnerName(n.name);
                            setActiveTab("studio");
                          }}
                          className={`w-full max-w-[160px] py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                            isWinner
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                              : "bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20"
                          }`}
                        >
                          <Trophy className="w-3.5 h-3.5" />
                          <span>{isWinner ? "Winner Active" : "Select Winner"}</span>
                        </button>

                        <button
                          onClick={() => removeFromComparison(n.id)}
                          className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-slate-50/60 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <SlidersHorizontal className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Comparison Table Empty</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Go to the Business Name Generator and click &quot;Compare&quot; on any card to evaluate up to
            5 names side-by-side.
          </p>
          <button
            onClick={() => setActiveTab("generator")}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white shadow-sm hover:bg-brand-700 transition-all inline-flex items-center gap-1.5"
          >
            <span>Go to Name Generator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
