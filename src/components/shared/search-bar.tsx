"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  autoFocus,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Search size={17} className="absolute left-3.5 text-muted-foreground" />
      <input
        type="text"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-input bg-card pl-10 pr-9 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute right-3 text-muted-foreground hover:text-foreground"
        >
          <X size={15} />
        </button>
      ) : null}
    </div>
  );
}
