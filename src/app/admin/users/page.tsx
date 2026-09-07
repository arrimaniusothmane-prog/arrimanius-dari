"use client";

import { useState } from "react";
import { Search, BadgeCheck, ShieldAlert, UserRoundCog } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockUsers, mockProperties } from "@/data/properties";
import { UserRole } from "@/types";
import type { User } from "@/types";
import { formatDate, cn } from "@/lib/utils";

type AdminUser = User & { status: "ACTIF" | "SUSPENDU" };

const roleLabel: Record<UserRole, string> = {
  [UserRole.BUYER]: "Acheteur",
  [UserRole.SELLER]: "Vendeur",
  [UserRole.AGENT]: "Agent",
  [UserRole.ADMIN]: "Administrateur",
};

const roleBadgeClass: Record<UserRole, string> = {
  [UserRole.BUYER]: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  [UserRole.SELLER]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [UserRole.AGENT]: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  [UserRole.ADMIN]: "bg-gold/20 text-gold",
};

const demoUsers: AdminUser[] = [
  {
    id: "agent-1",
    name: "Salma Berrada",
    email: "salma@darestimate.ma",
    phone: "+212 6 55 10 20 30",
    avatar: "",
    role: UserRole.AGENT,
    createdAt: "2025-10-02T09:00:00Z",
    isVerified: true,
    companyName: "Berrada Immobilier",
    status: "ACTIF",
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
    companyName: "Tazi Conseils",
    status: "SUSPENDU",
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
  },
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const initialUsers: AdminUser[] = [
  ...mockUsers.map((u) => ({ ...u, status: "ACTIF" as const })),
  ...demoUsers,
];

function propertyCount(userId: string) {
  // Only sellers/agents have "properties"; count by sellerId for a realistic metric
  return mockProperties.filter((p) => p.sellerId === userId).length;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const active = users.filter((u) => u.status === "ACTIF").length;
  const suspended = users.length - active;

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "ACTIF" ? "SUSPENDU" : "ACTIF" }
          : u
      )
    );
  };

  return (
    <div>
      <DashboardHeader
        title="Utilisateurs"
        subtitle="Gérez les comptes de la plateforme DarEstate."
      />

      {/* Summary chips */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Total</span>
          <span className="font-display text-base font-semibold">{users.length}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <UserRoundCog className="size-4 text-emerald-600" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Actifs</span>
          <span className="font-display text-base font-semibold">{active}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <ShieldAlert className="size-4 text-red-500" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Suspendus</span>
          <span className="font-display text-base font-semibold">{suspended}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email…"
            className="h-10 rounded-xl pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-4 font-medium">Utilisateur</th>
              <th className="px-5 py-4 font-medium">Rôle</th>
              <th className="px-5 py-4 font-medium">Contact</th>
              <th className="px-5 py-4 font-medium">Vérifié</th>
              <th className="px-5 py-4 font-medium">Inscription</th>
              <th className="px-5 py-4 font-medium">Statut</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage src={u.avatar || undefined} alt={u.name} />
                      <AvatarFallback className="bg-sand text-gold">{initials(u.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge className={cn("shrink-0 border-transparent", roleBadgeClass[u.role])}>
                    {roleLabel[u.role]}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  <p className="whitespace-nowrap">{u.phone}</p>
                  {propertyCount(u.id) > 0 && (
                    <p className="text-xs text-gold">{propertyCount(u.id)} bien{propertyCount(u.id) > 1 ? "s" : ""}</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  {u.isVerified ? (
                    <BadgeCheck className="size-5 text-emerald-500" />
                  ) : (
                    <span className="inline-block size-5 rounded-full border border-border bg-muted" title="Non vérifié" />
                  )}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">{formatDate(u.createdAt)}</td>
                <td className="px-5 py-4">
                  <Badge
                    className={cn(
                      "shrink-0 border-transparent",
                      u.status === "ACTIF"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                    )}
                  >
                    {u.status === "ACTIF" ? "Actif" : "Suspendu"}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    size="sm"
                    variant={u.status === "ACTIF" ? "outline" : "default"}
                    className={
                      u.status === "ACTIF"
                        ? "rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        : "rounded-full bg-emerald-600 text-white hover:bg-emerald-600/90"
                    }
                    onClick={() => toggleStatus(u.id)}
                  >
                    {u.status === "ACTIF" ? "Suspendre" : "Activer"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 lg:hidden">
        {filtered.map((u) => (
          <div key={u.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={u.avatar || undefined} alt={u.name} />
                  <AvatarFallback className="bg-sand text-gold">{initials(u.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{u.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <Badge className={cn("shrink-0 border-transparent", roleBadgeClass[u.role])}>
                {roleLabel[u.role]}
              </Badge>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span>{u.phone}</span>
              <span className="flex items-center gap-1">
                Vérifié {u.isVerified ? <BadgeCheck className="size-4 text-emerald-500" /> : <span className="inline-block size-3.5 rounded-full border border-border bg-muted" />}
              </span>
              <span>Inscrit le {formatDate(u.createdAt)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
              <Badge
                className={cn(
                  "shrink-0 border-transparent",
                  u.status === "ACTIF"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                    : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                )}
              >
                {u.status === "ACTIF" ? "Actif" : "Suspendu"}
              </Badge>
              <Button
                size="sm"
                variant={u.status === "ACTIF" ? "outline" : "default"}
                className={
                  u.status === "ACTIF"
                    ? "rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    : "rounded-full bg-emerald-600 text-white hover:bg-emerald-600/90"
                }
                onClick={() => toggleStatus(u.id)}
              >
                {u.status === "ACTIF" ? "Suspendre" : "Activer"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
          Aucun utilisateur ne correspond à votre recherche.
        </div>
      )}
    </div>
  );
}
