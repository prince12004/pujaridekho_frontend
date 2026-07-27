import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Timeline } from "@/components/shared/timeline";
import { hiringProcessSteps } from "@/features/careers/data";

export function HiringProcess() {
  return (
    <section className="bg-muted/40 py-20 sm:py-15">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="What to Expect" title="Hiring Process" className="mb-12" />
        <Timeline items={hiringProcessSteps} />
      </Container>
    </section>
  );
}
