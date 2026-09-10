"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  BadgeCheck,
  Flag,
  ScrollText,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockUsers } from "@/data/properties";
import { UserRole } from "@/types";
import type { User } from "@/types";
import { formatDate, cn } from "@/lib/utils";

type VerifyRequest = {
  id: string;
  user: User;
  role: UserRole;
  submittedAt: string;
  note: string;
};

type Report = {
  id: string;
  reason: string;
  reported: User;
  createdAt: string;
  status: "OUVERT" | "RÉSOLU";
};

type SecurityLog = {
  id: string;
  action: string;
  target?: string;
  actor?: string;
  level: "INFO" | "WARNING" | "CRITICAL";
  at: string;
};

const roleLabel: Record<UserRole, string> = {
  [UserRole.BUYER]: "Acheteur",
  [UserRole.SELLER]: "Vendeur",
  [UserRole.AGENT]: "Agent",
  [UserRole.ADMIN]: "Administrateur",
};

const findUser = (id: string): User | undefined =>
  mockUsers.find((u) => u.id === id);

const initialRequests: VerifyRequest[] = [
  {
    id: "vreq-1",
    user: findUser("seller-2")!,
    role: UserRole.SELLER,
    submittedAt: "2026-09-05T10:00:00Z",
    note: "Pièce d'identité + titre de propriété fournis.",
  },
  {
    id: "vreq-2",
    user: {
      id: "agent-1",
      name: "Salma Berrada",
      email: "salma@darestimate.ma",
      phone: "+212 6 55 10 20 30",
      avatar: "",
      role: UserRole.AGENT,
      createdAt: "2025-10-02T09:00:00Z",
      isVerified: false,
      status: "ACTIF",
      companyName: "Berrada Immobilier",
    },
    role: UserRole.AGENT,
    submittedAt: "2026-09-08T14:30:00Z",
    note: "Carte professionnelle n° 01-2345-2025.",
  },
];

