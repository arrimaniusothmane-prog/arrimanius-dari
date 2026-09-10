"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { Property } from "@/types";
import { LeadStatus } from "@/types";
import { createLead, createVisit } from "@/services/leadService";
import { useAuth } from "@/components/providers/auth-provider";
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

export function ContactSellerModal({
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
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    message: "",
    requestVisit: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const lead = await createLead({
        propertyId: property.id,
        buyerId: user?.id ?? "buyer-1",
        sellerId: property.sellerId,
        status: form.requestVisit
          ? LeadStatus.VISIT_REQUESTED
          : LeadStatus.NEW,
        message: form.message,
        name: form.name,
        phone: form.phone,
        email: form.email,
      });
      if (form.requestVisit) {
        await createVisit({
          propertyId: property.id,
          leadId: lead.id,
          date: new Date().toISOString().split("T")[0],
          time: "10:00",
          numberOfVisitors: 1,
          phone: form.phone,
          message: form.message,
          status: LeadStatus.VISIT_REQUESTED,
        });
      }
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
            <h3 className="mt-4 text-xl font-semibold">Message envoyé</h3>
            <p className="mt-2 text-muted-foreground">
              Votre demande a bien été transmise au vendeur. Il vous
              contactera dans les plus brefs délais.
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
              <DialogTitle className="text-lg">Contacter le vendeur</DialogTitle>
              <DialogDescription>
                À propos de :{" "}
                <span className="font-medium text-foreground">{property.title}</span>
                {" "}· {property.address.city}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Nom complet</Label>
                  <Input
                    id="contact-name"
                    required
                    placeholder="Votre nom"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Téléphone</Label>
                  <Input
                    id="contact-phone"
                    required
                    placeholder="+212 6 XX XX XX XX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="vous@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  rows={4}
                  required
                  placeholder="Bonjour, je suis intéressé par votre bien..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 accent-gold"
                  checked={form.requestVisit}
                  onChange={(e) =>
                    setForm({ ...form, requestVisit: e.target.checked })
                  }
                />
                Je souhaite planifier une visite
              </label>
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
                Envoyer le message
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}