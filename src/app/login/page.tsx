"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

const demoAccounts = [
  { label: "Acheteur", email: "youssef@example.com", role: "BUYER" },
  { label: "Vendeur", email: "mohamed@example.com", role: "SELLER" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const user = result.user;
    const isMainAdmin =
      user.role === "ADMIN" &&
      user.email.trim().toLowerCase() === "arrimaniusothmane@gmail.com";
    if (isMainAdmin) router.push("/admin");
    else if (user.role === "SELLER" || user.role === "AGENT")
      router.push("/seller");
    else router.push("/buyer");
  };

  const quickLogin = async (demoEmail: string) => {
    setError(null);
    setLoading(true);
    const result = await login(demoEmail, "demo1234");
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const user = result.user;
    const isMainAdmin =
      user.role === "ADMIN" &&
      user.email.trim().toLowerCase() === "arrimaniusothmane@gmail.com";
    if (isMainAdmin) router.push("/admin");
    else if (user.role === "SELLER" || user.role === "AGENT")
      router.push("/seller");
    else router.push("/buyer");
  };

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
          Retrouvez le compte qui gère votre projet immobilier.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Accédez à vos favoris, vos demandes de visite, vos offres et pilotez
          vos transactions en toute simplicité.
        </p>
        <div className="mt-8 flex items-center gap-2 rounded-xl bg-sand px-4 py-3 text-sm">
          <ShieldCheck className="size-4 text-gold" />
          Connexion sécurisée · Données protégées
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full max-w-md">
        <div className="mb-8 text-center lg:hidden">
          <span className="font-display text-2xl font-semibold">
            Dar<span className="text-gold">Estate</span>
          </span>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-sm">
          <h2 className="font-display text-2xl font-semibold">Connexion</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ravi de vous revoir. Entrez vos identifiants.
          </p>

          {error && (
            <Alert variant="destructive" className="mt-5">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="vous@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-gold hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full py-6"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Se connecter
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-medium text-gold hover:underline">
              Créer un compte
            </Link>
          </div>
        </div>

        {/* Demo accounts */}
        <div className="mt-6 rounded-3xl border border-dashed border-border bg-sand/50 p-5">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Comptes de démonstration
          </p>
          <div className="mt-3 grid gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => quickLogin(acc.email)}
                disabled={loading}
                className="flex items-center justify-between rounded-full border border-border bg-card px-4 py-2.5 text-sm transition-colors hover:border-gold/60 disabled:opacity-50"
              >
                <span className="font-medium">{acc.role}</span>
                <span className="text-muted-foreground">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}