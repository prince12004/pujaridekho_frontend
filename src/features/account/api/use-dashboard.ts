import { useQuery } from "@tanstack/react-query";
import { customerApiClient } from "@/lib/customer-api-client";
import type { MyBooking } from "./use-bookings";
import type { MyOrder } from "./use-orders";
import type { MyConsultation } from "./use-consultations";
import type { MyNotification } from "./use-notifications";

export interface DashboardSummary {
  stats: { totalBookings: number; totalOrders: number; totalConsultations: number };
  nextBooking: MyBooking | null;
  recentActivity: {
    recentBooking: MyBooking | null;
    recentOrder: MyOrder | null;
    recentConsultation: MyConsultation | null;
    recentNotification: MyNotification | null;
  };
}

export function useMyDashboard() {
  return useQuery({
    queryKey: ["account", "dashboard"],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: DashboardSummary }>("/dashboard");
      return res.data.data;
    },
  });
}
