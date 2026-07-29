import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface HomepageBanner {
  _id: string;
  active: boolean;
  text: string;
  ctaLabel: string;
  ctaHref: string;
}

export function useHomepageBanner() {
  return useQuery({
    queryKey: ["admin", "homepage-banner"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: HomepageBanner }>("/cms/homepage-banner");
      return res.data.data;
    },
  });
}

export function useUpdateHomepageBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<HomepageBanner>) => {
      const res = await adminApiClient.patch("/cms/homepage-banner", input);
      return res.data.data as HomepageBanner;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "homepage-banner"] }),
  });
}
