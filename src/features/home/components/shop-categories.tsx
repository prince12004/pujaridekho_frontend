import Link from "next/link";
import { BookOpen, CircleDot, Flame as Havan, Gem, Hexagon, Landmark, Package, Sparkle } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { env } from "@/lib/env";

interface PublicProductCategory {
  _id: string;
  name: string;
  slug: string;
  itemCount: number;
}

function iconForSlug(slug: string) {
  if (slug.includes("incense") || slug.includes("dhoop")) return Sparkle;
  if (slug.includes("murti") || slug.includes("idol")) return Landmark;
  if (slug.includes("book")) return BookOpen;
  if (slug.includes("yantra")) return Hexagon;
  if (slug.includes("rudraksha")) return Gem;
  if (slug.includes("mala") || slug.includes("bead")) return CircleDot;
  if (slug.includes("havan")) return Havan;
  return Package;
}

async function fetchCategories(): Promise<PublicProductCategory[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/products/categories`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export async function ShopCategories() {
  const categories = await fetchCategories();
  if (categories.length === 0) return null;

  return (
    <section id="shop" className="py-20 sm:py-15">
      <Container>
        <SectionHeading
          eyebrow="Puja Store"
          title="Shop by Category"
          description="Authentic, temple-grade puja essentials delivered to your door."
          className="mb-12"
        />

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, i) => {
            const Icon = iconForSlug(category.slug);
            return (
              <Reveal key={category._id} delay={(i % 4) * 0.06}>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-7 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-gradient-to-br from-muted to-card text-primary">
                    <Icon size={26} />
                  </span>
                  <span className="font-heading text-sm">{category.name}</span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {category.itemCount} {category.itemCount === 1 ? "item" : "items"}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
