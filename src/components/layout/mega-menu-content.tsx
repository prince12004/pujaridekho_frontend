import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { images } from "@/lib/images";

interface MegaMenuColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export function MegaMenuContent({
  columns,
  promo,
}: {
  columns: MegaMenuColumn[];
  promo: { title: string; description: string; href: string; image: keyof typeof images };
}) {
  return (
    <div className="grid w-[640px] grid-cols-[1fr_1fr_220px] gap-6 p-6">
      {columns.map((col) => (
        <div key={col.heading} className="flex flex-col gap-1">
          <span className="font-ui mb-1 text-xs font-bold uppercase tracking-wider text-primary">
            {col.heading}
          </span>
          {col.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-1.5 text-sm text-foreground/85 transition-colors hover:bg-muted hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ))}

      <Link
        href={promo.href}
        className="group relative flex flex-col justify-end overflow-hidden rounded-2xl p-4 text-white"
      >
        <Image
          src={images[promo.image]}
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="220px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-deep/90 via-brand-purple-deep/30 to-transparent" />
        <span className="relative font-heading text-base font-bold">{promo.title}</span>
        <span className="relative mt-1 text-xs text-white/85">{promo.description}</span>
        <span className="relative mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-gold-soft">
          Explore <ArrowRight size={12} />
        </span>
      </Link>
    </div>
  );
}
