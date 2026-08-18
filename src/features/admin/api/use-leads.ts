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
}

export function useHomeLeads() {
  return useQuery({
    queryKey: ["admin", "leads"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: HomeLead[] }>("/leads");
      return res.data.data;
    },
  });
}
