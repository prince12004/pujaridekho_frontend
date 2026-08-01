"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { Reveal } from "@/components/shared/reveal";
import { MediaCard, MediaCardBody, MediaCardFooter, MediaCardImage } from "@/components/shared/media-card";
import { Button } from "@/components/ui/button";
import { useProductCategories, useProducts } from "@/features/products/api/use-products";
import { useInfiniteScrollSentinel } from "@/lib/use-infinite-scroll";

const PER_PAGE = 9;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1604882737625-4c4573c6e05f?w=600&auto=format&fit=crop";

export function ProductsListingClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>(initialCategory ? { category: initialCategory } : {});
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);
  const { data, isLoading, error } = useProducts({ search: query, category: filters.category, limit: 100 });
  const { data: categories } = useProductCategories();

  const items = data?.items ?? [];

  useEffect(() => setVisibleCount(PER_PAGE), [query, filters.category]);

  const displayed = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;
  const sentinelRef = useInfiniteScrollSentinel(() => setVisibleCount((c) => Math.min(c + PER_PAGE, items.length)), hasMore);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterBar
          resultCount={data?.total ?? 0}
          values={filters}
          onChange={(key, value) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
          }}
          onClear={() => setFilters({})}
          filters={[
            {
              key: "category",
              label: "Category",
              placeholder: "Category",
              options: (categories ?? []).map((c) => ({ label: c.name, value: c.slug })),
            },
          ]}
        />
        <SearchBar value={query} onChange={setQuery} placeholder="Search products…" className="max-w-xs" />
      </div>

      {isLoading ? (
        <p className="py-16 text-center text-muted-foreground">Loading products…</p>
      ) : error ? (
        <p className="py-16 text-center text-destructive">Unable to load products right now.</p>
      ) : displayed.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No products match your filters yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((product, i) => (
            <Reveal key={product._id} delay={(i % 3) * 0.08}>
              <MediaCard>
                <MediaCardImage src={product.images?.[0] ?? FALLBACK_IMAGE} alt={product.name} height="h-55" />
                <MediaCardBody>
                  <h3 className="font-heading text-base leading-snug">{product.name}</h3>
                  <MediaCardFooter className="border-t-0 pt-0">
                    <span className="flex items-baseline gap-2">
                      {product.marketPrice && product.marketPrice > product.sellingPrice ? (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{product.marketPrice.toLocaleString("en-IN")}
                        </span>
                      ) : null}
                      <span className="font-heading text-lg text-secondary">
                        ₹{product.sellingPrice.toLocaleString("en-IN")}
                      </span>
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
      )}

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
