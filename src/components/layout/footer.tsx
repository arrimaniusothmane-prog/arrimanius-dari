import Link from "next/link";
import { Building2, Share2, Globe, MessageCircle, Phone, Mail } from "lucide-react";

const sections = [
  {
    title: "DarEstate",
    links: [
      { href: "/about", label: "À propos" },
      { href: "/invest", label: "Investir" },
      { href: "/buy", label: "Acheter" },
      { href: "/sell", label: "Vendre" },
    ],
  },
  {
    title: "Immobilier",
    links: [
      { href: "/properties?category=APARTMENT", label: "Appartements" },
      { href: "/properties?category=VILLA", label: "Villas" },
      { href: "/properties?category=LAND", label: "Terrains" },
      { href: "/properties?category=COMMERCIAL", label: "Commercial" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/help", label: "Centre d'aide" },
      { href: "/publish", label: "Publier un bien" },
      { href: "/agent", label: "Espace Professionnel" },
    ],
  },
];

const socials = [
  { icon: Share2, label: "Partager", href: "#" },
  { icon: Globe, label: "Site", href: "#" },
  { icon: MessageCircle, label: "Messagerie", href: "#" },
  { icon: Mail, label: "Email", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-16 sm:px-6 md:pb-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-white/10">
                <Building2 className="size-5 text-gold" />
              </span>
              <span className="font-display text-xl font-semibold">
                Dar<span className="text-gold">Estate</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              La plateforme immobilière premium au Maroc. Des biens vérifiés,
              des propriétaires certifiés et un accompagnement complet pour vos
              projets d&apos;achat, de vente et d&apos;investissement.
            </p>
            <div className="mt-6 space-y-2 text-sm text-white/60">
              <p className="flex items-center gap-2">
                <Phone className="size-4 text-gold" /> +212 5 22 00 00 00
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-gold" /> contact@darestimate.ma
              </p>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
                {section.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} DarEstate. Tous droits réservés.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/legal/terms" className="text-xs text-white/50 transition-colors hover:text-white">
              Conditions générales
            </Link>
            <Link href="/legal/privacy" className="text-xs text-white/50 transition-colors hover:text-white">
              Politique de confidentialité
            </Link>
            <Link href="/legal/mentions" className="text-xs text-white/50 transition-colors hover:text-white">
              Mentions légales
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex size-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all hover:bg-gold hover:text-white"
                >
                  <Icon className="size-4" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
