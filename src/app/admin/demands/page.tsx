"use client";

import { useEffect, useState } from "react";
import { Inbox, Loader2, Eye, Trash2, Search } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, cn } from "@/lib/utils";
import {
  demandeTypeLabel,
  demandeTypeBadge,
  demandeStatusLabel,
  demandeStatusBadge,
} from "@/lib/labels";
import {
  listDemandes,
  updateDemandeStatus,
  deleteDemande,
} from "@/services/demandeService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Demande,
  DemandeType,
  DemandeStatus,
} from "@/types";

const typeFilters = [
  { value: "", label: "Toutes" },
  { value: DemandeType.DEVIS, label: "Devis" },
  { value: DemandeType.CONTACT, label: "Contact" },
  { value: DemandeType.CONTACT_BIEN, label: "Contact bien" },
  { value: DemandeType.VISITE, label: "Visite" },
  { value: DemandeType.OFFRE, label: "Offre" },
  { value: DemandeType.PUBLICATION, label: "Publication" },
];

export default function AdminDemandesPage() {
  const [demands, setDemands] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Demande | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = () => {
    listDemandes()
      .then(setDemands)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = demands
    .filter((d) => !typeFilter || d.type === typeFilter)
    .filter((d) => !statusFilter || d.status === statusFilter)
    .filter(
      (d) =>
        !search ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const nouvelleCount = demands.filter((d) => d.status === DemandeStatus.NOUVELLE).length;
  const enCoursCount = demands.filter((d) => d.status === DemandeStatus.EN_COURS).length;
  const traiteeCount = demands.filter((d) => d.status === DemandeStatus.TRAITEE).length;

  const handleStatus = async (id: string, status: DemandeStatus) => {
    setUpdating(true);
    try {
      await updateDemandeStatus(id, status);
      setDemands((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d))
      );
      setDetail((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette demande ?")) return;
    setUpdating(true);
    try {
      await deleteDemande(id);
      setDemands((prev) => prev.filter((d) => d.id !== id));
      setDetail((prev) => (prev && prev.id === id ? null : prev));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Demandes"
        subtitle="Toutes les demandes soumises sur la plateforme."
      />

      {/* Summary chips */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <span className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
            <span className="text-xs font-bold">{nouvelleCount}</span>
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Nouvelles</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <span className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            <span className="text-xs font-bold">{enCoursCount}</span>
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">En cours</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <span className="text-xs font-bold">{traiteeCount}</span>
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Traitées</span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-1.5">
          {typeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                typeFilter === f.value
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border text-muted-foreground hover:border-gold/40"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="h-9 w-48 rounded-full pl-9 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-full border border-border bg-card px-3 text-xs"
          >
            <option value="">Tous statuts</option>
            <option value={DemandeStatus.NOUVELLE}>Nouvelle</option>
            <option value={DemandeStatus.EN_COURS}>En cours</option>
            <option value={DemandeStatus.TRAITEE}>Traitée</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Inbox className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Aucune demande pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sand text-gold">
                  <span className="font-display text-sm font-semibold">
                    {d.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("") || "?"}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{d.title}</p>
                  </div>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{d.name}</span>
                    <span>·</span>
                    <span>{d.email}</span>
                    <span>·</span>
                    <span>{formatDate(d.createdAt)}</span>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge
                  className={demandeTypeBadge[d.type]}
                  label={demandeTypeLabel[d.type]}
                />
                <StatusBadge
                  className={demandeStatusBadge[d.status]}
                  label={demandeStatusLabel[d.status]}
                />
                <button
                  onClick={() => setDetail(d)}
                  className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-sand hover:text-foreground"
                >
                  <Eye className="size-4" />
                </button>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-lg">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{detail.title}</DialogTitle>
                <DialogDescription>
                  {demandeTypeLabel[detail.type]} · {formatDate(detail.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <StatusBadge className={demandeTypeBadge[detail.type]} label={demandeTypeLabel[detail.type]} />
                  <StatusBadge className={demandeStatusBadge[detail.status]} label={demandeStatusLabel[detail.status]} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">Nom</span>
                    <p className="font-medium">{detail.name || "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Téléphone</span>
                    <p className="font-medium">{detail.phone || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-muted-foreground">Email</span>
                    <p className="font-medium">{detail.email || "—"}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Message</span>
                  <p className="mt-1 whitespace-pre-wrap rounded-xl bg-sand/50 p-3 text-sm">
                    {detail.message || "—"}
                  </p>
                </div>
                {Object.keys(detail.data).length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground">Données supplémentaires</span>
                    <div className="mt-1 grid grid-cols-2 gap-2 rounded-xl bg-sand/50 p-3 text-sm">
                      {Object.entries(detail.data).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-xs text-muted-foreground">{k}</span>
                          <p className="font-medium">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 border-t border-border pt-4">
                  {detail.status !== DemandeStatus.EN_COURS && (
                    <Button
                      disabled={updating}
                      onClick={() => handleStatus(detail.id, DemandeStatus.EN_COURS)}
                      className="rounded-full"
                      size="sm"
                    >
                      {updating && <Loader2 className="mr-1 size-3 animate-spin" />}
                      Prendre en charge
                    </Button>
                  )}
                  {detail.status !== DemandeStatus.TRAITEE && (
                    <Button
                      disabled={updating}
                      onClick={() => handleStatus(detail.id, DemandeStatus.TRAITEE)}
                      className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                      size="sm"
                    >
                      {updating && <Loader2 className="mr-1 size-3 animate-spin" />}
                      Marquer traitée
                    </Button>
                  )}
                  {detail.status !== DemandeStatus.NOUVELLE && (
                    <Button
                      variant="ghost"
                      disabled={updating}
                      onClick={() => handleStatus(detail.id, DemandeStatus.NOUVELLE)}
                      size="sm"
                    >
                      {updating && <Loader2 className="mr-1 size-3 animate-spin" />}
                      Renvoyer en attente
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    disabled={updating}
                    onClick={() => handleDelete(detail.id)}
                    className="ml-auto text-red-600 hover:text-red-700"
                    size="sm"
                  >
                    {updating && <Loader2 className="mr-1 size-3 animate-spin" />}
                    Supprimer
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
