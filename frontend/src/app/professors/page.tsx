"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  GraduationCap,
  Building,
  BookOpen,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import { api } from "@/lib/api";
import { ProfessorProfile, Department } from "@/types/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<ProfessorProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [appliedProfIds, setAppliedProfIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInitial() {
      try {
        const [profData, deptData, reqData] = await Promise.allSettled([
          api.getProfessors(),
          api.getDepartments(),
          api.getResearchRequests(),
        ]);
        if (profData.status === "fulfilled") setProfessors(profData.value || []);
        if (deptData.status === "fulfilled") setDepartments(deptData.value || []);
        if (reqData.status === "fulfilled") {
          const list = Array.isArray(reqData.value) ? reqData.value : (reqData.value as any)?.items || [];
          setAppliedProfIds(new Set(list.map((r: any) => r.professor_id)));
        }
      } catch (err) {
        console.error("Failed to load professors:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitial();
  }, []);

  const handleSearch = async (overrideDept?: string) => {
    setIsLoading(true);
    const deptToUse = typeof overrideDept === "string" ? overrideDept : selectedDept;
    try {
      const data = await api.getProfessors({
        search: search || undefined,
        department_id: deptToUse || undefined,
      });
      setProfessors(Array.isArray(data) ? data : (data as any)?.items || []);
    } catch (err) {
      console.error("Filter error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProfessors = (Array.isArray(professors) ? professors : []).filter((p: any) => {
    if (availabilityFilter === "open" && !p.open_to_applications) return false;
    if (availabilityFilter === "full" && p.open_to_applications) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Faculty &amp; Principal Investigator Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore verified university researchers, ongoing laboratory grants, publications, and supervision availability.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-white/90">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by faculty name, research interest, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                handleSearch(e.target.value);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50 text-slate-700"
            >
              <option value="">All Departments</option>
              {(Array.isArray(departments) ? departments : []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50 text-slate-700"
            >
              <option value="all">Any Availability</option>
              <option value="open">Open to Applications</option>
              <option value="full">At Full Capacity</option>
            </select>

            <Button size="sm" onClick={() => handleSearch()} className="text-xs">
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse space-y-3">
              <div className="w-1/3 h-4 bg-slate-200 rounded"></div>
              <div className="w-2/3 h-3 bg-slate-200 rounded"></div>
              <div className="w-full h-12 bg-slate-100 rounded"></div>
            </Card>
          ))}
        </div>
      ) : filteredProfessors.length === 0 ? (
        <Card className="p-12 text-center text-slate-400 text-xs">
          No faculty members match your criteria. Try adjusting your search query or department filter.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProfessors.map((prof) => (
            <Card
              key={prof.id}
              hoverable
              className="flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                      {(prof.full_name || prof.profiles?.full_name || "P").charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        {prof.full_name || prof.profiles?.full_name || "Faculty Member"}
                      </h3>
                      <p className="text-xs text-slate-500">{prof.academic_title || prof.title || "Professor"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {appliedProfIds.has(prof.id) && (
                      <Badge variant="teal" className="text-[10px] gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Applied</span>
                      </Badge>
                    )}
                    <Badge
                      variant={prof.open_to_applications ? "success" : "secondary"}
                      className="text-[10px] shrink-0"
                    >
                      {prof.open_to_applications
                        ? "Open to Students"
                        : "Capacity Full"}
                    </Badge>
                  </div>
                </div>

                {(prof.bio || prof.profiles?.bio) && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {prof.bio || prof.profiles?.bio}
                  </p>
                )}

                {/* Laboratory Info & Research Interests */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {prof.lab_name || "Computer Science Research Group"}
                      {prof.office_location ? ` • ${prof.office_location}` : ""}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(prof.research_interests) ? prof.research_interests : []).map((ri: any, idx: number) => (
                      <span
                        key={typeof ri === "string" ? `${ri}-${idx}` : (ri.id || ri.name || idx)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                      >
                        {typeof ri === "string" ? ri : ri.name}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              {/* Card Footer / Action */}
              <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 rounded-b-xl flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center gap-3">
                  <span>
                    Supervising:{" "}
                    <strong className="text-slate-800">
                      {prof.current_supervision_count || 1}/{prof.max_capacity || 4}
                    </strong>
                  </span>
                </div>
                <Link href={`/professors/${prof.id}`}>
                  <Button
                    size="sm"
                    variant={appliedProfIds.has(prof.id) ? "outline" : "primary"}
                    className="text-xs gap-1"
                  >
                    <span>{appliedProfIds.has(prof.id) ? "View Application" : "View Academic Profile"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
