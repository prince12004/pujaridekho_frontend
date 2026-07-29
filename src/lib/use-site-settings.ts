import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface SiteSettings {
  siteName: string;
  tagline: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  officeAddress: string;
  officeHours: string;
  socialLinks: { facebook?: string; instagram?: string; youtube?: string; twitter?: string };
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["public", "settings"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: SiteSettings }>("/settings");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
