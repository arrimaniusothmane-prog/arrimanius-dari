import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import { getProperties } from "@/services/propertyService";
import { HeroSearch } from "@/components/sections/hero-search";
import { FeaturedProperties } from "@/components/sections/featured-properties";
import { PropertyCategory } from "@/types";
import { Button } from "@/components/ui/button";

const categories: {
  value: PropertyCategory;
  title: string;
  description: string;
}[] = [
  { value: PropertyCategory.VILLA, title: "Villas", description: "Plain-pied, piscine, palmiers" },
  { value: PropertyCategory.APARTMENT, title: "Appartements", description: "Résidences neuves et premium" },
  { value: PropertyCategory.HOUSE, title: "Maisons", description: "De ville et familiales" },
  { value: PropertyCategory.LAND, title: "Terrains", description: "Constructibles et résidentiels" },
  { value: PropertyCategory.COMMERCIAL, title: "Locaux", description: "Boutiques, bureaux, activités" },
];

export default async function HomePage() {
  const properties = await getProperties();
  const verified = properties.filter((p) => p.isVerified).length;
  const cities = new Set(properties.map((p) => p.address.city)).size;
  const countByCategory = (value: PropertyCategory) =>
    properties.filter((p) => p.category === value).length;

  return (
    <div>
      {/* HERO */}
      <section className="relative flex min-h-[94svh] items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&h=1600&fit=crop"
          alt="Villa moderne baignée de lumière dorée au Maroc"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-40 sm:px-6 lg:px-8">
          {/* Headline — the single visual statement */}
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-hero text-balance text-white">
              Trouvez un bien qui vaut la peine{" "}
              <span className="italic text-gold">d&apos;être appelé maison.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-white/80 sm:text-lg">
              Appartements, villas et terrains sélectionnés — Casablanca,
              Marrakech, Rabat. Des biens vérifiés, un accompagnement de la
              visite à la signature.
            </p>
          </div>

          {/* Glass search */}
          <div className="mx-auto mt-10 max-w-4xl">
            <HeroSearch />
          </div>

          {/* Trust stats */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-6 sm:grid-cols-4">
            <Stat value={String(properties.length)} label="Biens en ligne" />
            <Stat value={String(verified)} label="Annonces vérifiées" />
            <Stat value={String(cities)} label="Villes couvertes" />
            <Stat value="4.9/5" label="Note moyenne acheteurs" />
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <FeaturedProperties />

      {/* CATEGORIES — editorial index */}
      <section className="border-y border-line bg-sand/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-2">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Parcourir par type
            </h2>
            <p className="max-w-md text-muted-foreground">
              Toutes les annonces vérifiées, classées par nature de bien.
            </p>
          </div>

          <div className="divide-y divide-border/70 border-y border-border/70">
            {categories.map((c) => (
              <Link
                key={c.value}
                href={`/properties?category=${c.value}`}
                className="group flex items-center justify-between gap-6 py-6 transition-colors sm:py-8"
              >
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-semibold transition-colors group-hover:text-gold-strong sm:text-3xl">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <span className="tnum text-sm font-medium text-muted-foreground">
                    {countByCategory(c.value)} biens
                  </span>
                  <span className="flex size-11 items-center justify-center rounded-full border border-border bg-card transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-right">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-medium text-gold-strong hover:underline"
            >
              Voir toutes les annonces <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST — quiet strip */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, text: "Chaque annonce est contrôlée avant publication." },
              { icon: BadgeCheck, text: "Propriétaires et agences certifiés." },
              { icon: CalendarCheck, text: "Visites organisées et accompagnées." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-strong">
                    <Icon className="size-4.5" />
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative overflow-hidden bg-ink py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:px-8">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="font-display text-3xl font-semibold text-white">
              Vous êtes propriétaire ou agent immobilier ?
            </h2>
            <p className="mt-3 text-pretty text-white/70">
              Publiez votre bien en quelques minutes et recevez des demandes
              qualifiées de la part d&apos;acheteurs sérieux.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/publish">
              <Button size="lg" className="rounded-full bg-gold text-ink hover:bg-gold/90">
                Publier un bien
              </Button>
            </Link>
            <Link href="/seller">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Espace vendeur
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <p className="tnum font-display text-2xl font-semibold text-white">{value}</p>
      <p className="mt-0.5 text-xs text-white/60">{label}</p>
    </div>
  );
}