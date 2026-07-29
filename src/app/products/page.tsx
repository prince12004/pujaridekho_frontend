import type { Metadata } from "next";
import { Suspense } from "react";
import { PageBanner } from "@/components/shared/page-banner";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { ProductsListingClient } from "@/features/products/components/products-listing-client";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "Puja Essentials & Samagri — Shop Online",
  description: "Temple-grade puja essentials, samagri kits, murtis and more — sourced and quality-checked before they reach your home.",
  path: "/products",
});

export default function ProductsListingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Products", path: "/products" }], env.NEXT_PUBLIC_SITE_URL)} />
      <PageBanner
        eyebrow="Puja Essentials"
        title="Everything Your Puja Needs"
        description="Temple-grade samagri, murtis and puja essentials — delivered to your door."
        breadcrumbItems={[{ label: "Products" }]}
        image={images.brassBells}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <Suspense fallback={<p className="py-16 text-center text-muted-foreground">Loading products…</p>}>
            <ProductsListingClient />
          </Suspense>
        </Container>
      </section>

      <CtaBanner
        eyebrow="Need Help Choosing?"
        title="Talk to Our Team"
        description="Not sure which samagri kit fits your puja? We'll help you pick the right one."
        primaryAction={{ label: "Contact Us", href: "/contact" }}
        secondaryAction={{ label: "Browse Poojas", href: "/poojas" }}
      />
    </>
  );
}
