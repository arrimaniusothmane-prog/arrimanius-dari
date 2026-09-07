"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { User, UserRole } from "@/types";
import * as authService from "@/services/authService";
import type { ProfileUpdates } from "@/services/authService";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<User>;
  updateProfile: (updates: ProfileUpdates) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await authService.login(email, password);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, role: UserRole) => {
      const u = await authService.register(name, email, password, role);
      setUser(u);
      return u;
    },
    []
  );

  const updateProfile = useCallback(
    async (updates: ProfileUpdates) => {
      if (!user) return null;
      const updated = await authService.updateProfile(user.id, updates);
      if (updated) setUser(updated);
      return updated;
    },
    [user]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
