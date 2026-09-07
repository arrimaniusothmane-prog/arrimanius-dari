"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Building2, Sparkles, Inbox, CalendarCheck2, FileCheck, ArrowLeftRight, Wallet, HandCoins } from "lucide-react";
import { DashboardHeader, StatCard } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats, getTransactions } from "@/services/transactionService";
import { mockProperties, mockUsers } from "@/data/properties";
import { TransactionStatus } from "@/types";
import type { DashboardStats, Transaction } from "@/types";
import { formatPrice, formatDate, cn } from "@/lib/utils";

const growthData = [12, 18, 15, 22, 19, 26, 31, 28, 34, 39, 44, 49];

const monthlyLeads = [42, 55, 38, 61, 72, 66];
const monthlyTransactions = [8, 12, 9, 15, 18, 14];
const monthlyLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];

const commissionData = [
  { label: "Jan", value: 42 },
  { label: "Fév", value: 58 },
  { label: "Mar", value: 35 },
  { label: "Avr", value: 76 },
  { label: "Mai", value: 62 },
  { label: "Juin", value: 90 },
];

const txnStatusLabel: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: "En attente",
  [TransactionStatus.COMPLETED]: "Finalisée",
  [TransactionStatus.CANCELLED]: "Annulée",
};

const txnStatusBadge: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [TransactionStatus.COMPLETED]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [TransactionStatus.CANCELLED]: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
};

function propertyTitle(id: string) {
  return mockProperties.find((p) => p.id === id)?.title ?? "Bien";
}
function propertySlug(id: string) {
  return mockProperties.find((p) => p.id === id)?.slug;
}
function userName(id: string) {
  return mockUsers.find((u) => u.id === id)?.name ?? "—";
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getTransactions()])
      .then(([s, t]) => {
        setStats(s);
        setTransactions(t);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxGrowth = Math.max(...growthData);
  const maxCommission = Math.max(...commissionData.map((c) => c.value));
  const maxPair = Math.max(...monthlyLeads, ...monthlyTransactions);

  const recent = [...transactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const chartValue = loading && !stats ? "…" : undefined;

  return (
    <div>
      <DashboardHeader
        title="Administration"
        subtitle="Pilotage de la plateforme DarEstate en temps réel."
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-3">
        <StatCard icon={LayoutDashboard} label="Total utilisateurs" value={chartValue ?? stats?.totalUsers ?? 0} />
        <StatCard icon={Building2} label="Biens actifs" value={chartValue ?? stats?.activeProperties ?? 0} />
        <StatCard icon={Sparkles} label="Nouveaux biens" value={chartValue ?? stats?.newProperties ?? 0} />
        <StatCard icon={Inbox} label="Total leads" value={chartValue ?? stats?.totalLeads ?? 0} />
        <StatCard icon={CalendarCheck2} label="Visites" value={chartValue ?? stats?.visits ?? 0} />
        <StatCard icon={FileCheck} label="Offres" value={chartValue ?? stats?.offers ?? 0} />
        <StatCard icon={ArrowLeftRight} label="Transactions finalisées" value={chartValue ?? stats?.completedTransactions ?? 0} />
        <StatCard icon={Wallet} label="Revenu total" value={chartValue ?? formatPrice(stats?.totalRevenue ?? 0)} />
        <StatCard icon={HandCoins} label="Revenu commissions" value={chartValue ?? formatPrice(stats?.commissionRevenue ?? 0)} accent />
      </div>

      {/* Growth chart */}
      <section className="mt-10 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Croissance des annonces</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Publications mensuelles, janvier à décembre</p>
          </div>
          <Badge className="border-transparent bg-gold/15 text-gold">{growthData[growthData.length - 1]} ce mois</Badge>
        </div>
        <div className="mt-8 flex h-48 items-end gap-1.5 sm:gap-2">
          {growthData.map((value, i) => (
            <div key={i} className="group flex flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-lg bg-gold transition-all duration-300 group-hover:brightness-110"
                  style={{ height: `${(value / maxGrowth) * 100}%` }}
                />
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-1.5 sm:gap-2">
          {["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"].map((m) => (
            <span key={m} className="flex-1 text-center text-[10px] text-muted-foreground">{m}</span>
          ))}
        </div>
      </section>

      {/* Two-chart row */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Leads vs transactions */}
        <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Leads vs Transactions</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Six derniers mois</p>
          <div className="mt-8 flex h-44 items-end gap-3">
            {monthlyLabels.map((label, i) => {
              const leads = monthlyLeads[i];
              const txns = monthlyTransactions[i];
              return (
                <div key={label} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <div className="flex h-full w-full items-end justify-center gap-1">
                    <div className="group relative flex w-1/2 max-w-6 flex-col items-center justify-end">
                      <div className="w-full rounded-t-md bg-sand" style={{ height: `${(leads / maxPair) * 100}%` }} />
                      <span className="pointer-events-none absolute -top-5 whitespace-nowrap rounded bg-ink px-1 py-0.5 text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100">{leads}</span>
                    </div>
                    <div className="group relative flex w-1/2 max-w-6 flex-col items-center justify-end">
                      <div className="w-full rounded-t-md bg-gold" style={{ height: `${(txns / maxPair) * 100}%` }} />
                      <span className="pointer-events-none absolute -top-5 whitespace-nowrap rounded bg-ink px-1 py-0.5 text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100">{txns}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-sand" /> Leads</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-gold" /> Transactions</span>
          </div>
        </section>

        {/* Commission revenue */}
        <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Revenu commissions</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Commissions encaissées (en milliers de MAD)</p>
          <div className="mt-8 space-y-3">
            {commissionData.map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="w-10 shrink-0 text-xs text-muted-foreground">{c.label}</span>
                <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-sand/60">
                  <div
                    className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-gold/60 to-gold pr-2"
                    style={{ width: `${(c.value / maxCommission) * 100}%` }}
                  >
                    <span className="text-[10px] font-semibold text-white">{c.value}k</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Valeurs indicatives en milliers de dirhams (k MAD), six derniers mois.
          </p>
        </section>
      </div>

      {/* Latest transactions */}
      <section className="mt-10 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Dernières transactions</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Activité récente sur la plateforme</p>
          </div>
          <Link href="/admin/transactions" className="text-sm font-medium text-gold hover:underline">
            Voir tout
          </Link>
        </div>

        {loading ? (
          <div className="mt-4 space-y-3">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        ) : recent.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Aucune transaction pour le moment.
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-3 font-medium">Bien</th>
                  <th className="pb-3 font-medium">Acheteur</th>
                  <th className="pb-3 font-medium">Prix de vente</th>
                  <th className="pb-3 font-medium">Commission</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((txn) => {
                  const slug = propertySlug(txn.propertyId);
                  return (
                    <tr key={txn.id} className="border-b border-border/60 last:border-0">
                      <td className="py-3 pr-4">
                        <Link
                          href={slug ? `/properties/${slug}` : "#"}
                          className="line-clamp-1 max-w-[220px] font-medium text-foreground hover:text-gold"
                        >
                          {propertyTitle(txn.propertyId)}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{userName(txn.buyerId)}</td>
                      <td className="py-3 pr-4 font-semibold">{formatPrice(txn.salePrice)}</td>
                      <td className="py-3 pr-4 text-gold">{formatPrice(txn.commissionAmount)}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{formatDate(txn.createdAt)}</td>
                      <td className="py-3">
                        <Badge className={cn("shrink-0 border-transparent", txnStatusBadge[txn.status])}>
                          {txnStatusLabel[txn.status]}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
