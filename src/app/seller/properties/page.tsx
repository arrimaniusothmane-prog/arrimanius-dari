"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Eye,
  MoreHorizontal,
  Pause,
  Play,
  CheckCircle2,
  Pencil,
  Trash2,
  BadgeCheck,
  PackageOpen,
} from "lucide-react";
import type { Property } from "@/types";
import { PropertyCategory, PropertyStatus } from "@/types";
import { getProperties, togglePauseProperty, markAsSold, deleteProperty } from "@/services/propertyService";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { formatPrice, cn } from "@/lib/utils";
import { useCurrentSellerId } from "@/hooks/useCurrentSeller";

type FilterKey = "all" | "recent" | PropertyStatus;

const categoryLabels: Record<PropertyCategory, string> = {
  [PropertyCategory.APARTMENT]: "Appartement",
  [PropertyCategory.VILLA]: "Villa",
  [PropertyCategory.HOUSE]: "Maison",
  [PropertyCategory.LAND]: "Terrain",
  [PropertyCategory.COMMERCIAL]: "Commercial",
};

const categoryBadgeClass: Record<PropertyCategory, string> = {
  [PropertyCategory.APARTMENT]: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  [PropertyCategory.VILLA]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [PropertyCategory.HOUSE]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [PropertyCategory.LAND]: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  [PropertyCategory.COMMERCIAL]: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
};

const statusLabel: Record<PropertyStatus, string> = {
  [PropertyStatus.DRAFT]: "Brouillon",
  [PropertyStatus.PENDING_REVIEW]: "En attente",
  [PropertyStatus.PUBLISHED]: "Publié",
  [PropertyStatus.PAUSED]: "En pause",
  [PropertyStatus.SOLD]: "Vendu",
  [PropertyStatus.REJECTED]: "Refusé",
};

const statusBadgeClass: Record<PropertyStatus, string> = {
  [PropertyStatus.DRAFT]: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  [PropertyStatus.PENDING_REVIEW]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [PropertyStatus.PUBLISHED]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [PropertyStatus.PAUSED]: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  [PropertyStatus.SOLD]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [PropertyStatus.REJECTED]: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "recent", label: "Récents" },
  { key: PropertyStatus.PUBLISHED, label: "Publiés" },
  { key: PropertyStatus.DRAFT, label: "Brouillon" },
  { key: PropertyStatus.PENDING_REVIEW, label: "En attente" },
  { key: PropertyStatus.PAUSED, label: "En pause" },
  { key: PropertyStatus.SOLD, label: "Vendus" },
];

function Thumbnail({ property }: { property: Property }) {
  const [error, setError] = useState(false);
  const primary = property.images.find((i) => i.isPrimary) ?? property.images[0];
  if (!primary || error) {
    return (
      <div className="flex aspect-[24/16] items-center justify-center rounded-lg bg-sand text-xs font-medium text-muted-foreground">
        {categoryLabels[property.category]}
      </div>
    );
  }
  return (
    <div className="aspect-[24/16] overflow-hidden rounded-lg bg-muted">
      <Image
        src={primary.url}
        alt={primary.alt || property.title}
        width={96}
        height={64}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => setError(true)}
      />
    </div>
  );
}

