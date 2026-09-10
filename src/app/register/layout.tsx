import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Créer un compte",
  description:
    "Créez votre compte DarEstate et accédez à votre espace personnel : favoris, demandes, publication et suivi de vos transactions.",
  path: "/register",
  index: false,
});

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}