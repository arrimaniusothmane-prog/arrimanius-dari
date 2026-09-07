"use client";

import Link from "next/link";
import { useState } from "react";
import { Inbox, X } from "lucide-react";
import { LeadStatus } from "@/types";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type RequestItem = {
  id: string;
  propertyTitle: string;
  propertySlug: string;
  sellerName: string;
  message: string;
  status: LeadStatus;
  date: string;
};

const initialRequests: RequestItem[] = [
  {
    id: "req-1",
    propertyTitle: "Appartement Premium Maarif",
    propertySlug: "appartement-premium-maarif",
    sellerName: "Mohamed Benali",
    message:
      "Bonjour, je suis très intéressé par votre appartement à Maarif. Serait-il possible d'organiser une visite cette semaine ?",
    status: LeadStatus.NEW,
    date: "2026-09-05T09:00:00Z",
  },
  {
    id: "req-2",
    propertyTitle: "Villa avec Piscine Californie",
    propertySlug: "villa-piscine-californie",
    sellerName: "Mohamed Benali",
    message:
      "Je souhaite visiter cette villa exceptionnelle. Le week-end prochain serait-il envisageable ?",
    status: LeadStatus.VISIT_REQUESTED,
    date: "2026-09-02T14:30:00Z",
  },
  {
    id: "req-3",
    propertyTitle: "Appartement Vue Mer Ain Diab",
    propertySlug: "appartement-vue-mer-ain-diab",
    sellerName: "Mohamed Benali",
    message:
      "L'appartement me plaît beaucoup. Pouvez-vous me communiquer plus de détails sur les charges de copropriété ?",
    status: LeadStatus.CONTACTED,
    date: "2026-08-28T11:00:00Z",
  },
  {
    id: "req-4",
    propertyTitle: "Appartement Luxe Anfa",
    propertySlug: "appartement-luxe-anfa",
    sellerName: "Fatima Zahra El Idrissi",
    message:
      "Suite à la visite, je souhaiterais entamer une discussion sur le prix de vente.",
    status: LeadStatus.OFFER_MADE,
    date: "2026-08-20T16:45:00Z",
  },
  {
    id: "req-5",
    propertyTitle: "Villa Traditionnelle Marrakech",
    propertySlug: "villa-traditionnelle-marrakech",
    sellerName: "Mohamed Benali",
    message:
      "Encore intéressé par votre villa à Marrakech, merci de confirmer la disponibilité.",
    status: LeadStatus.VISIT_COMPLETED,
    date: "2026-08-10T10:15:00Z",
  },
];

const statusStyles: Record<LeadStatus, { label: string; className: string }> = {
  [LeadStatus.NEW]: { label: "Nouveau", className: "bg-blue-500/10 text-blue-600" },
  [LeadStatus.CONTACTED]: { label: "Contacté", className: "bg-purple-500/10 text-purple-600" },
  [LeadStatus.VISIT_REQUESTED]: { label: "Visite demandée", className: "bg-amber-500/10 text-amber-600" },
  [LeadStatus.VISIT_COMPLETED]: { label: "Visite effectuée", className: "bg-green-500/10 text-green-600" },
  [LeadStatus.OFFER_MADE]: { label: "Offre envoyée", className: "bg-teal-500/10 text-teal-600" },
  [LeadStatus.NEGOTIATION]: { label: "Négociation", className: "bg-orange-500/10 text-orange-600" },
  [LeadStatus.SOLD]: { label: "Vendu", className: "bg-emerald-500/10 text-emerald-600" },
  [LeadStatus.CANCELLED]: { label: "Annulé", className: "bg-muted text-muted-foreground" },
};

function relativeDate(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days} jours`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
  const months = Math.floor(days / 30);
  return `il y a ${months} mois`;
}

export default function BuyerRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);

  const cancelRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <DashboardHeader
        title="Mes demandes"
        subtitle="Toutes les demandes envoyées aux vendeurs."
      />

      {requests.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-sand text-gold">
            <Inbox className="size-7" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold">
            Aucune demande active
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Contactez un vendeur depuis un bien pour créer une nouvelle demande.
          </p>
          <Link href="/properties" className="mt-5">
            <Button className="rounded-full bg-gold text-white hover:bg-gold/90">
              Rechercher un bien
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const status = statusStyles[request.status];
            return (
              <div
                key={request.id}
                className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={cn("rounded-full", status.className)}>
                        {status.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {relativeDate(request.date)}
                      </span>
                    </div>
                    <Link
                      href={`/properties/${request.propertySlug}`}
                      className="mt-2 block font-display text-base font-semibold text-foreground hover:text-primary"
                    >
                      {request.propertyTitle}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Vendeur : {request.sellerName}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {request.message}
                    </p>
                  </div>
                  {request.status === LeadStatus.NEW && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 rounded-full"
                      onClick={() => cancelRequest(request.id)}
                    >
                      <X className="size-3.5" /> Annuler
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}