"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, UserRole } from "@/types/api";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export interface DemoPersona {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  email: string;
  token: string;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Alice Chen",
    role: "student",
    title: "Undergraduate Researcher",
    email: "alice.chen@stanford.edu",
    token: "test-token-00000000-0000-0000-0000-000000000003",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Dr. Alan Turing",
    role: "professor",
    title: "Full Professor of CS",
    email: "alan.turing@stanford.edu",
    token: "test-token-00000000-0000-0000-0000-000000000002",
  },
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "System Admin",
    role: "admin",
    title: "Platform Administrator",
    email: "admin@researchbridge.edu",
    token: "test-token-00000000-0000-0000-0000-000000000001",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "Bob Smith",
    role: "student",
    title: "Master's Candidate",
    email: "bob.smith@stanford.edu",
    token: "test-token-00000000-0000-0000-0000-000000000004",
  },
];

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  token: string | null;
  isLoading: boolean;
  activePersona: DemoPersona | null;
  switchPersona: (personaId: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  token: null,
  isLoading: true,
  activePersona: null,
  switchPersona: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePersona, setActivePersona] = useState<DemoPersona | null>(null);

  const initAuth = async () => {
    setIsLoading(true);
    try {
      // 1. Check if demo persona is stored
      const storedToken = api.getToken();
      const matchedPersona = DEMO_PERSONAS.find((p) => p.token === storedToken);

      if (matchedPersona) {
        api.setToken(matchedPersona.token);
        setToken(matchedPersona.token);
        setActivePersona(matchedPersona);
        try {
          const profile = await api.getAuthMe();
          setUser(profile);
          setRole(profile.role);
        } catch {
          setUser({
            id: matchedPersona.id,
            email: matchedPersona.email,
            role: matchedPersona.role,
            full_name: matchedPersona.name,
            account_status: "active",
            is_active: true,
            institution_name: "Stanford University",
            department_name: matchedPersona.role === "admin" ? "Administration" : "Computer Science",
          });
          setRole(matchedPersona.role);
        }
        setIsLoading(false);
        return;
      }

      // 2. Fall back to Supabase Session
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        api.setToken(data.session.access_token);
        setToken(data.session.access_token);
        try {
          const profile = await api.getAuthMe();
          setUser(profile);
          setRole(profile.role);
        } catch {
          // Keep session token
        }
        setIsLoading(false);
        return;
      }

      // 3. Default to Alice Chen (Student) for a clean immediate experience
      const defaultPersona = DEMO_PERSONAS[0];
      api.setToken(defaultPersona.token);
      setToken(defaultPersona.token);
      setActivePersona(defaultPersona);
      try {
        const profile = await api.getAuthMe();
        setUser(profile);
        setRole(profile.role);
      } catch (e) {
        console.warn("Could not fetch profile for default persona:", e);
        setUser({
          id: defaultPersona.id,
          email: defaultPersona.email,
          role: defaultPersona.role,
          full_name: defaultPersona.name,
          account_status: "active",
          is_active: true,
          institution_name: "Stanford University",
          department_name: "Computer Science",
        });
        setRole(defaultPersona.role);
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const switchPersona = async (personaId: string) => {
    const persona = DEMO_PERSONAS.find((p) => p.id === personaId);
    if (!persona) return;
    setIsLoading(true);
    try {
      api.setToken(persona.token);
      setToken(persona.token);
      setActivePersona(persona);
      try {
        const profile = await api.getAuthMe();
        setUser(profile);
        setRole(profile.role);
      } catch {
        setUser({
          id: persona.id,
          email: persona.email,
          role: persona.role,
          full_name: persona.name,
          account_status: "active",
          is_active: true,
          institution_name: "Stanford University",
          department_name: persona.role === "admin" ? "Administration" : "Computer Science",
        });
        setRole(persona.role);
      }
    } catch (err) {
      console.error("Error switching persona:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    api.setToken(null);
    setToken(null);
    setUser(null);
    setRole(null);
    setActivePersona(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await api.getAuthMe();
      setUser(profile);
      setRole(profile.role);
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isLoading,
        activePersona,
        switchPersona,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
