import type { Metadata } from "next";
import { PageBanner } from "@/components/shared/page-banner";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/shared/json-ld";
import { FaqBrowser } from "@/features/faq/components/faq-browser";
import { allFaqs } from "@/features/faq/data";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about booking poojas, verified pandits, payments, service cities and your PujariDekho account.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "FAQ", path: "/faq" }], env.NEXT_PUBLIC_SITE_URL)} />
      <JsonLd data={faqSchema(allFaqs)} />
      <PageBanner
        eyebrow="Good to Know"
        title="Frequently Asked Questions"
        description="Everything families ask us before their first booking — organised by topic."
        breadcrumbItems={[{ label: "FAQ" }]}
        image={images.brassBells}
      />

      <section className="py-20 sm:py-15">
        <Container className="max-w-3xl">
          <FaqBrowser />
        </Container>
      </section>

      <CtaBanner
        eyebrow="Still Have Questions?"
        title="Talk to Our Support Team"
        description="Can't find what you're looking for? We usually reply within a few hours."
        primaryAction={{ label: "Contact Us", href: "/contact" }}
        secondaryAction={{ label: "WhatsApp Support", href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}` }}
      />
    </>
  );
}
