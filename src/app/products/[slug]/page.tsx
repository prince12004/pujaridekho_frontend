import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Container } from "@/components/shared/container";
import { JsonLd, breadcrumbSchema } from "@/components/shared/json-ld";
import { ProductBuyBox } from "@/features/products/components/product-buy-box";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/lib/env";
import { SERVER_API_URL } from "@/lib/server-env";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1604882737625-4c4573c6e05f?w=900&auto=format&fit=crop";

async function fetchProduct(slug: string) {
  const response = await fetch(`${SERVER_API_URL}/products/${slug}`, { next: { revalidate: 45 } });
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
  const categoryName = typeof product.category === "string" ? product.category : product.category?.name;
  const discount =
    product.marketPrice && product.marketPrice > product.sellingPrice
      ? Math.round(((product.marketPrice - product.sellingPrice) / product.marketPrice) * 100)
      : 0;

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
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images?.length ? product.images : [FALLBACK_IMAGE]} name={product.name} />

          <div className="flex flex-col gap-5">
            <div>
              <span className="font-ui text-xs font-bold uppercase tracking-wide text-primary">{categoryName}</span>
              <h1 className="font-heading mt-1 text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h1>
              {product.shortDescription ? <p className="mt-3 text-muted-foreground">{product.shortDescription}</p> : null}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-heading text-3xl text-secondary">₹{Number(product.sellingPrice).toLocaleString("en-IN")}</span>
                {discount > 0 ? (
                  <>
                    <span className="text-sm text-muted-foreground line-through">₹{Number(product.marketPrice).toLocaleString("en-IN")}</span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700">{discount}% off</span>
                  </>
                ) : null}
              </div>
              <p className={`mt-1 text-xs font-semibold ${product.inStock ? "text-emerald-700" : "text-destructive"}`}>
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

            <ul className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <li className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                <ShieldCheck size={16} className="shrink-0 text-primary" /> Quality checked
              </li>
              <li className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                <Truck size={16} className="shrink-0 text-primary" /> Delivery across Delhi NCR
              </li>
              <li className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                <RotateCcw size={16} className="shrink-0 text-primary" /> Cancel before shipping
              </li>
            </ul>

            {product.description ? (
              <div className="border-t border-border pt-5">
                <h2 className="font-heading text-lg font-bold">Product details</h2>
                <p className="mt-2 whitespace-pre-line leading-relaxed text-muted-foreground">{product.description}</p>
              </div>
            ) : null}

            <p className="text-xs text-muted-foreground">
              See our{" "}
              <Link href="/shipping-policy" className="font-semibold text-primary hover:underline">Shipping Policy</Link>
              {" "}for delivery times and charges.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
