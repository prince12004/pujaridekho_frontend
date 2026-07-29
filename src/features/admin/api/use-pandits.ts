import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface Pandit {
  _id: string;
  photo?: string;
  fullName: string;
  mobile: string;
  email?: string;
  cities: string[];
  specializations: string[];
  experienceYears: number;
  verificationStatus: string;
  accountStatus: "active" | "inactive";
  featured: boolean;
  rating: number;
  completedPoojas: number;
}

export interface PanditListResult {
  items: Pandit[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const PANDIT_VERIFICATION_STATUSES = [
  "application_pending",
  "documents_pending",
  "under_verification",
  "verified",
  "rejected",
  "suspended",
  "inactive",
] as const;

export function usePandits(params: { search?: string; verificationStatus?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "pandits", params],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: PanditListResult }>("/pandits", { params });
      return res.data.data;
    },
  });
}

export function usePandit(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "pandit", id],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: Pandit }>(`/pandits/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreatePandit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const res = await adminApiClient.post("/pandits", input);
      return res.data.data as Pandit;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pandits"] }),
  });
}

export function useUpdatePandit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Record<string, unknown> }) => {
      const res = await adminApiClient.patch(`/pandits/${id}`, input);
      return res.data.data as Pandit;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pandits"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "pandit", variables.id] });
    },
  });
}

export function useDeletePandit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/pandits/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pandits"] }),
  });
}

export interface PanditApplication {
  _id: string;
  fullName: string;
  mobile: string;
  email?: string;
  city?: string;
  experience?: string;
  specialization?: string;
  message?: string;
  status: "pending" | "under_review" | "more_info_requested" | "approved" | "rejected";
  adminNotes?: string;
  convertedPandit?: string | null;
  createdAt: string;
}

export function usePanditApplications(status?: string) {
  return useQuery({
    queryKey: ["admin", "pandit-applications", status],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: PanditApplication[] }>("/pandits/applications", {
        params: status ? { status } : undefined,
      });
      return res.data.data;
    },
  });
}

export function useUpdatePanditApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Record<string, unknown> }) => {
      const res = await adminApiClient.patch(`/pandits/applications/${id}`, input);
      return res.data.data as PanditApplication;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pandit-applications"] }),
  });
}

export function useConvertPanditApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await adminApiClient.post(`/pandits/applications/${id}/convert`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pandit-applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "pandits"] });
    },
  });
}
