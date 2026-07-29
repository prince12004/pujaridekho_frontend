import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface Consultation {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  topic?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  fee: number;
  paymentStatus: "unpaid" | "paid";
  status: "new" | "contacted" | "scheduled" | "completed" | "cancelled";
  pandit?: { _id: string; fullName: string; mobile: string } | null;
  adminNotes?: string;
  createdAt: string;
}

export function useConsultations(status?: string) {
  return useQuery({
    queryKey: ["admin", "consultations", status],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: Consultation[] }>("/consultations", {
        params: status ? { status } : undefined,
      });
      return res.data.data;
    },
  });
}

export function useUpdateConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Record<string, unknown> }) => {
      const res = await adminApiClient.patch(`/consultations/${id}`, input);
      return res.data.data as Consultation;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "consultations"] }),
  });
}
