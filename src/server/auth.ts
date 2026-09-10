import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { User, UserRole } from "../types";
import {
  ADMIN_CONTROL_EMAIL,
  readUsers,
  writeUsers,
  toPublicUser,
  findUserByEmail,
  findUserById,
  normalizePhone,
  ServerUser,
} from "./db";
import {
  nameError,
  emailError,
  passwordError,
  phoneError,
  cinError,
  companyError,
} from "../lib/validation";

export const SESSION_COOKIE = "darestimate_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function withSession(res: NextResponse, userId: string): NextResponse {
  res.cookies.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

export function clearSession(res: NextResponse): NextResponse {
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

export async function getSessionUser(): Promise<ServerUser | null> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  return findUserById(id) ?? null;
}

export function isMainAdmin(user: ServerUser): boolean {
  return (
    user.role === UserRole.ADMIN &&
    user.email.trim().toLowerCase() === ADMIN_CONTROL_EMAIL
  );
}

export async function requireAdmin(): Promise<ServerUser> {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isMainAdmin(sessionUser)) {
    throw new ApiError("Accès refusé : réservé à l'administrateur.", 403);
  }
  return sessionUser;
}

export async function authenticate(
  email: string,
  password: string
): Promise<ServerUser> {
  const user = findUserByEmail(email);
  if (!user)
    throw new ApiError(
      "Adresse email introuvable. Vérifiez vos informations.",
      401
    );
  if (user.status === "SUSPENDU")
    throw new ApiError(
      "Ce compte a été suspendu. Contactez l'administrateur pour le restaurer.",
      403
    );
  if (!isMainAdmin(user))
    throw new ApiError(
      "Accès restreint : seul le compte administrateur peut se connecter.",
      403
    );
  if (user.password !== password)
    throw new ApiError("Mot de passe incorrect.", 401);
  return user;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  companyName?: string;
  cin?: string;
}

function validateRegistration(input: RegisterInput): string | null {
  const nameErr = nameError(input.name);
  if (nameErr) return nameErr;
  const emailErr = emailError(input.email);
  if (emailErr) return emailErr;
  if (input.email.trim().toLowerCase() === ADMIN_CONTROL_EMAIL)
    return "Cette adresse email ne peut pas être utilisée.";
  const passwordErr = passwordError(input.password);
  if (passwordErr) return passwordErr;
  if (input.phone) {
    const phoneErr = phoneError(input.phone);
    if (phoneErr) return phoneErr;
  }
  const isProfessional =
    input.role === UserRole.SELLER || input.role === UserRole.AGENT;
  if (isProfessional) {
    const companyErr = companyError(input.companyName ?? "");
    if (companyErr) return companyErr;
    const cinErr = cinError(input.cin ?? "");
    if (cinErr) return cinErr;
  }
  return null;
}

export function registerUser(input: RegisterInput): User {
  const validationError = validateRegistration(input);
  if (validationError) throw new ApiError(validationError);

  const normalizedEmail = input.email.trim().toLowerCase();
  const normalizedPhone = input.phone ? normalizePhone(input.phone) : "";

  if (findUserByEmail(normalizedEmail))
    throw new ApiError(
      "Cette adresse email est déjà utilisée. Essayez de vous connecter."
    );

  if (normalizedPhone) {
    const phoneTaken = readUsers().some(
      (u) => u.phone && normalizePhone(u.phone) === normalizedPhone
    );
    if (phoneTaken)
      throw new ApiError(
        "Ce numéro de téléphone est déjà associé à un compte."
      );
  }

  const isProfessional =
    input.role === UserRole.SELLER || input.role === UserRole.AGENT;

  const newUser: ServerUser = {
    id: `user-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone ?? "",
    avatar: "",
    role: input.role,
    createdAt: new Date().toISOString(),
    isVerified: false,
    status: "ACTIF",
    companyName: input.companyName?.trim() || undefined,
    licenseNumber: isProfessional
      ? input.cin?.trim().toUpperCase()
      : undefined,
    password: input.password,
  };
  writeUsers([...readUsers(), newUser]);
  return toPublicUser(newUser);
}

export function updateUserRecord(
  id: string,
  patch: {
    name?: string;
    email?: string;
    phone?: string;
    role?: UserRole;
    isVerified?: boolean;
    status?: "ACTIF" | "SUSPENDU";
    companyName?: string;
    avatar?: string;
    location?: string;
    bio?: string;
    licenseNumber?: string;
  }
): User {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) throw new ApiError("Utilisateur introuvable.", 404);

  if (patch.email !== undefined) {
    const normalized = patch.email.trim().toLowerCase();
    const duplicate = users.some(
      (u, i) => i !== index && u.email.trim().toLowerCase() === normalized
    );
    if (duplicate)
      throw new ApiError("Cette adresse email est déjà utilisée.");
  }

  const updated: ServerUser = {
    ...users[index],
    ...patch,
  };
  if (patch.email !== undefined) updated.email = patch.email.trim();
  users[index] = updated;
  writeUsers(users);
  return toPublicUser(updated);
}

export interface AdminCreateInput {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified?: boolean;
  status?: "ACTIF" | "SUSPENDU";
  companyName?: string;
  password?: string;
}

export function createUserByAdmin(input: AdminCreateInput): User {
  const nameErr = nameError(input.name);
  if (nameErr) throw new ApiError(nameErr);
  const emailErr = emailError(input.email);
  if (emailErr) throw new ApiError(emailErr);
  if (findUserByEmail(input.email))
    throw new ApiError("Cette adresse email est déjà utilisée.");

  const newUser: ServerUser = {
    id: `user-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() ?? "",
    avatar: "",
    role: input.role,
    createdAt: new Date().toISOString(),
    isVerified: input.isVerified ?? false,
    status: input.status ?? "ACTIF",
    companyName: input.companyName?.trim() || undefined,
    password: input.password ?? "demo1234",
  };
  writeUsers([...readUsers(), newUser]);
  return toPublicUser(newUser);
}

export function deleteUserRecord(id: string): void {
  if (id === "admin-control" || id === "admin-1")
    throw new ApiError("Le compte administrateur principal ne peut pas être supprimé.", 403);
  const users = readUsers();
  const next = users.filter((u) => u.id !== id);
  if (next.length === users.length)
    throw new ApiError("Utilisateur introuvable.", 404);
  writeUsers(next);
}