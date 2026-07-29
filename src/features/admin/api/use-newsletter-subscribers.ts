import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  status: "active" | "unsubscribed";
  createdAt: string;
}

export function useNewsletterSubscribers() {
  return useQuery({
    queryKey: ["admin", "newsletter-subscribers"],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: NewsletterSubscriber[] }>("/newsletter-subscribers");
      return res.data.data;
    },
  });
}

export function useDeleteNewsletterSubscriber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/newsletter-subscribers/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "newsletter-subscribers"] }),
  });
}
