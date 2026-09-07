"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin, Bath, BedDouble, Ruler, Heart, BadgeCheck, ArrowRight } from "lucide-react";
import type { Property } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const categoryLabels: Record<string, string> = {
  APARTMENT: "Appartement",
  VILLA: "Villa",
  HOUSE: "Maison",
  LAND: "Terrain",
  COMMERCIAL: "Commercial",
};

export function PropertyListRow({ property }: { property: Property }) {
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(property.favoriteCount > 20);

  const primaryImage = property.images.find((i) => i.isPrimary) ?? property.images[0];

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-lg sm:flex-row">
      {/* Image */}
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden sm:aspect-auto sm:w-72">
        {primaryImage && !imageError ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || property.title}
            fill
            sizes="288px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
            {categoryLabels[property.category]}
          </div>
        )}
        <Badge className="absolute left-3 top-3 bg-black/40 text-white backdrop-blur-md">
          {categoryLabels[property.category]}
        </Badge>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className={cn(
            "absolute right-3 top-3 flex size-8 items-center justify-center rounded-full backdrop-blur-md transition-all",
            isFavorite ? "bg-gold text-white" : "bg-black/30 text-white hover:bg-black/50"
          )}
          aria-label="Favori"
        >
          <Heart className={cn("size-4", isFavorite && "fill-current")} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {property.isVerified && (
                <BadgeCheck className="size-4 shrink-0 text-gold" />
              )}
              <h3 className="truncate font-display text-lg font-semibold">
                {property.title}
              </h3>
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {property.address.city}
            </p>
          </div>
          <p className="shrink-0 font-display text-xl font-semibold text-primary">
            {formatPrice(property.price)}
          </p>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {property.description}
        </p>

        <div className="mt-4 flex items-center gap-4 border-t border-border/60 pt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Ruler className="size-4" /> {property.surface} m²
          </span>
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="size-4" /> {property.bedrooms} ch
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath className="size-4" /> {property.bathrooms} sdb
            </span>
          )}
          <span className="ml-auto hidden items-center gap-1 font-medium text-gold sm:flex">
            Voir le bien <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
}