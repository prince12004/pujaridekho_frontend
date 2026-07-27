import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { employeeBenefits } from "@/features/careers/data";

export function CareersBenefits() {
  return (
    <section className="py-20 sm:py-15">
      <Container>
        <SectionHeading eyebrow="What You Get" title="Benefits" align="center" className="mx-auto mb-12" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {employeeBenefits.map((benefit, i) => (
            <Reveal key={benefit.title} delay={(i % 4) * 0.06}>
              <div className="flex h-full flex-col items-center gap-3.5 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                  <benefit.icon size={20} />
                </span>
                <h3 className="font-heading text-base">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
