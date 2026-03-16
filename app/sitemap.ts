import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://portfolio.unityfianar.site";

  const lastModified = new Date();

  // Public routes only (exclude backoffice/login/maintenance)
  const routes = ["/", "/fr", "/en"];

  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.9,
  }));
}

