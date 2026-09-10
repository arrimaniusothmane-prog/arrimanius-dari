import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { User, UserRole } from "../types";
import { mockUsers } from "../data/properties";

export const DEFAULT_PASSWORD = "demo1234";
export const ADMIN_CONTROL_PASSWORD = "Othmane@123";
export const ADMIN_CONTROL_EMAIL = "arrimaniusothmane@gmail.com";

export type ServerUser = User & { password: string };

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "users.json");

const extraSeed: ServerUser[] = [
  {
    id: "agent-1",
    name: "Salma Berrada",
    email: "salma@darestimate.ma",
    phone: "+212 6 55 10 20 30",
    avatar: "",
    role: UserRole.AGENT,
    createdAt: "2025-10-02T09:00:00Z",
    isVerified: true,
    status: "ACTIF",
    companyName: "Berrada Immobilier",
    password: DEFAULT_PASSWORD,
  },
  {
    id: "buyer-2",
    name: "Karim El Fassi",
    email: "karim@example.com",
    phone: "+212 6 77 88 99 00",
    avatar: "",
    role: UserRole.BUYER,
    createdAt: "2026-01-18T11:00:00Z",
    isVerified: false,
    status: "ACTIF",
    password: DEFAULT_PASSWORD,
  },
  {
    id: "seller-3",
    name: "Nadia Tazi",
    email: "nadia@example.com",
    phone: "+212 6 44 55 66 77",
    avatar: "",
    role: UserRole.SELLER,
    createdAt: "2025-11-28T16:00:00Z",
    isVerified: true,
    status: "SUSPENDU",
    companyName: "Tazi Conseils",
    password: DEFAULT_PASSWORD,
  },
  {
    id: "agent-2",
    name: "Omar Chraibi",
    email: "omar@darestimate.ma",
    phone: "+212 6 33 22 11 00",
    avatar: "",
    role: UserRole.AGENT,
    createdAt: "2025-12-12T10:00:00Z",
    isVerified: true,
    status: "ACTIF",
    password: DEFAULT_PASSWORD,
  },
];

function seed(): ServerUser[] {
  const fromMock: ServerUser[] = mockUsers.map((u) => ({
    ...u,
    status: u.status ?? "ACTIF",
    password:
      u.email.toLowerCase() === ADMIN_CONTROL_EMAIL
        ? ADMIN_CONTROL_PASSWORD
        : DEFAULT_PASSWORD,
  }));
  return [...fromMock, ...extraSeed];
}

function ensureDb(): void {
  if (existsSync(DB_FILE)) return;
  mkdirSync(DB_DIR, { recursive: true });
  writeFileSync(DB_FILE, JSON.stringify(seed(), null, 2), "utf8");
}

export function readUsers(): ServerUser[] {
  ensureDb();
  const raw = readFileSync(DB_FILE, "utf8");
  try {
    return JSON.parse(raw) as ServerUser[];
  } catch {
    const users = seed();
    writeFileSync(DB_FILE, JSON.stringify(users, null, 2), "utf8");
    return users;
  }
}

export function writeUsers(users: ServerUser[]): void {
  mkdirSync(DB_DIR, { recursive: true });
  writeFileSync(DB_FILE, JSON.stringify(users, null, 2), "utf8");
}

export function toPublicUser(user: ServerUser): User {
  const { password: _password, ...safe } = user;
  void _password;
  return safe;
}

export function findUserByEmail(email: string): ServerUser | undefined {
  const needle = email.trim().toLowerCase();
  return readUsers().find((u) => u.email.trim().toLowerCase() === needle);
}

export function findUserById(id: string): ServerUser | undefined {
  return readUsers().find((u) => u.id === id);
}

export function normalizePhone(value: string): string {
  return value.replace(/[\s.\-()]/g, "");
}