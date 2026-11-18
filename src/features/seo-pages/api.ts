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
  kind?: "links" | "tags" | "categories" | "poojas" | "blogs" | "text";
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

export interface TitledText {
  title: string;
  text: string;
}

export interface SeoSettings {
  landing: {
    bookButtonLabel: string;
    whatsappButtonLabel: string;
    whatsappMessage: string;
    servicesEyebrow: string;
    businessServicesEyebrow: string;
    servicesHeading: string;
    servicesHeadingNoPlace: string;
    coverageHeading: string;
    whyEyebrow: string;
    whyHeading: string;
    whyItems: TitledText[];
    stepsEyebrow: string;
    stepsHeading: string;
    steps: TitledText[];
    reviewsEyebrow: string;
    reviewsHeading: string;
    faqEyebrow: string;
    faqHeading: string;
    faqHeadingNoPlace: string;
    relatedHeadingHome: string;
    relatedHeadingBusiness: string;
    nearbyHeading: string;
    citiesHeading: string;
    finalCtaEyebrow: string;
    finalCtaHeading: string;
    finalCtaHeadingNoPlace: string;
    finalCtaText: string;
  };
  directory: { title: string; description: string; officeGroupTitle: string; servicesGroupTitle: string; emptyText: string };
  footer: {
    blurb: string;
    bookButtonLabel: string;
    bookButtonUrl: string;
    newsletterTitle: string;
    newsletterText: string;
    trustBadges: string[];
    copyright: string;
    showAllLocationsLink: boolean;
  };
}

// Used only if the settings request fails, so pages never break. The real
// copy is edited in Admin → SEO Management → Page Content Settings.
export const FALLBACK_SEO_SETTINGS: SeoSettings = {
  landing: {
    bookButtonLabel: "Book Pandit Ji",
    whatsappButtonLabel: "Book on WhatsApp",
    whatsappMessage: "Namaste, I want to book a pandit in {place}.",
    servicesEyebrow: "Popular Pujas",
    businessServicesEyebrow: "Business Pujas",
    servicesHeading: "Pujas we perform in {place}",
    servicesHeadingNoPlace: "Pujas for this occasion",
    coverageHeading: "Areas we cover in {place}",
    whyEyebrow: "Why PujariDekho",
    whyHeading: "Why families book with us",
    whyItems: [
      { title: "Verified pandits", text: "Every pandit ji is verified before being assigned to a booking." },
      { title: "Price shown upfront", text: "You see the puja price before you pay — no surprises on the day." },
      { title: "Samagri optional", text: "Add the samagri while booking and it comes with the pandit ji." },
      { title: "WhatsApp support", text: "Questions about muhurat or vidhi? Message our team any time." },
    ],
    stepsEyebrow: "How It Works",
    stepsHeading: "Book in four simple steps",
    steps: [
      { title: "Choose your puja", text: "Pick the puja and package that suits the occasion." },
      { title: "Add address & date", text: "Enter where the puja will happen and your preferred date." },
      { title: "Confirm online", text: "Pay the ₹99 booking amount or the full amount to confirm." },
      { title: "Pandit ji arrives", text: "Your assigned pandit ji performs the puja at your place." },
    ],
    reviewsEyebrow: "Reviews",
    reviewsHeading: "What our customers say",
    faqEyebrow: "FAQs",
    faqHeading: "Questions about booking a pandit in {place}",
    faqHeadingNoPlace: "Frequently asked questions",
    relatedHeadingHome: "Office & business pujas",
    relatedHeadingBusiness: "Related puja services",
    nearbyHeading: "Nearby locations",
    citiesHeading: "Available in these cities",
    finalCtaEyebrow: "Book Now",
    finalCtaHeading: "Book your pandit in {place}",
    finalCtaHeadingNoPlace: "Book your pandit ji today",
    finalCtaText: "Choose your puja, pick a date and confirm online — or message our team on WhatsApp.",
  },
  directory: {
    title: "Explore Pandit Booking Locations in Delhi NCR",
    description:
      "Find and book experienced Pandit Ji for Hindu puja ceremonies across Noida, Greater Noida, Ghaziabad, Delhi and Gurugram. Explore our location-wise services covering residential sectors, popular societies and commercial areas.",
    officeGroupTitle: "Office Puja Locations",
    servicesGroupTitle: "Office & Business Puja Services",
    emptyText: "Location pages are being prepared. Please check back soon.",
  },
  footer: {
    blurb:
      "PujariDekho connects families and businesses across Noida, Greater Noida, Greater Noida West, Ghaziabad, Delhi and Gurugram with verified, experienced pandits for every ritual — with the price shown before you book.",
    bookButtonLabel: "Book Pandit Ji",
    bookButtonUrl: "/poojas",
    newsletterTitle: "Subscribe to Our Newsletter",
    newsletterText: "Vidhi guides, festival muhurat dates and special offers — straight to your inbox.",
    trustBadges: ["Verified & Experienced Pandits", "Secure & Encrypted Payments", "Trusted by Thousands of Families", "24/7 Customer Support"],
    copyright: "© {year} PujariDekho. All rights reserved.",
    showAllLocationsLink: true,
  },
};

export async function fetchSeoSettings(): Promise<SeoSettings> {
  return (await getJson<SeoSettings>("/seo-pages/settings")) ?? FALLBACK_SEO_SETTINGS;
}

/** Replaces {place} / {year} placeholders in admin-edited copy. */
export function fillPlaceholders(text: string, values: { place?: string }) {
  return text.replace(/\{place\}/g, values.place ?? "").replace(/\{year\}/g, String(new Date().getFullYear()));
}
