import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface PushCampaign {
  _id: string;
  audience: { type: "all" | "city" | "customer"; city?: string; label?: string };
  title: string;
  message: string;
  link?: string;
  imageUrl?: string;
  saveInApp: boolean;
  customerCount: number;
  sentCount: number;
  failedCount: number;
  pushConfigured: boolean;
  sentByName?: string;
  createdAt: string;
}

export interface PushCampaignInput {
  audience: { type: "all" | "city" | "customer"; city?: string; customerId?: string };
  title: string;
  message: string;
  link?: string;
  imageUrl?: string;
  saveInApp: boolean;
}

export function usePushCampaigns(page = 1) {
  return useQuery({
    queryKey: ["admin", "push", page],
    queryFn: async () =>
      (
        await adminApiClient.get<{
          data: { items: PushCampaign[]; total: number; totalPages: number; pushConfigured: boolean };
        }>("/push", { params: { page } })
      ).data.data,
  });
}

export function useSendPush() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PushCampaignInput) => {
      const res = await adminApiClient.post("/push", input);
      return { campaign: res.data.data as PushCampaign, message: res.data.message as string };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "push"] }),
  });
}

export function usePushCustomerSearch(q: string) {
  return useQuery({
    queryKey: ["admin", "push", "customers", q],
    enabled: q.trim().length >= 3,
    queryFn: async () =>
      (await adminApiClient.get<{ data: { _id: string; name: string; mobile: string; devices: number }[] }>("/push/customers", { params: { q } })).data
        .data,
  });
}
