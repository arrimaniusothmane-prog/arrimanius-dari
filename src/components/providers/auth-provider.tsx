"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { User } from "@/types";
import * as authService from "@/services/authService";
import type {
  LoginResult,
  ProfileUpdates,
  RegisterInput,
} from "@/services/authService";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (input: RegisterInput) => Promise<User>;
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
    const result = await authService.login(email, password);
    if (result.ok) setUser(result.user);
    return result;
  }, []);

  const register = useCallback(
    async (input: RegisterInput) => {
      const u = await authService.register(input);
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
