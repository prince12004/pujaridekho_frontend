"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HorizontalScroller({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-320)}
          aria-label="Scroll left"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-secondary transition-colors hover:bg-muted"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(320)}
          aria-label="Scroll right"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-secondary transition-colors hover:bg-muted"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div
        ref={scrollerRef}
        className={`flex gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className ?? ""}`}
        style={{ scrollSnapType: "x mandatory" }}
      >
        {children}
      </div>
    </div>
  );
}
