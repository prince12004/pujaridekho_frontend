import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Timeline } from "@/components/shared/timeline";
import { journeyItems } from "@/features/about/data";

export function JourneySection() {
  return (
    <section className="bg-muted/40 py-20 sm:py-15">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Since 2021" title="Our Journey" className="mb-12" />
        <Timeline items={journeyItems} />
      </Container>
    </section>
  );
}
