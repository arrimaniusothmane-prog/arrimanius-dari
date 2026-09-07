"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { sendPasswordReset } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await sendPasswordReset(email);
    setLoading(false);
    setSent(true);
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
        {sent ? (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="size-8 text-green-500" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-semibold">
              Email envoyé
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Si un compte existe pour{" "}
              <span className="font-medium text-foreground">{email}</span>,
              vous recevrez un lien de réinitialisation dans quelques instants.
            </p>
            <Link href="/login" className="mt-6 w-full">
              <Button className="w-full rounded-full">Retour à la connexion</Button>
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
              Entrez l&apos;adresse email associée à votre compte. Nous vous
              enverrons un lien pour réinitialiser votre mot de passe.
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
                Envoyer le lien
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}