import { useQuery } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface HomeLead {
  _id: string;
  name: string;
  mobile: string;
  city: string;
  address: string;
  pooja: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
  source?: "homepage" | "checkout";
  status?: "open" | "converted";
  poojaSlug?: string;
  serviceType?: string;
  packageName?: string;
  estimatedAmount?: number;
  bookingRef?: string;
  booking?: string | null;
}

export function useHomeLeads(params: { source?: "homepage" | "checkout"; status?: "open" | "converted" } = {}) {
  return useQuery({
    queryKey: ["admin", "leads", params],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: HomeLead[] }>("/leads", { params });
      return res.data.data;
    },
  });
}
