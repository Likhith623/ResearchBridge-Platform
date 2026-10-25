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
  LogOut,
  UserCheck,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { role, user, signOut } = useAuth();

  const sections = [
    {
      title: "Core Discovery",
      items: [
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
          name: "Paper Library",
          href: "/documents",
          icon: FileText,
          roles: ["student", "professor", "admin"],
        },
      ],
    },
    {
      title: "AI & Intelligence",
      items: [
        {
          name: "Talent Matcher",
          href: "/talent-matcher",
          icon: Sparkles,
          roles: ["professor", "admin", "student"],
          badge: "AI",
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
      ],
    },
    {
      title: "Collaboration",
      items: [
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
      ],
    },
    {
      title: "Governance",
      items: [
        {
          name: "Admin Governance",
          href: "/admin",
          icon: ShieldCheck,
          roles: ["admin"],
          badge: "Admin",
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-50/90 backdrop-blur-md border-r border-slate-200/80 shrink-0 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] select-none">
      <div className="p-4 space-y-6 overflow-y-auto">
        {sections.map((section) => {
          const visibleItems = section.items.filter(
            (item) => !item.roles || item.roles.includes(role || "student")
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                {section.title}
              </p>
              <nav className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group relative",
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20 font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "w-4 h-4 transition-colors shrink-0",
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-blue-600"
                          )}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            "text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-blue-50 text-blue-700 border border-blue-200/60"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Institutional Context & Session Card at Sidebar Bottom */}
      <div className="p-3.5 border-t border-slate-200/80 bg-white/70 backdrop-blur-md space-y-3">
        <div className="flex items-center gap-2.5 p-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {(user?.full_name || "U").charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 truncate" suppressHydrationWarning>
              {user?.full_name || "Guest Scholar"}
            </p>
            <p className="text-[10px] text-slate-400 truncate capitalize flex items-center gap-1" suppressHydrationWarning>
              <span className="font-medium text-blue-600">{role || "Visitor"}</span>
              <span>•</span>
              <span className="truncate">{user?.department_name || "Stanford Univ"}</span>
            </p>
          </div>
        </div>

        {user ? (
          <button
            onClick={async () => {
              await signOut();
              window.location.href = "/login";
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200/80 hover:border-rose-200 hover:bg-rose-50/80 text-slate-500 hover:text-rose-600 text-[11px] font-medium transition-all duration-150 cursor-pointer shadow-2xs"
            title="Sign out of account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-semibold transition-all shadow-sm shadow-blue-500/20"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sign In / Choose Role</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
