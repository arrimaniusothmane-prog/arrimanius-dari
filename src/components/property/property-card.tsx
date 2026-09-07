"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MapPin, Bath, BedDouble, Ruler, Heart, BadgeCheck } from "lucide-react";
import type { Property } from "@/types";
import { PropertyCategory } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useProperties";
import { Badge } from "@/components/ui/badge";

const categoryLabels: Record<PropertyCategory, string> = {
  [PropertyCategory.APARTMENT]: "Appartement",
  [PropertyCategory.VILLA]: "Villa",
  [PropertyCategory.HOUSE]: "Maison",
  [PropertyCategory.LAND]: "Terrain",
  [PropertyCategory.COMMERCIAL]: "Commercial",
};

export function PropertyCard({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(property.id);

  const primaryImage = property.images.find((i) => i.isPrimary) ?? property.images[0];

  const onToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  return (
    <Link
      href={`/properties/${property.slug}`}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {primaryImage && !imageError ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <span className="text-4xl font-display text-muted-foreground/40">{categoryLabels[property.category]}</span>
          </div>
        )}

        {/* Category badge */}
        <Badge className="absolute left-3 top-3 bg-black/40 text-white backdrop-blur-md hover:bg-black/50">
          {categoryLabels[property.category]}
        </Badge>

        {/* Favorite */}
        <button
          onClick={onToggleFavorite}
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          className={cn(
            "absolute right-3 top-3 flex size-9 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90",
            isFavorite
              ? "bg-gold text-white"
              : "bg-black/30 text-white hover:bg-black/50"
          )}
        >
          <Heart className={cn("size-4", isFavorite && "fill-current")} />
        </button>

        {/* Verified */}
        {property.isVerified && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm backdrop-blur-md">
            <BadgeCheck className="size-3.5" />
            Vérifié
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[15px] font-semibold leading-snug text-foreground">
              {property.title}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {property.address.city}
            </p>
          </div>
        </div>

        <p className="tnum mt-2 font-display text-xl font-semibold text-foreground">
          {formatPrice(property.price)}
        </p>

        {/* Specs */}
        <div className="mt-3 flex items-center gap-4 border-t border-border/60 pt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Ruler className="size-4" />
            {property.surface} m²
          </span>
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="size-4" />
              {property.bedrooms} ch
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath className="size-4" />
              {property.bathrooms} sdb
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
