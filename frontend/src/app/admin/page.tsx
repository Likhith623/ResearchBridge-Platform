"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Building,
  Clock,
  History,
  FileCheck,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default function AdminPage() {
  const { role } = useAuth();
  const [pendingProfessors, setPendingProfessors] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [profs, logs] = await Promise.allSettled([
        api.getPendingProfessors(),
        api.getAdminAuditLogs(),
      ]);

      if (profs.status === "fulfilled") {
        setPendingProfessors(Array.isArray(profs.value) ? profs.value : []);
      } else {
        setPendingProfessors([]);
      }
      if (logs.status === "fulfilled") {
        setAuditLogs(Array.isArray(logs.value) ? logs.value : []);
      } else {
        setAuditLogs([]);
      }
    } catch (err) {
      console.error("Admin data load error:", err);
      setPendingProfessors([]);
      setAuditLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [role]);

  const handleApprove = async (id: string) => {
    try {
      await api.approveProfessor(id, { admin_notes: "Institutional credentials verified." });
      setActionSuccess("Professor onboarding request approved!");
      loadAdminData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to approve professor");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.rejectProfessor(id, { admin_notes: "Unable to verify university faculty email." });
      setActionSuccess("Professor onboarding request declined.");
      loadAdminData();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to reject request");
    }
  };

  if (role !== "admin") {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-3">
        <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Administrator Access Required</h2>
        <p className="text-xs text-slate-500">
          Switch to the System Admin persona in the top navigation bar to access this governance module.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          University Research Governance &amp; Administration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review faculty verification credentials, enforce account status policies, and audit platform activity.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Pending Faculty Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                Pending Faculty Verification Requests ({(Array.isArray(pendingProfessors) ? pendingProfessors : []).length})
              </CardTitle>
              <CardDescription className="text-xs">
                Applicants requesting professor privileges requiring administrative credential verification
              </CardDescription>
            </div>
            <Badge variant="warning">Action Required</Badge>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100 p-0">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading requests...</div>
          ) : (Array.isArray(pendingProfessors) ? pendingProfessors : []).length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No faculty onboarding requests pending review. All caught up!
            </div>
          ) : (
            (Array.isArray(pendingProfessors) ? pendingProfessors : []).map((p) => (
              <div key={p.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {p.academic_title || "Professor Applicant"}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {p.institutional_email}
                    </Badge>
                  </div>
                  <p className="text-slate-500">
                    Institution: <strong>{p.institution_name || "Stanford University"}</strong>
                    {p.department_name ? ` • Department: ${p.department_name}` : ""}
                  </p>
                  {p.verification_notes && (
                    <p className="text-slate-600 italic">Notes: "{p.verification_notes}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleApprove(p.id)}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700"
                  >
                    Approve Faculty
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(p.id)}
                    className="text-xs"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <span>Administrative Audit Log</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Immutable security ledger tracking platform decisions and permission changes
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100 p-0">
          {(Array.isArray(auditLogs) ? auditLogs : []).length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No audit log entries recorded yet.
            </div>
          ) : (
            (Array.isArray(auditLogs) ? auditLogs : []).slice(0, 10).map((log, i) => (
              <div key={i} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/50">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900">{log.action}</span>
                  <p className="text-slate-500 text-[11px]">
                    Target: {log.target_table} ({String(log.target_id || "").slice(0, 8)}...)
                  </p>
                </div>
                <span className="text-[10px] text-slate-400">
                  {formatDate(log.created_at)}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
