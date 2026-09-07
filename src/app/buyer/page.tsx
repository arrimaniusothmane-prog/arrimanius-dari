"use client";

import Link from "next/link";
import { Heart, Inbox, CalendarCheck2, FileCheck, ArrowRight } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { getLeads, getVisits, getOffers } from "@/services/leadService";
import { DashboardHeader, StatCard } from "@/components/dashboard/dashboard-shell";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

const stats = {
  favorites: 4,
  requests: 6,
  visits: 3,
  offers: 2,
};

export default function BuyerOverviewPage() {
  const { properties, loading } = useProperties();
  const favorites = properties.filter((p) => p.favoriteCount > 20).slice(0, 2);

  const [leads, setLeads] = useState<number>(0);
  const [visits, setVisits] = useState<number>(0);
  const [offers, setOffers] = useState<number>(0);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    Promise.all([getLeads(), getVisits(), getOffers()])
      .then(([l, v, o]) => {
        setLeads(l.length);
        setVisits(v.length);
        setOffers(o.length);
      })
      .finally(() => setLoadingActivity(false));
  }, []);

  return (
    <div>
      <DashboardHeader
        title="Bonjour Youssef 👋"
        subtitle="Voici un aperçu de votre activité immobilière."
      />

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Heart} label="Biens favoris" value={stats.favorites} hint="Nouveautés cette semaine : 2" />
        <StatCard icon={Inbox} label="Demandes actives" value={loadingActivity ? "…" : leads} />
        <StatCard icon={CalendarCheck2} label="Visites à venir" value={loadingActivity ? "…" : visits} />
        <StatCard icon={FileCheck} label="Offres en cours" value={loadingActivity ? "…" : offers} accent />
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
          <div className="grid gap-5 sm:grid-cols-2">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((p) => (
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