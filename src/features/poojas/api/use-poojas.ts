import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface PublicPooja {
    _id: string;
    name: string;
    slug: string;
    shortDescription?: string;
    featuredImage?: string;
    startingPrice: number;
    marketPrice?: number;
    category?: { name: string; slug: string } | string;
}

export interface PublicPoojaListResult {
    items: PublicPooja[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export function usePoojas(params: { search?: string; category?: string; page?: number; limit?: number } = {}) {
    return useQuery<PublicPoojaListResult, Error>({
        queryKey: ["public", "poojas", params],
        queryFn: async () => {
            const res = await apiClient.get<{ data: PublicPoojaListResult }>("/poojas", { params });
            return res.data.data;
        },
    });
}

export function usePooja(slug?: string) {
    return useQuery<PublicPooja, Error>({
        queryKey: ["public", "pooja", slug],
        queryFn: async () => {
            const res = await apiClient.get<{ data: PublicPooja }>(`/poojas/${slug}`);
            return res.data.data;
        },
        enabled: Boolean(slug),
    });
}
