import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, MapPin, ShieldCheck, Sparkles, User } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { Timeline } from "@/components/shared/timeline";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { ReviewsSection } from "@/components/shared/reviews-section";
import { RelatedSection } from "@/components/shared/related-section";
import { MediaCard, MediaCardBody, MediaCardImage } from "@/components/shared/media-card";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { PoojaGallery } from "@/features/poojas/components/pooja-gallery";
import { PoojaPackages } from "@/features/poojas/components/pooja-packages";
import { SamagriSelector } from "@/features/poojas/components/samagri-selector";
import { CheckoutCta } from "@/features/poojas/components/checkout-cta";
import { PoojaBookingProvider } from "@/features/poojas/components/pooja-booking-context";
import { blogPosts } from "@/features/blog/data";
import { religiousProducts } from "@/features/home/data";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";

async function fetchPooja(slug: string) {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/poojas/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  return json.data;
}

function resolveImage(src?: string) {
  if (!src) return images.bowlWoodenTable;
  return src in images ? images[src as keyof typeof images] : src;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pooja = await fetchPooja(slug);
  if (!pooja) return {};

  return buildMetadata({
    title: `${pooja.name} — Book Online`,
    description: pooja.shortDescription || pooja.fullDescription || "Book a verified puja online with fixed pricing and samagri included.",
    path: `/poojas/${pooja.slug}`,
    image: resolveImage(pooja.heroBanner || pooja.featuredImage),
  });
}

