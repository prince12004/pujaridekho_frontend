import type { Metadata } from "next";
import { PageBanner } from "@/components/shared/page-banner";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { CtaBanner } from "@/components/shared/cta-banner";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { ContactForm } from "@/features/contact/components/contact-form";
import { OfficeInfo } from "@/features/contact/components/office-info";
import { MapPlaceholder } from "@/features/contact/components/map-placeholder";
import { contactFaq } from "@/features/contact/data";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Reach PujariDekho by phone, WhatsApp or email — or send us a message directly. We typically respond within a few hours.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }], env.NEXT_PUBLIC_SITE_URL)} />
      <PageBanner
        eyebrow="We're Here to Help"
        title="Get in Touch"
        description="Questions about a booking, a pandit, or becoming a partner — reach us however is easiest for you."
        breadcrumbItems={[{ label: "Contact" }]}
        image={images.incenseSmoke}
      />

      <section className="py-20 sm:py-15">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
          <ContactForm />
          <div className="flex flex-col gap-6">
            <OfficeInfo />
            <MapPlaceholder />
          </div>
        </Container>
      </section>

      <section className="bg-muted/40 py-20 sm:py-15">
        <Container className="max-w-[820px]">
          <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" className="mb-8" />
          <FaqAccordion items={contactFaq} />
        </Container>
      </section>

      <CtaBanner
        eyebrow="Prefer to Talk?"
        title="Chat With Us on WhatsApp"
        description="Get a same-day response for booking changes, pandit questions or urgent support."
        primaryAction={{ label: "Open WhatsApp", href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}` }}
        secondaryAction={{ label: "Call Support", href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}` }}
      />
    </>
  );
}
