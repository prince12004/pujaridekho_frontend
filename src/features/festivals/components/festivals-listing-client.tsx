"use client";

import { useState } from "react";
import { SearchBar } from "@/components/shared/search-bar";
import { Pagination } from "@/components/shared/pagination";
import { Reveal } from "@/components/shared/reveal";
import { PoojaCard } from "@/features/home/components/pooja-card";
import { useFestivals } from "@/features/festivals/api/use-festivals";

const PER_PAGE = 9;

export function FestivalsListingClient() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useFestivals({ search: query, page: 1, limit: 100 });

  const items = data?.items ?? [];
  const displayed = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));

  return (
    <div>
      <div className="mb-8 flex justify-end">
        <SearchBar
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
          placeholder="Search festivals…"
          className="max-w-xs"
        />
      </div>

      {isLoading ? (
        <p className="py-16 text-center text-muted-foreground">Loading festivals…</p>
      ) : error ? (
        <p className="py-16 text-center text-destructive">Unable to load festivals right now.</p>
      ) : displayed.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No upcoming festival poojas yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((festival, i) => (
            <Reveal key={festival._id} delay={(i % 3) * 0.08}>
              <PoojaCard
                pooja={{
                  slug: festival.slug,
                  name: festival.name,
                  duration: festival.dateLabel ?? "",
                  location: "",
                  price: festival.startingPrice,
                  marketPrice: festival.marketPrice,
                  image: festival.featuredImage ?? "",
                }}
                hrefBase="/festivals"
              />
            </Reveal>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-10" />
    </div>
  );
}
