import { FavoritesContent } from "./favorites-content";

export const metadata = {
  title: "Mes favoris",
  description:
    "Retrouvez les biens immobiliers que vous avez enregistrés sur DarEstate et explorez nos biens populaires.",
  alternates: {
    canonical: "/favorites",
    languages: { fr: "/favorites", en: "/favorites", ar: "/favorites" },
  },
};

export default function FavoritesPage() {
  return <FavoritesContent />;
}