import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://portfolio.unityfianar.site";

  const lastModified = new Date();
  const langs = ["fr", "en"];

  const sections = ["about", "skills", "education", "projects", "gallery", "experience", "contact"];

  const entries: MetadataRoute.Sitemap = [
    // Root redirect
    { url: `${siteUrl}/`, lastModified, changeFrequency: "weekly", priority: 1.0 },
  ];

  for (const lang of langs) {
    // Home
    entries.push({
      url: `${siteUrl}/${lang}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    });

    // Section pages
    for (const section of sections) {
      entries.push({
        url: `${siteUrl}/${lang}/${section}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}

