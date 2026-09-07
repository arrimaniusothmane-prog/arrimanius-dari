"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileCheck,
  HandCoins,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import type { Offer } from "@/types";
import { OfferStatus } from "@/types";
import { getOffers, updateOfferStatus } from "@/services/leadService";
import { mockProperties } from "@/data/properties";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatDate, cn } from "@/lib/utils";

const statusLabel: Record<OfferStatus, string> = {
  [OfferStatus.PENDING]: "En attente",
  [OfferStatus.ACCEPTED]: "Acceptée",
  [OfferStatus.REJECTED]: "Refusée",
  [OfferStatus.COUNTER_OFFER]: "Contre-offre",
};

const statusBadgeClass: Record<OfferStatus, string> = {
  [OfferStatus.PENDING]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [OfferStatus.ACCEPTED]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [OfferStatus.REJECTED]: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  [OfferStatus.COUNTER_OFFER]: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
};

function propertyFor(propertyId: string) {
  return mockProperties.find((p) => p.id === propertyId);
}

export default function SellerOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    getOffers()
      .then(setOffers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (offer: Offer, status: OfferStatus) => {
    setBusyId(offer.id);
    try {
      const updated = await updateOfferStatus(offer.id, status);
      if (updated) {
        setOffers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Offres"
        subtitle="Consultez et gérez les offres reçues sur vos annonces."
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-sand text-gold">
            <FileCheck className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold">Aucune offre reçue</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Les offres d&apos;achat sur vos biens apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {offers.map((offer) => {
            const property = propertyFor(offer.propertyId);
            const asking = property?.price ?? 0;
            const diffPct = asking > 0 ? Math.round(((offer.price - asking) / asking) * 100) : 0;
            const above = diffPct >= 0;
            const pending = offer.status === OfferStatus.PENDING;
            const busy = busyId === offer.id;

            return (
              <div
                key={offer.id}
                className="flex flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={property ? `/properties/${property.slug}` : "#"}
                      className="font-display text-base font-semibold text-foreground hover:text-gold"
                    >
                      {property?.title ?? "Bien"}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Reçue le {formatDate(offer.createdAt)} · Contact : {offer.preferredContact}
                    </p>
                  </div>
                  <Badge className={cn("shrink-0 border-transparent", statusBadgeClass[offer.status])}>
                    {statusLabel[offer.status]}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-sand/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Offre</p>
                    <p className="mt-1 font-display text-xl font-semibold">{formatPrice(offer.price)}</p>
                  </div>
                  <div className="rounded-xl bg-sand/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Prix affiché</p>
                    <p className="mt-1 font-display text-xl font-semibold">{formatPrice(asking)}</p>
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                    above
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                  )}
                >
                  {above ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                  {above ? "+" : ""}{diffPct}% vs prix affiché
                </div>

                {offer.message && (
                  <p className="mt-4 rounded-xl bg-sand/60 p-4 text-sm leading-relaxed text-foreground/80">
                    {offer.message}
                  </p>
                )}

                {pending && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
                    <Button
                      size="sm"
                      disabled={busy}
                      className="rounded-full bg-emerald-600 text-white hover:bg-emerald-600/90"
                      onClick={() => handleStatus(offer, OfferStatus.ACCEPTED)}
                    >
                      {busy ? <Loader2 className="size-4 animate-spin" /> : <HandCoins className="size-4" />}
                      Accepter
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      className="rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                      onClick={() => handleStatus(offer, OfferStatus.REJECTED)}
                    >
                      Refuser
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      className="rounded-full text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                      onClick={() => handleStatus(offer, OfferStatus.COUNTER_OFFER)}
                    >
                      Contre-offre
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}