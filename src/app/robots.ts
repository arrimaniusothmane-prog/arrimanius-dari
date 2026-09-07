import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/buyer", "/seller", "/account"],
    },
    sitemap: "https://darestimate.ma/sitemap.xml",
  };
}