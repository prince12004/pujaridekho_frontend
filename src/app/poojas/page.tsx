import type { Metadata } from "next";
import { PageBanner } from "@/components/shared/page-banner";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { PoojasListingClient } from "@/features/poojas/components/poojas-listing-client";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "All Poojas — Book Verified Pandits Online",
  description:
    "Browse every puja on PujariDekho — Satyanarayan, Griha Pravesh, Navgraha Shanti and more, with fixed pricing and samagri included.",
  path: "/poojas",
});

export default function PoojasListingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Poojas", path: "/poojas" }], env.NEXT_PUBLIC_SITE_URL)} />
      <PageBanner
        eyebrow="All Poojas"
        title="Every Ritual, One Fixed Price"
        description="Verified pandits, complete samagri, and transparent pricing for every puja we offer."
        breadcrumbItems={[{ label: "Poojas" }]}
        image={images.ganeshIdol}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <PoojasListingClient />
        </Container>
      </section>

      <CtaBanner
        eyebrow="Not Sure Which Puja You Need?"
        title="Talk to Our Team"
        description="Tell us the occasion — we'll recommend the right puja and a verified pandit for it."
        primaryAction={{ label: "Contact Us", href: "/contact" }}
        secondaryAction={{ label: "Browse Pandits", href: "/pandits" }}
      />
    </>
  );
}
