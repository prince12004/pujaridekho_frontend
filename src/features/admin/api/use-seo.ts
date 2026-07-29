import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface SeoSetting {
  _id: string;
  pagePath: string;
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

export function useSeoSettings() {
  return useQuery({
    queryKey: ["admin", "seo"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: SeoSetting[] }>("/seo");
      return res.data.data;
    },
  });
}

export function useCreateSeoSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<SeoSetting>) => {
      const res = await adminApiClient.post("/seo", input);
      return res.data.data as SeoSetting;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "seo"] }),
  });
}

export function useUpdateSeoSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<SeoSetting> }) => {
      const res = await adminApiClient.patch(`/seo/${id}`, input);
      return res.data.data as SeoSetting;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "seo"] }),
  });
}

export function useDeleteSeoSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/seo/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "seo"] }),
  });
}
