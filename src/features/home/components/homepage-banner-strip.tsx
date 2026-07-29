"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface HomepageBannerData {
  active: boolean;
  text: string;
  ctaLabel?: string;
  ctaHref?: string;
}

function useHomepageBannerData() {
  return useQuery({
    queryKey: ["public", "homepage-banner"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: HomepageBannerData }>("/homepage-banner");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function HomepageBannerStrip() {
  const { data: banner } = useHomepageBannerData();

  if (!banner?.active || !banner.text) return null;

  return (
    <div className="relative z-10 bg-gradient-to-r from-primary to-accent">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-3 px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground">
        <span>{banner.text}</span>
        {banner.ctaLabel && banner.ctaHref && (
          <Link href={banner.ctaHref} className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs hover:bg-white/30">
            {banner.ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
