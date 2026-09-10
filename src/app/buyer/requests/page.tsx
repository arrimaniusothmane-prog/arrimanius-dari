"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Inbox, X, Loader2 } from "lucide-react";
import { LeadStatus } from "@/types";
import type { Lead } from "@/types";
import { getLeads, updateLeadStatus } from "@/services/leadService";
import { propertyById, leadStatusLabel, leadStatusBadge } from "@/lib/labels";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

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
  const [requests, setRequests] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { user } = useAuth();
  const buyerId = user?.id ?? "buyer-1";

  useEffect(() => {
    getLeads()
      .then((all) =>
        setRequests(
          all
            .filter(
              (l) => l.buyerId === buyerId && l.status !== LeadStatus.CANCELLED
            )
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
        )
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [buyerId]);

  const cancelRequest = async (id: string) => {
    setCancellingId(id);
    try {
      const updated = await updateLeadStatus(id, LeadStatus.CANCELLED);
      if (updated) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Mes demandes"
        subtitle="Toutes les demandes envoyées aux vendeurs."
      />

      {loading ? (
        <div className="space-y-4">
          <div className="h-40 rounded-2xl bg-muted/50" />
          <div className="h-40 rounded-2xl bg-muted/50" />
        </div>
      ) : requests.length === 0 ? (
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
            const property = propertyById(request.propertyId);
            return (
              <div
                key={request.id}
                className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        className={leadStatusBadge[request.status]}
                        label={leadStatusLabel[request.status]}
                      />
                      <span className="text-xs text-muted-foreground">
                        {relativeDate(request.createdAt)}
                      </span>
                    </div>
                    <Link
                      href={
                        property
                          ? `/properties/${property.slug}`
                          : "/properties"
                      }
                      className="mt-2 block font-display text-base font-semibold text-foreground hover:text-primary"
                    >
                      {property?.title ?? "Bien"}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {request.name} · {request.phone}
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
                      disabled={cancellingId === request.id}
                      onClick={() => cancelRequest(request.id)}
                    >
                      {cancellingId === request.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <X className="size-3.5" />
                      )}{" "}
                      Annuler
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