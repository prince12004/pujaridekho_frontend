import { useQuery } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface AdminSearchResult {
  type: string;
  label: string;
  href: string;
}

export function useAdminSearch(query: string) {
  return useQuery({
    queryKey: ["admin", "search", query],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: AdminSearchResult[] }>("/search", { params: { q: query } });
      return res.data.data;
    },
    enabled: query.trim().length >= 2,
  });
}
