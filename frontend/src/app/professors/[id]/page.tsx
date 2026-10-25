"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Building,
  Mail,
  ExternalLink,
  BookOpen,
  Briefcase,
  Send,
  Sparkles,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { api } from "@/lib/api";
import {
  ProfessorProfile,
  Publication,
  ResearchProject,
} from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

export default function ProfessorDetailPage() {
  const params = useParams();
  const profId = params.id as string;

  const [professor, setProfessor] = useState<ProfessorProfile | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "publications" | "projects">("overview");
  const [isLoading, setIsLoading] = useState(true);

  // Application Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [motivation, setMotivation] = useState("");
  const [skills, setSkills] = useState("");
  const [hours, setHours] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfessorData() {
      setIsLoading(true);
      try {
        const [profData, pubData, projData] = await Promise.allSettled([
          api.getProfessor(profId),
          api.getProfessorPublications(profId),
          api.getProjects(),
        ]);

        if (profData.status === "fulfilled") setProfessor(profData.value);
        if (pubData.status === "fulfilled") {
          const val = pubData.value;
          setPublications(Array.isArray(val) ? val : (val as any)?.items || []);
        }
        if (projData.status === "fulfilled") {
          const val = projData.value;
          const list = Array.isArray(val) ? val : (val as any)?.items || [];
          const profProjects = list.filter(
            (p: any) => p.professor_id === profId
          );
          setProjects(profProjects);
        }
      } catch (err) {
        console.error("Failed to load professor detail:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (profId) fetchProfessorData();
  }, [profId]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !motivation.trim()) {
      setSubmitError("Please fill in both the subject and motivation statement.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await api.createResearchRequest({
        professor_id: profId,
        project_id: selectedProjectId || undefined,
        subject,
        motivation_statement: motivation,
        student_skills: skillsArray.length > 0 ? skillsArray : ["Python", "Research Analysis"],
        proposed_availability_hours: Number(hours),
      });

      setSubmitSuccess("Your research collaboration application was submitted successfully!");
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setSubmitSuccess(null);
        setSubject("");
        setMotivation("");
      }, 2000);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-40 bg-slate-200 rounded-2xl"></div>
        <div className="h-64 bg-slate-100 rounded-2xl"></div>
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <p className="text-slate-500 text-sm">Faculty profile could not be found.</p>
        <Link href="/professors">
          <Button variant="outline" size="sm">
            Return to Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/professors"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Faculty Directory</span>
      </Link>

      {/* Professor Header Card */}
      <Card className="p-6 sm:p-8 bg-white border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-md">
              {(professor.full_name || professor.profiles?.full_name || "P").charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {professor.full_name || professor.profiles?.full_name || "Faculty Supervisor"}
                </h1>
                <Badge
                  variant={professor.open_to_applications ? "success" : "secondary"}
                  className="text-xs"
                >
                  {professor.open_to_applications ? "Open to Students" : "At Capacity"}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {professor.academic_title || professor.title || "Professor"}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <Building className="w-3.5 h-3.5" />
                <span>
                  {professor.lab_name || "Research Group"} •{" "}
                  {professor.office_location || "Campus Office"}
                </span>
              </p>
            </div>
          </div>

          <Button
            size="md"
            variant="primary"
            onClick={() => setIsApplyModalOpen(true)}
            className="w-full sm:w-auto text-xs gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Apply for Research Supervision</span>
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-slate-100 mt-8 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-1 transition-colors border-b-2 cursor-pointer ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Academic Overview
          </button>
          <button
            onClick={() => setActiveTab("publications")}
            className={`pb-3 px-1 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "publications"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Publications</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {(Array.isArray(publications) ? publications : []).length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-3 px-1 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "projects"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Open Projects</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {(Array.isArray(projects) ? projects : []).length}
            </Badge>
          </button>
        </div>
      </Card>

      {/* Tab 1: Academic Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Biography & Research Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {professor.bio ||
                  professor.profiles?.bio ||
                  "Conducting foundational and applied scientific research in modern computer systems and artificial intelligence."}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Research Focus Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(professor.research_interests) ? professor.research_interests : []).map((ri: any) => (
                    <div
                      key={ri.id || ri.name || ri}
                      className="px-3 py-1.5 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-800 text-xs font-medium"
                    >
                      {typeof ri === "string" ? ri : ri.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Supervision Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Active Students</span>
                  <span className="font-semibold text-slate-900">
                    {professor.current_supervision_count || 1} / {professor.max_capacity || 4}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Weekly Commitment</span>
                  <span className="font-semibold text-slate-900">
                    ~{professor.preferred_weekly_hours || 12} hrs/week
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Application Status</span>
                  <span className="font-semibold text-emerald-600">
                    {professor.open_to_applications ? "Accepting Applicants" : "Full Capacity"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Publications */}
      {activeTab === "publications" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Authored Academic Papers</CardTitle>
            <CardDescription className="text-xs">
              Peer-reviewed articles, conference proceedings, and technical preprints
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100">
            {(Array.isArray(publications) ? publications : []).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No publications listed yet.
              </div>
            ) : (
              (Array.isArray(publications) ? publications : []).map((pub) => (
                <div key={pub.id} className="py-4 space-y-1.5">
                  <h4 className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                    {pub.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {pub.venue ? `${pub.venue} ` : ""}
                    {pub.year ? `(${pub.year})` : ""}
                    {pub.doi ? ` • DOI: ${pub.doi}` : ""}
                  </p>
                  {pub.abstract && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-1 line-clamp-3">
                      {pub.abstract}
                    </p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Ongoing Research Projects */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Array.isArray(projects) ? projects : []).length === 0 ? (
            <Card className="col-span-2 p-12 text-center text-slate-400 text-xs">
              No active project openings currently listed. You can still submit a general research inquiry!
            </Card>
          ) : (
            (Array.isArray(projects) ? projects : []).map((proj) => (
              <Card key={proj.id} className="p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                    <Badge variant="teal" className="text-[10px]">
                      {proj.openings_count} Openings
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {proj.summary}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{proj.weekly_hours} hrs/week</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setSubject(`Application for: ${proj.title}`);
                      setIsApplyModalOpen(true);
                    }}
                    className="text-xs"
                  >
                    Apply to Project
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Structured Research Application Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for Research Collaboration with ${professor?.full_name || professor?.profiles?.full_name || "Faculty Supervisor"}`}
        description="Submit a formal academic inquiry detailing your background, motivation, and availability."
        maxWidth="xl"
      >
        {submitSuccess ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-slate-900">Application Submitted!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">{submitSuccess}</p>
          </div>
        ) : (
          <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
            {submitError && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                {submitError}
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Undergraduate Research Inquiry — Machine Learning Lab"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                required
              />
            </div>

            {(Array.isArray(projects) ? projects : []).length > 0 && (
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Associated Project Opening (Optional)
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                >
                  <option value="">General Lab Inquiry (No specific project)</option>
                  {(Array.isArray(projects) ? projects : []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Motivation Statement & Background
              </label>
              <textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                rows={4}
                placeholder="Explain why you want to work with this lab, what specific papers or problems interest you, and your relevant coursework/projects..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Demonstrated Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Python, PyTorch, C++, Linear Algebra"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Available Weekly Hours
                </label>
                <input
                  type="number"
                  min={5}
                  max={40}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsApplyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Submit Research Application
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
