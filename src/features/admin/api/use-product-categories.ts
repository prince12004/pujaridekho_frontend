import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  status: "draft" | "published";
  sortOrder: number;
}

export function useProductCategories() {
  return useQuery({
    queryKey: ["admin", "product-categories"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: ProductCategory[] }>("/product-categories");
      return res.data.data;
    },
  });
}

export function useCreateProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<ProductCategory>) => {
      const res = await adminApiClient.post("/product-categories", input);
      return res.data.data as ProductCategory;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "product-categories"] }),
  });
}

export function useUpdateProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ProductCategory> }) => {
      const res = await adminApiClient.patch(`/product-categories/${id}`, input);
      return res.data.data as ProductCategory;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "product-categories"] }),
  });
}

export function useDeleteProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/product-categories/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "product-categories"] }),
  });
}
