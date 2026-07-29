import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface PublicPandit {
    _id: string;
    fullName: string;
    photo?: string;
    cities: string[];
    specializations: string[];
    languages: string[];
    rating: number;
    completedPoojas?: number;
}

export interface PublicPanditListResult {
    items: PublicPandit[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export function usePandits(params: { search?: string; city?: string; page?: number; limit?: number } = {}) {
    return useQuery<PublicPanditListResult, Error>({
        queryKey: ["public", "pandits", params],
        queryFn: async () => {
            const res = await apiClient.get<{ data: PublicPanditListResult }>("/pandits", { params });
            return res.data.data;
        },
    });
}
