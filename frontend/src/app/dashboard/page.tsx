"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Send,
  Users,
  FileText,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Building,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  Compass,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  ProfessorProfile,
  ResearchProject,
  ResearchRequest,
  OpportunityRadarAlert,
} from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { user, role, activePersona } = useAuth();
  const [professors, setProfessors] = useState<ProfessorProfile[]>([]);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [requests, setRequests] = useState<ResearchRequest[]>([]);
  const [radarAlerts, setRadarAlerts] = useState<OpportunityRadarAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [profData, projData, reqData, radarData] = await Promise.allSettled([
          api.getProfessors({ limit: 4 }),
          api.getProjects({ limit: 4 } as any),
          api.getResearchRequests(),
          api.getOpportunityRadar(),
        ]);

        if (profData.status === "fulfilled") {
          const val = profData.value;
          setProfessors(Array.isArray(val) ? val : (val as any)?.items || []);
        }
        if (projData.status === "fulfilled") {
          const val = projData.value;
          setProjects(Array.isArray(val) ? val : (val as any)?.items || []);
        }
        if (reqData.status === "fulfilled") {
          const val = reqData.value;
          setRequests(Array.isArray(val) ? val : (val as any)?.items || []);
        }
        if (radarData.status === "fulfilled") {
          const res: any = radarData.value;
          const alerts = res?.radar_opportunities || (Array.isArray(res) ? res : []);
          setRadarAlerts(Array.isArray(alerts) ? alerts : []);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [role, user]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-9 text-white shadow-xl border border-slate-800/80">
        {/* Ambient glow in banner */}
        <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-blue-600/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[200px] bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span suppressHydrationWarning>
              Live Session: {mounted ? (activePersona?.name || user?.full_name || "Alice Chen") : "Alice Chen"} ({mounted ? (role || "student") : "student"})
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight" suppressHydrationWarning>
            Welcome to ResearchBridge, {mounted ? (user?.full_name || "Scholar") : "Scholar"}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {role === "professor"
              ? "Supervise active laboratory grant openings, review prospective student applicants, and evaluate candidates with explainable AI."
              : role === "admin"
              ? "Oversee university research governance, verify professor credentials, and monitor campus-wide academic safety and equity."
              : "Discover faculty advisors, review funded research openings, explore peer-reviewed literature, and build your verified Skill Passport."}
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-2.5 pt-5 border-t border-slate-800/80 relative z-10">
          <Link href="/professors">
            <Button size="sm" variant="glass" className="text-xs gap-1.5 rounded-xl">
              <Users className="w-3.5 h-3.5 text-blue-300" />
              <span>Faculty Directory</span>
            </Button>
          </Link>
          <Link href="/projects">
            <Button size="sm" variant="glass" className="text-xs gap-1.5 rounded-xl">
              <Briefcase className="w-3.5 h-3.5 text-teal-300" />
              <span>Explore Openings</span>
            </Button>
          </Link>
          <Link href="/talent-matcher">
            <Button size="sm" variant="glass" className="text-xs gap-1.5 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Matcher</span>
            </Button>
          </Link>
          <Link href="/skills">
            <Button size="sm" variant="glass" className="text-xs gap-1.5 rounded-xl">
              <Award className="w-3.5 h-3.5 text-purple-300" />
              <span>Skill Passport</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverable className="p-5 border-l-4 border-l-blue-600 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {role === "professor" ? "Incoming Inquiries" : "My Applications"}
            </p>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {(Array.isArray(requests) ? requests : []).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Tracked in real-time</span>
          </p>
        </Card>

        <Card hoverable className="p-5 border-l-4 border-l-teal-600 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Lab Openings
            </p>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {(Array.isArray(projects) ? projects : []).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span>Active research projects</span>
          </p>
        </Card>

        <Card hoverable className="p-5 border-l-4 border-l-indigo-600 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Verified Faculty
            </p>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {(Array.isArray(professors) ? professors : []).length > 0
              ? (Array.isArray(professors) ? professors : []).length
              : 1}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>Stanford supervisors</span>
          </p>
        </Card>

        <Card hoverable className="p-5 border-l-4 border-l-amber-500 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Opportunity Radar
            </p>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {(Array.isArray(radarAlerts) ? radarAlerts : []).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>AI match notifications</span>
          </p>
        </Card>
      </div>

      {/* Main Content Sections: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Applications & Openings (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Research Applications */}
          <Card hoverable>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-600" />
                  <span>
                    {role === "professor" ? "Recent Applicant Inquiries" : "My Research Applications"}
                  </span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {role === "professor"
                    ? "Students applying to your research group with tracked evaluation stages"
                    : "Status updates and decision history from supervising professors"}
                </CardDescription>
              </div>
              <Link href="/requests">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600 gap-1">
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100">
              {(Array.isArray(requests) ? requests : []).length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
                    <Send className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">No applications recorded yet</p>
                  <p className="text-[11px] text-slate-400">
                    Explore active faculty openings and submit collaboration requests.
                  </p>
                  <Link href="/projects" className="inline-block pt-1">
                    <Button size="xs" variant="primary">
                      Explore Openings
                    </Button>
                  </Link>
                </div>
              ) : (
                (Array.isArray(requests) ? requests : []).slice(0, 3).map((req) => (
                  <div key={req.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {req.subject}
                        </p>
                        <Badge
                          variant={
                            req.status === "accepted"
                              ? "success"
                              : req.status === "rejected"
                              ? "destructive"
                              : req.status === "needs_information"
                              ? "warning"
                              : "default"
                          }
                          withDot
                          className="capitalize text-[10px]"
                        >
                          {req.status?.replace("_", " ") || "submitted"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {role === "professor"
                          ? `Applicant: ${req.student_name || "Student"}`
                          : `Professor: ${req.professor_name || "Faculty Supervisor"}`}
                        {" • "}
                        {formatDate(req.created_at)}
                      </p>
                    </div>
                    <Link href={`/requests`}>
                      <Button size="xs" variant="outline" className="shrink-0">
                        Details
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Featured Research Projects */}
          <Card hoverable>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-teal-600" />
                  <span>Advertised Research Openings</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Supervised laboratory vacancies actively accepting applications
                </CardDescription>
              </div>
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600 gap-1">
                  <span>Browse All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {(Array.isArray(projects) ? projects : []).length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No active projects advertised at the moment.
                </div>
              ) : (
                (Array.isArray(projects) ? projects : []).slice(0, 2).map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-200 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {proj.title}
                      </h4>
                      <Badge variant="teal" withDot className="text-[10px] shrink-0">
                        {proj.openings_count || 1} Openings
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {proj.summary}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-200/50">
                      <span>{proj.weekly_hours} hrs/week • {proj.work_arrangement}</span>
                      <Link href={`/projects`}>
                        <span className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                          <span>Apply Now</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Faculty & Radar (1 Col) */}
        <div className="space-y-6">
          {/* Faculty Profiles Quick View */}
          <Card hoverable>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Featured Faculty Supervisors</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Verified principal investigators &amp; lab directors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(Array.isArray(professors) ? professors : []).slice(0, 3).map((prof: any) => (
                <div
                  key={prof.id}
                  className="p-3 rounded-2xl border border-slate-100 hover:bg-slate-50/80 transition-all flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
                    {(prof.full_name || prof.profiles?.full_name || "P").charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {prof.full_name || prof.profiles?.full_name || "Faculty Member"}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {prof.academic_title || prof.title || "Professor"}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(Array.isArray(prof.research_interests) ? prof.research_interests : []).slice(0, 2).map((ri: any, idx: number) => (
                        <span
                          key={typeof ri === "string" ? `${ri}-${idx}` : (ri.id || ri.name || idx)}
                          className="text-[9px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-medium"
                        >
                          {typeof ri === "string" ? ri : ri.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/professors" className="block pt-1">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  Browse Faculty Directory
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* AI Opportunity Radar Highlights */}
          <Card hoverable className="bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-white border-blue-100/90 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>AI Opportunity Radar</span>
              </div>
              <CardTitle className="text-sm font-bold">Personalized Research Matches</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3">
              {radarAlerts.length > 0 ? (
                radarAlerts.slice(0, 2).map((alert, idx) => (
                  <div
                    key={alert.project_id || idx}
                    className="p-3.5 rounded-2xl bg-white/95 border border-blue-100/80 text-slate-700 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-xs text-slate-900 truncate">{alert.project_title}</p>
                      {alert.radar_score && (
                        <Badge variant="teal" withDot className="text-[10px] px-1.5 py-0 shrink-0">
                          {Math.round(alert.radar_score > 1 ? alert.radar_score : alert.radar_score * 100)}% Match
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                      {alert.potential_explanation}
                    </p>
                    <p className="text-[10px] text-blue-600 font-semibold pt-0.5">
                      Supervisor: {alert.professor_name}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3.5 rounded-2xl bg-white/95 border border-blue-100/80 text-slate-600 text-[11px] leading-relaxed">
                  Add verified skills to your Skill Passport to unlock proactive radar match notifications.
                </div>
              )}
              <Link href="/projects" className="block pt-1">
                <span className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1">
                  <span>View All Openings &amp; Opportunities</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
