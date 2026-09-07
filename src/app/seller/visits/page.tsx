"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Users,
  Phone,
  Check,
  X,
  CalendarCheck2,
} from "lucide-react";
import type { Visit } from "@/types";
import { LeadStatus } from "@/types";
import { getVisits } from "@/services/leadService";
import { mockProperties } from "@/data/properties";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatTime, cn } from "@/lib/utils";

const SELLER_ID = "seller-1";

const statusLabel: Record<string, string> = {
  [LeadStatus.VISIT_REQUESTED]: "À confirmer",
  [LeadStatus.VISIT_COMPLETED]: "Effectuée",
  [LeadStatus.CANCELLED]: "Annulée",
};

const statusBadgeClass: Record<string, string> = {
  [LeadStatus.VISIT_REQUESTED]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [LeadStatus.VISIT_COMPLETED]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [LeadStatus.CANCELLED]: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

function propertyFor(propertyId: string) {
  return mockProperties.find((p) => p.id === propertyId);
}

function VisitCard({
  visit,
  onDecision,
}: {
  visit: Visit;
  onDecision: (visitId: string, status: LeadStatus) => void;
}) {
  const property = propertyFor(visit.propertyId);
  const upcoming = visit.status === LeadStatus.VISIT_REQUESTED;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            href={property ? `/properties/${property.slug}` : "#"}
            className="font-display text-base font-semibold text-foreground hover:text-gold"
          >
            {property?.title ?? "Bien"}
          </Link>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" /> {formatDate(visit.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" /> {formatTime(visit.time)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-4" /> {visit.numberOfVisitors} visiteur{visit.numberOfVisitors > 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="size-4" /> {visit.phone}
            </span>
          </div>
        </div>
        <Badge className={cn("border-transparent", statusBadgeClass[visit.status])}>
          {statusLabel[visit.status]}
        </Badge>
      </div>

      {visit.message && (
        <p className="mt-4 rounded-xl bg-sand/60 p-4 text-sm leading-relaxed text-foreground/80">
          {visit.message}
        </p>
      )}

      {upcoming && (
        <div className="mt-4 flex items-center gap-3 border-t border-border/60 pt-4">
          <span className="mr-auto text-sm text-muted-foreground">Confirmer cette visite ?</span>
          <Button
            size="sm"
            className="rounded-full bg-emerald-600 text-white hover:bg-emerald-600/90"
            onClick={() => onDecision(visit.id, LeadStatus.VISIT_COMPLETED)}
          >
            <Check className="size-4" /> Accepter
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={() => onDecision(visit.id, LeadStatus.CANCELLED)}
          >
            <X className="size-4" /> Refuser
          </Button>
        </div>
      )}
    </div>
  );
}

export default function SellerVisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVisits()
      .then((all) => {
        const sellerProps = mockProperties
          .filter((p) => p.sellerId === SELLER_ID)
          .map((p) => p.id);
        setVisits(all.filter((v) => sellerProps.includes(v.propertyId)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDecision = (visitId: string, status: LeadStatus) => {
    setVisits((prev) => prev.map((v) => (v.id === visitId ? { ...v, status } : v)));
  };

  const upcoming = visits
    .filter((v) => v.status === LeadStatus.VISIT_REQUESTED)
    .sort((a, b) => a.date.localeCompare(b.date));
  const completed = visits.filter(
    (v) => v.status === LeadStatus.VISIT_COMPLETED || v.status === LeadStatus.CANCELLED
  );

  if (loading) {
    return (
      <div>
        <DashboardHeader title="Visites" subtitle="Acceptez ou refusez les demandes de visite sur vos biens." />
        <div className="space-y-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="Visites"
        subtitle="Acceptez ou refusez les demandes de visite sur vos biens."
      />

      {visits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-sand text-gold">
            <CalendarCheck2 className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold">Aucune visite pour le moment</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Les demandes de visite de vos acquéreurs apparaîtront ici.
          </p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
                À venir
                <Badge className="border-transparent bg-gold text-white">{upcoming.length}</Badge>
              </h2>
              <div className="space-y-4">
                {upcoming.map((v) => (
                  <VisitCard key={v.id} visit={v} onDecision={handleDecision} />
                ))}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-lg font-semibold">Passées</h2>
              <div className="space-y-4">
                {completed.map((v) => (
                  <VisitCard key={v.id} visit={v} onDecision={handleDecision} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}