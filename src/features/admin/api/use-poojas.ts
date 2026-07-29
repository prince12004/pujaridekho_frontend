import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface SamagriItem {
  name: string;
  description?: string;
  price: number;
  includedByDefault?: boolean;
}

export interface PoojaPackage {
  name: string;
  price: number;
  salePrice?: number;
  duration?: string;
  panditCount?: number;
  samagriIncluded?: boolean;
  dakshinaIncluded?: boolean;
  features?: string[];
  description?: string;
  recommended?: boolean;
}

export interface Pooja {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  featuredImage?: string;
  gallery?: string[];
  category?: { _id: string; name: string; slug: string } | string;
  startingPrice: number;
  marketPrice?: number;
  samagri: SamagriItem[];
  packages: PoojaPackage[];
  status: "draft" | "published" | "archived";
  featured: boolean;
  popular: boolean;
  createdAt: string;
}

export interface PoojaListResult {
  items: Pooja[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function usePoojas(params: { search?: string; status?: string; page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["admin", "poojas", params],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: PoojaListResult }>("/poojas", { params });
      return res.data.data;
    },
  });
}

export function usePooja(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "pooja", id],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: Pooja }>(`/poojas/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreatePooja() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const res = await adminApiClient.post("/poojas", input);
      return res.data.data as Pooja;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "poojas"] }),
  });
}

export function useUpdatePooja() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Record<string, unknown> }) => {
      const res = await adminApiClient.patch(`/poojas/${id}`, input);
      return res.data.data as Pooja;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "poojas"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "pooja", variables.id] });
    },
  });
}

export function useDeletePooja() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/poojas/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "poojas"] }),
  });
}
