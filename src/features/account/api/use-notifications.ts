import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerApiClient } from "@/lib/customer-api-client";

export type CustomerNotificationType =
  | "booking"
  | "payment"
  | "pandit_assignment"
  | "booking_reminder"
  | "order"
  | "consultation"
  | "offer"
  | "system";

export interface MyNotification {
  _id: string;
  type: CustomerNotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface MyNotificationListResult {
  items: MyNotification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

export function useMyNotifications(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["account", "notifications", page, limit],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MyNotificationListResult }>("/notifications", { params: { page, limit } });
      return res.data.data;
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await customerApiClient.patch(`/notifications/${id}/read`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await customerApiClient.patch("/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "notifications"] });
    },
  });
}
