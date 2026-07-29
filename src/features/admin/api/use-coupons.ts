import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface Coupon {
  _id: string;
  code: string;
  type: "percentage" | "flat";
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  status: "active" | "inactive";
}

export function useCoupons() {
  return useQuery({
    queryKey: ["admin", "coupons"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: Coupon[] }>("/coupons");
      return res.data.data;
    },
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const res = await adminApiClient.post("/coupons", input);
      return res.data.data as Coupon;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Record<string, unknown> }) => {
      const res = await adminApiClient.patch(`/coupons/${id}`, input);
      return res.data.data as Coupon;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/coupons/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] }),
  });
}
