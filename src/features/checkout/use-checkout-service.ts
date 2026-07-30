import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface CheckoutService {
  _id: string;
  slug: string;
  name: string;
  startingPrice: number;
  marketPrice?: number;
  duration?: string;
  location?: string;
}

export function useCheckoutService(type: "pooja" | "festival", slug: string | undefined) {
  return useQuery({
    queryKey: ["checkout-service", type, slug],
    queryFn: async () => {
      const res = await apiClient.get<{ data: CheckoutService }>(`/${type === "festival" ? "festivals" : "poojas"}/${slug}`);
      return res.data.data;
    },
    enabled: !!slug,
  });
}
