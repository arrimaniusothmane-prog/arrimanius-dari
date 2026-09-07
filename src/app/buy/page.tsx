import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Heart,
  CalendarCheck2,
  FileCheck,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { getProperties } from "@/services/propertyService";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Acheter un bien immobilier au Maroc",
  description:
    "Achetez votre futur appartement, villa ou terrain au Maroc avec DarEstate. Biens vérifiés, visites organisées et transaction accompagnée.",
};

export default async function BuyPage() {
  const properties = await getProperties();
  const featured = properties.filter((p) => p.isVerified).slice(0, 3);

  const steps = [
    {
      icon: Search,
      title: "Trouvez le bien idéal",
      description:
        "Explorez notre sélection de biens vérifiés et utilisez des filtres précis pour affiner votre recherche.",
    },
    {
      icon: CalendarCheck2,
      title: "Organisez vos visites",
      description:
        "Demandez une visite en un clic. Notre équipe vous accompagne et organise le rendez-vous avec le vendeur.",
    },
    {
      icon: FileCheck,
      title: "Négociez et finalisez",
      description:
        "Faites une offre, négociez en toute transparence et finalisez votre achat avec l'appui de nos conseillers.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=2000&h=1300&fit=crop"
          alt="Appartement lumineux moderne"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <ShieldCheck className="size-4 text-gold" /> Achat accompagné
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Votre futur chez-vous,{" "}
              <span className="font-serif italic text-gold">trouvé simplement.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Appartements, villas, terrains ou locaux commerciaux : découvrez
              des biens vérifiés dans tout le Maroc, avec un accompagnement
              personnalisé de la visite à la signature.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/properties">
                <Button size="lg" className="rounded-full bg-gold text-white hover:bg-gold/90">
                  Parcourir les biens <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Créer mon compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border/60 bg-sand/50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: BadgeCheck, text: "Biens et propriétaires vérifiés" },
            { icon: CalendarCheck2, text: "Visites organisées par nos soins" },
            { icon: ShieldCheck, text: "Transaction sécurisée et accompagnée" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Icon className="size-5" />
                </span>
                <p className="text-sm font-medium">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Comment ça marche
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Acheter avec DarEstate
            </h2>
            <p className="mt-4 text-muted-foreground">
              Trois étapes simples et un accompagnement humain à chaque moment clé.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="absolute right-5 top-4 font-display text-5xl font-semibold text-sand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative flex size-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="relative mt-4 font-display text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-sand/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-gold">
                Pour commencer
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold">
                Nos biens coups de cœur
              </h2>
            </div>
            <Link href="/properties" className="flex items-center gap-1 text-sm font-medium text-gold hover:underline">
              Voir tous les biens <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
          <Heart className="mx-auto size-8 text-gold" />
          <h2 className="mt-4 font-display text-3xl font-semibold text-white">
            Enregistrez vos biens préférés
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/70">
            Créez votre liste de favoris et soyez notifié dès qu&apos;un bien
            correspond à vos critères.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="rounded-full bg-gold text-white hover:bg-gold/90">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="/buyer/favorites">
              <Button size="lg" variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white">
                Voir mes favoris
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}