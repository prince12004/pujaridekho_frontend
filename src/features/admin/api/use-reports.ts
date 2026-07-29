import { useQuery } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface ReportsOverview {
  bookingRevenueByMonth: { _id: string; total: number }[];
  orderRevenueByMonth: { _id: string; total: number }[];
  bookingsByStatus: { _id: string; count: number }[];
  ordersByStatus: { _id: string; count: number }[];
  topPoojas: { name: string; count: number }[];
  topProducts: { name: string; count: number }[];
  newCustomersByMonth: { _id: string; count: number }[];
  totals: { totalBookings: number; totalOrders: number; totalCustomers: number };
}

export function useReportsOverview() {
  return useQuery({
    queryKey: ["admin", "reports", "overview"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: ReportsOverview }>("/reports/overview");
      return res.data.data;
    },
  });
}
