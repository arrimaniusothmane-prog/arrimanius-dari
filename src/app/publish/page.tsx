"use client";

import Link from "next/link";
import {
  Upload,
  Inbox,
  HandCoins,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "1",
    icon: Upload,
    title: "Publiez",
    description:
      "Décrivez votre bien en quelques minutes avec photos, description et prix. Votre annonce passe ensuite en revue par notre équipe.",
  },
  {
    number: "2",
    icon: Inbox,
    title: "Recevez des leads",
    description:
      "Les acheteurs intéressés vous contactent directement. Visites, demandes et offres arrivent dans votre espace vendeur.",
  },
  {
    number: "3",
    icon: HandCoins,
    title: "Vendez",
    description:
      "Négociez, organisez les visites et finalisez la transaction accompagné par nos conseillers immobiliers.",
  },
];

const trustItems = [
  {
    icon: ShieldCheck,
    text: "Publication gratuite",
  },
  {
    icon: BadgeCheck,
    text: "Annonce validée par nos équipes",
  },
  {
    icon: HandCoins,
    text: "Commission de succès 2%",
  },
];

const faqItems = [
  {
    question: "Quels types de biens puis-je publier ?",
    answer:
      "Vous pouvez publier des appartements, villas, maisons, terrains et locaux commerciaux au Maroc. Chaque annonce doit inclure au moins 3 photos, une description détaillée et un prix de vente. Les biens sont vérifiés par notre équipe avant publication.",
  },
  {
    question: "Combien de temps dure la publication ?",
    answer:
      "Après soumission, votre annonce est examinée par nos équipes sous 24 à 48 heures ouvrées. Vous recevez une notification une fois l'annonce approuvée et mise en ligne. En cas de refus, nous vous indiquons les corrections à apporter.",
  },
  {
    question: "Quand paie-t-on la commission ?",
    answer:
      "La commission de 2% n'est due qu'au moment de la finalisation de la vente. Aucun frais n'est demandé pour la publication, la mise en avant ou la gestion des leads. Vous ne payez que si votre bien est vendu via DarEstate.",
  },
];

export default function PublishPage() {
  const { user } = useAuth();
  const isSeller =
    user?.role === "SELLER" || user?.role === "AGENT" || user?.role === "ADMIN";

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-sand py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gold/15">
              <Upload className="size-8 text-gold" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl lg:text-5xl">
              Publier un bien sur{" "}
              <span className="font-serif italic text-gold">DarEstate</span>
            </h1>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              Mettez en vente votre appartement, villa ou terrain au Maroc en
              quelques minutes. Gratuit, simple et sécurisé.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/seller/add">
                <Button
                  size="lg"
                  className="rounded-full bg-gold text-white hover:bg-gold/90"
                >
                  Commencer la publication{" "}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <a href="#conditions">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full"
                >
                  Voir les conditions
                </Button>
              </a>
            </div>

            {isSeller && (
              <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-medium text-gold">
                <CheckCircle2 className="size-4" />
                Vous êtes connecté en tant que vendeur —{" "}
                <Link href="/seller/add" className="underline">
                  continuez directement
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Comment ça marche
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              3 étapes pour vendre
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-border/60 bg-card p-6 text-center"
                >
                  <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-gold font-display text-lg font-bold text-white">
                    {step.number}
                  </span>
                  <div className="mx-auto mt-4 flex size-10 items-center justify-center rounded-xl bg-sand">
                    <Icon className="size-5 text-gold" />
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="bg-sand py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
              <div className="text-center">
                <h2 className="font-display text-xl font-semibold">
                  Pourquoi publier sur DarEstate ?
                </h2>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {trustItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex flex-col items-center text-center">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-gold/15">
                        <Icon className="size-6 text-gold" />
                      </div>
                      <p className="mt-3 text-sm font-medium">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Conditions */}
      <section id="conditions" className="py-20 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Conditions
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Questions fréquentes
            </h2>
          </div>

          <div className="mx-auto mt-10 max-w-2xl space-y-4">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-border/60 bg-card"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 font-display text-sm font-semibold select-none [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="ml-4 shrink-0 rounded-full bg-sand p-1 transition-transform group-open:rotate-45">
                    <svg
                      className="size-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/seller/add">
              <Button
                size="lg"
                className="rounded-full bg-gold text-white hover:bg-gold/90"
              >
                Commencer la publication{" "}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
