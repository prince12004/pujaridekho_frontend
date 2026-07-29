import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerApiClient } from "@/lib/customer-api-client";

export interface MyConsultation {
  _id: string;
  type: string;
  topic?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  duration?: string;
  fee: number;
  amountPaid: number;
  paymentStatus: string;
  status: string;
  pandit?: { _id: string; fullName: string; mobile?: string; photo?: string; specializations?: string[] } | null;
  rescheduleRequest?: { requestedDate?: string; requestedTime?: string; reason?: string; status: string } | null;
  cancelRequest?: { reason?: string; status: string } | null;
  timeline: { status: string; note?: string; changedAt: string }[];
  createdAt: string;
}

export interface MyConsultationListResult {
  items: MyConsultation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useMyConsultations(tab: string = "all", page = 1) {
  return useQuery({
    queryKey: ["account", "consultations", tab, page],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MyConsultationListResult }>("/consultations", { params: { tab, page } });
      return res.data.data;
    },
  });
}

export function useMyConsultation(id: string | undefined) {
  return useQuery({
    queryKey: ["account", "consultation", id],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MyConsultation }>(`/consultations/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useRequestConsultationReschedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: { requestedDate?: string; requestedTime?: string; reason?: string } }) => {
      const res = await customerApiClient.post(`/consultations/${id}/reschedule-request`, input);
      return res.data.data;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["account", "consultation", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["account", "consultations"] });
    },
  });
}

export function useRequestConsultationCancellation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: { reason: string } }) => {
      const res = await customerApiClient.post(`/consultations/${id}/cancel-request`, input);
      return res.data.data;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["account", "consultation", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["account", "consultations"] });
    },
  });
}
