import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface SiteSettings {
  _id: string;
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
  statsOffsets: { verifiedPandits: number; poojas: number; families: number };
  app: {
    android: AppPlatformSettings;
    ios: AppPlatformSettings;
    updateMessage: string;
  };
}

export interface AppPlatformSettings {
  minVersion: string;
  latestVersion: string;
  storeUrl: string;
}

export function useSettings() {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: SiteSettings }>("/settings");
      return res.data.data;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<SiteSettings>) => {
      const res = await adminApiClient.patch("/settings", input);
      return res.data.data as SiteSettings;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });
}
