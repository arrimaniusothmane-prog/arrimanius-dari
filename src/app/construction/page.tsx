import Image from "next/image";
import Link from "next/link";
import {
  HardHat,
  Hammer,
  LayoutTemplate,
  CircleCheck,
  ArrowRight,
  ArrowUpRight,
  Quote,
  Compass,
  PenTool,
  Timer,
  ClipboardCheck,
  Gem,
  Handshake,
  ShieldCheck,
  Target,
  TrendingUp,
  KeyRound,
  Home,
  Briefcase,
  CircleDollarSign,
  MapPin,
  Ruler,
  Phone,
  Mail,
  Star,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DevisForm } from "@/components/forms/devis-form";
import { RealizationsGallery } from "@/components/sections/realizations-gallery";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Construction, Rénovation & Agencement au Maroc",
  description:
    "Construction de villas, rénovation d'appartements et agencement intérieur : une équipe unique pour votre projet, de la conception à la livraison. Devis gratuit.",
  alternates: {
    canonical: "/construction",
    languages: { fr: "/construction", en: "/construction", ar: "/construction" },
  },
};

const projectKinds = [
  "Villas",
  "Maisons",
  "Appartements",
  "Immeubles",
  "Bureaux",
  "Commerces",
  "Restaurants",
  "Locaux professionnels",
  "Espaces sur mesure",
];

// Statistiques d'illustration — à remplacer par vos chiffres réels.
const stats = [
  { value: "+120", label: "Projets accompagnés" },
  { value: "12", label: "Corps de métier intégrés" },
  { value: "100%", label: "Chantiers suivis de A à Z" },
  { value: "48h", label: "Délai de réponse devis" },
];

// Données facilement remplaçables : formez ici les vrais projets de votre entreprise.
const activities = [
  {
    id: "CONSTRUCTION",
    number: "01",
    icon: HardHat,
    title: "Construction",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop",
    description:
      "Nous réalisons des projets de construction neuve et de gros œuvre pour les particuliers et les professionnels.",
    prestations: [
      "Construction de villas",
      "Construction de maisons",
      "Construction d'immeubles",
      "Extension de bâtiments",
      "Surélévation",
      "Terrassement",
      "Fondations",
      "Assainissement",
      "Maçonnerie",
      "Béton armé",
      "Structures",
      "Gros œuvre",
      "Finitions",
    ],
  },
  {
    id: "RENOVATION",
    number: "02",
    icon: Hammer,
    title: "Rénovation",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
    description:
      "Nous transformons les espaces existants afin de leur donner une nouvelle vie, tout en améliorant leur confort, leur fonctionnalité et leur esthétique.",
    prestations: [
      "Rénovation complète",
      "Rénovation d'appartement",
      "Rénovation de villa",
      "Rénovation de bureaux",
      "Rénovation de commerces",
      "Modification des espaces",
      "Démolition",
      "Maçonnerie",
      "Cloisons",
      "Faux plafonds",
      "Électricité",
      "Plomberie",
      "Peinture",
      "Sols",
      "Menuiserie",
      "Finitions",
    ],
  },
  {
    id: "AGENCEMENT",
    number: "03",
    icon: LayoutTemplate,
    title: "Agencement",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=800&fit=crop",
    description:
      "Nous concevons et réalisons des espaces intérieurs adaptés à l'identité et aux besoins de chaque client.",
    prestations: [
      "Agencement intérieur",
      "Architecture intérieure",
      "Cuisine",
      "Dressing",
      "Salon",
      "Salle de bain",
      "Bureau",
      "Boutique",
      "Restaurant",
      "Hôtel",
      "Espace professionnel",
      "Mobilier sur mesure",
      "Menuiserie",
      "Décoration",
      "Éclairage",
    ],
  },
];

