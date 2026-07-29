import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerApiClient } from "@/lib/customer-api-client";

export interface MyAddress {
  _id: string;
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state?: string;
  pincode: string;
  type?: "home" | "office" | "other";
  isDefault?: boolean;
  usedInUpcomingBooking?: boolean;
}

export interface AddressInput {
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state?: string;
  pincode: string;
  type?: "home" | "office" | "other";
  isDefault?: boolean;
}

export function useMyAddresses() {
  return useQuery({
    queryKey: ["account", "addresses"],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MyAddress[] }>("/addresses");
      return res.data.data;
    },
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddressInput) => {
      const res = await customerApiClient.post("/addresses", input);
      return res.data.data as MyAddress[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "addresses"] });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<AddressInput> }) => {
      const res = await customerApiClient.patch(`/addresses/${id}`, input);
      return res.data.data as MyAddress[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "addresses"] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await customerApiClient.delete(`/addresses/${id}`);
      return res.data.data as MyAddress[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "addresses"] });
    },
  });
}
