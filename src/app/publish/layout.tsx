import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Publier un bien",
  description:
    "Publiez votre annonce immobilière sur DarEstate en quelques étapes : photos, prix, description et rendez-vous visible des milliers d'acquéreurs.",
  path: "/publish",
});

export default function PublishLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}