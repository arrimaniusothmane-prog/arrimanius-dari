import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Megaphone,
  LayoutDashboard,
  Users,
  Wrench,
  GraduationCap,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Espace Professionnel & Agences",
  description:
    "Rejoignez le réseau immobilier professionnel DarEstate au Maroc. Programme agences dédié, diffusion multi-canal, leads prioritaires et outils de gestion avancés.",
  alternates: {
    canonical: "/agent",
    languages: { fr: "/agent", en: "/agent", ar: "/agent" },
  },
};

const benefits = [
  {
    icon: Building2,
    title: "Programme agences dédié",
    description:
      "Un accompagnement sur mesure et des conditions avantageuses spécialement conçus pour les agences immobilières.",
  },
  {
    icon: Megaphone,
    title: "Diffusion multi-canal",
    description:
      "Vos annonces sont visibles sur l'ensemble de nos canaux pour une portée maximale auprès des acheteurs.",
  },
  {
    icon: LayoutDashboard,
    title: "Tableau de bord avancé",
    description:
      "Suivez vos performances, vos annonces et vos leads en temps réel depuis un tableau de bord complet et clair.",
  },
  {
    icon: Users,
    title: "Leads prioritaires",
    description:
      "Recevez en priorité les demandes qualifiées de visiteurs réellement intéressés par vos biens.",
  },
  {
    icon: Wrench,
    title: "Outils de gestion",
    description:
      "Publication rapide, gestion des visites, offres et clients : tous vos outils réunis en un seul espace.",
  },
  {
    icon: GraduationCap,
    title: "Formation & support",
    description:
      "Profitez de formations sur les bonnes pratiques et d'un support dédié pour développer votre activité.",
  },
];

export default function AgentPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[65vh] items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=2000&h=1300&fit=crop"
          alt="Agence immobilière professionnelle moderne"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <ShieldCheck className="size-4 text-gold" /> Espace Professionnel
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Le réseau immobilier{" "}
              <span className="font-serif italic text-gold">professionnel</span> au Maroc.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Agences et agents indépendants : développez votre activité avec
              une plateforme performante, des leads qualifiés et un
              accompagnement dédié.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact">
                <Button size="lg" className="rounded-full bg-gold text-white hover:bg-gold/90">
                  Devenir partenaire <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Créer un compte pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Nos avantages
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Tout pour faire grandir votre activité
            </h2>
            <p className="mt-4 text-muted-foreground">
              Un programme complet pensé pour les professionnels de
              l&apos;immobilier au Maroc.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="group rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing hint */}
      <section className="bg-sand/50 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-semibold text-gold">
            <TrendingDown className="size-4" /> Commission compétitive
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            Une commission à partir de{" "}
            <span className="font-serif italic text-gold">1,5%</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Bénéficiez de conditions tarifaires avantageuses dès votre
            adhésion au réseau professionnel DarEstate. Contactez-nous pour
            une offre personnalisée selon votre volume d&apos;activité.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
          <Building2 className="mx-auto size-8 text-gold" />
          <h2 className="mt-4 font-display text-3xl font-semibold text-white">
            Rejoignez le réseau DarEstate
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/70">
            Devenez partenaire et accédez à un réseau d&apos;acheteurs qualifiés et
            à des outils pensés pour les professionnels.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <Button size="lg" className="rounded-full bg-gold text-white hover:bg-gold/90">
                Devenir partenaire <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Créer un compte pro
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
