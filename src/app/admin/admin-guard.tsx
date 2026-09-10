"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRole } from "@/types";

const MAIN_ADMIN_EMAIL = "arrimaniusothmane@gmail.com";

export function isMainAdminUser(role: UserRole | undefined, email: string | undefined) {
  return role === UserRole.ADMIN && email?.trim().toLowerCase() === MAIN_ADMIN_EMAIL;
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const authorized = isMainAdminUser(user?.role, user?.email);

  useEffect(() => {
    if (!loading && !authorized) router.replace("/login");
  }, [loading, authorized, router]);

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
          <ShieldAlert className="size-7" />
        </span>
        <div>
          <h1 className="font-display text-xl font-semibold">Accès réservé</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cette section est réservée à l&apos;administrateur de la plateforme.
          </p>
        </div>
        <Button render={<Link href="/" />}>
          Retour à l&apos;accueil
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}