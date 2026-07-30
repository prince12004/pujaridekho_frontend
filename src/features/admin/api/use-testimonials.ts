import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface Testimonial {
  _id: string;
  name: string;
  location?: string;
  rating: number;
  quote: string;
  photo?: string;
  featured: boolean;
  status: "draft" | "Published";
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: Testimonial[] }>("/testimonials");
      return res.data.data;
    },
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<Testimonial>) => {
      const res = await adminApiClient.post("/testimonials", input);
      return res.data.data as Testimonial;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] }),
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<Testimonial> }) => {
      const res = await adminApiClient.patch(`/testimonials/${id}`, input);
      return res.data.data as Testimonial;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] }),
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/testimonials/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] }),
  });
}
