import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerApiClient } from "@/lib/customer-api-client";

export interface MyWishlistItem {
  itemType: "pooja" | "product" | "festival";
  itemId: string;
  addedAt: string;
  item: {
    _id: string;
    name: string;
    slug?: string;
    featuredImage?: string;
    images?: string[];
    startingPrice?: number;
    sellingPrice?: number;
    marketPrice?: number;
    status?: string;
  } | null;
}

export function useMyWishlist() {
  return useQuery({
    queryKey: ["account", "wishlist"],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MyWishlistItem[] }>("/wishlist");
      return res.data.data;
    },
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { itemType: "pooja" | "product" | "festival"; itemId: string }) => {
      const res = await customerApiClient.post("/wishlist", input);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "wishlist"] });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemType, itemId }: { itemType: string; itemId: string }) => {
      await customerApiClient.delete(`/wishlist/${itemType}/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "wishlist"] });
    },
  });
}
