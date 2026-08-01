import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerApiClient } from "@/lib/customer-api-client";

export interface MyReview {
  _id: string;
  entityType: "pooja" | "pandit" | "product" | "consultation";
  entityId: string;
  booking?: string;
  order?: string;
  rating: number;
  comment: string;
  photos: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface SubmitReviewInput {
  entityType: "pooja" | "pandit" | "product" | "consultation";
  entityId?: string;
  bookingId?: string;
  orderId?: string;
  consultationId?: string;
  rating: number;
  comment: string;
  photos?: string[];
}

export function useMyReviews(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["account", "reviews"],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MyReview[] }>("/reviews");
      return res.data.data;
    },
    enabled: options?.enabled ?? true,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SubmitReviewInput) => {
      const res = await customerApiClient.post("/reviews", input);
      return res.data.data as MyReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "reviews"] });
    },
  });
}
