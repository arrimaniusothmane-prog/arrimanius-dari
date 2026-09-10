"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, Users, Phone, CalendarCheck2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getVisits } from "@/services/leadService";
import {
  propertyById,
  visitStatusLabel,
  visitStatusBadge,
} from "@/lib/labels";
import { LeadStatus } from "@/types";
import type { Visit } from "@/types";
import { formatDate, formatTime, cn } from "@/lib/utils";

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVisits()
      .then(setVisits)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = visits.length;
  const upcoming = visits.filter(
    (v) =>
      v.status === LeadStatus.VISIT_REQUESTED ||
      v.status === LeadStatus.VISIT_CONFIRMED
  ).length;
  const completed = visits.filter((v) => v.status === LeadStatus.VISIT_COMPLETED).length;

  const sorted = [...visits].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <DashboardHeader
        title="Visites"
        subtitle="Toutes les visites programmées sur la plateforme."
      />

      {/* Summary chips */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <CalendarCheck2 className="size-4 text-gold" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Total</span>
          <span className="font-display text-base font-semibold">{total}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <span className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            <span className="text-xs font-bold">{upcoming}</span>
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">À venir</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <span className="text-xs font-bold">{completed}</span>
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Terminées</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <CalendarCheck2 className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Aucune visite pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((visit) => {
            const property = propertyById(visit.propertyId);
            return (
              <div
                key={visit.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
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
                <StatusBadge
                  className={cn(
                    "shrink-0 self-start sm:self-center",
                    visitStatusBadge[visit.status]
                  )}
                  label={visitStatusLabel[visit.status] ?? visit.status}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
