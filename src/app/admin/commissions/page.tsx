"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet, HandCoins, Clock, Info, Check } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCommissions, getTransactions } from "@/services/transactionService";
import {
  propertyById,
  commissionStatusLabel,
  commissionStatusBadge,
} from "@/lib/labels";
import { CommissionStatus } from "@/types";
import type { Commission, Transaction } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

const exampleCommission = { salePrice: 1500000, percentage: 2, amount: 30000 };

function propertyFor(transactionId: string, transactions: Transaction[]) {
  const txn = transactions.find((t) => t.id === transactionId);
  return txn ? propertyById(txn.propertyId) : undefined;
}

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCommissions(), getTransactions()])
      .then(([c, t]) => {
        setCommissions(c);
        setTransactions(t);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = commissions.reduce((sum, c) => sum + c.amount, 0);
  const pending = commissions
    .filter((c) => c.status === CommissionStatus.PENDING || c.status === CommissionStatus.DUE)
    .reduce((sum, c) => sum + c.amount, 0);
  const paid = commissions
    .filter((c) => c.status === CommissionStatus.PAID)
    .reduce((sum, c) => sum + c.amount, 0);

  const markPaid = (id: string) => {
    setCommissions((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: CommissionStatus.PAID,
              paidDate: new Date().toISOString(),
            }
          : c
      )
    );
  };

  const sorted = [...commissions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <DashboardHeader
        title="Gestion des commissions"
        subtitle="Suivi des revenus de la plateforme."
      />

      {/* Explanation banner */}
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm">
        <Info className="mt-0.5 size-5 shrink-0 text-gold" />
        <div className="leading-relaxed text-muted-foreground">
          <p>
            DarEstate prélève une <strong className="text-foreground">commission de 2%</strong> sur chaque
            transaction finalisée. Exemple : un bien vendu{" "}
            <strong className="text-foreground">{formatPrice(exampleCommission.salePrice)}</strong> génère
            une commission de{" "}
            <strong className="text-foreground">{formatPrice(exampleCommission.amount)}</strong>.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gold text-white">
            <Wallet className="size-5" />
          </div>
          <p className="mt-4 text-3xl font-semibold">{loading ? "…" : formatPrice(totalRevenue)}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Revenu total</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            <Clock className="size-5" />
          </div>
          <p className="mt-4 text-3xl font-semibold">{loading ? "…" : formatPrice(pending)}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">En attente (à venir + à payer)</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <HandCoins className="size-5" />
          </div>
          <p className="mt-4 text-3xl font-semibold">{loading ? "…" : formatPrice(paid)}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Payé</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <HandCoins className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Aucune commission pour le moment.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-4 font-medium">Transaction</th>
                  <th className="px-5 py-4 font-medium">Prix de vente</th>
                  <th className="px-5 py-4 font-medium">Taux</th>
                  <th className="px-5 py-4 font-medium">Montant commission</th>
                  <th className="px-5 py-4 font-medium">Échéance</th>
                  <th className="px-5 py-4 font-medium">Paiement</th>
                  <th className="px-5 py-4 font-medium">Statut</th>
                  <th className="px-5 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c) => {
                  const txn = transactions.find((t) => t.id === c.transactionId);
                  const property = propertyFor(c.transactionId, transactions);
                  const payable = c.status === CommissionStatus.DUE || c.status === CommissionStatus.PENDING;
                  return (
                    <tr key={c.id} className="border-b border-border/60 align-middle last:border-0 hover:bg-muted/40">
                      <td className="px-5 py-4">
                        <Link
                          href={property ? `/properties/${property.slug}` : "#"}
                          className="line-clamp-1 max-w-[200px] font-medium text-foreground hover:text-gold"
                        >
                          {property?.title ?? "Transaction"}
                        </Link>
                        <p className="text-xs text-muted-foreground">Réf. {c.transactionId}</p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-semibold">
                        {txn ? formatPrice(txn.salePrice) : "—"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">{c.percentage}%</td>
                      <td className="px-5 py-4 whitespace-nowrap font-semibold text-gold">{formatPrice(c.amount)}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">{formatDate(c.dueDate)}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                        {c.paidDate ? formatDate(c.paidDate) : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge
                          className={commissionStatusBadge[c.status]}
                          label={commissionStatusLabel[c.status]}
                        />
                      </td>
                      <td className="px-5 py-4 text-right">
                        {payable ? (
                          <Button
                            size="sm"
                            className="rounded-full bg-emerald-600 text-white hover:bg-emerald-600/90"
                            onClick={() => markPaid(c.id)}
                          >
                            <Check className="size-3.5" />
                            Marquer payée
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Demo example row */}
      <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/5 p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-display text-base font-semibold">
              <span className="flex size-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-white">i</span>
              Exemple de calcul
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Bien vendu {formatPrice(exampleCommission.salePrice)} au taux de {exampleCommission.percentage}%
              → commission {formatPrice(exampleCommission.amount)}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Vente</span>
            <span className="font-display text-lg font-semibold">{formatPrice(exampleCommission.salePrice)}</span>
            <span className="text-gold">× {exampleCommission.percentage}%</span>
            <span className="rounded-lg bg-gold px-3 py-1.5 font-display text-base font-semibold text-white">
              {formatPrice(exampleCommission.amount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
