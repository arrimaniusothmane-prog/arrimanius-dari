"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarCheck2, MapPin, Clock, X, Loader2 } from "lucide-react";
import { LeadStatus } from "@/types";
import type { Visit } from "@/types";
import { getLeads, getVisits, updateLeadStatus } from "@/services/leadService";
import { propertyById, visitStatusLabel, visitStatusBadge } from "@/lib/labels";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

export default function BuyerVisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { user } = useAuth();
  const buyerId = user?.id ?? "buyer-1";

  useEffect(() => {
    Promise.all([getVisits(), getLeads()])
      .then(([allVisits, leads]) => {
        const myVisitIds = leads
          .filter((l) => l.buyerId === buyerId)
          .map((l) => l.id);
        setVisits(
          allVisits
            .filter((v) => myVisitIds.includes(v.leadId))
            .sort((a, b) => a.date.localeCompare(b.date))
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [buyerId]);

  const cancelVisit = async (visit: Visit) => {
    setCancellingId(visit.id);
    try {
      await updateLeadStatus(visit.leadId, LeadStatus.CANCELLED);
      setVisits((prev) =>
        prev.map((v) =>
          v.id === visit.id ? { ...v, status: LeadStatus.CANCELLED } : v
        )
      );
    } finally {
      setCancellingId(null);
    }
  };

  const upcoming = visits.filter(
    (v) =>
      v.status === LeadStatus.VISIT_REQUESTED ||
      v.status === LeadStatus.VISIT_CONFIRMED
  );
  const cancelled = visits.filter((v) => v.status === LeadStatus.CANCELLED);
  const completed = visits.filter((v) => v.status === LeadStatus.VISIT_COMPLETED);

  const renderVisitCard = (visit: Visit) => {
    const property = propertyById(visit.propertyId);
    return (
      <div
        key={visit.id}
        className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:flex-row sm:items-center"
      >
        <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-sand text-gold">
          <span className="font-display text-lg font-semibold leading-none">
            {new Date(visit.date + "T00:00:00").getDate()}
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide">
            {new Date(visit.date + "T00:00:00").toLocaleDateString("fr-FR", {
              month: "short",
            })}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              className={visitStatusBadge[visit.status]}
              label={visitStatusLabel[visit.status] ?? visit.status}
            />
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" /> {visit.time}
            </span>
          </div>
          <Link
            href={property ? `/properties/${property.slug}` : "/properties"}
            className="mt-1.5 block truncate font-display text-base font-semibold text-foreground hover:text-primary"
          >
            {property?.title ?? "Bien"}
          </Link>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" /> {property?.address.city ?? "—"}
          </p>
        </div>

        {visit.status !== LeadStatus.CANCELLED &&
          visit.status !== LeadStatus.VISIT_COMPLETED && (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 rounded-full"
              disabled={cancellingId === visit.id}
              onClick={() => cancelVisit(visit)}
            >
              {cancellingId === visit.id ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <X className="size-3.5" />
              )}{" "}
              Annuler
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

      {loading ? (
        <div className="space-y-4">
          <div className="h-40 rounded-2xl bg-muted/50" />
          <div className="h-40 rounded-2xl bg-muted/50" />
        </div>
      ) : visits.length === 0 ? (
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
                {upcoming.length}
              </span>
            </h2>
            <div className="space-y-4">
              {upcoming.map(renderVisitCard)}
              {upcoming.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                  Aucune visite à venir.
                </p>
              )}
            </div>
          </section>

          {cancelled.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-lg font-semibold">
                Annulées
              </h2>
              <div className="space-y-4">{cancelled.map(renderVisitCard)}</div>
            </section>
          )}

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