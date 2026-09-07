"use client";

import Link from "next/link";
import { OfferStatus } from "@/types";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
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

const initialOffers: OfferItem[] = [
  {
    id: "offer-1",
    propertyTitle: "Villa avec Piscine Californie",
    propertySlug: "villa-piscine-californie",
    price: 3800000,
    askingPrice: 4200000,
    status: OfferStatus.COUNTER_OFFER,
    date: "2026-08-18T10:00:00Z",
  },
  {
    id: "offer-2",
    propertyTitle: "Appartement Luxe Anfa",
    propertySlug: "appartement-luxe-anfa",
    price: 2900000,
    askingPrice: 3200000,
    status: OfferStatus.PENDING,
    date: "2026-08-10T09:30:00Z",
  },
  {
    id: "offer-3",
    propertyTitle: "Villa Familiale Ain Sebaa",
    propertySlug: "villa-familiale-ain-sebaa",
    price: 1500000,
    askingPrice: 1650000,
    status: OfferStatus.REJECTED,
    date: "2026-07-28T14:00:00Z",
  },
];

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
  return (
    <div>
      <DashboardHeader
        title="Mes offres"
        subtitle="Suivez l'avancement de vos offres d'achat."
      />

      <div className="space-y-4">
        {initialOffers.map((offer) => {
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
    </div>
  );
}