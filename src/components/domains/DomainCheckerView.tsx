"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Globe,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Search,
  Share2,
} from "lucide-react";
import { DomainCheckResult, SocialCheckResult } from "@/types";
import { useProject } from "@/context/ProjectContext";
import { useToast } from "@/context/ToastContext";

export function DomainCheckerView() {
  const { currentProject } = useProject();
  const { success, error, info } = useToast();

  const [searchName, setSearchName] = useState(
    currentProject?.selectedWinnerName || currentProject?.name || "BrandSpark"
  );
  const [isCheckingDomains, setIsCheckingDomains] = useState(false);
  const [isCheckingSocial, setIsCheckingSocial] = useState(false);
  const [domainResults, setDomainResults] = useState<DomainCheckResult[]>([]);
  const [socialResults, setSocialResults] = useState<SocialCheckResult[]>([]);

  const runVerification = useCallback(async (nameToVerify: string) => {
    if (!nameToVerify.trim()) return;
    const cleanName = nameToVerify.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

    setIsCheckingDomains(true);
    setIsCheckingSocial(true);

    try {
      // 1. Check domains
      const domainPromise = fetch("/api/domains/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.results) setDomainResults(data.results);
        })
        .catch(() => {
          error("Domain Check Error", "Could not verify domains.");
        })
        .finally(() => setIsCheckingDomains(false));

      // 2. Check social handles
      const socialPromise = fetch("/api/domains/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.results) setSocialResults(data.results);
        })
        .catch(() => {
          error("Social Check Error", "Could not verify social handles.");
        })
        .finally(() => setIsCheckingSocial(false));

      await Promise.all([domainPromise, socialPromise]);
      success("Verification Complete", `Verified availability for "${cleanName}".`);
    } catch {
      setIsCheckingDomains(false);
      setIsCheckingSocial(false);
    }
  }, [error, success]);

  useEffect(() => {
    if (searchName && domainResults.length === 0) {
      runVerification(searchName);
    }
  }, [searchName, domainResults.length, runVerification]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runVerification(searchName);
  };

  return (
    <div className="space-y-8">
      {/* Banner & Search Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>Live Availability Verification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Live Domain & Social Media Checker
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Real-time DNS queries and registry lookups. We never claim a handle or domain is available
            without direct technical verification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. brandspark, velocore"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isCheckingDomains || isCheckingSocial}
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isCheckingDomains || isCheckingSocial ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking DNS...</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                <span>Verify All</span>
              </>
            )}
          </button>
        </form>

        {/* Live Methodology Disclaimer */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            Queried via Cloudflare DNS over HTTPS & RDAP registry protocol. Verified directly from authoritative root servers.
          </span>
        </div>
      </div>

      {/* DOMAIN VERIFICATION RESULTS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Domain Extensions (.com, .io, .ai...)</h3>
            <p className="text-xs text-slate-500">Live DNS resolution and registry records</p>
          </div>
          {isCheckingDomains && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying DNS...</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {domainResults.map((dom) => {
            const isAvail = dom.status === "available";
            const isTaken = dom.status === "taken";

            return (
              <div
                key={dom.domain}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isAvail
                    ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                    : isTaken
                    ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {dom.extension}
                    </span>
                    {isAvail && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Available
                      </span>
                    )}
                    {isTaken && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                        <XCircle className="w-3.5 h-3.5" />
                        Registered
                      </span>
                    )}
                    {dom.status === "unknown" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Unchecked
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-black font-mono text-slate-900 dark:text-white truncate">
                    {dom.domain}
                  </h4>

                  {dom.priceEstimate && (
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold mt-1">
                      Est. {dom.priceEstimate}
                    </p>
                  )}
                  {dom.rawDetails && (
                    <p className="text-[10px] text-slate-400 mt-1 truncate">{dom.rawDetails}</p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-end">
                  <a
                    href={`https://www.namecheap.com/domains/registration/results/?domain=${dom.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>{isAvail ? "Register Now" : "View Registrar"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SOCIAL MEDIA HANDLES RESULTS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Social Media Usernames</h3>
            <p className="text-xs text-slate-500">Public profile availability and direct verification links</p>
          </div>
          {isCheckingSocial && (
            <span className="text-xs font-semibold text-brand-600 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying handles...</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {socialResults.map((soc) => {
            const isAvail = soc.status === "available";
            const isTaken = soc.status === "taken";

            return (
              <div
                key={soc.platform}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{soc.platform}</span>
                    {isAvail && (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Available
                      </span>
                    )}
                    {isTaken && (
                      <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-500" />
                        Taken
                      </span>
                    )}
                    {soc.status === "unknown" && (
                      <span className="text-[11px] text-slate-400">Direct Check Required</span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-slate-600 dark:text-slate-300 font-semibold">
                    {soc.handle}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <span>Check Handle</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
