"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Building2,
  TreePine,
  Home,
  Map,
  Store,
  ImagePlus,
  UploadCloud,
  X,
  Sparkles,
  BadgeCheck,
  Star,
} from "lucide-react";
import type { Property } from "@/types";
import { PropertyCategory, PropertyStatus } from "@/types";
import { addProperty } from "@/services/propertyService";
import { categoryLabel } from "@/lib/labels";
import { useCurrentSellerId } from "@/hooks/useCurrentSeller";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formatPrice, cn } from "@/lib/utils";

const CITIES = ["Casablanca", "Marrakech", "Rabat", "Tangier", "Fez", "Agadir"];

const PHOTO_OPTIONS = [
  { url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=800&fit=crop", label: "Façade moderne" },
  { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop", label: "Extérieur" },
  { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop", label: "Cuisine" },
  { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop", label: "Salon" },
  { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop", label: "Extérieur & vue" },
  { url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop", label: "Chambre" },
];

const CATEGORY_OPTIONS: {
  value: PropertyCategory;
  label: string;
  icon: typeof Building2;
  description: string;
}[] = [
  { value: PropertyCategory.APARTMENT, label: categoryLabel[PropertyCategory.APARTMENT], icon: Building2, description: "Appartement en immeuble, résidence ou en copropriété." },
  { value: PropertyCategory.VILLA, label: categoryLabel[PropertyCategory.VILLA], icon: TreePine, description: "Villa individuelle avec jardin, piscine ou plain-pied." },
  { value: PropertyCategory.HOUSE, label: categoryLabel[PropertyCategory.HOUSE], icon: Home, description: "Maison de ville ou familiale." },
  { value: PropertyCategory.LAND, label: categoryLabel[PropertyCategory.LAND], icon: Map, description: "Terrain constructible, résidentiel ou agricole." },
  { value: PropertyCategory.COMMERCIAL, label: categoryLabel[PropertyCategory.COMMERCIAL], icon: Store, description: "Boutique, bureau, restaurant ou local d'activité." },
];

const AMENITIES = [
  { key: "isFurnished", label: "Meublé", description: "Le bien est vendu meublé" },
  { key: "hasParking", label: "Parking", description: "Place de parking incluse" },
  { key: "hasPool", label: "Piscine", description: "Piscine privée ou de résidence" },
  { key: "hasGarden", label: "Jardin", description: "Jardin ou espace extérieur" },
  { key: "hasTerrace", label: "Terrasse", description: "Terrasse ou balcon" },
  { key: "isNewConstruction", label: "Neuf", description: "Construction neuve ou livrée récemment" },
] as const;

const STEPS = [
  { label: "Type", short: "Type de bien" },
  { label: "Infos", short: "Informations" },
  { label: "Détails", short: "Détails" },
  { label: "Équip.", short: "Équipements" },
  { label: "Photos", short: "Photos" },
  { label: "Aperçu", short: "Aperçu" },
  { label: "Public.", short: "Publication" },
];

interface Draft {
  category: PropertyCategory | null;
  title: string;
  description: string;
  price: string;
  city: string;
  street: string;
  surface: string;
  bedrooms: string;
  bathrooms: string;
  floors: string;
  yearBuilt: string;
  isFurnished: boolean;
  hasParking: boolean;
  hasPool: boolean;
  hasGarden: boolean;
  hasTerrace: boolean;
  isNewConstruction: boolean;
  images: string[];
}

const initialDraft: Draft = {
  category: null,
  title: "",
  description: "",
  price: "",
  city: "",
  street: "",
  surface: "",
  bedrooms: "",
  bathrooms: "",
  floors: "",
  yearBuilt: "",
  isFurnished: false,
  hasParking: false,
  hasPool: false,
  hasGarden: false,
  hasTerrace: false,
  isNewConstruction: false,
  images: [],
};

function numberOrZero(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function priceNumber(value: string): number {
  const n = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function SellerAddPropertyPage() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [maxPhotoHint, setMaxPhotoHint] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const sellerId = useCurrentSellerId();

  const isUploadedUrl = (url: string) => url.startsWith("/api/uploads/");

  const updateDraft = (patch: Partial<Draft>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const validate = (stepIndex: number): string | null => {
    switch (stepIndex) {
      case 0:
        return draft.category ? null : "Sélectionnez un type de bien pour continuer.";
      case 1:
        if (!draft.title.trim()) return "Le titre est requis.";
        if (!draft.description.trim()) return "La description est requise.";
        if (priceNumber(draft.price) <= 0) return "Indiquez un prix de vente valide.";
        if (!draft.city) return "Sélectionnez une ville.";
        if (!draft.street.trim()) return "L'adresse (rue / lotissement) est requise.";
        return null;
      case 2:
        if (numberOrZero(draft.surface) <= 0) return "La surface (m²) est requise.";
        return null;
      case 3:
        return null;
      case 4:
        if (draft.images.length === 0) return "Sélectionnez au moins une photo.";
        return null;
      case 5:
        return null;
      case 6: {
        const required: string[] = [];
        if (!draft.category) required.push("Le type de bien");
        if (!draft.title.trim()) required.push("Le titre");
        if (!draft.description.trim()) required.push("La description");
        if (priceNumber(draft.price) <= 0) required.push("Le prix");
        if (!draft.city) required.push("La ville");
        if (!draft.street.trim()) required.push("L'adresse");
        if (numberOrZero(draft.surface) <= 0) required.push("La surface");
        if (draft.images.length === 0) required.push("Au moins une photo");
        return required.length ? `Champs manquants : ${required.join(", ")}.` : null;
      }
      default:
        return null;
    }
  };

  const stepError = validate(step);
  const canProceed = stepError === null;

  const previewProperty: Property = useMemo(
    () => ({
      id: "apercu",
      slug: "apercu",
      title: draft.title.trim() || "Votre bien",
      description: draft.description,
      price: priceNumber(draft.price),
      category: draft.category ?? PropertyCategory.APARTMENT,
      status: PropertyStatus.DRAFT,
      address: {
        street: draft.street,
        city: draft.city || "Casablanca",
        state: "",
        zip: "",
        country: "Morocco",
      },
      latitude: 0,
      longitude: 0,
      surface: numberOrZero(draft.surface),
      bedrooms: numberOrZero(draft.bedrooms),
      bathrooms: numberOrZero(draft.bathrooms),
      floors: numberOrZero(draft.floors),
      yearBuilt: draft.yearBuilt.trim() ? numberOrZero(draft.yearBuilt) : null,
      images: draft.images.map((url, idx) => ({
        id: `draft-img-${idx}`,
        url,
        alt: `${draft.title.trim() || "Votre bien"} — photo ${idx + 1}`,
        isPrimary: idx === 0,
        order: idx,
      })),
      amenities: [],
      features: [],
      isVerified: false,
      isFurnished: draft.isFurnished,
      hasParking: draft.hasParking,
      hasPool: draft.hasPool,
      hasGarden: draft.hasGarden,
      hasTerrace: draft.hasTerrace,
      isNewConstruction: draft.isNewConstruction,
      views: 0,
      favoriteCount: 0,
      sellerId,
      createdAt: "",
      updatedAt: "",
    }),
    [draft, sellerId]
  );

  const toggleImage = (url: string) => {
    const selected = draft.images;
    if (selected.includes(url)) {
      setMaxPhotoHint(false);
      updateDraft({ images: selected.filter((u) => u !== url) });
    } else if (selected.length >= 5) {
      setMaxPhotoHint(true);
    } else {
      setMaxPhotoHint(false);
      updateDraft({ images: [...selected, url] });
    }
  };

  const removeImage = (url: string) => {
    setMaxPhotoHint(false);
    updateDraft({ images: draft.images.filter((u) => u !== url) });
  };

  const makePrimary = (url: string) => {
    updateDraft({ images: [url, ...draft.images.filter((u) => u !== url)] });
  };

  const uploadPhotos = async (files: File[]) => {
    const pics = files.filter((f) => f.type.startsWith("image/"));
    if (pics.length === 0) {
      setUploadError("Formats d'image non pris en charge (JPG, PNG, WebP, GIF).");
      return;
    }
    const slots = 5 - draft.images.length;
    if (slots <= 0) {
      setMaxPhotoHint(true);
      return;
    }
    const batch = pics.slice(0, slots);
    if (pics.length > slots) setMaxPhotoHint(true);

    setUploading(true);
    setUploadError(null);
    try {
      const form = new FormData();
      batch.forEach((f) => form.append("files", f));
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.urls?.length) {
        setUploadError(data?.error ?? "L'envoi des photos a échoué, réessayez.");
        return;
      }
      updateDraft({ images: [...draft.images, ...(data.urls as string[])] });
    } catch {
      setUploadError("Impossible d'envoyer les photos. Vérifiez votre connexion.");
    } finally {
      setUploading(false);
    }
  };

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    uploadPhotos(files);
  };

  const handlePublish = async () => {
    const err = validate(6);
    if (err) return;
    setPublishing(true);
    try {
      const amenities = [
        draft.isFurnished ? "Meublé" : null,
        draft.hasParking ? "Parking" : null,
        draft.hasPool ? "Piscine" : null,
        draft.hasGarden ? "Jardin" : null,
        draft.hasTerrace ? "Terrasse" : null,
        draft.isNewConstruction ? "Neuf" : null,
      ].filter((a): a is string => Boolean(a));

      const propertyData: Omit<Property, "id" | "slug" | "createdAt" | "updatedAt"> = {
        title: draft.title.trim(),
        description: draft.description.trim(),
        price: priceNumber(draft.price),
        category: draft.category as PropertyCategory,
        status: PropertyStatus.PENDING_REVIEW,
        address: {
          street: draft.street.trim(),
          city: draft.city,
          state: "",
          zip: "",
          country: "Morocco",
        },
        latitude: 0,
        longitude: 0,
        surface: numberOrZero(draft.surface),
        bedrooms: numberOrZero(draft.bedrooms),
        bathrooms: numberOrZero(draft.bathrooms),
        floors: numberOrZero(draft.floors),
        yearBuilt: draft.yearBuilt.trim() ? numberOrZero(draft.yearBuilt) : null,
        images: draft.images.map((url, idx) => ({
          id: `new-img-${Date.now()}-${idx}`,
          url,
          alt: `${draft.title.trim()} — photo ${idx + 1}`,
          isPrimary: idx === 0,
          order: idx,
        })),
        amenities,
        features: [],
        isVerified: false,
        isFurnished: draft.isFurnished,
        hasParking: draft.hasParking,
        hasPool: draft.hasPool,
        hasGarden: draft.hasGarden,
        hasTerrace: draft.hasTerrace,
        isNewConstruction: draft.isNewConstruction,
        views: 0,
        favoriteCount: 0,
        sellerId,
      };

      await addProperty(propertyData);
      setPublished(true);
    } finally {
      setPublishing(false);
    }
  };

  if (published) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-24 items-center justify-center rounded-full bg-gold text-white shadow-xl shadow-gold/30 animate-in zoom-in-75 fade-in duration-500">
          <Check className="size-12" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
          Votre bien est en cours de publication
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
          Notre équipe DarEstate va vérifier votre annonce avant qu&apos;elle
          ne soit visible par les acheteurs. Vous serez notifié dès sa mise en
          ligne.
        </p>
        <Button
          render={<Link href="/seller/properties" />}
          className="mt-8 rounded-full bg-gold text-white hover:bg-gold/90 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300"
        >
          Voir mes biens <ArrowRight className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="Ajouter un bien"
        subtitle="Décrivez votre bien en quelques étapes, nos experts s'occupent du reste."
      />

      {/* Stepper */}
      <div className="scrollbar-hide -mx-1 overflow-x-auto px-1 pb-2">
        <div className="flex min-w-[560px] items-start">
          {STEPS.map((s, i) => {
            const completed = i < step;
            const active = i === step;
            return (
              <div key={s.label} className="flex flex-1 flex-col items-center">
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => setStep(i)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-2",
                    i <= step && "cursor-pointer"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                      completed
                        ? "border-gold bg-gold text-white"
                        : active
                          ? "border-gold bg-sand text-gold"
                          : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {completed ? <Check className="size-4" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "whitespace-nowrap text-[11px] font-medium",
                      active || completed ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl font-semibold">{STEPS[step].short}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {step === 0 && "Choisissez la catégorie qui correspond le mieux à votre bien."}
          {step === 1 && "Ces informations apparaîtront sur votre annonce."}
          {step === 2 && "Les caractéristiques techniques de votre bien."}
          {step === 3 && "Indiquez les équipements et aménagements disponibles."}
          {step === 4 && "Sélectionnez jusqu'à 5 photos de votre bien."}
          {step === 5 && "Voici à quoi ressemblera votre annonce."}
          {step === 6 && "Vérifiez tous les détails avant de publier."}
        </p>
      </div>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
        {/* Step 0 — Type */}
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_OPTIONS.map((cat) => {
              const Icon = cat.icon;
              const selected = draft.category === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => updateDraft({ category: cat.value })}
                  className={cn(
                    "flex flex-col items-start gap-3 rounded-2xl border bg-card p-5 text-left shadow-sm transition-all",
                    selected
                      ? "border-gold ring-2 ring-gold/30"
                      : "border-border/60 hover:border-gold/40 hover:shadow-md"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl transition-colors",
                      selected ? "bg-gold text-white" : "bg-sand text-gold"
                    )}
                  >
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <p className="font-display text-base font-semibold">{cat.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {cat.description}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border transition-colors",
                      selected ? "border-gold bg-gold text-white" : "border-border"
                    )}
                  >
                    {selected && <Check className="size-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 1 — Informations */}
        {step === 1 && (
          <div className="max-w-2xl space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="add-title">Titre de l&apos;annonce</Label>
              <Input
                id="add-title"
                value={draft.title}
                onChange={(e) => updateDraft({ title: e.target.value })}
                placeholder="Ex : Villa moderne avec piscine Bouskoura"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                rows={4}
                value={draft.description}
                onChange={(e) => updateDraft({ description: e.target.value })}
                placeholder="Décrivez votre bien : atouts, environnement, état, proximités..."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="add-price">Prix de vente (MAD)</Label>
                <Input
                  id="add-price"
                  inputMode="numeric"
                  value={draft.price}
                  onChange={(e) => updateDraft({ price: e.target.value })}
                  placeholder="2 850 000"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Ville</Label>
                <Select
                  value={draft.city || undefined}
                  onValueChange={(v) => updateDraft({ city: v ?? "" })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-street">Adresse (rue, lotissement...)</Label>
              <Input
                id="add-street"
                value={draft.street}
                onChange={(e) => updateDraft({ street: e.target.value })}
                placeholder="Ex : Route de Bouskoura, Lot 42"
              />
            </div>
          </div>
        )}

        {/* Step 2 — Détails */}
        {step === 2 && (
          <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="add-surface">Surface (m²)</Label>
              <Input
                id="add-surface"
                inputMode="numeric"
                value={draft.surface}
                onChange={(e) => updateDraft({ surface: e.target.value })}
                placeholder="180"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-bedrooms">Chambres</Label>
              <Input
                id="add-bedrooms"
                inputMode="numeric"
                value={draft.bedrooms}
                onChange={(e) => updateDraft({ bedrooms: e.target.value })}
                placeholder="3"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-bathrooms">Salles de bain</Label>
              <Input
                id="add-bathrooms"
                inputMode="numeric"
                value={draft.bathrooms}
                onChange={(e) => updateDraft({ bathrooms: e.target.value })}
                placeholder="2"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-floors">Étage</Label>
              <Input
                id="add-floors"
                inputMode="numeric"
                value={draft.floors}
                onChange={(e) => updateDraft({ floors: e.target.value })}
                placeholder="2"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-year">Année de construction</Label>
              <Input
                id="add-year"
                inputMode="numeric"
                value={draft.yearBuilt}
                onChange={(e) => updateDraft({ yearBuilt: e.target.value })}
                placeholder="2022"
              />
            </div>
          </div>
        )}

        {/* Step 3 — Équipements */}
        {step === 3 && (
          <div className="max-w-2xl">
            <div className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card px-5 shadow-sm">
              {AMENITIES.map((a) => (
                <div key={a.key} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-sm font-medium">{a.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.description}</p>
                  </div>
                  <Switch
                    checked={draft[a.key]}
                    onCheckedChange={(v) => updateDraft({ [a.key]: v })}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 — Photos */}
        {step === 4 && (
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <ImagePlus className="size-4" />
              <span>
                {draft.images.length > 0
                  ? `${draft.images.length} photo${draft.images.length > 1 ? "s" : ""} sélectionnée${draft.images.length > 1 ? "s" : ""}`
                  : "Aucune photo sélectionnée"}
              </span>
              {draft.images.length > 0 && (
                <Badge className="border-transparent bg-gold text-white">Photo principale</Badge>
              )}
            </div>

            {/* Import from device */}
            <div className="rounded-2xl border-2 border-dashed border-gold/40 bg-sand/20 p-6">
              <label
                htmlFor="add-photo-upload"
                className="group flex cursor-pointer flex-col items-center gap-3 text-center"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-gold text-white shadow-md shadow-gold/20 transition-transform group-hover:scale-105">
                  <UploadCloud className="size-6" />
                </div>
                <div>
                  <p className="font-display text-base font-semibold">
                    Importer mes photos
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    JPG, PNG, WebP ou GIF · 5 Mo max · jusqu&apos;à 5 photos
                  </p>
                </div>
                <span className="mt-1 text-sm font-medium text-gold">
                  {uploading ? "Envoi en cours…" : "Parcourir mes fichiers"}
                </span>
              </label>
              <input
                id="add-photo-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={onFilesSelected}
              />
              {uploading && (
                <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin text-gold" />
                  Envoi des photos…
                </p>
              )}
              {uploadError && (
                <p className="mt-3 text-center text-sm font-medium text-red-600 dark:text-red-400" role="alert">
                  {uploadError}
                </p>
              )}
            </div>

            {/* Uploaded photos */}
            {draft.images.some(isUploadedUrl) && (
              <div className="mt-6">
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  Mes photos
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {draft.images.filter(isUploadedUrl).map((url) => {
                    const isPrimary = draft.images[0] === url;
                    return (
                      <div
                        key={url}
                        className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border/60"
                      >
                        <Image
                          src={url}
                          alt="Votre photo"
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover"
                        />
                        {isPrimary && (
                          <span className="absolute bottom-2 left-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-white shadow-md">
                            Photo principale
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          aria-label="Retirer cette photo"
                          className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-red-500"
                        >
                          <X className="size-4" />
                        </button>
                        {!isPrimary && (
                          <button
                            type="button"
                            onClick={() => makePrimary(url)}
                            aria-label="Définir comme photo principale"
                            className="absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-gold"
                          >
                            <Star className="size-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {draft.images.some(isUploadedUrl) && (
              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border/60" />
                Ou choisissez parmi nos modèles
                <span className="h-px flex-1 bg-border/60" />
              </div>
            )}

            {!draft.images.some(isUploadedUrl) && (
              <p className="mt-6 text-sm font-semibold text-foreground">
                Ou choisissez parmi nos modèles
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PHOTO_OPTIONS.map((photo) => {
                const selected = draft.images.includes(photo.url);
                const isPrimary = selected && draft.images[0] === photo.url;
                return (
                  <button
                    key={photo.url}
                    type="button"
                    onClick={() => toggleImage(photo.url)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border/60"
                  >
                    <Image
                      src={photo.url}
                      alt={photo.label}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className={cn(
                        "object-cover transition-all duration-300 group-hover:scale-105",
                        selected && "ring-2 ring-gold ring-offset-2 ring-offset-background"
                      )}
                    />
                    {selected && (
                      <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-gold text-white shadow-md">
                        <Check className="size-4" />
                      </span>
                    )}
                    {isPrimary && (
                      <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                        Photo principale
                      </span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 translate-y-full bg-black/50 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-md transition-transform duration-300 group-hover:translate-y-0">
                      {photo.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {maxPhotoHint && (
              <p className="mt-3 text-sm font-medium text-amber-600 dark:text-amber-400">
                Maximum 5 photos par annonce.
              </p>
            )}
            {draft.images.length > 1 && (
              <p className="mt-3 text-xs text-muted-foreground">
                La première photo sélectionnée sert de photo principale. Utilisez
                l&apos;icône Étoile sur vos photos importées pour modifier la photo
                principale.
              </p>
            )}
          </div>
        )}

        {/* Step 5 — Aperçu */}
        {step === 5 && (
          <div className="max-w-2xl">
            <PropertyCard property={previewProperty} className="pointer-events-none" />
          </div>
        )}

        {/* Step 6 — Publication */}
        {step === 6 && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Sparkles className="size-5 text-gold" /> Récapitulatif
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ["Type de bien", draft.category ? CATEGORY_OPTIONS.find((c) => c.value === draft.category)?.label ?? "—" : "Non renseigné"],
                  ["Titre", draft.title.trim() || "—"],
                  ["Description", draft.description.trim() ? `${draft.description.trim().slice(0, 80)}${draft.description.trim().length > 80 ? "…" : ""}` : "—"],
                  ["Prix", draft.price.trim() ? formatPrice(priceNumber(draft.price)) : "—"],
                  ["Ville", draft.city || "—"],
                  ["Adresse", draft.street.trim() || "—"],
                  ["Surface", numberOrZero(draft.surface) > 0 ? `${numberOrZero(draft.surface)} m²` : "—"],
                  ["Chambres", numberOrZero(draft.bedrooms) > 0 ? `${draft.bedrooms}` : "—"],
                  ["Salles de bain", numberOrZero(draft.bathrooms) > 0 ? `${draft.bathrooms}` : "—"],
                  ["Étage", numberOrZero(draft.floors) > 0 ? `${draft.floors}` : "—"],
                  ["Année", draft.yearBuilt.trim() ? draft.yearBuilt : "—"],
                  ["Photos", draft.images.length > 0 ? `${draft.images.length}` : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <BadgeCheck className="size-5 text-gold" /> Dernière vérification
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  ["Type de bien", !!draft.category],
                  ["Titre et description", !!(draft.title.trim() && draft.description.trim())],
                  ["Prix de vente", priceNumber(draft.price) > 0],
                  ["Localisation", !!(draft.city && draft.street.trim())],
                  ["Surface", numberOrZero(draft.surface) > 0],
                  ["Au moins une photo", draft.images.length > 0],
                ].map(([label, ok]) => (
                  <li key={label as string} className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full",
                        ok ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15" : "bg-red-100 text-red-600 dark:bg-red-500/15"
                      )}
                    >
                      <Check className="size-3.5" />
                    </span>
                    <span className={ok ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                Une fois publié, votre bien sera soumis à validation par notre équipe avant
                sa mise en ligne.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Live preview — steps 0–4 */}
      {step < 5 && (
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Aperçu en direct</p>
              <Badge className="border-transparent bg-gold/15 text-gold-strong">Avant publication</Badge>
            </div>
            <PropertyCard property={previewProperty} className="pointer-events-none shadow-lg" />
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Cette carte se met à jour en temps réel au fil de votre saisie.
            </p>
          </div>
        </aside>
      )}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex max-w-3xl items-center justify-between gap-3">
        {step > 0 ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => setStep((s) => s - 1)}
          >
            <ArrowLeft className="size-4" /> Retour
          </Button>
        ) : (
          <span />
        )}

        <div className="flex flex-col items-end gap-2">
          {stepError && (
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">{stepError}</p>
          )}
          {step < 6 ? (
            <Button
              type="button"
              disabled={!canProceed}
              className="rounded-full"
              onClick={() => setStep((s) => s + 1)}
            >
              Continuer <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              disabled={!canProceed || publishing}
              className="rounded-full bg-gold text-ink hover:bg-gold/90"
              onClick={handlePublish}
            >
              {publishing ? <Loader2 className="size-4 animate-spin" /> : <BadgeCheck className="size-4" />}
              Publier mon bien
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}