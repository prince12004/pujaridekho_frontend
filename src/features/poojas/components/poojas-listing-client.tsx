"use client";

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar } from "@/components/shared/filter-bar";
import { Pagination } from "@/components/shared/pagination";
import { Reveal } from "@/components/shared/reveal";
import { PoojaCard } from "@/features/home/components/pooja-card";
import { poojaCategories, poojas } from "@/features/poojas/data";
import { bookingCities } from "@/features/home/data";

const PER_PAGE = 6;

export function PoojasListingClient() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return poojas.filter((pooja) => {
      const matchesQuery = pooja.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !filters.category || filters.category === "All" || pooja.category === filters.category;
      const matchesCity = !filters.city || pooja.location.toLowerCase().includes(filters.city.toLowerCase());
      return matchesQuery && matchesCategory && matchesCity;
    });
  }, [query, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterBar
          resultCount={filtered.length}
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
            setPage(1);
          }}
          placeholder="Search poojas…"
          className="max-w-xs"
        />
      </div>

      {current.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No poojas match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {current.map((pooja, i) => (
            <Reveal key={pooja.slug} delay={(i % 3) * 0.08}>
              <PoojaCard pooja={pooja} />
            </Reveal>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-10" />
    </div>
  );
}
