import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { HorizontalScroller } from "@/components/shared/horizontal-scroller";
import { images } from "@/lib/images";
import { env } from "@/lib/env";

interface PublicFestival {
  _id: string;
  slug: string;
  name: string;
  dateLabel?: string;
  featuredImage?: string;
}

async function fetchFeaturedFestivals(): Promise<PublicFestival[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/festivals?featured=true&limit=8`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data?.items ?? [];
}

export async function FestivalPoojasSection() {
  const festivals = await fetchFeaturedFestivals();
  if (festivals.length === 0) return null;

  return (
    <section id="festivals" className="bg-muted/40 py-20 sm:py-15">
      <Container>
        <SectionHeading
          eyebrow="Seasonal"
          title="Festival Poojas"
          description="Book ahead for upcoming festivals — pandits and samagri arranged in advance so you're never rushed."
          className="mb-0"
        />

        <HorizontalScroller>
          {festivals.map((festival) => (
            <Link
              key={festival._id}
              href={`/festivals/${festival.slug}`}
              className="group relative flex h-[300px] w-[250px] shrink-0 flex-col justify-end overflow-hidden rounded-[1.25rem] p-5 text-white shadow-sm"
              style={{ scrollSnapAlign: "start" }}
            >
              <Image
                src={festival.featuredImage ?? images.bowlWoodenTable}
                alt={festival.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="250px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-deep via-brand-purple-deep/40 to-transparent" />
              {festival.dateLabel && (
                <span className="relative font-ui text-xs font-bold uppercase tracking-wide text-brand-gold-soft">
                  {festival.dateLabel}
                </span>
              )}
              <span className="relative mt-1.5 font-heading text-lg font-bold leading-snug">{festival.name}</span>
              <span className="relative mt-3 inline-flex w-fit items-center rounded-full bg-gradient-to-r from-accent to-brand-gold-soft px-3.5 py-1.5 text-xs font-bold text-secondary">
                Book in Advance
              </span>
            </Link>
          ))}
        </HorizontalScroller>
      </Container>
    </section>
  );
}
