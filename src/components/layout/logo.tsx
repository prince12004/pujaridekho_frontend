import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function LogoMark({ light = false, className }: { light?: boolean; className?: string }) {
  const img = (
    <Image
      src="/brand/logo.png"
      alt="PujariDekho — Aapki Har Puja Ke Pujari"
      width={586}
      height={129}
      className={cn("h-10 w-auto shrink-0", className)}
      priority
    />
  );

  // The logo's tagline is dark text with no background of its own — on a dark
  // surface (footer, mobile menu) it needs a light backing card to stay legible.
  if (!light) return img;
  return <span className="inline-flex items-center rounded-lg bg-white px-2 py-1.5">{img}</span>;
}

export function Logo({ light = false, onClick }: { light?: boolean; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center" aria-label="PujariDekho home">
      <LogoMark light={light} />
    </Link>
  );
}
