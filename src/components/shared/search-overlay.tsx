"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/shared/modal";
import { SearchBar } from "@/components/shared/search-bar";
import { usePoojas } from "@/features/poojas/api/use-poojas";
import { usePandits } from "@/features/pandits/api/use-pandits";
import { useProducts } from "@/features/products/api/use-products";
import { useBlogs } from "@/features/blog/api/use-blogs";

const popularSearches = [
  { label: "Griha Pravesh Puja", href: "/poojas/grah-pravesh-puja" },
  { label: "Satyanarayan Puja", href: "/poojas/satyanarayan-katha" },
  { label: "Pandit Ji in Noida", href: "/pandits?city=noida" },
  { label: "Rudraksha Mala", href: "/products?category=rudraksha" },
];

const RESULT_LIMIT = 4;

export function SearchOverlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setDebouncedQuery("");
    }
  }, [open]);

  const isSearching = debouncedQuery.length >= 2;

  const poojas = usePoojas({ search: debouncedQuery, limit: RESULT_LIMIT }, { enabled: isSearching });
  const pandits = usePandits({ search: debouncedQuery, limit: RESULT_LIMIT }, { enabled: isSearching });
  const products = useProducts({ search: debouncedQuery, limit: RESULT_LIMIT }, { enabled: isSearching });
  const blogs = useBlogs({ search: debouncedQuery, limit: RESULT_LIMIT }, { enabled: isSearching });

  const isLoading = isSearching && (poojas.isLoading || pandits.isLoading || products.isLoading || blogs.isLoading);
  const totalResults =
    (poojas.data?.items.length ?? 0) +
    (pandits.data?.items.length ?? 0) +
    (products.data?.items.length ?? 0) +
    (blogs.data?.items.length ?? 0);

  return (
    <Modal open={open} onOpenChange={onOpenChange} className="sm:max-w-lg" showCloseButton={false}>
      <SearchBar
        value={query}
        onChange={setQuery}
        autoFocus
        placeholder="Search poojas, pandits, products…"
        className="[&_input]:h-13 [&_input]:rounded-xl [&_input]:text-base"
      />

      {!isSearching ? (
        <div className="mt-2">
          <span className="font-ui text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Popular Searches
          </span>
          <ul className="mt-2 flex flex-col">
            {popularSearches.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className="block rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Searching…
        </div>
      ) : totalResults === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">No results for &ldquo;{debouncedQuery}&rdquo;.</p>
      ) : (
        <div className="mt-2 flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
          {poojas.data?.items.length ? (
            <ResultGroup label="Poojas">
              {poojas.data.items.map((item) => (
                <ResultLink key={item._id} href={`/poojas/${item.slug}`} onSelect={() => onOpenChange(false)}>
                  {item.name}
                </ResultLink>
              ))}
            </ResultGroup>
          ) : null}

          {pandits.data?.items.length ? (
            <ResultGroup label="Pandits">
              {pandits.data.items.map((item) => (
                <ResultLink key={item._id} href="/pandits" onSelect={() => onOpenChange(false)}>
                  {item.fullName}
                </ResultLink>
              ))}
            </ResultGroup>
          ) : null}

          {products.data?.items.length ? (
            <ResultGroup label="Products">
              {products.data.items.map((item) => (
                <ResultLink key={item._id} href={`/products/${item.slug}`} onSelect={() => onOpenChange(false)}>
                  {item.name}
                </ResultLink>
              ))}
            </ResultGroup>
          ) : null}

          {blogs.data?.items.length ? (
            <ResultGroup label="Blog">
              {blogs.data.items.map((item) => (
                <ResultLink key={item._id} href={`/blog/${item.slug}`} onSelect={() => onOpenChange(false)}>
                  {item.title}
                </ResultLink>
              ))}
            </ResultGroup>
          ) : null}
        </div>
      )}
    </Modal>
  );
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="font-ui text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      <ul className="mt-1 flex flex-col">{children}</ul>
    </div>
  );
}

function ResultLink({ href, onSelect, children }: { href: string; onSelect: () => void; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        onClick={onSelect}
        className="block rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
      >
        {children}
      </Link>
    </li>
  );
}
