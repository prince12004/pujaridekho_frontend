import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, MapPin, ShieldCheck, Sparkles, User } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { Timeline } from "@/components/shared/timeline";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { ReviewCard } from "@/components/shared/review-card";
import { RelatedSection } from "@/components/shared/related-section";
import { BookingWidget } from "@/components/shared/booking-widget";
import { MediaCard, MediaCardBody, MediaCardImage } from "@/components/shared/media-card";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { PoojaGallery } from "@/features/poojas/components/pooja-gallery";
import { PoojaPackages } from "@/features/poojas/components/pooja-packages";
import { getPoojaBySlug, poojaOptions, poojas } from "@/features/poojas/data";
import { bookingCities, testimonials } from "@/features/home/data";
import { blogPosts } from "@/features/blog/data";
import { religiousProducts } from "@/features/home/data";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";

export function generateStaticParams() {
  return poojas.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pooja = getPoojaBySlug(slug);
  if (!pooja) return {};

  return buildMetadata({
    title: `${pooja.name} — Book Online`,
    description: pooja.overview,
    path: `/poojas/${pooja.slug}`,
    image: images[pooja.image],
  });
}

export default async function PoojaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pooja = getPoojaBySlug(slug);
  if (!pooja) notFound();

  const relatedBlogs = blogPosts.filter((b) => pooja.relatedBlogSlugs.includes(b.slug));
  const relatedProducts = religiousProducts.filter((p) => pooja.relatedProductSlugs.includes(p.slug));
  const reviews = testimonials.slice(0, 3);
  const pageUrl = `${env.NEXT_PUBLIC_SITE_URL}/poojas/${pooja.slug}`;

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
          offers: { "@type": "Offer", price: pooja.price, priceCurrency: "INR", url: pageUrl },
        }}
      />
      {pooja.faq.length > 0 ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: pooja.faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
          }}
        />
      ) : null}

      <Container className="pt-6">
        <Breadcrumb items={[{ label: "Poojas", href: "/poojas" }, { label: pooja.name }]} />
      </Container>

      <section className="py-8">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <PoojaGallery images={pooja.galleryImages} alt={pooja.name} />

            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="font-ui text-xs font-bold uppercase tracking-wide text-primary">{pooja.category}</span>
                <h1 className="font-heading mt-1 text-3xl font-bold sm:text-4xl">{pooja.name}</h1>
                <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock size={15} className="text-primary" /> {pooja.duration}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={15} className="text-primary" /> {pooja.location}</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-primary" /> 100% Verified Pandits</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-2">
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{pooja.marketPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">
                    {Math.round(((pooja.marketPrice - pooja.price) / pooja.marketPrice) * 100)}% OFF
                  </span>
                </div>
                <div className="font-heading text-3xl text-secondary">₹{pooja.price.toLocaleString("en-IN")}</div>
                <div className="text-xs font-semibold text-muted-foreground">PujariDekho Price · Samagri included</div>
              </div>
            </div>

            <div id="book" className="mt-6 scroll-mt-24 lg:hidden">
              <BookingWidget
                cities={bookingCities}
                poojas={poojaOptions}
                title={`Book ${pooja.name}`}
                subtitle="Fixed price · Samagri included"
              />
            </div>

            <div className="mt-10 flex flex-col gap-10">
              <Reveal>
                <h2 className="font-heading mb-3 text-2xl">Overview</h2>
                <p className="text-muted-foreground">{pooja.overview}</p>
              </Reveal>

              <Reveal>
                <h2 className="font-heading mb-4 text-2xl">Benefits</h2>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {pooja.benefits.map((benefit) => (
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
                <h2 className="font-heading mb-4 text-2xl">Required Samagri</h2>
                <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {pooja.samagri.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal>
                <h2 className="font-heading mb-6 text-2xl">Pooja Vidhi</h2>
                <Timeline items={pooja.vidhiSteps.map((step, i) => ({ label: `Step ${i + 1}`, title: step.title, description: step.description }))} />
              </Reveal>

              <Reveal>
                <h2 className="font-heading mb-6 text-2xl">Packages &amp; Pricing</h2>
                <PoojaPackages packages={pooja.packages} />
              </Reveal>

              {pooja.faq.length > 0 ? (
                <Reveal>
                  <h2 className="font-heading mb-5 text-2xl">Frequently Asked Questions</h2>
                  <FaqAccordion items={pooja.faq} />
                </Reveal>
              ) : null}

              <Reveal>
                <h2 className="font-heading mb-5 text-2xl">Reviews</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {reviews.map((review, i) => (
                    <ReviewCard
                      key={review.name}
                      name={review.name}
                      subtitle={review.location}
                      rating={review.rating}
                      quote={review.quote}
                      seed={i}
                    />
                  ))}
                </div>
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
              <BookingWidget
                cities={bookingCities}
                poojas={poojaOptions}
                title={`Book ${pooja.name}`}
                subtitle="Fixed price · Samagri included"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
