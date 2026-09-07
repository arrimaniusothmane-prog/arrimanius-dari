"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet, HandCoins, Info } from "lucide-react";
import type { Commission } from "@/types";
import { CommissionStatus } from "@/types";
import { getCommissions, getTransactions } from "@/services/transactionService";
import type { Transaction } from "@/types";
import { mockProperties } from "@/data/properties";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatDate, cn } from "@/lib/utils";

const statusLabel: Record<CommissionStatus, string> = {
  [CommissionStatus.PENDING]: "En attente",
  [CommissionStatus.DUE]: "À payer",
  [CommissionStatus.PAID]: "Payée",
  [CommissionStatus.CANCELLED]: "Annulée",
};

const statusBadgeClass: Record<CommissionStatus, string> = {
  [CommissionStatus.PENDING]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [CommissionStatus.DUE]: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  [CommissionStatus.PAID]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [CommissionStatus.CANCELLED]: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
};

export default function SellerCommissionPage() {
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

  const totalRevenue = commissions
    .filter((c) => c.status === CommissionStatus.PAID)
    .reduce((sum, c) => sum + c.amount, 0);
  const outstanding = commissions
    .filter((c) => c.status === CommissionStatus.PENDING || c.status === CommissionStatus.DUE)
    .reduce((sum, c) => sum + c.amount, 0);

  const txnFor = (commission: Commission) =>
    transactions.find((t) => t.id === commission.transactionId);

  const propertyFor = (transactionId: string) => {
    const txn = transactions.find((t) => t.id === transactionId);
    return txn ? mockProperties.find((p) => p.id === txn.propertyId) : undefined;
  };

  return (
    <div>
      <DashboardHeader
        title="Commissions"
        subtitle="Suivez les commissions DarEstate sur vos ventes."
      />

      {/* Info banner */}
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm">
        <Info className="mt-0.5 size-5 shrink-0 text-gold" />
        <p className="leading-relaxed text-muted-foreground">
          DarEstate perçoit une commission sur chaque transaction finalisée. Le
          total de vos commissions payées est ajouté à votre revenu dès
          l&apos;enregistrement du paiement.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gold text-white">
                  <Wallet className="size-5" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-semibold">{formatPrice(totalRevenue)}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">Revenu total (commissions payées)</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-sand text-gold">
                  <HandCoins className="size-5" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-semibold">{formatPrice(outstanding)}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">En attente de paiement</p>
            </div>
          </div>

          {/* List */}
          <div className="mt-8">
            <h2 className="mb-4 font-display text-lg font-semibold">Détail des commissions</h2>
            {commissions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
                Aucune commission pour le moment.
              </div>
            ) : (
              <div className="space-y-4">
                {commissions.map((c) => {
                  const txn = txnFor(c);
                  const property = propertyFor(c.transactionId);
                  return (
                    <div
                      key={c.id}
                      className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <Link
                            href={property ? `/properties/${property.slug}` : "#"}
                            className="font-display text-base font-semibold text-foreground hover:text-gold"
                          >
                            {property?.title ?? "Transaction"}
                          </Link>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            Taux {c.percentage}% · Échéance le {formatDate(c.dueDate)}
                            {c.paidDate ? ` · Payée le ${formatDate(c.paidDate)}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-display text-lg font-semibold text-gold">
                              {formatPrice(c.amount)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {txn ? `Vente : ${formatPrice(txn.salePrice)}` : ""}
                            </p>
                          </div>
                          <Badge className={cn("shrink-0 border-transparent", statusBadgeClass[c.status])}>
                            {statusLabel[c.status]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}