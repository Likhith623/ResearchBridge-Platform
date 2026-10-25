"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  UserCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  Shield,
  BookOpen,
  Menu,
  X,
  Mail,
  Lock,
  UserPlus,
} from "lucide-react";
import { useAuth, DEMO_PERSONAS } from "@/context/AuthContext";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types/api";

export function Navbar() {
  const { user, role, activePersona, switchPersona, signInWithEmail, signUpWithEmail, signOut } = useAuth();
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Custom Email Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [authRole, setAuthRole] = useState<UserRole>("student");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmittingAuth(true);

    try {
      if (authMode === "login") {
        const res = await signInWithEmail(authEmail, authPassword);
        if (!res.success) {
          setAuthError(res.error || "Failed to sign in");
        } else {
          setIsAuthModalOpen(false);
          setAuthPassword("");
        }
      } else {
        const res = await signUpWithEmail(authEmail, authPassword, authFullName, authRole);
        if (!res.success) {
          setAuthError(res.error || "Failed to create account");
        } else {
          setIsAuthModalOpen(false);
          setAuthPassword("");
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication error occurred");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", roles: ["student", "professor", "admin"] },
    { name: "Faculty Directory", href: "/professors", roles: ["student", "professor", "admin"] },
    { name: "Research Openings", href: "/projects", roles: ["student", "professor", "admin"] },
    { name: "Talent Matcher", href: "/talent-matcher", roles: ["professor", "admin", "student"] },
    { name: "Skill Passport", href: "/skills", roles: ["student", "professor", "admin"] },
    { name: "Idea Pipeline", href: "/ideas", roles: ["student", "professor", "admin"] },
    { name: "Team Composer", href: "/teams", roles: ["professor", "admin"] },
    { name: "Contributions", href: "/contributions", roles: ["student", "professor", "admin"] },
    { name: "Collab Graph", href: "/collaboration-graph", roles: ["student", "professor", "admin"] },
    { name: role === "professor" ? "Student Applications" : "My Applications", href: "/requests", roles: ["student", "professor", "admin"] },
    { name: "Messages & Collab", href: "/messages", roles: ["student", "professor", "admin"] },
    { name: "Paper Library", href: "/documents", roles: ["student", "professor", "admin"] },
    { name: "Admin Governance", href: "/admin", roles: ["admin"] },
  ];

  const permittedNav = navigation.filter(
    (item) => !item.roles || item.roles.includes(role || "student")
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity, Mobile Hamburger, & Campus Pill */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-all">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                Research<span className="text-blue-600">Bridge</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-semibold tracking-wider">
                ACADEMIC NETWORK
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100/90 text-slate-600 text-[11px] font-medium border border-slate-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Stanford University Live</span>
          </div>
        </div>

        {/* Right: Controls & User Profile */}
        <div className="flex items-center gap-3">
          {/* Persona Switcher Dropdown (Real Seeded Accounts) */}
          {/* Persona Switcher / Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-slate-50/90 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                title="Switch demo persona for testing"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Role:</span>
                <span className="font-semibold text-slate-900" suppressHydrationWarning>
                  {mounted ? (activePersona?.name || user?.full_name || "Alice Chen") : "Alice Chen"}
                </span>
                <Badge
                  variant={
                    role === "admin"
                      ? "destructive"
                      : role === "professor"
                      ? "teal"
                      : "default"
                  }
                  withDot
                  className="text-[9px] px-1.5 py-0 capitalize hidden sm:inline-flex"
                >
                  {role}
                </Badge>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isPersonaOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setIsPersonaOpen(false)}
                >
                  <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Quick Demo Roles
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Switch accounts instantly
                      </p>
                    </div>
                    <Link
                      href="/login"
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Login Page →
                    </Link>
                  </div>
                  {DEMO_PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => switchPersona(p.id)}
                      className={`w-full text-left px-3.5 py-2 flex items-start gap-2.5 text-xs hover:bg-slate-50 transition-colors cursor-pointer ${
                        activePersona?.id === p.id ? "bg-blue-50/60" : ""
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        {p.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900 truncate">
                            {p.name}
                          </span>
                          <Badge
                            variant={
                              p.role === "admin"
                                ? "destructive"
                                : p.role === "professor"
                                ? "teal"
                                : "default"
                            }
                            className="text-[9px] px-1.5 py-0 capitalize"
                          >
                            {p.role}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {p.title}
                        </p>
                      </div>
                    </button>
                  ))}

                  {/* Email Sign-In / Register Option */}
                  <div className="p-2 border-t border-slate-100 bg-slate-50/80 space-y-1.5">
                    <Link
                      href="/login"
                      className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Role Portal / Custom Login</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="primary" className="text-xs gap-1.5 shadow-xs">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Sign In / Choose Role</span>
              </Button>
            </Link>
          )}

          {/* Notifications Center */}
          <NotificationCenter />

          {/* User Logout Button */}
          {user && (
            <>
              <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

              <button
                onClick={async () => {
                  await signOut();
                  window.location.href = "/login";
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-rose-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-medium transition-colors cursor-pointer"
                title="Sign out of account"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 px-4 py-3 shadow-lg animate-in fade-in slide-in-from-top duration-150">
          <nav className="space-y-1">
            {permittedNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Custom Email / Password Authentication Modal */}
      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title={authMode === "login" ? "Sign In to ResearchBridge" : "Create University Account"}
        description={
          authMode === "login"
            ? "Enter your academic email and password to access your persistent research profile."
            : "Register as an undergraduate researcher, graduate student, or faculty principal investigator."
        }
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-slate-200 pb-2 gap-4">
            <button
              onClick={() => {
                setAuthMode("login");
                setAuthError(null);
              }}
              className={`pb-1 font-semibold transition-colors cursor-pointer ${
                authMode === "login"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode("register");
                setAuthError(null);
              }}
              className={`pb-1 font-semibold transition-colors cursor-pointer ${
                authMode === "register"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Register New Account
            </button>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 leading-relaxed">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            {authMode === "register" && (
              <>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    placeholder="e.g. Dr. Maya Lin or Alex Rivera"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Select Academic Role
                  </label>
                  <select
                    value={authRole}
                    onChange={(e) => setAuthRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50"
                  >
                    <option value="student">Student / Research Scholar</option>
                    <option value="professor">Professor / Principal Investigator</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="yourname@stanford.edu"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50/50"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAuthModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmittingAuth}>
                {authMode === "login" ? "Sign In" : "Create Account"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </header>
  );
}
