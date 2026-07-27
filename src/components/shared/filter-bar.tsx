"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Drawer } from "@/components/shared/drawer";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  placeholder: string;
  options: FilterOption[];
}

export function FilterBar({
  filters,
  values,
  onChange,
  onClear,
  resultCount,
  className,
}: {
  filters: FilterConfig[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear?: () => void;
  resultCount?: number;
  className?: string;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeCount = Object.values(values).filter(Boolean).length;

  const controls = (
    <>
      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={values[filter.key] || undefined}
          onValueChange={(v) => onChange(filter.key, v)}
        >
          <SelectTrigger className="h-10 min-w-[160px] bg-card">
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {activeCount > 0 && onClear ? (
        <Button variant="ghost" size="sm" onClick={onClear} className="font-ui font-bold text-muted-foreground">
          <X size={14} /> Clear
        </Button>
      ) : null}
    </>
  );

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="hidden flex-wrap items-center gap-2.5 md:flex">{controls}</div>

      <Button variant="outline" className="font-ui font-bold md:hidden" onClick={() => setDrawerOpen(true)}>
        <SlidersHorizontal size={15} />
        Filters
        {activeCount > 0 ? (
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-white">
            {activeCount}
          </span>
        ) : null}
      </Button>

      {typeof resultCount === "number" ? (
        <span className="text-sm font-semibold text-muted-foreground">{resultCount} results</span>
      ) : null}

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="bottom" title="Filters">
        <div className="flex flex-col gap-3 pb-4">{controls}</div>
      </Drawer>
    </div>
  );
}
