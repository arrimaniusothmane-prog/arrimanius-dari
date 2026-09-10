"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileCheck,
  HandCoins,
  TrendingUp,
  TrendingDown,
  Loader2,
  MessageSquareReply,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import type { Offer } from "@/types";
import { OfferStatus } from "@/types";
import {
  getOffers,
  updateOfferStatus,
  sendCounterOffer,
} from "@/services/leadService";
import {
  propertyById,
  userById,
  offerStatusLabel,
  offerStatusBadge,
} from "@/lib/labels";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { useCurrentSellerId } from "@/hooks/useCurrentSeller";

export default function SellerOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const sellerId = useCurrentSellerId();

  const [counterTarget, setCounterTarget] = useState<Offer | null>(null);
  const [counterPrice, setCounterPrice] = useState("");
  const [counterMessage, setCounterMessage] = useState("");
  const [counterSending, setCounterSending] = useState(false);

  useEffect(() => {
    getOffers()
      .then((all) =>
        setOffers(
          all.filter((o) => propertyById(o.propertyId)?.sellerId === sellerId)
        )
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sellerId]);

  const handleStatus = async (offer: Offer, status: OfferStatus) => {
    setBusyId(offer.id);
    try {
      const updated = await updateOfferStatus(offer.id, status);
      if (updated) {
        setOffers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      }
    } finally {
      setBusyId(null);
    }
  };

  const openCounter = (offer: Offer) => {
    setCounterTarget(offer);
    setCounterPrice(String(offer.price));
    setCounterMessage("");
  };

  const closeCounter = () => {
    setCounterTarget(null);
    setCounterSending(false);
  };

  const handleCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterTarget) return;
    setCounterSending(true);
    try {
      const updated = await sendCounterOffer(counterTarget.id, {
        price: Number(counterPrice.replace(/\s/g, "")) || counterTarget.price,
        message: counterMessage,
      });
      if (updated) {
        setOffers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      }
      closeCounter();
    } finally {
      setCounterSending(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Offres"
        subtitle="Consultez et gérez les offres reçues sur vos annonces."
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-sand text-gold">
            <FileCheck className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold">Aucune offre reçue</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Les offres d&apos;achat sur vos biens apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {offers.map((offer) => {
            const property = propertyById(offer.propertyId);
            const buyer = userById(offer.buyerId);
            const asking = property?.price ?? 0;
            const diffPct =
              asking > 0 ? Math.round(((offer.price - asking) / asking) * 100) : 0;
            const above = diffPct >= 0;
            const pending = offer.status === OfferStatus.PENDING;
            const counter = offer.status === OfferStatus.COUNTER_OFFER;
            const busy = busyId === offer.id;

            return (
              <div
                key={offer.id}
                className="flex flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={property ? `/properties/${property.slug}` : "#"}
                      className="font-display text-base font-semibold text-foreground hover:text-gold"
                    >
                      {property?.title ?? "Bien"}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Reçue le {formatDate(offer.createdAt)} · Contact :{" "}
                      {offer.preferredContact}
                    </p>
                  </div>
                  <StatusBadge
                    className={offerStatusBadge[offer.status]}
                    label={offerStatusLabel[offer.status]}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-sand/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Offre</p>
                    <p className="mt-1 font-display text-xl font-semibold">{formatPrice(offer.price)}</p>
                  </div>
                  <div className="rounded-xl bg-sand/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Prix affiché</p>
                    <p className="mt-1 font-display text-xl font-semibold">{formatPrice(asking)}</p>
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                    above
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                  )}
                >
                  {above ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                  {above ? "+" : ""}
                  {diffPct}% vs prix affiché
                </div>

                {counter && offer.counterPrice !== undefined && (
                  <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                      Votre contre-offre
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold">
                      {formatPrice(offer.counterPrice)}
                    </p>
                    {offer.counterMessage && (
                      <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                        {offer.counterMessage}
                      </p>
                    )}
                  </div>
                )}

                {offer.message && (
                  <p className="mt-4 rounded-xl bg-sand/60 p-4 text-sm leading-relaxed text-foreground/80">
                    {offer.message}
                  </p>
                )}

                {buyer && (
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" /> {buyer.name}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="size-3.5" /> {buyer.phone || "Non renseigné"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Mail className="size-3.5" /> {buyer.email}
                    </span>
                  </div>
                )}

                {pending && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
                    <Button
                      size="sm"
                      disabled={busy}
                      className="rounded-full bg-emerald-600 text-white hover:bg-emerald-600/90"
                      onClick={() => handleStatus(offer, OfferStatus.ACCEPTED)}
                    >
                      {busy ? <Loader2 className="size-4 animate-spin" /> : <HandCoins className="size-4" />}
                      Accepter
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      className="rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                      onClick={() => handleStatus(offer, OfferStatus.REJECTED)}
                    >
                      Refuser
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      className="rounded-full text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                      onClick={() => openCounter(offer)}
                    >
                      <MessageSquareReply className="size-4" />
                      Contre-offre
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={counterTarget !== null} onOpenChange={(open) => !open && closeCounter()}>
        <DialogContent className="max-w-xl">
          {counterTarget && (
            <form onSubmit={handleCounter}>
              <DialogHeader>
                <DialogTitle className="text-lg">Faire une contre-offre</DialogTitle>
                <DialogDescription>
                  Proposez un nouveau prix en réponse à l&apos;offre de l&apos;acheteur
                  pour {propertyById(counterTarget.propertyId)?.title ?? "ce bien"}.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-sand p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Offre reçue
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold">
                      {formatPrice(counterTarget.price)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Prix affiché
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold">
                      {formatPrice(propertyById(counterTarget.propertyId)?.price ?? 0)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="counter-price">Votre contre-proposition</Label>
                  <Input
                    id="counter-price"
                    required
                    type="number"
                    min={0}
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                    className="text-base font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="counter-message">Message à l&apos;acheteur</Label>
                  <Textarea
                    id="counter-message"
                    rows={3}
                    placeholder="Expliquez le contexte de votre contre-proposition…"
                    value={counterMessage}
                    onChange={(e) => setCounterMessage(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button type="button" variant="ghost" onClick={closeCounter}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={counterSending}
                  className="flex-1 rounded-full bg-blue-600 text-white hover:bg-blue-600/90"
                >
                  {counterSending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Envoyer la contre-offre
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
