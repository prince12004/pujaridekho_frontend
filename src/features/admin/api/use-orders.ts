import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  orderId: string;
  customerSnapshot: { name: string; mobile: string; email?: string };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentStatus: "unpaid" | "paid" | "refunded";
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  createdAt: string;
}

export interface OrderListResult {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useOrders(params: { search?: string; status?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: OrderListResult }>("/orders", { params });
      return res.data.data;
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await adminApiClient.patch(`/orders/${id}/status`, { status });
      return res.data.data as Order;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/orders/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
}
