import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category?: { _id: string; name: string; slug: string } | string;
  shortDescription?: string;
  description?: string;
  images: string[];
  sellingPrice: number;
  marketPrice?: number;
  stockQuantity: number;
  inStock: boolean;
  featured: boolean;
  status: "draft" | "published" | "archived";
}

export interface ProductListResult {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useProducts(params: { search?: string; status?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "products", params],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: ProductListResult }>("/products", { params });
      return res.data.data;
    },
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "product", id],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: Product }>(`/products/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const res = await adminApiClient.post("/products", input);
      return res.data.data as Product;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Record<string, unknown> }) => {
      const res = await adminApiClient.patch(`/products/${id}`, input);
      return res.data.data as Product;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "product", variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/products/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
}
