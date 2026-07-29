import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface MediaItem {
  _id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface MediaListResult {
  items: MediaItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useMedia(page = 1) {
  return useQuery({
    queryKey: ["admin", "media", page],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: MediaListResult }>("/cms/media", { params: { page } });
      return res.data.data;
    },
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminApiClient.post("/cms/media", formData, {
        headers: { "Content-Type": undefined },
      });
      return res.data.data as MediaItem;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "media"] }),
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/cms/media/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "media"] }),
  });
}
