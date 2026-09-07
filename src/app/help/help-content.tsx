"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MessageCircleQuestion, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Comment acheter un bien sur DarEstate ?",
    a: "Commencez par parcourir nos biens et utilisez les filtres pour affiner votre recherche. Une fois le bien trouvé, demandez une visite depuis la fiche du bien. Après la visite, notre équipe vous accompagne pour faire une offre, négocier et finaliser la transaction jusqu'à la signature chez le notaire.",
  },
  {
    q: "Comment publier mon bien à vendre ?",
    a: "Créez un compte vendeur puis rendez-vous dans « Publier un bien ». Renseignez les informations demandées en 7 étapes simples : photos, description, prix et caractéristiques. Votre annonce est ensuite vérifiée par notre équipe avant publication, généralement sous 24 à 48 heures.",
  },
  {
    q: "Comment les biens sont-ils vérifiés ?",
    a: "Chaque annonce est contrôlée par notre équipe avant publication. Nous vérifions l'identité du propriétaire, l'authenticité des documents et la cohérence des informations fournies. Les biens validés portent le badge « Vérifié » pour vous garantir leur fiabilité.",
  },
  {
    q: "Comment fonctionnent les visites ?",
    a: "Depuis la fiche d'un bien, cliquez sur « Demander une visite » et précisez vos disponibilités. Notre conseiller organise le rendez-vous avec le vendeur et vous accompagne sur place. Vous pouvez planifier les visites en un clic depuis votre espace acheteur.",
  },
  {
    q: "Quelle est la commission DarEstate ?",
    a: "DarEstate ne facture aucun frais de publication. Nous ne percevons qu'une commission de succès, en moyenne 2%, uniquement lorsque la transaction est finalisée. Vous ne payez rien tant que la vente n'aboutit pas.",
  },
  {
    q: "Comment faire une offre sur un bien ?",
    a: "Sur la fiche du bien, utilisez le bouton « Faire une offre », indiquez votre prix et un message. L'offre est transmise au vendeur qui peut l'accepter, la refuser ou faire une contre-offre. Vous suivez toutes les étapes depuis votre espace acheteur.",
  },
  {
    q: "Quels documents sont nécessaires pour acheter ?",
    a: "Les documents courants comprennent une pièce d'identité (CIN ou passeport), un justificatif de revenus et, le cas échéant, une attestation bancaire. Lors de la finalisation, le notaire vous guide sur les actes de propriété et les titres fonciers nécessaires à la transaction.",
  },
  {
    q: "Comment contacter le support DarEstate ?",
    a: "Notre équipe est joignable par téléphone au +212 5 22 00 00 00 du lundi au vendredi de 9h à 19h, par email à contact@darestimate.ma, ou via le formulaire de la page contact. Nous répondons généralement sous 24 heures ouvrées.",
  },
];

export function HelpContent() {
  const [query, setQuery] = useState("");

  const filteredFaqs = faqs.filter((f) => {
    const needle = query.toLowerCase();
    return (
      f.q.toLowerCase().includes(needle) || f.a.toLowerCase().includes(needle)
    );
  });

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden bg-ink py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <MessageCircleQuestion className="size-4 text-gold" /> Centre d&apos;aide
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Comment pouvons-nous{" "}
              <span className="font-serif italic text-gold">vous aider ?</span>
            </h1>
            <p className="mt-4 text-white/80">
              Recherchez parmi nos questions fréquentes pour trouver une réponse
              rapide.
            </p>
            <div className="relative mx-auto mt-8 max-w-xl">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex : commission, visites, offre..."
                className="h-12 rounded-full bg-white/10 pl-11 text-white placeholder:text-white/40 focus-visible:border-gold"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
              <Search className="mx-auto size-8 text-muted-foreground" />
              <h2 className="mt-4 font-display text-lg font-semibold">
                Aucun résultat pour « {query} »
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Essayez d&apos;autres mots-clés ou contactez notre équipe.
              </p>
              <Link href="/contact" className="mt-5 inline-block">
                <Button className="rounded-full bg-gold text-white hover:bg-gold/90">
                  Nous contacter
                </Button>
              </Link>
            </div>
          ) : (
            <Accordion className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card px-5">
              {filteredFaqs.map((f) => (
                <AccordionItem key={f.q}>
                  <AccordionTrigger className="py-4 font-display text-base font-semibold">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-5 rounded-3xl bg-sand/70 px-6 py-10 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="font-display text-xl font-semibold">
                Une question ?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Notre équipe vous répond sous 24 heures ouvrées.
              </p>
            </div>
            <Link href="/contact">
              <Button size="lg" className="rounded-full bg-gold text-white hover:bg-gold/90">
                Contactez-nous <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}