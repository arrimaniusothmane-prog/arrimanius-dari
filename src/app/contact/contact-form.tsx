"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { createDemande } from "@/services/demandeService";
import { DemandeType } from "@/types";

const contactCards = [
  {
    icon: Phone,
    title: "Téléphone",
    lines: ["+212 5 22 00 00 00"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["contact@darestimate.ma"],
  },
  {
    icon: MapPin,
    title: "Adresse",
    lines: ["Twin Center, Tour Ouest", "Boulevard Zerktouni, Casablanca"],
  },
  {
    icon: Clock,
    title: "Horaires",
    lines: ["Lun – Ven : 9h – 19h", "Samedi : 9h – 14h"],
  },
];

const subjects = [
  { value: "contact", label: "Contact général" },
  { value: "conseil", label: "Conseil immobilier" },
  { value: "partenariat", label: "Partenariat" },
  { value: "autre", label: "Autre" },
];

const initialForm = {
  nom: "",
  email: "",
  telephone: "",
  sujet: "contact",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await createDemande({
        type: DemandeType.CONTACT,
        title: form.sujet || "Contact général",
        message: form.message,
        name: form.nom,
        email: form.email,
        phone: form.telephone,
        data: { sujet: form.sujet },
      });
    } catch {
      /* ignore */
    } finally {
      setSending(false);
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setSubmitted(false);
  };

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden bg-ink py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <Phone className="size-4 text-gold" /> Nous sommes à votre écoute
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Contactez{" "}
              <span className="font-serif italic text-gold">DarEstate</span>
            </h1>
            <p className="mt-4 max-w-xl text-white/80">
              Une question sur un bien, une vente ou un investissement ? Notre
              équipe vous répond rapidement.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Left: contact info */}
          <div className="space-y-4">
            {contactCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold">
                      {card.title}
                    </h3>
                    {card.lines.map((line) => (
                      <p
                        key={line}
                        className="mt-0.5 text-sm text-muted-foreground"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-sand/60 p-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold text-white">
                <Clock className="size-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold">
                  Besoin d&apos;aide ?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Consultez notre centre d&apos;aide pour des réponses immédiates.
                </p>
                <Link
                  href="/help"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-gold hover:underline"
                >
                  Centre d&apos;aide <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <CheckCircle2 className="size-9" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-semibold">
                  Message envoyé <span className="text-gold">✓</span>
                </h2>
                <p className="mt-2 max-w-sm text-muted-foreground">
                  Merci {form.nom || "pour votre message"} ! Notre équipe vous
                  recontactera dans les plus brefs délais.
                </p>
                <Button
                  onClick={handleReset}
                  className="mt-6 rounded-full bg-gold text-white hover:bg-gold/90"
                >
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-semibold">
                  Envoyez-nous un message
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Remplissez le formulaire, nous revenons vers vous rapidement.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="nom">Nom complet</Label>
                      <Input
                        id="nom"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="vous@exemple.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        value={form.telephone}
                        onChange={handleChange}
                        placeholder="+212 6 00 00 00 00"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Objet</Label>
                      <Select
                        value={form.sujet}
                        onValueChange={(value) =>
                          setForm((f) => ({ ...f, sujet: value ?? "contact" }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre demande ou votre projet immobilier..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={sending}
                    className="w-full rounded-full bg-gold text-white hover:bg-gold/90"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" /> Envoi en cours…
                      </>
                    ) : (
                      <>
                        Envoyer le message <Send className="ml-2 size-4" />
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}