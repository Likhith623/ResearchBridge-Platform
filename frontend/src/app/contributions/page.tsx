"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  Plus,
  Briefcase,
  FileCheck,
  Award,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ResearchProject, StudentContribution } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

export default function ContributionsPage() {
  const { user, role } = useAuth();
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [taskName, setTaskName] = useState("");
  const [deliverableSummary, setDeliverableSummary] = useState("");
  const [hoursLogged, setHoursLogged] = useState(10);
  const [isLogging, setIsLogging] = useState(false);
  const [loggedItems, setLoggedItems] = useState<StudentContribution[]>([
    {
      id: "demo-contrib-1",
      student_id: user?.id || "00000000-0000-0000-0000-000000000003",
      project_id: "demo-proj-1",
      task_name: "Asynchronous API & Database Benchmarking",
      deliverable_summary: "Designed stress-test harness executing 500 req/sec benchmark across distributed worker nodes with 99th percentile latency metrics.",
      hours_logged: 15,
      verified_by_professor: true,
      created_at: new Date().toISOString(),
      project_title: "High-Throughput Distributed Storage",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const projs = await api.getProjects();
        const safeProjs = Array.isArray(projs) ? projs : [];
        setProjects(safeProjs);
        if (safeProjs.length > 0) {
          setSelectedProjectId(safeProjs[0].id);
        }

        const studentId = user?.id || "00000000-0000-0000-0000-000000000003";
        try {
          const portfolio = await api.getContributionPortfolio(studentId);
          if (portfolio && Array.isArray(portfolio.verified_tasks) && portfolio.verified_tasks.length > 0) {
            setLoggedItems(portfolio.verified_tasks.map((t: any) => ({
              ...t,
              verified_by_professor: t.status === "verified" || !!t.verified_by_professor,
            })));
          }
        } catch {
          // Keep demo seed if portfolio not yet populated
        }
      } catch (err) {
        console.error("Failed to load projects for contribution logging:", err);
      }
    }
    loadData();
  }, [user]);

  const handleLogContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim() || !deliverableSummary.trim() || !selectedProjectId) return;

    setIsLogging(true);
    try {
      const created = await api.logContribution({
        project_id: selectedProjectId,
        task_name: taskName,
        deliverable_summary: deliverableSummary,
        hours_logged: Number(hoursLogged),
      });

      const matchedProj = projects.find((p) => p.id === selectedProjectId);
      setLoggedItems((prev) => [
        { 
          ...created, 
          project_title: matchedProj?.title || "Research Project",
          verified_by_professor: created.status === "verified" || !!created.verified_by_professor,
        },
        ...(Array.isArray(prev) ? prev : []),
      ]);
      setIsModalOpen(false);
      setTaskName("");
      setDeliverableSummary("");
    } catch (err: any) {
      alert(err.message || "Failed to log contribution");
    } finally {
      setIsLogging(false);
    }
  };

  const safeLoggedItems = Array.isArray(loggedItems) ? loggedItems : [];
  const totalHours = safeLoggedItems.reduce((acc, curr) => acc + (curr.hours_logged || 0), 0);
  const verifiedCount = safeLoggedItems.filter((i) => i.verified_by_professor || (i as any).status === "verified").length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Verified Research Deliverables</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Contribution &amp; Impact Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build an immutable, verifiable academic record of completed research tasks, technical deliverables, and faculty-confirmed laboratory hours.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="text-xs gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Research Deliverable</span>
        </Button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-600">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Research Hours
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalHours} hrs</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-600">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Faculty Verified Deliverables
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{verifiedCount}</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-teal-600">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Research Projects
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {new Set(safeLoggedItems.map((i) => i.project_id)).size}
          </p>
        </Card>
      </div>

      {/* Contributions Timeline List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Verified Deliverables Transcript</CardTitle>
          <CardDescription className="text-xs">
            Chronological academic record certified by supervising faculty
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100 p-0">
          {safeLoggedItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No research deliverables recorded yet. Click "Log Research Deliverable" above to start your verified record.
            </div>
          ) : (
            safeLoggedItems.map((item) => (
              <div key={item.id} className="p-5 space-y-2 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.task_name}
                    </h3>
                    <Badge variant={item.verified_by_professor ? "success" : "warning"} className="text-[10px]">
                      {item.verified_by_professor ? "Faculty Certified" : "Pending Review"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{item.hours_logged} hours</span>
                    <span>•</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.deliverable_summary}
                </p>

                {item.project_title && (
                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-blue-600 font-medium">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                    <span>{item.project_title}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Log Contribution Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Completed Research Deliverable"
        description="Record technical progress, datasets processed, or software components shipped."
        maxWidth="md"
      >
        <form onSubmit={handleLogContribution} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Associated Research Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50"
              required
            >
              {(Array.isArray(projects) ? projects : []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Task / Milestone Name
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g. Implemented Custom CUDA FlashAttention Kernel"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Deliverable Summary &amp; Results
            </label>
            <textarea
              value={deliverableSummary}
              onChange={(e) => setDeliverableSummary(e.target.value)}
              rows={3}
              placeholder="Detail benchmarks, pull request links, experimental error bounds, or papers drafted..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Hours Dedicated
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={hoursLogged}
              onChange={(e) => setHoursLogged(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50"
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLogging}>
              Log Milestone
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
