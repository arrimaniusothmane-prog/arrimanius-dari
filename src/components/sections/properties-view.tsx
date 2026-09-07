"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
  X,
  MapPin,
  ChevronDown,
} from "lucide-react";
import type { PropertyCategory, PropertyFilters } from "@/types";
import { PropertyCategory as Category } from "@/types";
import { mockCities } from "@/data/properties";
import { useSearchProperties } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyListRow } from "@/components/property/property-list-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const categories: { value: string; label: string }[] = [
  { value: "", label: "Tous les types" },
  { value: Category.APARTMENT, label: "Appartement" },
  { value: Category.VILLA, label: "Villa" },
  { value: Category.HOUSE, label: "Maison" },
  { value: Category.LAND, label: "Terrain" },
  { value: Category.COMMERCIAL, label: "Commercial" },
];

const sortOptions = [
  { value: "newest", label: "Plus récents" },
  { value: "price-asc", label: "Prix : croissant" },
  { value: "price-desc", label: "Prix : décroissant" },
  { value: "surface-desc", label: "Surface : décroissante" },
];

export function PropertiesView({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const router = useRouter();

  const [filters, setFilters] = useState<PropertyFilters>(() =>
    normalizeFilters(searchParams)
  );
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState(searchParams.search ?? "");

  const { properties, loading } = useSearchProperties(filters);

  const syncUrl = useCallback((f: PropertyFilters) => {
    const params = new URLSearchParams();
    if (f.search) params.set("search", f.search);
    if (f.city) params.set("city", f.city);
    if (f.category) params.set("category", f.category);
    if (f.minPrice !== undefined) params.set("minPrice", String(f.minPrice));
    if (f.maxPrice !== undefined) params.set("maxPrice", String(f.maxPrice));
    if (f.minSurface !== undefined) params.set("minSurface", String(f.minSurface));
    if (f.maxSurface !== undefined) params.set("maxSurface", String(f.maxSurface));
    if (f.bedrooms !== undefined) params.set("bedrooms", String(f.bedrooms));
    if (f.bathrooms !== undefined) params.set("bathrooms", String(f.bathrooms));
    if (f.isFurnished) params.set("isFurnished", "true");
    if (f.hasParking) params.set("hasParking", "true");
    if (f.hasPool) params.set("hasPool", "true");
    if (f.hasGarden) params.set("hasGarden", "true");
    if (f.hasTerrace) params.set("hasTerrace", "true");
    if (f.isNewConstruction) params.set("newConstruction", "true");
    if (f.isVerified) params.set("verified", "true");
    if (f.sortBy) params.set("sortBy", f.sortBy);
    const qs = params.toString();
    router.replace(qs ? `/properties?${qs}` : "/properties", { scroll: false });
  }, [router]);

  const updateFilters = useCallback((patch: Partial<PropertyFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    syncUrl(filters);
  }, [filters, syncUrl]);

  const clearAll = () => {
    setFilters(defaultFilters());
    setSearchInput("");
  };

  const activeFilterCount = countActive(filters);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const resultRange = useMemo(() => {
    const total = properties.length;
    return total;
  }, [properties]);

  const filtersContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Type de bien
        </label>
        <Select
          value={filters.category ?? ""}
          onChange={(v) => updateFilters({ category: (v || undefined) as PropertyCategory | undefined })}
          options={categories}
        />
      </div>

      {/* City */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="size-3" /> Ville</span>
        </label>
        <Select
          value={filters.city ?? ""}
          onChange={(v) => updateFilters({ city: v || undefined })}
          options={[{ value: "", label: "Toutes les villes" }, ...mockCities.map((c) => ({ value: c, label: c }))]}
        />
      </div>

      {/* Price */}
      <FilterSection title="Budget (MAD)">
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) => updateFilters({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) => updateFilters({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </FilterSection>

      {/* Surface */}
      <FilterSection title="Surface (m²)">
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minSurface ?? ""}
            onChange={(e) => updateFilters({ minSurface: e.target.value ? Number(e.target.value) : undefined })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxSurface ?? ""}
            onChange={(e) => updateFilters({ maxSurface: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection title="Chambres">
        <div className="flex flex-wrap gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => updateFilters({ bedrooms: filters.bedrooms === n ? undefined : n })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filters.bedrooms === n
                  ? "border-gold bg-gold text-white"
                  : "border-border text-muted-foreground hover:border-gold/50"
              )}
            >
              {n === 0 ? "Tous" : `${n}+`}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Bathrooms */}
      <FilterSection title="Salles de bain">
        <div className="flex flex-wrap gap-1.5">
          {[0, 1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => updateFilters({ bathrooms: filters.bathrooms === n ? undefined : n })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filters.bathrooms === n
                  ? "border-gold bg-gold text-white"
                  : "border-border text-muted-foreground hover:border-gold/50"
              )}
            >
              {n === 0 ? "Tous" : `${n}+`}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Features */}
      <FilterSection title="Équipements">
        <div className="space-y-2.5">
          <Toggle label="Meublé" checked={!!filters.isFurnished} onChange={(v) => updateFilters({ isFurnished: v || undefined })} />
          <Toggle label="Parking" checked={!!filters.hasParking} onChange={(v) => updateFilters({ hasParking: v || undefined })} />
          <Toggle label="Piscine" checked={!!filters.hasPool} onChange={(v) => updateFilters({ hasPool: v || undefined })} />
          <Toggle label="Jardin" checked={!!filters.hasGarden} onChange={(v) => updateFilters({ hasGarden: v || undefined })} />
          <Toggle label="Terrasse" checked={!!filters.hasTerrace} onChange={(v) => updateFilters({ hasTerrace: v || undefined })} />
          <Toggle label="Nouveau programme" checked={!!filters.isNewConstruction} onChange={(v) => updateFilters({ isNewConstruction: v || undefined })} />
        </div>
      </FilterSection>

      {/* Verification */}
      <Toggle label="Annonces vérifiées uniquement" checked={!!filters.isVerified} onChange={(v) => updateFilters({ isVerified: v || undefined })} />
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 lg:px-8">
      <div className="mb-6">
        <span className="text-sm font-semibold uppercase tracking-widest text-gold">
          Le marché
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          {properties.length} biens disponibles
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-2xl border border-border/60 bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display font-semibold">
                <SlidersHorizontal className="size-4 text-gold-strong" /> Filtres
              </h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 text-xs font-medium text-gold-strong hover:underline"
                >
                  <X className="size-3" /> Réinitialiser
                </button>
              )}
            </div>
            {filtersContent}
          </div>
        </aside>

        {/* Results */}
        <div>
          {/* Toolbar */}
          <div className="mb-6 flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Rechercher..."
                  className="rounded-full pl-9"
                />
              </div>
              <Button
                variant="outline"
                className="rounded-full"
                size="icon"
                aria-label="Rechercher"
              >
                <Search className="size-4" />
              </Button>
            </form>

            <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
              <button
                onClick={() => setView("grid")}
                className={cn("rounded-full p-2 transition-colors", view === "grid" ? "bg-gold text-ink" : "text-muted-foreground hover:text-foreground")}
                aria-label="Vue grille"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn("rounded-full p-2 transition-colors", view === "list" ? "bg-gold text-ink" : "text-muted-foreground hover:text-foreground")}
                aria-label="Vue liste"
              >
                <List className="size-4" />
              </button>
            </div>

            {/* Sort */}
            <Select
              value={filters.sortBy ?? "newest"}
              onChange={(v) => updateFilters({ sortBy: v || undefined })}
              options={sortOptions}
              className="hidden w-44 md:block"
            />
          </div>

          {/* Mobile filter trigger */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  className="mb-4 w-full rounded-full lg:hidden"
                />
              }
            >
              <SlidersHorizontal className="mr-2 size-4" />
              Filtres{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
              <SheetHeader>
                <SheetTitle>
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="size-4 text-gold" /> Filtres
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 pb-6">{filtersContent}</div>
              <div className="sticky bottom-0 -mx-4 border-t border-border bg-background/90 px-4 pt-3 backdrop-blur">
                <Button
                  onClick={clearAll}
                  variant="ghost"
                  className="w-full rounded-full"
                >
                  Réinitialiser tous les filtres
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Results count per query */}
          <p className="mb-4 text-sm text-muted-foreground">
            {loading ? "Chargement..." : `${resultRange} résultat${resultRange > 1 ? "s" : ""}`}
          </p>

          {/* Grid */}
          {loading ? (
            <div className={view === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-border/60">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="space-y-3 p-4">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <EmptyState onReset={clearAll} />
          ) : view === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((p) => (
                <PropertyListRow key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function normalizeFilters(
  sp: Record<string, string | undefined>
): PropertyFilters {
  const num = (v?: string) => (v && !isNaN(Number(v)) ? Number(v) : undefined);
  return {
    search: sp.search?.trim() ?? "",
    category: (sp.category as PropertyCategory) || undefined,
    city: sp.city || undefined,
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    minSurface: num(sp.minSurface),
    maxSurface: num(sp.maxSurface),
    bedrooms: num(sp.bedrooms),
    bathrooms: num(sp.bathrooms),
    isFurnished: sp.isFurnished === "true" ? true : undefined,
    hasParking: sp.hasParking === "true" ? true : undefined,
    hasPool: sp.hasPool === "true" ? true : undefined,
    hasGarden: sp.hasGarden === "true" ? true : undefined,
    hasTerrace: sp.hasTerrace === "true" ? true : undefined,
    isNewConstruction:
      sp.newConstruction === "true" ? true : sp.isNewConstruction === "true" ? true : undefined,
    isVerified: sp.verified === "true" ? true : sp.isVerified === "true" ? true : undefined,
    status: undefined,
    sortBy: sp.sortBy || "newest",
  };
}

function defaultFilters(): PropertyFilters {
  return {
    search: "",
    category: undefined,
    city: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    minSurface: undefined,
    maxSurface: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    isFurnished: undefined,
    hasParking: undefined,
    hasPool: undefined,
    hasGarden: undefined,
    hasTerrace: undefined,
    isNewConstruction: undefined,
    isVerified: undefined,
    status: undefined,
    sortBy: "newest",
  };
}

function countActive(f: PropertyFilters): number {
  const checks = [
    f.search, f.city, f.category, f.minPrice, f.maxPrice, f.minSurface,
    f.maxSurface, f.bedrooms, f.bathrooms, f.isFurnished, f.hasParking,
    f.hasPool, f.hasGarden, f.hasTerrace, f.isNewConstruction, f.isVerified,
  ];
  return checks.filter(Boolean).length;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border/60 pt-5">
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </label>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none rounded-xl border border-border bg-card px-3.5 py-2.5 pr-10 text-sm font-medium outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20"
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-gold" : "bg-muted"
        )}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-sand">
        <Search className="size-7 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold">
        Aucun bien ne correspond à vos critères
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Essayez d&apos;élargir votre recherche ou de modifier vos filtres pour
        découvrir plus de biens.
      </p>
      <Button onClick={onReset} className="mt-6 rounded-full">
        Réinitialiser la recherche
      </Button>
    </div>
  );
}