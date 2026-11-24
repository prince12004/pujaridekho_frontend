import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { journeyItems } from "@/features/about/data";
import { cn } from "@/lib/utils";

// Milestones: a horizontal row joined by a brand line on desktop, a vertical
// rail on smaller screens. The last milestone is marked as the current one.
export function JourneySection() {
  const last = journeyItems.length - 1;

  return (
    <section className="relative overflow-hidden bg-muted/40 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Since 2025"
          title="Our Journey"
          description="From a single Griha Pravesh search to a trusted puja platform for families across Delhi NCR."
          align="center"
          className="mx-auto mb-14 max-w-2xl"
        />

        <ol className="relative mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-6">
          {/* Connecting line: vertical rail on mobile/tablet, horizontal on desktop. */}
          <span
            aria-hidden
            className="absolute bottom-8 left-7 top-8 w-[2px] bg-gradient-to-b from-primary via-brand-gold to-primary/30 lg:hidden"
          />
          <span
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-[2px] bg-gradient-to-r from-primary via-brand-gold to-primary/30 lg:block"
          />

          {journeyItems.map((item, i) => {
            const Icon = item.icon;
            const current = i === last;
            return (
              <li key={item.title} className="relative">
                <Reveal delay={i * 0.1} className="flex h-full gap-5 lg:flex-col lg:items-center lg:gap-6">
                  <span
                    className={cn(
                      "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 shadow-sm ring-8 ring-muted",
                      current
                        ? "border-transparent bg-gradient-to-br from-primary to-brand-gold text-white"
                        : "border-primary/70 bg-card text-primary",
                    )}
                  >
                    {Icon ? <Icon size={22} /> : <span className="font-heading text-lg">{i + 1}</span>}
                  </span>

                  <div
                    className={cn(
                      "group flex-1 rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(48,32,79,0.45)] lg:w-full lg:text-center",
                      current ? "border-primary/40" : "border-border",
                    )}
                  >
                    <div className="flex items-center gap-2 lg:justify-center">
                      <span className="font-ui rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                        {item.label}
                      </span>
                      {current ? (
                        <span className="font-ui rounded-full bg-brand-gold/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                          Now
                        </span>
                      ) : null}
                    </div>
                    <h3 className="font-heading mt-4 text-lg font-bold leading-snug text-foreground">{item.title}</h3>
                    <span className="mt-3 block h-[2px] w-8 rounded-full bg-primary/40 transition-all duration-300 group-hover:w-14 group-hover:bg-primary lg:mx-auto" />
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
