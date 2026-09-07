import type { Metadata } from "next";
import { PropertiesView } from "@/components/sections/properties-view";

export const metadata: Metadata = {
  title: "Rechercher un bien immobilier au Maroc",
  description:
    "Recherchez des appartements, villas, terrains et locaux commerciaux au Maroc. Filtrez par ville, budget, surface et équipements.",
};

export default async function PropertiesPage({
  searchParams,
}: PageProps<"/properties">) {
  const raw = await searchParams;
  const params: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(raw)) {
    params[key] = Array.isArray(value) ? value[0] : value;
  }
  return <PropertiesView searchParams={params} />;
}