import type { Metadata } from "next";
import { PageBanner } from "@/components/shared/page-banner";
import { CtaBanner } from "@/components/shared/cta-banner";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { Container } from "@/components/shared/container";
import { FeaturedBlogCard } from "@/features/blog/components/featured-blog-card";
import { BlogListingClient } from "@/features/blog/components/blog-listing-client";
import type { PublicBlog } from "@/features/blog/api/use-blogs";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "Blog — Vidhi Guides, Muhurat Dates & Festival Explainers",
  description:
    "Puja vidhi guides, muhurat dates, astrology explainers and festival articles from PujariDekho's ritual experts.",
  path: "/blog",
});

async function fetchLatestPost(): Promise<PublicBlog | null> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/blogs?limit=1`, { cache: "no-store" });
  if (!response.ok) return null;
  const json = await response.json();
  return json.data?.items?.[0] ?? null;
}

export default async function BlogListingPage() {
  const featured = await fetchLatestPost();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Blog", path: "/blog" }], env.NEXT_PUBLIC_SITE_URL)} />
      <PageBanner
        eyebrow="Learn & Prepare"
        title="The PujariDekho Blog"
        description="Vidhi guides, muhurat dates and festival explainers — written with pandits, not lorem ipsum."
        breadcrumbItems={[{ label: "Blog" }]}
        image={images.marigold}
      />

      {featured && (
        <section className="py-16 sm:py-20">
          <Container>
            <FeaturedBlogCard post={featured} />
          </Container>
        </section>
      )}

      <section className="pb-20 sm:pb-28">
        <BlogListingClient excludeSlug={featured?.slug} />
      </section>

      <CtaBanner
        eyebrow="Need a Pandit?"
        title="Book a Verified Pandit Today"
        description="Fixed pricing, complete samagri, same-day availability across Delhi NCR."
        primaryAction={{ label: "Book a Puja", href: "/poojas" }}
        secondaryAction={{ label: "Browse Pandits", href: "/pandits" }}
      />
    </>
  );
}
