import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerApiClient } from "@/lib/customer-api-client";

export interface MyBooking {
  _id: string;
  bookingId: string;
  serviceType: string;
  pooja?: { _id: string; name: string; featuredImage?: string };
  festival?: { _id: string; name: string; featuredImage?: string };
  pandit?: { _id: string; fullName: string; mobile?: string; photo?: string; verificationStatus?: string } | null;
  package?: { name?: string; price?: number };
  poojaDate: string;
  poojaTime?: string;
  city?: string;
  address?: string;
  landmark?: string;
  pincode?: string;
  gotra?: string;
  specialInstructions?: string;
  status: string;
  paymentStatus: string;
  pricing: { packagePrice?: number; marketPrice?: number; samagriCharges?: number; finalAmount?: number; advanceAmount?: number };
  payments: { amount: number; method: string; status: string; recordedAt: string }[];
  selectedSamagri: { name: string; price: number }[];
  timeline: { status: string; note?: string; changedAt: string }[];
  rescheduleRequest?: { requestedDate: string; requestedTime?: string; reason?: string; status: string } | null;
  cancelRequest?: { reason: string; notes?: string; status: string } | null;
  bookingSource: string;
  createdAt: string;
}

export interface MyBookingListResult {
  items: MyBooking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useMyBookings(tab: string = "all", page = 1) {
  return useQuery({
    queryKey: ["account", "bookings", tab, page],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MyBookingListResult }>("/bookings", { params: { tab, page } });
      return res.data.data;
    },
  });
}

export function useMyBooking(id: string | undefined) {
  return useQuery({
    queryKey: ["account", "booking", id],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MyBooking }>(`/bookings/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useRequestReschedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: { requestedDate: string; requestedTime?: string; reason?: string } }) => {
      const res = await customerApiClient.post(`/bookings/${id}/reschedule-request`, input);
      return res.data.data as MyBooking;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["account", "booking", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["account", "bookings"] });
    },
  });
}

export function useRequestCancellation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: { reason: string; notes?: string } }) => {
      const res = await customerApiClient.post(`/bookings/${id}/cancel-request`, input);
      return res.data.data as MyBooking;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["account", "booking", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["account", "bookings"] });
    },
  });
}
