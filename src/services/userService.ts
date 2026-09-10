import { User, UserRole, UserStatus } from "../types";
import { api } from "./api";

export type ManagedUser = User;

export async function listUsers(role?: UserRole): Promise<ManagedUser[]> {
  const query = role ? `?role=${encodeURIComponent(role)}` : "";
  return await api<ManagedUser[]>(`/api/users${query}`);
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified?: boolean;
  status?: UserStatus;
  companyName?: string;
}

export async function createUser(payload: CreateUserPayload): Promise<ManagedUser> {
  return await api<ManagedUser>("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  isVerified?: boolean;
  status?: UserStatus;
  companyName?: string;
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload
): Promise<ManagedUser> {
  return await api<ManagedUser>(`/api/users/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(id: string): Promise<void> {
  await api<{ ok: boolean }>(`/api/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}