"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Eye,
  Inbox,
  CalendarCheck2,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import type { Property, Lead } from "@/types";
import { getProperties } from "@/services/propertyService";
import { getLeads, getVisits, getOffers } from "@/services/leadService";
import { mockProperties } from "@/data/properties";
import { DashboardHeader, StatCard } from "@/components/dashboard/dashboard-shell";
import { PropertyCard } from "@/components/property/property-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useCurrentSellerId } from "@/hooks/useCurrentSeller";

const leadStatusLabel: Record<string, string> = {
  NEW: "Nouveau",
  CONTACTED: "Contacté",
  VISIT_REQUESTED: "Visite demandée",
  VISIT_COMPLETED: "Visite effectuée",
  OFFER_MADE: "Offre faite",
  NEGOTIATION: "Négociation",
  SOLD: "Vendu",
  CANCELLED: "Annulé",
};

const leadStatusBadge: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  CONTACTED: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  VISIT_REQUESTED: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  VISIT_COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  OFFER_MADE: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  NEGOTIATION: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  SOLD: "bg-gold/20 text-gold",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

const weeklyViews = [42, 58, 34, 61, 79, 52, 88, 67, 96, 73, 112, 84, 105];

export default function SellerOverviewPage() {
  const { user } = useAuth();
  const sellerId = useCurrentSellerId();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [stats, setStats] = useState<{ visits: number; offers: number }>({
    visits: 0,
    offers: 0,
  });

  useEffect(() => {
    getProperties()
      .then((all) => setProperties(all.filter((p) => p.sellerId === sellerId)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sellerId]);

  useEffect(() => {
    Promise.all([getProperties(), getLeads(), getVisits(), getOffers()])
      .then(([all, l, v, o]) => {
        const myProps = all.filter((p) => p.sellerId === sellerId);
        const myLeads = l.filter((lead) => lead.sellerId === sellerId);
        const myLeadIds = new Set(myLeads.map((lead) => lead.id));
        const myPropIds = new Set(myProps.map((p) => p.id));
        setLeads(myLeads);
        setStats({
          visits: v.filter((visit) => myLeadIds.has(visit.leadId)).length,
          offers: o.filter((offer) => myPropIds.has(offer.propertyId)).length,
        });
      })
      .catch(() => {})
      .finally(() => setActivityLoading(false));
  }, [sellerId]);

  const published = properties.filter(
    (p) => p.status === "PUBLISHED" || p.status === "PAUSED"
  ).length;
  const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
  const soldCount = properties.filter((p) => p.status === "SOLD").length;

  const viewsTrend = (() => {
    if (loading || published === 0 || weeklyViews.length < 2) return undefined;
    const first = weeklyViews[0];
    const last = weeklyViews[weeklyViews.length - 1];
    if (first === 0) return undefined;
    const delta = Math.round(((last - first) / first) * 100);
    return `${delta > 0 ? "+" : ""}${delta}% vs la première semaine`;
  })();

  const propertyTitle = useCallback(
    (propertyId: string) =>
      mockProperties.find((p) => p.id === propertyId)?.title ?? "Bien",
    []
  );

  const propertySlug = useCallback(
    (propertyId: string) =>
      mockProperties.find((p) => p.id === propertyId)?.slug,
    []
  );

  const recentListings = [...properties]
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  const maxViews = Math.max(...weeklyViews);

  const leadBadge = (status: string) => cn("border-transparent", leadStatusBadge[status] ?? leadStatusBadge.NEW);

  return (
    <div>
      <DashboardHeader
        title="Espace vendeur"
        subtitle={user?.name ? `${user.name}, suivez la performance de vos annonces.` : "Suivez la performance de vos annonces."}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <StatCard icon={Building2} label="Annonces actives" value={loading ? "…" : published} hint={soldCount > 0 ? `${soldCount} bien${soldCount > 1 ? "s" : ""} vendu${soldCount > 1 ? "s" : ""}` : undefined} />
        <StatCard icon={Eye} label="Vues totales" value={loading ? "…" : totalViews} hint={viewsTrend} />
        <StatCard icon={Inbox} label="Leads" value={activityLoading ? "…" : leads.length} />
        <StatCard icon={CalendarCheck2} label="Visites" value={activityLoading ? "…" : stats.visits} />
        <StatCard icon={FileCheck} label="Offres" value={activityLoading ? "…" : stats.offers} accent />
      </div>

      {/* Performance */}
      {!loading && properties.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border/60 bg-card p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-sand text-gold">
            <Eye className="size-6" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold">Performance</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Publiez votre premier bien pour suivre ici les vues, visites et
            demandes reçues.
          </p>
          <Link href="/seller/add" className="mt-5 inline-block">
            <Button className="rounded-full bg-gold text-white hover:bg-gold/90">
              <Building2 className="size-4" /> Ajouter mon premier bien
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Performance</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Vues sur vos annonces, 13 dernières semaines
              </p>
            </div>
          </div>
          <div className="mt-6 flex h-40 items-end gap-1.5 sm:gap-2">
            {weeklyViews.map((value, i) => (
              <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className={cn(
                      "w-full rounded-t-lg transition-all duration-300 group-hover:brightness-110",
                      i === weeklyViews.length - 1
                        ? "bg-gold shadow-lg shadow-gold/20"
                        : "bg-gold/35 group-hover:bg-gold/55"
                    )}
                    style={{ height: `${(value / maxViews) * 100}%` }}
                  />
                  <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1.5 sm:gap-2">
            {weeklyViews.map((_, i) => (
              <span key={i} className="flex-1 text-center text-[10px] text-muted-foreground">
                S{46 + i}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent leads */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Derniers leads</h2>
          <Link
            href="/seller/leads"
            className="flex items-center gap-1 text-sm font-medium text-gold hover:underline"
          >
            Voir tout <ArrowRight className="size-4" />
          </Link>
        </div>
        {activityLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">Aucun lead pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.slice(0, 4).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sand text-gold">
                  <span className="font-display text-sm font-semibold">
                    {lead.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{lead.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {propertySlug(lead.propertyId) ? (
                      <Link
                        href={`/properties/${propertySlug(lead.propertyId)}`}
                        className="text-gold hover:underline"
                      >
                        {propertyTitle(lead.propertyId)}
                      </Link>
                    ) : (
                      propertyTitle(lead.propertyId)
                    )}
                    <span className="mx-1.5">·</span>
                    {formatDate(lead.createdAt)}
                  </p>
                </div>
                <Badge className={leadBadge(lead.status)}>
                  {leadStatusLabel[lead.status] ?? lead.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Latest properties */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Mes derniers biens</h2>
          <Link
            href="/seller/properties"
            className="flex items-center gap-1 text-sm font-medium text-gold hover:underline"
          >
            Gérer mes biens <ArrowRight className="size-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        ) : recentListings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Vous n&apos;avez pas encore de biens.{" "}
              <Link href="/seller/add" className="font-medium text-gold hover:underline">
                Ajoutez votre premier bien
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentListings.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}