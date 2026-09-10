import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Handshake,
  Gem,
  Headset,
  ArrowRight,
  Eye,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "À propos de DarEstate",
  description:
    "DarEstate, la marketplace immobilière de confiance au Maroc. Découvrez notre mission, nos valeurs et l'histoire de notre plateforme.",
  alternates: {
    canonical: "/about",
    languages: { fr: "/about", en: "/about", ar: "/about" },
  },
};

const values = [
  {
    icon: Eye,
    title: "Transparence",
    description:
      "Des informations claires, des prix affichés et aucune surprise : chaque transaction est menée en toute transparence.",
  },
  {
    icon: Handshake,
    title: "Confiance",
    description:
      "Propriétaires et biens vérifiés, annonces contrôlées : nous bâtons une relation de confiance durable avec chacun.",
  },
  {
    icon: Gem,
    title: "Qualité",
    description:
      "Une sélection exigeante de biens premium et un service soigné, de la première recherche à la signature.",
  },
  {
    icon: Headset,
    title: "Accompagnement",
    description:
      "Une équipe disponible à chaque étape : visites, négociation, documents et finalisation de votre projet.",
  },
];

const stats = [
  { value: "+12 000", label: "visiteurs / mois" },
  { value: "1 500", label: "annonces actives" },
  { value: "4.9/5", label: "satisfaction" },
  { value: "98%", label: "annonces vérifiées" },
];

const timeline = [
  {
    year: "2024",
    title: "Lancement",
    description:
      "DarEstate voit le jour à Casablanca avec une ambition claire : moderniser le marché immobilier marocain.",
  },
  {
    year: "2025",
    title: "Couverture nationale",
    description:
      "La plateforme s'étend aux grandes villes du royaume et passe le cap des 1 500 annonces actives.",
  },
  {
    year: "2026",
    title: "Support AR / FR",
    description:
      "Une expérience bilingue arabe et français pour servir tous les investisseurs et futurs propriétaires.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&h=1300&fit=crop"
          alt="Accueil moderne d'une propriété premium DarEstate"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <Sparkles className="size-4 text-gold" /> Notre histoire
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
              DarEstate, la marketplace immobilière{" "}
              <span className="font-serif italic text-gold">de confiance</span> au Maroc.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Nous connectons acheteurs, investisseurs et professionnels avec
              des biens vérifiés et un accompagnement humain à chaque étape.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Notre mission
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Rendre l&apos;immobilier simple et fiable
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card p-7">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Le marché immobilier marocain souffrait de pratiques peu
                transparentes et d&apos;une expérience fragmentée. DarEstate est né
                d&apos;une conviction simple : trouver ou vendre un bien doit être
                aussi clair que fiable.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Nous avons bâti une plateforme où chaque annonce est vérifiée,
                chaque propriétaire est identifié et chaque transaction est
                accompagnée par des conseillers dédiés. Notre priorité absolue :
                la confiance.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-6 rounded-2xl bg-ink p-7 text-white">
              <div>
                <p className="font-display text-2xl font-semibold text-gold">2%</p>
                <p className="mt-1 text-sm text-white/70">
                  commission de succès uniquement, à la vente finalisée.
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-gold">98%</p>
                <p className="mt-1 text-sm text-white/70">
                  des annonces sont vérifiées avant publication.
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-gold">24/7</p>
                <p className="mt-1 text-sm text-white/70">
                  un accompagnement humain sur tout le territoire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/60 bg-sand/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-center sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl font-semibold text-gold">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Nos valeurs
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Ce qui guide chacune de nos décisions
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="group rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story timeline */}
      <section className="bg-sand/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Notre histoire
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Une croissance bâtie sur la confiance
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            {timeline.map((t) => (
              <div
                key={t.year}
                className="relative rounded-2xl border border-border/60 bg-card p-6"
              >
                <span className="inline-flex items-center rounded-full bg-gold/15 px-3 py-1 text-sm font-semibold text-gold">
                  {t.year}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
          <ShieldCheck className="mx-auto size-8 text-gold" />
          <h2 className="mt-4 font-display text-3xl font-semibold text-white">
            Rejoignez l&apos;aventure DarEstate
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/70">
            Créez un compte et découvrez une nouvelle façon d&apos;acheter, de vendre
            ou d&apos;investir dans l&apos;immobilier au Maroc.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <Button size="lg" className="rounded-full bg-gold text-white hover:bg-gold/90">
                Nous contacter
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Créer un compte <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
