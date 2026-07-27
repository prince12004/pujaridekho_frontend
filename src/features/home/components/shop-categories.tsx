import Link from "next/link";
import { BookOpen, CircleDot, Flame as Havan, Gem, Hexagon, Landmark, Package, Sparkle } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { shopCategories } from "@/features/home/data";
import type { ShopCategory } from "@/features/home/types";

const iconMap: Record<ShopCategory["icon"], React.ComponentType<{ size?: number }>> = {
  kit: Package,
  incense: Sparkle,
  murti: Landmark,
  book: BookOpen,
  yantra: Hexagon,
  rudraksha: Gem,
  mala: CircleDot,
  havan: Havan,
};

export function ShopCategories() {
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
          {shopCategories.map((category, i) => {
            const Icon = iconMap[category.icon];
            return (
              <Reveal key={category.slug} delay={(i % 4) * 0.06}>
                <Link
                  href={`/shop/${category.slug}`}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-7 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-gradient-to-br from-muted to-card text-primary">
                    <Icon size={26} />
                  </span>
                  <span className="font-heading text-sm">{category.name}</span>
                  <span className="text-xs font-semibold text-muted-foreground">{category.itemCount}</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
