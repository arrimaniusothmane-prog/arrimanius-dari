"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2, Wallet, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "acheter", label: "Acheter", href: "/buy" },
  { id: "vendre", label: "Vendre", href: "/sell" },
  { id: "investir", label: "Investir", href: "/invest" },
];

const propertyTypes = [
  { value: "", label: "Tous les biens" },
  { value: "APARTMENT", label: "Appartement" },
  { value: "VILLA", label: "Villa" },
  { value: "HOUSE", label: "Maison" },
  { value: "LAND", label: "Terrain" },
  { value: "COMMERCIAL", label: "Commercial" },
];

export function HeroSearch() {
  const [activeTab, setActiveTab] = useState("acheter");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("city", location);
    if (type) params.set("category", type);
    if (budget) params.set("maxPrice", budget);
    if (bedrooms) params.set("bedrooms", bedrooms);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Objectif de recherche"
        className="mb-4 flex justify-center gap-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              router.push(tab.href);
            }}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium backdrop-blur-md transition-all",
              activeTab === tab.id
                ? "bg-white text-ink shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search card */}
      <form
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-2 sm:rounded-full sm:p-1.5"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:rounded-full">
          <Field
            icon={<MapPin className="size-4" />}
            label="Localisation"
            value={location}
            onChange={setLocation}
            placeholder="Ville, quartier..."
          />
          <Divider />
          <Field
            icon={<Building2 className="size-4" />}
            label="Type de bien"
            value={type}
            onChange={setType}
            placeholder="Tous"
            asSelect
            options={propertyTypes}
          />
          <Divider />
          <Field
            icon={<Wallet className="size-4" />}
            label="Budget"
            value={budget}
            onChange={setBudget}
            placeholder="Max MAD"
            type="number"
          />
          <Divider />
          <Field
            icon={<BedDouble className="size-4" />}
            label="Chambres"
            value={bedrooms}
            onChange={setBedrooms}
            placeholder="Toutes"
            type="number"
          />
          <Button
            type="submit"
            size="lg"
            className="mt-1 shrink-0 gap-2 rounded-full bg-gold px-6 text-ink hover:bg-gold/90 sm:m-0 sm:rounded-full"
          >
            <Search className="size-4" />
            Rechercher
          </Button>
        </div>
      </form>
    </div>
  );
}

function Divider() {
  return <div className="hidden h-8 w-px bg-border sm:block" />;
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  asSelect,
  options,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  asSelect?: boolean;
  options?: { value: string; label: string }[];
  type?: string;
}) {
  return (
    <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-full px-4 py-2.5 transition-colors hover:bg-muted/60 sm:py-2">
      <span className="text-ink/60">{icon}</span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink/50">
          {label}
        </span>
        {asSelect && options ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full truncate bg-transparent text-sm font-medium text-ink outline-none"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full truncate bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink/40"
          />
        )}
      </span>
    </label>
  );
}
