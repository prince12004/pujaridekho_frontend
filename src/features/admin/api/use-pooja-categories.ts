import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface PoojaCategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  status: "draft" | "published";
  sortOrder: number;
}

export function usePoojaCategories() {
  return useQuery({
    queryKey: ["admin", "pooja-categories"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: PoojaCategory[] }>("/pooja-categories");
      return res.data.data;
    },
  });
}

export function useCreatePoojaCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<PoojaCategory>) => {
      const res = await adminApiClient.post("/pooja-categories", input);
      return res.data.data as PoojaCategory;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pooja-categories"] }),
  });
}

export function useUpdatePoojaCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<PoojaCategory> }) => {
      const res = await adminApiClient.patch(`/pooja-categories/${id}`, input);
      return res.data.data as PoojaCategory;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pooja-categories"] }),
  });
}

export function useDeletePoojaCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/pooja-categories/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pooja-categories"] }),
  });
}
