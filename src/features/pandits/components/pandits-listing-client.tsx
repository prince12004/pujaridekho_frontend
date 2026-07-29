"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/shared/search-bar";
import { Pagination } from "@/components/shared/pagination";
import { Reveal } from "@/components/shared/reveal";
import { MediaCard, MediaCardBody, MediaCardFooter, MediaCardImage } from "@/components/shared/media-card";
import { Button } from "@/components/ui/button";
import { usePandits } from "@/features/pandits/api/use-pandits";

export function PanditsListingClient() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const { data, isLoading } = usePandits({ search, page, limit: 12 });
    const items = data?.items ?? [];

    return (
        <div>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SearchBar
                    value={search}
                    onChange={(value) => {
                        setSearch(value);
                        setPage(1);
                    }}
                    placeholder="Search pandits…"
                    className="max-w-xs"
                />
            </div>

            {isLoading ? (
                <p className="py-16 text-center text-muted-foreground">Loading verified pandits…</p>
            ) : data?.items.length ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {data.items.map((pandit) => (
                        <Reveal key={pandit._id} delay={0}>
                            <MediaCard>
                                <MediaCardImage
                                    src={pandit.photo || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"}
                                    alt={pandit.fullName}
                                    height="h-60"
                                />
                                <MediaCardBody>
                                    <h3 className="font-heading text-lg leading-snug">{pandit.fullName}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {pandit.specializations.length > 0 ? pandit.specializations.join(", ") : "Verified ritual specialist"}
                                    </p>
                                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                                        {pandit.cities.length > 0 && <div>Serves: {pandit.cities.join(", ")}</div>}
                                        {pandit.languages.length > 0 && <div>Languages: {pandit.languages.join(", ")}</div>}
                                        <div>Rating: {pandit.rating.toFixed(1)} ★</div>
                                    </div>
                                </MediaCardBody>
                                <MediaCardFooter>
                                    <Button size="sm" className="main_books font-ui font-bold" asChild>
                                        <Link href="/poojas">Book a Puja</Link>
                                    </Button>
                                </MediaCardFooter>
                            </MediaCard>
                        </Reveal>
                    ))}
                </div>
            ) : (
                <p className="py-16 text-center text-muted-foreground">No pandits match that search yet.</p>
            )}

            {data?.totalPages && data.totalPages > 1 ? (
                <Pagination currentPage={page} totalPages={data.totalPages} onPageChange={setPage} className="mt-10" />
            ) : null}
        </div>
    );
}
