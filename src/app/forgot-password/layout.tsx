import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mot de passe oublié",
  description:
    "Réinitialisez votre mot de passe DarEstate pour retrouver l'accès à votre compte.",
  path: "/forgot-password",
  index: false,
});

export default function ForgotPasswordLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}