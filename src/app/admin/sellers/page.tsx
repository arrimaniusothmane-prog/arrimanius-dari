"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  BadgeCheck,
  ShieldAlert,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Home,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { hiddenUserIds, mockProperties } from "@/data/properties";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/userService";
import { UserRole } from "@/types";
import type { User } from "@/types";
import { formatDate, cn } from "@/lib/utils";

type SellerUser = User & { status: "ACTIF" | "SUSPENDU" };

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<SellerUser | null>(null);
  const [viewing, setViewing] = useState<SellerUser | null>(null);
  const [deleting, setDeleting] = useState<SellerUser | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    status: "ACTIF" as "ACTIF" | "SUSPENDU",
    isVerified: false,
  });

  useEffect(() => {
    listUsers(UserRole.SELLER)
      .then((list) =>
        setSellers(
          list
            .filter((u) => !hiddenUserIds.includes(u.id))
            .map((u) => ({ ...u, status: u.status }))
        )
      )
      .catch((err) =>
        setActionError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les vendeurs."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = sellers.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.companyName ?? "").toLowerCase().includes(q)
    );
  });

  const activeCount = sellers.filter((u) => u.status === "ACTIF").length;
  const suspendedCount = sellers.length - activeCount;
  const verifiedCount = sellers.filter((u) => u.isVerified).length;

  const totalProperties = sellers.reduce(
    (sum, s) => sum + mockProperties.filter((p) => p.sellerId === s.id).length,
    0
  );

  const toggleStatus = async (id: string) => {
    const target = sellers.find((u) => u.id === id);
    if (!target) return;
    const nextStatus = target.status === "ACTIF" ? "SUSPENDU" : "ACTIF";
    setBusy(true);
    try {
      const updated = await updateUser(id, { status: nextStatus });
      setSellers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: updated.status } : u))
      );
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Impossible de changer le statut."
      );
    } finally {
      setBusy(false);
    }
  };

  const openCreate = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      companyName: "",
      status: "ACTIF",
      isVerified: false,
    });
    setActionError(null);
    setCreating(true);
  };

  const openEdit = (u: SellerUser) => {
    setForm({
      name: u.name,
      email: u.email,
      phone: u.phone,
      companyName: u.companyName ?? "",
      status: u.status,
      isVerified: u.isVerified,
    });
    setActionError(null);
    setEditing(u);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const created = await createUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: UserRole.SELLER,
        isVerified: form.isVerified,
        status: form.status,
        companyName: form.companyName || undefined,
      });
      setSellers((prev) => [...prev, created]);
      setCreating(false);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Impossible de créer le vendeur."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    try {
      const updated = await updateUser(editing.id, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        isVerified: form.isVerified,
        status: form.status,
        companyName: form.companyName || undefined,
      });
      setSellers((prev) =>
        prev.map((u) => (u.id === editing.id ? { ...u, ...updated } : u))
      );
      setEditing(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Impossible d'enregistrer."
      );
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteUser(deleting.id);
      setSellers((prev) => prev.filter((u) => u.id !== deleting.id));
      setDeleting(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Impossible de supprimer."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Vendeurs"
        subtitle="Contrôlez les comptes vendeurs et leurs annonces."
        action={
          <Button className="rounded-full" onClick={openCreate}>
            <Plus className="size-4" /> Ajouter un vendeur
          </Button>
        }
      />

      {actionError && (
        <div className="mb-5">
          <Alert variant="destructive">{actionError}</Alert>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card p-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Chargement des vendeurs…
        </div>
      ) : (
        <>
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sand text-gold-strong">
            <Building2 className="size-5" />
          </div>
          <p className="tnum mt-4 font-display text-2xl font-semibold">{sellers.length}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Vendeurs inscrits</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <Home className="size-5" />
          </div>
          <p className="tnum mt-4 font-display text-2xl font-semibold">{totalProperties}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Biens publiés</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <BadgeCheck className="size-5" />
          </div>
          <p className="tnum mt-4 font-display text-2xl font-semibold">{verifiedCount}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Vérifiés</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <ShieldAlert className="size-5" />
          </div>
          <p className="tnum mt-4 font-display text-2xl font-semibold">{suspendedCount}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Suspendus</p>
        </div>
      </div>

      <div className="mt-6 mb-6">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un vendeur par nom, email ou agence…"
          className="h-10 max-w-sm rounded-xl pl-4"
        />
      </div>

      {/* Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-4 font-medium">Vendeur</th>
              <th className="px-5 py-4 font-medium">Agence</th>
              <th className="px-5 py-4 font-medium">Biens</th>
              <th className="px-5 py-4 font-medium">Vérifié</th>
              <th className="px-5 py-4 font-medium">Inscription</th>
              <th className="px-5 py-4 font-medium">Statut</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const props = mockProperties.filter((p) => p.sellerId === u.id);
              return (
                <tr key={u.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarImage src={u.avatar || undefined} alt={u.name} />
                        <AvatarFallback className="bg-sand text-gold">{initials(u.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{u.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{u.companyName || "—"}</td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-gold">{props.length}</span>
                  </td>
                  <td className="px-5 py-4">
                    {u.isVerified ? (
                      <BadgeCheck className="size-5 text-emerald-500" />
                    ) : (
                      <span className="inline-block size-5 rounded-full border border-border bg-muted" title="Non vérifié" />
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">{formatDate(u.createdAt)}</td>
                  <td className="px-5 py-4">
                    <Badge
                      className={cn(
                        "shrink-0 border-transparent",
                        u.status === "ACTIF"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                      )}
                    >
                      {u.status === "ACTIF" ? "Actif" : "Suspendu"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setViewing(u)}>
                        <Eye className="size-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-full" onClick={() => openEdit(u)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        onClick={() => setDeleting(u)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={cn(
                          "rounded-full",
                          u.status === "ACTIF"
                            ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                            : "bg-emerald-600 text-white hover:bg-emerald-600/90"
                        )}
                        onClick={() => toggleStatus(u.id)}
                      >
                        {u.status === "ACTIF" ? "Suspendre" : "Activer"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 lg:hidden">
        {filtered.map((u) => {
          const props = mockProperties.filter((p) => p.sellerId === u.id);
          return (
            <div key={u.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={u.avatar || undefined} alt={u.name} />
                    <AvatarFallback className="bg-sand text-gold">{initials(u.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{u.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <Badge
                  className={cn(
                    "shrink-0 border-transparent",
                    u.status === "ACTIF"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                  )}
                >
                  {u.status === "ACTIF" ? "Actif" : "Suspendu"}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>{u.companyName || "Indépendant"}</span>
                <span className="font-medium text-gold">{props.length} bien{props.length > 1 ? "s" : ""}</span>
                <span className="flex items-center gap-1">
                  Vérifié {u.isVerified ? <BadgeCheck className="size-4 text-emerald-500" /> : <span className="inline-block size-3.5 rounded-full border border-border bg-muted" />}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-4">
                <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setViewing(u)}>
                  <Eye className="size-4" />
                </Button>
                <Button size="sm" variant="ghost" className="rounded-full" onClick={() => openEdit(u)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  onClick={() => setDeleting(u)}
                >
                  <Trash2 className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant={u.status === "ACTIF" ? "outline" : "default"}
                  className={cn(
                    "ml-auto rounded-full",
                    u.status === "ACTIF"
                      ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                      : "bg-emerald-600 text-white hover:bg-emerald-600/90"
                  )}
                  onClick={() => toggleStatus(u.id)}
                >
                  {u.status === "ACTIF" ? "Suspendre" : "Activer"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
          Aucun vendeur ne correspond à votre recherche.
        </div>
      )}
        </>
      )}

      {/* Create */}
      <Dialog open={creating} onOpenChange={(open) => !open && setCreating(false)}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle className="text-lg">Ajouter un vendeur</DialogTitle>
              <DialogDescription>Créez un nouveau compte vendeur.</DialogDescription>
            </DialogHeader>
            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="s-add-name">Nom complet</Label>
                <Input id="s-add-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="s-add-email">Email</Label>
                  <Input id="s-add-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-add-phone">Téléphone</Label>
                  <Input id="s-add-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-add-company">Nom de l&apos;agence</Label>
                <Input id="s-add-company" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isVerified}
                  onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
                  className="size-4 accent-[var(--color-gold)]"
                />
                Compte vérifié
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setCreating(false)}>Annuler</Button>
              <Button type="submit" disabled={busy} className="flex-1 rounded-full">
                {busy && <Loader2 className="mr-2 size-4 animate-spin" />} Créer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-lg">
          {editing && (
            <form onSubmit={handleEdit}>
              <DialogHeader>
                <DialogTitle className="text-lg">Modifier « {editing.name} »</DialogTitle>
              </DialogHeader>
              <div className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="s-edit-name">Nom complet</Label>
                  <Input id="s-edit-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s-edit-email">Email</Label>
                    <Input id="s-edit-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-edit-phone">Téléphone</Label>
                    <Input id="s-edit-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-edit-company">Nom de l&apos;agence</Label>
                  <Input id="s-edit-company" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isVerified}
                    onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
                    className="size-4 accent-[var(--color-gold)]"
                  />
                  Compte vérifié
                </label>
              </div>
              <div className="mt-6 flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Annuler</Button>
                <Button type="submit" disabled={busy} className="flex-1 rounded-full">
                  {busy && <Loader2 className="mr-2 size-4 animate-spin" />} Enregistrer
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View */}
      <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-md">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">Vendeur · {viewing.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3 rounded-xl bg-sand/50 p-3.5">
                  <span className="text-muted-foreground">Agence</span>
                  <span className="text-right font-medium">{viewing.companyName || "Indépendant"}</span>
                </div>
                <div className="flex justify-between gap-3 rounded-xl bg-sand/50 p-3.5">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-right font-medium">{viewing.email}</span>
                </div>
                <div className="flex justify-between gap-3 rounded-xl bg-sand/50 p-3.5">
                  <span className="text-muted-foreground">Téléphone</span>
                  <span className="text-right font-medium">{viewing.phone || "—"}</span>
                </div>
                <div className="flex justify-between gap-3 rounded-xl bg-sand/50 p-3.5">
                  <span className="text-muted-foreground">Biens publiés</span>
                  <span className="text-right font-semibold text-gold">
                    {mockProperties.filter((p) => p.sellerId === viewing.id).length}
                  </span>
                </div>
                <div className="flex justify-between gap-3 rounded-xl bg-sand/50 p-3.5">
                  <span className="text-muted-foreground">Inscription</span>
                  <span className="text-right font-medium">{formatDate(viewing.createdAt)}</span>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button type="button" variant="outline" className="flex-1 rounded-full"
                  onClick={() => { setViewing(null); openEdit(viewing); }}>
                  <Pencil className="mr-2 size-4" /> Modifier
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "flex-1 rounded-full",
                    viewing.status === "ACTIF"
                      ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                      : "bg-emerald-600 text-white hover:bg-emerald-600/90"
                  )}
                  onClick={() => {
                    toggleStatus(viewing.id);
                    setViewing({ ...viewing, status: viewing.status === "ACTIF" ? "SUSPENDU" : "ACTIF" });
                  }}
                >
                  {viewing.status === "ACTIF" ? "Suspendre" : "Activer"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="max-w-sm">
          {deleting && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">Supprimer le vendeur ?</DialogTitle>
                <DialogDescription>
                  « {deleting.name} » et ses annonces seront définitivement supprimés.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" className="flex-1 rounded-full" onClick={() => setDeleting(null)}>Annuler</Button>
                <Button type="button" variant="destructive" disabled={busy} className="flex-1 rounded-full" onClick={confirmDelete}>
                  {busy && <Loader2 className="mr-2 size-4 animate-spin" />} Supprimer
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
