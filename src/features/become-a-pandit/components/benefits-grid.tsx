import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { panditBenefits } from "@/features/become-a-pandit/data";

export function BenefitsGrid() {
  return (
    <section className="py-20 sm:py-15">
      <Container>
        <SectionHeading eyebrow="Why Join" title="Benefits of Registering" className="mb-12" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {panditBenefits.map((benefit, i) => (
            <Reveal key={benefit.title} delay={(i % 4) * 0.06}>
              <div className="flex h-full flex-col gap-3.5 rounded-2xl border border-border bg-card p-6 shadow-sm">
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
