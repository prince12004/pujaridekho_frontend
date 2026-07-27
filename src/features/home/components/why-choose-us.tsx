import { CreditCard, HeartHandshake, Package, ShieldCheck, Sparkles, Headset } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { whyChooseItems } from "@/features/home/data";

const icons = [ShieldCheck, CreditCard, Sparkles, Package, HeartHandshake, Headset];

export function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-15">
      <Container>
        <SectionHeading
          eyebrow="Our Promise"
          title="Why Choose PujariDekho"
          description="Built on the same values every Hindu household expects — trust, ritual accuracy, and respect."
          className="mb-14"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseItems.map((item, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={item.title} delay={(i % 3) * 0.08}>
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-heading text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
