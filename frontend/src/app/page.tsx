"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  Users2,
  Send,
  Atom,
  ChevronRight,
  UserCheck,
  Shield,
  Zap,
  Sun,
  Moon,
  Award,
  Radar,
  FileText,
  Network,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

/* ---------- Small animation helpers ---------- */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1600;
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(to * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------- Static content ---------- */

const personas = [
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Alice Chen",
    role: "Student Researcher",
    icon: GraduationCap,
    iconBg: "from-blue-500 to-cyan-400",
    roleText: "text-blue-600 dark:text-blue-300",
    hover: "hover:border-blue-300 dark:hover:border-blue-400/50 hover:shadow-blue-300/40 dark:hover:shadow-blue-500/20",
    tint: "from-blue-50/80 dark:from-blue-500/10",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Prof. Alan Turing",
    role: "Faculty PI / Chair",
    icon: BookOpen,
    iconBg: "from-emerald-500 to-teal-400",
    roleText: "text-emerald-600 dark:text-emerald-300",
    hover: "hover:border-emerald-300 dark:hover:border-emerald-400/50 hover:shadow-emerald-300/40 dark:hover:shadow-emerald-500/20",
    tint: "from-emerald-50/80 dark:from-emerald-500/10",
  },
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Dr. Eleanor Vance",
    role: "Admin Governance",
    icon: Shield,
    iconBg: "from-fuchsia-500 to-pink-400",
    roleText: "text-fuchsia-600 dark:text-fuchsia-300",
    hover: "hover:border-fuchsia-300 dark:hover:border-fuchsia-400/50 hover:shadow-fuchsia-300/40 dark:hover:shadow-fuchsia-500/20",
    tint: "from-fuchsia-50/80 dark:from-fuchsia-500/10",
  },
];

const stats = [
  { to: 100, decimals: 0, suffix: "%", label: "Verified Research Labs", color: "text-emerald-600 dark:text-emerald-400", ring: "hover:border-emerald-300 dark:hover:border-emerald-400/40", tint: "from-emerald-50 dark:from-emerald-500/10" },
  { to: 24, decimals: 0, suffix: "+", label: "Active Funded Openings", color: "text-blue-600 dark:text-blue-400", ring: "hover:border-blue-300 dark:hover:border-blue-400/40", tint: "from-blue-50 dark:from-blue-500/10" },
  { to: 98.4, decimals: 1, suffix: "%", label: "Talent Match Precision", color: "text-cyan-600 dark:text-cyan-400", ring: "hover:border-cyan-300 dark:hover:border-cyan-400/40", tint: "from-cyan-50 dark:from-cyan-500/10" },
  { to: 2.5, decimals: 1, suffix: "", prefix: "Gemini ", label: "Contextual AI Assistant", color: "text-fuchsia-600 dark:text-fuchsia-400", ring: "hover:border-fuchsia-300 dark:hover:border-fuchsia-400/40", tint: "from-fuchsia-50 dark:from-fuchsia-500/10" },
];

const fields = [
  "Machine Learning", "Quantum Computing", "Genomics", "Robotics", "Climate Science", "Neuroscience",
  "Computational Biology", "Materials Science", "Natural Language Processing", "Cybersecurity",
  "Renewable Energy", "Medical Imaging", "Astrophysics", "Human-Computer Interaction",
];

const cardBase =
  "tilt-card relative overflow-hidden rounded-3xl border bg-white dark:bg-slate-900/70 border-slate-200/80 dark:border-white/10 shadow-[0_12px_40px_-14px_rgba(79,70,229,0.18)] dark:shadow-[0_18px_44px_-12px_rgba(0,0,0,0.75)] backdrop-blur-xl pastel-inner";

