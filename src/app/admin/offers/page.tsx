"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileCheck, HandCoins, X, Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getOffers, updateOfferStatus } from "@/services/leadService";
import { mockProperties, mockUsers } from "@/data/properties";
import { OfferStatus } from "@/types";
import type { Offer } from "@/types";
import { formatPrice, formatDate, cn } from "@/lib/utils";

const statusLabel: Record<OfferStatus, string> = {
  [OfferStatus.PENDING]: "En attente",
  [OfferStatus.ACCEPTED]: "Acceptée",
  [OfferStatus.REJECTED]: "Refusée",
  [OfferStatus.COUNTER_OFFER]: "Contre-offre",
};

const statusBadge: Record<OfferStatus, string> = {
  [OfferStatus.PENDING]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [OfferStatus.ACCEPTED]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [OfferStatus.REJECTED]: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  [OfferStatus.COUNTER_OFFER]: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
};

function propertyFor(propertyId: string) {
  return mockProperties.find((p) => p.id === propertyId);
}
function buyerFor(buyerId: string) {
  return mockUsers.find((u) => u.id === buyerId);
}

export default function AdminOffersPage() {
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

  const sorted = [...offers].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <DashboardHeader
        title="Offres"
        subtitle="Toutes les offres d&apos;achat en attente de décision."
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <FileCheck className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Aucune offre pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((offer) => {
            const property = propertyFor(offer.propertyId);
            const buyer = buyerFor(offer.buyerId);
            const pending = offer.status === OfferStatus.PENDING;
            const busy = busyId === offer.id;
            return (
              <div key={offer.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={property ? `/properties/${property.slug}` : "#"}
                        className="truncate font-display text-base font-semibold text-foreground hover:text-gold"
                      >
                        {property?.title ?? "Bien"}
                      </Link>
                      <Badge className={cn("shrink-0 border-transparent", statusBadge[offer.status])}>
                        {statusLabel[offer.status]}
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      Acheteur : {buyer?.name ?? offer.buyerId} · Reçue le {formatDate(offer.createdAt)}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Montant</p>
                    <p className="font-display text-xl font-semibold text-gold">{formatPrice(offer.price)}</p>
                  </div>
                </div>

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
                      <X className="size-4" /> Rejeter
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
