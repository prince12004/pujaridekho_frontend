import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface City {
  _id: string;
  name: string;
  slug: string;
  state?: string;
  isServiceable: boolean;
  status: "draft" | "published";
}

export function useCities() {
  return useQuery({
    queryKey: ["admin", "cities"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: City[] }>("/cities");
      return res.data.data;
    },
  });
}

export function useCreateCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<City>) => {
      const res = await adminApiClient.post("/cities", input);
      return res.data.data as City;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "cities"] }),
  });
}

export function useUpdateCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<City> }) => {
      const res = await adminApiClient.patch(`/cities/${id}`, input);
      return res.data.data as City;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "cities"] }),
  });
}

export function useDeleteCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/cities/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "cities"] }),
  });
}