// Notre savoir-faire — remplacez images et descriptions par vos spécialités réelles.
const expertise = [
  {
    title: "Gros œuvre",
    description: "Fondations, structures et construction du bâti.",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
  },
  {
    title: "Second œuvre",
    description: "Agencement intérieur et finitions des volumes.",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
  },
  {
    title: "Maçonnerie",
    description: "Murs, cloisons et ouvrages en béton armé.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop",
  },
  {
    title: "Électricité",
    description: "Réseau électrique, mise aux normes et éclairage.",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
  },
  {
    title: "Plomberie",
    description: "Alimentation, évacuation et installation sanitaire.",
    image:
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop",
  },
  {
    title: "Menuiserie",
    description: "Portes, fenêtres, parquets et ouvrages sur mesure.",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=400&fit=crop",
  },
  {
    title: "Cuisine",
    description: "Conception et installation de cuisines équipées.",
    image:
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=600&h=400&fit=crop",
  },
  {
    title: "Salle de bain",
    description: "Espaces d'eau design, durables et fonctionnels.",
    image:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop",
  },
  {
    title: "Peinture",
    description: "Peintures décoratives et finitions murales.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop",
  },
  {
    title: "Revêtements",
    description: "Sols, carrelages, faïences et parements.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
  },
  {
    title: "Décoration",
    description: "Mise en scène des espaces et choix des matières.",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
  },
  {
    title: "Agencement",
    description: "Aménagements intérieurs fonctionnels et esthétiques.",
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop",
  },
  {
    title: "Pergola",
    description: "Ouvrages extérieurs en bois, aluminium ou sur mesure.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  },
  {
    title: "Terrasse",
    description: "Sols extérieurs, dallages et espaces de vie dehors.",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&h=400&fit=crop",
  },
  {
    title: "Piscine",
    description: "Construction et rénovation de bassins sur mesure.",
    image:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&h=400&fit=crop",
  },
  {
    title: "Aménagement extérieur",
    description: "Paysagement, clôtures et valorisation des espaces.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
  },
];

const steps = [
  {
    number: "01",
    icon: Quote,
    title: "Écoute",
    description:
      "Nous échangeons avec le client pour comprendre son besoin, ses envies et ses contraintes.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=560&fit=crop",
  },
  {
    number: "02",
    icon: Compass,
    title: "Étude",
    description:
      "Nous analysons le projet, les espaces, les contraintes techniques et le budget.",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=560&fit=crop",
  },
  {
    number: "03",
    icon: PenTool,
    title: "Conception",
    description:
      "Nous définissons les solutions, matériaux, finitions et choix d'aménagement.",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=560&fit=crop",
  },
  {
    number: "04",
    icon: Timer,
    title: "Planification",
    description:
      "Nous organisons les différentes étapes du chantier et les interventions nécessaires.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=560&fit=crop",
  },
  {
    number: "05",
    icon: HardHat,
    title: "Réalisation",
    description:
      "Les travaux sont réalisés et suivis pas à pas sur le chantier.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=560&fit=crop",
  },
  {
    number: "06",
    icon: ClipboardCheck,
    title: "Livraison",
    description:
      "Nous effectuons les dernières vérifications et finalisons le projet.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=560&fit=crop",
  },
];

const reasons = [
  {
    icon: Gem,
    title: "Qualité",
    description:
      "Nous accordons une attention particulière aux matériaux et aux finitions.",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=560&fit=crop",
  },
  {
    icon: Handshake,
    title: "Accompagnement",
    description:
      "Nous accompagnons le client tout au long du projet, du devis à la livraison.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=560&fit=crop",
  },
  {
    icon: ShieldCheck,
    title: "Transparence",
    description:
      "Communication claire concernant les travaux et les coûts, sans surprise.",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=560&fit=crop",
  },
  {
    icon: Target,
    title: "Sur mesure",
    description:
      "Chaque projet est adapté aux besoins et aux contraintes du client.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=560&fit=crop",
  },
  {
    icon: TrendingUp,
    title: "Suivi",
    description:
      "Le chantier est suivi durant les différentes phases de réalisation.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=560&fit=crop",
  },
  {
    icon: KeyRound,
    title: "Clé en main",
    description:
      "Un point d'interlocuteur unique qui centralise toutes les interventions.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=560&fit=crop",
  },
];

const clientTypes = [
  {
    icon: Home,
    title: "Particuliers",
    description: "Villas, maisons, appartements et résidences.",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=560&fit=crop",
  },
  {
    icon: Briefcase,
    title: "Professionnels",
    description: "Bureaux, commerces, restaurants, hôtels et locaux.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=560&fit=crop",
  },
  {
    icon: CircleDollarSign,
    title: "Investisseurs",
    description: "Projets immobiliers, rénovation et valorisation de biens.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=560&fit=crop",
  },
];

function SectionHeading({
  eyebrow,
  title,
  lead,
  center = true,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={cn(center && "mx-auto text-center")}>
      <span className="text-sm font-semibold uppercase tracking-widest text-gold">
        {eyebrow}
      </span>
      <h2
        className={cn(
          "mt-3 font-display text-3xl font-semibold sm:text-4xl",
          dark && "text-white"
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            dark ? "text-white/70" : "text-muted-foreground",
            center && "mx-auto max-w-2xl"
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

export default function ConstructionPage() {
  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[78vh] items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=2000&h=1300&fit=crop"
          alt="Chantier de construction DarEstate"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/35" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <HardHat className="size-4 text-gold" /> Construction · Rénovation
              · Agencement
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-white sm:text-6xl">
              Votre projet,{" "}
              <span className="font-serif italic text-gold">de A à Z</span>,
              clé en main.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">
              Nous accompagnons particuliers et professionnels dans la
              réalisation de leurs projets de construction, rénovation et
              agencement — de la conception à la livraison.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#devis">
                <Button
                  size="lg"
                  className="rounded-full bg-gold text-white hover:bg-gold/90"
                >
                  Demander un devis <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="#realisations">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Découvrir nos réalisations
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-md"
              >
                <p className="tnum font-display text-2xl font-semibold text-gold">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-white/75">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRÉSENTATION ============ */}
      <section id="presentation" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-gold">
                Qui nous sommes
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                Une équipe de confiance pour réaliser vos projets
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Nous accompagnons particuliers et professionnels dans la
                réalisation de leurs projets, de la conception à la livraison.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Notre objectif : un accompagnement complet, avec une attention
                particulière portée à la qualité des matériaux, aux finitions,
                au respect des engagements et au suivi du chantier.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                  <Sparkles className="size-7" />
                </div>
                <p className="text-sm font-medium">
                  Un interlocuteur unique,
                  <br />
                  <span className="text-muted-foreground">
                    du devis jusqu&apos;à la remise des clés.
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-7 shadow-sm sm:p-8">
              <h3 className="font-display text-lg font-semibold">
                Nous intervenons sur tous types de projets
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {projectKinds.map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1.5 rounded-full bg-sand px-4 py-2 text-sm font-medium text-foreground"
                  >
                    <CircleCheck className="size-4 text-gold" /> {k}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm text-white/85">
                <MapPin className="size-4 shrink-0 text-gold" />
                Intervenants sur tout le territoire marocain.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ NOS 3 ACTIVITÉS ============ */}
      <section id="activites" className="bg-sand/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Nos domaines d'activité"
            title="Construction, rénovation, agencement"
            lead="Trois expertises complémentaires pour mener votre projet de la conception à la livraison, avec une seule équipe."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {activities.map((a) => {
              const Icon = a.icon;
              return (
                <article
                  key={a.id}
                  id={a.id.toLowerCase()}
                  className="group flex scroll-mt-24 flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-xl bg-white/15 font-display text-sm font-bold text-white backdrop-blur-md">
                      {a.number}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
                        <Icon className="size-6" />
                      </div>
                      <h3 className="font-display text-xl font-semibold">
                        {a.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {a.description}
                    </p>
                    <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {a.prestations.map((p) => (
                        <li
                          key={p}
                          className="flex items-center gap-2 text-sm text-foreground/90"
                        >
                          <CircleCheck className="size-4 shrink-0 text-gold" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 border-t border-border/60 pt-5">
                      <Link
                        href={`?type=${a.id}#devis`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-strong"
                      >
                        Découvrir la {a.title.toLowerCase()}
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ NOTRE EXPERTISE ============ */}
      <section id="expertise" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Notre savoir-faire"
            title="Notre expertise"
            lead="Les métiers que nous maîtrisons et coordonnons sur votre chantier : une équipe complète, sans intermédiaires."
          />

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {expertise.map((e) => (
              <div
                key={e.title}
                className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={e.image}
                    alt={e.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-semibold">
                    {e.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {e.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NOTRE MÉTHODE ============ */}
      <section id="methode" className="bg-ink py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Notre méthode"
            title="Un accompagnement de A à Z"
            lead="Six étapes claires, une équipe dédiée et un suivi rigoureux du premier rendez-vous jusqu'à la livraison."
            dark
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.number}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-gold/40 hover:bg-white/10"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                    <span className="absolute left-4 top-4 font-display text-3xl font-semibold text-white/90">
                      {s.number}
                    </span>
                    <div className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-xl bg-gold/20 text-gold backdrop-blur-md">
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-semibold">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      {s.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ POURQUOI NOUS CHOISIR ============ */}
      <section id="pourquoi" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Pourquoi nous choisir"
            title="Une seule équipe pour votre projet"
            lead="Dans la qualité, l'accompagnement et la transparence : tout est pensé pour simplifier votre projet."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.title}
                  className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 flex size-11 items-center justify-center rounded-xl bg-gold text-white shadow-lg transition-colors">
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-semibold">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {r.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Types de clients */}
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {clientTypes.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="group overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-3 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-2xl bg-gold text-white shadow-lg">
                      <Icon className="size-7" />
                    </div>
                  </div>
                  <div className="p-7 text-center">
                    <h3 className="font-display text-xl font-semibold">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {c.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ NOS RÉALISATIONS ============ */}
      <section id="realisations" className="bg-sand/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Portfolio"
            title="Découvrez nos réalisations"
            lead="Construction, rénovation, agencement : une sélection de projets organisés par catégorie."
          />
          <div className="mt-12">
            <RealizationsGallery />
          </div>
        </div>
      </section>

      {/* ============ AVIS CLIENTS ============ */}
      <section id="avis" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Témoignages"
            title="La satisfaction de nos clients est notre priorité"
            lead="Leurs mots valent mieux que tout discours. Les avis de nos clients seront publiés ici dès leur réception."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex min-h-56 flex-col justify-between rounded-3xl border-2 border-dashed border-border bg-card/60 p-7 text-center"
              >
                <div>
                  <div className="flex justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className="size-4 text-border"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <Quote className="mx-auto mt-5 size-7 text-border" />
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Votre avis sera affiché ici — nom, type de projet, ville,
                    note et commentaire.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="mt-6 text-sm font-semibold text-gold transition-colors hover:text-gold-strong"
                >
                  Partager votre expérience
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RÉFÉRENCES / PARTENAIRES ============ */}
      <section id="references" className="bg-ink py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Références"
            title="Ils nous font confiance"
            lead="Clients, entreprises, architectes, fournisseurs : les logos de nos partenaires et références seront affichés ici."
            dark
          />

          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-white/10 bg-white/5"
              >
                <span className="text-xs font-medium uppercase tracking-widest text-white/35">
                  Logo client
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DEMANDE DE DEVIS ============ */}
      <section id="devis" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div className="lg:sticky lg:top-24">
              <span className="text-sm font-semibold uppercase tracking-widest text-gold">
                Devis gratuit
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                Un projet de construction, rénovation ou agencement ?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Parlons de votre projet. Réponse sous 48h, devis gratuit et
                sans engagement.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="#devis-form">
                  <Button
                    size="lg"
                    className="rounded-full bg-gold text-white hover:bg-gold/90"
                  >
                    Demander un devis <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="rounded-full">
                    Nous contacter
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-card p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Appelez-nous
                      </p>
                      <p className="text-sm font-semibold">+212 5 22 00 00 00</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Écrivez-nous</p>
                      <p className="text-sm font-semibold">contact@darestimate.ma</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2 rounded-xl bg-sand/60 px-4 py-3 text-sm text-muted-foreground">
                <Ruler className="mt-0.5 size-4 shrink-0 text-gold" />
                Décrivez votre projet simplement : type de bien, surface,
                budget et le tour est joué. Notre équipe s&apos;occupe du reste.
              </div>
            </div>

            <div
              id="devis-form"
              className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8"
            >
              <div className="mb-6">
                <h3 className="font-display text-xl font-semibold">
                  Demande de devis
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tous les champs marqués d&apos;une * sont obligatoires.
                </p>
              </div>
              <DevisForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}