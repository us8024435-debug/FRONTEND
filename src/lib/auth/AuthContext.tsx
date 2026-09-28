"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { AgentRole } from "@/lib/types";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AgentRole;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  isAuthenticated: boolean;
  logout: () => void;
}

const mockAdminUser: AuthUser = {
  id: "agent_001",
  name: "Arjun Mehta",
  email: "arjun@mindclub.com",
  role: "admin",
  avatarUrl: undefined,
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(mockAdminUser);

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: !!user,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
