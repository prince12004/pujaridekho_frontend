import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Container } from "@/components/shared/container";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { ProductBuyBox } from "@/features/products/components/product-buy-box";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/lib/env";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1604882737625-4c4573c6e05f?w=900&auto=format&fit=crop";

async function fetchProduct(slug: string) {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/products/${slug}`, { cache: "no-store" });
  if (!response.ok) return null;
  const json = await response.json();
  return json.data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return {};

  return buildMetadata({
    title: product.name,
    description: product.shortDescription || product.description || "Shop temple-grade puja essentials on PujariDekho.",
    path: `/products/${product.slug}`,
    image: product.images?.[0] ?? FALLBACK_IMAGE,
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) notFound();

  const pageUrl = `${env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [{ name: "Products", path: "/products" }, { name: product.name, path: `/products/${product.slug}` }],
          env.NEXT_PUBLIC_SITE_URL,
        )}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          image: product.images ?? [],
          description: product.shortDescription || product.description,
          offers: {
            "@type": "Offer",
            price: product.sellingPrice,
            priceCurrency: "INR",
            url: pageUrl,
            availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        }}
      />

      <Container className="pt-6">
        <Breadcrumb items={[{ label: "Products", href: "/products" }, { label: product.name }]} />
      </Container>

      <section className="py-8">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="relative h-[380px] overflow-hidden rounded-3xl">
              <img src={product.images?.[0] ?? FALLBACK_IMAGE} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {product.images?.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((image: string) => (
                  <div key={image} className="h-24 overflow-hidden rounded-xl">
                    <img src={image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <span className="font-ui text-xs font-bold uppercase tracking-wide text-primary">
                {typeof product.category === "string" ? product.category : product.category?.name}
              </span>
              <h1 className="font-heading mt-1 text-3xl font-bold sm:text-4xl">{product.name}</h1>
              <p className="mt-4 text-muted-foreground">{product.description || product.shortDescription}</p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-primary" /> Quality checked
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck size={15} className="text-primary" /> Delivered across Delhi NCR
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <div className="flex items-baseline gap-2">
                {product.marketPrice && product.marketPrice > product.sellingPrice ? (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{Number(product.marketPrice).toLocaleString("en-IN")}
                  </span>
                ) : null}
                <span className="font-heading text-3xl text-secondary">
                  ₹{Number(product.sellingPrice).toLocaleString("en-IN")}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                {product.inStock ? "In stock" : "Currently out of stock"}
              </p>

              <ProductBuyBox
                slug={product.slug}
                name={product.name}
                price={product.sellingPrice}
                marketPrice={product.marketPrice}
                image={product.images?.[0]}
                inStock={product.inStock}
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
