"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
}

export function TableOfContents({
  items,
  className,
  title = "On This Page",
}: {
  items: TocItem[];
  className?: string;
  title?: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className={cn("flex flex-col gap-1", className)} aria-label={title}>
      <span className="font-ui mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</span>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            "rounded-lg border-l-2 py-1.5 pl-3.5 text-sm transition-colors",
            activeId === item.id
              ? "border-primary font-bold text-primary"
              : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
