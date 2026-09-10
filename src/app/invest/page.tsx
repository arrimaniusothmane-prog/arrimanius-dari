import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  TrendingUp,
  Building2,
  ShieldCheck,
  ArrowUpRight,
  Home,
  Landmark,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Investir dans l'immobilier au Maroc",
  description:
    "Découvrez les opportunités d'investissement immobilier au Maroc avec DarEstate. Rendements locatifs attractifs, programmes neufs premium et accompagnement juridique complet.",
  alternates: {
    canonical: "/invest",
    languages: { fr: "/invest", en: "/invest", ar: "/invest" },
  },
};

const stats = [
  { value: "15%", label: "croissance annuelle moyenne" },
  { value: "6", label: "grandes villes couvertes" },
  { value: "200+", label: "biens d'investissement" },
  { value: "2%", label: "commission de succès" },
];

const reasons = [
  {
    icon: MapPin,
    title: "Emplacement stratégique",
    description:
      "Le Maroc, à 14 km de l'Europe, est une porte d'entrée entre continents et un hub économique en pleine expansion.",
  },
  {
    icon: TrendingUp,
    title: "Rendements locatifs attractifs",
    description:
      "Une demande locative soutenue dans les grandes villes offre des rendements locatifs réguliers et intéressants.",
  },
  {
    icon: Building2,
    title: "Programmes neufs premium",
    description:
      "Des résidences neuves et des programmes haut de gamme dans les quartiers les plus porteurs du royaume.",
  },
  {
    icon: ShieldCheck,
    title: "Accompagnement juridique",
    description:
      "Transaction, notaire, fiscalité : notre équipe vous guide à chaque étape légale de votre investissement.",
  },
];

const investmentTypes = [
  {
    icon: Home,
    title: "Résidence à louer",
    description: "Investissez dans un appartement et générez un revenu locatif récurrent.",
    href: "/properties?category=APARTMENT",
  },
  {
    icon: Landmark,
    title: "Villa pied-à-terre",
    description: "Une villa premium pour profiter du Maroc tout en valorisant votre capital.",
    href: "/properties?category=VILLA",
  },
  {
    icon: MapPin,
    title: "Terrain résidentiel",
    description: "Achetez un terrain et construisez le projet immobilier de vos ambitions.",
    href: "/properties?category=LAND",
  },
  {
    icon: Store,
    title: "Local commercial",
    description: "Un emplacement commercial stratégique pour votre activité ou une location.",
    href: "/properties?category=COMMERCIAL",
  },
];

export default function InvestPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=2000&h=1300&fit=crop"
          alt="Immeuble moderne premium au Maroc"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <TrendingUp className="size-4 text-gold" /> Investissement immobilier
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Investissez là où{" "}
              <span className="font-serif italic text-gold">le marché grandit.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Le marché immobilier marocain connaît une croissance soutenue et
              une demande locative en hausse. Profitez d&apos;une sélection de biens
              d&apos;investissement vérifiés dans tout le royaume.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/properties">
                <Button size="lg" className="rounded-full bg-gold text-white hover:bg-gold/90">
                  Découvrir les opportunités <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Parler à un conseiller
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-border/60 bg-sand/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-center sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl font-semibold text-gold">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why invest */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Le potentiel marocain
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Pourquoi investir au Maroc ?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Une économie dynamique, une demande locative soutenue et des
              prix encore accessibles : le Maroc est une destination
              d&apos;investissement de premier plan.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.title}
                  className="group rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {r.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Investment types */}
      <section className="bg-sand/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Votre profil d&apos;investissement
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Types d&apos;investissement
            </h2>
            <p className="mt-4 text-muted-foreground">
              Choisissez la stratégie qui correspond à vos objectifs et
              parcourez les biens disponibles dans chaque catégorie.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {investmentTypes.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.title}
                  href={t.href}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t.description}
                  </p>
                  <span className="mt-4 flex items-center gap-1 text-sm font-medium text-gold">
                    Voir les biens <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
          <TrendingUp className="mx-auto size-8 text-gold" />
          <h2 className="mt-4 font-display text-3xl font-semibold text-white">
            Investissez avec un partenaire de confiance
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/70">
            Nos conseillers vous accompagnent dans la sélection, la visite et la
            finalisation de votre investissement au Maroc.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <Button size="lg" className="rounded-full bg-gold text-white hover:bg-gold/90">
                Parler à un conseiller <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/properties">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Explorer les biens
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
