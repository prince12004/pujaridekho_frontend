import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { HorizontalScroller } from "@/components/shared/horizontal-scroller";
import { images } from "@/lib/images";
import { SERVER_API_URL } from "@/lib/server-env";

interface PublicFestival {
  _id: string;
  slug: string;
  name: string;
  dateLabel?: string;
  featuredImage?: string;
}

async function fetchFeaturedFestivals(): Promise<PublicFestival[]> {
  const res = await fetch(`${SERVER_API_URL}/festivals?featured=true&limit=8`, { next: { revalidate: 45 } });
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
          title="Festival Puja's"
          description="Book ahead for upcoming festivals — pandits and samagri arranged in advance so you're never rushed."
          className="mb-0"
        />

        <HorizontalScroller>
          {festivals.map((festival) => (
            <div
              key={festival._id}
              className="relative flex h-[300px] w-[250px] shrink-0 cursor-default flex-col justify-end overflow-hidden rounded-[1.25rem] p-5 text-white shadow-sm"
              style={{ scrollSnapAlign: "start" }}
            >
              <Image
                src={festival.featuredImage ?? images.bowlWoodenTable}
                alt={festival.name}
                fill
                className="object-cover"
                sizes="250px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-deep via-brand-purple-deep/40 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-secondary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm backdrop-blur-sm">
                Coming Soon
              </span>
              {festival.dateLabel && (
                <span className="relative font-ui text-xs font-bold uppercase tracking-wide text-brand-gold-soft">
                  {festival.dateLabel}
                </span>
              )}
              <span className="relative mt-1.5 font-heading text-lg font-bold leading-snug">{festival.name}</span>
            </div>
          ))}
        </HorizontalScroller>
      </Container>
    </section>
  );
}
