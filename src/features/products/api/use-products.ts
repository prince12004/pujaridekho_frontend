import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface PublicProduct {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  images: string[];
  sellingPrice: number;
  marketPrice?: number;
  inStock: boolean;
  category?: { name: string; slug: string } | string;
}

export interface PublicProductListResult {
  items: PublicProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useProducts(params: { search?: string; category?: string; page?: number; limit?: number } = {}) {
  return useQuery<PublicProductListResult, Error>({
    queryKey: ["public", "products", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PublicProductListResult }>("/products", { params });
      return res.data.data;
    },
  });
}

export function useProduct(slug?: string) {
  return useQuery<PublicProduct, Error>({
    queryKey: ["public", "product", slug],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PublicProduct }>(`/products/${slug}`);
      return res.data.data;
    },
    enabled: Boolean(slug),
  });
}

export interface PublicProductCategory {
  _id: string;
  name: string;
  slug: string;
}

export function useProductCategories() {
  return useQuery<PublicProductCategory[], Error>({
    queryKey: ["public", "product-categories"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PublicProductCategory[] }>("/products/categories");
      return res.data.data;
    },
  });
}
