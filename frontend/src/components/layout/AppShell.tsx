"use client";

import React from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { FloatingAiAssistant } from "@/components/ai/FloatingAiAssistant";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/auth");

  if (isAuthPage) {
    return <main className="h-screen h-[100dvh] overflow-hidden bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white relative transition-colors duration-300">{children}</main>;
  }

  return (
    <div className="h-screen h-[100dvh] flex flex-col bg-gradient-to-br from-slate-50 via-sky-50/50 via-indigo-50/30 to-purple-50/20 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 relative overflow-hidden selection:bg-cyan-500 selection:text-white transition-colors duration-300">
      {/* Dynamic Multi-Color Ambient Aurora Light Mesh in Canvas Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Orb 1: Electric Cyan & Sky Flare (Top Left) */}
        <div className="absolute -top-32 -left-32 w-96 h-96 sm:w-[580px] sm:h-[580px] bg-gradient-to-br from-cyan-400/40 via-sky-400/30 to-blue-500/15 dark:from-cyan-500/20 dark:via-blue-600/15 rounded-full blur-[110px] animate-pulse-glow" />
        {/* Orb 2: Royal Violet, Indigo & Pink Flare (Top Right) */}
        <div className="absolute top-1/4 -right-32 w-96 h-96 sm:w-[620px] sm:h-[620px] bg-gradient-to-bl from-purple-400/35 via-indigo-400/25 to-pink-400/20 dark:from-purple-600/18 dark:via-indigo-600/15 rounded-full blur-[130px] animate-float" />
        {/* Orb 3: Fresh Emerald & Mint Flare (Bottom Left) */}
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 sm:w-[540px] sm:h-[540px] bg-gradient-to-tr from-emerald-400/35 via-teal-400/25 to-cyan-400/15 dark:from-emerald-500/12 dark:via-teal-600/12 rounded-full blur-[120px] animate-pulse-glow" />
        {/* Orb 4: Sunset Peach, Coral & Warm Amber Flare (Bottom Right) */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-gradient-to-tl from-amber-300/35 via-rose-300/25 to-orange-300/15 dark:from-amber-500/10 dark:via-rose-500/10 rounded-full blur-[120px] animate-float" />
        {/* Orb 5: Soft Iridescent Core (Center) */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 sm:w-[480px] sm:h-[480px] bg-gradient-to-r from-blue-300/20 via-purple-300/15 to-teal-300/15 dark:from-blue-600/8 dark:via-purple-600/8 rounded-full blur-[140px]" />
        {/* Subtle Cyber Grid Texture */}
        <div 
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(rgba(100, 116, 139, 0.45) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <Navbar />
      <div className="flex-1 flex w-full min-h-0 overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 p-3 xs:p-4 sm:p-6 lg:p-8 min-w-0 max-w-full h-full overflow-y-auto">
          {children}
        </main>
      </div>
      <FloatingAiAssistant />
    </div>
  );
}
