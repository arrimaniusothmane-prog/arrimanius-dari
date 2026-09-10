"use client";

import { useState, useMemo, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Upload,
  X,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const projectTypes = [
  { value: "CONSTRUCTION", label: "Construction" },
  { value: "RENOVATION", label: "Rénovation" },
  { value: "AGENCEMENT", label: "Agencement" },
];

const propertyTypes = [
  "Villa",
  "Maison",
  "Appartement",
  "Immeuble",
  "Bureau",
  "Commerce",
  "Restaurant",
  "Local professionnel",
  "Autre",
];

const budgetRanges = [
  "Moins de 100 000 MAD",
  "100 000 – 300 000 MAD",
  "300 000 – 700 000 MAD",
  "700 000 – 1 500 000 MAD",
  "1 500 000 – 3 000 000 MAD",
  "Plus de 3 000 000 MAD",
];

function DevisFormInner() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "";
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [type, setType] = useState(initialType);
  const [lastUrlType, setLastUrlType] = useState(initialType);
  if (lastUrlType !== initialType) {
    setLastUrlType(initialType);
    setType(initialType);
  }
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ville, setVille] = useState("");
  const [bien, setBien] = useState("");
  const [surface, setSurface] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-12 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
        <CheckCircle2 className="mx-auto size-10 text-emerald-500" />
        <h3 className="mt-4 font-display text-xl font-semibold">
          Demande envoyée
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Merci pour votre demande. Notre équipe vous recontactera sous 24h
          pour discuter de votre projet.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Phone className="size-4 text-gold" /> +212 5 22 00 00 00
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="size-4 text-gold" /> contact@darestimate.ma
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>Type de projet *</Label>
        <Select value={type} onValueChange={(v) => setType(v ?? "")}>
          <SelectTrigger className="h-11 w-full rounded-xl">
            <SelectValue placeholder="Sélectionnez un type de projet" />
          </SelectTrigger>
          <SelectContent>
            {projectTypes.map((pt) => (
              <SelectItem key={pt.value} value={pt.value}>
                {pt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="devis-name">Nom complet *</Label>
          <Input
            id="devis-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="devis-phone">Téléphone *</Label>
          <Input
            id="devis-phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+212 6 00 00 00 00"
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="devis-email">Email *</Label>
          <Input
            id="devis-email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="devis-ville">Ville *</Label>
          <Input
            id="devis-ville"
            required
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            placeholder="Casablanca, Rabat..."
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Type de bien</Label>
          <Select value={bien} onValueChange={(v) => setBien(v ?? "")}>
            <SelectTrigger className="h-11 w-full rounded-xl">
              <SelectValue placeholder="Sélectionnez le type de bien" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="devis-surface">Surface (m²)</Label>
          <Input
            id="devis-surface"
            type="number"
            min="0"
            value={surface}
            onChange={(e) => setSurface(e.target.value)}
            placeholder="ex. 120"
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Budget estimé</Label>
        <Select value={budget} onValueChange={(v) => setBudget(v ?? "")}>
          <SelectTrigger className="h-11 w-full rounded-xl">
            <SelectValue placeholder="Sélectionnez une tranche de budget" />
          </SelectTrigger>
          <SelectContent>
            {budgetRanges.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="devis-desc">Description du projet *</Label>
        <Textarea
          id="devis-desc"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez votre projet : état actuel, souhaits, contraintes, délais..."
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label>Photos / Plans</Label>
        <input
          id="devis-files"
          type="file"
          accept="image/*,.pdf"
          multiple
          onChange={handleFiles}
          className="sr-only"
        />
        <div
          className={cn(
            "rounded-2xl border-2 border-dashed border-border bg-sand/50 transition-colors",
            files.length === 0
              ? "px-6 py-8 hover:border-gold/50 hover:bg-gold/5"
              : "px-4 py-4"
          )}
        >
          {files.length === 0 ? (
            <Label
              htmlFor="devis-files"
              className="flex w-full cursor-pointer flex-col items-center justify-center text-center"
            >
              <Upload className="size-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Ajoutez des photos ou plans de votre projet
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                JPEG, PNG, PDF — jusqu&apos;à 10 fichiers
              </p>
              <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gold/90">
                <Upload className="size-4" /> Choisir des fichiers
              </span>
            </Label>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {files.map((f, i) => (
                  <div
                    key={previews[i]}
                    className="group relative flex items-center justify-center overflow-hidden rounded-xl bg-sand"
                  >
                    {f.type.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previews[i]}
                        alt={f.name}
                        className="aspect-square w-full object-cover"
                      />
                    ) : (
                      <span className="p-3 text-[10px] font-semibold text-muted-foreground">
                        PDF
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      aria-label={`Retirer ${f.name}`}
                      className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
              <Label
                htmlFor="devis-files"
                className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-gold/50 hover:bg-gold/5"
              >
                <Upload className="size-5" />
              </Label>
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={sending || !type}
        className="h-12 w-full rounded-full text-base font-semibold"
        size="lg"
      >
        {sending ? (
          <Loader2 className="mr-2 size-5 animate-spin" />
        ) : (
          <>
            Envoyer ma demande <ArrowRight className="ml-2 size-5" />
          </>
        )}
      </Button>
    </form>
  );
}

export function DevisForm() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Chargement du formulaire…
        </div>
      }
    >
      <DevisFormInner />
    </Suspense>
  );
}
