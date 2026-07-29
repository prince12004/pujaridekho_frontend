import { useQuery } from "@tanstack/react-query";
import { customerApiClient } from "@/lib/customer-api-client";

export interface InvoiceSummary {
  invoiceNumber: string;
  type: "booking" | "order" | "consultation";
  referenceId: string;
  referenceLabel: string;
  date: string;
  amount: number;
}

export interface InvoiceLineItem {
  name: string;
  quantity?: number;
  amount: number;
}

export interface InvoiceDetail {
  invoiceNumber: string;
  type: string;
  date: string;
  customerSnapshot: Record<string, unknown>;
  lineItems: InvoiceLineItem[];
  discount: number;
  total: number;
  paymentStatus: string;
}

export function useMyInvoices() {
  return useQuery({
    queryKey: ["account", "invoices"],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: InvoiceSummary[] }>("/invoices");
      return res.data.data;
    },
  });
}

export function useMyInvoiceDetail(type: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: ["account", "invoice", type, id],
    queryFn: async () => {
      const res = await customerApiClient.get<{ data: InvoiceDetail }>(`/invoices/${type}/${id}`);
      return res.data.data;
    },
    enabled: !!type && !!id,
  });
}

export async function downloadInvoicePdf(type: string, id: string, invoiceNumber: string) {
  const res = await customerApiClient.get(`/invoices/${type}/${id}/pdf`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
