"use client";

import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { useProperties, useFavorites } from "@/hooks/useProperties";
import { PropertyCategory } from "@/types";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentBuyerId } from "@/hooks/useCurrentBuyer";

const categoryTitles: Record<PropertyCategory, string> = {
  [PropertyCategory.APARTMENT]: "Appartements",
  [PropertyCategory.VILLA]: "Villas",
  [PropertyCategory.HOUSE]: "Maisons",
  [PropertyCategory.LAND]: "Terrains",
  [PropertyCategory.COMMERCIAL]: "Commerces",
};

export default function BuyerFavoritesPage() {
  const { properties, loading } = useProperties();
  const buyerId = useCurrentBuyerId();
  const { favorites, loading: favoritesLoading } = useFavorites(buyerId);

  const favoriteProperties = properties.filter((p) =>
    favorites.includes(p.id)
  );

  const groups = Object.values(PropertyCategory)
    .map((category) => ({
      category,
      title: categoryTitles[category],
      items: favoriteProperties.filter((p) => p.category === category),
    }))
    .filter((g) => g.items.length > 0);

  const total = favoriteProperties.length;

  return (
    <div>
      <DashboardHeader
        title="Mes favoris"
        subtitle="Les biens que vous avez enregistrés."
        action={
          <Link href="/properties">
            <Button variant="outline" className="rounded-full">
              <Search className="size-4" /> Rechercher un bien
            </Button>
          </Link>
        }
      />

      {loading || favoritesLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : total === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-sand text-gold">
            <Heart className="size-7" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold">
            Aucun bien dans vos favoris
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Explorez notre catalogue et enregistrez les biens qui vous plaisent
            pour les retrouver ici.
          </p>
          <Link href="/properties" className="mt-5">
            <Button className="rounded-full bg-gold text-white hover:bg-gold/90">
              <Search className="size-4" /> Rechercher des biens
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.category}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="font-display text-lg font-semibold">
                  {group.title}
                </h2>
                <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-gold">
                  {group.items.length}
                </span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}