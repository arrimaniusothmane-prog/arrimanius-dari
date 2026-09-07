"use client";

import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
import { useProperties, useFavorites } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function FavoritesContent() {
  const { properties, loading: propertiesLoading } = useProperties();
  const { favorites, loading: favoritesLoading } = useFavorites();

  const loading = propertiesLoading || favoritesLoading;

  const favoriteProperties = properties.filter((p) =>
    favorites.includes(p.id)
  );

  const popularProperties = properties
    .filter((p) => p.isVerified && !favorites.includes(p.id))
    .slice(0, 3);

  const showEmpty = !loading && favoriteProperties.length === 0;

  return (
    <div>
      {/* Header */}
      <section className="bg-sand/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-widest text-gold">
            Votre sélection
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold">
            Mes <span className="font-serif italic text-gold">favoris</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Les biens que vous avez enregistrés pour les retrouver plus tard.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
              ))}
            </div>
          ) : favoriteProperties.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-sand text-gold">
                <Heart className="size-7" />
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold">
                Aucun favori pour le moment
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Parcourez nos biens et enregistrez ceux qui vous plaisent pour
                les retrouver ici, à tout moment.
              </p>
              <Link href="/properties" className="mt-6">
                <Button
                  size="lg"
                  className="rounded-full bg-gold text-white hover:bg-gold/90"
                >
                  Explorer les biens
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Popular suggestions */}
      {showEmpty && (
        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-gold" />
              <h2 className="font-display text-2xl font-semibold">
                Biens populaires
              </h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Une sélection de biens vérifiés pour vous inspirer.
            </p>
            {popularProperties.length > 0 ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {popularProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-border/60 bg-card px-6 py-12 text-center text-sm text-muted-foreground">
                Aucun bien disponible pour le moment.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}