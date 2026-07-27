"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/shared/modal";
import { SearchBar } from "@/components/shared/search-bar";

const popularSearches = [
  { label: "Griha Pravesh Puja", href: "/poojas/griha-pravesh" },
  { label: "Satyanarayan Puja", href: "/poojas/satyanarayan-puja" },
  { label: "Pandit Ji in Noida", href: "/pandits?city=noida" },
  { label: "Rudraksha Mala", href: "/shop/rudraksha" },
];

export function SearchOverlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <Modal open={open} onOpenChange={onOpenChange} className="sm:max-w-lg" showCloseButton={false}>
      <SearchBar
        value={query}
        onChange={setQuery}
        autoFocus
        placeholder="Search poojas, pandits, products…"
        className="[&_input]:h-13 [&_input]:rounded-xl [&_input]:text-base"
      />
      <div className="mt-2">
        <span className="font-ui text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Popular Searches
        </span>
        <ul className="mt-2 flex flex-col">
          {popularSearches
            .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
            .map((item) => (
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
    </Modal>
  );
}
