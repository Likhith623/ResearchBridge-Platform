"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Sparkles,
  Award,
  Lightbulb,
  Users2,
  CheckCircle,
  Network,
  Send,
  MessageSquare,
  FileText,
  ShieldCheck,
  Building,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { role, user } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["student", "professor", "admin"],
    },
    {
      name: "Faculty Directory",
      href: "/professors",
      icon: Users,
      roles: ["student", "professor", "admin"],
    },
    {
      name: "Research Openings",
      href: "/projects",
      icon: Briefcase,
      roles: ["student", "professor", "admin"],
    },
    {
      name: "Talent Matcher",
      href: "/talent-matcher",
      icon: Sparkles,
      roles: ["professor", "admin", "student"],
    },
    {
      name: "Skill Passport",
      href: "/skills",
      icon: Award,
      roles: ["student", "professor", "admin"],
    },
    {
      name: "Idea Pipeline",
      href: "/ideas",
      icon: Lightbulb,
      roles: ["student", "professor", "admin"],
    },
    {
      name: "Team Composer",
      href: "/teams",
      icon: Users2,
      roles: ["professor", "admin"],
    },
    {
      name: "Contributions",
      href: "/contributions",
      icon: CheckCircle,
      roles: ["student", "professor", "admin"],
    },
    {
      name: "Collab Graph",
      href: "/collaboration-graph",
      icon: Network,
      roles: ["student", "professor", "admin"],
    },
    {
      name: role === "professor" ? "Student Applications" : "My Applications",
      href: "/requests",
      icon: Send,
      roles: ["student", "professor", "admin"],
    },
    {
      name: "Messages & Collab",
      href: "/messages",
      icon: MessageSquare,
      roles: ["student", "professor", "admin"],
    },
    {
      name: "Paper Library",
      href: "/documents",
      icon: FileText,
      roles: ["student", "professor", "admin"],
    },
    {
      name: "Admin Governance",
      href: "/admin",
      icon: ShieldCheck,
      roles: ["admin"],
    },
  ];

  const permittedNav = navigation.filter(
    (item) => !item.roles || item.roles.includes(role || "student")
  );

  return (
    <aside className="w-64 bg-slate-50/70 border-r border-slate-200/80 shrink-0 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-4">
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Academic Hub
          </p>
          <nav className="space-y-1">
            {permittedNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                    isActive
                      ? "bg-blue-600 text-white shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Institutional Context Card at Sidebar Bottom */}
      <div className="p-4 border-t border-slate-200/80 bg-white/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
            <Building className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {user?.institution_name || "Stanford University"}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {user?.department_name || "Computer Science"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
