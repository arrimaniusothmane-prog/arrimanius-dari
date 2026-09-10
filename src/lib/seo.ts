import type { Metadata } from "next";

export const siteUrl = "https://www.darestimate.ma";

export const defaultDescription =
  "Découvrez des appartements, villas et terrains sélectionnés au Maroc. Un marché immobilier premium avec biens vérifiés, propriétaires vérifiés et accompagnement complet.";

export function pageMetadata({
  title,
  description = defaultDescription,
  path,
  index = true,
}: {
  title: string;
  description?: string;
  path?: string;
  index?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: path
      ? {
          canonical: path,
          languages: {
            fr: path,
            en: path,
            ar: path,
          },
        }
      : undefined,
    openGraph: {
      title,
      description,
      url: path ? `${siteUrl}${path}` : undefined,
    },
    robots: index ? undefined : { index: false, follow: false },
  };
}