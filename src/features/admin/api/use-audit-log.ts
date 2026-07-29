import { useQuery } from "@tanstack/react-query";
import { adminApiClient } from "@/lib/admin-api-client";

export interface AuditLogEntry {
  _id: string;
  adminName: string;
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
  createdAt: string;
}

export interface AuditLogResult {
  items: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useAuditLogs(params: { entityType?: string; action?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "audit-logs", params],
    queryFn: async () => {
      const res = await adminApiClient.get<{ data: AuditLogResult }>("/audit-logs", { params });
      return res.data.data;
    },
  });
}
