"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedProperties() {
  const { properties, loading } = useProperties();

  const featured = properties.filter((p) => p.isVerified).slice(0, 6);

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              À la une
            </span>
            <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
              Biens sélectionnés
            </h2>
            <p className="mt-3 text-muted-foreground">
              Une sélection rigoureuse de biens vérifiés, choisis pour leur
              emplacement et leur qualité.
            </p>
          </div>
          <Link href="/properties">
            <Button variant="outline" className="rounded-full">
              Voir tous les biens
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-border/60">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="space-y-3 p-4">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}