export default async function PoojaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pooja = await fetchPooja(slug);
  if (!pooja) notFound();

  const relatedBlogs = blogPosts.filter((b) => (pooja.relatedBlogSlugs ?? []).includes(b.slug));
  const relatedProducts = religiousProducts.filter((p) => (pooja.relatedProductSlugs ?? []).includes(p.slug));
  const pageUrl = `${env.NEXT_PUBLIC_SITE_URL}/poojas/${pooja.slug}`;
  const headingImage = resolveImage(pooja.heroBanner || pooja.featuredImage);
  const galleryItems = (Array.isArray(pooja.gallery) ? pooja.gallery : []).filter(
    (item: string) => resolveImage(item) !== headingImage,
  );

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [{ name: "Poojas", path: "/poojas" }, { name: pooja.name, path: `/poojas/${pooja.slug}` }],
          env.NEXT_PUBLIC_SITE_URL,
        )}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: pooja.name,
          provider: { "@type": "Organization", name: "PujariDekho" },
          areaServed: "Delhi NCR",
          offers: { "@type": "Offer", price: pooja.startingPrice, priceCurrency: "INR", url: pageUrl },
        }}
      />
      {Array.isArray(pooja.faq) && pooja.faq.length > 0 ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: pooja.faq.map((f: { question: string; answer: string }) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }}
        />
      ) : null}

      <Container className="pt-6">
        <Breadcrumb items={[{ label: "Poojas", href: "/poojas" }, { label: pooja.name }]} />
      </Container>

      <section className="py-8">
        <PoojaBookingProvider>
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="relative hidden h-[420px] overflow-hidden rounded-3xl lg:block">
              <img src={headingImage} alt={pooja.name} className="h-full w-full object-cover" />
            </div>
            {galleryItems.length > 0 ? <PoojaGallery images={galleryItems} alt={pooja.name} /> : null}

            <div className="mains_details mt-6 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div>
                <span className="font-ui text-xs font-bold uppercase tracking-wide text-primary">{typeof pooja.category === "string" ? pooja.category : pooja.category?.name}</span>
                <h1 className="font-heading mt-1 text-3xl font-bold sm:text-4xl">{pooja.name}</h1>
                <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock size={15} className="text-primary" /> {pooja.duration ?? ""}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={15} className="text-primary" /> {pooja.location ?? ""}</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-primary" /> 100% Verified Pandits</span>
                </div>
              </div>
              <div className="text-right price_right">
                <div className="flex items-baseline price_right justify-end gap-2">
                  {pooja.marketPrice ? (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{Number(pooja.marketPrice).toLocaleString("en-IN")}
                    </span>
                  ) : null}
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">
                    {pooja.marketPrice ? Math.round(((Number(pooja.marketPrice) - Number(pooja.startingPrice)) / Number(pooja.marketPrice)) * 100) : 0}% OFF
                  </span>
                </div>
                <div className="font-heading text-3xl text-secondary">₹{Number(pooja.startingPrice).toLocaleString("en-IN")}</div>
                <div className="text-xs font-semibold text-muted-foreground">PujariDekho Price · Samagri not included</div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-8">
              <Reveal>
                <SamagriSelector basePrice={Number(pooja.startingPrice)} samagri={pooja.samagri ?? []} />
              </Reveal>

              <Reveal>
                <h2 className="font-heading mb-6 text-2xl">Packages &amp; Pricing</h2>
                <PoojaPackages packages={pooja.packages ?? []} />
              </Reveal>
            </div>

            <div id="book" className="mt-10 scroll-mt-24 lg:hidden">
              <CheckoutCta
                slug={pooja.slug}
                name={pooja.name}
                serviceType="pooja"
                basePrice={Number(pooja.startingPrice)}
              />
            </div>

            <div className="mt-10 flex flex-col gap-10">
              <Reveal>
                <h2 className="font-heading mb-3 text-2xl">Overview</h2>
                <p className="text-muted-foreground">{pooja.fullDescription ?? pooja.shortDescription}</p>
              </Reveal>

              <Reveal>
                <h2 className="font-heading mb-4 text-2xl">Benefits</h2>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(pooja.benefits ?? []).map((benefit: string) => (
                    <li key={benefit} className="flex gap-2.5 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                      <Sparkles size={16} className="mt-0.5 shrink-0 text-accent" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal>
                <h2 className="font-heading mb-3 text-2xl">Importance</h2>
                <p className="text-muted-foreground">{pooja.importance}</p>
              </Reveal>

              <Reveal>
                <h2 className="font-heading mb-3 flex items-center gap-2 text-2xl">
                  <User size={20} className="text-primary" /> Who Should Perform This Puja
                </h2>
                <p className="text-muted-foreground">{pooja.whoShouldPerform}</p>
              </Reveal>

              <Reveal>
                <h2 className="font-heading mb-6 text-2xl">Pooja Vidhi</h2>
                <Timeline
                  items={(pooja.vidhiSteps ?? []).map((step: { title: string; description: string }, i: number) => ({
                    label: `Step ${i + 1}`,
                    title: step.title,
                    description: step.description,
                  }))}
                />
              </Reveal>

              {Array.isArray(pooja.faq) && pooja.faq.length > 0 ? (
                <Reveal>
                  <h2 className="font-heading mb-5 text-2xl">Frequently Asked Questions</h2>
                  <FaqAccordion items={pooja.faq} />
                </Reveal>
              ) : null}

              <Reveal>
                <ReviewsSection entityType="pooja" entityId={pooja._id} />
              </Reveal>

              {relatedProducts.length > 0 ? (
                <RelatedSection title="Related Products">
                  {relatedProducts.map((product) => (
                    <MediaCard key={product.slug}>
                      <MediaCardImage src={images[product.image]} alt={product.name} height="h-36" />
                      <MediaCardBody>
                        <span className="font-heading text-sm">{product.name}</span>
                        <span className="font-heading text-base text-secondary">₹{product.price.toLocaleString("en-IN")}</span>
                      </MediaCardBody>
                    </MediaCard>
                  ))}
                </RelatedSection>
              ) : null}

              {relatedBlogs.length > 0 ? (
                <RelatedSection title="Related Blogs">
                  {relatedBlogs.map((blog) => (
                    <MediaCard key={blog.slug} href={`/blog/${blog.slug}`}>
                      <MediaCardImage src={images[blog.image]} alt={blog.title} height="h-36" />
                      <MediaCardBody>
                        <span className="text-xs font-semibold text-muted-foreground">{blog.readTime}</span>
                        <span className="font-heading text-sm leading-snug">{blog.title}</span>
                      </MediaCardBody>
                    </MediaCard>
                  ))}
                </RelatedSection>
              ) : null}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <CheckoutCta
                slug={pooja.slug}
                name={pooja.name}
                serviceType="pooja"
                basePrice={Number(pooja.startingPrice)}
              />
            </div>
          </div>
        </Container>
        </PoojaBookingProvider>
      </section>
    </>
  );
}
