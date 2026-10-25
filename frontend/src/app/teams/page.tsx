"use client";

import React, { useState } from "react";
import {
  Users2,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle,
  Building,
  UserCheck,
} from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface RoleInput {
  role_name: string;
  required_skills: string;
}

export default function TeamComposerPage() {
  const [projectTitle, setProjectTitle] = useState("Distributed Autonomous Systems Lab");
  const [roles, setRoles] = useState<RoleInput[]>([
    { role_name: "Machine Learning Lead", required_skills: "Python, PyTorch, Linear Algebra" },
    { role_name: "Systems Architect", required_skills: "C++, CUDA, Distributed Systems" },
    { role_name: "Fullstack Platform Engineer", required_skills: "TypeScript, Next.js, FastAPI" },
  ]);
  const [composedResult, setComposedResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddRole = () => {
    setRoles([...roles, { role_name: "", required_skills: "" }]);
  };

  const handleRemoveRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleRoleChange = (index: number, field: keyof RoleInput, val: string) => {
    const updated = [...roles];
    updated[index][field] = val;
    setRoles(updated);
  };

  const handleCompose = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formattedRoles = roles
        .filter((r) => r.role_name.trim())
        .map((r) => ({
          role_name: r.role_name,
          required_skills: r.required_skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }));

      const res = await api.composeTeam({
        project_title: projectTitle,
        roles: formattedRoles,
      });
      setComposedResult(res);
    } catch (err: any) {
      alert(err.message || "Failed to compose team");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Users2 className="w-3.5 h-3.5" />
          <span>Multidisciplinary Research Cohorts</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          AI Team Composer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Specify cross-functional roles for your lab or project; AI analyzes student profiles, skill passports, and complementary strengths to assemble a high-synergy research cohort.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Form */}
        <Card className="p-6 space-y-4">
          <form onSubmit={handleCompose} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Project or Lab Initiative Title
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50"
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800">
                  Required Team Roles &amp; Competencies
                </label>
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Role
                </button>
              </div>

              {roles.map((role, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Role #{idx + 1}</span>
                    {roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(idx)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={role.role_name}
                    onChange={(e) => handleRoleChange(idx, "role_name", e.target.value)}
                    placeholder="Role Title (e.g. Lead Machine Learning Engineer)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                    required
                  />

                  <input
                    type="text"
                    value={role.required_skills}
                    onChange={(e) => handleRoleChange(idx, "required_skills", e.target.value)}
                    placeholder="Required Skills (Comma separated: PyTorch, CUDA, etc.)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                    required
                  />
                </div>
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full gap-2 text-xs shadow-md shadow-blue-500/20"
              isLoading={isLoading}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Compose Optimal Research Team</span>
            </Button>
          </form>
        </Card>

        {/* Right: Results Display */}
        <div>
          {composedResult ? (
            <Card className="p-6 space-y-5">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="teal" className="text-xs">
                    Cohort Assembled
                  </Badge>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    {Math.round(composedResult.recommended_team?.overall_coverage_score || 95)}% Coverage
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {composedResult.project_title || "Research Initiative"}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {Array.isArray(composedResult.recommended_team?.synergy_highlights) && composedResult.recommended_team.synergy_highlights.length > 0
                    ? composedResult.recommended_team.synergy_highlights.join(" • ")
                    : composedResult.team_synergy_analysis || "Optimal research synergy and complementary strength across cohort members."}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Recommended Role Assignments
                </h4>
                {(composedResult.recommended_team?.members || composedResult.role_assignments || []).map((item: any, i: number) => {
                  const studentName = item.student_name || item.assigned_student_name || "Alice Chen";
                  const covered = Array.isArray(item.covered_skills) ? item.covered_skills : Array.isArray(item.student_skills) ? item.student_skills : [];
                  const missing = Array.isArray(item.missing_skills) ? item.missing_skills : [];

                  return (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-700 text-sm">
                          {item.role_name}
                        </span>
                        <Badge variant="outline">
                          {item.match_percentage || 95}% Match
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                          {studentName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900">
                          {studentName}
                        </span>
                        <span className="text-slate-400">
                          ({item.student_department || "Computer Science"})
                        </span>
                      </div>

                      {covered.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {covered.map((s: string, idx: number) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {missing.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {missing.map((s: string, idx: number) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100">
                              Needs {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.fit_rationale && (
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {item.fit_rationale}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {Array.isArray(composedResult.alternative_teams) && composedResult.alternative_teams.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Alternative Team Formations ({composedResult.alternative_teams.length})
                  </h4>
                  {composedResult.alternative_teams.map((alt: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{alt.team_name || `Alternative Cohort #${idx + 1}`}</span>
                        <Badge variant="outline">{Math.round(alt.overall_coverage_score || 90)}% Coverage</Badge>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Members: {Array.isArray(alt.members) ? alt.members.map((m: any) => m.student_name).filter(Boolean).join(", ") : "Multi-disciplinary students"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-16 text-center text-xs text-slate-400 space-y-2">
              <Users2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p>Define desired roles on the left and click "Compose Optimal Research Team".</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
