"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Plus,
  Clock,
  Users,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  TrendingUp,
  ListTree,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ResearchProject } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function ProjectsPage() {
  const { role } = useAuth();
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Create Project Modal (Professor only)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newHours, setNewHours] = useState(10);
  const [newOpenings, setNewOpenings] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBreakingDown, setIsBreakingDown] = useState(false);

  // Application Modal (Student)
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [subject, setSubject] = useState("");
  const [motivation, setMotivation] = useState("");
  const [skills, setSkills] = useState("Python, Machine Learning");
  const [hours, setHours] = useState(12);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);

  // Gap Analysis Modal
  const [gapProject, setGapProject] = useState<ResearchProject | null>(null);
  const [gapData, setGapData] = useState<any>(null);
  const [isLoadingGap, setIsLoadingGap] = useState(false);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProjects({ search: search || undefined });
      setProjects(Array.isArray(data) ? data : (data as any)?.items || []);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenGapAnalysis = async (proj: ResearchProject) => {
    setGapProject(proj);
    setGapData(null);
    setIsLoadingGap(true);
    try {
      const data = await api.getProjectGapAnalysis(proj.id);
      setGapData(data);
    } catch (err: any) {
      alert(err.message || "Failed to analyze preparation gaps");
    } finally {
      setIsLoadingGap(false);
    }
  };

  const handleAIProjectBreakdown = async () => {
    if (!newTitle.trim()) {
      alert("Please enter a research title or hypothesis first.");
      return;
    }
    setIsBreakingDown(true);
    try {
      const res = await api.breakdownProject(newTitle + (newSummary ? `: ${newSummary}` : ""));
      if (res.executive_summary && !newSummary) {
        setNewSummary(res.executive_summary);
      }
      if (res.suggested_openings_count) {
        setNewOpenings(res.suggested_openings_count);
      }
      const tasks = res.recommended_tasks || res.phases || [];
      if (tasks.length > 0) {
        const generatedText = tasks
          .map((t: any, i: number) => {
            const name = t.task_name || t.phase_name || `Milestone ${i + 1}`;
            const role = t.role ? ` [Role: ${t.role}]` : "";
            const weeks = t.estimated_weekly_hours ? ` (${t.estimated_weekly_hours} hrs/wk)` : (t.estimated_weeks ? ` (${t.estimated_weeks} wks)` : "");
            const deliv = t.deliverable || t.deliverables || "Milestone Report";
            const prereqs = Array.isArray(t.prerequisite_skills) ? t.prerequisite_skills.join(", ") : (Array.isArray(t.skills_required) ? t.skills_required.join(", ") : "Scientific Inquiry");
            const desc = t.description ? `\nScope: ${t.description}` : "";
            return `Milestone ${i + 1}: ${name}${role}${weeks}\n• Deliverable: ${deliv}\n• Prerequisites: ${prereqs}${desc}`;
          })
          .join("\n\n");
        setNewDescription(generatedText);
      }
    } catch (err: any) {
      console.warn("AI breakdown error:", err);
    } finally {
      setIsBreakingDown(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createProject({
        title: newTitle,
        summary: newSummary,
        description: newDescription,
        weekly_hours: Number(newHours),
        openings_count: Number(newOpenings),
        status: "open",
        arrangement: "hybrid",
        work_arrangement: "hybrid",
        compensation_type: "unpaid",
      });
      setIsCreateModalOpen(false);
      setNewTitle("");
      setNewSummary("");
      setNewDescription("");
      loadProjects();
    } catch (err: any) {
      alert(err.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    if (motivation.trim().length < 20) {
      alert("Motivation statement must be at least 20 characters.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.createResearchRequest({
        professor_id: selectedProject.professor_id,
        project_id: selectedProject.id,
        subject: subject || `Application for ${selectedProject.title}`,
        motivation_statement: motivation,
        student_skills: skills.split(",").map((s) => s.trim()),
        proposed_availability_hours: Number(hours),
      });
      setApplySuccess("Application successfully submitted to the supervising professor!");
      setTimeout(() => {
        setSelectedProject(null);
        setApplySuccess(null);
      }, 2000);
    } catch (err: any) {
      alert(err.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Funded &amp; Supervised Research Openings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse laboratory projects actively seeking undergraduate and graduate research collaborators.
          </p>
        </div>

        {role === "professor" && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Research Opening</span>
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by project title, methodologies, or research problem..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadProjects()}
          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
        />
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse space-y-3">
              <div className="w-1/2 h-4 bg-slate-200 rounded"></div>
              <div className="w-full h-12 bg-slate-100 rounded"></div>
            </Card>
          ))}
        </div>
      ) : (Array.isArray(projects) ? projects : []).length === 0 ? (
        <Card className="p-12 text-center text-slate-400 text-xs">
          No research openings found. Try adjusting your search query.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Array.isArray(projects) ? projects : []).map((proj) => (
            <Card
              key={proj.id}
              className="p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {proj.title}
                  </h3>
                  <Badge variant="teal" className="text-[10px] shrink-0">
                    {proj.openings_count} Openings
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {proj.summary}
                </p>

                <div className="pt-2 flex flex-wrap gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {proj.weekly_hours} hrs/week
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-slate-400" />
                    {proj.work_arrangement}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <Link
                  href={`/professors/${proj.professor_id}`}
                  className="text-xs text-slate-500 hover:text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Supervisor Profile</span>
                </Link>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenGapAnalysis(proj)}
                    className="text-xs gap-1 border-teal-200 text-teal-700 hover:bg-teal-50"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                    <span>Am I Ready?</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setSelectedProject(proj);
                      setSubject(`Application for: ${proj.title}`);
                    }}
                    className="text-xs"
                  >
                    Apply to Project
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Feature 4: Opportunity Gap Analyzer Modal */}
      <Modal
        isOpen={!!gapProject}
        onClose={() => setGapProject(null)}
        title={`Preparation & Gap Analysis: ${gapProject?.title}`}
        description="Instant diagnostic evaluating prerequisite alignment and concrete steps to qualify."
        maxWidth="lg"
      >
        {isLoadingGap ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Evaluating skill alignment and preparation guidance...
          </div>
        ) : gapData ? (
          <div className="space-y-4 text-xs">
            {/* Readiness Score Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 text-sm">Prerequisite Alignment</span>
                <p className="text-[11px] text-slate-500">Based on your student profile &amp; verified skills</p>
              </div>
              <Badge
                variant={
                  (gapData.readiness_percentage ?? 100) >= 80
                    ? "success"
                    : (gapData.readiness_percentage ?? 100) >= 50
                    ? "warning"
                    : "destructive"
                }
                className="font-bold text-xs px-2.5 py-1"
              >
                {Math.round(gapData.readiness_percentage ?? 85)}% Ready
              </Badge>
            </div>

            {/* Skills Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Qualified Prerequisite Skills
                </span>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(gapData.qualified_skills) && gapData.qualified_skills.length > 0 ? (
                    gapData.qualified_skills.map((s: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-100/80 text-emerald-800 font-medium">
                        ✓ {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">None yet verified</span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1.5">
                <span className="font-bold text-rose-800 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Gaps to Bridge
                </span>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(gapData.missing_skills) && gapData.missing_skills.length > 0 ? (
                    gapData.missing_skills.map((s: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-rose-100/80 text-rose-800 font-medium">
                        Needs {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-emerald-700 font-medium">All core prerequisites met!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Preparation Path Steps */}
            {Array.isArray(gapData.preparation_path) && gapData.preparation_path.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold text-slate-800">Targeted Learning Roadmap:</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {gapData.preparation_path.map((step: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">
                          Step {step.step_number || i + 1}: {step.title}
                        </span>
                        {step.estimated_time && (
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {step.estimated_time}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{step.description}</p>
                      {Array.isArray(step.learning_resources) && step.learning_resources.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {step.learning_resources.map((res: string, idx: number) => (
                            <span key={idx} className="text-[9px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                              📚 {res}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Beginner Tasks */}
            {Array.isArray(gapData.recommended_beginner_tasks) && gapData.recommended_beginner_tasks.length > 0 && (
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1.5">
                <span className="font-bold text-blue-900">Recommended First Deliverables:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-blue-800 text-[11px]">
                  {gapData.recommended_beginner_tasks.map((task: string, i: number) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {gapData.can_reapply !== false ? "You can submit an inquiry with your current experience." : "Review requirements before applying."}
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (gapProject) {
                    setSelectedProject(gapProject);
                    setSubject(`Application for: ${gapProject.title}`);
                  }
                  setGapProject(null);
                }}
              >
                Proceed with Application
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Feature 11: Create Project with Automatic AI Breakdown Modal (Professor) */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Post New Research Project Opening"
        description="Advertise a laboratory project to undergraduate and graduate scholars."
        maxWidth="xl"
      >
        <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Project Title
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Distributed Consensus in Asynchronous Networks"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              One-Sentence Summary
            </label>
            <input
              type="text"
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              placeholder="Brief summary of the research questions and objectives."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-800">
                Full Project Description &amp; Milestones
              </label>
              <button
                type="button"
                onClick={handleAIProjectBreakdown}
                disabled={isBreakingDown}
                className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                <span>{isBreakingDown ? "Decomposing..." : "AI Auto-Breakdown"}</span>
              </button>
            </div>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={5}
              placeholder="Detail the technical stack, data pipelines, expected deliverables, and milestones..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50 font-mono text-[11px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Expected Weekly Hours
              </label>
              <input
                type="number"
                min={5}
                max={40}
                value={newHours}
                onChange={(e) => setNewHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Openings Count
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={newOpenings}
                onChange={(e) => setNewOpenings(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Publish Opening
            </Button>
          </div>
        </form>
      </Modal>

      {/* Apply to Project Modal (Student) */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject ? `Apply to ${selectedProject.title}` : ""}
        description="Submit your background and motivation for this specific laboratory opening."
        maxWidth="lg"
      >
        {applySuccess ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-sm font-bold text-slate-900">{applySuccess}</p>
          </div>
        ) : (
          <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Motivation &amp; Relevant Coursework
              </label>
              <textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                rows={4}
                placeholder="Why are you a strong fit for this project?"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Skills
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Weekly Hours Available
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
                onClick={() => setSelectedProject(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
