import { SERVER_API_URL } from "@/lib/server-env";

// Server-side fetchers for the location-SEO system. Revalidated every few
// minutes so admin edits go live without a redeploy.
const REVALIDATE_SECONDS = 300;

export interface SeoLink {
  name: string;
  path: string;
}

export interface SeoPagePublic {
  _id: string;
  pageType: "location" | "office_location" | "service";
  slug: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro?: string;
  content?: string;
  bannerImage?: string;
  images: string[];
  heroTagline?: string;
  faqs: { question: string; answer: string }[];
  coverageNote?: string;
  canonicalUrl?: string;
  indexable: boolean;
  updatedAt?: string;
  location: { name: string; type: string; slug: string } | null;
  city: { name: string; slug: string } | null;
  breadcrumbs: { name: string; path?: string }[];
  services: {
    label: string;
    note?: string;
    url: string;
    pooja: {
      name: string;
      slug: string;
      startingPrice?: number;
      marketPrice?: number;
      image?: string;
      shortDescription?: string;
    } | null;
  }[];
  coverageGroups: { type: string; label: string; items: { name: string; areaLabel?: string; path: string | null }[] }[];
  nearby: SeoLink[];
  relatedServices: SeoLink[];
  internalLinks: { label: string; url: string }[];
  cityPage: SeoLink | null;
  officeCityPage: SeoLink | null;
  reviews: { customerName: string; rating: number; comment: string; createdAt: string; pooja?: string }[];
}

export interface SeoDirectory {
  cities: { key: string; title: string; main: SeoLink | null; sections: { key: string; label: string; links: SeoLink[] }[] }[];
  office: SeoLink[];
  services: SeoLink[];
}

export interface FooterGroup {
  key: string;
  kind?: "links" | "poojas" | "blogs" | "text";
  title: string;
  body?: string;
  links: { label: string; url: string }[];
}

async function getJson<T>(path: string, revalidate = REVALIDATE_SECONDS): Promise<T | null> {
  try {
    const res = await fetch(`${SERVER_API_URL}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

export function fetchSeoPage(slug: string) {
  // Only plausible slugs reach the API (avoids a lookup for e.g. /favicon.png).
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return Promise.resolve(null);
  return getJson<SeoPagePublic>(`/seo-pages/by-slug/${slug}`);
}

export function fetchSeoDirectory() {
  return getJson<SeoDirectory>("/seo-pages/directory");
}

export function fetchFooterGroups() {
  return getJson<FooterGroup[]>("/seo-pages/footer");
}

export function fetchSitemapEntries() {
  return getJson<{ path: string; lastModified?: string; changeFrequency: "daily" | "weekly" | "monthly"; priority: number }[]>(
    "/seo-pages/sitemap",
    3600,
  );
}

export interface PublicContactSettings {
  contactPhone?: string;
  contactWhatsapp?: string;
  contactEmail?: string;
  officeAddress?: string;
  socialLinks?: { facebook?: string; instagram?: string; youtube?: string; twitter?: string; linkedin?: string };
}

export function fetchContactSettings() {
  return getJson<PublicContactSettings>("/settings");
}
