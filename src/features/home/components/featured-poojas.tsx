import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { PoojaCard } from "@/features/home/components/pooja-card";
import { env } from "@/lib/env";

interface PublicPooja {
  _id: string;
  slug: string;
  name: string;
  featuredImage?: string;
  startingPrice: number;
  marketPrice?: number;
  category?: { name: string };
}

async function fetchFeaturedPoojas(): Promise<PublicPooja[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/poojas?limit=9`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data?.items ?? [];
}

export async function FeaturedPoojas() {
  const poojas = await fetchFeaturedPoojas();
  if (poojas.length === 0) return null;

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
          {poojas.map((pooja, i) => (
            <Reveal key={pooja._id} delay={(i % 3) * 0.08}>
              <PoojaCard
                pooja={{
                  slug: pooja.slug,
                  name: pooja.name,
                  location: pooja.category?.name,
                  price: pooja.startingPrice,
                  marketPrice: pooja.marketPrice,
                  image: pooja.featuredImage ?? "bowlWoodenTable",
                }}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
