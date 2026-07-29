import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface Customer {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  status: "active" | "blocked";
  adminNotes?: string;
  createdAt: string;
}

export interface CustomerListResult {
  items: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useCustomers(params: { search?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "customers", params],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: CustomerListResult }>("/customers", { params });
      return res.data.data;
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const res = await adminApiClient.post("/customers", input);
      return res.data.data as Customer;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "customers"] }),
  });
}
