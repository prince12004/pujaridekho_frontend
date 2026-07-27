import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { PoojaCard } from "@/features/home/components/pooja-card";
import { featuredPoojas } from "@/features/home/data";

export function FeaturedPoojas() {
  return (
    <section id="poojas" className="py-20 sm:py-15">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Most Booked"
            title="Popular Poojas"
            description="Traditional rituals performed by verified pandits, with samagri and fixed pricing included."
          />
          <Button variant="outline" className="font-ui font-bold" asChild>
            <Link href="/poojas">View All Poojas</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPoojas.map((pooja, i) => (
            <Reveal key={pooja.slug} delay={(i % 3) * 0.08}>
              <PoojaCard pooja={pooja} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
