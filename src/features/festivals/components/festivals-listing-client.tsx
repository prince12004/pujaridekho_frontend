"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { SearchBar } from "@/components/shared/search-bar";
import { Reveal } from "@/components/shared/reveal";
import { PoojaCard } from "@/features/home/components/pooja-card";
import { useFestivals } from "@/features/festivals/api/use-festivals";
import { useInfiniteScrollSentinel } from "@/lib/use-infinite-scroll";

const PER_PAGE = 9;

export function FestivalsListingClient() {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);
  const { data, isLoading, error } = useFestivals({ search: query, page: 1, limit: 100 });

  const items = data?.items ?? [];

  useEffect(() => setVisibleCount(PER_PAGE), [query]);

  const displayed = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;
  const sentinelRef = useInfiniteScrollSentinel(() => setVisibleCount((c) => Math.min(c + PER_PAGE, items.length)), hasMore);

  return (
    <div>
      <div className="mb-8 flex justify-end">
        <SearchBar value={query} onChange={setQuery} placeholder="Search festivals…" className="max-w-xs" />
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

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
