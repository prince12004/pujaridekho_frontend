import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface Review {
  _id: string;
  entityType: "pooja" | "pandit" | "product";
  entityId: string;
  customerName: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export function useReviews(status?: string) {
  return useQuery({
    queryKey: ["admin", "reviews", status],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: Review[] }>("/reviews", { params: status ? { status } : undefined });
      return res.data.data;
    },
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await adminApiClient.patch(`/reviews/${id}`, { status });
      return res.data.data as Review;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] }),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/reviews/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] }),
  });
}
