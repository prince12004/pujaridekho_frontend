import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { MediaCard, MediaCardBody, MediaCardFooter, MediaCardImage } from "@/components/shared/media-card";
import { images } from "@/lib/images";
import { religiousProducts } from "@/features/home/data";

export function ReligiousProducts() {
  return (
    <section className="bg-muted/40 py-20 sm:py-15">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Handpicked"
            title="Religious Products"
            description="Temple-grade puja essentials, sourced and quality-checked before they reach your home."
          />
          <Button variant="outline" className="font-ui font-bold" asChild>
            <Link href="/shop">View all products</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {religiousProducts.map((product, i) => (
            <Reveal key={product.slug} delay={(i % 3) * 0.08}>
              <MediaCard>
                <MediaCardImage src={images[product.image]} alt={product.name} height="h-44" />
                <MediaCardBody>
                  <h3 className="font-heading text-base leading-snug">{product.name}</h3>
                  <MediaCardFooter className="border-t-0 pt-0">
                    <span className="font-heading text-lg text-secondary">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <Button size="sm" variant="outline" className="font-ui font-bold" asChild>
                      <Link href={`/shop/product/${product.slug}`}>Add to Cart</Link>
                    </Button>
                  </MediaCardFooter>
                </MediaCardBody>
              </MediaCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
