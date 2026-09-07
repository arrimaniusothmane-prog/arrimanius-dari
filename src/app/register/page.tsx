"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff, Loader2, ShieldCheck, UserRound, HeartHandshake } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    const user = await register(form.name, form.email, form.password, role);
    setLoading(false);
    if (user.role === UserRole.SELLER || user.role === UserRole.AGENT) {
      router.push("/seller");
    } else {
      router.push("/buyer");
    }
  };

  const roles = [
    {
      value: UserRole.BUYER,
      label: "Je cherche un bien",
      icon: HeartHandshake,
    },
    {
      value: UserRole.SELLER,
      label: "Je vends un bien",
      icon: UserRound,
    },
  ];

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
      {/* Left brand panel */}
      <div className="mb-10 hidden max-w-md lg:block">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary">
            <Building2 className="size-6 text-gold" />
          </span>
          <span className="font-display text-3xl font-semibold">
            Dar<span className="text-gold">Estate</span>
          </span>
        </div>
        <h1 className="mt-8 font-display text-4xl font-semibold leading-tight">
          Rejoignez la marketplace immobilière de confiance au Maroc.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Créez votre compte en quelques secondes pour acheter, vendre ou
          investir en toute sérénité.
        </p>
        <ul className="mt-8 space-y-3">
          {[
            "Biens et propriétaires vérifiés",
            "Visites organisées et accompagnées",
            "Aucun frais caché",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm">
              <ShieldCheck className="size-4 text-gold" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Right form */}
      <div className="w-full max-w-md">
        <div className="mb-8 text-center lg:hidden">
          <span className="font-display text-2xl font-semibold">
            Dar<span className="text-gold">Estate</span>
          </span>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-sm">
          <h2 className="font-display text-2xl font-semibold">Créer un compte</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Une minute suffit. Aucune carte bancaire requise.
          </p>

          {/* Role selector */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3.5 text-sm font-medium transition-all",
                    role === r.value
                      ? "border-gold bg-gold/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-gold/40"
                  )}
                >
                  <Icon className={cn("size-5", role === r.value && "text-gold")} />
                  {r.label}
                </button>
              );
            })}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-5">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                required
                placeholder="Votre nom"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="vous@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="6 caractères minimum"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmer le mot de passe</Label>
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Répétez le mot de passe"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full py-6"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Créer mon compte
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            Déjà inscrit ?{" "}
            <Link href="/login" className="font-medium text-gold hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}