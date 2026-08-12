import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface Festival {
  _id: string;
  name: string;
  slug: string;
  dateLabel?: string;
  festivalDate?: string;
  shortDescription?: string;
  fullDescription?: string;
  featuredImage?: string;
  gallery?: string[];
  startingPrice: number;
  marketPrice?: number;
  status: "draft" | "published" | "archived";
  featured: boolean;
}

export interface FestivalListResult {
  items: Festival[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useFestivals(params: { search?: string; status?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "festivals", params],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: FestivalListResult }>("/festivals", { params });
      return res.data.data;
    },
  });
}

export function useFestival(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "festival", id],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: Festival }>(`/festivals/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateFestival() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const res = await adminApiClient.post("/festivals", input);
      return res.data.data as Festival;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "festivals"] }),
  });
}

export function useUpdateFestival() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Record<string, unknown> }) => {
      const res = await adminApiClient.patch(`/festivals/${id}`, input);
      return res.data.data as Festival;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "festivals"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "festival", variables.id] });
    },
  });
}

export function useDeleteFestival() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/festivals/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "festivals"] }),
  });
}
