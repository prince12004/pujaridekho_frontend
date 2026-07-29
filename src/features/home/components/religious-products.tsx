import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { MediaCard, MediaCardBody, MediaCardFooter, MediaCardImage } from "@/components/shared/media-card";
import { env } from "@/lib/env";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1604882737625-4c4573c6e05f?w=900&auto=format&fit=crop";

interface PublicProduct {
  _id: string;
  slug: string;
  name: string;
  images: string[];
  sellingPrice: number;
}

async function fetchProducts(): Promise<PublicProduct[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/products?limit=6`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data?.items ?? [];
}

export async function ReligiousProducts() {
  const products = await fetchProducts();
  if (products.length === 0) return null;

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
            <Link href="/products">View all products</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product._id} delay={(i % 3) * 0.08}>
              <MediaCard>
                <MediaCardImage src={product.images?.[0] ?? FALLBACK_IMAGE} alt={product.name} height="h-55" />
                <MediaCardBody>
                  <h3 className="font-heading text-base leading-snug">{product.name}</h3>
                  <MediaCardFooter className="border-t-0 pt-0">
                    <span className="font-heading text-lg text-secondary">
                      ₹{product.sellingPrice.toLocaleString("en-IN")}
                    </span>
                    <Button size="sm" variant="outline" className="font-ui font-bold" asChild>
                      <Link href={`/products/${product.slug}`}>View Product</Link>
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
