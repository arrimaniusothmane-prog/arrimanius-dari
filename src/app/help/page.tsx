import { HelpContent } from "./help-content";

export const metadata = {
  title: "Centre d'aide",
  description:
    "Trouvez des réponses à vos questions sur DarEstate : achat, publication, vérification, visites, commission, offres et documents.",
  alternates: {
    canonical: "/help",
    languages: { fr: "/help", en: "/help", ar: "/help" },
  },
};

export default function HelpPage() {
  return <HelpContent />;
}