import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  category?: { _id: string; name: string; slug: string } | string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  author?: string;
  tags: string[];
  status: "draft" | "Published";
  PublishedAt?: string;
}

export interface BlogListResult {
  items: Blog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useBlogs(params: { search?: string; status?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "blogs", params],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: BlogListResult }>("/blogs", { params });
      return res.data.data;
    },
  });
}

export function useBlog(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "blog", id],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: Blog }>(`/blogs/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const res = await adminApiClient.post("/blogs", input);
      return res.data.data as Blog;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "blogs"] }),
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Record<string, unknown> }) => {
      const res = await adminApiClient.patch(`/blogs/${id}`, input);
      return res.data.data as Blog;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "blog", variables.id] });
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/blogs/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "blogs"] }),
  });
}
