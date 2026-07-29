"use client";

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { Reveal } from "@/components/shared/reveal";
import { PoojaCard } from "@/features/home/components/pooja-card";
import { bookingCities } from "@/features/home/data";
import { usePoojas } from "@/features/poojas/api/use-poojas";
import { poojaCategories } from "@/features/poojas/data";

export function PoojasListingClient() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { data, isLoading, error } = usePoojas({ search: query, page: 1, limit: 100 });

  const items = (data?.items ?? []) as Array<{
    _id: string;
    name: string;
    slug: string;
    duration?: string;
    location?: string;
    startingPrice?: number;
    marketPrice?: number;
    featuredImage?: string;
    tags?: string[];
    category?: { name: string; slug: string } | string;
    cities?: string[];
    citiesAvailable?: string[];
  }>;

  const filtered = useMemo(() => {
    return items.filter((pooja) => {
      const matchesCategory = !filters.category || filters.category === "All" || pooja.category === filters.category || (typeof pooja.category !== "string" && pooja.category?.name === filters.category);
      const cities = pooja.cities ?? pooja.citiesAvailable ?? [];
      const matchesCity = !filters.city || cities.some((city) => city.toLowerCase().includes(filters.city.toLowerCase()));
      return matchesCategory && matchesCity;
    });
  }, [filters, items]);

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
              options: poojaCategories.map((c) => ({ label: c, value: c })),
            },
            {
              key: "city",
              label: "City",
              placeholder: "City",
              options: bookingCities.map((c) => ({ label: c, value: c })),
            },
          ]}
        />
        <SearchBar
          value={query}
          onChange={(v) => {
            setQuery(v);
          }}
          placeholder="Search poojas…"
          className="max-w-xs"
        />
      </div>

      {isLoading ? (
        <p className="py-16 text-center text-muted-foreground">Loading poojas…</p>
      ) : error ? (
        <p className="py-16 text-center text-destructive">Unable to load poojas right now.</p>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No poojas match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pooja, i) => (
            <Reveal key={pooja._id} delay={(i % 3) * 0.08}>
              <PoojaCard
                pooja={{
                  slug: pooja.slug,
                  name: pooja.name,
                  duration: pooja.duration ?? "",
                  location: pooja.cities?.join(", ") ?? "",
                  price: pooja.startingPrice ?? 0,
                  marketPrice: pooja.marketPrice,
                  image: pooja.featuredImage ?? "",
                  tag: pooja.tags?.[0],
                }}
              />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
