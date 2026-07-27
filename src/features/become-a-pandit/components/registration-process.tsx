import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Timeline } from "@/components/shared/timeline";
import { registrationSteps } from "@/features/become-a-pandit/data";

export function RegistrationProcess() {
  return (
    <section className="py-20 sm:py-15">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Simple Process" title="Registration Process" className="mb-12" />
        <Timeline items={registrationSteps} />
      </Container>
    </section>
  );
}
