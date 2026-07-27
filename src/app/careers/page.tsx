import type { Metadata } from "next";
import { PageBanner } from "@/components/shared/page-banner";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { OpenPositions } from "@/features/careers/components/open-positions";
import { CompanyCulture } from "@/features/careers/components/company-culture";
import { CareersBenefits } from "@/features/careers/components/careers-benefits";
import { HiringProcess } from "@/features/careers/components/hiring-process";
import { ApplyForm } from "@/features/careers/components/apply-form";
import { careersFaq } from "@/features/careers/data";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description: "Join the team building India's most trusted pandit booking platform. See open roles at PujariDekho.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Careers", path: "/careers" }], env.NEXT_PUBLIC_SITE_URL)} />
      <PageBanner
        eyebrow="Join Our Team"
        title="Help Build a More Trustworthy Way to Book a Pandit"
        description="We're a small team solving a problem we've personally struggled with — come solve it with us."
        breadcrumbItems={[{ label: "Careers" }]}
        image={images.citySkyline}
      />

      <OpenPositions />
      <CompanyCulture />
      <CareersBenefits />
      <HiringProcess />
      <ApplyForm />

      <section className="bg-muted/40 pb-20 sm:pb-28">
        <Container className="max-w-[820px]">
          <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" className="mb-8" />
          <FaqAccordion items={careersFaq} />
        </Container>
      </section>
    </>
  );
}
