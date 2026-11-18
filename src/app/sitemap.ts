import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { fetchSitemapEntries } from "@/features/seo-pages/api";

// /sitemap.xml — static routes, published poojas/festivals/blogs/products/CMS
// pages and every published, indexable, self-canonical SEO landing page.
// Well under the 50,000-URL limit, so a single sitemap (no index) is enough.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = (await fetchSitemapEntries()) ?? [{ path: "/", changeFrequency: "daily" as const, priority: 1 }];
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  return entries.map((entry) => ({
    url: `${siteUrl}${entry.path === "/" ? "" : entry.path}`,
    lastModified: "lastModified" in entry && entry.lastModified ? new Date(entry.lastModified) : undefined,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
