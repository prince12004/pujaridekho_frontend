import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export function KundliCta() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-secondary to-brand-purple-deep px-7 py-12 text-brand-cream sm:px-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(217,164,65,0.2) 1.4px, transparent 1.6px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
              <Sparkles size={100} className="hidden shrink-0 text-brand-gold-soft/90 lg:block" />
              <div className="max-w-lg">
                <span className="font-ui text-xs font-bold uppercase tracking-wide text-brand-gold-soft">
                  Free Astrology Tool
                </span>
                <h2 className="font-heading mt-2 text-3xl font-bold text-brand-gold-soft sm:text-4xl">
                  Generate Your Free Janam Kundli
                </h2>
                <p className="mt-3 text-brand-cream/80">
                  Real planetary positions computed in seconds — then book a live consultation
                  with our team to understand it in depth.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" className="font-ui font-bold" asChild>
                  <Link href="/kundli">Generate Kundli</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-ui border-white/25 bg-transparent font-bold text-brand-cream"
                  asChild
                >
                  <Link href="/consultation">Book a Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
