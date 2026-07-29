import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface PublicFestival {
  _id: string;
  name: string;
  slug: string;
  dateLabel?: string;
  festivalDate?: string;
  shortDescription?: string;
  featuredImage?: string;
  startingPrice: number;
  marketPrice?: number;
}

export interface PublicFestivalListResult {
  items: PublicFestival[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useFestivals(params: { search?: string; page?: number; limit?: number } = {}) {
  return useQuery<PublicFestivalListResult, Error>({
    queryKey: ["public", "festivals", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PublicFestivalListResult }>("/festivals", { params });
      return res.data.data;
    },
  });
}
