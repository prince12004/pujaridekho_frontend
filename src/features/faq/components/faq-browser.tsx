"use client";

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/shared/search-bar";
import { CategoryPills } from "@/components/shared/category-pills";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { allFaqs, faqCategories } from "@/features/faq/data";

export function FaqBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return allFaqs.filter((faq) => {
      const matchesCategory = category === "All" || faq.category === category;
      const matchesQuery = faq.question.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <CategoryPills categories={faqCategories} active={category} onChange={setCategory} />
        <SearchBar value={query} onChange={setQuery} placeholder="Search questions…" className="max-w-xs" />
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No questions match your search.</p>
      ) : (
        <FaqAccordion items={filtered} />
      )}
    </div>
  );
}
