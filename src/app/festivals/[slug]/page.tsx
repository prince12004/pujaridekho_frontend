import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, ShieldCheck, Sparkles } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { Timeline } from "@/components/shared/timeline";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { ReviewsSection } from "@/components/shared/reviews-section";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { PoojaGallery } from "@/features/poojas/components/pooja-gallery";
import { PoojaPackages } from "@/features/poojas/components/pooja-packages";
import { SamagriSelector } from "@/features/poojas/components/samagri-selector";
import { CheckoutCta } from "@/features/poojas/components/checkout-cta";
import { PoojaBookingProvider } from "@/features/poojas/components/pooja-booking-context";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";

async function fetchFestival(slug: string) {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/festivals/${slug}`, { cache: "no-store" });
  if (!response.ok) return null;
  const json = await response.json();
  return json.data;
}

function resolveImage(src?: string) {
  if (!src) return images.bowlWoodenTable;
  return src in images ? images[src as keyof typeof images] : src;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const festival = await fetchFestival(slug);
  if (!festival) return {};

  return buildMetadata({
    title: `${festival.name} — Book Online`,
    description: festival.shortDescription || festival.fullDescription || "Book a festival pooja online with fixed pricing.",
    path: `/festivals/${festival.slug}`,
    image: resolveImage(festival.heroBanner || festival.featuredImage),
  });
}

export default async function FestivalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const festival = await fetchFestival(slug);
  if (!festival) notFound();

  const pageUrl = `${env.NEXT_PUBLIC_SITE_URL}/festivals/${festival.slug}`;
  const headingImage = resolveImage(festival.heroBanner || festival.featuredImage);
  const galleryItems = (Array.isArray(festival.gallery) ? festival.gallery : []).filter(
    (item: string) => resolveImage(item) !== headingImage,
  );

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [{ name: "Festival Pooja", path: "/festivals" }, { name: festival.name, path: `/festivals/${festival.slug}` }],
          env.NEXT_PUBLIC_SITE_URL,
        )}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: festival.name,
          provider: { "@type": "Organization", name: "PujariDekho" },
          areaServed: "Delhi NCR",
          offers: { "@type": "Offer", price: festival.startingPrice, priceCurrency: "INR", url: pageUrl },
        }}
      />
      {Array.isArray(festival.faq) && festival.faq.length > 0 ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: festival.faq.map((f: { question: string; answer: string }) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }}
        />
      ) : null}

      <Container className="pt-6">
        <Breadcrumb items={[{ label: "Festival Pooja", href: "/festivals" }, { label: festival.name }]} />
      </Container>

      <section className="py-8">
        <PoojaBookingProvider>
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="relative hidden h-[420px] overflow-hidden rounded-3xl lg:block">
              <img src={headingImage} alt={festival.name} className="h-full w-full object-cover" />
            </div>
            {galleryItems.length > 0 ? <PoojaGallery images={galleryItems} alt={festival.name} /> : null}

            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="font-ui text-xs font-bold uppercase tracking-wide text-primary">Festival Pooja</span>
                <h1 className="font-heading mt-1 text-3xl font-bold sm:text-4xl">{festival.name}</h1>
                <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-muted-foreground">
                  {festival.dateLabel && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={15} className="text-primary" /> {festival.dateLabel}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-primary" /> 100% Verified Pandits
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-2">
                  {festival.marketPrice ? (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{Number(festival.marketPrice).toLocaleString("en-IN")}
                    </span>
                  ) : null}
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">
                    {festival.marketPrice
                      ? Math.round(((Number(festival.marketPrice) - Number(festival.startingPrice)) / Number(festival.marketPrice)) * 100)
                      : 0}
                    % OFF
                  </span>
                </div>
                <div className="font-heading text-3xl text-secondary">₹{Number(festival.startingPrice).toLocaleString("en-IN")}</div>
                <div className="text-xs font-semibold text-muted-foreground">PujariDekho Price · Samagri not included</div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-10">
              <Reveal>
                <h2 className="font-heading mb-4 text-2xl">Samagri</h2>
                <SamagriSelector
                  basePrice={Number(festival.startingPrice)}
                  includedItems={(festival.samagri ?? []).map((item: { name: string; price: number }) => ({
                    itemName: item.name,
                    estimatedPrice: item.price,
                  }))}
                />
              </Reveal>

              {festival.packages?.length > 0 && (
                <Reveal>
                  <h2 className="font-heading mb-6 text-2xl">Packages &amp; Pricing</h2>
                  <PoojaPackages packages={festival.packages} />
                </Reveal>
              )}
            </div>

            <div id="book" className="mt-10 scroll-mt-24 lg:hidden">
              <CheckoutCta
                slug={festival.slug}
                name={festival.name}
                serviceType="festival"
                basePrice={Number(festival.startingPrice)}
              />
            </div>

            <div className="mt-10 flex flex-col gap-10">
              {(festival.fullDescription || festival.shortDescription) && (
                <Reveal>
                  <h2 className="font-heading mb-3 text-2xl">Overview</h2>
                  <p className="text-muted-foreground">{festival.fullDescription ?? festival.shortDescription}</p>
                </Reveal>
              )}

              {festival.benefits?.length > 0 && (
                <Reveal>
                  <h2 className="font-heading mb-4 text-2xl">Benefits</h2>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {festival.benefits.map((benefit: string) => (
                      <li key={benefit} className="flex gap-2.5 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                        <Sparkles size={16} className="mt-0.5 shrink-0 text-accent" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              {festival.importance && (
                <Reveal>
                  <h2 className="font-heading mb-3 text-2xl">Importance</h2>
                  <p className="text-muted-foreground">{festival.importance}</p>
                </Reveal>
              )}

              {festival.vidhiSteps?.length > 0 && (
                <Reveal>
                  <h2 className="font-heading mb-6 text-2xl">Pooja Vidhi</h2>
                  <Timeline
                    items={festival.vidhiSteps.map((step: { title: string; description: string }, i: number) => ({
                      label: `Step ${i + 1}`,
                      title: step.title,
                      description: step.description,
                    }))}
                  />
                </Reveal>
              )}

              {Array.isArray(festival.faq) && festival.faq.length > 0 ? (
                <Reveal>
                  <h2 className="font-heading mb-5 text-2xl">Frequently Asked Questions</h2>
                  <FaqAccordion items={festival.faq} />
                </Reveal>
              ) : null}

              <Reveal>
                <ReviewsSection entityType="festival" entityId={festival._id} />
              </Reveal>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <CheckoutCta
                slug={festival.slug}
                name={festival.name}
                serviceType="festival"
                basePrice={Number(festival.startingPrice)}
              />
            </div>
          </div>
        </Container>
        </PoojaBookingProvider>
      </section>
    </>
  );
}
