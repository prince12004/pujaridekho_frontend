import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface CmsPage {
  _id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  status: "draft" | "Published";
}

export function usePages() {
  return useQuery({
    queryKey: ["admin", "pages"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: CmsPage[] }>("/cms/pages");
      return res.data.data;
    },
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<CmsPage>) => {
      const res = await adminApiClient.post("/cms/pages", input);
      return res.data.data as CmsPage;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pages"] }),
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CmsPage> }) => {
      const res = await adminApiClient.patch(`/cms/pages/${id}`, input);
      return res.data.data as CmsPage;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pages"] }),
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/cms/pages/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pages"] }),
  });
}
