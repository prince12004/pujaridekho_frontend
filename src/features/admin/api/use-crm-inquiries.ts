import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crmApiClient } from "@/lib/crm-api-client";

export interface CrmPujaEvent {
  id: string;
  label: string;
  date: string;
  time?: string | null;
  panditId?: string | null;
  panditName?: string | null;
  assignedSlot?: string | null;
}

export type CrmInquiryStatus = "inquiry" | "confirmed" | "notConverted";

export interface CrmInquiry {
  id: string;
  clientName: string;
  phone: string;
  pujaName: string;
  pujaDate: string | null;
  pujaTime: string | null;
  pujaEndDate: string | null;
  pujaEvents: CrmPujaEvent[];
  status: CrmInquiryStatus;
  packagePrice: number | null;
  samagriPrice: number | null;
  totalAmount: number;
  tokenAmount: number;
  tokenStatus: "pending" | "received";
  totalAmountStatus: "pending" | "received";
  transactionId: string | null;
  nextCallDate: string | null;
  pujariName: string | null;
  panditId: string | null;
  panditName: string | null;
  assignedSlot: string | null;
  address: string | null;
  notes: string | null;
  source: "website" | "whatsapp" | "instagram" | "facebook" | "other";
  websiteBookingId: string | null;
  assignedTo: string | null;
  createdAt: string;
  reviewed: boolean;
  samagriIncluded: boolean;
  version: number;
  updatedAt: string | null;
}

export interface CrmInquiriesListResult {
  data: CrmInquiry[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  nextCursor: string | null;
}

export interface CrmInquiriesParams {
  search?: string;
  status?: string;
  assignedTo?: string;
  page?: number;
  limit?: number;
}

export function useCrmInquiries(params: CrmInquiriesParams = {}) {
  return useQuery({
    queryKey: ["crm", "inquiries", params],
    queryFn: async () => {
      const res = await crmApiClient.get<{ data: CrmInquiriesListResult }>("/crm-inquiries", {
        params: { page: 1, limit: 20, ...params },
      });
      return res.data.data;
    },
  });
}

export function useCrmInquiry(id: string | undefined) {
  return useQuery({
    queryKey: ["crm", "inquiries", "detail", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await crmApiClient.get<{ data: CrmInquiry }>(`/crm-inquiries/${id}`);
      return res.data.data;
    },
  });
}

export function useUpdateCrmInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string } & Record<string, unknown>) => {
      const res = await crmApiClient.put<{ data: { updated: boolean; version: number; updatedAt: string } }>(
        `/crm-inquiries/${id}`,
        input,
      );
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "inquiries", "detail", variables.id] });
    },
  });
}

export function useDeleteCrmInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await crmApiClient.delete(`/crm-inquiries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "inquiries"] });
    },
  });
}
