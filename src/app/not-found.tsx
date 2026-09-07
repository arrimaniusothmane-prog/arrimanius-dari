import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-serif text-8xl font-bold text-gold sm:text-9xl">
        404
      </p>
      <h1 className="mt-6 font-display text-2xl font-semibold sm:text-3xl">
        Cette page a déménagé…
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
        Pas de panique — nous allons vous remettre sur les rails.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button size="lg" className="rounded-full bg-gold text-white hover:bg-gold/90">
            Retour à l&apos;accueil
          </Button>
        </Link>
        <Link href="/properties">
          <Button size="lg" variant="outline" className="rounded-full">
            Voir les biens
          </Button>
        </Link>
      </div>
    </div>
  );
}
