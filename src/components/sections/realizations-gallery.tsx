"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Category =
  | "Construction"
  | "Rénovation"
  | "Agencement"
  | "Architecture intérieure"
  | "Extérieur";

type Project = {
  title: string;
  category: Category;
  location: string;
  surface: string;
  description: string;
  image: string;
};

// Données facilement remplaçables par les vrais projets.
const projects: Project[] = [
  {
    title: "Villa contemporaine",
    category: "Construction",
    location: "Bouskoura",
    surface: "420 m²",
    description:
      "Construction neuve d'une villa moderne : gros œuvre, second œuvre et finitions haut de gamme.",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop",
  },
  {
    title: "Appartement moderne",
    category: "Rénovation",
    location: "Casablanca",
    surface: "130 m²",
    description:
      "Rénovation complète et transformation des espaces intérieurs avec matières et lumière.",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
  },
  {
    title: "Restaurant",
    category: "Agencement",
    location: "Rabat",
    surface: "240 m²",
    description:
      "Conception et agencement complet d'un établissement : matériaux, mobilier et éclairage.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop",
  },
  {
    title: "Bureau open space",
    category: "Architecture intérieure",
    location: "Casablanca",
    surface: "380 m²",
    description:
      "Aménagement intérieur d'un espace de travail : cloisons, acoustique et mobilier sur mesure.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop",
  },
  {
    title: "Terrasse & piscine",
    category: "Extérieur",
    location: "Marrakech",
    surface: "550 m²",
    description:
      "Aménagement extérieur complet : terrasse, pergola, piscine et aménagement paysager.",
    image:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&h=800&fit=crop",
  },
  {
    title: "Maison traditionnelle",
    category: "Rénovation",
    location: "Fès",
    surface: "260 m²",
    description:
      "Rénovation d'une maison traditionnelle en valorisant les matériaux et le patrimoine.",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop",
  },
  {
    title: "Boutique",
    category: "Agencement",
    location: "Casablanca",
    surface: "95 m²",
    description:
      "Agencement sur mesure d'un espace commercial pensé pour accueillir et valoriser la marque.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=800&fit=crop",
  },
];

const filters: ("Tous" | Category)[] = [
  "Tous",
  "Construction",
  "Rénovation",
  "Agencement",
  "Architecture intérieure",
  "Extérieur",
];

const badgeClass: Record<Category, string> = {
  Construction: "bg-gold/15 text-gold",
  Rénovation: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
  Agencement: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
  "Architecture intérieure": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  Extérieur: "bg-orange-500/15 text-orange-600 dark:text-orange-300",
};

export function RealizationsGallery() {
  const [filter, setFilter] = useState<"Tous" | Category>("Tous");
  const visible =
    filter === "Tous" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-medium transition-all",
              filter === f
                ? "border-transparent bg-gold text-white shadow-sm shadow-gold/20"
                : "border-border bg-card text-muted-foreground hover:border-gold/40 hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <article
            key={p.title}
            className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <Badge
                className={cn(
                  "absolute left-4 top-4 border-transparent",
                  badgeClass[p.category]
                )}
              >
                {p.category}
              </Badge>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold">{p.title}</h3>
              <div className="mt-1.5 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-gold" /> {p.location}
                </span>
                <span className="flex items-center gap-1">
                  <Ruler className="size-3.5 text-gold" /> {p.surface}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Sélection d&apos;illustrations — vos réalisations sont affichées ici dès
        leur mise en ligne.
      </p>
    </div>
  );
}