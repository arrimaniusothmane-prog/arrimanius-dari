import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Upload,
  Users,
  CalendarCheck2,
  HandCoins,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Vendre un bien immobilier au Maroc",
  description:
    "Vendez votre maison, villa ou appartement au Maroc avec DarEstate. Publiez gratuitement, recevez des leads qualifiés et finalisez votre vente accompagné.",
};

const benefits = [
  {
    icon: Upload,
    title: "Publication en quelques minutes",
    description:
      "Publiez votre bien en 7 étapes simples avec photos et description. Votre annonce est visible dès validation.",
  },
  {
    icon: Users,
    title: "Leads qualifiés",
    description:
      "Recevez uniquement des demandes sérieuses : contacts, demandes de visite et offres, organisées dans votre espace vendeur.",
  },
  {
    icon: CalendarCheck2,
    title: "Visites organisées",
    description:
      "Un conseiller DarEstate orchestre vos visites et vous prépare un planning clair, pour vous concentrer sur l'essentiel.",
  },
  {
    icon: HandCoins,
    title: "Commission de succès seulement",
    description:
      "Aucun frais de publication. DarEstate ne perçoit qu'une commission sur les ventes finalisées — 2% en moyenne.",
  },
];

export default function SellPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000&h=1300&fit=crop"
          alt="Maison moderne à vendre"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <ShieldCheck className="size-4 text-gold" /> Publication gratuite
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Vendez mieux,{" "}
              <span className="font-serif italic text-gold">plus vite.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Propriétaires, agences et professionnels : publiez vos biens,
              gérez vos leads et finalisez vos transactions avec une plateforme
              pensée pour la vente.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/seller/add">
                <Button size="lg" className="rounded-full bg-gold text-white hover:bg-gold/90">
                  Publier un bien <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/seller">
                <Button size="lg" variant="outline" className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  Découvrir l&apos;espace vendeur
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
              Pourquoi vendre ici
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Une plateforme conçue pour la performance
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
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

      {/* Commission model */}
      <section className="bg-ink py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Un modèle transparent
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Une commission de succès uniquement
            </h2>
            <p className="mt-4 text-white/70">
              Vous ne payez rien pour publier. DarEstate ne gagne que lorsque
              votre vente aboutit.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-sm text-white/60">Prix de vente</p>
              <p className="mt-2 font-display text-2xl font-semibold text-gold">
                1 500 000 MAD
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-sm text-white/60">Commission DarEstate</p>
              <p className="mt-2 font-display text-2xl font-semibold">2%</p>
            </div>
            <div className="rounded-2xl border border-gold/30 bg-gold/10 p-6 text-center">
              <p className="text-sm text-white/60">Frais de succès</p>
              <p className="mt-2 font-display text-2xl font-semibold text-gold">
                30 000 MAD
              </p>
            </div>
          </div>

          <div className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70">
            <TrendingUp className="size-5 shrink-0 text-gold" />
            Votre bien vendu, c&apos;est notre réussite. C&apos;est pourquoi nous
            investissons dans la visibilité de vos annonces et la qualité des
            acheteurs.
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold">
              En route vers la vente
            </h2>
          </div>
          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-start">
            {[
              { n: "1", t: "Publiez", d: "Photos, description, prix : votre annonce en ligne est prête." },
              { n: "2", t: "Recevez des leads", d: "Demandes de contact, visites et offres arrivent dans votre tableau de bord." },
              { n: "3", t: "Finalisez", d: "Négociez, signez et concluez avec l'appui de nos conseillers." },
            ].map((s) => (
              <div key={s.n} className="relative flex-1 rounded-2xl border border-border/60 bg-card p-6 text-center">
                <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-gold font-display text-lg font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/seller/add">
              <Button size="lg" className="rounded-full">
                Publier mon bien maintenant <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}