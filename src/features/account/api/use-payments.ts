import { useQuery } from "@tanstack/react-query";
import { customerApiClient } from "@/lib/customer-api-client";

export interface UnifiedPaymentEntry {
  id: string;
  date: string;
  type: "booking" | "order" | "consultation";
  referenceId: string;
  referenceLabel: string;
  amount: number;
  method: string;
  status: string;
}

export function useMyPayments() {
  return useQuery({
    queryKey: ["account", "payments"],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: UnifiedPaymentEntry[] }>("/payments");
      return res.data.data;
    },
  });
}
