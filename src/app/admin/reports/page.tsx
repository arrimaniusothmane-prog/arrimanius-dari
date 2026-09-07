"use client";

import Image from "next/image";
import { FileDown, BarChart3, MapPin, Filter, Trophy } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { mockProperties } from "@/data/properties";
import { formatPrice, cn } from "@/lib/utils";

const growthData = [12, 18, 15, 22, 19, 26, 31, 28, 34, 39, 44, 49];

const leadsByCity = [
  { city: "Casablanca", value: 62 },
  { city: "Marrakech", value: 38 },
  { city: "Rabat", value: 27 },
  { city: "Tanger", value: 19 },
  { city: "Fès", value: 12 },
];

const funnel = [
  { label: "Vues", value: 2400, pct: 100 },
  { label: "Contacts", value: 648, pct: 27 },
  { label: "Visites", value: 216, pct: 9 },
  { label: "Offres", value: 86, pct: 3.6 },
  { label: "Transactions", value: 31, pct: 1.3 },
];

const downloadReports = [
  { title: "Rapport mensuel", desc: "Activité de la plateforme, Vue d'ensemble", file: "rapport-mensuel.pdf" },
  { title: "Rapport revenus", desc: "Détail des commissions et ventes", file: "rapport-revenus.pdf" },
  { title: "Rapport utilisateurs", desc: "Croissance et répartition par rôle", file: "rapport-utilisateurs.pdf" },
];

export default function AdminReportsPage() {
  const maxGrowth = Math.max(...growthData);
  const maxCity = Math.max(...leadsByCity.map((c) => c.value));

  const topBiens = [...mockProperties]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);
  const maxViews = topBiens[0]?.views ?? 1;

  return (
    <div>
      <DashboardHeader
        title="Rapports"
        subtitle="Indicateurs clés de performance."
      />

      {/* Download cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {downloadReports.map((r) => (
          <button
            key={r.title}
            onClick={() => {}}
            className="group flex flex-col items-start gap-3 rounded-2xl border border-border/60 bg-card p-5 text-left shadow-sm transition-colors hover:border-gold/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand text-gold transition-colors group-hover:bg-gold group-hover:text-white">
              <FileDown className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-base font-semibold">{r.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{r.desc}</p>
            </div>
            <span className="mt-auto rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              {r.file}
            </span>
          </button>
        ))}
      </div>

      {/* Listings growth */}
      <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-5 text-gold" />
          <h2 className="font-display text-lg font-semibold">Croissance des annonces</h2>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">Publications mensuelles</p>
        <div className="mt-8 flex h-44 items-end gap-1.5 sm:gap-2">
          {growthData.map((value, i) => (
            <div key={i} className="group flex flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-lg bg-gold transition-all duration-300 group-hover:brightness-110"
                  style={{ height: `${(value / maxGrowth) * 100}%` }}
                />
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-1.5 sm:gap-2">
          {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m, i) => (
            <span key={i} className="flex-1 text-center text-[10px] text-muted-foreground">{m}</span>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Leads by city */}
        <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-gold" />
            <h2 className="font-display text-lg font-semibold">Leads par ville</h2>
          </div>
          <div className="mt-6 space-y-4">
            {leadsByCity.map((c) => (
              <div key={c.city} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm font-medium">{c.city}</span>
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-sand/60">
                  <div
                    className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-gold/50 to-gold pr-2 transition-all"
                    style={{ width: `${(c.value / maxCity) * 100}%` }}
                  >
                    <span className="text-[10px] font-semibold text-white">{c.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Conversion funnel */}
        <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-gold" />
            <h2 className="font-display text-lg font-semibold">Entonnoir de conversion</h2>
          </div>
          <div className="mt-6 space-y-3">
            {funnel.map((step, i) => (
              <div key={step.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="flex size-5 items-center justify-center rounded-full bg-sand text-[10px] font-bold text-gold">
                      {i + 1}
                    </span>
                    {step.label}
                  </span>
                  <span className="text-muted-foreground">
                    {step.value} <span className="text-xs">({step.pct}%)</span>
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-sand/50">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Taux de conversion global : {funnel[funnel.length - 1].pct}% des vues aboutissent à une transaction.
          </p>
        </section>
      </div>

      {/* Top biens */}
      <section className="mt-6 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Trophy className="size-5 text-gold" />
          <h2 className="font-display text-lg font-semibold">Top biens</h2>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">Les 3 annonces les plus consultées</p>
        <div className="mt-6 space-y-5">
          {topBiens.map((p, i) => {
            const image = p.images.find((img) => img.isPrimary) ?? p.images[0];
            return (
              <div key={p.id} className="flex items-center gap-4">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold",
                    i === 0 ? "bg-gold text-white" : "bg-sand text-gold"
                  )}
                >
                  {i + 1}
                </span>
                {image && (
                  <Image src={image.url} alt={image.alt} width={64} height={48} className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.title}</p>
                  <div className="mt-1.5 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold/50 to-gold"
                        style={{ width: `${(p.views / maxViews) * 100}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{p.views} vues</span>
                  </div>
                </div>
                <Badge className="shrink-0 border-transparent bg-gold/15 text-gold">{formatPrice(p.price)}</Badge>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
