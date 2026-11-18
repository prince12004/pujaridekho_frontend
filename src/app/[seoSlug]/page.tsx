import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/shared/json-ld";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/lib/env";
import { siteConfig } from "@/lib/constants";
import { fetchContactSettings, fetchSeoPage, fetchSeoSettings } from "@/features/seo-pages/api";
import { SeoLandingPage } from "@/features/seo-pages/components/seo-landing-page";

// Location / office / service landing pages managed in Admin → SEO
// Management, served at the site root (e.g. /pandit-in-noida). Static
// routes (/about, /blog …) always take precedence over this dynamic segment;
// anything that isn't a published SEO page is a 404.
export const revalidate = 300;

type Params = { params: Promise<{ seoSlug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { seoSlug } = await params;
  const page = await fetchSeoPage(seoSlug);
  if (!page) return {};
  const metadata = buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/${page.slug}`,
    image: page.bannerImage,
    canonical: page.canonicalUrl,
    noindex: !page.indexable,
  });
  // Titles that already carry the brand skip the layout's "| PujariDekho" suffix.
  return /pujaridekho/i.test(page.metaTitle) ? { ...metadata, title: { absolute: page.metaTitle } } : metadata;
}

export default async function SeoSlugPage({ params }: Params) {
  const { seoSlug } = await params;
  const [page, settings, seoSettings] = await Promise.all([fetchSeoPage(seoSlug), fetchContactSettings(), fetchSeoSettings()]);
  if (!page) notFound();

  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const whatsapp = settings?.contactWhatsapp || siteConfig.contact.whatsapp;
  const crumbItems = [
    { name: "Home", path: "/" },
    ...page.breadcrumbs.map((b, i) => ({
      name: b.name,
      path: i === page.breadcrumbs.length - 1 ? `/${page.slug}` : (b.path ?? `/${page.slug}`),
    })),
  ];
  const areaServed = page.location?.name ?? page.city?.name;

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbItems, siteUrl)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: page.h1,
          serviceType: page.pageType === "location" ? "Hindu puja and pandit booking" : page.name,
          description: page.metaDescription,
          url: `${siteUrl}/${page.slug}`,
          provider: {
            "@type": "Organization",
            name: "PujariDekho",
            url: siteUrl,
            telephone: settings?.contactPhone || siteConfig.contact.phone,
          },
          ...(areaServed
            ? { areaServed: { "@type": page.location?.type === "city" || !page.location ? "City" : "Place", name: areaServed } }
            : { areaServed: ["Noida", "Greater Noida", "Ghaziabad", "Delhi", "Gurugram"].map((name) => ({ "@type": "City", name })) }),
        }}
      />
      {page.faqs.length > 0 ? <JsonLd data={faqSchema(page.faqs)} /> : null}
      <SeoLandingPage page={page} whatsappNumber={whatsapp} settings={seoSettings.landing} />
    </>
  );
}
