"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Flame, Package, ShieldCheck, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingWidget, type BookingOption } from "@/components/shared/booking-widget";
import { images } from "@/lib/images";
import { usePublicCities } from "@/features/cities/api/use-cities";
import { usePoojas } from "@/features/poojas/api/use-poojas";
import { plus } from "@/features/home/stats-format";
import type { SiteStats } from "@/features/home/site-stats";

const heroPoints = [
  "Verified & background-checked pandits",
  "Complete puja samagri included",
  "Fixed, transparent pricing — no surprises",
  "Same-day booking across Delhi NCR",
];

function buildHeroBadges(stats: SiteStats | null) {
  return [
    stats && stats.verifiedPandits > 0 ? { icon: ShieldCheck, label: `${plus(stats.verifiedPandits)} Verified Pandits`, iconClassName: "text-primary" } : null,
    stats?.rating ? { icon: Star, label: `${stats.rating.value.toFixed(1)} Rated by Families`, iconClassName: "fill-accent text-accent" } : null,
    { icon: Package, label: "Top Rated Puja Samagiri", iconClassName: "text-primary" },
    // Only once it is a number worth showing.
    stats && stats.poojasLast30Days >= 10 ? { icon: CheckCircle2, label: `${plus(stats.poojasLast30Days)} Puja Completed Last Month`, iconClassName: "text-accent" } : null,
  ].filter((b): b is { icon: typeof ShieldCheck; label: string; iconClassName: string } => !!b);
}

export function HeroSection({ stats }: { stats: SiteStats | null }) {
  const heroBadges = buildHeroBadges(stats);
  const { data: poojasData } = usePoojas({ limit: 100 });
  const poojaOptions: BookingOption[] =
    poojasData?.items.map((p) => ({ label: p.name, value: p.slug })) ?? [];
  const { data: citiesData } = usePublicCities();
  const cityNames = citiesData?.map((c) => c.name) ?? [];

  return (
    <section id="book" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={images.heroTemple}
          alt="Ancient Indian temple silhouetted at golden hour"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-deep via-brand-purple-deep/80 to-brand-purple-deep/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-deep via-transparent to-brand-purple-deep/40" />
      </div>

      <div className="home_ui relative mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <div className="sliderss overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)]">
            <div className="animate-hero-badge-marquee flex w-max gap-2.5">
              {[...heroBadges, ...heroBadges].map((badge, i) => (
                <span
                  key={i}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-secondary shadow-sm"
                >
                  <badge.icon size={15} className={`shrink-0 ${badge.iconClassName}`} />
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          <h1 className="mt-6 text-balance">
            <span className="lang-hi block text-3xl text-primary sm:text-4xl">पूजा हो तो,</span>
            <span className="block font-heading text-5xl font-bold text-brand-cream sm:text-6xl">
              Pujari Dekho
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-relaxed text-brand-cream/85">
            Book verified pandits and complete pooja samagri for every ritual — from Griha Pravesh
            to Satyanarayan Katha — with fixed pricing and a priest at your door, the same day.
          </p>

          <ul className="mt-7 flex flex-col gap-2.5">
            {heroPoints.map((point) => (
              <li key={point} className="flex items-center gap-2.5 text-sm font-semibold text-brand-cream">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Flame size={12} />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <Button size="lg" className="font-ui font-bold" asChild>
              <Link href="/poojas">
                <Flame /> Book Puja
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-ui border-brand-gold-soft/50 bg-transparent font-bold text-brand-gold-soft"
              asChild
            >
              <Link href="/pandits">
                <User /> Book Pandit Ji
              </Link>
            </Button>
          </div>

          <div className="mt-7 flex items-center gap-3 text-sm font-semibold text-brand-cream/80">
            <div className="flex">
              {["RK", "SM", "AV"].map((initials, i) => (
                <span
                  key={initials}
                  style={{ marginLeft: i === 0 ? 0 : -10 }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-purple-deep bg-gradient-to-br from-primary to-accent text-[11px] font-bold text-white"
                >
                  {initials}
                </span>
              ))}
            </div>
            {stats && stats.familiesServed > 0 ? `Trusted by ${plus(stats.familiesServed)} families across Delhi NCR` : "Trusted by families across Delhi NCR"}
          </div>
        </div>

        <div>
          <BookingWidget cities={cityNames} poojas={poojaOptions} />
        </div>
      </div>
    </section>
  );
}
