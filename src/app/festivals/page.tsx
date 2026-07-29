import type { Metadata } from "next";
import { PageBanner } from "@/components/shared/page-banner";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { FestivalsListingClient } from "@/features/festivals/components/festivals-listing-client";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "Festival Poojas — Book Ahead for Upcoming Festivals",
  description: "Browse and book poojas for upcoming Hindu festivals — Diwali, Navratri, Ganesh Chaturthi and more, with fixed pricing.",
  path: "/festivals",
});

export default function FestivalsListingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Festival Pooja", path: "/festivals" }], env.NEXT_PUBLIC_SITE_URL)} />
      <PageBanner
        eyebrow="Festival Pooja"
        title="Book Ahead For Every Festival"
        description="Fixed pricing, verified pandits, and complete arrangements for every major Hindu festival."
        breadcrumbItems={[{ label: "Festival Pooja" }]}
        image={images.holiColors}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <FestivalsListingClient />
        </Container>
      </section>

      <CtaBanner
        eyebrow="Not Sure Which Festival Pooja You Need?"
        title="Talk to Our Team"
        description="Tell us the occasion — we'll recommend the right festival pooja and a verified pandit for it."
        primaryAction={{ label: "Contact Us", href: "/contact" }}
        secondaryAction={{ label: "Browse Poojas", href: "/poojas" }}
      />
    </>
  );
}
