import type { MetadataRoute } from "next";
import { getProperties } from "@/services/propertyService";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://darestimate.ma";
  const properties = await getProperties();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/properties`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/buy`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/sell`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/invest`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/help`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/agent`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/publish`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/register`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${baseUrl}/login`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${baseUrl}/properties/${property.slug}`,
    lastModified: property.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...propertyRoutes];
}