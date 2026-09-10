import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contactez DarEstate",
  description:
    "Contactez l'équipe DarEstate pour toute question sur l'immobilier au Maroc : téléphone, email, adresse et formulaire de contact.",
  alternates: {
    canonical: "/contact",
    languages: { fr: "/contact", en: "/contact", ar: "/contact" },
  },
};

export default function ContactPage() {
  return <ContactForm />;
}