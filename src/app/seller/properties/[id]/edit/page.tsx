"use client";

import { useEffect, use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, CheckCircle2 } from "lucide-react";
import type { Property } from "@/types";
import { PropertyStatus } from "@/types";
import { getProperties, updateProperty } from "@/services/propertyService";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";

const statusLabel: Record<PropertyStatus, string> = {
  [PropertyStatus.DRAFT]: "Brouillon",
  [PropertyStatus.PENDING_REVIEW]: "En attente",
  [PropertyStatus.PUBLISHED]: "Publié",
  [PropertyStatus.PAUSED]: "En pause",
  [PropertyStatus.SOLD]: "Vendu",
  [PropertyStatus.REJECTED]: "Refusé",
};

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<PropertyStatus>(PropertyStatus.DRAFT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProperties()
      .then((all) => {
        const found = all.find((p) => p.id === id);
        if (!found) {
          setNotFound(true);
          return;
        }
        setProperty(found);
        setTitle(found.title);
        setPrice(String(found.price));
        setStatus(found.status);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !title.trim()) return;
    setSaving(true);
    try {
      const parsed = Number(price.replace(/\s/g, ""));
      const updated = await updateProperty(property.id, {
        title: title.trim(),
        price: Number.isFinite(parsed) && parsed > 0 ? parsed : property.price,
        status,
      });
      if (updated) {
        setProperty(updated);
        setSaved(true);
        window.setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const previewPrice = Number(price.replace(/\s/g, ""));
  const formattedPreviewPrice = Number.isFinite(previewPrice) && previewPrice > 0 ? formatPrice(previewPrice) : formatPrice(property?.price ?? 0);

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        render={<Link href="/seller/properties" />}
        className="-ml-2 mb-4 text-muted-foreground"
      >
        <ArrowLeft className="size-4" /> Retour à mes biens
      </Button>

      <DashboardHeader title="Modifier le bien" subtitle="Mettez à jour les informations essentielles de votre annonce." />

      {loading ? (
        <div className="max-w-xl space-y-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      ) : notFound || !property ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">Ce bien n&apos;existe pas ou a été supprimé.</p>
          <Button variant="outline" render={<Link href="/seller/properties" />} className="mt-4 rounded-full">
            Retour à mes biens
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="max-w-xl space-y-5">
          {saved && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckCircle2 className="size-4" /> Bien mis à jour ✓
            </div>
          )}

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-title">Titre</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex : Villa moderne Bouskoura"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-price">Prix (MAD)</Label>
                  <Input
                    id="edit-price"
                    inputMode="numeric"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2 850 000"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Statut</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as PropertyStatus)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(PropertyStatus) as PropertyStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {statusLabel[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-sand/60 p-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Aperçu :</span>
                {title.trim() || "Sans titre"}
                <Badge className="border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  {formattedPreviewPrice}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" className="rounded-full" render={<Link href="/seller/properties" />}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving || !title.trim()} className="rounded-full">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Enregistrer
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}