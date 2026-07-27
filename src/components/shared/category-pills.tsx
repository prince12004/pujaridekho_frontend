"use client";

import { cn } from "@/lib/utils";

export function CategoryPills({
  categories,
  active,
  onChange,
  className,
}: {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={cn(
            "font-ui rounded-full border px-4 py-1.5 text-sm font-bold transition-colors",
            active === category
              ? "border-primary bg-primary text-white"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
