"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileCheck } from "lucide-react";
import { OfferStatus } from "@/types";
import { getOffers } from "@/services/leadService";
import { getProperties } from "@/services/propertyService";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentBuyerId } from "@/hooks/useCurrentBuyer";
import { cn, formatPrice, formatDate } from "@/lib/utils";

type OfferItem = {
  id: string;
  propertyTitle: string;
  propertySlug: string;
  price: number;
  askingPrice: number;
  status: OfferStatus;
  date: string;
};

const statusStyles: Record<OfferStatus, { label: string; className: string }> = {
  [OfferStatus.PENDING]: {
    label: "En attente",
    className: "bg-amber-500/10 text-amber-600",
  },
  [OfferStatus.ACCEPTED]: {
    label: "Acceptée",
    className: "bg-green-500/10 text-green-600",
  },
  [OfferStatus.REJECTED]: {
    label: "Refusée",
    className: "bg-red-500/10 text-red-600",
  },
  [OfferStatus.COUNTER_OFFER]: {
    label: "Contre-offre",
    className: "bg-blue-500/10 text-blue-600",
  },
};

export default function BuyerOffersPage() {
  const buyerId = useCurrentBuyerId();
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOffers(), getProperties()])
      .then(([allOffers, properties]) => {
        const items = allOffers
          .filter((o) => o.buyerId === buyerId)
          .map((o) => {
            const property = properties.find((p) => p.id === o.propertyId);
            return {
              id: o.id,
              propertyTitle: property?.title ?? "Bien",
              propertySlug: property?.slug ?? "#",
              price: o.price,
              askingPrice: property?.price ?? o.price,
              status: o.status,
              date: o.createdAt,
            };
          });
        setOffers(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [buyerId]);

  return (
    <div>
      <DashboardHeader
        title="Mes offres"
        subtitle="Suivez l'avancement de vos offres d'achat."
      />

      {loading ? (
        <div className="space-y-4">
          <div className="h-40 rounded-2xl bg-muted/50" />
          <div className="h-40 rounded-2xl bg-muted/50" />
        </div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-sand text-gold">
            <FileCheck className="size-7" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold">
            Aucune offre pour le moment
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Lorsque vous ferez une offre sur un bien, elle apparaîtra ici avec
            son suivi en temps réel.
          </p>
          <Link href="/properties" className="mt-5">
            <Button className="rounded-full bg-gold text-white hover:bg-gold/90">
              Rechercher un bien
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => {
            const status = statusStyles[offer.status];
            const diff = Math.round(((offer.price - offer.askingPrice) / offer.askingPrice) * 100);
            const diffLabel = `${diff > 0 ? "+" : ""}${diff}%`;
            return (
              <div
                key={offer.id}
                className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={cn("rounded-full", status.className)}>
                        {status.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(offer.date)}
                      </span>
                    </div>
                    <Link
                      href={`/properties/${offer.propertySlug}`}
                      className="mt-2 block truncate font-display text-base font-semibold text-foreground hover:text-primary"
                    >
                      {offer.propertyTitle}
                    </Link>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-sand/50 p-3.5">
                        <p className="text-xs font-medium uppercase tracking-wide text-gold">
                          Votre offre
                        </p>
                        <p className="mt-1 text-lg font-semibold text-foreground">
                          {formatPrice(offer.price)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-muted/60 p-3.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Prix demandé
                          </p>
                          <Badge
                            className={cn(
                              "rounded-full",
                              diff >= 0
                                ? "bg-red-500/10 text-red-600"
                                : "bg-green-500/10 text-green-600"
                            )}
                          >
                            {diffLabel}
                          </Badge>
                        </div>
                        <p className="mt-1 text-lg font-semibold text-foreground">
                          {formatPrice(offer.askingPrice)}
                        </p>
                      </div>
                    </div>
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