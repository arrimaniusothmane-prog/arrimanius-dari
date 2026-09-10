import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mon compte",
  description:
    "Gérez votre profil DarEstate : informations personnelles, coordonnées et préférences.",
  path: "/account",
  index: false,
});

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}