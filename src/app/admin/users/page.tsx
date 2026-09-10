"use client";

import { useEffect, useState } from "react";
import {
  Search,
  BadgeCheck,
  ShieldAlert,
  UserRoundCog,
  Users,
  UserRound,
  Building2,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Link2,
  Loader2,
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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

type AdminUser = User & { status: "ACTIF" | "SUSPENDU" };

const roleLabel: Record<UserRole, string> = {
  [UserRole.BUYER]: "Acheteur",
  [UserRole.SELLER]: "Vendeur",
  [UserRole.AGENT]: "Agent",
  [UserRole.ADMIN]: "Administrateur",
};

const roleBadgeClass: Record<UserRole, string> = {
  [UserRole.BUYER]: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  [UserRole.SELLER]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  [UserRole.AGENT]: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  [UserRole.ADMIN]: "bg-gold/20 text-gold",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function propertyCount(userId: string) {
  return mockProperties.filter((p) => p.sellerId === userId).length;
}

type RoleFilter = "ALL" | UserRole;

const roleFilters: { value: RoleFilter; label: string; icon: typeof Users }[] = [
  { value: "ALL", label: "Tous", icon: Users },
  { value: UserRole.BUYER, label: "Acheteurs", icon: UserRound },
  { value: UserRole.SELLER, label: "Vendeurs", icon: Building2 },
  { value: UserRole.AGENT, label: "Agents", icon: ShieldCheck },
];

type UserForm = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  companyName: string;
  status: "ACTIF" | "SUSPENDU";
  isVerified: boolean;
};

const emptyForm: UserForm = {
  name: "",
  email: "",
  phone: "",
  role: UserRole.BUYER,
  companyName: "",
  status: "ACTIF",
  isVerified: false,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [viewing, setViewing] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<UserForm>(emptyForm);

  useEffect(() => {
    listUsers()
      .then((list) =>
        setUsers(
          list
            .filter((u) => !hiddenUserIds.includes(u.id))
            .map((u) => ({ ...u, status: u.status }))
        )
      )
      .catch((err) =>
        setActionError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les utilisateurs."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.trim().toLowerCase();
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    if (!matchesRole) return false;
    if (!q) return true;
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const active = users.filter((u) => u.status === "ACTIF").length;
  const suspended = users.length - active;
  const sellers = users.filter((u) => u.role === UserRole.SELLER).length;
  const buyers = users.filter((u) => u.role === UserRole.BUYER).length;
  const agents = users.filter((u) => u.role === UserRole.AGENT).length;
  const unverified = users.filter((u) => !u.isVerified).length;

  const toggleStatus = async (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const nextStatus = target.status === "ACTIF" ? "SUSPENDU" : "ACTIF";
    setBusy(true);
    try {
      const updated = await updateUser(id, { status: nextStatus });
      setUsers((prev) =>
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
    setForm(emptyForm);
    setActionError(null);
    setCreating(true);
  };

  const openEdit = (u: AdminUser) => {
    setForm({
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
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
        role: form.role,
        isVerified: form.isVerified,
        status: form.status,
        companyName: form.companyName || undefined,
      });
      setUsers((prev) => [...prev, created]);
      setCreating(false);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Impossible de créer l'utilisateur."
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
        role: form.role,
        isVerified: form.isVerified,
        status: form.status,
        companyName: form.companyName || undefined,
      });
      setUsers((prev) =>
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
      setUsers((prev) => prev.filter((u) => u.id !== deleting.id));
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
        title="Utilisateurs"
        subtitle="Gérez les comptes de la plateforme DarEstate."
        action={
          <Button className="rounded-full" onClick={openCreate}>
            <Plus className="size-4" /> Ajouter un utilisateur
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
          <Loader2 className="size-4 animate-spin" /> Chargement des comptes…
        </div>
      ) : (
        <>
      {/* Summary chips */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Total</span>
          <span className="font-display text-base font-semibold">{users.length}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <UserRound className="size-4 text-blue-600" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Acheteurs</span>
          <span className="font-display text-base font-semibold">{buyers}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <Building2 className="size-4 text-emerald-600" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Vendeurs</span>
          <span className="font-display text-base font-semibold">{sellers}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <ShieldCheck className="size-4 text-violet-600" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Agents</span>
          <span className="font-display text-base font-semibold">{agents}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <UserRoundCog className="size-4 text-emerald-600" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Actifs</span>
          <span className="font-display text-base font-semibold">{active}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <ShieldAlert className="size-4 text-red-500" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Suspendus</span>
          <span className="font-display text-base font-semibold">{suspended}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm shadow-sm">
          <BadgeCheck className="size-4 text-amber-500" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Non vérifiés</span>
          <span className="font-display text-base font-semibold">{unverified}</span>
        </div>
      </div>

      {/* Role filter tabs */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {roleFilters.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setRoleFilter(f.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                roleFilter === f.value
                  ? "border-gold bg-gold/15 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-gold/40"
              )}
            >
              <Icon className="size-4" />
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs font-semibold",
                  roleFilter === f.value ? "bg-gold/20 text-gold-strong" : "bg-muted"
                )}
              >
                {f.value === "ALL"
                  ? users.length
                  : users.filter((u) => u.role === f.value).length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email…"
            className="h-10 rounded-xl pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-4 font-medium">Utilisateur</th>
              <th className="px-5 py-4 font-medium">Rôle</th>
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
                <td className="px-5 py-4">
                  <Badge className={cn("shrink-0 border-transparent", roleBadgeClass[u.role])}>
                    {roleLabel[u.role]}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  <p className="whitespace-nowrap">{u.phone || "—"}</p>
                  {propertyCount(u.id) > 0 && (
                    <p className="text-xs text-gold">{propertyCount(u.id)} bien{propertyCount(u.id) > 1 ? "s" : ""}</p>
                  )}
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
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full"
                      onClick={() => setViewing(u)}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full"
                      onClick={() => openEdit(u)}
                    >
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
              <button
                type="button"
                onClick={() => setViewing(u)}
                className="flex items-center gap-3 text-left"
              >
                <Avatar className="size-10">
                  <AvatarImage src={u.avatar || undefined} alt={u.name} />
                  <AvatarFallback className="bg-sand text-gold">{initials(u.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{u.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                </div>
              </button>
              <Badge className={cn("shrink-0 border-transparent", roleBadgeClass[u.role])}>
                {roleLabel[u.role]}
              </Badge>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span>{u.phone || "—"}</span>
              <span className="flex items-center gap-1">
                Vérifié {u.isVerified ? <BadgeCheck className="size-4 text-emerald-500" /> : <span className="inline-block size-3.5 rounded-full border border-border bg-muted" />}
              </span>
              <span>Inscrit le {formatDate(u.createdAt)}</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
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
              <div className="ml-auto flex items-center gap-1.5">
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
                  className={
                    u.status === "ACTIF"
                      ? "rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                      : "rounded-full bg-emerald-600 text-white hover:bg-emerald-600/90"
                  }
                  onClick={() => toggleStatus(u.id)}
                >
                  {u.status === "ACTIF" ? "Suspendre" : "Activer"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
          Aucun utilisateur ne correspond à votre recherche.
        </div>
      )}
        </>
      )}

      {/* Create dialog */}
      <Dialog open={creating} onOpenChange={(open) => !open && setCreating(false)}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle className="text-lg">Ajouter un utilisateur</DialogTitle>
              <DialogDescription>
                Créez un nouveau compte sur la plateforme.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Nom complet</Label>
                <Input
                  id="add-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nom et prénom"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="add-email">Email</Label>
                  <Input
                    id="add-email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="vous@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-phone">Téléphone</Label>
                  <Input
                    id="add-phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+212 6 XX XX XX XX"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Rôle</Label>
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: (v as UserRole) ?? UserRole.BUYER })}>
                    <SelectTrigger className="w-full" aria-label="Rôle">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.BUYER}>Acheteur</SelectItem>
                      <SelectItem value={UserRole.SELLER}>Vendeur</SelectItem>
                      <SelectItem value={UserRole.AGENT}>Agent</SelectItem>
                      <SelectItem value={UserRole.ADMIN}>Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: (v as "ACTIF" | "SUSPENDU") ?? "ACTIF" })}>
                    <SelectTrigger className="w-full" aria-label="Statut">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIF">Actif</SelectItem>
                      <SelectItem value="SUSPENDU">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {form.role === UserRole.SELLER || form.role === UserRole.AGENT ? (
                <div className="space-y-2">
                  <Label htmlFor="add-company">Nom de l&apos;agence</Label>
                  <Input
                    id="add-company"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    placeholder="Ex : Agence Atlas"
                  />
                </div>
              ) : null}
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
              <Button type="button" variant="ghost" onClick={() => setCreating(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={busy} className="flex-1 rounded-full">
                {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
                Créer l&apos;utilisateur
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-lg">
          {editing && (
            <form onSubmit={handleEdit}>
              <DialogHeader>
                <DialogTitle className="text-lg">Modifier « {editing.name} »</DialogTitle>
                <DialogDescription>
                  Mettez à jour les informations du compte.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nom complet</Label>
                  <Input
                    id="edit-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Téléphone</Label>
                    <Input
                      id="edit-phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Rôle</Label>
                    <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: (v as UserRole) ?? form.role })}>
                      <SelectTrigger className="w-full" aria-label="Rôle">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.BUYER}>Acheteur</SelectItem>
                        <SelectItem value={UserRole.SELLER}>Vendeur</SelectItem>
                        <SelectItem value={UserRole.AGENT}>Agent</SelectItem>
                        <SelectItem value={UserRole.ADMIN}>Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: (v as "ACTIF" | "SUSPENDU") ?? form.status })}>
                      <SelectTrigger className="w-full" aria-label="Statut">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIF">Actif</SelectItem>
                        <SelectItem value="SUSPENDU">Suspendu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {form.role === UserRole.SELLER || form.role === UserRole.AGENT ? (
                  <div className="space-y-2">
                    <Label htmlFor="edit-company">Nom de l&apos;agence</Label>
                    <Input
                      id="edit-company"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    />
                  </div>
                ) : null}
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
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={busy} className="flex-1 rounded-full">
                  {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Enregistrer
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View dialog */}
      <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-md">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">Détail de l&apos;utilisateur</DialogTitle>
              </DialogHeader>
              <div className="mt-2 flex flex-col items-center text-center">
                <Avatar className="size-20">
                  <AvatarImage src={viewing.avatar || undefined} alt={viewing.name} />
                  <AvatarFallback className="bg-sand font-display text-2xl font-semibold text-gold-strong">
                    {initials(viewing.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 font-display text-lg font-semibold">{viewing.name}</h3>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  <Badge className={cn("shrink-0 border-transparent", roleBadgeClass[viewing.role])}>
                    {roleLabel[viewing.role]}
                  </Badge>
                  <Badge
                    className={cn(
                      "shrink-0 border-transparent",
                      viewing.status === "ACTIF"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                    )}
                  >
                    {viewing.status === "ACTIF" ? "Actif" : "Suspendu"}
                  </Badge>
                  {viewing.isVerified && (
                    <Badge className="shrink-0 border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      <BadgeCheck className="size-3.5" /> Vérifié
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between gap-3 rounded-xl bg-sand/50 p-3.5">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-right font-medium">{viewing.email}</span>
                </div>
                <div className="flex justify-between gap-3 rounded-xl bg-sand/50 p-3.5">
                  <span className="text-muted-foreground">Téléphone</span>
                  <span className="text-right font-medium">{viewing.phone || "—"}</span>
                </div>
                {viewing.companyName && (
                  <div className="flex justify-between gap-3 rounded-xl bg-sand/50 p-3.5">
                    <span className="text-muted-foreground">Agence</span>
                    <span className="text-right font-medium">{viewing.companyName}</span>
                  </div>
                )}
                <div className="flex justify-between gap-3 rounded-xl bg-sand/50 p-3.5">
                  <span className="text-muted-foreground">Inscription</span>
                  <span className="text-right font-medium">{formatDate(viewing.createdAt)}</span>
                </div>
                <div className="flex justify-between gap-3 rounded-xl bg-sand/50 p-3.5">
                  <span className="text-muted-foreground">ID</span>
                  <span className="text-right font-mono text-xs">{viewing.id}</span>
                </div>
              </div>

              {propertyCount(viewing.id) > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 p-3.5 text-sm">
                  <Link2 className="size-4 text-gold-strong" />
                  <span>
                    <strong className="font-semibold">{propertyCount(viewing.id)}</strong> bien
                    {propertyCount(viewing.id) > 1 ? "s" : ""} lié{propertyCount(viewing.id) > 1 ? "s" : ""} à ce compte
                  </span>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-full"
                  onClick={() => {
                    setViewing(null);
                    openEdit(viewing);
                  }}
                >
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

      {/* Delete confirmation */}
      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="max-w-sm">
          {deleting && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">Supprimer l&apos;utilisateur ?</DialogTitle>
                <DialogDescription>
                  Cette action est irréversible. « {deleting.name} » et ses données
                  associées seront définitivement supprimés.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" className="flex-1 rounded-full" onClick={() => setDeleting(null)}>
                  Annuler
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={busy}
                  className="flex-1 rounded-full"
                  onClick={confirmDelete}
                >
                  {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Supprimer
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
