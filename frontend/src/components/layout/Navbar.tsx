"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  UserCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  Shield,
  BookOpen,
} from "lucide-react";
import { useAuth, DEMO_PERSONAS } from "@/context/AuthContext";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { Badge } from "@/components/ui/Badge";

export function Navbar() {
  const { user, role, activePersona, switchPersona, signOut } = useAuth();
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                Research<span className="text-blue-600">Bridge</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium tracking-wide">
                ACADEMIC NETWORK
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Controls & User Profile */}
        <div className="flex items-center gap-3">
          {/* Persona Switcher Dropdown (Real Seeded Accounts) */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              title="Switch demo persona for testing"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Role:</span>
              <span className="font-semibold text-slate-900" suppressHydrationWarning>
                {mounted ? (activePersona?.name || user?.full_name || "Alice Chen") : "Alice Chen"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isPersonaOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setIsPersonaOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Switch Test Account
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Pre-seeded test roles with real Supabase data
                  </p>
                </div>
                {DEMO_PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => switchPersona(p.id)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 text-xs hover:bg-slate-50 transition-colors cursor-pointer ${
                      activePersona?.id === p.id ? "bg-blue-50/60" : ""
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900 truncate">
                          {p.name}
                        </span>
                        <Badge
                          variant={
                            p.role === "admin"
                              ? "destructive"
                              : p.role === "professor"
                              ? "teal"
                              : "default"
                          }
                          className="text-[9px] px-1.5 py-0 capitalize"
                        >
                          {p.role}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {p.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <NotificationCenter />

          {/* User Avatar & Logout */}
          <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          <button
            onClick={() => signOut()}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