export default function LandingPage() {
  const router = useRouter();
  const { switchPersona } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleQuickDemoLaunch = (personaId: string) => {
    switchPersona(personaId);
    router.push("/dashboard");
  };

  return (
    <div className="h-screen h-[100dvh] flex flex-col overflow-hidden bg-white dark:bg-[#060a14] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white relative transition-colors duration-300">
      {/* Animated pastel aurora (light) / deep neon aurora (dark) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="animate-blob absolute -top-40 -left-32 w-[560px] h-[560px] bg-sky-300/40 dark:bg-sky-500/15 blur-[110px]" />
        <div className="animate-blob absolute -top-24 right-[-120px] w-[520px] h-[520px] bg-fuchsia-300/35 dark:bg-fuchsia-600/15 blur-[110px]" style={{ animationDelay: "-4s" }} />
        <div className="animate-blob absolute top-1/2 -left-40 w-[480px] h-[480px] bg-emerald-300/35 dark:bg-emerald-500/12 blur-[110px]" style={{ animationDelay: "-8s" }} />
        <div className="animate-blob absolute top-1/2 right-[-100px] w-[460px] h-[460px] bg-amber-200/45 dark:bg-amber-500/10 blur-[110px]" style={{ animationDelay: "-11s" }} />
        <div className="animate-blob absolute bottom-[-160px] left-1/3 w-[520px] h-[520px] bg-indigo-300/35 dark:bg-indigo-500/15 blur-[120px]" style={{ animationDelay: "-6s" }} />
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(rgba(71, 85, 105, 0.6) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      {/* Floating glass navigation */}
      <div className="shrink-0 z-50 w-full pt-2.5 sm:pt-4 px-3 sm:px-6 lg:px-8 animate-fade-in">
        <header className="max-w-6xl mx-auto w-full border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-lg shadow-indigo-200/30 dark:shadow-black/50 px-3.5 sm:px-5 lg:px-6 h-11 sm:h-12 md:h-14 flex items-center justify-between gap-2 sm:gap-4 transition-all pastel-inner">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
              <GraduationCap className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
                Research<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">Bridge</span>
              </span>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 dark:text-slate-400 block -mt-1 font-semibold tracking-widest">
                ACADEMIC NETWORK
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={toggleTheme}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 p-0 rounded-lg sm:rounded-xl border border-slate-200/80 dark:border-white/15 bg-white/80 dark:bg-slate-900/80 hover:border-amber-400/60 transition-all cursor-pointer active:scale-90 flex items-center justify-center group shrink-0 pastel-inner"
              title={mounted && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-500" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            <Link
              href="/login"
              className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:border-indigo-400/60 transition-all items-center gap-1.5 shrink-0 pastel-inner"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Demo Roles &amp; Sign In</span>
            </Link>
            <Link
              href="/dashboard"
              className="btn-shine hidden sm:flex px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-500 text-white transition-all shadow-md shadow-indigo-500/30 hover:shadow-fuchsia-500/40 items-center gap-1.5 group shrink-0 active:scale-95"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </header>
      </div>

      {/* Scrollable middle content */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative z-10 flex flex-col">
        {/* ===== Hero ===== */}
        <section className="relative pt-10 sm:pt-20 pb-10 sm:pb-16 px-3 sm:px-6 lg:px-8">
          {/* Floating feature chips (large screens) */}
          <div className="hidden lg:block pointer-events-none" aria-hidden="true">
            <div className="animate-bob absolute left-[6%] top-28 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-blue-200/80 dark:border-blue-400/20 shadow-xl shadow-blue-200/50 dark:shadow-black/50 backdrop-blur flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300 pastel-inner">
              <Radar className="w-4 h-4" /> Opportunity Radar
            </div>
            <div className="animate-bob absolute right-[7%] top-32 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-fuchsia-200/80 dark:border-fuchsia-400/20 shadow-xl shadow-fuchsia-200/50 dark:shadow-black/50 backdrop-blur flex items-center gap-2 text-xs font-semibold text-fuchsia-700 dark:text-fuchsia-300 pastel-inner" style={{ animationDelay: "-1.5s" }}>
              <Award className="w-4 h-4" /> Skill Passport
            </div>
            <div className="animate-bob absolute left-[10%] top-[26rem] px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-emerald-200/80 dark:border-emerald-400/20 shadow-xl shadow-emerald-200/50 dark:shadow-black/50 backdrop-blur flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 pastel-inner" style={{ animationDelay: "-2.5s" }}>
              <FileText className="w-4 h-4" /> Paper Summaries
            </div>
            <div className="animate-bob absolute right-[9%] top-[25rem] px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-amber-200/80 dark:border-amber-400/20 shadow-xl shadow-amber-200/50 dark:shadow-black/50 backdrop-blur flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300 pastel-inner" style={{ animationDelay: "-3.2s" }}>
              <Network className="w-4 h-4" /> Collab Graph
            </div>
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-5 sm:space-y-7">
            <div
              className="animate-fade-up inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-indigo-200 dark:border-white/15 text-indigo-700 dark:text-indigo-200 text-[11px] sm:text-xs font-semibold shadow-md shadow-indigo-200/40 dark:shadow-none backdrop-blur-md pastel-inner"
              style={{ ["--d" as string]: "0ms" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Academic Network &amp; Collaboration Platform • Version 2.0</span>
            </div>

            <h1
              className="animate-fade-up text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]"
              style={{ ["--d" as string]: "120ms" }}
            >
              Connecting Students &amp; Faculty for{" "}
              <span className="gradient-text-animated">Breakthrough Academic Discovery</span>
            </h1>

            <p
              className="animate-fade-up text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
              style={{ ["--d" as string]: "240ms" }}
            >
              Eliminate cold emails and scattered lab vacancies. Discover verified faculty supervisors,
              explore funded research projects, analyze publications with Gemini AI, and apply with a verified Skill Passport.
            </p>

            <div
              className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-3 pt-1"
              style={{ ["--d" as string]: "360ms" }}
            >
              <Link
                href="/dashboard"
                className="btn-shine w-full sm:w-auto px-7 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-500 text-white shadow-xl shadow-indigo-500/30 hover:shadow-fuchsia-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-95 group"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore the Platform</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-7 py-3 rounded-2xl text-sm font-semibold bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-100 border border-slate-200 dark:border-white/15 hover:border-indigo-300 dark:hover:border-white/30 shadow-md shadow-slate-200/60 dark:shadow-none hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-95 pastel-inner"
              >
                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Sign In with Demo Role</span>
              </Link>
            </div>

            {/* Persona launchpad */}
            <div className="animate-fade-up pt-4 sm:pt-6 max-w-3xl mx-auto" style={{ ["--d" as string]: "480ms" }}>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider sm:tracking-widest mb-2.5 sm:mb-3 flex items-center justify-center gap-1.5 sm:gap-2">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
                <span>Experience ResearchBridge with 1-Click Demo Profiles</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {personas.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleQuickDemoLaunch(p.id)}
                      className={`tilt-card group text-left flex items-center justify-between gap-2 py-3 px-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-gradient-to-br ${p.tint} to-white dark:to-slate-900/70 shadow-lg shadow-slate-200/60 dark:shadow-black/40 cursor-pointer ${p.hover} hover:shadow-xl`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr ${p.iconBg} text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</p>
                          <p className={`text-[10px] font-medium truncate ${p.roleText}`}>{p.role}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Research field marquee ===== */}
        <Reveal className="px-3 sm:px-6 lg:px-8">
          <div className="marquee-wrap max-w-6xl mx-auto overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur py-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] pastel-inner">
            <div className="animate-marquee flex w-max gap-3">
              {[...fields, ...fields].map((f, i) => (
                <span
                  key={`${f}-${i}`}
                  className="px-3.5 py-1 rounded-full text-[11px] font-semibold border border-indigo-100 dark:border-white/10 bg-gradient-to-r from-sky-50 via-indigo-50 to-fuchsia-50 dark:from-sky-500/10 dark:via-indigo-500/10 dark:to-fuchsia-500/10 text-slate-700 dark:text-slate-200 whitespace-nowrap"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ===== Metrics ===== */}
        <section className="px-3 sm:px-6 lg:px-8 mt-10 sm:mt-14">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div
                  className={`tilt-card text-center p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-gradient-to-b ${s.tint} to-white dark:to-slate-900/60 shadow-lg shadow-slate-200/50 dark:shadow-black/40 ${s.ring}`}
                >
                  <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${s.color}`}>
                    {s.prefix}
                    <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-medium">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ===== Bento features ===== */}
        <section className="px-3 sm:px-6 lg:px-8 mt-14 sm:mt-20">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-300">Everything in one place</p>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Built for modern research collaboration
              </h2>
            </div>
          </Reveal>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1 */}
            <Reveal className="md:col-span-2" delay={0}>
              <div className={`${cardBase} h-full p-6 sm:p-8 space-y-5 group hover:border-blue-300 dark:hover:border-blue-400/40`}>
                <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-sky-200/50 dark:bg-sky-500/10 blur-3xl group-hover:scale-125 transition-transform duration-700" />
                <div className="relative space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="text-[11px] px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-400/25">
                      Embeddings &amp; Radar
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Vectorized Talent Matcher &amp; Opportunity Radar</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    Faculty PIs can evaluate student applicants against custom lab skill requirements,
                    coursework prerequisites, and research publications with explainable match rationales.
                  </p>
                </div>
                <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 dark:border-white/10">
                  {[
                    { t: "Semantic Matching", d: "Analyzes research interests & code skills", c: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50/70 dark:bg-blue-500/10 border-blue-100 dark:border-blue-400/15" },
                    { t: "Opportunity Radar", d: "Automated candidate recommendation", c: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50/70 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-400/15" },
                    { t: "Skill Passport", d: "Verifiable laboratory achievements", c: "text-fuchsia-700 dark:text-fuchsia-300", bg: "bg-fuchsia-50/70 dark:bg-fuchsia-500/10 border-fuchsia-100 dark:border-fuchsia-400/15" },
                  ].map((m) => (
                    <div key={m.t} className={`p-3.5 rounded-2xl border space-y-1 hover:-translate-y-1 transition-transform ${m.bg}`}>
                      <div className={`text-xs font-bold ${m.c}`}>{m.t}</div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{m.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Card 2 */}
            <Reveal delay={120}>
              <div className={`${cardBase} h-full p-6 sm:p-8 space-y-5 group hover:border-emerald-300 dark:hover:border-emerald-400/40 flex flex-col justify-between`}>
                <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-emerald-200/50 dark:bg-emerald-500/10 blur-3xl group-hover:scale-125 transition-transform duration-700" />
                <div className="relative space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <Atom className="w-6 h-6 animate-spin-slow" />
                    </div>
                    <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-400/25">
                      Gemini Flash
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Explainable Literature AI</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Break down complex academic papers into executive abstracts, research questions, methodologies, and critiques.
                  </p>
                </div>
                <div className="relative p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-400/15 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Gemini Academic Engine</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Summarize Papers", "Extract Citations"].map((t) => (
                      <span key={t} className="text-[10px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-400/25 font-medium pastel-inner">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card 3 */}
            <Reveal delay={0}>
              <div className={`${cardBase} h-full p-6 sm:p-8 space-y-5 group hover:border-indigo-300 dark:hover:border-indigo-400/40 flex flex-col justify-between`}>
                <div className="absolute -top-16 -left-12 w-56 h-56 rounded-full bg-indigo-200/50 dark:bg-indigo-500/10 blur-3xl group-hover:scale-125 transition-transform duration-700" />
                <div className="relative space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:-rotate-6 transition-transform">
                      <Send className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-400/25">
                      Workflow
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Structured Application Cycle</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Replaces cluttered inboxes with clear application statuses (Submitted, Under Review, Interview, Accepted).
                  </p>
                </div>
                <Link
                  href="/requests"
                  className="relative text-xs text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-200 font-bold flex items-center gap-1.5 pt-2 group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore Application System</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            {/* Card 4 */}
            <Reveal className="md:col-span-2" delay={120}>
              <div className={`${cardBase} h-full p-6 sm:p-8 space-y-5 group hover:border-fuchsia-300 dark:hover:border-fuchsia-400/40 flex flex-col justify-between`}>
                <div className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full bg-fuchsia-200/50 dark:bg-fuchsia-500/10 blur-3xl group-hover:scale-125 transition-transform duration-700" />
                <div className="relative space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-pink-400 text-white flex items-center justify-center shadow-lg shadow-fuchsia-500/30 group-hover:rotate-6 transition-transform">
                      <Users2 className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] px-3 py-1 rounded-full bg-fuchsia-50 dark:bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 font-semibold border border-fuchsia-200 dark:border-fuchsia-400/25">
                      Knowledge Graph
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Multi-Disciplinary Team Composer &amp; Knowledge Graph</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    Visualize co-authorship networks, identify complementary research groups across engineering and medicine,
                    and compose balanced student teams for major grant proposals.
                  </p>
                </div>
                <div className="relative flex flex-wrap gap-2 pt-2">
                  {[
                    { t: "Interactive Co-Authorship Graph", c: "text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-400/25 bg-fuchsia-50/70 dark:bg-fuchsia-500/10" },
                    { t: "Grant Team Builder", c: "text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-400/25 bg-blue-50/70 dark:bg-blue-500/10" },
                    { t: "Department Governance", c: "text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-400/25 bg-emerald-50/70 dark:bg-emerald-500/10" },
                  ].map((chip) => (
                    <span key={chip.t} className={`text-[11px] px-3 py-1 rounded-xl border font-medium hover:-translate-y-0.5 transition-transform ${chip.c}`}>
                      {chip.t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative max-w-4xl mx-auto overflow-hidden rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-slate-200/80 dark:border-white/10 bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 dark:from-slate-900 dark:via-[#0b1226] dark:to-slate-900 shadow-[0_24px_70px_-20px_rgba(99,102,241,0.35)] dark:shadow-[0_24px_70px_-20px_rgba(0,0,0,0.9)]">
              <div className="animate-blob absolute -top-20 -left-16 w-72 h-72 bg-sky-300/50 dark:bg-sky-500/20 blur-3xl" />
              <div className="animate-blob absolute -bottom-24 -right-12 w-72 h-72 bg-fuchsia-300/50 dark:bg-fuchsia-500/20 blur-3xl" style={{ animationDelay: "-5s" }} />
              <div className="animate-blob absolute top-1/2 left-1/2 w-60 h-60 bg-emerald-200/40 dark:bg-emerald-500/10 blur-3xl" style={{ animationDelay: "-9s" }} />

              <div className="relative space-y-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Ready to Pioneer <span className="gradient-text-animated">Breakthrough Research?</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                  Step into the platform today. Choose any role, test the AI assistants, and explore faculty opportunities.
                </p>
              </div>

              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="btn-shine w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-500 text-white shadow-xl shadow-indigo-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sign In with Demo Credentials</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/15 text-slate-700 dark:text-white border border-slate-200 dark:border-white/15 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-md shadow-slate-200/60 dark:shadow-none pastel-inner"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Direct Dashboard Access</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200/80 dark:border-white/10 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-transparent backdrop-blur">
          <p>ResearchBridge — University Academic Network &amp; Collaboration Platform.</p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-500">Built with Next.js 16, FastAPI, Supabase, and Google Gemini AI.</p>
        </footer>
      </div>
    </div>
  );
}