const initialReports: Report[] = [
  {
    id: "rep-1",
    reason: "Annonce pouvant être frauduleuse — prix anormalement bas.",
    reported: findUser("seller-2")!,
    createdAt: "2026-09-03T09:00:00Z",
    status: "OUVERT",
  },
  {
    id: "rep-2",
    reason: "Comportement inapproprié dans les messages.",
    reported: {
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
    createdAt: "2026-09-06T16:00:00Z",
    status: "OUVERT",
  },
];

const initialLogs: SecurityLog[] = [
  { id: "log-1", action: "Connexion inhabituelle détectée", target: "buyer-2", actor: "buyer-2", level: "WARNING", at: "2026-09-09T08:12:00Z" },
  { id: "log-2", action: "Annonce signalée", target: "prop-3", actor: "buyer-1", level: "WARNING", at: "2026-09-08T18:40:00Z" },
  { id: "log-3", action: "Compte suspendu", target: "seller-3", actor: "Admin DarEstate", level: "CRITICAL", at: "2026-09-07T11:00:00Z" },
  { id: "log-4", action: "Vérification d'identité approuvée", target: "seller-1", actor: "Admin DarEstate", level: "INFO", at: "2026-09-05T09:30:00Z" },
  { id: "log-5", action: "Tentative de connexion échouée", target: "admin-1", actor: "admin-1", level: "CRITICAL", at: "2026-09-04T22:15:00Z" },
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const levelClass: Record<SecurityLog["level"], string> = {
  INFO: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  WARNING: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  CRITICAL: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

export default function AdminSecurityPage() {
  const [requests, setRequests] = useState<VerifyRequest[]>(initialRequests);
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [busy, setBusy] = useState<string | null>(null);

  const suspendedUsers = mockUsers.filter((u) => u.id === "seller-3");

  const approveRequest = (id: string) => {
    setBusy(id);
    setTimeout(() => {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setBusy(null);
    }, 500);
  };

  const rejectRequest = (id: string) => {
    setBusy(id);
    setTimeout(() => {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setBusy(null);
    }, 500);
  };

  const resolveReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "RÉSOLU" } : r))
    );
  };

  const suspendedCount = suspendedUsers.length;
  const openReports = reports.filter((r) => r.status === "OUVERT").length;
  const warnings = initialLogs.filter((l) => l.level !== "INFO").length;

  return (
    <div>
      <DashboardHeader
        title="Sécurité & Modération"
        subtitle="Surveillez les comptes, les vérifications et les signalements de la plateforme."
      />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <ShieldCheck className="size-5" />
          </div>
          <p className="tnum mt-4 font-display text-2xl font-semibold">{requests.length}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Vérifications en attente</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <ShieldAlert className="size-5" />
          </div>
          <p className="tnum mt-4 font-display text-2xl font-semibold">{suspendedCount}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Comptes suspendus</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
            <Flag className="size-5" />
          </div>
          <p className="tnum mt-4 font-display text-2xl font-semibold">{openReports}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Signalements ouverts</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
            <ScrollText className="size-5" />
          </div>
          <p className="tnum mt-4 font-display text-2xl font-semibold">{warnings}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Alertes (7 jours)</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Verification requests */}
        <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sand text-gold-strong">
              <BadgeCheck className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Demandes de vérification</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Vendeurs et agents en attente d&apos;approbation.
              </p>
            </div>
          </div>

          {requests.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Aucune demande de vérification en attente.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={req.user.avatar || undefined} alt={req.user.name} />
                      <AvatarFallback className="bg-sand text-gold">{initials(req.user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{req.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {req.user.email} · {roleLabel[req.role]}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(req.submittedAt)}
                    </span>
                  </div>
                  <p className="mt-3 rounded-lg bg-sand/50 p-3 text-sm text-muted-foreground">
                    {req.note}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      disabled={busy === req.id}
                      className="rounded-full bg-emerald-600 text-white hover:bg-emerald-600/90"
                      onClick={() => approveRequest(req.id)}
                    >
                      {busy === req.id ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                      Approuver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy === req.id}
                      className="rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                      onClick={() => rejectRequest(req.id)}
                    >
                      <X className="size-4" /> Refuser
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reports */}
        <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <Flag className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Signalements</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Annonces et comptes signalés par les utilisateurs.
              </p>
            </div>
          </div>

          {reports.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Aucun signalement.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {reports.map((rep) => (
                <div key={rep.id} className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={rep.reported.avatar || undefined} alt={rep.reported.name} />
                      <AvatarFallback className="bg-sand text-gold">{initials(rep.reported.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{rep.reported.name}</p>
                      <p className="text-xs text-muted-foreground">{rep.reported.email}</p>
                    </div>
                    <Badge
                      className={cn(
                        "shrink-0 border-transparent",
                        rep.status === "OUVERT"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      )}
                    >
                      {rep.status}
                    </Badge>
                  </div>
                  <p className="mt-3 rounded-lg bg-sand/50 p-3 text-sm text-muted-foreground">
                    {rep.reason}
                  </p>
                  {rep.status === "OUVERT" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 rounded-full text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                      onClick={() => resolveReport(rep.id)}
                    >
                      <Check className="size-4" /> Marquer comme résolu
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Suspended accounts */}
      <section className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <ShieldAlert className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Comptes suspendus</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Accès restreint en attendant une décision.
            </p>
          </div>
        </div>
        {suspendedUsers.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Aucun compte suspendu.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Utilisateur</th>
                  <th className="py-3 pr-4 font-medium">Rôle</th>
                  <th className="py-3 pr-4 font-medium">Email</th>
                  <th className="py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {suspendedUsers.map((u) => (
                  <tr key={u.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarImage src={u.avatar || undefined} alt={u.name} />
                          <AvatarFallback className="bg-sand text-gold">{initials(u.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{roleLabel[u.role]}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{u.email}</td>
                    <td className="py-3 text-right">
                      <Link href="/admin/users">
                        <Button size="sm" variant="outline" className="rounded-full">
                          Gérer
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Activity log */}
      <section className="mt-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
            <ScrollText className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Journal de sécurité</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Dernières actions de sécurité enregistrées.
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {initialLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{log.action}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {log.actor ?? "Système"} · {log.target ?? "—"} · {formatDate(log.at)}
                </p>
              </div>
              <Badge className={cn("shrink-0 border-transparent", levelClass[log.level])}>
                {log.level}
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
