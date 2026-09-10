import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Connexion",
  description:
    "Connectez-vous à votre espace DarEstate pour gérer vos favoris, demandes, biens et transactions.",
  path: "/login",
  index: false,
});

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}