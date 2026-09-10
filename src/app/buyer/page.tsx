"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Heart, Inbox, CalendarCheck2, FileCheck, ArrowRight, Search } from "lucide-react";
import { useProperties, useFavorites } from "@/hooks/useProperties";
import { getLeads, getVisits, getOffers } from "@/services/leadService";
import { DashboardHeader, StatCard } from "@/components/dashboard/dashboard-shell";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { LeadStatus } from "@/types";
import { useCurrentBuyerId } from "@/hooks/useCurrentBuyer";

export default function BuyerOverviewPage() {
  const { properties, loading } = useProperties();
  const { user } = useAuth();
  const buyerId = useCurrentBuyerId();
  const { favorites } = useFavorites(buyerId);

  const [counts, setCounts] = useState<{
    requests: number;
    visits: number;
    offers: number;
  }>({ requests: 0, visits: 0, offers: 0 });
  const [loadingActivity, setLoadingActivity] = useState(true);

  const firstName = user?.name?.split(" ")[0] ?? "Youssef";
  const greeting = `Bonjour ${firstName} 👋`;

  useEffect(() => {
    Promise.all([getLeads(), getVisits(), getOffers()])
      .then(([l, v, o]) => {
        const myLeadIds = l
          .filter((lead) => lead.buyerId === buyerId)
          .map((lead) => lead.id);
        const myVisits = v.filter((visit) => myLeadIds.includes(visit.leadId));
        setCounts({
          requests: l.filter(
            (lead) =>
              lead.buyerId === buyerId && lead.status !== LeadStatus.CANCELLED
          ).length,
          visits: myVisits.filter(
            (visit) =>
              visit.status === LeadStatus.VISIT_REQUESTED ||
              visit.status === LeadStatus.VISIT_CONFIRMED
          ).length,
          offers: o.filter((offer) => offer.buyerId === buyerId).length,
        });
      })
      .catch(() => {})
      .finally(() => setLoadingActivity(false));
  }, [buyerId]);

  const favoriteProperties = useMemo(
    () => properties.filter((p) => favorites.includes(p.id)).slice(0, 3),
    [properties, favorites]
  );

  return (
    <div>
      <DashboardHeader
        title={greeting}
        subtitle="Voici un aperçu de votre activité immobilière."
      />

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Heart}
          label="Biens favoris"
          value={favorites.length}
          hint={favorites.length > 0 ? "Nouveautés à découvrir cette semaine" : undefined}
        />
        <StatCard icon={Inbox} label="Demandes actives" value={loadingActivity ? "…" : counts.requests} />
        <StatCard icon={CalendarCheck2} label="Visites à venir" value={loadingActivity ? "…" : counts.visits} />
        <StatCard icon={FileCheck} label="Offres en cours" value={loadingActivity ? "…" : counts.offers} accent />
      </div>

      {/* Recent favorites */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Mes derniers favoris</h2>
          <Link
            href="/buyer/favorites"
            className="flex items-center gap-1 text-sm font-medium text-gold hover:underline"
          >
            Voir tout <ArrowRight className="size-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        ) : favoriteProperties.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border/60 bg-card px-6 py-14 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-sand text-gold">
              <Heart className="size-6" />
            </div>
            <h3 className="mt-4 font-display text-base font-semibold">
              Aucun favori pour le moment
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Explorez notre catalogue et enregistrez les biens qui vous
              plaisent pour les retrouver ici.
            </p>
            <Link href="/properties" className="mt-5">
              <Button className="rounded-full bg-gold text-white hover:bg-gold/90">
                <Search className="size-4" /> Rechercher un bien
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-ink p-6 text-white">
          <h3 className="font-display text-lg font-semibold">
            Vous cherchez un bien spécifique ?
          </h3>
          <p className="mt-2 text-sm text-white/70">
            Créez une alerte et soyez notifié dès qu&apos;un bien correspond à vos
            critères.
          </p>
          <Link href="/properties" className="mt-4 inline-block">
            <Button className="rounded-full bg-gold text-white hover:bg-gold/90">
              Rechercher un bien <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <h3 className="font-display text-lg font-semibold">
            Besoin d&apos;aide pour finaliser un achat ?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Nos conseillers DarEstate vous accompagnent à chaque étape,
            de la visite à la transaction.
          </p>
          <Link href="/contact" className="mt-4 inline-block">
            <Button variant="outline" className="rounded-full">
              Contacter un conseiller
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}