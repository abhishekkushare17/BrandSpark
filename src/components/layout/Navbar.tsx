"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Moon,
  Sun,
  KeyRound,
  User as UserIcon,
  LogOut,
  FolderKanban,
  Wand2,
  Palette,
  Globe,
  SlidersHorizontal,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useProject } from "@/context/ProjectContext";

interface NavbarProps {
  onOpenApiKeyModal: () => void;
  onOpenAuthModal: (mode: "login" | "register") => void;
  onOpenAssistant?: () => void;
  showLanding: boolean;
  setShowLanding: (show: boolean) => void;
}

export function Navbar({
  onOpenApiKeyModal,
  onOpenAuthModal,
  onOpenAssistant,
  showLanding,
  setShowLanding,
}: NavbarProps) {
  const { user, logout, apiKey } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { activeTab, setActiveTab, currentProject } = useProject();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: "generator", label: "Names", icon: Wand2 },
    { id: "slogans", label: "Slogans", icon: Sparkles },
    { id: "studio", label: "Brand Studio", icon: Palette },
    { id: "logos", label: "Logos", icon: Palette },
    { id: "domains", label: "Domains & Social", icon: Globe },
    { id: "compare", label: "Compare", icon: SlidersHorizontal },
    { id: "projects", label: "Projects", icon: FolderKanban },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLanding(!showLanding)}
            className="flex items-center gap-2.5 group focus:outline-none"
            title="Toggle Landing Showcase"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Brand<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-violet-500">Spark</span>
            </span>
          </button>

          {/* Current Active Project Pill */}
          {currentProject && (
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-400">Active:</span>
              <button
                onClick={() => {
                  setShowLanding(false);
                  setActiveTab("projects");
                }}
                className="font-medium px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 hover:bg-brand-100 transition-colors truncate max-w-[140px]"
                title={currentProject.name}
              >
                {currentProject.name}
              </button>
            </div>
          )}
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setShowLanding(true)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              showLanding
                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            Overview
          </button>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = !showLanding && activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setShowLanding(false);
                  setActiveTab(link.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Spark Assistant Toggle */}
          {onOpenAssistant && (
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-600 to-brand-600 text-white shadow-sm hover:opacity-95 transition-all"
              title="Open Spark AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Spark AI</span>
            </button>
          )}

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
              apiKey
                ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            title="Configure Gemini API Key"
          >
            <KeyRound className="w-4 h-4" />
            <span className="hidden xl:inline">{apiKey ? "AI Ready" : "API Key"}</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800/80 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Auth Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow-sm">
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <FolderKanban className="w-4 h-4 text-brand-500" />
                    <span>My Saved Projects</span>
                  </button>
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-rose-600 dark:text-rose-400 border-t border-slate-100 dark:border-slate-800"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuthModal("login")}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuthModal("register")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-5 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
