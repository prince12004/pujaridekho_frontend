import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: "draft" | "published";
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ["admin", "blog-categories"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: BlogCategory[] }>("/blog-categories");
      return res.data.data;
    },
  });
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<BlogCategory>) => {
      const res = await adminApiClient.post("/blog-categories", input);
      return res.data.data as BlogCategory;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "blog-categories"] }),
  });
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<BlogCategory> }) => {
      const res = await adminApiClient.patch(`/blog-categories/${id}`, input);
      return res.data.data as BlogCategory;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "blog-categories"] }),
  });
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/blog-categories/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "blog-categories"] }),
  });
}
