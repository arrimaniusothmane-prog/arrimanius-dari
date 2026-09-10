"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { Property } from "@/types";
import { LeadStatus, OfferStatus } from "@/types";
import { createOffer, createLead } from "@/services/leadService";
import { useAuth } from "@/components/providers/auth-provider";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function MakeOfferModal({
  open,
  onOpenChange,
  property,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const [form, setForm] = useState({
    price: String(property.price),
    message: "",
    contact: "email",
  });

  const price = Number(form.price.replace(/\s/g, "")) || 0;
  const discountPct = price > 0 && price < property.price
    ? Math.round(((property.price - price) / property.price) * 100)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createOffer({
        propertyId: property.id,
        buyerId: user?.id ?? "buyer-1",
        price,
        message: form.message,
        preferredContact: form.contact,
        status: OfferStatus.PENDING,
      });
      await createLead({
        propertyId: property.id,
        buyerId: user?.id ?? "buyer-1",
        sellerId: property.sellerId,
        status: LeadStatus.OFFER_MADE,
        message: form.message || `Offre de ${price} MAD`,
        name: user?.name ?? "Acheteur",
        phone: user?.phone ?? "",
        email: user?.email ?? "",
      });
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        {submitted ? (
          <div className="flex flex-col items-center py-10 text-center">
            <CheckCircle2 className="size-16 text-green-500" />
            <h3 className="mt-4 text-xl font-semibold">Offre envoyée</h3>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Votre offre a été transmise au vendeur. Vous serez notifié
              dès qu&apos;elle aura une réponse.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                onOpenChange(false);
              }}
              className="mt-6 rounded-full"
            >
              Fermer
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg">Faire une offre</DialogTitle>
              <DialogDescription>
                Votre offre est sans engagement. Le vendeur peut accepter,
                refuser ou faire une contre-proposition.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-sand p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Prix demandé
                </p>
                <p className="mt-1 font-display text-xl font-semibold">
                  {formatPrice(property.price)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="offer-price">
                  Votre offre{" "}
                  {discountPct > 0 && (
                    <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">
                      -{discountPct}%
                    </span>
                  )}
                </Label>
                <Input
                  id="offer-price"
                  required
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  className="text-base font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offer-message">Message au vendeur</Label>
                <Textarea
                  id="offer-message"
                  rows={3}
                  placeholder="Expliquez les raisons de votre offre..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Méthode de contact préférée</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "email", label: "Email" },
                    { value: "phone", label: "Téléphone" },
                    { value: "whatsapp", label: "WhatsApp" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={form.contact === opt.value}
                      onClick={() => setForm({ ...form, contact: opt.value })}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        form.contact === opt.value
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border text-muted-foreground hover:border-gold/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-full"
                disabled={submitting}
              >
                {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                Envoyer mon offre
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}