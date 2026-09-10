import { User, UserRole } from "../types";
import { api } from "./api";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  companyName?: string;
  cin?: string;
}

export interface ProfileUpdates {
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  licenseNumber?: string;
}

export type ResetResult =
  | { ok: true; email: string; name: string; password: string }
  | { ok: false; error: string };

export async function sendPasswordReset(email: string): Promise<ResetResult> {
  try {
    const data = await api<{
      ok: true;
      email: string;
      name: string;
      password: string;
    }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return data;
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error ? e.message : "Impossible de réinitialiser, réessayez.",
    };
  }
}

export type LoginResult =
  | { ok: true; user: User }
  | { ok: false; error: string };

export async function login(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const user = await api<User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return { ok: true, user };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error ? e.message : "Impossible de se connecter, réessayez.",
    };
  }
}

export async function register(input: RegisterInput): Promise<User> {
  return await api<User>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function logout(): Promise<void> {
  await api<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await api<User>("/api/auth/me");
  } catch {
    return null;
  }
}

export async function updateProfile(
  _userId: string,
  updates: ProfileUpdates
): Promise<User | null> {
  try {
    return await api<User>("/api/auth/me", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  } catch {
    return null;
  }
}