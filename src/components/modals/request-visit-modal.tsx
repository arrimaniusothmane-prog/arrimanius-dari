"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Users } from "lucide-react";
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

const timeSlots = [
  "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

export function RequestVisitModal({
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
    date: "",
    time: "10:00",
    visitors: "2",
    phone: user?.phone ?? "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const lead = await createLead({
        propertyId: property.id,
        buyerId: user?.id ?? "buyer-1",
        sellerId: property.sellerId,
        status: LeadStatus.VISIT_REQUESTED,
        message: form.message,
        name: user?.name ?? "Acheteur",
        phone: form.phone,
        email: user?.email ?? "",
      });
      await createVisit({
        propertyId: property.id,
        leadId: lead.id,
        date: form.date,
        time: form.time,
        numberOfVisitors: Math.max(1, Number(form.visitors) || 1),
        phone: form.phone,
        message: form.message,
        status: LeadStatus.VISIT_REQUESTED,
      });
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        {submitted ? (
          <div className="flex flex-col items-center py-10 text-center">
            <CheckCircle2 className="size-16 text-green-500" />
            <h3 className="mt-4 text-xl font-semibold">Visite confirmée</h3>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Votre demande de visite a été envoyée. Un conseiller DarEstate
              vous contactera pour confirmer le rendez-vous.
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
              <DialogTitle className="text-lg">Demander une visite</DialogTitle>
              <DialogDescription>
                <span className="font-medium text-foreground">{property.title}</span>
                {" "}· {property.address.city}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="visit-date">Date souhaitée</Label>
                  <Input
                    id="visit-date"
                    type="date"
                    required
                    min={today}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horaire</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        aria-pressed={form.time === slot}
                        onClick={() => setForm({ ...form, time: slot })}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                          form.time === slot
                            ? "border-gold bg-gold text-white"
                            : "border-border text-muted-foreground hover:border-gold/50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="visit-visitors">
                    <span className="flex items-center gap-1.5">
                      <Users className="size-4" /> Nombre de visiteurs
                    </span>
                  </Label>
                  <Input
                    id="visit-visitors"
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={form.visitors}
                    onChange={(e) =>
                      setForm({ ...form, visitors: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visit-phone">Téléphone</Label>
                  <Input
                    id="visit-phone"
                    required
                    placeholder="+212 6 XX XX XX XX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visit-message">Message (optionnel)</Label>
                <Textarea
                  id="visit-message"
                  rows={3}
                  placeholder="Questions particulières, disponibilités..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
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
                Confirmer la visite
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}