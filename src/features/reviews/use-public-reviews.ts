import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export type ReviewEntityType = "pooja" | "pandit" | "product" | "festival";

export interface PublicReview {
  _id: string;
  entityType: ReviewEntityType;
  entityId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function usePublicReviews(entityType: ReviewEntityType, entityId: string | undefined) {
  return useQuery({
    queryKey: ["public-reviews", entityType, entityId],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PublicReview[] }>("/reviews", { params: { entityType, entityId } });
      return res.data.data;
    },
    enabled: !!entityId,
  });
}

export interface SubmitPublicReviewInput {
  entityType: ReviewEntityType;
  entityId: string;
  customerName: string;
  rating: number;
  comment: string;
}

export function useSubmitPublicReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SubmitPublicReviewInput) => {
      const res = await apiClient.post("/reviews", input);
      return res.data.data as PublicReview;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["public-reviews", variables.entityType, variables.entityId] });
    },
  });
}
