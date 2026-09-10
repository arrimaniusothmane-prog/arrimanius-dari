import Link from "next/link";
import { Building2, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 py-24 sm:px-6">
      <div className="w-full rounded-3xl border border-border/60 bg-card p-8 text-center shadow-sm sm:p-10">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-gold/15 text-gold-strong">
          <Lock className="size-7" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-semibold sm:text-3xl">
          Les inscriptions sont fermées
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          La création de comptes n&apos;est actuellement pas disponible. Si vous
          êtes l&apos;administrateur de la plateforme, connectez-vous pour
          accéder à votre espace.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/login" className="w-full">
            <Button className="w-full rounded-full py-6">
              Accéder à mon compte
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full rounded-full py-6">
              <ArrowLeft className="mr-2 size-4" />
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Building2 className="size-4 text-gold" />
          Dar<span className="text-gold">Estate</span> ·{" "}
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-gold" />
            Accès contrôlé
          </span>
        </div>
      </div>
    </div>
  );
}