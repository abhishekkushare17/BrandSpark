"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { useToast } from "./ToastContext";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; resetLink?: string; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKeyState] = useState<string>("");
  const { success, error } = useToast();

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    if (typeof window !== "undefined") {
      localStorage.setItem("brandspark_gemini_key", key);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      }
    } catch {
      // Not logged in or network error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("brandspark_gemini_key");
      if (savedKey) setApiKeyState(savedKey);
    }
  }, [checkAuth]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        error("Login Failed", data.error || "Invalid credentials");
        return false;
      }

      setUser(data.user);
      setToken(data.token);
      success("Welcome Back!", `Signed in as ${data.user.name}`);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      error("Login Failed", msg);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        error("Registration Failed", data.error || "Could not create account");
        return false;
      }

      setUser(data.user);
      setToken(data.token);
      success("Account Created!", `Welcome to BrandSpark, ${data.user.name}`);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      error("Registration Failed", msg);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continue client cleanup
    }
    setUser(null);
    setToken(null);
    success("Signed Out", "You have been logged out safely.");
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || "Failed to process request." };
      }
      return {
        success: true,
        resetLink: data.resetLink,
        message: data.message,
      };
    } catch {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || "Password reset failed." };
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        apiKey,
        setApiKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
