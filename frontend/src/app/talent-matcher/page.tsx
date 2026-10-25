"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Users,
  Search,
  CheckCircle,
  AlertCircle,
  Share2,
  Building,
  GraduationCap,
  Send,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ResearchProject } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function TalentMatcherPage() {
  const { role } = useAuth();
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [matcherResult, setMatcherResult] = useState<any>(null);
  const [isLoadingMatcher, setIsLoadingMatcher] = useState(false);

  // Cross-Department Discovery state
  const [crossSkill, setCrossSkill] = useState("Python");
  const [crossResults, setCrossResults] = useState<any>(null);
  const [isSearchingCross, setIsSearchingCross] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        const projs = await api.getProjects();
        const safeProjs = Array.isArray(projs) ? projs : [];
        if (safeProjs.length > 0) {
          setProjects(safeProjs);
          setSelectedProjectId(safeProjs[0].id);
          if (role === "professor" || role === "admin") {
            runAnalysis(safeProjs[0].id);
          } else {
            setMatcherResult(null);
          }
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      }
    }
    loadProjects();
  }, [role]);

  const runAnalysis = async (projId: string) => {
    if (!projId) return;
    setIsLoadingMatcher(true);
    try {
      const data = await api.getTalentMatcher(projId);
      setMatcherResult(data);
    } catch (err) {
      console.error("Talent matcher error:", err);
    } finally {
      setIsLoadingMatcher(false);
    }
  };

  const handleCrossSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crossSkill.trim()) return;
    setIsSearchingCross(true);
    try {
      const data = await api.getCrossDepartmentRecommendations(crossSkill);
      setCrossResults(data);
    } catch (err: any) {
      alert(err.message || "Failed to search cross-department talent");
    } finally {
      setIsSearchingCross(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explainable Candidate Recommendations</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Explainable AI Talent Matcher &amp; Cross-Department Discovery
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Instead of opaque keyword queries, our AI explains exactly why each student is a match, highlights missing prerequisite skills, and uncovers hidden talent across academic departments.
        </p>
      </div>

      {/* Feature 1: Project Talent Matcher */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Lab Opening Talent Matcher
            </h2>
            <p className="text-xs text-slate-500">
              Select an active laboratory project to inspect candidate matches and explanations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                runAnalysis(e.target.value);
              }}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
            >
              {(Array.isArray(projects) ? projects : []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              onClick={() => runAnalysis(selectedProjectId)}
              isLoading={isLoadingMatcher}
              className="text-xs"
            >
              Refresh Match
            </Button>
          </div>
        </div>

        {/* Candidate Match Breakdown List */}
        {matcherResult ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
              <div>
                <span className="font-bold">Project Under Evaluation:</span> {matcherResult.project_title}
              </div>
              <Badge variant="teal">
                {(matcherResult.matched_candidates || matcherResult.candidates || []).length} Candidates Evaluated
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(matcherResult.matched_candidates || matcherResult.candidates || []).map((candidate: any, idx: number) => {
                const studentName = candidate.full_name || candidate.student_name || "Student Researcher";
                const studentDept = candidate.department_name || candidate.student_department || "Computer Science";
                const explanation = candidate.explanation || candidate.fit_explanation || "Strong technical and academic match.";
                const matchedSkills = Array.isArray(candidate.matched_skills) 
                  ? candidate.matched_skills 
                  : Array.isArray(candidate.supporting_skills) 
                  ? candidate.supporting_skills 
                  : [];
                const missingSkills = Array.isArray(candidate.missing_skills) ? candidate.missing_skills : [];

                return (
                  <Card key={idx} className="p-5 space-y-3 border-slate-200 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {studentName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {studentName}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {studentDept}
                          </p>
                        </div>
                      </div>
                      <Badge variant="teal" className="text-xs font-bold">
                        {Math.round(candidate.match_score || 90)}% Match
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <strong className="text-slate-800 block mb-1">Why this student is a fit:</strong>
                      {explanation}
                    </p>

                    <div className="space-y-1.5 text-xs">
                      {matchedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-slate-400 text-[10px] uppercase font-bold mr-1">Matching:</span>
                          {matchedSkills.map((s: string, i: number) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {missingSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          <span className="text-slate-400 text-[10px] uppercase font-bold mr-1">Gap:</span>
                          {missingSkills.map((s: string, i: number) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100 font-medium">
                              Needs {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            {Array.isArray(matcherResult.alternative_candidates) && matcherResult.alternative_candidates.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Alternative / Emerging Potential Matches ({matcherResult.alternative_candidates.length})
                  </h3>
                  <Badge variant="secondary" className="text-[10px]">Interdisciplinary Talents</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {matcherResult.alternative_candidates.map((alt: any, i: number) => {
                    const studentName = alt.full_name || alt.student_name || "Scholar";
                    const studentDept = alt.department_name || alt.student_department || "Engineering";
                    const explanation = alt.explanation || alt.fit_explanation || "Complementary technical foundation.";
                    return (
                      <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900">{studentName}</span>
                            <span className="text-[11px] text-slate-500 block">{studentDept}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            {Math.round(alt.match_score || 85)}% Match
                          </Badge>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : role === "student" ? (
          <div className="p-6 rounded-xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
            <GraduationCap className="w-8 h-8 text-amber-600 mx-auto" />
            <h3 className="text-sm font-semibold text-amber-900">Faculty &amp; Administrator Feature</h3>
            <p className="text-xs text-amber-700 max-w-lg mx-auto">
              Candidate evaluation and explainable talent ranking are restricted to faculty supervisors and administrators. Switch persona to Professor or Admin in the navigation bar to evaluate student cohorts, or explore the Cross-Department Discovery tool below.
            </p>
          </div>
        ) : (
          <div className="text-center py-12 text-xs text-slate-400">
            Select a project above to run the explainable talent matching algorithm.
          </div>
        )}
      </Card>

      {/* Feature 7: Cross-Department Talent Discovery */}
      <Card className="p-6 space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2">
            <Share2 className="w-3.5 h-3.5" />
            <span>Cross-Department Talent Discovery</span>
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Discover Interdisciplinary Researchers
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Surfaces students from non-traditional colleges who hold key technical competencies (e.g. Bioengineering or Physics students proficient in PyTorch or CUDA).
          </p>
        </div>

        <form onSubmit={handleCrossSearch} className="flex gap-2">
          <input
            type="text"
            value={crossSkill}
            onChange={(e) => setCrossSkill(e.target.value)}
            placeholder="Enter required skill (e.g. Python, PyTorch, React, Embedded Systems)..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
            required
          />
          <Button type="submit" size="sm" isLoading={isSearchingCross} className="text-xs">
            Discover Interdisciplinary Talent
          </Button>
        </form>

        {crossResults && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                Found {crossResults.total_cross_dept_found ?? (Array.isArray(crossResults.results) ? crossResults.results.length : Array.isArray(crossResults.candidates) ? crossResults.candidates.length : 0)} Cross-Department Scholars:
              </span>
              <Badge variant="teal">Competency: {crossResults.target_skill || crossSkill}</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Array.isArray(crossResults.results) ? crossResults.results : Array.isArray(crossResults.candidates) ? crossResults.candidates : []).map((cand: any, i: number) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900">{cand.full_name || cand.student_name}</h4>
                      <p className="text-[11px] text-slate-500">{cand.department_name}</p>
                    </div>
                    <Badge variant="teal">
                      {Math.round(cand.match_score || cand.relevance_score || 92)}% Match
                    </Badge>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {cand.interdisciplinary_synergy || "Demonstrated cross-discipline background with strong technical fundamentals."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
