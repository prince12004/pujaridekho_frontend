"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { Pagination } from "@/components/shared/pagination";
import { Reveal } from "@/components/shared/reveal";
import { MediaCard, MediaCardBody, MediaCardFooter, MediaCardImage } from "@/components/shared/media-card";
import { Button } from "@/components/ui/button";
import { useProductCategories, useProducts } from "@/features/products/api/use-products";

const PER_PAGE = 9;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1604882737625-4c4573c6e05f?w=600&auto=format&fit=crop";

export function ProductsListingClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>(initialCategory ? { category: initialCategory } : {});
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useProducts({ search: query, category: filters.category, limit: 100 });
  const { data: categories } = useProductCategories();

  const items = data?.items ?? [];

  const displayed = useMemo(() => items.slice((page - 1) * PER_PAGE, page * PER_PAGE), [items, page]);
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterBar
          resultCount={data?.total ?? 0}
          values={filters}
          onChange={(key, value) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
            setPage(1);
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
        <SearchBar
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
          placeholder="Search products…"
          className="max-w-xs"
        />
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

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-10" />
    </div>
  );
}
