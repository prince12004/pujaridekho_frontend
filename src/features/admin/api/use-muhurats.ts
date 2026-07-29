import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface MuhuratTimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
  capacity?: number;
  bookedCount: number;
  isActive: boolean;
}

export interface Muhurat {
  _id: string;
  pooja: { _id: string; name: string; slug: string } | string;
  date: string;
  slots: MuhuratTimeSlot[];
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export interface MuhuratSlotInput {
  _id?: string;
  startTime: string;
  endTime: string;
  capacity?: number;
  isActive?: boolean;
}

export interface MuhuratInput {
  pooja: string;
  date: string;
  slots: MuhuratSlotInput[];
  notes?: string;
  isActive?: boolean;
}

export function useMuhurats(filters: { poojaId?: string; date?: string; search?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "muhurats", filters],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: Muhurat[] }>("/muhurats", { params: filters });
      return res.data.data;
    },
  });
}

export function useMuhurat(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "muhurat", id],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: Muhurat }>(`/muhurats/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateMuhurat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: MuhuratInput) => {
      const res = await adminApiClient.post("/muhurats", input);
      return res.data.data as Muhurat;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "muhurats"] }),
  });
}

export function useUpdateMuhurat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<MuhuratInput> }) => {
      const res = await adminApiClient.patch(`/muhurats/${id}`, input);
      return res.data.data as Muhurat;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "muhurats"] }),
  });
}

export function useDeleteMuhurat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/muhurats/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "muhurats"] }),
  });
}

export function useCopyMuhurat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, targetDates }: { id: string; targetDates: string[] }) => {
      const res = await adminApiClient.post(`/muhurats/${id}/copy`, { targetDates });
      return res.data.data as Muhurat[];
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "muhurats"] }),
  });
}
