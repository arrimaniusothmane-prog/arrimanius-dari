import { User, UserRole } from "../types";
import { mockUsers } from "../data/properties";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let currentUser: User | null = null;

export async function login(
  email: string,
  _password: string
): Promise<User | null> {
  await delay(300);
  void _password;
  const user = mockUsers.find((u) => u.email === email);
  if (!user) return null;
  currentUser = user;
  return user;
}

export async function register(
  name: string,
  email: string,
  _password: string,
  role: UserRole
): Promise<User> {
  await delay(300);
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone: "",
    avatar: "",
    role,
    createdAt: new Date().toISOString(),
    isVerified: false,
  };
  currentUser = newUser;
  return newUser;
}

export async function logout(): Promise<void> {
  await delay(100);
  currentUser = null;
}

export async function getCurrentUser(): Promise<User | null> {
  await delay(100);
  if (currentUser) return currentUser;
  const user = mockUsers.find((u) => u.id === "buyer-1") ?? null;
  currentUser = user;
  return user;
}

export interface ProfileUpdates {
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdates
): Promise<User | null> {
  await delay(200);
  const user =
    mockUsers.find((u) => u.id === userId) ??
    (currentUser?.id === userId ? currentUser : null);
  if (!user) return null;
  Object.assign(user, updates);
  currentUser = user;
  return { ...user };
}

export async function sendPasswordReset(email: string): Promise<void> {
  await delay(300);
  void email;
}
