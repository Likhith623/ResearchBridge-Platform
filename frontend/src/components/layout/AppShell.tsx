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
    return <main className="min-h-screen bg-[#070b14] text-white relative overflow-hidden">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Ambient Aurora Glows in Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Orb 1: Electric Cyan & Indigo */}
        <div className="absolute -top-32 -left-32 w-96 h-96 sm:w-[560px] sm:h-[560px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-transparent rounded-full blur-[110px] animate-pulse-glow" />
        {/* Orb 2: Royal Purple & Fuchsia */}
        <div className="absolute top-1/4 -right-32 w-96 h-96 sm:w-[620px] sm:h-[620px] bg-gradient-to-bl from-purple-600/18 via-pink-600/12 to-transparent rounded-full blur-[130px] animate-float" />
        {/* Orb 3: Emerald & Teal */}
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 sm:w-[520px] sm:h-[520px] bg-gradient-to-tr from-emerald-500/12 via-teal-600/12 to-transparent rounded-full blur-[120px] animate-pulse-glow" />
        {/* Subtle Cyber Grid Texture */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.45) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full overflow-y-auto">
          {children}
        </main>
      </div>
      <FloatingAiAssistant />
    </div>
  );
}