function RowActions({
  property,
  busy,
  onPause,
  onSold,
  onDelete,
}: {
  property: Property;
  busy: boolean;
  onPause: (p: Property) => void;
  onSold: (p: Property) => void;
  onDelete: (p: Property) => void;
}) {
  const canPause = property.status === PropertyStatus.PUBLISHED || property.status === PropertyStatus.PAUSED;
  const canSell = property.status !== PropertyStatus.SOLD && property.status !== PropertyStatus.REJECTED;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" disabled={busy} aria-label="Actions" />}>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {canPause && (
            <DropdownMenuItem onClick={() => onPause(property)}>
              {property.status === PropertyStatus.PAUSED ? (
                <>
                  <Play className="size-4" /> Reprendre la publication
                </>
              ) : (
                <>
                  <Pause className="size-4" /> Mettre en pause
                </>
              )}
            </DropdownMenuItem>
          )}
          {canSell && (
            <DropdownMenuItem onClick={() => onSold(property)}>
              <BadgeCheck className="size-4" /> Marquer vendu
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href={`/seller/properties/${property.id}/edit`} />}>
            <Pencil className="size-4" /> Modifier
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(property)}>
            <Trash2 className="size-4" /> Supprimer
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function SellerPropertiesPage() {
  const sellerId = useCurrentSellerId();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getProperties()
      .then((all) => setProperties(all.filter((p) => p.sellerId === sellerId)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sellerId]);

  const notify = useCallback((type: "success" | "error", text: string) => {
    setFeedback({ type, text });
    window.setTimeout(() => setFeedback(null), 3000);
  }, []);

  const applyFilter = useCallback(
    (list: Property[], key: FilterKey) => {
      if (key === "recent") return [...list];
      if (key === "all") return list;
      return list.filter((p) => p.status === key);
    },
    []
  );

  const filtered = useMemo(() => {
    const sorted = [...properties].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (filter === "recent") return sorted;
    return applyFilter(sorted, filter);
  }, [properties, filter, applyFilter]);

  const countFor = (key: FilterKey) => {
    if (key === "all") return properties.length;
    if (key === "recent") return properties.length;
    return properties.filter((p) => p.status === key).length;
  };

  const handlePause = async (p: Property) => {
    setBusyId(p.id);
    try {
      const updated = await togglePauseProperty(p.id);
      if (updated) {
        setProperties((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        notify("success", `Bien ${updated.status === PropertyStatus.PAUSED ? "mis en pause" : "republié"} ✓`);
      }
    } catch {
      notify("error", "Une erreur est survenue.");
    } finally {
      setBusyId(null);
    }
  };

  const handleSold = async (p: Property) => {
    if (!window.confirm(`Confirmer la vente de « ${p.title} » ?`)) return;
    setBusyId(p.id);
    try {
      const updated = await markAsSold(p.id);
      if (updated) {
        setProperties((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        notify("success", "Bien marqué vendu ✓");
      }
    } catch {
      notify("error", "Une erreur est survenue.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (p: Property) => {
    if (!window.confirm(`Supprimer « ${p.title} » ? Cette action est irréversible.`)) return;
    setBusyId(p.id);
    try {
      await deleteProperty(p.id);
      setProperties((prev) => prev.filter((x) => x.id !== p.id));
      notify("success", "Bien supprimé ✓");
    } catch {
      notify("error", "Une erreur est survenue.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Mes biens"
        subtitle="Gérez vos annonces, leur statut et leur visibilité."
        action={
          <Button render={<Link href="/seller/add" />} className="rounded-full bg-gold text-white hover:bg-gold/90">
            <Plus className="size-4" /> Ajouter un bien
          </Button>
        }
      />

      {feedback && (
        <div
          className={cn(
            "mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium",
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          )}
        >
          <CheckCircle2 className="size-4 shrink-0" />
          {feedback.text}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-white"
                  : "border-border/60 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] font-semibold",
                  active ? "bg-white/20" : "bg-sand text-muted-foreground"
                )}
              >
                {countFor(f.key)}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      ) : properties.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-sand text-gold">
            <PackageOpen className="size-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold">Aucun bien pour le moment</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Publiez votre premier bien et touchez des milliers d&apos;acheteurs à travers le Maroc.
          </p>
          <Button render={<Link href="/seller/add" />} className="mt-6 rounded-full bg-gold text-white hover:bg-gold/90">
            <Plus className="size-4" /> Ajouter un bien
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Aucun bien ne correspond à ce filtre.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3.5 font-medium">Bien</th>
                  <th className="px-4 py-3.5 font-medium">Catégorie</th>
                  <th className="px-4 py-3.5 font-medium">Prix</th>
                  <th className="px-4 py-3.5 font-medium">Vues</th>
                  <th className="px-4 py-3.5 font-medium">Statut</th>
                  <th className="px-4 py-3.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 shrink-0">
                          <Thumbnail property={p} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{p.title}</p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            /{p.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={cn("border-transparent", categoryBadgeClass[p.category])}>
                        {categoryLabels[p.category]}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 font-semibold">{formatPrice(p.price)}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <Eye className="size-4" /> {p.views}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={cn("border-transparent", statusBadgeClass[p.status])}>
                        {statusLabel[p.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <RowActions property={p} busy={busyId === p.id} onPause={handlePause} onSold={handleSold} onDelete={handleDelete} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 space-y-4 md:hidden">
            {filtered.map((p) => (
              <div key={p.id} className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-24 shrink-0">
                    <Thumbnail property={p} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{p.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">/{p.slug}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <Badge className={cn("border-transparent", categoryBadgeClass[p.category])}>
                    {categoryLabels[p.category]}
                  </Badge>
                  <Badge className={cn("border-transparent", statusBadgeClass[p.status])}>
                    {statusLabel[p.status]}
                  </Badge>
                  <span className="ml-auto flex items-center gap-1 text-muted-foreground">
                    <Eye className="size-4" /> {p.views}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
                  <p className="font-display text-base font-semibold">{formatPrice(p.price)}</p>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" render={<Link href={`/seller/properties/${p.id}/edit`} />}>
                        <Pencil className="size-3.5" /> Modifier
                      </Button>
                      {(p.status === PropertyStatus.PUBLISHED || p.status === PropertyStatus.PAUSED) && (
                        <Button size="sm" variant="outline" disabled={busyId === p.id} onClick={() => handlePause(p)}>
                          {p.status === PropertyStatus.PAUSED ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
                          {p.status === PropertyStatus.PAUSED ? "Reprendre" : "Pause"}
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {p.status !== PropertyStatus.SOLD && p.status !== PropertyStatus.REJECTED && (
                        <Button size="sm" variant="outline" disabled={busyId === p.id} onClick={() => handleSold(p)}>
                          <BadgeCheck className="size-3.5" /> Vendu
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === p.id}
                        className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        onClick={() => handleDelete(p)}
                      >
                        <Trash2 className="size-3.5" /> Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}