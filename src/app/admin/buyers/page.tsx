"use client";

import { useEffect, useState } from "react";
import {
  UserRound,
  BadgeCheck,
  ShieldAlert,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  FileCheck,
  CalendarCheck2,
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
import { hiddenUserIds } from "@/data/properties";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/userService";
import { UserRole } from "@/types";
import type { User } from "@/types";
import { formatDate, cn } from "@/lib/utils";

type BuyerUser = User & { status: "ACTIF" | "SUSPENDU" };

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<BuyerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<BuyerUser | null>(null);
  const [viewing, setViewing] = useState<BuyerUser | null>(null);
  const [deleting, setDeleting] = useState<BuyerUser | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "ACTIF" as "ACTIF" | "SUSPENDU",
    isVerified: false,
  });

  useEffect(() => {
    listUsers(UserRole.BUYER)
      .then((list) =>
        setBuyers(
          list
            .filter((u) => !hiddenUserIds.includes(u.id))
            .map((u) => ({ ...u, status: u.status }))
        )
      )
      .catch((err) =>
        setActionError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les acheteurs."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = buyers.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const activeCount = buyers.filter((u) => u.status === "ACTIF").length;
  const suspendedCount = buyers.length - activeCount;
  const verifiedCount = buyers.filter((u) => u.isVerified).length;

  const toggleStatus = async (id: string) => {
    const target = buyers.find((u) => u.id === id);
    if (!target) return;
    const nextStatus = target.status === "ACTIF" ? "SUSPENDU" : "ACTIF";
    setBusy(true);
    try {
      const updated = await updateUser(id, { status: nextStatus });
      setBuyers((prev) =>
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
    setForm({ name: "", email: "", phone: "", status: "ACTIF", isVerified: false });
    setActionError(null);
    setCreating(true);
  };

  const openEdit = (u: BuyerUser) => {
    setForm({
      name: u.name,
      email: u.email,
      phone: u.phone,
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
        role: UserRole.BUYER,
        isVerified: form.isVerified,
        status: form.status,
      });
      setBuyers((prev) => [...prev, created]);
      setCreating(false);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Impossible de créer l'acheteur."
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
      });
      setBuyers((prev) =>
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
      setBuyers((prev) => prev.filter((u) => u.id !== deleting.id));
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
        title="Acheteurs"
        subtitle="Contrôlez les comptes acheteurs de la plateforme."
        action={
          <Button className="rounded-full" onClick={openCreate}>
            <Plus className="size-4" /> Ajouter un acheteur
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
          <Loader2 className="size-4 animate-spin" /> Chargement des acheteurs…
        </div>
      ) : (
        <>
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sand text-gold-strong">
            <UserRound className="size-5" />
          </div>
          <p className="tnum mt-4 font-display text-2xl font-semibold">{buyers.length}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Acheteurs inscrits</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
            <FileCheck className="size-5" />
          </div>
          <p className="tnum mt-4 font-display text-2xl font-semibold">{verifiedCount}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Vérifiés</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
            <CalendarCheck2 className="size-5" />
          </div>
          <p className="tnum mt-4 font-display text-2xl font-semibold">{activeCount}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Actifs</p>
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
          placeholder="Rechercher un acheteur par nom ou email…"
          className="h-10 max-w-sm rounded-xl pl-4"
        />
      </div>

      {/* Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-4 font-medium">Acheteur</th>
              <th className="px-5 py-4 font-medium">Contact</th>
              <th className="px-5 py-4 font-medium">Vérifié</th>
              <th className="px-5 py-4 font-medium">Inscription</th>
              <th className="px-5 py-4 font-medium">Statut</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
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
                <td className="px-5 py-4 text-muted-foreground">{u.phone || "—"}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 lg:hidden">
        {filtered.map((u) => (
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
              <span>{u.phone || "—"}</span>
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
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
          Aucun acheteur ne correspond à votre recherche.
        </div>
      )}
        </>
      )}

      {/* Create */}
      <Dialog open={creating} onOpenChange={(open) => !open && setCreating(false)}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle className="text-lg">Ajouter un acheteur</DialogTitle>
              <DialogDescription>Créez un nouveau compte acheteur.</DialogDescription>
            </DialogHeader>
            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="b-add-name">Nom complet</Label>
                <Input id="b-add-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="b-add-email">Email</Label>
                  <Input id="b-add-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b-add-phone">Téléphone</Label>
                  <Input id="b-add-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
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
                  <Label htmlFor="b-edit-name">Nom complet</Label>
                  <Input id="b-edit-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="b-edit-email">Email</Label>
                    <Input id="b-edit-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="b-edit-phone">Téléphone</Label>
                    <Input id="b-edit-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
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
                <DialogTitle className="text-lg">Acheteur · {viewing.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3 rounded-xl bg-sand/50 p-3.5">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-right font-medium">{viewing.email}</span>
                </div>
                <div className="flex justify-between gap-3 rounded-xl bg-sand/50 p-3.5">
                  <span className="text-muted-foreground">Téléphone</span>
                  <span className="text-right font-medium">{viewing.phone || "—"}</span>
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
                <DialogTitle className="text-lg">Supprimer l&apos;acheteur ?</DialogTitle>
                <DialogDescription>
                  « {deleting.name} » sera définitivement supprimé.
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
