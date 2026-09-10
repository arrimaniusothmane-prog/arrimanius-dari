"use client";

import { useState } from "react";
import {
  Save,
  Loader2,
  CheckCircle2,
  BadgeCheck,
  BellRing,
  Languages,
  Trash2,
  UserRound,
  Building2,
  MapPin,
  ShieldCheck,
  IdCard,
} from "lucide-react";
import { UserRole } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const roleLabels: Record<UserRole, string> = {
  [UserRole.BUYER]: "Acheteur",
  [UserRole.SELLER]: "Vendeur",
  [UserRole.AGENT]: "Agent",
  [UserRole.ADMIN]: "Administrateur",
};

const roleSubtitles: Record<UserRole, string> = {
  [UserRole.BUYER]:
    "Gérez vos informations personnelles et vos critères de recherche.",
  [UserRole.SELLER]:
    "Gérez vos informations personnelles, votre agence et vos préférences.",
  [UserRole.AGENT]:
    "Gérez vos informations professionnelles et vos préférences.",
  [UserRole.ADMIN]: "Gérez votre compte d'administrateur.",
};

type NotificationItem = { id: string; title: string; description: string };

const NOTIFICATIONS: Record<UserRole, NotificationItem[]> = {
  [UserRole.BUYER]: [
    {
      id: "email",
      title: "Notifications par email",
      description: "Recevez vos alertes et mises à jour par email.",
    },
    {
      id: "new-properties",
      title: "Nouveaux biens correspondants",
      description: "Soyez averti dès qu'un bien correspond à vos critères.",
    },
    {
      id: "offers",
      title: "Avancement des offres",
      description: "Suivez les réponses du vendeur à vos offres.",
    },
    {
      id: "visits",
      title: "Rappels de visites",
      description: "Recevez un rappel avant chaque visite programmée.",
    },
  ],
  [UserRole.SELLER]: [
    {
      id: "leads",
      title: "Nouveaux leads",
      description: "Soyez notifié dès qu'un acheteur vous contacte.",
    },
    {
      id: "offers",
      title: "Offres et contre-offres",
      description: "Alertes sur chaque offre reçue pour vos biens.",
    },
    {
      id: "visits",
      title: "Demandes de visite",
      description: "Recevez les nouvelles demandes de visite.",
    },
    {
      id: "weekly",
      title: "Résumé hebdomadaire",
      description: "Un récapitulatif de vos performances chaque semaine.",
    },
  ],
  [UserRole.AGENT]: [
    {
      id: "leads",
      title: "Nouveaux leads",
      description: "Soyez notifié dès qu'un acheteur vous contacte.",
    },
    {
      id: "offers",
      title: "Offres et contre-offres",
      description: "Alertes sur chaque offre reçue pour vos biens.",
    },
    {
      id: "visits",
      title: "Demandes de visite",
      description: "Recevez les nouvelles demandes de visite.",
    },
    {
      id: "weekly",
      title: "Résumé hebdomadaire",
      description: "Un récapitulatif de vos performances chaque semaine.",
    },
  ],
  [UserRole.ADMIN]: [
    {
      id: "security",
      title: "Alertes de sécurité",
      description: "Connexions inhabituelles et tentatives d'accès.",
    },
    {
      id: "moderation",
      title: "Rapports de modération",
      description: "Annonces signalées et comptes en attente de validation.",
    },
    {
      id: "weekly",
      title: "Synthèse hebdomadaire",
      description: "Indicateurs clés de la plateforme chaque semaine.",
    },
  ],
};

const DEFAULT_ON: Record<string, boolean> = {
  email: true,
  "new-properties": true,
  visits: true,
  leads: true,
  offers: true,
  security: true,
  moderation: true,
  weekly: false,
};

