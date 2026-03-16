import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://portfolio.unityfianar.site";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/backoffice/",
          "/fr/backoffice/",
          "/en/backoffice/",
          "/login/",
          "/fr/login/",
          "/en/login/",
          "/maintenance/",
          "/fr/maintenance/",
          "/en/maintenance/",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

