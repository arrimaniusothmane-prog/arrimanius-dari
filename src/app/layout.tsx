import type { Metadata } from "next";
import { Inter, Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DarEstate — Le marché immobilier premium au Maroc",
    template: "%s | DarEstate",
  },
  description:
    "Découvrez des appartements, villas et terrains sélectionnés au Maroc. Un marché immobilier premium avec biens vérifiés, propriétaires vérifiés et transactions accompagnées.",
  keywords: [
    "immobilier maroc",
    "achat maison maroc",
    "villa casablanca",
    "appartement rabat",
    "terrain marrakech",
    "DarEstate",
    "immobilier premium maroc",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "DarEstate",
    title: "DarEstate — Le marché immobilier premium au Maroc",
    description:
      "Découvrez des appartements, villas et terrains sélectionnés au Maroc.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${inter.variable} ${manrope.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileNav />
        </AppProviders>
      </body>
    </html>
  );
}
