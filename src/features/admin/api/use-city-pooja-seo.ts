import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface CityPoojaSeo {
  _id: string;
  city: { _id: string; name: string; slug: string };
  pooja: { _id: string; name: string; slug: string };
  slug: string;
  title?: string;
  description?: string;
}

export function useCityPoojaSeoList() {
  return useQuery({
    queryKey: ["admin", "city-pooja-seo"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: CityPoojaSeo[] }>("/seo/city-pooja");
      return res.data.data;
    },
  });
}

export function useCreateCityPoojaSeo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { city: string; pooja: string; title?: string; description?: string }) => {
      const res = await adminApiClient.post("/seo/city-pooja", input);
      return res.data.data as CityPoojaSeo;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "city-pooja-seo"] }),
  });
}

export function useUpdateCityPoojaSeo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: { title?: string; description?: string } }) => {
      const res = await adminApiClient.patch(`/seo/city-pooja/${id}`, input);
      return res.data.data as CityPoojaSeo;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "city-pooja-seo"] }),
  });
}

export function useDeleteCityPoojaSeo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/seo/city-pooja/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "city-pooja-seo"] }),
  });
}
