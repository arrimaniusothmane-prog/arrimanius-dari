"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Copy, Loader2, MailCheck } from "lucide-react";
import { sendPasswordReset } from "@/services/authService";
import type { ResetResult } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<ResetResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setCopied(false);
    setLoading(true);
    const res = await sendPasswordReset(email);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setResult(res);
  };

  const copyPassword = async () => {
    if (!result || !result.ok) return;
    await navigator.clipboard.writeText(result.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-24">
      <Link
        href="/login"
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Retour à la connexion
      </Link>

      <div className="mt-6 rounded-3xl border border-border/60 bg-card p-8 shadow-sm">
        {result && result.ok ? (
          <div className="flex flex-col items-center py-2 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="size-8 text-green-500" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-semibold">
              Compte retrouvé
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.name} —{" "}
              <span className="font-medium text-foreground">{result.email}</span>
            </p>
            <div className="mt-5 w-full rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Mot de passe (mode démo — pas d&apos;envoi d&apos;email)
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <code className="truncate rounded-lg bg-background px-3 py-2 font-mono text-lg font-semibold">
                  {result.password}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyPassword}
                  className="shrink-0 rounded-full"
                >
                  <Copy className="mr-1.5 size-4" />
                  {copied ? "Copié" : "Copier"}
                </Button>
              </div>
            </div>
            <Link href="/login" className="mt-6 w-full">
              <Button className="w-full rounded-full">Aller à la connexion</Button>
            </Link>
          </div>
        ) : (
          <>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-sand">
              <MailCheck className="size-7 text-gold" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-semibold">
              Mot de passe oublié
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Entrez l&apos;adresse email associée à votre compte pour
              retrouver vos informations de connexion.
            </p>

            {error && (
              <Alert variant="destructive" className="mt-4">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
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
              <Button
                type="submit"
                className="w-full rounded-full py-6"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Retrouver mon compte
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}