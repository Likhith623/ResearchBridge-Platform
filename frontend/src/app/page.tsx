import Link from "next/link";
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
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">
                Research<span className="text-blue-400">Bridge</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium tracking-wider">
                ACADEMIC NETWORK
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation University Research Collaboration</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Bridging Students & Professors for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300">
              Breakthrough Academic Discovery
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Eliminate cold emails and scattered lab vacancies. Discover verified faculty
            supervisors, explore funded research openings, evaluate research papers with
            an integrated Gemini AI guide, and submit structured collaboration applications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Explore Faculty & Openings</span>
            </Link>
            <Link
              href="/skills"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Evidence-Based Skill Passport</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Faculty & Lab Discovery
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore verified professor profiles, active grants, published papers, and genuine
              advertised supervision availability across academic disciplines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Gemini Academic Assistant
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Context-aware AI helps you break down complex research methodologies, summarize
              publications, and craft well-reasoned inquiry proposals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Structured Application Cycle
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Formal research collaboration requests with tracked statuses, prerequisite matching,
              integrated messaging, and administrative governance.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500">
        <p>ResearchBridge — Stanford University Academic Network &amp; Collaboration Platform.</p>
        <p className="mt-1 text-[11px] text-slate-600">Built with Next.js, FastAPI, Supabase, and Google Gemini.</p>
      </footer>
    </div>
  );
}
