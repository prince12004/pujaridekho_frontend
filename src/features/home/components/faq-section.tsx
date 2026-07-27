import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { faqItems } from "@/features/home/data";

export function FaqSection() {
  return (
    <section className="py-20 sm:py-15">
      <Container className="max-w-[820px]">
        <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" className="mb-8" />
        <Reveal>
          <FaqAccordion items={faqItems} />
        </Reveal>
      </Container>
    </section>
  );
}
