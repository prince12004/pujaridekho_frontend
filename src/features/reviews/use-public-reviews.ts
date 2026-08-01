import { useQuery } from "@tanstack/react-query";
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
