"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  BadgeCheck,
  BedDouble,
  Bath,
  Ruler,
  CalendarRange,
  Building2,
  Phone,
  Mail,
  Check,
  ShieldCheck,
  Factory,
  Flame,
} from "lucide-react";
import type { Property } from "@/types";
import { formatPrice } from "@/lib/utils";
import { categoryLabel } from "@/lib/labels";
import { PropertyGallery } from "@/components/property/property-gallery";
import { ContactSellerModal } from "@/components/modals/contact-seller-modal";
import { RequestVisitModal } from "@/components/modals/request-visit-modal";
import { MakeOfferModal } from "@/components/modals/make-offer-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PropertyDetail({ property }: { property: Property }) {
  const [contactOpen, setContactOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const seller = property.seller;
  const isLand = property.category === "LAND";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-24 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">Accueil</Link>
        <span>/</span>
        <Link href="/properties" className="transition-colors hover:text-foreground">Biens</Link>
        <span>/</span>
        <span className="text-foreground">{property.address.city}</span>
      </nav>

      {/* Title */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-gold/15 text-gold-strong hover:bg-gold/25">
              {categoryLabel[property.category]}
            </Badge>
            {property.isVerified && (
              <Badge className="bg-[oklch(0.85_0.04_150)] text-[oklch(0.35_0.08_150)] hover:bg-[oklch(0.82_0.04_150)]">
                <BadgeCheck className="mr-1 size-3.5" /> Bien vérifié
              </Badge>
            )}
          </div>
          <h1 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
            {property.title}
          </h1>
          <p className="mt-3 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-4 text-gold-strong" />
            {property.address.street} · {property.address.city}, {property.address.state}
          </p>
        </div>
        <div className="shrink-0 border-t border-border/60 pt-4 lg:border-0 lg:pt-0 lg:text-right">
          <p className="tnum font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {formatPrice(property.price)}
          </p>
          <p className="tnum mt-1.5 text-sm text-muted-foreground">
            {property.surface} m² · Prix au m² : {formatPrice(Math.round(property.price / property.surface))}
          </p>
        </div>
      </div>

      {/* Key stats */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Ruler} label="Surface" value={`${property.surface} m²`} />
        {!isLand && <StatCard icon={BedDouble} label="Chambres" value={String(property.bedrooms)} />}
        {!isLand && <StatCard icon={Bath} label="Salles de bain" value={String(property.bathrooms)} />}
        <StatCard icon={CalendarRange} label="Année" value={property.yearBuilt ? String(property.yearBuilt) : "—"} />
        {property.floors > 0 && <StatCard icon={Building2} label="Étages" value={String(property.floors)} />}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2">
          <PropertyGallery images={property.images} />

          {/* Description */}
          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold">Description</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {property.description}
            </p>
          </section>

          {/* Features */}
          {property.features.length > 0 && (
            <section className="mt-8">
              <h2 className="font-display text-xl font-semibold">Caractéristiques</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {property.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 rounded-lg bg-sand px-3 py-2.5 text-sm"
                  >
                    <Check className="size-4 shrink-0 text-green-600" />
                    {f}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Amenities */}
          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold">Équipements</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {property.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm"
                >
                  {a}
                </span>
              ))}
            </div>
          </section>

          {/* Location */}
          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold">Localisation</h2>
            <div className="relative mt-4 overflow-hidden rounded-2xl border border-border">
              <div className="flex h-64 w-full items-center justify-center bg-sand">
                <div className="text-center">
                  <MapPin className="mx-auto size-8 text-gold" />
                  <p className="mt-2 font-medium">{property.address.city}</p>
                  <p className="text-sm text-muted-foreground">{property.address.street}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {property.address.state} · {property.address.zip}, {property.address.country}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          {/* CTA card */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <p className="tnum font-display text-3xl font-semibold tracking-tight">
              {formatPrice(property.price)}
            </p>
            <div className="mt-5 grid gap-2.5">
              <Button
                onClick={() => setVisitOpen(true)}
                className="w-full rounded-full bg-gold text-ink hover:bg-gold/90"
                size="lg"
              >
                Demander une visite
              </Button>
              <Button
                onClick={() => setContactOpen(true)}
                variant="outline"
                className="w-full rounded-full"
                size="lg"
              >
                Contacter le vendeur
              </Button>
              <Button
                onClick={() => setOfferOpen(true)}
                variant="secondary"
                className="w-full rounded-full"
                size="lg"
              >
                Faire une offre
              </Button>
            </div>
            <div className="mt-4 rounded-xl bg-sand p-4 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold-strong" />
                Transaction accompagnée par un conseiller DarEstate, sans frais
                pour l&apos;acheteur.
              </p>
            </div>
          </div>

          {/* Seller card */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <h3 className="font-display text-base font-semibold">Le vendeur</h3>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-display font-semibold text-white">
                {(seller?.name ?? "DE").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {seller?.name ?? "Propriétaire DarEstate"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {seller?.companyName ?? "Vendeur vérifié"}
                </p>
                {seller?.isVerified && (
                  <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-green-600">
                    <BadgeCheck className="size-3.5" /> Propriétaire vérifié
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <button
                onClick={() => setShowPhone(true)}
                className="flex w-full items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Phone className="size-4 text-gold" />
                {showPhone ? (seller?.phone ?? "+212 5 22 00 00 00") : "Afficher le téléphone"}
              </button>
              <Button
                onClick={() => setContactOpen(true)}
                variant="outline"
                className="w-full rounded-full"
              >
                <Mail className="mr-2 size-4" />
                Envoyer un message
              </Button>
            </div>
          </div>

          {/* Energy */}
          {!isLand && (
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-display text-base font-semibold">
                <Factory className="size-4 text-gold" /> Performance énergétique
              </h3>
              <div className="mt-4 space-y-3">
                <EnergyBar label="Consommation énergétique" level="B" color="bg-green-500" />
                <EnergyBar label="Émissions de gaz à effet de serre" level="C" color="bg-yellow-500" />
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Flame className="size-3.5" />
                Classe énergétique estimée, dossier DPE disponible sur demande.
              </p>
            </div>
          )}
        </aside>
      </div>

      <ContactSellerModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        property={property}
      />
      <RequestVisitModal
        open={visitOpen}
        onOpenChange={setVisitOpen}
        property={property}
      />
      <MakeOfferModal
        open={offerOpen}
        onOpenChange={setOfferOpen}
        property={property}
      />

      {/* Mobile persistent action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="min-w-0">
          <p className="tnum truncate font-display text-lg font-semibold">
            {formatPrice(property.price)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {categoryLabel[property.category]} · {property.surface} m²
          </p>
        </div>
        <Button
          onClick={() => setVisitOpen(true)}
          size="lg"
          className="shrink-0 rounded-full bg-gold px-6 text-ink hover:bg-gold/90"
        >
          Demander une visite
        </Button>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <Icon className="size-5 text-gold-strong" />
      <p className="tnum mt-2 font-display text-lg font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function EnergyBar({
  label,
  level,
  color,
}: {
  label: string;
  level: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={`rounded px-1.5 py-0.5 font-bold text-white ${color}`}>{level}</span>
      </div>
      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted">
        <div className={`h-full w-3/4 rounded-full ${color}`} />
      </div>
    </div>
  );
}