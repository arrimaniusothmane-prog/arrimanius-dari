import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DarEstate — Le marché immobilier premium au Maroc",
    short_name: "DarEstate",
    description:
      "Découvrez des appartements, villas et terrains sélectionnés au Maroc.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#131e26",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}