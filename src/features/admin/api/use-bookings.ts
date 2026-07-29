import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface BookingPayment {
  amount: number;
  method: string;
  status: string;
  transactionRef?: string;
  notes?: string;
  recordedAt: string;
}

export interface BookingListItem {
  _id: string;
  bookingId: string;
  customerSnapshot: { name: string; mobile: string; email?: string };
  serviceType: string;
  pooja?: { _id: string; name: string; slug: string };
  festival?: { _id: string; name: string; slug: string };
  pandit?: { _id: string; fullName: string; mobile: string } | null;
  poojaDate: string;
  poojaTime?: string;
  status: string;
  paymentStatus: string;
  bookingChannel: "online" | "offline";
  bookingSource: string;
  createdAt: string;
}

export interface BookingListResult {
  items: BookingListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BookingDetail extends BookingListItem {
  address?: string;
  city?: string;
  landmark?: string;
  pincode?: string;
  gotra?: string;
  specialInstructions?: string;
  pricing: Record<string, number | string | undefined>;
  payments: BookingPayment[];
  selectedSamagri: { name: string; price: number }[];
  package?: { name?: string; price?: number; salePrice?: number };
  internalNotes: { note: string; addedAt: string; addedBy?: string }[];
  timeline: { status: string; note?: string; changedAt: string }[];
  referral?: { referredBy?: string; referralCode?: string; notes?: string };
  createdByAdmin?: string | null;
  muhuratSlot?: { muhurat: string; slotId: string } | null;
}

export function useBookings(params: { search?: string; status?: string; bookingChannel?: string; page?: number } = {}) {
  return useQuery({
    queryKey: ["admin", "bookings", params],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: BookingListResult }>("/bookings", { params });
      return res.data.data;
    },
  });
}

export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "booking", id],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: BookingDetail }>(`/bookings/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateOfflineBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const res = await adminApiClient.post("/bookings/offline", input);
      return res.data.data as BookingDetail;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: string; note?: string }) => {
      const res = await adminApiClient.patch(`/bookings/${id}/status`, { status, note });
      return res.data.data as BookingDetail;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "booking", variables.id] });
    },
  });
}

export function useUpdateBookingDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Record<string, unknown> }) => {
      const res = await adminApiClient.patch(`/bookings/${id}/details`, input);
      return res.data.data as BookingDetail;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "booking", variables.id] });
    },
  });
}

export function useAssignPandit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, panditId }: { id: string; panditId: string }) => {
      const res = await adminApiClient.patch(`/bookings/${id}/assign-pandit`, { panditId });
      return res.data.data as BookingDetail;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "booking", variables.id] });
    },
  });
}

export function useAddBookingPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Record<string, unknown> }) => {
      const res = await adminApiClient.post(`/bookings/${id}/payments`, input);
      return res.data.data as BookingDetail;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "booking", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
    },
  });
}

export function useAddBookingNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      const res = await adminApiClient.post(`/bookings/${id}/notes`, { note });
      return res.data.data as BookingDetail;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "booking", variables.id] });
    },
  });
}
