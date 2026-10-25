"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  MessageSquare,
  User,
  ArrowRight,
  Filter,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ResearchRequest } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

export default function RequestsPage() {
  const { role, user } = useAuth();
  const [requests, setRequests] = useState<ResearchRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ResearchRequest | null>(null);

  // Decision Modal State (Professor)
  const [decisionModal, setDecisionModal] = useState<{
    type: "accept" | "reject" | "info" | "withdraw";
    requestId: string;
  } | null>(null);
  const [decisionNotes, setDecisionNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await api.getResearchRequests();
      setRequests(Array.isArray(data) ? data : (data as any)?.items || []);
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [role, user]);

  const handleDecision = async () => {
    if (!decisionModal) return;
    setIsProcessing(true);
    try {
      if (decisionModal.type === "accept") {
        await api.acceptRequest(decisionModal.requestId, decisionNotes);
      } else if (decisionModal.type === "reject") {
        await api.rejectRequest(decisionModal.requestId, decisionNotes);
      } else if (decisionModal.type === "info") {
        await api.requestInfo(decisionModal.requestId, decisionNotes || "Please provide your transcript and GitHub profile.");
      } else if (decisionModal.type === "withdraw") {
        await api.withdrawRequest(decisionModal.requestId);
      }
      setDecisionModal(null);
      setDecisionNotes("");
      loadRequests();
    } catch (err: any) {
      alert(err.message || "Failed to update application status");
    } finally {
      setIsProcessing(false);
    }
  };

  const statusVariantMap: Record<string, "success" | "warning" | "destructive" | "default" | "secondary"> = {
    accepted: "success",
    submitted: "default",
    under_review: "default",
    needs_information: "warning",
    rejected: "destructive",
    withdrawn: "secondary",
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {role === "professor"
            ? "Student Research Applications & Decisions"
            : "My Research Collaboration Inquiries"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {role === "professor"
            ? "Review applicants, examine demonstrated technical skills, request clarifications, and accept laboratory members."
            : "Track real-time evaluation status, professor feedback, and decision history."}
        </p>
      </div>

      {/* Requests Table / Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            All Applications ({(Array.isArray(requests) ? requests : []).length})
          </CardTitle>
          <CardDescription className="text-xs">
            Persistent records synchronized with university research governance
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100 p-0">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Loading research requests...
            </div>
          ) : (Array.isArray(requests) ? requests : []).length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No research applications found.
            </div>
          ) : (
            (Array.isArray(requests) ? requests : []).map((req) => (
              <div
                key={req.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1.5 min-w-0 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {req.subject}
                    </h3>
                    <Badge
                      variant={statusVariantMap[req.status] || "default"}
                      className="text-[10px] capitalize"
                    >
                      {(req.status || "submitted").replace(/_/g, " ")}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {req.motivation_statement}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>
                      {role === "professor"
                        ? `Applicant: ${req.student_name || "Student"}`
                        : `Supervisor: ${req.professor_name || "Faculty Supervisor"}`}
                    </span>
                    <span>•</span>
                    <span>{req.proposed_availability_hours} hrs/week</span>
                    <span>•</span>
                    <span>{formatDate(req.created_at)}</span>
                  </div>

                  {Array.isArray(req.student_skills) && req.student_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {req.student_skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions depending on Role and Status */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link href="/messages">
                    <Button size="sm" variant="outline" className="text-xs gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </Button>
                  </Link>

                  {role === "professor" && req.status !== "accepted" && req.status !== "rejected" && req.status !== "withdrawn" && (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() =>
                          setDecisionModal({ type: "accept", requestId: req.id })
                        }
                        className="text-xs bg-emerald-600 hover:bg-emerald-700"
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          setDecisionModal({ type: "info", requestId: req.id })
                        }
                        className="text-xs"
                      >
                        Req Info
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          setDecisionModal({ type: "reject", requestId: req.id })
                        }
                        className="text-xs"
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {role === "student" && req.status !== "withdrawn" && req.status !== "rejected" && req.status !== "accepted" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setDecisionModal({ type: "withdraw", requestId: req.id })
                      }
                      className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      Withdraw
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Decision / Action Confirmation Modal */}
      <Modal
        isOpen={!!decisionModal}
        onClose={() => setDecisionModal(null)}
        title={
          decisionModal?.type === "accept"
            ? "Accept Collaboration Application"
            : decisionModal?.type === "reject"
            ? "Decline Research Application"
            : decisionModal?.type === "info"
            ? "Request Additional Information from Student"
            : "Withdraw Research Application"
        }
        description="Provide optional academic notes to accompany this official status change."
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              {decisionModal?.type === "info" ? "Questions for Student" : "Decision Notes"}
            </label>
            <textarea
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              rows={3}
              placeholder={
                decisionModal?.type === "accept"
                  ? "e.g. Welcome to the lab! Please join our weekly meeting."
                  : decisionModal?.type === "info"
                  ? "e.g. Please link your GitHub repository or relevant coursework grades."
                  : "Notes for student..."
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDecisionModal(null)}
            >
              Cancel
            </Button>
            <Button
              variant={
                decisionModal?.type === "reject" || decisionModal?.type === "withdraw"
                  ? "destructive"
                  : "primary"
              }
              size="sm"
              isLoading={isProcessing}
              onClick={handleDecision}
            >
              Confirm Status Change
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
