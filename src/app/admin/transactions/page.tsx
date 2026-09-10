"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, Wallet, HandCoins } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getTransactions } from "@/services/transactionService";
import {
  propertyById,
  userById,
  transactionStatusLabel,
  transactionStatusBadge,
} from "@/lib/labels";
import type { Transaction } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = transactions.length;
  const volume = transactions.reduce((sum, t) => sum + t.salePrice, 0);
  const commissionRevenue = transactions.reduce((sum, t) => sum + t.commissionAmount, 0);

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <DashboardHeader
        title="Transactions"
        subtitle="Historique des ventes finalisées sur la plateforme."
      />

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sand text-gold">
            <ArrowLeftRight className="size-5" />
          </div>
          <p className="mt-4 text-3xl font-semibold">{loading ? "…" : total}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Total transactions</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sand text-gold">
            <Wallet className="size-5" />
          </div>
          <p className="mt-4 text-3xl font-semibold">{loading ? "…" : formatPrice(volume)}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Volume</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gold text-white">
            <HandCoins className="size-5" />
          </div>
          <p className="mt-4 text-3xl font-semibold">{loading ? "…" : formatPrice(commissionRevenue)}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Revenu commissions</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <ArrowLeftRight className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Aucune transaction pour le moment.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-4 font-medium">Bien</th>
                  <th className="px-5 py-4 font-medium">Vendeur</th>
                  <th className="px-5 py-4 font-medium">Acheteur</th>
                  <th className="px-5 py-4 font-medium">Prix de vente</th>
                  <th className="px-5 py-4 font-medium">Commission</th>
                  <th className="px-5 py-4 font-medium">Montant commission</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((txn) => {
                  const property = propertyById(txn.propertyId);
                  const seller = userById(txn.sellerId);
                  const buyer = userById(txn.buyerId);
                  return (
                    <tr key={txn.id} className="border-b border-border/60 align-middle last:border-0 hover:bg-muted/40">
                      <td className="px-5 py-4">
                        <Link
                          href={property ? `/properties/${property.slug}` : "#"}
                          className="line-clamp-1 max-w-[220px] font-medium text-foreground hover:text-gold"
                        >
                          {property?.title ?? "Bien"}
                        </Link>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">{seller?.name ?? txn.sellerId}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">{buyer?.name ?? txn.buyerId}</td>
                      <td className="px-5 py-4 font-semibold whitespace-nowrap">{formatPrice(txn.salePrice)}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">{txn.commissionPercentage}%</td>
                      <td className="px-5 py-4 whitespace-nowrap text-gold">{formatPrice(txn.commissionAmount)}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">{formatDate(txn.createdAt)}</td>
                      <td className="px-5 py-4">
                        <StatusBadge
                          className={transactionStatusBadge[txn.status]}
                          label={transactionStatusLabel[txn.status]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
