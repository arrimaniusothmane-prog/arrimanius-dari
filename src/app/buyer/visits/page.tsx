"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarCheck2, MapPin, Clock, X } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type VisitStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

type VisitItem = {
  id: string;
  propertyTitle: string;
  propertySlug: string;
  date: string;
  time: string;
  status: VisitStatus;
  location: string;
};

const initialVisits: VisitItem[] = [
  {
    id: "visit-1",
    propertyTitle: "Appartement Vue Mer Ain Diab",
    propertySlug: "appartement-vue-mer-ain-diab",
    date: "2026-09-12",
    time: "16:00",
    status: "CONFIRMED",
    location: "Corniche Ain Diab, Casablanca",
  },
  {
    id: "visit-2",
    propertyTitle: "Villa Moderne Bouskoura",
    propertySlug: "villa-moderne-bouskoura",
    date: "2026-09-15",
    time: "10:30",
    status: "CONFIRMED",
    location: "Route de Bouskoura, Casablanca",
  },
  {
    id: "visit-3",
    propertyTitle: "Appartement Luxe Anfa",
    propertySlug: "appartement-luxe-anfa",
    date: "2026-08-20",
    time: "14:00",
    status: "COMPLETED",
    location: "Boulevard d'Anfa, Casablanca",
  },
  {
    id: "visit-4",
    propertyTitle: "Villa Traditionnelle Marrakech",
    propertySlug: "villa-traditionnelle-marrakech",
    date: "2026-08-05",
    time: "11:00",
    status: "COMPLETED",
    location: "Guéliz, Marrakech",
  },
];

const statusStyles: Record<VisitStatus, { label: string; className: string }> = {
  CONFIRMED: {
    label: "Confirmée",
    className: "bg-green-500/10 text-green-600",
  },
  COMPLETED: {
    label: "Effectuée",
    className: "bg-muted text-muted-foreground",
  },
  CANCELLED: {
    label: "Annulée",
    className: "bg-red-500/10 text-red-600",
  },
};

export default function BuyerVisitsPage() {
  const [visits, setVisits] = useState<VisitItem[]>(initialVisits);

  const upcoming = visits.filter((v) => v.status === "CONFIRMED");
  const cancelled = visits.filter((v) => v.status === "CANCELLED");
  const completed = visits.filter((v) => v.status === "COMPLETED");

  const cancelVisit = (id: string) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: "CANCELLED" as VisitStatus } : v
      )
    );
  };

  const renderVisitCard = (visit: VisitItem) => {
    const status = statusStyles[visit.status];
    return (
      <div
        key={visit.id}
        className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:flex-row sm:items-center"
      >
        <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-sand text-gold">
          <span className="font-display text-lg font-semibold leading-none">
            {new Date(visit.date).getDate()}
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide">
            {new Date(visit.date).toLocaleDateString("fr-FR", {
              month: "short",
            })}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("rounded-full", status.className)}>
              {status.label}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" /> {visit.time}
            </span>
          </div>
          <Link
            href={`/properties/${visit.propertySlug}`}
            className="mt-1.5 block truncate font-display text-base font-semibold text-foreground hover:text-primary"
          >
            {visit.propertyTitle}
          </Link>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" /> {visit.location}
          </p>
        </div>

        {visit.status === "CONFIRMED" && (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 rounded-full"
            onClick={() => cancelVisit(visit.id)}
          >
            <X className="size-3.5" /> Annuler
          </Button>
        )}
      </div>
    );
  };

  return (
    <div>
      <DashboardHeader
        title="Mes visites"
        subtitle="Gérez vos visites immobilières programmées et passées."
      />

      {upcoming.length === 0 && cancelled.length === 0 && completed.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-sand text-gold">
            <CalendarCheck2 className="size-7" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold">
            Aucune visite programmée
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Les visites que vous planifiez apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-display text-lg font-semibold">
              À venir
              <span className="ml-2 rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-gold">
                {upcoming.length + cancelled.length}
              </span>
            </h2>
            <div className="space-y-4">
              {[...upcoming, ...cancelled].map(renderVisitCard)}
              {upcoming.length === 0 && cancelled.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                  Aucune visite à venir.
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-lg font-semibold">Passées</h2>
            <div className="space-y-4">
              {completed.map(renderVisitCard)}
              {completed.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                  Aucune visite effectuée pour le moment.
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}