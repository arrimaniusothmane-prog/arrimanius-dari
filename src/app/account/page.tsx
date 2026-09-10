"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Home,
  Building2,
  ShieldCheck,
  ArrowRight,
  LogOut,
  Heart,
  FileText,
  Eye,
  Star,
  Lock,
  UserRoundCog,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

const accessCards = [
  {
    icon: Home,
    title: "Espace acheteur",
    description:
      "Gérez vos favoris, demandes, visites et offres sur les biens qui vous intéressent.",
    href: "/buyer",
  },
  {
    icon: Building2,
    title: "Espace vendeur",
    description:
      "Publiez vos biens, suivez vos leads et gérez vos transactions depuis votre tableau de bord.",
    href: "/seller",
  },
] as const;

const adminCard = {
  icon: ShieldCheck,
  title: "Espace admin",
  description:
    "Administration complète : utilisateurs, annonces, leads, transactions et paramètres de la plateforme.",
  href: "/admin",
};

const profileHrefByRole: Record<string, string> = {
  ADMIN: "/admin/profile",
  SELLER: "/seller/profile",
  AGENT: "/seller/profile",
  BUYER: "/buyer/profile",
};

const quickStats = [
  { icon: Heart, label: "Favoris", value: "4" },
  { icon: FileText, label: "Demandes", value: "6" },
  { icon: Eye, label: "Visites", value: "3" },
  { icon: Star, label: "Offres", value: "2" },
];

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const cards =
    user?.role === "ADMIN"
      ? [...accessCards, adminCard]
      : user?.role === "SELLER" || user?.role === "AGENT"
        ? [...accessCards]
        : user
          ? [accessCards[0]]
          : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-pretty font-display text-3xl font-semibold sm:text-4xl">
          {user ? `Bonjour, ${user.name.split(" ")[0]}.` : "Votre compte"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {user
            ? "Gérez vos espaces et vos informations depuis un seul endroit."
            : "Connectez-vous pour accéder à votre espace personnel sur mobile et desktop."}
        </p>
      </div>

      {!user ? (
        /* Guest state */
        <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
          <span className="flex size-16 items-center justify-center rounded-full bg-gold/15">
            <Lock className="size-8 text-gold-strong" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold">
              Accès réservé à l&apos;administrateur
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              La création de comptes est actuellement fermée. Connectez-vous
              avec le compte administrateur pour accéder au tableau de bord.
            </p>
          </div>
          <Link href="/login" className="w-full sm:w-auto">
            <Button className="w-full rounded-full px-8 py-6 sm:w-auto">
              Se connecter <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Greeting */}
          <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
            <div className="flex size-16 items-center justify-center rounded-full bg-gold/15">
              <User className="size-8 text-gold-strong" />
            </div>
            <div>
              <p className="font-display text-2xl font-semibold">{user.email}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Membre depuis{" "}
                {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Access cards */}
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.href} href={card.href} className="group">
                  <div className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-6 transition-colors duration-300 hover:border-gold/40 hover:shadow-md">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-sand text-gold-strong transition-colors group-hover:bg-gold group-hover:text-ink">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold">
                      {card.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {card.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-strong">
                      Accéder <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              );
            })}

            {/* Profile shortcut */}
            <Link
              href={profileHrefByRole[user.role] ?? "/buyer/profile"}
              className="group h-full"
            >
              <div className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-6 transition-colors duration-300 hover:border-gold/40 hover:shadow-md">
                <div className="flex size-12 items-center justify-center rounded-xl bg-sand text-gold-strong transition-colors group-hover:bg-gold group-hover:text-ink">
                  <UserRoundCog className="size-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  Mon profil
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  Gérez vos informations personnelles : nom, coordonnées et
                  préférences de notification.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-strong">
                  Ouvrir <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          </div>

          {/* Quick stats */}
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3"
                >
                  <Icon className="size-5 text-gold-strong" />
                  <div>
                    <p className="tnum font-display text-lg font-semibold">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Logout */}
          <div className="mx-auto mt-12 max-w-4xl text-center">
            <Button
              variant="destructive"
              className="rounded-full px-6"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 size-4" />
              Déconnexion
            </Button>
          </div>
        </>
      )}
    </div>
  );
}