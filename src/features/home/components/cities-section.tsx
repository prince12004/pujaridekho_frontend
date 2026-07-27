import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { images } from "@/lib/images";
import { cities } from "@/features/home/data";

export function CitiesSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-15">
      <div className="absolute inset-x-0 top-0 h-64 opacity-[0.14]">
        <Image src={images.citySkyline} alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <Container className="relative">
        <SectionHeading
          eyebrow="Where We Serve"
          title="Service Cities"
          description="Pandits available for home visits across Delhi NCR."
          className="mb-12"
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {cities.map((city, i) => (
            <Reveal key={city.slug} delay={(i % 5) * 0.06}>
              <Link
                href={`/cities/${city.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand-gold-soft">
                  <MapPin size={20} />
                </span>
                <div>
                  <div className="font-heading text-sm leading-tight">{city.name}</div>
                  <div className="text-xs font-semibold text-muted-foreground">{city.panditCount}</div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
