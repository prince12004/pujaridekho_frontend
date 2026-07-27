import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function MediaCard({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = cn(
    "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return <div className={classes}>{children}</div>;
}

export function MediaCardImage({
  src,
  alt,
  height = "h-44",
  overlay = false,
  badge,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  src: string;
  alt: string;
  height?: string;
  overlay?: boolean;
  badge?: React.ReactNode;
  sizes?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", height)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={sizes}
      />
      {overlay ? <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-deep/55 via-transparent" /> : null}
      {badge ? <div className="absolute left-3 top-3">{badge}</div> : null}
    </div>
  );
}

export function MediaCardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex flex-1 flex-col gap-3 p-5", className)}>{children}</div>;
}

export function MediaCardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("mt-auto flex items-center justify-between border-t border-dashed border-border pt-3.5", className)}>
      {children}
    </div>
  );
}
