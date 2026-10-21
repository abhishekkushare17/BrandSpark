"use client";

import React, { useState } from "react";
import { KeyRound, X, Check, ShieldCheck, ExternalLink, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const { apiKey, setApiKey } = useAuth();
  const { success, info } = useToast();
  const [inputVal, setInputVal] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(inputVal.trim());
    if (inputVal.trim()) {
      success("API Key Saved", "Gemini 2.5/1.5 AI acceleration is now fully activated.");
    } else {
      info("Key Cleared", "BrandSpark will use the internal neural-algorithmic brand engine.");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Engine Settings</h3>
              <p className="text-xs text-slate-500">Google Gemini API Configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Hybrid AI Architecture</span>
            </div>
            BrandSpark includes a built-in linguistic brand engine that works instantly. Entering your Google Gemini API key enables advanced deep-reasoning naming, multilingual slogans, and bespoke identity synthesis.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                placeholder="AIzaSy..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1.5 py-0.5"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>Get a free Gemini API key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              {inputVal && (
                <button
                  type="button"
                  onClick={() => setInputVal("")}
                  className="text-[11px] text-rose-500 hover:underline"
                >
                  Clear Key
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
}
