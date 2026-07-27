import { CalendarDays, Flame, Home } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { processSteps } from "@/features/home/data";

const icons = [Flame, CalendarDays, Home];

export function HowItWorks() {
  return (
    <section className="bg-muted/40 py-20 sm:py-15">
      <Container>
        <SectionHeading
          eyebrow="Simple Process"
          title="How It Works"
          description="Three steps between you and a completed puja."
          align="center"
          className="mx-auto mb-16"
        />

        <div className="relative grid grid-cols-1 gap-12 sm:grid-cols-3">
          <div
            className="absolute top-11 left-[12%] right-[12%] hidden h-px sm:block"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, var(--accent) 0 10px, transparent 10px 18px)",
            }}
          />
          {processSteps.map((step, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={step.title} delay={i * 0.1} className="relative flex flex-col items-center gap-4 text-center">
                <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-2 border-border bg-card text-primary shadow-sm">
                  <Icon size={36} />
                </div>
                <h3 className="font-heading text-lg">
                  {i + 1}. {step.title}
                </h3>
                <p className="max-w-[260px] text-sm text-muted-foreground">{step.description}</p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
