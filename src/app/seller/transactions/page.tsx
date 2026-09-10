"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, UserRound } from "lucide-react";
import type { Transaction } from "@/types";
import { getTransactions } from "@/services/transactionService";
import {
  propertyById,
  userById,
  transactionStatusLabel,
  transactionStatusBadge,
} from "@/lib/labels";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import { useCurrentSellerId } from "@/hooks/useCurrentSeller";

export default function SellerTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const sellerId = useCurrentSellerId();

  useEffect(() => {
    getTransactions()
      .then((all) => setTransactions(all.filter((t) => t.sellerId === sellerId)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sellerId]);

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <DashboardHeader
        title="Transactions"
        subtitle="Historique de vos ventes finalisées."
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-sand text-gold">
            <ArrowLeftRight className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold">Aucune transaction pour le moment</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Vos ventes finalisées apparaîtront ici avec le détail des commissions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((txn) => {
            const property = propertyById(txn.propertyId);
            const buyer = userById(txn.buyerId);
            return (
              <div
                key={txn.id}
                className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={property ? `/properties/${property.slug}` : "#"}
                        className="truncate font-display text-base font-semibold text-foreground hover:text-gold"
                      >
                        {property?.title ?? "Bien"}
                      </Link>
                      <StatusBadge
                        className={transactionStatusBadge[txn.status]}
                        label={transactionStatusLabel[txn.status]}
                      />
                    </div>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <UserRound className="size-4" />
                      {buyer?.name ?? txn.buyerId}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Finalisée le {formatDate(txn.createdAt)}
                    </p>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Prix de vente</p>
                    <p className="font-display text-xl font-semibold">{formatPrice(txn.salePrice)}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/60 pt-4 sm:grid-cols-4">
                  <div className="rounded-xl bg-sand/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Vente</p>
                    <p className="mt-1 text-sm font-semibold">{formatPrice(txn.salePrice)}</p>
                  </div>
                  <div className="rounded-xl bg-sand/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Commission</p>
                    <p className="mt-1 text-sm font-semibold">{txn.commissionPercentage}%</p>
                  </div>
                  <div className="rounded-xl bg-sand/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Montant commission</p>
                    <p className="mt-1 text-sm font-semibold text-gold">{formatPrice(txn.commissionAmount)}</p>
                  </div>
                  <div className="rounded-xl bg-sand/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Acheteur</p>
                    <p className="mt-1 truncate text-sm font-semibold">{buyer?.name ?? txn.buyerId}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}