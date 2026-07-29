import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerApiClient } from "@/lib/customer-api-client";

export type SupportCategory = "booking" | "pandit" | "payment" | "refund" | "order" | "consultation" | "account" | "other";
export type SupportStatus = "open" | "in_progress" | "waiting_for_customer" | "resolved" | "closed";

export interface SupportMessage {
  sender: "customer" | "admin";
  message: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface MySupportTicket {
  _id: string;
  ticketNumber: string;
  category: SupportCategory;
  relatedType?: "booking" | "order" | "consultation";
  relatedId?: string;
  subject: string;
  attachmentUrl?: string;
  status: SupportStatus;
  messages: SupportMessage[];
  createdAt: string;
}

export interface CreateTicketInput {
  category: SupportCategory;
  relatedType?: "booking" | "order" | "consultation";
  relatedId?: string;
  subject: string;
  message: string;
  attachmentUrl?: string;
}

export function useMyTickets() {
  return useQuery({
    queryKey: ["account", "support-tickets"],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MySupportTicket[] }>("/support");
      return res.data.data;
    },
  });
}

export function useMyTicket(id: string | undefined) {
  return useQuery({
    queryKey: ["account", "support-ticket", id],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: MySupportTicket }>(`/support/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTicketInput) => {
      const res = await customerApiClient.post("/support", input);
      return res.data.data as MySupportTicket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "support-tickets"] });
    },
  });
}

export function useReplyToTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, message, attachmentUrl }: { id: string; message: string; attachmentUrl?: string }) => {
      const res = await customerApiClient.post(`/support/${id}/messages`, { message, attachmentUrl });
      return res.data.data as MySupportTicket;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["account", "support-ticket", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["account", "support-tickets"] });
    },
  });
}