export function ProfileSettings() {
  const { user, updateProfile } = useAuth();

  const role: UserRole = user?.role ?? UserRole.BUYER;
  const isProfessional =
    role === UserRole.SELLER || role === UserRole.AGENT;

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [company, setCompany] = useState(user?.companyName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [license, setLicense] = useState(user?.licenseNumber ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [syncedFor, setSyncedFor] = useState<string | null>(null);

  if (user && syncedFor !== user.id) {
    setSyncedFor(user.id);
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setPhone(user.phone ?? "");
    setCompany(user.companyName ?? "");
    setBio(user.bio ?? "");
    setLocation(user.location ?? "");
    setLicense(user.licenseNumber ?? "");
  }

  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      NOTIFICATIONS[role].map((n) => [n.id, DEFAULT_ON[n.id] ?? false])
    )
  );

  const currentNotifications = NOTIFICATIONS[role];

  const toggle = (id: string) =>
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const updated = await updateProfile({
      name,
      email,
      phone,
      ...(isProfessional ? { companyName: company, bio, location } : {}),
      ...(role === UserRole.AGENT && license ? { licenseNumber: license } : {}),
    });
    setSaving(false);
    if (updated) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleDelete = () => {
    const message =
      role === UserRole.ADMIN
        ? "Supprimer le compte administrateur est une action critique et irréversible. Continuer ?"
        : "Fermer votre compte ? Toutes vos annonces et données seront définitivement supprimées.";
    if (window.confirm(message)) {
      window.alert(
        "Votre demande de suppression a bien été prise en compte. Elle sera traitée sous 30 jours ouvrés."
      );
    }
  };

  const initials = (user?.name ?? "DE")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div>
      <DashboardHeader title="Profil" subtitle={roleSubtitles[role]} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,460px)_1fr]">
        {/* Identity */}
        <form onSubmit={handleSave} className="h-fit">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            {saved && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                <CheckCircle2 className="size-4" /> Profil mis à jour
              </div>
            )}

            <div className="flex flex-col items-center text-center">
              <Avatar className="size-20">
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt="Photo de profil" />
                ) : undefined}
                <AvatarFallback className="bg-sand font-display text-2xl font-semibold text-gold-strong">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 font-display text-lg font-semibold">{name}</h2>
              <p className="text-sm text-muted-foreground">{email}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                <Badge className="rounded-full border-transparent bg-sand text-gold-strong">
                  {roleLabels[role]}
                </Badge>
                {user?.isVerified && (
                  <span className="flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold-strong">
                    <BadgeCheck className="size-3.5" /> Vérifié
                  </span>
                )}
              </div>
              {isProfessional && company && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {company}
                  {location ? ` · ${location}` : ""}
                </p>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings-name">Nom complet</Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="settings-name"
                    className="pl-8"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-email">Email</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-phone">Téléphone</Label>
                <Input
                  id="settings-phone"
                  value={phone}
                  placeholder="+212 6 XX XX XX XX"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {isProfessional && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="settings-company">Nom de l&apos;agence</Label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="settings-company"
                        className="pl-8"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="settings-location">Ville</Label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="settings-location"
                        className="pl-8"
                        placeholder="Ex : Casablanca"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                  {role === UserRole.AGENT && (
                    <div className="space-y-2">
                      <Label htmlFor="settings-license">
                        N° de carte professionnelle
                      </Label>
                      <div className="relative">
                        <IdCard className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="settings-license"
                          className="pl-8"
                          placeholder="Ex : 01-2345-2025"
                          value={license}
                          onChange={(e) => setLicense(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="settings-bio">Présentation</Label>
                    <Textarea
                      id="settings-bio"
                      rows={3}
                      placeholder="Décrivez votre activité, votre expérience, vos spécialités…"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={saving || !user}
                className="w-full rounded-full bg-gold text-ink hover:bg-gold/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Enregistrement…
                  </>
                ) : (
                  <>
                    <Save className="size-4" /> Enregistrer
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Settings */}
        <div className="space-y-6">
          {/* Verified card */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sand text-gold-strong">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">
                  Vérification du compte
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Statut de votre identité sur la plateforme.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-sand/60 p-4">
              <div>
                <p className="text-sm font-medium">
                  {user?.isVerified ? "Identité vérifiée" : "Vérification en attente"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {user?.isVerified
                    ? "Votre identité a été confirmée."
                    : "Complétez votre dossier pour obtenir le badge vérifié."}
                </p>
              </div>
              <Badge
                className={cn(
                  "rounded-full border-transparent",
                  user?.isVerified
                    ? "bg-emerald-500/15 text-emerald-600"
                    : "bg-amber-500/15 text-amber-600"
                )}
              >
                {user?.isVerified ? "Vérifié" : "En cours"}
              </Badge>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sand text-gold-strong">
                <BellRing className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">Notifications</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Choisissez les notifications que vous souhaitez recevoir.
                </p>
              </div>
            </div>

            <div className="mt-4 divide-y divide-border/60">
              {currentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <div>
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {notif.description}
                    </p>
                  </div>
                  <Switch
                    checked={toggles[notif.id]}
                    onCheckedChange={() => toggle(notif.id)}
                    className="data-checked:bg-gold"
                    aria-label={notif.title}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sand text-gold-strong">
                <Languages className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">Préférences</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Langue et préférences régionales.
                </p>
              </div>
            </div>

            <div className="mt-4 max-w-52">
              <Label htmlFor="settings-language" className="text-sm">
                Langue d&apos;affichage
              </Label>
              <Select value={language} onValueChange={(value) => setLanguage(value ?? "fr")}>
                <SelectTrigger
                  id="settings-language"
                  className="mt-2"
                  aria-label="Langue"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border border-red-500/20 bg-card p-6 shadow-sm">
            <h3 className="font-display text-lg font-semibold text-red-600 dark:text-red-400">
              Zone sensible
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {role === UserRole.ADMIN
                ? "La suppression de ce compte est définitive et irréversible."
                : "La suppression du compte est définitive et irréversible."}
            </p>
            <Button
              variant="destructive"
              className={cn("mt-4 rounded-full")}
              onClick={handleDelete}
            >
              <Trash2 className="size-4" />
              {role === UserRole.ADMIN
                ? "Supprimer ce compte"
                : "Supprimer mon compte"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
