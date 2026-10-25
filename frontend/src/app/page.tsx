"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users2,
  Send,
  Atom,
  TrendingUp,
  BrainCircuit,
  Award,
  ChevronRight,
  UserCheck,
  Shield,
  Layers,
  FileText,
} from "lucide-react";
import { useAuth, DEMO_PERSONAS } from "@/context/AuthContext";

export default function LandingPage() {
  const router = useRouter();
  const { switchPersona } = useAuth();
  const [activeTab, setActiveTab] = useState<"student" | "professor" | "admin">("student");

  const handleQuickDemoLaunch = (personaId: string) => {
    switchPersona(personaId);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Dynamic Ambient Background Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-600/18 via-indigo-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-[-150px] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 right-[-150px] w-[500px] h-[500px] bg-purple-600/12 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top Glass Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-all">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Research<span className="text-blue-400">Bridge</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium tracking-widest">
                ACADEMIC NETWORK
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Demo Roles &amp; Sign In</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 group"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-7">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Stanford University Academic Network • Version 2.0</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
            Connecting Students &amp; Faculty for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300">
              Breakthrough Academic Discovery
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Eliminate cold emails and scattered lab vacancies. Discover verified faculty supervisors,
            explore funded research projects, analyze publications with Gemini AI, and apply with a verified Skill Passport.
          </p>

          {/* Quick 1-Click Persona Launchpad */}
          <div className="pt-4 max-w-3xl mx-auto">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Experience ResearchBridge with 1-Click Demo Profiles:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Student */}
              <button
                onClick={() => handleQuickDemoLaunch("00000000-0000-0000-0000-000000000003")}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-800/80 transition-all text-left flex items-center justify-between group cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                      Alice Chen
                    </p>
                    <p className="text-[10px] text-slate-400">Student Researcher</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Professor */}
              <button
                onClick={() => handleQuickDemoLaunch("00000000-0000-0000-0000-000000000002")}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/60 hover:bg-slate-800/80 transition-all text-left flex items-center justify-between group cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm border border-teal-500/30">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                      Prof. Alan Turing
                    </p>
                    <p className="text-[10px] text-slate-400">Faculty PI / Chair</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Admin */}
              <button
                onClick={() => handleQuickDemoLaunch("00000000-0000-0000-0000-000000000001")}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/80 transition-all text-left flex items-center justify-between group cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Dr. Eleanor Vance
                    </p>
                    <p className="text-[10px] text-slate-400">Admin Governance</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Academic Network Metrics Ticker */}
        <div className="max-w-5xl mx-auto mt-16 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-extrabold text-white tracking-tight">100%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Verified Stanford Labs</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-blue-400 tracking-tight">24+</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Active Funded Openings</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-teal-400 tracking-tight">98.4%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Talent Match Precision</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-indigo-400 tracking-tight">Gemini 2.5</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Contextual AI Assistant</div>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Card 1: Talent Matcher & Radar */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Vectorized Talent Matcher &amp; Opportunity Radar
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
                Faculty PIs can instantly evaluate student applicants against custom lab skill requirements,
                coursework prerequisites, and research publications with explainable match rationales.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs font-semibold text-slate-300">Semantic Matching</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Analyzes research interests &amp; code skills</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs font-semibold text-slate-300">Live Opportunity Radar</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Automated candidate recommendation</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-xs font-semibold text-slate-300">Skill Passport</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Verifiable lab achievements</p>
              </div>
            </div>
          </div>

          {/* Card 2: AI Paper Review */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Atom className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Explainable Literature AI
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Break down complex academic papers into executive abstracts, research questions, methodologies, and critiques.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-xs font-bold text-teal-300">Gemini Academic Engine</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Generates high-precision summaries and tailored cold inquiry drafts.
              </p>
            </div>
          </div>

          {/* Card 3: Formal Applications */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Structured Application Cycle
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Replaces cluttered inboxes with clear application statuses (Submitted, Under Review, Interview, Accepted).
              </p>
            </div>
            <Link
              href="/requests"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 pt-2"
            >
              <span>Explore Application System</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Collaboration Graph */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Multi-Disciplinary Team Composer &amp; Knowledge Graph
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
                Visualize co-authorship networks, identify complementary research groups across engineering and medicine,
                and compose balanced student teams for major grant proposals.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                Interactive Co-Authorship Graph
              </span>
              <span className="text-[11px] px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                Grant Team Builder
              </span>
              <span className="text-[11px] px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                Department Governance
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900 relative">
        <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/40 border border-blue-500/30 backdrop-blur-xl text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Pioneer Breakthrough Research?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Step into the platform today. Choose any role, test the AI assistants, and explore faculty opportunities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>Sign In with Demo Credentials</span>
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Direct Dashboard Access</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-4 text-center text-xs text-slate-500">
        <p>ResearchBridge — Stanford University Academic Network &amp; Collaboration Platform.</p>
        <p className="mt-1 text-[11px] text-slate-600">Built with Next.js 16, FastAPI, Supabase, and Google Gemini AI.</p>
      </footer>
    </div>
  );
}
