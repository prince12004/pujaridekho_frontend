import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface PublicCity {
  _id: string;
  name: string;
  slug: string;
  panditCount: number;
}

/** The published + serviceable cities managed in the admin panel
 * (Content → Cities & Service Areas) — the single source of truth for every
 * city dropdown on the site, so adding a city there shows up everywhere. */
export function usePublicCities() {
  return useQuery<PublicCity[], Error>({
    queryKey: ["public", "cities"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PublicCity[] }>("/cities");
      return res.data.data;
    },
  });
}
