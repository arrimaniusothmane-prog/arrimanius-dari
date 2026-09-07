"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Inbox, Phone } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getLeads } from "@/services/leadService";
import { mockProperties } from "@/data/properties";
import { LeadStatus } from "@/types";
import type { Lead } from "@/types";
import { formatDate, cn } from "@/lib/utils";

const statusLabel: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: "Nouveau",
  [LeadStatus.CONTACTED]: "Contacté",
  [LeadStatus.VISIT_REQUESTED]: "Visite demandée",
  [LeadStatus.VISIT_COMPLETED]: "Visite effectuée",
  [LeadStatus.OFFER_MADE]: "Offre faite",
  [LeadStatus.NEGOTIATION]: "Négociation",
  [LeadStatus.SOLD]: "Vendu",
  [LeadStatus.CANCELLED]: "Annulé",
};

const statusBadge: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  [LeadStatus.CONTACTED]: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  [LeadStatus.VISIT_REQUESTED]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [LeadStatus.VISIT_COMPLETED]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [LeadStatus.OFFER_MADE]: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  [LeadStatus.NEGOTIATION]: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  [LeadStatus.SOLD]: "bg-gold/20 text-gold",
  [LeadStatus.CANCELLED]: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

function propertyFor(propertyId: string) {
  return mockProperties.find((p) => p.id === propertyId);
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeads()
      .then(setLeads)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const newest = leads.filter((l) => l.status === LeadStatus.NEW).length;
  const contacted = leads.filter((l) => l.status === LeadStatus.CONTACTED).length;
  const visitRequested = leads.filter(
    (l) => l.status === LeadStatus.VISIT_REQUESTED
  ).length;

  const sorted = [...leads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <DashboardHeader
        title="Leads"
        subtitle="Suivez toutes les demandes de contact sur la plateforme."
      />

      {/* Summary chips */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <span className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
            <span className="text-xs font-bold">{newest}</span>
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Nouveaux</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <span className="flex size-6 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300">
            <span className="text-xs font-bold">{contacted}</span>
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Contactés</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <span className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            <span className="text-xs font-bold">{visitRequested}</span>
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Visites demandées</span>
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
          <Inbox className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Aucun lead pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((lead) => {
            const property = propertyFor(lead.propertyId);
            return (
              <div
                key={lead.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sand text-gold">
                    <span className="font-display text-sm font-semibold">
                      {lead.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{lead.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      <Link
                        href={property ? `/properties/${property.slug}` : "#"}
                        className="text-gold hover:underline"
                      >
                        {property?.title ?? "Bien"}
                      </Link>
                      <span className="mx-1.5">·</span>
                      {formatDate(lead.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Phone className="size-3.5" /> {lead.phone}</span>
                  <Badge className={cn("shrink-0 border-transparent", statusBadge[lead.status])}>
                    {statusLabel[lead.status]}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
