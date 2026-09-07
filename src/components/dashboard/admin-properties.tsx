"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Eye, Loader2, Trash2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getProperties, updateProperty } from "@/services/propertyService";
import { PropertyStatus, PropertyCategory } from "@/types";
import type { Property } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

const statusLabel: Record<PropertyStatus, string> = {
  [PropertyStatus.DRAFT]: "Brouillon",
  [PropertyStatus.PENDING_REVIEW]: "En attente",
  [PropertyStatus.PUBLISHED]: "Publié",
  [PropertyStatus.PAUSED]: "En pause",
  [PropertyStatus.SOLD]: "Vendu",
  [PropertyStatus.REJECTED]: "Refusé",
};

const statusBadgeClass: Record<PropertyStatus, string> = {
  [PropertyStatus.PUBLISHED]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [PropertyStatus.PENDING_REVIEW]: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  [PropertyStatus.DRAFT]: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  [PropertyStatus.PAUSED]: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  [PropertyStatus.SOLD]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  [PropertyStatus.REJECTED]: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

const statusFilterLabel: Record<string, string> = {
  ALL: "Tous",
  [PropertyStatus.PUBLISHED]: "Publiés",
  [PropertyStatus.PENDING_REVIEW]: "En attente",
  [PropertyStatus.DRAFT]: "Brouillons",
  [PropertyStatus.PAUSED]: "En pause",
};

const categoryLabel: Record<PropertyCategory, string> = {
  [PropertyCategory.APARTMENT]: "Appartement",
  [PropertyCategory.VILLA]: "Villa",
  [PropertyCategory.HOUSE]: "Maison",
  [PropertyCategory.LAND]: "Terrain",
  [PropertyCategory.COMMERCIAL]: "Commercial",
};

const filterOptions = ["ALL", PropertyStatus.PUBLISHED, PropertyStatus.PENDING_REVIEW, PropertyStatus.DRAFT, PropertyStatus.PAUSED];

export function AdminProperties({ title, subtitle }: { title: string; subtitle: string }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    getProperties()
      .then(setProperties)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const counts = properties.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  const filtered = properties.filter((p) => {
    const matchStatus = filter === "ALL" || p.status === filter;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.address.city.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const setStatus = (id: string, status: PropertyStatus) => {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const handleToggle = async (p: Property) => {
    setBusyId(p.id);
    try {
      const target = p.status === PropertyStatus.PUBLISHED ? PropertyStatus.PAUSED : PropertyStatus.PUBLISHED;
      const updated = await updateProperty(p.id, { status: target });
      if (updated) setStatus(p.id, target);
    } finally {
      setBusyId(null);
    }
  };

  const handleApprove = async (p: Property) => {
    setBusyId(p.id);
    try {
      const updated = await updateProperty(p.id, { status: PropertyStatus.PUBLISHED });
      if (updated) setStatus(p.id, PropertyStatus.PUBLISHED);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const city = (c: string) => c.split(",")[0].trim();

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre ou ville…"
            className="h-10 rounded-xl pl-9"
          />
        </div>
      </div>

      {/* Status filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filterOptions.map((key) => {
          const count = key === "ALL" ? properties.length : (counts[key] ?? 0);
          const active = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-gold bg-gold text-white"
                  : "border-border bg-card text-muted-foreground hover:border-gold hover:text-foreground"
              )}
            >
              {statusFilterLabel[key] ?? statusLabel[key as PropertyStatus]}
              <span className={cn("ml-1.5", active ? "text-white/80" : "text-gold")}>{count}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
          Aucun bien ne correspond à votre recherche.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-4 font-medium">Bien</th>
                  <th className="px-5 py-4 font-medium">Catégorie</th>
                  <th className="px-5 py-4 font-medium">Prix</th>
                  <th className="px-5 py-4 font-medium">Ville</th>
                  <th className="px-5 py-4 font-medium">Vues</th>
                  <th className="px-5 py-4 font-medium">Statut</th>
                  <th className="px-5 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const image = p.images.find((img) => img.isPrimary) ?? p.images[0];
                  const pending = p.status === PropertyStatus.PENDING_REVIEW;
                  const busy = busyId === p.id;
                  const isPublished = p.status === PropertyStatus.PUBLISHED;
                  return (
                    <tr key={p.id} className="border-b border-border/60 align-middle last:border-0 hover:bg-muted/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {image && (
                            <Image
                              src={image.url}
                              alt={image.alt}
                              width={56}
                              height={40}
                              className="h-10 w-14 shrink-0 rounded-lg object-cover"
                            />
                          )}
                          <div className="min-w-0">
                            <Link
                              href={`/properties/${p.slug}`}
                              className="line-clamp-1 font-medium text-foreground hover:text-gold"
                            >
                              {p.title}
                            </Link>
                            <p className="truncate text-xs text-muted-foreground">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant="outline" className="shrink-0 border-border text-muted-foreground">
                          {categoryLabel[p.category]}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 font-semibold whitespace-nowrap">{formatPrice(p.price)}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">{city(p.address.city)}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Eye className="size-3.5" /> {p.views}</span>
                      </td>
                      <td className="px-5 py-3">
                        <Badge className={cn("shrink-0 border-transparent", statusBadgeClass[p.status])}>
                          {statusLabel[p.status]}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {pending && (
                            <Button
                              size="sm"
                              disabled={busy}
                              className="rounded-full bg-emerald-600 text-white hover:bg-emerald-600/90"
                              onClick={() => handleApprove(p)}
                            >
                              {busy ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                              Approuver
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy || p.status === PropertyStatus.SOLD}
                            onClick={() => handleToggle(p)}
                            className="rounded-full"
                          >
                            {isPublished ? "Désactiver" : "Activer"}
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label="Supprimer"
                            className="rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                            onClick={() => handleDelete(p.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
