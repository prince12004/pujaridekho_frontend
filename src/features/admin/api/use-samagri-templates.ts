import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

// Quick-select suggestions only — customerArrangeItems also accepts custom strings.
export const CUSTOMER_ARRANGE_WHITELIST = [
  "Fruits",
  "Mithai",
  "Fresh Flowers",
  "Flower Mala",
  "Paan",
  "Milk",
  "Curd",
  "Honey",
  "Ghee",
  "Coconut",
  "Panchamrit Ingredients",
] as const;

export interface IncludedItem {
  itemName: string;
  quantity?: string;
  unit?: string;
  estimatedPrice: number;
  mrp?: number;
  category?: string;
  arrangedBy?: string;
  required?: boolean;
}

export interface SamagriTemplate {
  _id: string;
  samagriTemplateName: string;
  pooja: { _id: string; name: string; slug: string } | string;
  includedItems: IncludedItem[];
  customerArrangeItems: string[];
  estimatedSamagriCost: number;
  estimatedSamagriMrp?: number;
  createdAt: string;
}

export interface SamagriTemplateListResult {
  items: SamagriTemplate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useSamagriTemplates(params: { search?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "samagri-templates", params],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: SamagriTemplateListResult }>("/samagri-templates", { params });
      return res.data.data;
    },
  });
}

export function useSamagriTemplate(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "samagri-template", id],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: SamagriTemplate }>(`/samagri-templates/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateSamagriTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const res = await adminApiClient.post("/samagri-templates", input);
      return res.data.data as SamagriTemplate;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "samagri-templates"] }),
  });
}

export function useUpdateSamagriTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Record<string, unknown> }) => {
      const res = await adminApiClient.patch(`/samagri-templates/${id}`, input);
      return res.data.data as SamagriTemplate;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "samagri-templates"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "samagri-template", variables.id] });
    },
  });
}

export function useDeleteSamagriTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/samagri-templates/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "samagri-templates"] }),
  });
}
