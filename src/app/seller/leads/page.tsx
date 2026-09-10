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
import {
  propertyById,
  leadStatusLabel,
  leadStatusBadge,
  leadStatusOrder,
} from "@/lib/labels";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { useCurrentSellerId } from "@/hooks/useCurrentSeller";

export default function SellerLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sellerId = useCurrentSellerId();

  useEffect(() => {
    getLeads()
      .then((all) => setLeads(all.filter((l) => l.sellerId === sellerId)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sellerId]);

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
            const property = propertyById(lead.propertyId);
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
                          <StatusBadge
                            className={leadStatusBadge[lead.status]}
                            label={leadStatusLabel[lead.status]}
                          />
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
                            {leadStatusLabel[s]}
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