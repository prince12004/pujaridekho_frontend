import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <li className="flex items-center gap-1.5">
          <Link href="/" className="flex items-center text-muted-foreground transition-colors hover:text-primary">
            <Home size={14} />
          </Link>
          <ChevronRight size={13} className="text-muted-foreground/50" />
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="text-muted-foreground transition-colors hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={cn(isLast && "font-semibold text-foreground")}>
                  {item.label}
                </span>
              )}
              {!isLast ? <ChevronRight size={13} className="text-muted-foreground/50" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
