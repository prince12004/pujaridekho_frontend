import type { Metadata } from "next";
import { PageBanner } from "@/components/shared/page-banner";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { BenefitsGrid } from "@/features/become-a-pandit/components/benefits-grid";
import { EligibilityDocuments } from "@/features/become-a-pandit/components/eligibility-documents";
import { RegistrationProcess } from "@/features/become-a-pandit/components/registration-process";
import { EarningsSection } from "@/features/become-a-pandit/components/earnings-section";
import { PanditTestimonials } from "@/features/become-a-pandit/components/pandit-testimonials";
import { RegistrationForm } from "@/features/become-a-pandit/components/registration-form";
import { panditFaq } from "@/features/become-a-pandit/data";
import { buildMetadata } from "@/lib/seo";
import { images } from "@/lib/images";
import { env } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "Become a Pandit",
  description:
    "Register as a verified pandit on PujariDekho — fixed payouts, flexible scheduling, and steady bookings across Delhi NCR.",
  path: "/become-a-pandit",
});

export default function BecomeAPanditPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Become a Pandit", path: "/become-a-pandit" }], env.NEXT_PUBLIC_SITE_URL)} />
      <PageBanner
        eyebrow="For Pandits"
        title="Bring Your Practice to More Families"
        description="Join a verified network of 500+ pandits earning steady, fairly-priced bookings across Delhi NCR."
        breadcrumbItems={[{ label: "Become a Pandit" }]}
        image={images.brassBells}
      />

      <BenefitsGrid />
      <EligibilityDocuments />
      <RegistrationProcess />
      <EarningsSection />
      <PanditTestimonials />
      <RegistrationForm />

      <section className="bg-muted/40 pb-20 sm:pb-28">
        <Container className="max-w-[820px] pt-10">
          <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" className="mb-8" />
          <FaqAccordion items={panditFaq} />
        </Container>
      </section>
    </>
  );
}
