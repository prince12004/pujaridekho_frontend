import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PrevNextItem {
  label: string;
  title: string;
  href: string;
}

export function PrevNextNav({
  prev,
  next,
  className,
}: {
  prev?: PrevNextItem;
  next?: PrevNextItem;
  className?: string;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Blog navigation"
      className={cn("grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2", className)}
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
        >
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" /> {prev.label}
          </span>
          <span className="font-heading text-base leading-snug">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col items-end gap-1.5 rounded-2xl border border-border bg-card p-5 text-right transition-colors hover:border-primary/40"
        >
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {next.label} <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </span>
          <span className="font-heading text-base leading-snug">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
