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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-md border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span suppressHydrationWarning>
              Signed in as {mounted ? (activePersona?.name || user?.full_name || "Alice Chen") : "Alice Chen"} ({mounted ? (role || "student") : "student"})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" suppressHydrationWarning>
            Welcome to ResearchBridge, {mounted ? (user?.full_name || "Scholar") : "Scholar"}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            {role === "professor"
              ? "Oversee your laboratory openings, review prospective student applicants, and manage publications."
              : role === "admin"
              ? "Manage university research governance, verify professor credentials, and monitor academic equity."
              : "Discover faculty advisors, review funded research openings, and explore research papers with your AI guide."}
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="mt-6 flex flex-wrap gap-2.5 pt-4 border-t border-slate-800/80">
          <Link href="/professors">
            <Button size="sm" variant="outline" className="bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Faculty Directory</span>
            </Button>
          </Link>
          <Link href="/projects">
            <Button size="sm" variant="outline" className="bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700">
              <Briefcase className="w-3.5 h-3.5 text-teal-400" />
              <span>Explore Projects</span>
            </Button>
          </Link>
          <Link href="/skills">
            <Button size="sm" variant="outline" className="bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Skill Passport</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {role === "professor" ? "Incoming Apps" : "Active Applications"}
            </p>
            <Send className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {(Array.isArray(requests) ? requests : []).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Tracked in realtime</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-teal-600">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Lab Projects
            </p>
            <Briefcase className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {(Array.isArray(projects) ? projects : []).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Active lab openings</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Verified Faculty
            </p>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {(Array.isArray(professors) ? professors : []).length > 0 ? (Array.isArray(professors) ? professors : []).length : 1}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Supervisors registered</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Opportunity Radar
            </p>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {(Array.isArray(radarAlerts) ? radarAlerts : []).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">AI Match alerts</p>
        </Card>
      </div>

      {/* Main Content Sections: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Requests & Openings (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Research Applications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">
                  {role === "professor" ? "Recent Applicant Inquiries" : "My Research Applications"}
                </CardTitle>
                <CardDescription className="text-xs">
                  {role === "professor"
                    ? "Undergraduate and graduate students applying to your research group"
                    : "Status updates and decision history from supervising professors"}
                </CardDescription>
              </div>
              <Link href="/requests">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100">
              {(Array.isArray(requests) ? requests : []).length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No applications recorded yet. Explore faculty projects to apply!
                </div>
              ) : (
                (Array.isArray(requests) ? requests : []).slice(0, 3).map((req) => (
                  <div key={req.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-slate-900 truncate">
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
                          className="capitalize text-[10px]"
                        >
                          {req.status?.replace("_", " ") || "submitted"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {role === "professor" ? `Applicant: ${req.student_name || "Student"}` : `Professor: ${req.professor_name || "Faculty Supervisor"}`}
                        {" • "}
                        {formatDate(req.created_at)}
                      </p>
                    </div>
                    <Link href={`/requests`}>
                      <Button size="sm" variant="outline" className="text-xs shrink-0">
                        Details
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Featured Research Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Advertised Research Openings</CardTitle>
                <CardDescription className="text-xs">
                  Supervised laboratory vacancies actively accepting applications
                </CardDescription>
              </div>
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                  Browse All <ChevronRight className="w-3.5 h-3.5" />
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
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        {proj.title}
                      </h4>
                      <Badge variant="teal" className="text-[10px] shrink-0">
                        {proj.openings_count || 1} Openings
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {proj.summary}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                      <span>{proj.weekly_hours} hrs/week • {proj.work_arrangement}</span>
                      <Link href={`/projects`}>
                        <span className="text-blue-600 hover:underline font-medium">Apply Now →</span>
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Featured Faculty Supervisors</CardTitle>
              <CardDescription className="text-xs">
                Verified principal investigators & lab directors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {(Array.isArray(professors) ? professors : []).slice(0, 3).map((prof: any) => (
                <div
                  key={prof.id}
                  className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition-colors flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    {(prof.full_name || prof.profiles?.full_name || "P").charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-slate-900 truncate">
                      {prof.full_name || prof.profiles?.full_name || "Faculty Member"}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {prof.academic_title || prof.title || "Professor"}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(Array.isArray(prof.research_interests) ? prof.research_interests : []).slice(0, 2).map((ri: any) => (
                        <span
                          key={ri.id || ri.name}
                          className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600"
                        >
                          {typeof ri === "string" ? ri : ri.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/professors" className="block pt-1">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Browse Faculty Directory
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* AI Opportunity Radar Highlights */}
          <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border-blue-100">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Opportunity Radar</span>
              </div>
              <CardTitle className="text-sm">Personalized Research Matches</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3">
              {radarAlerts.length > 0 ? (
                radarAlerts.slice(0, 2).map((alert, idx) => (
                  <div
                    key={alert.project_id || idx}
                    className="p-3 rounded-lg bg-white border border-blue-100 text-slate-700 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900 truncate">{alert.project_title}</p>
                      {alert.radar_score && (
                        <Badge variant="teal" className="text-[9px] px-1.5 py-0">
                          {Math.round(alert.radar_score > 1 ? alert.radar_score : alert.radar_score * 100)}% Match
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {alert.potential_explanation}
                    </p>
                    <p className="text-[10px] text-blue-600 mt-1 font-medium">
                      Supervisor: {alert.professor_name}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-lg bg-white border border-blue-100 text-slate-600 text-[11px]">
                  Add verified skills to your Skill Passport to unlock proactive radar match notifications.
                </div>
              )}
              <Link href="/projects" className="block pt-1">
                <span className="text-xs font-semibold text-blue-600 hover:underline">
                  View All Openings &amp; Opportunities →
                </span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
