import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface PublicBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  author?: string;
  tags: string[];
  PublishedAt?: string;
  category?: { name: string; slug: string } | string;
}

export interface PublicBlogListResult {
  items: PublicBlog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useBlogs(params: { search?: string; category?: string; page?: number; limit?: number } = {}) {
  return useQuery<PublicBlogListResult, Error>({
    queryKey: ["public", "blogs", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PublicBlogListResult }>("/blogs", { params });
      return res.data.data;
    },
  });
}

export interface PublicBlogDetail {
  blog: PublicBlog;
  previous: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
}

export function useBlog(slug?: string) {
  return useQuery<PublicBlogDetail, Error>({
    queryKey: ["public", "blog", slug],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PublicBlogDetail }>(`/blogs/${slug}`);
      return res.data.data;
    },
    enabled: Boolean(slug),
  });
}

export interface PublicBlogCategory {
  _id: string;
  name: string;
  slug: string;
}

export function useBlogCategories() {
  return useQuery<PublicBlogCategory[], Error>({
    queryKey: ["public", "blog-categories"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PublicBlogCategory[] }>("/blogs/categories");
      return res.data.data;
    },
  });
}
