import { useQuery } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalCustomers: number;
  totalPandits: number;
  verifiedPandits: number;
  pendingApplications: number;
  PublishedPoojas: number;
  totalRevenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentBookings: Array<{
    _id: string;
    bookingId: string;
    customerSnapshot: { name: string; mobile: string };
    pooja?: { name: string };
    festival?: { name: string };
    status: string;
    poojaDate: string;
    paymentStatus: string;
    createdAt: string;
  }>;
  recentAuditLogs: Array<{
    _id: string;
    adminName: string;
    action: string;
    entityType: string;
    description: string;
    createdAt: string;
  }>;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: DashboardData }>("/dashboard/stats");
      return res.data.data;
    },
  });
}
