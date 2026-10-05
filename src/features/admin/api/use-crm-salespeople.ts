import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crmApiClient } from "@/lib/crm-api-client";

export interface CrmSalesPerson {
  id: string;
  name: string;
  phone: string;
  active: boolean;
  createdAt: string;
}

export function useCrmSalespeople() {
  return useQuery({
    queryKey: ["crm", "salespeople"],
    queryFn: async () => {
      const res = await crmApiClient.get<{ data: CrmSalesPerson[] }>("/crm-salespeople");
      return res.data.data;
    },
  });
}

export interface CreateCrmSalesPersonInput {
  name: string;
  phone: string;
  password: string;
}

export function useCreateCrmSalesperson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCrmSalesPersonInput) => {
      const res = await crmApiClient.post<{ data: CrmSalesPerson }>("/crm-salespeople", input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["crm", "salespeople"] }),
  });
}

export interface UpdateCrmSalesPersonInput {
  id: string;
  name?: string;
  phone?: string;
  active?: boolean;
  password?: string;
}

export function useUpdateCrmSalesperson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateCrmSalesPersonInput) => {
      const res = await crmApiClient.put<{ data: CrmSalesPerson }>(`/crm-salespeople/${id}`, input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["crm", "salespeople"] }),
  });
}
