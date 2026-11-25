import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerApiClient } from "@/lib/customer-api-client";

export interface MyOrder {
  _id: string;
  orderId: string;
  items: { product?: { _id: string; marketPrice?: number; images?: string[] }; name: string; price: number; quantity: number }[];
  shippingAddress: { name: string; phone: string; address: string; city: string; pincode: string };
  subtotal: number;
  discount: number;
  shippingCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  timeline: { status: string; note?: string; changedAt: string }[];
  cancelRequest?: { reason: string; notes?: string; status: "requested" | "approved" | "rejected"; resolutionNote?: string } | null;
  createdAt: string;
}

export interface MyOrderListResult {
  items: MyOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useMyOrders(tab: string = "all", page = 1) {
  return useQuery({
    queryKey: ["account", "orders", tab, page],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MyOrderListResult }>("/orders", { params: { tab, page } });
      return res.data.data;
    },
  });
}

export function useMyOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["account", "order", id],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MyOrder }>(`/orders/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

/** Orders that haven't shipped yet can be cancelled (after review by our team). */
export const ORDER_CANCELLABLE_STATUSES = ["pending", "confirmed", "processing"];

export function useRequestOrderCancellation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const res = await customerApiClient.post<{ data: MyOrder }>(`/orders/${id}/cancel-request`, { reason });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["account"] }),
  });
}
