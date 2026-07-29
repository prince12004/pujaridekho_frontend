import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface AdminNotification {
  _id: string;
  type: "booking" | "consultation" | "order" | "pandit_application";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationListResult {
  items: AdminNotification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

export function useNotifications(page = 1) {
  return useQuery({
    queryKey: ["admin", "notifications", page],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: NotificationListResult }>("/notifications", { params: { page } });
      return res.data.data;
    },
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await adminApiClient.patch(`/notifications/read-all`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] }),
  });
}
