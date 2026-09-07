"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Loader2,
  Inbox,
} from "lucide-react";
import type { Lead } from "@/types";
import { LeadStatus } from "@/types";
import { getLeads, updateLeadStatus } from "@/services/leadService";
import { mockProperties } from "@/data/properties";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formatDate, cn } from "@/lib/utils";

const SELLER_ID = "seller-1";

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

const statusBadgeClass: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  [LeadStatus.CONTACTED]: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  [LeadStatus.VISIT_REQUESTED]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [LeadStatus.VISIT_COMPLETED]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [LeadStatus.OFFER_MADE]: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  [LeadStatus.NEGOTIATION]: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  [LeadStatus.SOLD]: "bg-gold/20 text-gold",
  [LeadStatus.CANCELLED]: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

const leadStatusOrder = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.VISIT_REQUESTED,
  LeadStatus.VISIT_COMPLETED,
  LeadStatus.OFFER_MADE,
  LeadStatus.NEGOTIATION,
  LeadStatus.SOLD,
  LeadStatus.CANCELLED,
];

export default function SellerLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLeads()
      .then((all) => setLeads(all.filter((l) => l.sellerId === SELLER_ID)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const propertyFor = (propertyId: string) =>
    mockProperties.find((p) => p.id === propertyId);

  const handleStatusChange = async (lead: Lead, status: LeadStatus) => {
    setUpdatingId(lead.id);
    try {
      const updated = await updateLeadStatus(lead.id, status);
      if (updated) {
        setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      }
    } catch {
      setError("Impossible de mettre à jour le statut.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Leads"
        subtitle="Toutes les demandes reçues sur vos annonces."
      />

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-sand text-gold">
            <Inbox className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold">Aucun lead pour le moment</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Vos nouvelles demandes d&apos;acheteurs apparaîtront ici dès qu&apos;elles seront reçues.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => {
            const property = propertyFor(lead.propertyId);
            return (
              <div
                key={lead.id}
                className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sand text-gold">
                        <span className="font-display text-sm font-semibold">
                          {lead.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-display text-base font-semibold">{lead.name}</p>
                          <Badge className={cn("border-transparent", statusBadgeClass[lead.status])}>
                            {statusLabel[lead.status]}
                          </Badge>
                        </div>
                        <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="size-3.5" />
                          {property ? (
                            <Link
                              href={`/properties/${property.slug}`}
                              className="truncate text-gold hover:underline"
                            >
                              {property.title}
                            </Link>
                          ) : (
                            <span>Bien</span>
                          )}
                          <span className="mx-1">·</span>
                          {formatDate(lead.createdAt)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 rounded-xl bg-sand/60 p-4 text-sm leading-relaxed text-foreground/80">
                      {lead.message}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Mail className="size-4" /> {lead.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="size-4" /> {lead.phone}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 sm:w-44">
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Statut
                    </p>
                    <Select
                      value={lead.status}
                      onValueChange={(v) => handleStatusChange(lead, v as LeadStatus)}
                    >
                      <SelectTrigger
                        size="sm"
                        disabled={updatingId === lead.id}
                        className="w-full"
                      >
                        {updatingId === lead.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : null}
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="end" className="w-48">
                        {leadStatusOrder.map((s) => (
                          <SelectItem key={s} value={s}>
                            {statusLabel[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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